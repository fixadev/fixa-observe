-- This is an empty migration.

-- Update SavedSearch records where agentId is [""] to be []
UPDATE "SavedSearch"
SET "agentId" = ARRAY[]::text[]
WHERE "agentId" = ARRAY['']::text[];