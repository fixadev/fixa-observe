import { extractAttributes } from "./extractAttributes";

async function test() {
  const result = await extractAttributes(`
  Hi,

  The asking rate is $5.50 per square foot, and the operating expenses are $0.50 per square foot.
  The property is available on November 10, 2024.

  Best,
  Jonathan
`);

  console.log(result);
}

void test();
