import { extractAttributes } from "./extractAttributes";

async function test() {
  const result = await extractAttributes(
    `
  Hi,

  The asking rate is $5.50 per square foot, and the operating expenses are $0.50 per square foot.
  And yes, the property is available

  Best,
  Jonathan
`,
    ["askingRate", "opEx"],
  );

  console.log(result);
}

void test();
