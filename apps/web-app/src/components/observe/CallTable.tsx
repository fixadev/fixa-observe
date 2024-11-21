import CallLatencyCard from "./CallLatencyCard";

export default function CallTable() {
  return (
    <div className="flex flex-col border-x border-t border-border">
      <CallLatencyCard />
      <CallLatencyCard />
      <CallLatencyCard />
      <CallLatencyCard />
    </div>
  );
}
