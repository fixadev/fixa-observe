"use client";
import { useEffect, useState } from "react";
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
import { useUser } from "@clerk/nextjs";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { getInitials } from "~/lib/utils";
import { useToast } from "~/hooks/use-toast";
import Spinner from "~/components/Spinner";
import { Skeleton } from "~/components/ui/skeleton";

export default function Home() {
  const { toast } = useToast();
  const { user } = useUser();
  const router = useRouter();
  const [projects, setProjects] = useState<
    Array<{ id: string; name: string; updatedAt: Date }>
  >([]);
  const [projectName, setProjectName] = useState("");
  const [creatingProject, setCreatingProject] = useState(false);

  const {
    data: projectsData,
    refetch: refetchProjects,
    isLoading: projectsLoading,
    error: projectsError,
  } = api.project.getAll.useQuery();

  const { mutate: createProject, error: createProjectError } =
    api.project.create.useMutation({
      onSuccess: (data) => {
        router.push(`/projects/${data.id}`);
        toast({
          title: "Project created!",
          duration: 5000,
        });
        setProjectName("");
      },
    });

  useEffect(() => {
    if (projectsData) {
      setProjects(projectsData);
    }
  }, [projectsData]);

  const handleCreateProject = () => {
    setCreatingProject(true);
    createProject({ projectName });
    setProjects([
      ...projects,
      { id: "1", name: projectName, updatedAt: new Date() },
    ]);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src={user?.imageUrl} />
          <AvatarFallback>{getInitials(user?.fullName ?? "")}</AvatarFallback>
        </Avatar>
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
                    value={projectName}
                    onChange={(e) => {
                      setProjectName(e.target.value);
                    }}
                    disabled={creatingProject}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        setCreatingProject(true);
                        handleCreateProject();
                      }
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  disabled={creatingProject || projectName.length === 0}
                  onClick={handleCreateProject}
                >
                  {creatingProject ? (
                    <Spinner className="h-5 w-11 text-gray-200" />
                  ) : (
                    "Create"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex flex-col gap-2">
          {projectsLoading ? (
            <>
              <Skeleton className="h-[84px] w-full" />
              <Skeleton className="h-[84px] w-full" />
              <Skeleton className="h-[84px] w-full" />
            </>
          ) : (
            projects?.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                refetchProjects={refetchProjects}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
