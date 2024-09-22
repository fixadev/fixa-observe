import { z } from "zod";

export type OutcomeInput = z.infer<typeof outcomeInput>;
export const outcomeInput = z.object({
  name: z.string(),
  description: z.string(),
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
