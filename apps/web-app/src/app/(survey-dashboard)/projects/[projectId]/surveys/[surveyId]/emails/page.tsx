import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import Unsent from "./_components/Unsent";
import Pending from "./_components/Pending";
import FollowUp from "./_components/FollowUp";
import Completed from "./_components/Completed";

export default function EmailsPage({}: {
  params: { projectId: string; surveyId: string };
}) {
  return (
    <div className="mx-auto flex w-full max-w-screen-xl flex-col">
      <Tabs defaultValue="unsent">
        <TabsList className="mb-8">
          <TabsTrigger value="unsent">Unsent</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="follow-up">Needs follow-up</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="unsent">
          <Unsent />
        </TabsContent>
        <TabsContent value="pending">
          <Pending />
        </TabsContent>
        <TabsContent value="follow-up">
          <FollowUp />
        </TabsContent>
        <TabsContent value="completed">
          <Completed />
        </TabsContent>
      </Tabs>
    </div>
  );
}
