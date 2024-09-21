"use client";

import PageHeader from "~/components/PageHeader";
import { CopyBlock, dracula } from "react-code-blocks";

const code = `curl -X POST https://api.pixa.dev/something -H "Authorization: Basic <api_key>" -H "Content-Type: application/json" -d '
{
  "name": "John Doe",
  "email": "john.doe@example.com"
}
'`;

export default function QuickstartPage() {
  return (
    <div>
      <PageHeader title="quickstart" />
      <CopyBlock
        text={code}
        language="bash"
        showLineNumbers={true}
        // wrapLongLines={true}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        theme={dracula}
      />
    </div>
  );
}
