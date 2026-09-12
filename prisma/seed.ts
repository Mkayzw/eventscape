import {
  canonicalJson,
  canonicalResearchScenario,
  runComparativeExperiment,
  scientificFingerprint,
} from "../packages/simulation-core/src/index";
import {
  disconnectPrisma,
  getPrismaClient,
} from "../packages/persistence/client";

const prisma = getPrismaClient();
const seeds = ["101", "202", "303", "404", "505", "606", "707", "808"] as const;
const scenarioFingerprint = scientificFingerprint({
  schemaVersion: "1.0.0",
  scenario: canonicalResearchScenario,
});
const scenario = await prisma.scenario.upsert({
  where: { scientificFingerprint: scenarioFingerprint },
  create: {
    name: canonicalResearchScenario.name,
    schemaVersion: "1.0.0",
    scientificFingerprint: scenarioFingerprint,
    configuration: JSON.parse(canonicalJson(canonicalResearchScenario)),
    isCanonical: true,
  },
  update: {
    name: canonicalResearchScenario.name,
    configuration: JSON.parse(canonicalJson(canonicalResearchScenario)),
    isCanonical: true,
  },
});

const result = runComparativeExperiment(canonicalResearchScenario, seeds);
const existing = await prisma.experiment.findFirst({
  where: {
    scenarioId: scenario.id,
    name: "Canonical seeded comparison",
  },
});

if (existing) {
  await prisma.experiment.update({
    where: { id: existing.id },
    data: {
      classification: "EXPLORATORY_DEMONSTRATION",
      status: "COMPLETED",
      design: JSON.parse(canonicalJson({ seeds })),
      result: JSON.parse(canonicalJson(result)),
      failureCode: null,
      startedAt: new Date("2026-09-12T00:00:00.000Z"),
      completedAt: new Date("2026-09-12T00:00:00.000Z"),
    },
  });
} else {
  await prisma.experiment.create({
    data: {
      name: "Canonical seeded comparison",
      classification: "EXPLORATORY_DEMONSTRATION",
      status: "COMPLETED",
      design: JSON.parse(canonicalJson({ seeds })),
      result: JSON.parse(canonicalJson(result)),
      scenarioId: scenario.id,
      startedAt: new Date("2026-09-12T00:00:00.000Z"),
      completedAt: new Date("2026-09-12T00:00:00.000Z"),
    },
  });
}

console.log(
  JSON.stringify({
    event: "database_seeded",
    scenarioId: scenario.id,
    runs: result.runs.length,
  }),
);
await disconnectPrisma();
