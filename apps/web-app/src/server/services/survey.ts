import { type Survey, type PrismaClient } from "@prisma/client";
import { type CreateSurveyInput } from "~/lib/survey";

export const getProjectSurveys = async (
    projectId: string,
    userId: string,
    db: PrismaClient,
) => {
    const surveys = await db.survey.findMany({
      where: { projectId: projectId, ownerId: userId },
    });
    return surveys;
};

export const getSurveyDetails = async (
    surveyId: string,
    userId: string,
    db: PrismaClient,
) => {
    const survey = await db.survey.findUnique({
      where: { id: surveyId, ownerId: userId }
    });
    return survey;
};

export const createSurvey = async (
    input: CreateSurveyInput,
    userId: string,
    db: PrismaClient,
) => {
    const survey = await db.survey.create({
      data: { name: input.surveyName, projectId: input.projectId, ownerId: userId }
    });
    return survey;
};

export const updateSurvey = async (
    survey: Survey,
    userId: string,
    db: PrismaClient,
) => {
    const result = await db.survey.update({
      where: { id: survey.id, ownerId: userId },
      data: survey
    });
    return result;
};

export const deleteSurvey = async (
    surveyId: string,
    userId: string,
    db: PrismaClient,
) => {
    const survey = await db.survey.delete({
      where: { id: surveyId, ownerId: userId }
    });
    return survey;
};

