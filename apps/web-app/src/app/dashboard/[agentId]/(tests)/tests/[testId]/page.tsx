import TestCard from "~/components/dashboard/TestCard";

export default function TestPage({
  params,
}: {
  params: { agentId: string; testId: string };
}) {
  return (
    <div>
      {/* header */}
      <div className="container flex items-center justify-between py-8">
        <TestCard className="w-full rounded-md border border-input shadow-sm" />
      </div>
      <div className="h-px w-full bg-input" />
    </div>
  );
}
