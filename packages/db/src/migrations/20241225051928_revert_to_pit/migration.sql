BEGIN;

-- Add comprehensive data integrity checks before migration
DO $$ 
DECLARE
    table_exists BOOLEAN;
BEGIN
    -- Check if tables exist before running checks
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Intent'
    ) INTO table_exists;

    IF table_exists THEN
        -- Check if all non-NULL Call.scenarioId values exist in Intent
        IF EXISTS (
            SELECT 1 FROM "Call" c
            WHERE c."scenarioId" IS NOT NULL 
            AND NOT EXISTS (
                SELECT 1 FROM "Intent" i 
                WHERE i.id = c."scenarioId"
            )
        ) THEN
            RAISE EXCEPTION 'Data integrity check failed: Call table contains scenarioId values that do not exist in Intent table';
        END IF;

        -- Verify no duplicate IDs exist in Intent table
        IF EXISTS (
            SELECT id, COUNT(*) 
            FROM "Intent" 
            GROUP BY id 
            HAVING COUNT(*) > 1
        ) THEN
            RAISE EXCEPTION 'Data integrity check failed: duplicate IDs found in Intent table';
        END IF;
        
        -- Check for any NULL values in required fields
        IF EXISTS (
            SELECT 1 FROM "Intent"
            WHERE name IS NULL OR instructions IS NULL OR "agentId" IS NULL
        ) THEN
            RAISE EXCEPTION 'Data integrity check failed: NULL values found in required Intent fields';
        END IF;
    END IF;
END $$;

-- First drop the foreign key constraints
ALTER TABLE IF EXISTS "Eval" DROP CONSTRAINT IF EXISTS "Eval_scenarioId_fkey";
ALTER TABLE IF EXISTS "EvalOverride" DROP CONSTRAINT IF EXISTS "EvalOverride_scenarioId_fkey";
ALTER TABLE IF EXISTS "Call" DROP CONSTRAINT IF EXISTS "Call_scenarioId_fkey";

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
    "ownerId" TEXT,
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

-- Create indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS "scenarios_agent_id_idx" ON "Scenarios"("agentId");
CREATE INDEX IF NOT EXISTS "scenarios_owner_id_idx" ON "Scenarios"("ownerId");

-- Copy data from Intent to Scenarios if Intent exists
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Intent'
    ) THEN
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
    END IF;
END $$;

-- Copy data from old eval tables to new tables if they exist
DO $$
BEGIN
    -- Copy Eval data if exists
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Eval'
    ) THEN
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

        -- Create corresponding Evaluation records
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
            '{}'
        FROM "Eval";
    END IF;

    -- Copy EvalResult data if exists
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'EvalResult'
    ) THEN
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
    END IF;

    -- Copy EvalSet data if exists
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'EvalSet'
    ) THEN
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
    END IF;
END $$;

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

-- Add comprehensive verification after migration
DO $$ 
DECLARE
    intent_count INTEGER;
    scenario_count INTEGER;
    eval_template_count INTEGER;
    eval_count INTEGER;
BEGIN
    -- Get counts for verification
    SELECT COUNT(*) INTO intent_count FROM "Intent";
    SELECT COUNT(*) INTO scenario_count FROM "Scenarios";
    
    -- Verify record counts match
    IF intent_count != scenario_count THEN
        RAISE EXCEPTION 'Migration verification failed: count mismatch between Intent (%) and Scenarios (%)', 
            intent_count, scenario_count;
    END IF;

    -- Verify all required fields were migrated correctly
    IF EXISTS (
        SELECT 1 FROM "Scenarios" s
        WHERE s.name IS NULL OR s.instructions IS NULL OR s."agentId" IS NULL
    ) THEN
        RAISE EXCEPTION 'Migration verification failed: NULL values found in required Scenarios fields';
    END IF;

    -- Verify all EvaluationResults have valid evaluationIds
    IF EXISTS (
        SELECT 1 FROM "EvaluationResult" er
        LEFT JOIN "Evaluation" e ON er."evaluationId" = e.id
        WHERE e.id IS NULL
    ) THEN
        RAISE EXCEPTION 'Data integrity check failed: orphaned evaluationId values in EvaluationResult table';
    END IF;

    -- Verify all Evaluations have valid evaluationTemplateIds
    IF EXISTS (
        SELECT 1 FROM "Evaluation" e
        LEFT JOIN "EvaluationTemplate" et ON e."evaluationTemplateId" = et.id
        WHERE et.id IS NULL
    ) THEN
        RAISE EXCEPTION 'Data integrity check failed: orphaned evaluationTemplateId values in Evaluation table';
    END IF;

    -- Verify no duplicate IDs exist in new tables
    IF EXISTS (
        SELECT id, COUNT(*) 
        FROM "Scenarios" 
        GROUP BY id 
        HAVING COUNT(*) > 1
    ) THEN
        RAISE EXCEPTION 'Data integrity check failed: duplicate IDs found in Scenarios table';
    END IF;
END $$;

-- Finally, drop all old tables after verification is complete
DROP TABLE IF EXISTS "Intent" CASCADE;
DROP TABLE IF EXISTS "Eval" CASCADE;
DROP TABLE IF EXISTS "EvalResult" CASCADE;
DROP TABLE IF EXISTS "EvalSet" CASCADE;
DROP TABLE IF EXISTS "EvalOverride" CASCADE;

COMMIT;
