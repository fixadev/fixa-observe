"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "~/trpc/react";
interface ProjectContextType {
  selectedProject: { id: string; name: string } | undefined;
  setSelectedProject: (project: { id: string; name: string }) => void;
  projects: { id: string; name: string }[] | undefined;
  isLoading: boolean;
  refetchProjects: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedProject, setSelectedProject] = useState<
    { id: string; name: string } | undefined
  >(undefined);
  const {
    data: projects,
    isLoading,
    refetch: refetchProjects,
  } = api.project.getProjectsByUser.useQuery();

  useEffect(() => {
    if (projects?.[0]) {
      setSelectedProject(projects[0]);
    }
  }, [projects]);

  return (
    <ProjectContext.Provider
      value={{
        selectedProject,
        setSelectedProject,
        projects,
        isLoading,
        refetchProjects: () => {
          void refetchProjects();
        },
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};
