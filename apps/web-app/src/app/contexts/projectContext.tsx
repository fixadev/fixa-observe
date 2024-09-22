import React, { createContext, useContext } from "react";
import { api } from "~/trpc/react";
interface ProjectContextType {
  projectIds: { id: string; name: string }[] | undefined;
  isLoading: boolean;
  refetchProjects: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    data: projectIds,
    isLoading,
    refetch: refetchProjects,
  } = api.project.getProjectsByUser.useQuery();

  return (
    <ProjectContext.Provider
      value={{
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

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};
