import PageHeader from "~/components/PageHeader";
import CodeBlock from "~/components/CodeBlock";

const code = `curl -X POST https://api.pixa.dev/something -H "Authorization: Basic <api_key>" -H "Content-Type: application/json" -d '
{
  "name": "John Doe",
  "email": "john.doe@example.com"
}'`;

export default function QuickstartPage() {
  return (
    <div className="w-full max-w-2xl self-center">
      <PageHeader title="quickstart" />
      <CodeBlock code={code} />
    </div>
  );
}
