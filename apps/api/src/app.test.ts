import { describe, expect, test } from "bun:test";
import { canonicalResearchScenario } from "@eventscape/simulation-core";
import { createApp } from "./app";
import { InMemoryExperimentStore } from "./store";

const app = createApp(new InMemoryExperimentStore());

describe("EventScape API", () => {
  test("reports health and security headers", async () => {
    const response = await app.handle(
      new Request("http://localhost/api/v1/health"),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
    expect(await response.json()).toEqual({
      status: "ok",
      modelVersion: "comparative-demo-v1",
    });
  });

  test("runs a validated bounded experiment", async () => {
    const response = await app.handle(
      new Request("http://localhost/api/v1/experiments", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          scenario: {
            ...canonicalResearchScenario,
            timesteps: 2,
            agentCount: 12,
            eventCount: 6,
          },
          seeds: ["1"],
        }),
      }),
    );
    expect(response.status).toBe(201);
    const record = (await response.json()) as {
      status: string;
      result: { runs: unknown[] };
    };
    expect(record.status).toBe("COMPLETED");
    expect(record.result.runs).toHaveLength(4);
  });

  test("rejects oversized experiment input", async () => {
    const response = await app.handle(
      new Request("http://localhost/api/v1/experiments/estimate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          scenario: { ...canonicalResearchScenario, agentCount: 50_000 },
          seeds: ["1"],
        }),
      }),
    );
    expect(response.status).toBe(422);
  });
});
