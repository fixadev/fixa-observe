import { z } from "zod";



export type CreateBuildingInput = z.infer<typeof createBuildingSchema>;
export const createBuildingSchema = z.object({
    name: z.string(),
    location: z.string(),
    description: z.string(),
    squareFootage: z.number(),
    pricePerSquareFoot: z.number(),
    customProperties: z.record(z.string(), z.string()),
});


export type ImportBuildingsInput = z.infer<typeof importBuildingsInput>;
export const importBuildingsInput = z.array(createBuildingSchema);
