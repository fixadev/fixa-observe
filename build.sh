export DATABASE_URL="postgresql://postgres.eswbggamquxvdsuuktpf:t24fwMp67!dNnsn@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
export DIRECT_URL="postgresql://postgres.eswbggamquxvdsuuktpf:t24fwMp67!dNnsn@aws-0-us-west-1.pooler.supabase.com:5432/postgres"

fly deploy --remote-only \
            --app pixa-observe-staging \
            --dockerfile apps/node-server/Dockerfile \
            --config apps/node-server/fly.toml \
            --build-arg TEST_SECRET=test \
            --build-arg DATABASE_URL=$DATABASE_URL \
            --build-arg DIRECT_URL=$DIRECT_URL \
            --build-arg TEST_SECRET=$TEST_SECRET