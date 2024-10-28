import { extractStreetAddress } from "./extractStreetAddress";

async function test() {
  const result = await extractStreetAddress(`Bldg
164 Hamilton Ave
Suite Bldg
Palo Alto`);

  console.log(result);
}

void test();
