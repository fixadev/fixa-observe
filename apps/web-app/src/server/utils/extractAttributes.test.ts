import { extractAttributes } from "./extractAttributes";

async function test() {
  const result = await extractAttributes(
    `No the property is not available for lease.

Best,
Jonathan
CTO @ pixa<https://www.linkedin.com/company/pixa-dev> (YC F24)
`,
    ["askingRate", "opEx"],
  );

  console.log(result);
}

void test();
