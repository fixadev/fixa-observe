export default function AgentPage({ params }: { params: { agentId: string } }) {
  return <div className="container">AgentPage {params.agentId}</div>;
}
