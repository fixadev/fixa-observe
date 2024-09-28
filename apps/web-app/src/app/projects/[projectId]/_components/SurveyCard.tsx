import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import Link from "next/link";

export default function SurveyCard({
  projectId,
  surveyId,
  surveyName,
}: {
  projectId: string;
  surveyId: string;
  surveyName: string;
}) {
  return (
    <Link href={`/projects/${projectId}/surveys/${surveyId}`}>
      <Card>
        <CardHeader>
          <CardTitle>{surveyName}</CardTitle>
          <CardDescription>Last updated 12 hours ago</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
