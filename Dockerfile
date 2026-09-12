FROM oven/bun:1.3.14-alpine AS base
WORKDIR /app

FROM base AS dependencies
COPY package.json bun.lock ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY apps/worker/package.json apps/worker/package.json
COPY packages/simulation-core/package.json packages/simulation-core/package.json
RUN bun install --frozen-lockfile

FROM dependencies AS source
COPY . .
ARG VITE_API_BASE_URL=http://localhost:3000
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN DATABASE_URL=postgresql://eventscape:eventscape@db:5432/eventscape bunx prisma generate

FROM source AS web-build
RUN bun --cwd apps/web build

FROM base AS api
ENV NODE_ENV=production PORT=3000
COPY --from=source /app /app
EXPOSE 3000
CMD ["bun", "apps/api/src/index.ts"]

FROM base AS worker
ENV NODE_ENV=production ARTIFACT_DIR=/app/artifacts/canonical
COPY --from=source /app /app
CMD ["bun", "apps/worker/src/index.ts"]

FROM base AS db-init
COPY --from=source /app /app
CMD ["bun", "scripts/container-init.ts"]

FROM base AS web
WORKDIR /app/apps/web
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000
COPY --from=source /app /app
COPY --from=web-build /app/apps/web/build ./build
EXPOSE 3000
CMD ["bun", "build/index.js"]
