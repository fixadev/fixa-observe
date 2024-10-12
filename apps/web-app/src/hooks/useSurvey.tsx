import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { createContext, useContext, type ReactNode } from "react";
import type { Survey } from "prisma/generated/zod";

interface SurveyContextType {
  survey: Survey | null;
  refetchSurvey: () => Promise<void>;
}

const SurveyContext = createContext<SurveyContextType | null>(null);

export function SurveyProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const surveyId = params.surveyId as string;
  const { data: survey, refetch } = api.survey.getSurvey.useQuery({ surveyId });

  const refetchSurvey = async () => {
    await refetch();
  };

  return (
    <SurveyContext.Provider value={{ survey: survey ?? null, refetchSurvey }}>
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
