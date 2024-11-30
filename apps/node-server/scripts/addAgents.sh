#!/bin/bash

NODE_ENV=production \
DATABASE_URL="postgresql://postgres.nkudjvfueumihtrpxxdu:jzG2xXyN45zP!ha@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1" \
DIRECT_URL="postgresql://postgres.nkudjvfueumihtrpxxdu:jzG2xXyN45zP!ha@aws-0-us-west-1.pooler.supabase.com:5432/postgres" \
npx tsx src/services/addAgents.ts
