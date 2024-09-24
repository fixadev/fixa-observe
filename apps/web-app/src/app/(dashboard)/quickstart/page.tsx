"use client";
import PageHeader from "~/components/PageHeader";
import CodeBlock from "~/components/CodeBlock";
import { useProject } from "~/app/contexts/projectContext";

export default function QuickstartPage() {
  const { selectedProject } = useProject();

  const code = `curl -X POST https://api.pixa.dev/v1/upload -H "Authorization: Bearer <api_key>" -H "Content-Type: application/json" -d '
  {
    "projectId": "${selectedProject?.id}",
    "audio": "Audio file",
    "transcript": "Transcript text"
  }'`;

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
          <p>- API Key (required). Your key is</p>
          <CodeBlock
            code="8f3Z9xK2mN7pQ1rT5vW0yA4bC6dE8gH3"
            language="txt"
            hidden={true}
          />
        </li>
        <li>
          - Audio file (required). Accepts a file of type mp3, mp4, wav, m4a,
          webm, ogg
        </li>
        <li className="flex flex-row items-center gap-2">
          <p>- Project ID (required). Your project ID is</p>
          <CodeBlock code={selectedProject?.id ?? ""} />
        </li>
        <li>- Transcript (optional). Accepts a string or a plain text file.</li>
      </ul>
      <br />
      <CodeBlock lineNumbers={true} code={code} />
    </div>
  );
}
