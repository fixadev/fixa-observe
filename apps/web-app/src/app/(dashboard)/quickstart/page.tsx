"use client";
import PageHeader from "~/components/PageHeader";
import CodeBlock from "~/components/CodeBlock";
import { useProject } from "~/app/contexts/projectContext";

const code = `curl -X POST https://pixa.dev/api/upload -H "Authorization: Basic <api_key>" -H "Content-Type: application/json" -d '
{
  "name": "John Doe",
  "email": "john.doe@example.com"
}'`;

export default function QuickstartPage() {
  const { selectedProject } = useProject();
  return (
    <div className="w-full max-w-2xl self-center">
      <PageHeader title="quickstart" />
      <p>
        Pixa is a platform for analyzing conversational voice agent performance.
      </p>
      <br />
      <p>The API provides endpoints to upload audio files and transcripts.</p>
      <br />
      <p>
        Simply make a POST request to the /upload endpoint with the following:
      </p>
      <br />
      <ul>
        <li className="flex flex-row items-center gap-2">
          <p>- Bearer Token (required). Your token is</p>
          <CodeBlock
            code="8f3Z9xK2mN7pQ1rT5vW0yA4bC6dE8gH3"
            language="txt"
            hidden={true}
          />
        </li>
        <li>- Audio file (required) supports mp3, mp4, wav, m4a, webm, ogg</li>
        <li className="flex flex-row items-center gap-2">
          <p>- Project ID (required). Your project ID is</p>
          <CodeBlock code={selectedProject?.id ?? ""} />
        </li>
        <li>- Transcript (optional). Supports plain text files.</li>
      </ul>
      <br />
      <CodeBlock lineNumbers={true} code={code} />
    </div>
  );
}
