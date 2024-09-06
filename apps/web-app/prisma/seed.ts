import { db } from "../src/server/db";

async function main() {
  await db.user.create({
    data: {
      email: "test@test.com",
      name: "Test User",
    },
  });
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
