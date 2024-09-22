import PageHeader from "~/components/PageHeader";
import ConversationTable from "./_components/ConversationTable";

export default function DashboardPage() {
  return (
    <div>
      <PageHeader title="dashboard" />
      <ConversationTable />
    </div>
  );
}
