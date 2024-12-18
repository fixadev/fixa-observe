/*
  Warnings:

  - You are about to drop the `Eval` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EvalOverride` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EvalResult` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EvalSet` table. If the table is not empty, all the data it contains will be lost.

*/
-- First create all the new tables
CREATE TABLE "EvaluationTemplate" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "params" TEXT[],
    "scenarioId" TEXT,
    "type" "EvalType" NOT NULL,
    "resultType" "EvalResultType" NOT NULL,
    "contentType" "EvalContentType" NOT NULL DEFAULT 'content',
    "isCritical" BOOLEAN NOT NULL DEFAULT true,
    "toolCallExpectedResult" TEXT NOT NULL DEFAULT '',
    "agentId" TEXT,
    "ownerId" TEXT,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "evaluationGroupId" TEXT,

    CONSTRAINT "EvaluationTemplate_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Evaluation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "params" JSONB NOT NULL DEFAULT '{}',
    "evaluationTemplateId" TEXT NOT NULL,
    "scenarioId" TEXT,
    "evaluationGroupId" TEXT,
    "agentId" TEXT,

    CONSTRAINT "Evaluation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EvaluationResult" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "callId" TEXT,
    "evaluationId" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,
    "secondsFromStart" DOUBLE PRECISION,
    "duration" DOUBLE PRECISION,
    "type" "EvalResultType" NOT NULL,
    "details" TEXT NOT NULL,
    "evaluationTemplateId" TEXT,

    CONSTRAINT "EvaluationResult_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EvaluationGroup" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "condition" TEXT NOT NULL DEFAULT '',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "savedSearchId" TEXT,

    CONSTRAINT "EvaluationGroup_pkey" PRIMARY KEY ("id")
);

-- Then handle the Intent -> Scenarios migration
ALTER TABLE "Call" DROP CONSTRAINT IF EXISTS "Call_scenarioId_fkey";
ALTER TABLE "Evaluation" DROP CONSTRAINT IF EXISTS "Evaluation_scenarioId_fkey";
ALTER TABLE "EvaluationTemplate" DROP CONSTRAINT IF EXISTS "EvaluationTemplate_scenarioId_fkey";

CREATE TABLE "Scenarios" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" TEXT NOT NULL DEFAULT '',
    "agentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "successCriteria" TEXT NOT NULL DEFAULT '',
    "includeDateTime" BOOLEAN NOT NULL DEFAULT false,
    "timezone" TEXT,
    "isNew" BOOLEAN NOT NULL DEFAULT false,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Scenarios_pkey" PRIMARY KEY ("id")
);

-- Copy data from Intent to Scenarios
INSERT INTO "Scenarios" (
    "id",
    "createdAt",
    "ownerId",
    "agentId",
    "name",
    "instructions",
    "successCriteria",
    "includeDateTime",
    "timezone",
    "isNew",
    "deleted"
)
SELECT 
    id,
    "createdAt",
    "ownerId",
    "agentId",
    name,
    instructions,
    "successCriteria",
    "includeDateTime",
    timezone,
    "isNew",
    false
FROM "Intent";

-- Drop the Intent table
DROP TABLE "Intent";

-- Now copy data from old eval tables to new tables
INSERT INTO "EvaluationTemplate" (
    "id", 
    "createdAt", 
    "name", 
    "description", 
    "scenarioId", 
    "type", 
    "resultType", 
    "contentType", 
    "isCritical", 
    "agentId",
    "ownerId",
    "deleted"
)
SELECT 
    id,
    "createdAt",
    name,
    description,
    "scenarioId",
    type,
    "resultType",
    CAST(COALESCE("contentType", 'content') AS "EvalContentType"),
    "isCritical",
    "agentId",
    "ownerId",
    false
FROM "Eval";

INSERT INTO "Evaluation" (
    "id", 
    "createdAt", 
    "evaluationTemplateId", 
    "scenarioId", 
    "agentId", 
    "params"
)
SELECT 
    id || '_eval',
    "createdAt",
    id,
    "scenarioId",
    "agentId",
    '{}' -- Cast as Json
FROM "Eval";

INSERT INTO "EvaluationResult" (
    "id", 
    "createdAt", 
    "callId", 
    "evaluationId", 
    "result", 
    "success", 
    "secondsFromStart", 
    "duration", 
    "type", 
    "details", 
    "evaluationTemplateId"
)
SELECT
    id,
    "createdAt",
    "callId",
    "evalId" || '_eval',
    result,
    success,
    "secondsFromStart",
    duration,
    type,
    COALESCE(details, ''),
    "evalId"
FROM "EvalResult";

-- Add this with your other INSERT statements
INSERT INTO "EvaluationGroup" (
    "id",
    "createdAt",
    "ownerId",
    "name",
    "condition",
    "enabled",
    "savedSearchId"
)
SELECT 
    id,
    "createdAt",
    "ownerId",
    name,
    COALESCE(condition, ''),
    COALESCE(enabled, true),
    "savedSearchId"
FROM "EvalSet";

-- Drop old eval tables
DROP TABLE IF EXISTS "Eval";
DROP TABLE IF EXISTS "EvalOverride";
DROP TABLE IF EXISTS "EvalResult";
DROP TABLE IF EXISTS "EvalSet";

-- Finally add all foreign key constraints
ALTER TABLE "Call" ADD CONSTRAINT "Call_scenarioId_fkey" 
    FOREIGN KEY ("scenarioId") REFERENCES "Scenarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "EvaluationTemplate" ADD CONSTRAINT "EvaluationTemplate_scenarioId_fkey" 
    FOREIGN KEY ("scenarioId") REFERENCES "Scenarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "EvaluationTemplate" ADD CONSTRAINT "EvaluationTemplate_agentId_fkey" 
    FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "EvaluationTemplate" ADD CONSTRAINT "EvaluationTemplate_evaluationGroupId_fkey" 
    FOREIGN KEY ("evaluationGroupId") REFERENCES "EvaluationGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_evaluationTemplateId_fkey"
    FOREIGN KEY ("evaluationTemplateId") REFERENCES "EvaluationTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_scenarioId_fkey" 
    FOREIGN KEY ("scenarioId") REFERENCES "Scenarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_evaluationGroupId_fkey" 
    FOREIGN KEY ("evaluationGroupId") REFERENCES "EvaluationGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_agentId_fkey" 
    FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "EvaluationResult" ADD CONSTRAINT "EvaluationResult_callId_fkey" 
    FOREIGN KEY ("callId") REFERENCES "Call"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "EvaluationResult" ADD CONSTRAINT "EvaluationResult_evaluationId_fkey" 
    FOREIGN KEY ("evaluationId") REFERENCES "Evaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "EvaluationResult" ADD CONSTRAINT "EvaluationResult_evaluationTemplateId_fkey" 
    FOREIGN KEY ("evaluationTemplateId") REFERENCES "EvaluationTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "EvaluationGroup" ADD CONSTRAINT "EvaluationGroup_savedSearchId_fkey" 
    FOREIGN KEY ("savedSearchId") REFERENCES "SavedSearch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

