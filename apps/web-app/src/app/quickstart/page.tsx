"use client";

import PageHeader from "~/components/PageHeader";
// import CodeBlock from "~/components/CodeBlock";
import { CopyBlock, dracula } from "react-code-blocks";

const code = `npm install @prisma/client`;

export default function QuickstartPage() {
  return (
    <div>
      <PageHeader title="quickstart" />
      <CopyBlock
        text={code}
        language="bash"
        showLineNumbers={true}
        wrapLongLines={true}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        theme={dracula}
      />
    </div>
  );
}
