import { $ } from "bun";

const maximumAttempts = 30;
for (let attempt = 1; attempt <= maximumAttempts; attempt += 1) {
  const result = await $`bunx prisma migrate deploy`.quiet().nothrow();
  if (result.exitCode === 0) {
    await $`bun prisma/seed.ts`;
    console.log(JSON.stringify({ event: "database_initialized", attempt }));
    process.exit(0);
  }
  if (attempt === maximumAttempts) {
    console.error(result.stderr.toString());
    throw new Error("Database initialization failed after maximum attempts");
  }
  await Bun.sleep(1_000);
}
