import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import Link from "next/link";

export default function ProjectCard({
  id,
  name,
  description = "",
}: {
  id: string;
  name: string;
  description?: string;
}) {
  return (
    <Link href={`/projects/${id}`}>
      <Card>
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
