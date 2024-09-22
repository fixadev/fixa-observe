"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "~/trpc/react";
interface ProjectContextType {
  selectedProjectId: string | undefined;
  setSelectedProjectId: (id: string) => void;
  projectIds: { id: string; name: string }[] | undefined;
  isLoading: boolean;
  refetchProjects: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<
    string | undefined
  >(undefined);
  const {
    data: projectIds,
    isLoading,
    refetch: refetchProjects,
  } = api.project.getProjectsByUser.useQuery();

  useEffect(() => {
    if (projectIds?.[0]?.id) {
      setSelectedProjectId(projectIds[0].id);
    }
  }, [projectIds]);

  return (
    <ProjectContext.Provider
      value={{
        selectedProjectId,
        setSelectedProjectId,
        projectIds,
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
