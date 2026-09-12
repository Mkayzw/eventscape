CREATE TYPE "ExperimentStatus" AS ENUM (
    'QUEUED',
    'RUNNING',
    'COMPLETED',
    'FAILED',
    'CANCELLED'
);
CREATE TYPE "StudyClassification" AS ENUM (
    'CONFIRMATORY',
    'EXPLORATORY',
    'EXPLORATORY_DEMONSTRATION'
);
CREATE TABLE "Scenario" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "schemaVersion" TEXT NOT NULL,
    "scientificFingerprint" TEXT NOT NULL,
    "configuration" JSONB NOT NULL,
    "isCanonical" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Scenario_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Experiment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "classification" "StudyClassification" NOT NULL,
    "status" "ExperimentStatus" NOT NULL DEFAULT 'QUEUED',
    "design" JSONB NOT NULL,
    "result" JSONB,
    "failureCode" TEXT,
    "scenarioId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    CONSTRAINT "Experiment_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Scenario_scientificFingerprint_key" ON "Scenario"("scientificFingerprint");
CREATE INDEX "Experiment_status_createdAt_idx" ON "Experiment"("status", "createdAt");
CREATE INDEX "Experiment_scenarioId_createdAt_idx" ON "Experiment"("scenarioId", "createdAt");
ALTER TABLE "Experiment"
ADD CONSTRAINT "Experiment_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
