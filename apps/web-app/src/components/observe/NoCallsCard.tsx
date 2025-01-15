import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { Button } from "../ui/button";
import { useCallback } from "react";
import { useFeatureFlagEnabled } from "posthog-js/react";

export default function NoCallsCard() {
  const showDemo = useFeatureFlagEnabled("interactive-demo");

  const viewSampleDashboard = useCallback(() => {
    window.location.href = "/demo";
  }, []);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8">
      <div className="max-w-2xl rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm">
        <h3 className="mb-4 text-base font-medium">no calls found</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          to start seeing calls, send us the following request:
        </p>
        <pre className="mb-4 rounded-md bg-muted p-4 font-mono text-sm">
          {`curl --request POST \\
  --url https://api.fixa.dev/v1/upload-call \\
  --header 'Authorization: Bearer <FIXA_API_KEY>' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "callId": "<string>",
  "agentId": "<string>",
  "stereoRecordingUrl": "<string>"
}'`}
        </pre>
        <p className="text-sm text-muted-foreground">
          once you start sending calls, they will appear in this dashboard
          automatically.
        </p>
        <div className="mt-4 flex items-center justify-between gap-2">
          <Button
            variant="link"
            className="flex w-fit gap-2 px-0 text-sm"
            asChild
          >
            <Link
              href="https://docs.fixa.dev/api-reference/endpoint/upload-call"
              target="_blank"
            >
              view docs <ArrowTopRightOnSquareIcon className="size-4" />
            </Link>
          </Button>
          {showDemo && (
            <Button
              variant="outline"
              className="flex w-fit gap-2 text-sm"
              onClick={viewSampleDashboard}
            >
              view sample dashboard
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
