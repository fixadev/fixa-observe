import { z } from "zod";

export type OutcomeInput = z.infer<typeof outcomeInput>;
export const outcomeInput = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectInput>;
export const createProjectInput = z.object({
  projectName: z.string(),
  outcomes: z.array(outcomeInput),
});

export type UpdateProjectInput = z.infer<typeof updateProjectInput>;
export const updateProjectInput = z.object({
  projectId: z.string(),
  projectName: z.string(),
  outcomes: z.array(outcomeInput),
});

