import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createSurveyInput, surveySchema } from "~/lib/survey";
import { SurveySchema } from "../../../../prisma/generated/zod";
import {
  attributeSchema,
  createPropertySchema,
  importPropertiesInput,
  propertySchema,
} from "~/lib/property";
import { surveyService } from "~/server/services/survey";
import { propertyService } from "~/server/services/property";
import { db } from "~/server/db";

const surveyServiceInstance = surveyService({ db });
const propertyServiceInstance = propertyService({ db });

export const surveyRouter = createTRPCRouter({
  createSurvey: protectedProcedure
    .input(createSurveyInput)
    .mutation(async ({ ctx, input }) => {
      return await surveyServiceInstance.createSurvey(input, ctx.user.id);
    }),

  getProjectSurveys: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await surveyServiceInstance.getProjectSurveys(
        input.projectId,
        ctx.user.id,
      );
    }),

  getSurvey: protectedProcedure
    .input(z.object({ surveyId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await surveyServiceInstance.getSurvey(input.surveyId, ctx.user.id);
    }),

  getSurveyAttributes: protectedProcedure
    .input(z.object({ surveyId: z.string() }))
    .query(async ({ ctx, input }) => {
      const attributes = await surveyServiceInstance.getSurveyAttributes(
        input.surveyId,
      );
      if (attributes.length === 0) {
        // get basic attributes
        return await surveyServiceInstance.getAttributes(ctx.user.id);
      }
      return attributes;
    }),

  updateAttributes: protectedProcedure
    .input(
      z.object({
        surveyId: z.string(),
        attributes: z.array(attributeSchema),
        action: z.enum(["order", "add", "update", "delete"]),
        attributeId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.action === "order") {
        return await surveyServiceInstance.updateAttributesOrder(
          input.surveyId,
          input.attributes,
          ctx.user.id,
        );
      } else if (input.action === "add") {
        return await surveyServiceInstance.addAttributes(
          input.surveyId,
          input.attributes,
          ctx.user.id,
        );
      } else if (input.action === "update") {
        return await surveyServiceInstance.updateAttributes(
          input.attributes,
          input.attributeId,
          ctx.user.id,
        );
      } else if (input.action === "delete") {
        return await surveyServiceInstance.deleteAttribute(
          input.surveyId,
          input.attributeId,
        );
      }
    }),

  addPropertiesToSurvey: protectedProcedure
    .input(importPropertiesInput)
    .mutation(async ({ ctx, input }) => {
      const propertyIds = await propertyServiceInstance.createProperties(
        input.properties,
        ctx.user.id,
      );
      return await surveyServiceInstance.addPropertiesToSurvey(
        input.surveyId,
        propertyIds,
        ctx.user.id,
      );
    }),

  updateSurvey: protectedProcedure
    .input(surveySchema)
    .mutation(async ({ ctx, input }) => {
      return await surveyServiceInstance.updateSurvey(input, ctx.user.id);
    }),

  updateProperties: protectedProcedure
    .input(
      z.discriminatedUnion("action", [
        z.object({
          surveyId: z.string(),
          action: z.literal("add"),
          properties: z.array(
            createPropertySchema.extend({
              id: z.string().optional(),
              ownerId: z.string().optional(),
            }),
          ),
          propertyId: z.string().optional(),
        }),
        z.object({
          surveyId: z.string(),
          action: z.enum(["order", "update", "delete"]),
          properties: z.array(propertySchema),
          propertyId: z.string().optional(),
        }),
      ]),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.action === "order") {
        return await surveyServiceInstance.updatePropertiesOrder(
          input.surveyId,
          input.properties,
          ctx.user.id,
        );
      } else if (input.action === "add") {
        console.log("PROPERTIES BEFORE FILTER", input.properties);
        const propertiesToCreate = input.properties
          .filter(
            (property) => typeof property === "object" && !("id" in property),
          )
          .map((property) => ({
            ...property,
            ownerId: ctx.user.id,
          }));
        console.log("PROPERTIES TO CREATE", propertiesToCreate);
        const propertyIds = await propertyServiceInstance.createProperties(
          propertiesToCreate,
          ctx.user.id,
        );
        return await surveyServiceInstance.addPropertiesToSurvey(
          input.surveyId,
          propertyIds,
          ctx.user.id,
        );
      } else if (input.action === "update") {
        console.log("UPDATING PROPERTY", input.propertyId);
        const propertyToUpdate = input.properties.find(
          (property) => property.id === input.propertyId,
        );
        if (!propertyToUpdate) return null;
        return await propertyServiceInstance.updateProperty(
          propertyToUpdate,
          ctx.user.id,
        );
      } else if (input.action === "delete") {
        if (!input.propertyId) return null;
        return await propertyServiceInstance.deleteProperty(
          input.propertyId,
          ctx.user.id,
        );
      }
    }),

  deleteSurvey: protectedProcedure
    .input(z.object({ surveyId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await surveyServiceInstance.deleteSurvey(
        input.surveyId,
        ctx.user.id,
      );
    }),
});
