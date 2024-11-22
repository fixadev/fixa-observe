#!/bin/bash

NODE_ENV=development \
DATABASE_URL="postgresql://postgres.eswbggamquxvdsuuktpf:t24fwMp67!dNnsn@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1" \
DIRECT_URL="postgresql://postgres.eswbggamquxvdsuuktpf:t24fwMp67!dNnsn@aws-0-us-west-1.pooler.supabase.com:5432/postgres" \
npx tsx src/services/transcribePastCalls.ts
