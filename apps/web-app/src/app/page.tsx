import { currentUser } from "@clerk/nextjs/server";
import ProjectCard from "./_components/ProjectCard";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import UserImage from "~/components/UserImage";

export default async function Home() {
  const user = await currentUser();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-4">
        <UserImage imageUrl={user?.imageUrl} />
        <div>
          <div className="text-lg font-medium">{user?.fullName}</div>
          <div className="text-sm text-muted-foreground">
            {user?.emailAddresses[0]?.emailAddress}
          </div>
        </div>
      </div>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="text-lg font-medium">My projects</div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Create project</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create project</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-2 py-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="project-name">Project name</Label>
                  <Input
                    id="project-name"
                    placeholder="Palo Alto project"
                    autoComplete="off"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex flex-col gap-2">
          <ProjectCard id="1" />
          <ProjectCard id="2" />
          <ProjectCard id="3" />
        </div>
      </div>
    </div>
  );
}
