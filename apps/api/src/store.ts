import { randomUUID } from "node:crypto";
import {
  canonicalJson,
  canonicalResearchScenario,
  runComparativeExperiment,
  scientificFingerprint,
  type ComparativeExperiment,
  type ResearchScenario,
} from "@eventscape/simulation-core";
import { getPrismaClient } from "../../../packages/persistence/client";

export interface ExperimentRecord {
  readonly id: string;
  readonly status: "COMPLETED" | "FAILED";
  readonly createdAt: string;
  readonly result?: ComparativeExperiment;
  readonly error?: string;
}

export interface ExperimentStore {
  createExperiment(
    scenario?: ResearchScenario,
    seeds?: readonly string[],
  ): Promise<ExperimentRecord>;
  getExperiment(id: string): Promise<ExperimentRecord | undefined>;
  listExperiments(): Promise<readonly Omit<ExperimentRecord, "result">[]>;
}

function toJson(value: unknown): object {
  return JSON.parse(canonicalJson(value)) as object;
}

export class PrismaExperimentStore implements ExperimentStore {
  async createExperiment(
    scenario: ResearchScenario = canonicalResearchScenario,
    seeds?: readonly string[],
  ): Promise<ExperimentRecord> {
    const prisma = getPrismaClient();
    const scenarioFingerprint = scientificFingerprint({
      schemaVersion: "1.0.0",
      scenario,
    });
    const persistedScenario = await prisma.scenario.upsert({
      where: { scientificFingerprint: scenarioFingerprint },
      create: {
        name: scenario.name,
        schemaVersion: "1.0.0",
        scientificFingerprint: scenarioFingerprint,
        configuration: toJson(scenario),
        isCanonical: scenario.id === canonicalResearchScenario.id,
      },
      update: {
        name: scenario.name,
        configuration: toJson(scenario),
      },
    });
    const createdAt = new Date();
    const experiment = await prisma.experiment.create({
      data: {
        name: `${scenario.name} comparison`,
        classification: "EXPLORATORY_DEMONSTRATION",
        status: "RUNNING",
        design: toJson({
          seeds: seeds ?? [
            "101",
            "202",
            "303",
            "404",
            "505",
            "606",
            "707",
            "808",
          ],
        }),
        scenarioId: persistedScenario.id,
        startedAt: createdAt,
      },
    });

    try {
      const result = runComparativeExperiment(scenario, seeds);
      const completed = await prisma.experiment.update({
        where: { id: experiment.id },
        data: {
          status: "COMPLETED",
          result: toJson(result),
          completedAt: new Date(),
        },
      });
      return {
        id: completed.id,
        status: "COMPLETED",
        createdAt: completed.createdAt.toISOString(),
        result,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown experiment failure";
      const failed = await prisma.experiment.update({
        where: { id: experiment.id },
        data: {
          status: "FAILED",
          failureCode: "SIMULATION_FAILED",
          completedAt: new Date(),
        },
      });
      return {
        id: failed.id,
        status: "FAILED",
        createdAt: failed.createdAt.toISOString(),
        error: message,
      };
    }
  }

  async getExperiment(id: string): Promise<ExperimentRecord | undefined> {
    const experiment = await getPrismaClient().experiment.findUnique({
      where: { id },
    });
    if (!experiment) return undefined;
    return {
      id: experiment.id,
      status: experiment.status === "COMPLETED" ? "COMPLETED" : "FAILED",
      createdAt: experiment.createdAt.toISOString(),
      ...(experiment.result
        ? {
            result: experiment.result as unknown as ComparativeExperiment,
          }
        : {}),
      ...(experiment.failureCode ? { error: experiment.failureCode } : {}),
    };
  }

  async listExperiments(): Promise<
    readonly Omit<ExperimentRecord, "result">[]
  > {
    const experiments = await getPrismaClient().experiment.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        status: true,
        createdAt: true,
        failureCode: true,
      },
    });
    return experiments.map((experiment) => ({
      id: experiment.id,
      status: experiment.status === "COMPLETED" ? "COMPLETED" : "FAILED",
      createdAt: experiment.createdAt.toISOString(),
      ...(experiment.failureCode ? { error: experiment.failureCode } : {}),
    }));
  }
}

export class InMemoryExperimentStore implements ExperimentStore {
  readonly #experiments = new Map<string, ExperimentRecord>();

  async createExperiment(
    scenario: ResearchScenario = canonicalResearchScenario,
    seeds?: readonly string[],
  ): Promise<ExperimentRecord> {
    const id = randomUUID();
    const createdAt = new Date().toISOString();
    try {
      const result = runComparativeExperiment(scenario, seeds);
      const record = { id, status: "COMPLETED", createdAt, result } as const;
      this.#experiments.set(id, record);
      return record;
    } catch (error) {
      const record = {
        id,
        status: "FAILED",
        createdAt,
        error:
          error instanceof Error ? error.message : "Unknown experiment failure",
      } as const;
      this.#experiments.set(id, record);
      return record;
    }
  }

  async getExperiment(id: string): Promise<ExperimentRecord | undefined> {
    return this.#experiments.get(id);
  }

  async listExperiments(): Promise<
    readonly Omit<ExperimentRecord, "result">[]
  > {
    return [...this.#experiments.values()]
      .map(({ result: _result, ...record }) => record)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  }
}

export function createDefaultStore(): ExperimentStore {
  return process.env.DATABASE_URL
    ? new PrismaExperimentStore()
    : new InMemoryExperimentStore();
}
