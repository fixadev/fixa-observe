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
}: {
  projectId: string;
  surveyId: string;
}) {
  return (
    <Link href={`/projects/${projectId}/surveys/${surveyId}`}>
      <Card>
        <CardHeader>
          <CardTitle>Palo Alto Survey</CardTitle>
          <CardDescription>Last updated 12 hours ago</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
