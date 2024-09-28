import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";

export default function ProjectCard({ id }: { id: string }) {
  return (
    <Link href={`/projects/${id}`}>
      <Card>
        <CardHeader>
          <CardTitle>Project name</CardTitle>
          <CardDescription>Project description</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
