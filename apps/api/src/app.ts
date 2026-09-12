import { randomUUID } from "node:crypto";
import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import {
  canonicalResearchScenario,
  POLICY_IDS,
} from "@eventscape/simulation-core";
import { Elysia, t } from "elysia";
import { createDefaultStore, type ExperimentStore } from "./store";

const MAX_AGENT_STEPS = 2_000_000;

function estimateAgentSteps(
  agentCount: number,
  timesteps: number,
  seedCount: number,
): number {
  return agentCount * timesteps * seedCount * POLICY_IDS.length;
}

const scenarioSchema = t.Object(
  {
    id: t.String({ minLength: 1, maxLength: 80 }),
    name: t.String({ minLength: 1, maxLength: 120 }),
    agentCount: t.Integer({ minimum: 4, maximum: 500 }),
    eventCount: t.Integer({ minimum: 4, maximum: 100 }),
    timesteps: t.Integer({ minimum: 1, maximum: 200 }),
    recommendationListLength: t.Integer({ minimum: 1, maximum: 10 }),
    homophily: t.Number({ minimum: 0, maximum: 1 }),
    exploration: t.Number({ minimum: 0, maximum: 1 }),
    socialInfluence: t.Number({ minimum: 0, maximum: 1 }),
    bridgeWeight: t.Number({ minimum: 0, maximum: 1 }),
    capacity: t.Integer({ minimum: 1, maximum: 500 }),
  },
  { additionalProperties: false },
);

export function createApp(store: ExperimentStore = createDefaultStore()) {
  return new Elysia({ prefix: "/api/v1" })
    .use(cors({ origin: process.env.WEB_ORIGIN ?? "http://localhost:5173" }))
    .use(
      openapi({
        path: "/openapi",
        documentation: {
          info: {
            title: "EventScape Research API",
            version: "1.0.0",
            description:
              "Validated API for synthetic recommendation-policy experiments.",
          },
        },
      }),
    )
    .onBeforeHandle(({ request, set }) => {
      set.headers["x-request-id"] =
        request.headers.get("x-request-id") ?? randomUUID();
      set.headers["x-content-type-options"] = "nosniff";
      set.headers["x-frame-options"] = "DENY";
      set.headers["referrer-policy"] = "no-referrer";
    })
    .onError(({ code, error, set }) => {
      const requestId = set.headers["x-request-id"];
      if (code === "VALIDATION") {
        set.status = 422;
        return {
          error: {
            code: "VALIDATION_ERROR",
            message: "Request validation failed.",
            requestId,
          },
        };
      }
      set.status = 500;
      console.error(
        JSON.stringify({
          level: "error",
          event: "api_request_failed",
          requestId,
          error: error.message,
        }),
      );
      return {
        error: {
          code: "INTERNAL_ERROR",
          message: "The request could not be completed.",
          requestId,
        },
      };
    })
    .get(
      "/health",
      () => ({ status: "ok", modelVersion: "comparative-demo-v1" }),
      {
        detail: { summary: "Check API health", tags: ["System"] },
      },
    )
    .get(
      "/methodology",
      () => ({
        model: { id: "social-event-dynamics", version: "comparative-demo-v1" },
        policies: POLICY_IDS,
        scenario: canonicalResearchScenario,
        classification: "EXPLORATORY_DEMONSTRATION",
        caveat:
          "Synthetic outputs demonstrate model behavior and platform capability; they are not empirical claims about real populations.",
      }),
      {
        detail: {
          summary: "Read model and policy metadata",
          tags: ["Methodology"],
        },
      },
    )
    .get(
      "/experiments",
      async () => ({ data: await store.listExperiments() }),
      {
        detail: {
          summary: "List persisted experiment executions",
          tags: ["Experiments"],
        },
      },
    )
    .post(
      "/experiments/estimate",
      ({ body }) => ({
        runs: body.seeds.length * POLICY_IDS.length,
        timesteps: body.scenario.timesteps,
        approximateAgentSteps:
          body.seeds.length *
          POLICY_IDS.length *
          body.scenario.timesteps *
          body.scenario.agentCount,
      }),
      {
        body: t.Object(
          {
            scenario: scenarioSchema,
            seeds: t.Array(t.String({ pattern: "^(0|[1-9][0-9]*)$" }), {
              minItems: 1,
              maxItems: 100,
            }),
          },
          { additionalProperties: false },
        ),
        detail: {
          summary: "Estimate an experiment workload",
          tags: ["Experiments"],
        },
      },
    )
    .post(
      "/experiments",
      async ({ body, set }) => {
        const scenario = body.scenario ?? canonicalResearchScenario;
        const seedCount = body.seeds?.length ?? 8;
        if (
          estimateAgentSteps(
            scenario.agentCount,
            scenario.timesteps,
            seedCount,
          ) > MAX_AGENT_STEPS
        ) {
          set.status = 422;
          return {
            error: {
              code: "RESOURCE_LIMIT_EXCEEDED",
              message:
                "Experiment exceeds the synchronous demonstration workload limit.",
            },
          };
        }
        const record = await store.createExperiment(scenario, body.seeds);
        set.status = record.status === "COMPLETED" ? 201 : 422;
        return record;
      },
      {
        body: t.Object(
          {
            scenario: t.Optional(scenarioSchema),
            seeds: t.Optional(
              t.Array(t.String({ pattern: "^(0|[1-9][0-9]*)$" }), {
                minItems: 1,
                maxItems: 100,
              }),
            ),
          },
          { additionalProperties: false },
        ),
        detail: {
          summary: "Run a bounded comparative experiment",
          tags: ["Experiments"],
        },
      },
    )
    .get(
      "/experiments/:id",
      async ({ params, set }) => {
        const record = await store.getExperiment(params.id);
        if (!record) {
          set.status = 404;
          return {
            error: { code: "NOT_FOUND", message: "Experiment not found." },
          };
        }
        return record;
      },
      {
        params: t.Object({ id: t.String({ format: "uuid" }) }),
        detail: { summary: "Read an experiment result", tags: ["Experiments"] },
      },
    )
    .post(
      "/experiments/canonical",
      async ({ set }) => {
        const record = await store.createExperiment();
        set.status = 201;
        return record;
      },
      {
        detail: {
          summary: "Run the canonical demonstration experiment",
          tags: ["Experiments"],
        },
      },
    );
}

export const app = createApp();

export type App = typeof app;
