import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { createContext, useContext, type ReactNode } from "react";
import { type Prisma } from "@prisma/client";

export type SurveyWithIncludes = Prisma.SurveyGetPayload<{
  include: {
    properties: {
      include: {
        propertyValues: true;
        brochures: true;
        contacts: true;
        emailThreads: {
          include: {
            emails: {
              include: {
                attachments: true;
              };
            };
          };
        };
      };
    };
    columns: true;
  };
}>;

export type PropertyWithIncludes = SurveyWithIncludes["properties"][number];
export type EmailThreadWithIncludes =
  PropertyWithIncludes["emailThreads"][number];
export type ColumnWithIncludes = SurveyWithIncludes["columns"][number];

interface SurveyContextType {
  survey: SurveyWithIncludes | null;
  refetchSurvey: () => Promise<void>;
  isLoadingSurvey: boolean;
  isRefetchingSurvey: boolean;
}

const SurveyContext = createContext<SurveyContextType | null>(null);

export function SurveyProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const surveyId = params.surveyId as string;
  const {
    data: survey,
    refetch,
    isLoading,
    isRefetching,
  } = api.survey.get.useQuery({ surveyId });

  const refetchSurvey = async () => {
    await refetch();
  };

  return (
    <SurveyContext.Provider
      value={{
        survey: survey ?? null,
        refetchSurvey,
        isLoadingSurvey: isLoading,
        isRefetchingSurvey: isRefetching,
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
}

export function useSurvey() {
  const context = useContext(SurveyContext);
  if (context === null) {
    throw new Error("useSurvey must be used within a SurveyProvider");
  }
  return context;
}
