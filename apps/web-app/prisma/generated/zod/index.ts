import { z } from 'zod';
import { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = Prisma.JsonValue | null | 'JsonNull' | 'DbNull' | Prisma.NullTypes.DbNull | Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return Prisma.DbNull;
  if (v === 'JsonNull') return Prisma.JsonNull;
  return v;
};

export const JsonValueSchema: z.ZodType<Prisma.JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.literal(null),
    z.record(z.lazy(() => JsonValueSchema.optional())),
    z.array(z.lazy(() => JsonValueSchema)),
  ])
);

export type JsonValueType = z.infer<typeof JsonValueSchema>;

export const NullableJsonValue = z
  .union([JsonValueSchema, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({ toJSON: z.function(z.tuple([]), z.any()) }),
    z.record(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
    z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
  ])
);

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','clerkId','email','firstName','lastName']);

export const ProjectScalarFieldEnumSchema = z.enum(['id','ownerId','name','createdAt','updatedAt']);

export const SurveyScalarFieldEnumSchema = z.enum(['id','ownerId','createdAt','updatedAt','name','projectId']);

export const PropertyScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','ownerId','address','photoUrl','attributes','surveyId']);

export const AttributeScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','label','type','ownerId','surveyId']);

export const BrochureScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','url','title','propertyId']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const NullableJsonNullValueInputSchema = z.enum(['DbNull','JsonNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.DbNull : value);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.JsonNull : value === 'AnyNull' ? Prisma.AnyNull : value);
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string(),
  clerkId: z.string(),
  email: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// PROJECT SCHEMA
/////////////////////////////////////////

export const ProjectSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  name: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Project = z.infer<typeof ProjectSchema>

/////////////////////////////////////////
// SURVEY SCHEMA
/////////////////////////////////////////

export const SurveySchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  name: z.string(),
  projectId: z.string(),
})

export type Survey = z.infer<typeof SurveySchema>

/////////////////////////////////////////
// PROPERTY SCHEMA
/////////////////////////////////////////

export const PropertySchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  ownerId: z.string(),
  address: z.string(),
  photoUrl: z.string().nullable(),
  attributes: JsonValueSchema.nullable(),
  surveyId: z.string(),
})

export type Property = z.infer<typeof PropertySchema>

/////////////////////////////////////////
// ATTRIBUTE SCHEMA
/////////////////////////////////////////

export const AttributeSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  label: z.string(),
  type: z.string(),
  ownerId: z.string().nullable(),
  surveyId: z.string().nullable(),
})

export type Attribute = z.infer<typeof AttributeSchema>

/////////////////////////////////////////
// BROCHURE SCHEMA
/////////////////////////////////////////

export const BrochureSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  url: z.string(),
  title: z.string(),
  propertyId: z.string(),
})

export type Brochure = z.infer<typeof BrochureSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  projects: z.union([z.boolean(),z.lazy(() => ProjectFindManyArgsSchema)]).optional(),
  properties: z.union([z.boolean(),z.lazy(() => PropertyFindManyArgsSchema)]).optional(),
  attributes: z.union([z.boolean(),z.lazy(() => AttributeFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  projects: z.boolean().optional(),
  properties: z.boolean().optional(),
  attributes: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  clerkId: z.boolean().optional(),
  email: z.boolean().optional(),
  firstName: z.boolean().optional(),
  lastName: z.boolean().optional(),
  projects: z.union([z.boolean(),z.lazy(() => ProjectFindManyArgsSchema)]).optional(),
  properties: z.union([z.boolean(),z.lazy(() => PropertyFindManyArgsSchema)]).optional(),
  attributes: z.union([z.boolean(),z.lazy(() => AttributeFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// PROJECT
//------------------------------------------------------

export const ProjectIncludeSchema: z.ZodType<Prisma.ProjectInclude> = z.object({
  owner: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  surveys: z.union([z.boolean(),z.lazy(() => SurveyFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ProjectCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const ProjectArgsSchema: z.ZodType<Prisma.ProjectDefaultArgs> = z.object({
  select: z.lazy(() => ProjectSelectSchema).optional(),
  include: z.lazy(() => ProjectIncludeSchema).optional(),
}).strict();

export const ProjectCountOutputTypeArgsSchema: z.ZodType<Prisma.ProjectCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ProjectCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ProjectCountOutputTypeSelectSchema: z.ZodType<Prisma.ProjectCountOutputTypeSelect> = z.object({
  surveys: z.boolean().optional(),
}).strict();

export const ProjectSelectSchema: z.ZodType<Prisma.ProjectSelect> = z.object({
  id: z.boolean().optional(),
  ownerId: z.boolean().optional(),
  name: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  owner: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  surveys: z.union([z.boolean(),z.lazy(() => SurveyFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ProjectCountOutputTypeArgsSchema)]).optional(),
}).strict()

// SURVEY
//------------------------------------------------------

export const SurveyIncludeSchema: z.ZodType<Prisma.SurveyInclude> = z.object({
  project: z.union([z.boolean(),z.lazy(() => ProjectArgsSchema)]).optional(),
  properties: z.union([z.boolean(),z.lazy(() => PropertyFindManyArgsSchema)]).optional(),
  attributesOrder: z.union([z.boolean(),z.lazy(() => AttributeFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => SurveyCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const SurveyArgsSchema: z.ZodType<Prisma.SurveyDefaultArgs> = z.object({
  select: z.lazy(() => SurveySelectSchema).optional(),
  include: z.lazy(() => SurveyIncludeSchema).optional(),
}).strict();

export const SurveyCountOutputTypeArgsSchema: z.ZodType<Prisma.SurveyCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => SurveyCountOutputTypeSelectSchema).nullish(),
}).strict();

export const SurveyCountOutputTypeSelectSchema: z.ZodType<Prisma.SurveyCountOutputTypeSelect> = z.object({
  properties: z.boolean().optional(),
  attributesOrder: z.boolean().optional(),
}).strict();

export const SurveySelectSchema: z.ZodType<Prisma.SurveySelect> = z.object({
  id: z.boolean().optional(),
  ownerId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  name: z.boolean().optional(),
  projectId: z.boolean().optional(),
  project: z.union([z.boolean(),z.lazy(() => ProjectArgsSchema)]).optional(),
  properties: z.union([z.boolean(),z.lazy(() => PropertyFindManyArgsSchema)]).optional(),
  attributesOrder: z.union([z.boolean(),z.lazy(() => AttributeFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => SurveyCountOutputTypeArgsSchema)]).optional(),
}).strict()

// PROPERTY
//------------------------------------------------------

export const PropertyIncludeSchema: z.ZodType<Prisma.PropertyInclude> = z.object({
  owner: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  brochures: z.union([z.boolean(),z.lazy(() => BrochureFindManyArgsSchema)]).optional(),
  survey: z.union([z.boolean(),z.lazy(() => SurveyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => PropertyCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const PropertyArgsSchema: z.ZodType<Prisma.PropertyDefaultArgs> = z.object({
  select: z.lazy(() => PropertySelectSchema).optional(),
  include: z.lazy(() => PropertyIncludeSchema).optional(),
}).strict();

export const PropertyCountOutputTypeArgsSchema: z.ZodType<Prisma.PropertyCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => PropertyCountOutputTypeSelectSchema).nullish(),
}).strict();

export const PropertyCountOutputTypeSelectSchema: z.ZodType<Prisma.PropertyCountOutputTypeSelect> = z.object({
  brochures: z.boolean().optional(),
}).strict();

export const PropertySelectSchema: z.ZodType<Prisma.PropertySelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  ownerId: z.boolean().optional(),
  address: z.boolean().optional(),
  photoUrl: z.boolean().optional(),
  attributes: z.boolean().optional(),
  surveyId: z.boolean().optional(),
  owner: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  brochures: z.union([z.boolean(),z.lazy(() => BrochureFindManyArgsSchema)]).optional(),
  survey: z.union([z.boolean(),z.lazy(() => SurveyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => PropertyCountOutputTypeArgsSchema)]).optional(),
}).strict()

// ATTRIBUTE
//------------------------------------------------------

export const AttributeIncludeSchema: z.ZodType<Prisma.AttributeInclude> = z.object({
  owner: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  Survey: z.union([z.boolean(),z.lazy(() => SurveyArgsSchema)]).optional(),
}).strict()

export const AttributeArgsSchema: z.ZodType<Prisma.AttributeDefaultArgs> = z.object({
  select: z.lazy(() => AttributeSelectSchema).optional(),
  include: z.lazy(() => AttributeIncludeSchema).optional(),
}).strict();

export const AttributeSelectSchema: z.ZodType<Prisma.AttributeSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  label: z.boolean().optional(),
  type: z.boolean().optional(),
  ownerId: z.boolean().optional(),
  surveyId: z.boolean().optional(),
  owner: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  Survey: z.union([z.boolean(),z.lazy(() => SurveyArgsSchema)]).optional(),
}).strict()

// BROCHURE
//------------------------------------------------------

export const BrochureIncludeSchema: z.ZodType<Prisma.BrochureInclude> = z.object({
  property: z.union([z.boolean(),z.lazy(() => PropertyArgsSchema)]).optional(),
}).strict()

export const BrochureArgsSchema: z.ZodType<Prisma.BrochureDefaultArgs> = z.object({
  select: z.lazy(() => BrochureSelectSchema).optional(),
  include: z.lazy(() => BrochureIncludeSchema).optional(),
}).strict();

export const BrochureSelectSchema: z.ZodType<Prisma.BrochureSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  url: z.boolean().optional(),
  title: z.boolean().optional(),
  propertyId: z.boolean().optional(),
  property: z.union([z.boolean(),z.lazy(() => PropertyArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  clerkId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  firstName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  lastName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  projects: z.lazy(() => ProjectListRelationFilterSchema).optional(),
  properties: z.lazy(() => PropertyListRelationFilterSchema).optional(),
  attributes: z.lazy(() => AttributeListRelationFilterSchema).optional()
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  clerkId: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  lastName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  projects: z.lazy(() => ProjectOrderByRelationAggregateInputSchema).optional(),
  properties: z.lazy(() => PropertyOrderByRelationAggregateInputSchema).optional(),
  attributes: z.lazy(() => AttributeOrderByRelationAggregateInputSchema).optional()
}).strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.string(),
    clerkId: z.string(),
    email: z.string()
  }),
  z.object({
    id: z.string(),
    clerkId: z.string(),
  }),
  z.object({
    id: z.string(),
    email: z.string(),
  }),
  z.object({
    id: z.string(),
  }),
  z.object({
    clerkId: z.string(),
    email: z.string(),
  }),
  z.object({
    clerkId: z.string(),
  }),
  z.object({
    email: z.string(),
  }),
])
.and(z.object({
  id: z.string().optional(),
  clerkId: z.string().optional(),
  email: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  firstName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  lastName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  projects: z.lazy(() => ProjectListRelationFilterSchema).optional(),
  properties: z.lazy(() => PropertyListRelationFilterSchema).optional(),
  attributes: z.lazy(() => AttributeListRelationFilterSchema).optional()
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  clerkId: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  lastName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional()
}).strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  clerkId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  firstName: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  lastName: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const ProjectWhereInputSchema: z.ZodType<Prisma.ProjectWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProjectWhereInputSchema),z.lazy(() => ProjectWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProjectWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProjectWhereInputSchema),z.lazy(() => ProjectWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  owner: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  surveys: z.lazy(() => SurveyListRelationFilterSchema).optional()
}).strict();

export const ProjectOrderByWithRelationInputSchema: z.ZodType<Prisma.ProjectOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  owner: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  surveys: z.lazy(() => SurveyOrderByRelationAggregateInputSchema).optional()
}).strict();

export const ProjectWhereUniqueInputSchema: z.ZodType<Prisma.ProjectWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => ProjectWhereInputSchema),z.lazy(() => ProjectWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProjectWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProjectWhereInputSchema),z.lazy(() => ProjectWhereInputSchema).array() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  owner: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  surveys: z.lazy(() => SurveyListRelationFilterSchema).optional()
}).strict());

export const ProjectOrderByWithAggregationInputSchema: z.ZodType<Prisma.ProjectOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ProjectCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ProjectMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ProjectMinOrderByAggregateInputSchema).optional()
}).strict();

export const ProjectScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ProjectScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ProjectScalarWhereWithAggregatesInputSchema),z.lazy(() => ProjectScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProjectScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProjectScalarWhereWithAggregatesInputSchema),z.lazy(() => ProjectScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const SurveyWhereInputSchema: z.ZodType<Prisma.SurveyWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SurveyWhereInputSchema),z.lazy(() => SurveyWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SurveyWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SurveyWhereInputSchema),z.lazy(() => SurveyWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  projectId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  project: z.union([ z.lazy(() => ProjectRelationFilterSchema),z.lazy(() => ProjectWhereInputSchema) ]).optional(),
  properties: z.lazy(() => PropertyListRelationFilterSchema).optional(),
  attributesOrder: z.lazy(() => AttributeListRelationFilterSchema).optional()
}).strict();

export const SurveyOrderByWithRelationInputSchema: z.ZodType<Prisma.SurveyOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  project: z.lazy(() => ProjectOrderByWithRelationInputSchema).optional(),
  properties: z.lazy(() => PropertyOrderByRelationAggregateInputSchema).optional(),
  attributesOrder: z.lazy(() => AttributeOrderByRelationAggregateInputSchema).optional()
}).strict();

export const SurveyWhereUniqueInputSchema: z.ZodType<Prisma.SurveyWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => SurveyWhereInputSchema),z.lazy(() => SurveyWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SurveyWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SurveyWhereInputSchema),z.lazy(() => SurveyWhereInputSchema).array() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  projectId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  project: z.union([ z.lazy(() => ProjectRelationFilterSchema),z.lazy(() => ProjectWhereInputSchema) ]).optional(),
  properties: z.lazy(() => PropertyListRelationFilterSchema).optional(),
  attributesOrder: z.lazy(() => AttributeListRelationFilterSchema).optional()
}).strict());

export const SurveyOrderByWithAggregationInputSchema: z.ZodType<Prisma.SurveyOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => SurveyCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => SurveyMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => SurveyMinOrderByAggregateInputSchema).optional()
}).strict();

export const SurveyScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.SurveyScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => SurveyScalarWhereWithAggregatesInputSchema),z.lazy(() => SurveyScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => SurveyScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SurveyScalarWhereWithAggregatesInputSchema),z.lazy(() => SurveyScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  projectId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const PropertyWhereInputSchema: z.ZodType<Prisma.PropertyWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PropertyWhereInputSchema),z.lazy(() => PropertyWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PropertyWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PropertyWhereInputSchema),z.lazy(() => PropertyWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  address: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  photoUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  attributes: z.lazy(() => JsonNullableFilterSchema).optional(),
  surveyId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  owner: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  brochures: z.lazy(() => BrochureListRelationFilterSchema).optional(),
  survey: z.union([ z.lazy(() => SurveyRelationFilterSchema),z.lazy(() => SurveyWhereInputSchema) ]).optional(),
}).strict();

export const PropertyOrderByWithRelationInputSchema: z.ZodType<Prisma.PropertyOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  photoUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  attributes: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  surveyId: z.lazy(() => SortOrderSchema).optional(),
  owner: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  brochures: z.lazy(() => BrochureOrderByRelationAggregateInputSchema).optional(),
  survey: z.lazy(() => SurveyOrderByWithRelationInputSchema).optional()
}).strict();

export const PropertyWhereUniqueInputSchema: z.ZodType<Prisma.PropertyWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => PropertyWhereInputSchema),z.lazy(() => PropertyWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PropertyWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PropertyWhereInputSchema),z.lazy(() => PropertyWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  address: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  photoUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  attributes: z.lazy(() => JsonNullableFilterSchema).optional(),
  surveyId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  owner: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  brochures: z.lazy(() => BrochureListRelationFilterSchema).optional(),
  survey: z.union([ z.lazy(() => SurveyRelationFilterSchema),z.lazy(() => SurveyWhereInputSchema) ]).optional(),
}).strict());

export const PropertyOrderByWithAggregationInputSchema: z.ZodType<Prisma.PropertyOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  photoUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  attributes: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  surveyId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PropertyCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PropertyMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PropertyMinOrderByAggregateInputSchema).optional()
}).strict();

export const PropertyScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PropertyScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PropertyScalarWhereWithAggregatesInputSchema),z.lazy(() => PropertyScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PropertyScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PropertyScalarWhereWithAggregatesInputSchema),z.lazy(() => PropertyScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  address: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  photoUrl: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  attributes: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  surveyId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const AttributeWhereInputSchema: z.ZodType<Prisma.AttributeWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AttributeWhereInputSchema),z.lazy(() => AttributeWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AttributeWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AttributeWhereInputSchema),z.lazy(() => AttributeWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  label: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  surveyId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  owner: z.union([ z.lazy(() => UserNullableRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
  Survey: z.union([ z.lazy(() => SurveyNullableRelationFilterSchema),z.lazy(() => SurveyWhereInputSchema) ]).optional().nullable(),
}).strict();

export const AttributeOrderByWithRelationInputSchema: z.ZodType<Prisma.AttributeOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  label: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  surveyId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  owner: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  Survey: z.lazy(() => SurveyOrderByWithRelationInputSchema).optional()
}).strict();

export const AttributeWhereUniqueInputSchema: z.ZodType<Prisma.AttributeWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => AttributeWhereInputSchema),z.lazy(() => AttributeWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AttributeWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AttributeWhereInputSchema),z.lazy(() => AttributeWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  label: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  surveyId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  owner: z.union([ z.lazy(() => UserNullableRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
  Survey: z.union([ z.lazy(() => SurveyNullableRelationFilterSchema),z.lazy(() => SurveyWhereInputSchema) ]).optional().nullable(),
}).strict());

export const AttributeOrderByWithAggregationInputSchema: z.ZodType<Prisma.AttributeOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  label: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  surveyId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => AttributeCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AttributeMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AttributeMinOrderByAggregateInputSchema).optional()
}).strict();

export const AttributeScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AttributeScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => AttributeScalarWhereWithAggregatesInputSchema),z.lazy(() => AttributeScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AttributeScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AttributeScalarWhereWithAggregatesInputSchema),z.lazy(() => AttributeScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  label: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  surveyId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const BrochureWhereInputSchema: z.ZodType<Prisma.BrochureWhereInput> = z.object({
  AND: z.union([ z.lazy(() => BrochureWhereInputSchema),z.lazy(() => BrochureWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BrochureWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BrochureWhereInputSchema),z.lazy(() => BrochureWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  url: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  propertyId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  property: z.union([ z.lazy(() => PropertyRelationFilterSchema),z.lazy(() => PropertyWhereInputSchema) ]).optional(),
}).strict();

export const BrochureOrderByWithRelationInputSchema: z.ZodType<Prisma.BrochureOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  propertyId: z.lazy(() => SortOrderSchema).optional(),
  property: z.lazy(() => PropertyOrderByWithRelationInputSchema).optional()
}).strict();

export const BrochureWhereUniqueInputSchema: z.ZodType<Prisma.BrochureWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => BrochureWhereInputSchema),z.lazy(() => BrochureWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BrochureWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BrochureWhereInputSchema),z.lazy(() => BrochureWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  url: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  propertyId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  property: z.union([ z.lazy(() => PropertyRelationFilterSchema),z.lazy(() => PropertyWhereInputSchema) ]).optional(),
}).strict());

export const BrochureOrderByWithAggregationInputSchema: z.ZodType<Prisma.BrochureOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  propertyId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => BrochureCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => BrochureMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => BrochureMinOrderByAggregateInputSchema).optional()
}).strict();

export const BrochureScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.BrochureScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => BrochureScalarWhereWithAggregatesInputSchema),z.lazy(() => BrochureScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => BrochureScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BrochureScalarWhereWithAggregatesInputSchema),z.lazy(() => BrochureScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  url: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  propertyId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  id: z.string().optional(),
  clerkId: z.string(),
  email: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  projects: z.lazy(() => ProjectCreateNestedManyWithoutOwnerInputSchema).optional(),
  properties: z.lazy(() => PropertyCreateNestedManyWithoutOwnerInputSchema).optional(),
  attributes: z.lazy(() => AttributeCreateNestedManyWithoutOwnerInputSchema).optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  clerkId: z.string(),
  email: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  projects: z.lazy(() => ProjectUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  properties: z.lazy(() => PropertyUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  attributes: z.lazy(() => AttributeUncheckedCreateNestedManyWithoutOwnerInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  projects: z.lazy(() => ProjectUpdateManyWithoutOwnerNestedInputSchema).optional(),
  properties: z.lazy(() => PropertyUpdateManyWithoutOwnerNestedInputSchema).optional(),
  attributes: z.lazy(() => AttributeUpdateManyWithoutOwnerNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  projects: z.lazy(() => ProjectUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  properties: z.lazy(() => PropertyUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  attributes: z.lazy(() => AttributeUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional()
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.string().optional(),
  clerkId: z.string(),
  email: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable()
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ProjectCreateInputSchema: z.ZodType<Prisma.ProjectCreateInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  owner: z.lazy(() => UserCreateNestedOneWithoutProjectsInputSchema),
  surveys: z.lazy(() => SurveyCreateNestedManyWithoutProjectInputSchema).optional()
}).strict();

export const ProjectUncheckedCreateInputSchema: z.ZodType<Prisma.ProjectUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  ownerId: z.string(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  surveys: z.lazy(() => SurveyUncheckedCreateNestedManyWithoutProjectInputSchema).optional()
}).strict();

export const ProjectUpdateInputSchema: z.ZodType<Prisma.ProjectUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutProjectsNestedInputSchema).optional(),
  surveys: z.lazy(() => SurveyUpdateManyWithoutProjectNestedInputSchema).optional()
}).strict();

export const ProjectUncheckedUpdateInputSchema: z.ZodType<Prisma.ProjectUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  surveys: z.lazy(() => SurveyUncheckedUpdateManyWithoutProjectNestedInputSchema).optional()
}).strict();

export const ProjectCreateManyInputSchema: z.ZodType<Prisma.ProjectCreateManyInput> = z.object({
  id: z.string().optional(),
  ownerId: z.string(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProjectUpdateManyMutationInputSchema: z.ZodType<Prisma.ProjectUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProjectUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ProjectUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SurveyCreateInputSchema: z.ZodType<Prisma.SurveyCreateInput> = z.object({
  id: z.string().optional(),
  ownerId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  project: z.lazy(() => ProjectCreateNestedOneWithoutSurveysInputSchema),
  properties: z.lazy(() => PropertyCreateNestedManyWithoutSurveyInputSchema).optional(),
  attributesOrder: z.lazy(() => AttributeCreateNestedManyWithoutSurveyInputSchema).optional()
}).strict();

export const SurveyUncheckedCreateInputSchema: z.ZodType<Prisma.SurveyUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  ownerId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  projectId: z.string(),
  properties: z.lazy(() => PropertyUncheckedCreateNestedManyWithoutSurveyInputSchema).optional(),
  attributesOrder: z.lazy(() => AttributeUncheckedCreateNestedManyWithoutSurveyInputSchema).optional()
}).strict();

export const SurveyUpdateInputSchema: z.ZodType<Prisma.SurveyUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  project: z.lazy(() => ProjectUpdateOneRequiredWithoutSurveysNestedInputSchema).optional(),
  properties: z.lazy(() => PropertyUpdateManyWithoutSurveyNestedInputSchema).optional(),
  attributesOrder: z.lazy(() => AttributeUpdateManyWithoutSurveyNestedInputSchema).optional()
}).strict();

export const SurveyUncheckedUpdateInputSchema: z.ZodType<Prisma.SurveyUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  properties: z.lazy(() => PropertyUncheckedUpdateManyWithoutSurveyNestedInputSchema).optional(),
  attributesOrder: z.lazy(() => AttributeUncheckedUpdateManyWithoutSurveyNestedInputSchema).optional()
}).strict();

export const SurveyCreateManyInputSchema: z.ZodType<Prisma.SurveyCreateManyInput> = z.object({
  id: z.string().optional(),
  ownerId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  projectId: z.string()
}).strict();

export const SurveyUpdateManyMutationInputSchema: z.ZodType<Prisma.SurveyUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SurveyUncheckedUpdateManyInputSchema: z.ZodType<Prisma.SurveyUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PropertyCreateInputSchema: z.ZodType<Prisma.PropertyCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  address: z.string(),
  photoUrl: z.string().optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  owner: z.lazy(() => UserCreateNestedOneWithoutPropertiesInputSchema),
  brochures: z.lazy(() => BrochureCreateNestedManyWithoutPropertyInputSchema).optional(),
  survey: z.lazy(() => SurveyCreateNestedOneWithoutPropertiesInputSchema)
}).strict();

export const PropertyUncheckedCreateInputSchema: z.ZodType<Prisma.PropertyUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  ownerId: z.string(),
  address: z.string(),
  photoUrl: z.string().optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  surveyId: z.string(),
  brochures: z.lazy(() => BrochureUncheckedCreateNestedManyWithoutPropertyInputSchema).optional()
}).strict();

export const PropertyUpdateInputSchema: z.ZodType<Prisma.PropertyUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  photoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutPropertiesNestedInputSchema).optional(),
  brochures: z.lazy(() => BrochureUpdateManyWithoutPropertyNestedInputSchema).optional(),
  survey: z.lazy(() => SurveyUpdateOneRequiredWithoutPropertiesNestedInputSchema).optional()
}).strict();

export const PropertyUncheckedUpdateInputSchema: z.ZodType<Prisma.PropertyUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  photoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  surveyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  brochures: z.lazy(() => BrochureUncheckedUpdateManyWithoutPropertyNestedInputSchema).optional()
}).strict();

export const PropertyCreateManyInputSchema: z.ZodType<Prisma.PropertyCreateManyInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  ownerId: z.string(),
  address: z.string(),
  photoUrl: z.string().optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  surveyId: z.string()
}).strict();

export const PropertyUpdateManyMutationInputSchema: z.ZodType<Prisma.PropertyUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  photoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const PropertyUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PropertyUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  photoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  surveyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AttributeCreateInputSchema: z.ZodType<Prisma.AttributeCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  label: z.string(),
  type: z.string(),
  owner: z.lazy(() => UserCreateNestedOneWithoutAttributesInputSchema).optional(),
  Survey: z.lazy(() => SurveyCreateNestedOneWithoutAttributesOrderInputSchema).optional()
}).strict();

export const AttributeUncheckedCreateInputSchema: z.ZodType<Prisma.AttributeUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  label: z.string(),
  type: z.string(),
  ownerId: z.string().optional().nullable(),
  surveyId: z.string().optional().nullable()
}).strict();

export const AttributeUpdateInputSchema: z.ZodType<Prisma.AttributeUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneWithoutAttributesNestedInputSchema).optional(),
  Survey: z.lazy(() => SurveyUpdateOneWithoutAttributesOrderNestedInputSchema).optional()
}).strict();

export const AttributeUncheckedUpdateInputSchema: z.ZodType<Prisma.AttributeUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  surveyId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AttributeCreateManyInputSchema: z.ZodType<Prisma.AttributeCreateManyInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  label: z.string(),
  type: z.string(),
  ownerId: z.string().optional().nullable(),
  surveyId: z.string().optional().nullable()
}).strict();

export const AttributeUpdateManyMutationInputSchema: z.ZodType<Prisma.AttributeUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AttributeUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AttributeUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  surveyId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const BrochureCreateInputSchema: z.ZodType<Prisma.BrochureCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  url: z.string(),
  title: z.string(),
  property: z.lazy(() => PropertyCreateNestedOneWithoutBrochuresInputSchema)
}).strict();

export const BrochureUncheckedCreateInputSchema: z.ZodType<Prisma.BrochureUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  url: z.string(),
  title: z.string(),
  propertyId: z.string()
}).strict();

export const BrochureUpdateInputSchema: z.ZodType<Prisma.BrochureUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  property: z.lazy(() => PropertyUpdateOneRequiredWithoutBrochuresNestedInputSchema).optional()
}).strict();

export const BrochureUncheckedUpdateInputSchema: z.ZodType<Prisma.BrochureUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  propertyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BrochureCreateManyInputSchema: z.ZodType<Prisma.BrochureCreateManyInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  url: z.string(),
  title: z.string(),
  propertyId: z.string()
}).strict();

export const BrochureUpdateManyMutationInputSchema: z.ZodType<Prisma.BrochureUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BrochureUncheckedUpdateManyInputSchema: z.ZodType<Prisma.BrochureUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  propertyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const ProjectListRelationFilterSchema: z.ZodType<Prisma.ProjectListRelationFilter> = z.object({
  every: z.lazy(() => ProjectWhereInputSchema).optional(),
  some: z.lazy(() => ProjectWhereInputSchema).optional(),
  none: z.lazy(() => ProjectWhereInputSchema).optional()
}).strict();

export const PropertyListRelationFilterSchema: z.ZodType<Prisma.PropertyListRelationFilter> = z.object({
  every: z.lazy(() => PropertyWhereInputSchema).optional(),
  some: z.lazy(() => PropertyWhereInputSchema).optional(),
  none: z.lazy(() => PropertyWhereInputSchema).optional()
}).strict();

export const AttributeListRelationFilterSchema: z.ZodType<Prisma.AttributeListRelationFilter> = z.object({
  every: z.lazy(() => AttributeWhereInputSchema).optional(),
  some: z.lazy(() => AttributeWhereInputSchema).optional(),
  none: z.lazy(() => AttributeWhereInputSchema).optional()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const ProjectOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ProjectOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PropertyOrderByRelationAggregateInputSchema: z.ZodType<Prisma.PropertyOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AttributeOrderByRelationAggregateInputSchema: z.ZodType<Prisma.AttributeOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  clerkId: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  clerkId: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  clerkId: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const UserRelationFilterSchema: z.ZodType<Prisma.UserRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const SurveyListRelationFilterSchema: z.ZodType<Prisma.SurveyListRelationFilter> = z.object({
  every: z.lazy(() => SurveyWhereInputSchema).optional(),
  some: z.lazy(() => SurveyWhereInputSchema).optional(),
  none: z.lazy(() => SurveyWhereInputSchema).optional()
}).strict();

export const SurveyOrderByRelationAggregateInputSchema: z.ZodType<Prisma.SurveyOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProjectCountOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProjectMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProjectMinOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const ProjectRelationFilterSchema: z.ZodType<Prisma.ProjectRelationFilter> = z.object({
  is: z.lazy(() => ProjectWhereInputSchema).optional(),
  isNot: z.lazy(() => ProjectWhereInputSchema).optional()
}).strict();

export const SurveyCountOrderByAggregateInputSchema: z.ZodType<Prisma.SurveyCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SurveyMaxOrderByAggregateInputSchema: z.ZodType<Prisma.SurveyMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SurveyMinOrderByAggregateInputSchema: z.ZodType<Prisma.SurveyMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const JsonNullableFilterSchema: z.ZodType<Prisma.JsonNullableFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const BrochureListRelationFilterSchema: z.ZodType<Prisma.BrochureListRelationFilter> = z.object({
  every: z.lazy(() => BrochureWhereInputSchema).optional(),
  some: z.lazy(() => BrochureWhereInputSchema).optional(),
  none: z.lazy(() => BrochureWhereInputSchema).optional()
}).strict();

export const SurveyRelationFilterSchema: z.ZodType<Prisma.SurveyRelationFilter> = z.object({
  is: z.lazy(() => SurveyWhereInputSchema).optional(),
  isNot: z.lazy(() => SurveyWhereInputSchema).optional()
}).strict();

export const BrochureOrderByRelationAggregateInputSchema: z.ZodType<Prisma.BrochureOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PropertyCountOrderByAggregateInputSchema: z.ZodType<Prisma.PropertyCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  photoUrl: z.lazy(() => SortOrderSchema).optional(),
  attributes: z.lazy(() => SortOrderSchema).optional(),
  surveyId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PropertyMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PropertyMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  photoUrl: z.lazy(() => SortOrderSchema).optional(),
  surveyId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PropertyMinOrderByAggregateInputSchema: z.ZodType<Prisma.PropertyMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  photoUrl: z.lazy(() => SortOrderSchema).optional(),
  surveyId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const JsonNullableWithAggregatesFilterSchema: z.ZodType<Prisma.JsonNullableWithAggregatesFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonNullableFilterSchema).optional()
}).strict();

export const UserNullableRelationFilterSchema: z.ZodType<Prisma.UserNullableRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => UserWhereInputSchema).optional().nullable()
}).strict();

export const SurveyNullableRelationFilterSchema: z.ZodType<Prisma.SurveyNullableRelationFilter> = z.object({
  is: z.lazy(() => SurveyWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => SurveyWhereInputSchema).optional().nullable()
}).strict();

export const AttributeCountOrderByAggregateInputSchema: z.ZodType<Prisma.AttributeCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  label: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  surveyId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AttributeMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AttributeMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  label: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  surveyId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AttributeMinOrderByAggregateInputSchema: z.ZodType<Prisma.AttributeMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  label: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  surveyId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PropertyRelationFilterSchema: z.ZodType<Prisma.PropertyRelationFilter> = z.object({
  is: z.lazy(() => PropertyWhereInputSchema).optional(),
  isNot: z.lazy(() => PropertyWhereInputSchema).optional()
}).strict();

export const BrochureCountOrderByAggregateInputSchema: z.ZodType<Prisma.BrochureCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  propertyId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BrochureMaxOrderByAggregateInputSchema: z.ZodType<Prisma.BrochureMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  propertyId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BrochureMinOrderByAggregateInputSchema: z.ZodType<Prisma.BrochureMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  propertyId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProjectCreateNestedManyWithoutOwnerInputSchema: z.ZodType<Prisma.ProjectCreateNestedManyWithoutOwnerInput> = z.object({
  create: z.union([ z.lazy(() => ProjectCreateWithoutOwnerInputSchema),z.lazy(() => ProjectCreateWithoutOwnerInputSchema).array(),z.lazy(() => ProjectUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProjectCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => ProjectCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProjectCreateManyOwnerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProjectWhereUniqueInputSchema),z.lazy(() => ProjectWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PropertyCreateNestedManyWithoutOwnerInputSchema: z.ZodType<Prisma.PropertyCreateNestedManyWithoutOwnerInput> = z.object({
  create: z.union([ z.lazy(() => PropertyCreateWithoutOwnerInputSchema),z.lazy(() => PropertyCreateWithoutOwnerInputSchema).array(),z.lazy(() => PropertyUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => PropertyUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PropertyCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => PropertyCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PropertyCreateManyOwnerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PropertyWhereUniqueInputSchema),z.lazy(() => PropertyWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AttributeCreateNestedManyWithoutOwnerInputSchema: z.ZodType<Prisma.AttributeCreateNestedManyWithoutOwnerInput> = z.object({
  create: z.union([ z.lazy(() => AttributeCreateWithoutOwnerInputSchema),z.lazy(() => AttributeCreateWithoutOwnerInputSchema).array(),z.lazy(() => AttributeUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => AttributeUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AttributeCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => AttributeCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AttributeCreateManyOwnerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AttributeWhereUniqueInputSchema),z.lazy(() => AttributeWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProjectUncheckedCreateNestedManyWithoutOwnerInputSchema: z.ZodType<Prisma.ProjectUncheckedCreateNestedManyWithoutOwnerInput> = z.object({
  create: z.union([ z.lazy(() => ProjectCreateWithoutOwnerInputSchema),z.lazy(() => ProjectCreateWithoutOwnerInputSchema).array(),z.lazy(() => ProjectUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProjectCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => ProjectCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProjectCreateManyOwnerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProjectWhereUniqueInputSchema),z.lazy(() => ProjectWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PropertyUncheckedCreateNestedManyWithoutOwnerInputSchema: z.ZodType<Prisma.PropertyUncheckedCreateNestedManyWithoutOwnerInput> = z.object({
  create: z.union([ z.lazy(() => PropertyCreateWithoutOwnerInputSchema),z.lazy(() => PropertyCreateWithoutOwnerInputSchema).array(),z.lazy(() => PropertyUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => PropertyUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PropertyCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => PropertyCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PropertyCreateManyOwnerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PropertyWhereUniqueInputSchema),z.lazy(() => PropertyWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AttributeUncheckedCreateNestedManyWithoutOwnerInputSchema: z.ZodType<Prisma.AttributeUncheckedCreateNestedManyWithoutOwnerInput> = z.object({
  create: z.union([ z.lazy(() => AttributeCreateWithoutOwnerInputSchema),z.lazy(() => AttributeCreateWithoutOwnerInputSchema).array(),z.lazy(() => AttributeUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => AttributeUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AttributeCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => AttributeCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AttributeCreateManyOwnerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AttributeWhereUniqueInputSchema),z.lazy(() => AttributeWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const ProjectUpdateManyWithoutOwnerNestedInputSchema: z.ZodType<Prisma.ProjectUpdateManyWithoutOwnerNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProjectCreateWithoutOwnerInputSchema),z.lazy(() => ProjectCreateWithoutOwnerInputSchema).array(),z.lazy(() => ProjectUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProjectCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => ProjectCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProjectUpsertWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => ProjectUpsertWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProjectCreateManyOwnerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProjectWhereUniqueInputSchema),z.lazy(() => ProjectWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProjectWhereUniqueInputSchema),z.lazy(() => ProjectWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProjectWhereUniqueInputSchema),z.lazy(() => ProjectWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProjectWhereUniqueInputSchema),z.lazy(() => ProjectWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProjectUpdateWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => ProjectUpdateWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProjectUpdateManyWithWhereWithoutOwnerInputSchema),z.lazy(() => ProjectUpdateManyWithWhereWithoutOwnerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProjectScalarWhereInputSchema),z.lazy(() => ProjectScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PropertyUpdateManyWithoutOwnerNestedInputSchema: z.ZodType<Prisma.PropertyUpdateManyWithoutOwnerNestedInput> = z.object({
  create: z.union([ z.lazy(() => PropertyCreateWithoutOwnerInputSchema),z.lazy(() => PropertyCreateWithoutOwnerInputSchema).array(),z.lazy(() => PropertyUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => PropertyUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PropertyCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => PropertyCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PropertyUpsertWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => PropertyUpsertWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PropertyCreateManyOwnerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PropertyWhereUniqueInputSchema),z.lazy(() => PropertyWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PropertyWhereUniqueInputSchema),z.lazy(() => PropertyWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PropertyWhereUniqueInputSchema),z.lazy(() => PropertyWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PropertyWhereUniqueInputSchema),z.lazy(() => PropertyWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PropertyUpdateWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => PropertyUpdateWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PropertyUpdateManyWithWhereWithoutOwnerInputSchema),z.lazy(() => PropertyUpdateManyWithWhereWithoutOwnerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PropertyScalarWhereInputSchema),z.lazy(() => PropertyScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AttributeUpdateManyWithoutOwnerNestedInputSchema: z.ZodType<Prisma.AttributeUpdateManyWithoutOwnerNestedInput> = z.object({
  create: z.union([ z.lazy(() => AttributeCreateWithoutOwnerInputSchema),z.lazy(() => AttributeCreateWithoutOwnerInputSchema).array(),z.lazy(() => AttributeUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => AttributeUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AttributeCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => AttributeCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AttributeUpsertWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => AttributeUpsertWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AttributeCreateManyOwnerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AttributeWhereUniqueInputSchema),z.lazy(() => AttributeWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AttributeWhereUniqueInputSchema),z.lazy(() => AttributeWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AttributeWhereUniqueInputSchema),z.lazy(() => AttributeWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AttributeWhereUniqueInputSchema),z.lazy(() => AttributeWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AttributeUpdateWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => AttributeUpdateWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AttributeUpdateManyWithWhereWithoutOwnerInputSchema),z.lazy(() => AttributeUpdateManyWithWhereWithoutOwnerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AttributeScalarWhereInputSchema),z.lazy(() => AttributeScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProjectUncheckedUpdateManyWithoutOwnerNestedInputSchema: z.ZodType<Prisma.ProjectUncheckedUpdateManyWithoutOwnerNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProjectCreateWithoutOwnerInputSchema),z.lazy(() => ProjectCreateWithoutOwnerInputSchema).array(),z.lazy(() => ProjectUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProjectCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => ProjectCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProjectUpsertWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => ProjectUpsertWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProjectCreateManyOwnerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProjectWhereUniqueInputSchema),z.lazy(() => ProjectWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProjectWhereUniqueInputSchema),z.lazy(() => ProjectWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProjectWhereUniqueInputSchema),z.lazy(() => ProjectWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProjectWhereUniqueInputSchema),z.lazy(() => ProjectWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProjectUpdateWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => ProjectUpdateWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProjectUpdateManyWithWhereWithoutOwnerInputSchema),z.lazy(() => ProjectUpdateManyWithWhereWithoutOwnerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProjectScalarWhereInputSchema),z.lazy(() => ProjectScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PropertyUncheckedUpdateManyWithoutOwnerNestedInputSchema: z.ZodType<Prisma.PropertyUncheckedUpdateManyWithoutOwnerNestedInput> = z.object({
  create: z.union([ z.lazy(() => PropertyCreateWithoutOwnerInputSchema),z.lazy(() => PropertyCreateWithoutOwnerInputSchema).array(),z.lazy(() => PropertyUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => PropertyUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PropertyCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => PropertyCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PropertyUpsertWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => PropertyUpsertWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PropertyCreateManyOwnerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PropertyWhereUniqueInputSchema),z.lazy(() => PropertyWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PropertyWhereUniqueInputSchema),z.lazy(() => PropertyWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PropertyWhereUniqueInputSchema),z.lazy(() => PropertyWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PropertyWhereUniqueInputSchema),z.lazy(() => PropertyWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PropertyUpdateWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => PropertyUpdateWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PropertyUpdateManyWithWhereWithoutOwnerInputSchema),z.lazy(() => PropertyUpdateManyWithWhereWithoutOwnerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PropertyScalarWhereInputSchema),z.lazy(() => PropertyScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AttributeUncheckedUpdateManyWithoutOwnerNestedInputSchema: z.ZodType<Prisma.AttributeUncheckedUpdateManyWithoutOwnerNestedInput> = z.object({
  create: z.union([ z.lazy(() => AttributeCreateWithoutOwnerInputSchema),z.lazy(() => AttributeCreateWithoutOwnerInputSchema).array(),z.lazy(() => AttributeUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => AttributeUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AttributeCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => AttributeCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AttributeUpsertWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => AttributeUpsertWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AttributeCreateManyOwnerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AttributeWhereUniqueInputSchema),z.lazy(() => AttributeWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AttributeWhereUniqueInputSchema),z.lazy(() => AttributeWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AttributeWhereUniqueInputSchema),z.lazy(() => AttributeWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AttributeWhereUniqueInputSchema),z.lazy(() => AttributeWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AttributeUpdateWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => AttributeUpdateWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AttributeUpdateManyWithWhereWithoutOwnerInputSchema),z.lazy(() => AttributeUpdateManyWithWhereWithoutOwnerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AttributeScalarWhereInputSchema),z.lazy(() => AttributeScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutProjectsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutProjectsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutProjectsInputSchema),z.lazy(() => UserUncheckedCreateWithoutProjectsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutProjectsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const SurveyCreateNestedManyWithoutProjectInputSchema: z.ZodType<Prisma.SurveyCreateNestedManyWithoutProjectInput> = z.object({
  create: z.union([ z.lazy(() => SurveyCreateWithoutProjectInputSchema),z.lazy(() => SurveyCreateWithoutProjectInputSchema).array(),z.lazy(() => SurveyUncheckedCreateWithoutProjectInputSchema),z.lazy(() => SurveyUncheckedCreateWithoutProjectInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SurveyCreateOrConnectWithoutProjectInputSchema),z.lazy(() => SurveyCreateOrConnectWithoutProjectInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SurveyCreateManyProjectInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SurveyWhereUniqueInputSchema),z.lazy(() => SurveyWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SurveyUncheckedCreateNestedManyWithoutProjectInputSchema: z.ZodType<Prisma.SurveyUncheckedCreateNestedManyWithoutProjectInput> = z.object({
  create: z.union([ z.lazy(() => SurveyCreateWithoutProjectInputSchema),z.lazy(() => SurveyCreateWithoutProjectInputSchema).array(),z.lazy(() => SurveyUncheckedCreateWithoutProjectInputSchema),z.lazy(() => SurveyUncheckedCreateWithoutProjectInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SurveyCreateOrConnectWithoutProjectInputSchema),z.lazy(() => SurveyCreateOrConnectWithoutProjectInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SurveyCreateManyProjectInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SurveyWhereUniqueInputSchema),z.lazy(() => SurveyWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const UserUpdateOneRequiredWithoutProjectsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutProjectsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutProjectsInputSchema),z.lazy(() => UserUncheckedCreateWithoutProjectsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutProjectsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutProjectsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutProjectsInputSchema),z.lazy(() => UserUpdateWithoutProjectsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutProjectsInputSchema) ]).optional(),
}).strict();

export const SurveyUpdateManyWithoutProjectNestedInputSchema: z.ZodType<Prisma.SurveyUpdateManyWithoutProjectNestedInput> = z.object({
  create: z.union([ z.lazy(() => SurveyCreateWithoutProjectInputSchema),z.lazy(() => SurveyCreateWithoutProjectInputSchema).array(),z.lazy(() => SurveyUncheckedCreateWithoutProjectInputSchema),z.lazy(() => SurveyUncheckedCreateWithoutProjectInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SurveyCreateOrConnectWithoutProjectInputSchema),z.lazy(() => SurveyCreateOrConnectWithoutProjectInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SurveyUpsertWithWhereUniqueWithoutProjectInputSchema),z.lazy(() => SurveyUpsertWithWhereUniqueWithoutProjectInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SurveyCreateManyProjectInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SurveyWhereUniqueInputSchema),z.lazy(() => SurveyWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SurveyWhereUniqueInputSchema),z.lazy(() => SurveyWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SurveyWhereUniqueInputSchema),z.lazy(() => SurveyWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SurveyWhereUniqueInputSchema),z.lazy(() => SurveyWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SurveyUpdateWithWhereUniqueWithoutProjectInputSchema),z.lazy(() => SurveyUpdateWithWhereUniqueWithoutProjectInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SurveyUpdateManyWithWhereWithoutProjectInputSchema),z.lazy(() => SurveyUpdateManyWithWhereWithoutProjectInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SurveyScalarWhereInputSchema),z.lazy(() => SurveyScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SurveyUncheckedUpdateManyWithoutProjectNestedInputSchema: z.ZodType<Prisma.SurveyUncheckedUpdateManyWithoutProjectNestedInput> = z.object({
  create: z.union([ z.lazy(() => SurveyCreateWithoutProjectInputSchema),z.lazy(() => SurveyCreateWithoutProjectInputSchema).array(),z.lazy(() => SurveyUncheckedCreateWithoutProjectInputSchema),z.lazy(() => SurveyUncheckedCreateWithoutProjectInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SurveyCreateOrConnectWithoutProjectInputSchema),z.lazy(() => SurveyCreateOrConnectWithoutProjectInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SurveyUpsertWithWhereUniqueWithoutProjectInputSchema),z.lazy(() => SurveyUpsertWithWhereUniqueWithoutProjectInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SurveyCreateManyProjectInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SurveyWhereUniqueInputSchema),z.lazy(() => SurveyWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SurveyWhereUniqueInputSchema),z.lazy(() => SurveyWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SurveyWhereUniqueInputSchema),z.lazy(() => SurveyWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SurveyWhereUniqueInputSchema),z.lazy(() => SurveyWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SurveyUpdateWithWhereUniqueWithoutProjectInputSchema),z.lazy(() => SurveyUpdateWithWhereUniqueWithoutProjectInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SurveyUpdateManyWithWhereWithoutProjectInputSchema),z.lazy(() => SurveyUpdateManyWithWhereWithoutProjectInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SurveyScalarWhereInputSchema),z.lazy(() => SurveyScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProjectCreateNestedOneWithoutSurveysInputSchema: z.ZodType<Prisma.ProjectCreateNestedOneWithoutSurveysInput> = z.object({
  create: z.union([ z.lazy(() => ProjectCreateWithoutSurveysInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutSurveysInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProjectCreateOrConnectWithoutSurveysInputSchema).optional(),
  connect: z.lazy(() => ProjectWhereUniqueInputSchema).optional()
}).strict();

export const PropertyCreateNestedManyWithoutSurveyInputSchema: z.ZodType<Prisma.PropertyCreateNestedManyWithoutSurveyInput> = z.object({
  create: z.union([ z.lazy(() => PropertyCreateWithoutSurveyInputSchema),z.lazy(() => PropertyCreateWithoutSurveyInputSchema).array(),z.lazy(() => PropertyUncheckedCreateWithoutSurveyInputSchema),z.lazy(() => PropertyUncheckedCreateWithoutSurveyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PropertyCreateOrConnectWithoutSurveyInputSchema),z.lazy(() => PropertyCreateOrConnectWithoutSurveyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PropertyCreateManySurveyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PropertyWhereUniqueInputSchema),z.lazy(() => PropertyWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AttributeCreateNestedManyWithoutSurveyInputSchema: z.ZodType<Prisma.AttributeCreateNestedManyWithoutSurveyInput> = z.object({
  create: z.union([ z.lazy(() => AttributeCreateWithoutSurveyInputSchema),z.lazy(() => AttributeCreateWithoutSurveyInputSchema).array(),z.lazy(() => AttributeUncheckedCreateWithoutSurveyInputSchema),z.lazy(() => AttributeUncheckedCreateWithoutSurveyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AttributeCreateOrConnectWithoutSurveyInputSchema),z.lazy(() => AttributeCreateOrConnectWithoutSurveyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AttributeCreateManySurveyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AttributeWhereUniqueInputSchema),z.lazy(() => AttributeWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PropertyUncheckedCreateNestedManyWithoutSurveyInputSchema: z.ZodType<Prisma.PropertyUncheckedCreateNestedManyWithoutSurveyInput> = z.object({
  create: z.union([ z.lazy(() => PropertyCreateWithoutSurveyInputSchema),z.lazy(() => PropertyCreateWithoutSurveyInputSchema).array(),z.lazy(() => PropertyUncheckedCreateWithoutSurveyInputSchema),z.lazy(() => PropertyUncheckedCreateWithoutSurveyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PropertyCreateOrConnectWithoutSurveyInputSchema),z.lazy(() => PropertyCreateOrConnectWithoutSurveyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PropertyCreateManySurveyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PropertyWhereUniqueInputSchema),z.lazy(() => PropertyWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AttributeUncheckedCreateNestedManyWithoutSurveyInputSchema: z.ZodType<Prisma.AttributeUncheckedCreateNestedManyWithoutSurveyInput> = z.object({
  create: z.union([ z.lazy(() => AttributeCreateWithoutSurveyInputSchema),z.lazy(() => AttributeCreateWithoutSurveyInputSchema).array(),z.lazy(() => AttributeUncheckedCreateWithoutSurveyInputSchema),z.lazy(() => AttributeUncheckedCreateWithoutSurveyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AttributeCreateOrConnectWithoutSurveyInputSchema),z.lazy(() => AttributeCreateOrConnectWithoutSurveyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AttributeCreateManySurveyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AttributeWhereUniqueInputSchema),z.lazy(() => AttributeWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProjectUpdateOneRequiredWithoutSurveysNestedInputSchema: z.ZodType<Prisma.ProjectUpdateOneRequiredWithoutSurveysNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProjectCreateWithoutSurveysInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutSurveysInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProjectCreateOrConnectWithoutSurveysInputSchema).optional(),
  upsert: z.lazy(() => ProjectUpsertWithoutSurveysInputSchema).optional(),
  connect: z.lazy(() => ProjectWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProjectUpdateToOneWithWhereWithoutSurveysInputSchema),z.lazy(() => ProjectUpdateWithoutSurveysInputSchema),z.lazy(() => ProjectUncheckedUpdateWithoutSurveysInputSchema) ]).optional(),
}).strict();

export const PropertyUpdateManyWithoutSurveyNestedInputSchema: z.ZodType<Prisma.PropertyUpdateManyWithoutSurveyNestedInput> = z.object({
  create: z.union([ z.lazy(() => PropertyCreateWithoutSurveyInputSchema),z.lazy(() => PropertyCreateWithoutSurveyInputSchema).array(),z.lazy(() => PropertyUncheckedCreateWithoutSurveyInputSchema),z.lazy(() => PropertyUncheckedCreateWithoutSurveyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PropertyCreateOrConnectWithoutSurveyInputSchema),z.lazy(() => PropertyCreateOrConnectWithoutSurveyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PropertyUpsertWithWhereUniqueWithoutSurveyInputSchema),z.lazy(() => PropertyUpsertWithWhereUniqueWithoutSurveyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PropertyCreateManySurveyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PropertyWhereUniqueInputSchema),z.lazy(() => PropertyWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PropertyWhereUniqueInputSchema),z.lazy(() => PropertyWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PropertyWhereUniqueInputSchema),z.lazy(() => PropertyWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PropertyWhereUniqueInputSchema),z.lazy(() => PropertyWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PropertyUpdateWithWhereUniqueWithoutSurveyInputSchema),z.lazy(() => PropertyUpdateWithWhereUniqueWithoutSurveyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PropertyUpdateManyWithWhereWithoutSurveyInputSchema),z.lazy(() => PropertyUpdateManyWithWhereWithoutSurveyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PropertyScalarWhereInputSchema),z.lazy(() => PropertyScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AttributeUpdateManyWithoutSurveyNestedInputSchema: z.ZodType<Prisma.AttributeUpdateManyWithoutSurveyNestedInput> = z.object({
  create: z.union([ z.lazy(() => AttributeCreateWithoutSurveyInputSchema),z.lazy(() => AttributeCreateWithoutSurveyInputSchema).array(),z.lazy(() => AttributeUncheckedCreateWithoutSurveyInputSchema),z.lazy(() => AttributeUncheckedCreateWithoutSurveyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AttributeCreateOrConnectWithoutSurveyInputSchema),z.lazy(() => AttributeCreateOrConnectWithoutSurveyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AttributeUpsertWithWhereUniqueWithoutSurveyInputSchema),z.lazy(() => AttributeUpsertWithWhereUniqueWithoutSurveyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AttributeCreateManySurveyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AttributeWhereUniqueInputSchema),z.lazy(() => AttributeWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AttributeWhereUniqueInputSchema),z.lazy(() => AttributeWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AttributeWhereUniqueInputSchema),z.lazy(() => AttributeWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AttributeWhereUniqueInputSchema),z.lazy(() => AttributeWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AttributeUpdateWithWhereUniqueWithoutSurveyInputSchema),z.lazy(() => AttributeUpdateWithWhereUniqueWithoutSurveyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AttributeUpdateManyWithWhereWithoutSurveyInputSchema),z.lazy(() => AttributeUpdateManyWithWhereWithoutSurveyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AttributeScalarWhereInputSchema),z.lazy(() => AttributeScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PropertyUncheckedUpdateManyWithoutSurveyNestedInputSchema: z.ZodType<Prisma.PropertyUncheckedUpdateManyWithoutSurveyNestedInput> = z.object({
  create: z.union([ z.lazy(() => PropertyCreateWithoutSurveyInputSchema),z.lazy(() => PropertyCreateWithoutSurveyInputSchema).array(),z.lazy(() => PropertyUncheckedCreateWithoutSurveyInputSchema),z.lazy(() => PropertyUncheckedCreateWithoutSurveyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PropertyCreateOrConnectWithoutSurveyInputSchema),z.lazy(() => PropertyCreateOrConnectWithoutSurveyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PropertyUpsertWithWhereUniqueWithoutSurveyInputSchema),z.lazy(() => PropertyUpsertWithWhereUniqueWithoutSurveyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PropertyCreateManySurveyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PropertyWhereUniqueInputSchema),z.lazy(() => PropertyWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PropertyWhereUniqueInputSchema),z.lazy(() => PropertyWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PropertyWhereUniqueInputSchema),z.lazy(() => PropertyWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PropertyWhereUniqueInputSchema),z.lazy(() => PropertyWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PropertyUpdateWithWhereUniqueWithoutSurveyInputSchema),z.lazy(() => PropertyUpdateWithWhereUniqueWithoutSurveyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PropertyUpdateManyWithWhereWithoutSurveyInputSchema),z.lazy(() => PropertyUpdateManyWithWhereWithoutSurveyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PropertyScalarWhereInputSchema),z.lazy(() => PropertyScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AttributeUncheckedUpdateManyWithoutSurveyNestedInputSchema: z.ZodType<Prisma.AttributeUncheckedUpdateManyWithoutSurveyNestedInput> = z.object({
  create: z.union([ z.lazy(() => AttributeCreateWithoutSurveyInputSchema),z.lazy(() => AttributeCreateWithoutSurveyInputSchema).array(),z.lazy(() => AttributeUncheckedCreateWithoutSurveyInputSchema),z.lazy(() => AttributeUncheckedCreateWithoutSurveyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AttributeCreateOrConnectWithoutSurveyInputSchema),z.lazy(() => AttributeCreateOrConnectWithoutSurveyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AttributeUpsertWithWhereUniqueWithoutSurveyInputSchema),z.lazy(() => AttributeUpsertWithWhereUniqueWithoutSurveyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AttributeCreateManySurveyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AttributeWhereUniqueInputSchema),z.lazy(() => AttributeWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AttributeWhereUniqueInputSchema),z.lazy(() => AttributeWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AttributeWhereUniqueInputSchema),z.lazy(() => AttributeWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AttributeWhereUniqueInputSchema),z.lazy(() => AttributeWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AttributeUpdateWithWhereUniqueWithoutSurveyInputSchema),z.lazy(() => AttributeUpdateWithWhereUniqueWithoutSurveyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AttributeUpdateManyWithWhereWithoutSurveyInputSchema),z.lazy(() => AttributeUpdateManyWithWhereWithoutSurveyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AttributeScalarWhereInputSchema),z.lazy(() => AttributeScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutPropertiesInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutPropertiesInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutPropertiesInputSchema),z.lazy(() => UserUncheckedCreateWithoutPropertiesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutPropertiesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const BrochureCreateNestedManyWithoutPropertyInputSchema: z.ZodType<Prisma.BrochureCreateNestedManyWithoutPropertyInput> = z.object({
  create: z.union([ z.lazy(() => BrochureCreateWithoutPropertyInputSchema),z.lazy(() => BrochureCreateWithoutPropertyInputSchema).array(),z.lazy(() => BrochureUncheckedCreateWithoutPropertyInputSchema),z.lazy(() => BrochureUncheckedCreateWithoutPropertyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BrochureCreateOrConnectWithoutPropertyInputSchema),z.lazy(() => BrochureCreateOrConnectWithoutPropertyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BrochureCreateManyPropertyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => BrochureWhereUniqueInputSchema),z.lazy(() => BrochureWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SurveyCreateNestedOneWithoutPropertiesInputSchema: z.ZodType<Prisma.SurveyCreateNestedOneWithoutPropertiesInput> = z.object({
  create: z.union([ z.lazy(() => SurveyCreateWithoutPropertiesInputSchema),z.lazy(() => SurveyUncheckedCreateWithoutPropertiesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SurveyCreateOrConnectWithoutPropertiesInputSchema).optional(),
  connect: z.lazy(() => SurveyWhereUniqueInputSchema).optional()
}).strict();

export const BrochureUncheckedCreateNestedManyWithoutPropertyInputSchema: z.ZodType<Prisma.BrochureUncheckedCreateNestedManyWithoutPropertyInput> = z.object({
  create: z.union([ z.lazy(() => BrochureCreateWithoutPropertyInputSchema),z.lazy(() => BrochureCreateWithoutPropertyInputSchema).array(),z.lazy(() => BrochureUncheckedCreateWithoutPropertyInputSchema),z.lazy(() => BrochureUncheckedCreateWithoutPropertyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BrochureCreateOrConnectWithoutPropertyInputSchema),z.lazy(() => BrochureCreateOrConnectWithoutPropertyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BrochureCreateManyPropertyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => BrochureWhereUniqueInputSchema),z.lazy(() => BrochureWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutPropertiesNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutPropertiesNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutPropertiesInputSchema),z.lazy(() => UserUncheckedCreateWithoutPropertiesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutPropertiesInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutPropertiesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutPropertiesInputSchema),z.lazy(() => UserUpdateWithoutPropertiesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutPropertiesInputSchema) ]).optional(),
}).strict();

export const BrochureUpdateManyWithoutPropertyNestedInputSchema: z.ZodType<Prisma.BrochureUpdateManyWithoutPropertyNestedInput> = z.object({
  create: z.union([ z.lazy(() => BrochureCreateWithoutPropertyInputSchema),z.lazy(() => BrochureCreateWithoutPropertyInputSchema).array(),z.lazy(() => BrochureUncheckedCreateWithoutPropertyInputSchema),z.lazy(() => BrochureUncheckedCreateWithoutPropertyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BrochureCreateOrConnectWithoutPropertyInputSchema),z.lazy(() => BrochureCreateOrConnectWithoutPropertyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => BrochureUpsertWithWhereUniqueWithoutPropertyInputSchema),z.lazy(() => BrochureUpsertWithWhereUniqueWithoutPropertyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BrochureCreateManyPropertyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => BrochureWhereUniqueInputSchema),z.lazy(() => BrochureWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => BrochureWhereUniqueInputSchema),z.lazy(() => BrochureWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => BrochureWhereUniqueInputSchema),z.lazy(() => BrochureWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => BrochureWhereUniqueInputSchema),z.lazy(() => BrochureWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => BrochureUpdateWithWhereUniqueWithoutPropertyInputSchema),z.lazy(() => BrochureUpdateWithWhereUniqueWithoutPropertyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => BrochureUpdateManyWithWhereWithoutPropertyInputSchema),z.lazy(() => BrochureUpdateManyWithWhereWithoutPropertyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => BrochureScalarWhereInputSchema),z.lazy(() => BrochureScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SurveyUpdateOneRequiredWithoutPropertiesNestedInputSchema: z.ZodType<Prisma.SurveyUpdateOneRequiredWithoutPropertiesNestedInput> = z.object({
  create: z.union([ z.lazy(() => SurveyCreateWithoutPropertiesInputSchema),z.lazy(() => SurveyUncheckedCreateWithoutPropertiesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SurveyCreateOrConnectWithoutPropertiesInputSchema).optional(),
  upsert: z.lazy(() => SurveyUpsertWithoutPropertiesInputSchema).optional(),
  connect: z.lazy(() => SurveyWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => SurveyUpdateToOneWithWhereWithoutPropertiesInputSchema),z.lazy(() => SurveyUpdateWithoutPropertiesInputSchema),z.lazy(() => SurveyUncheckedUpdateWithoutPropertiesInputSchema) ]).optional(),
}).strict();

export const BrochureUncheckedUpdateManyWithoutPropertyNestedInputSchema: z.ZodType<Prisma.BrochureUncheckedUpdateManyWithoutPropertyNestedInput> = z.object({
  create: z.union([ z.lazy(() => BrochureCreateWithoutPropertyInputSchema),z.lazy(() => BrochureCreateWithoutPropertyInputSchema).array(),z.lazy(() => BrochureUncheckedCreateWithoutPropertyInputSchema),z.lazy(() => BrochureUncheckedCreateWithoutPropertyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BrochureCreateOrConnectWithoutPropertyInputSchema),z.lazy(() => BrochureCreateOrConnectWithoutPropertyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => BrochureUpsertWithWhereUniqueWithoutPropertyInputSchema),z.lazy(() => BrochureUpsertWithWhereUniqueWithoutPropertyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BrochureCreateManyPropertyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => BrochureWhereUniqueInputSchema),z.lazy(() => BrochureWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => BrochureWhereUniqueInputSchema),z.lazy(() => BrochureWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => BrochureWhereUniqueInputSchema),z.lazy(() => BrochureWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => BrochureWhereUniqueInputSchema),z.lazy(() => BrochureWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => BrochureUpdateWithWhereUniqueWithoutPropertyInputSchema),z.lazy(() => BrochureUpdateWithWhereUniqueWithoutPropertyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => BrochureUpdateManyWithWhereWithoutPropertyInputSchema),z.lazy(() => BrochureUpdateManyWithWhereWithoutPropertyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => BrochureScalarWhereInputSchema),z.lazy(() => BrochureScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutAttributesInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutAttributesInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutAttributesInputSchema),z.lazy(() => UserUncheckedCreateWithoutAttributesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAttributesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const SurveyCreateNestedOneWithoutAttributesOrderInputSchema: z.ZodType<Prisma.SurveyCreateNestedOneWithoutAttributesOrderInput> = z.object({
  create: z.union([ z.lazy(() => SurveyCreateWithoutAttributesOrderInputSchema),z.lazy(() => SurveyUncheckedCreateWithoutAttributesOrderInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SurveyCreateOrConnectWithoutAttributesOrderInputSchema).optional(),
  connect: z.lazy(() => SurveyWhereUniqueInputSchema).optional()
}).strict();

export const UserUpdateOneWithoutAttributesNestedInputSchema: z.ZodType<Prisma.UserUpdateOneWithoutAttributesNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutAttributesInputSchema),z.lazy(() => UserUncheckedCreateWithoutAttributesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAttributesInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutAttributesInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutAttributesInputSchema),z.lazy(() => UserUpdateWithoutAttributesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAttributesInputSchema) ]).optional(),
}).strict();

export const SurveyUpdateOneWithoutAttributesOrderNestedInputSchema: z.ZodType<Prisma.SurveyUpdateOneWithoutAttributesOrderNestedInput> = z.object({
  create: z.union([ z.lazy(() => SurveyCreateWithoutAttributesOrderInputSchema),z.lazy(() => SurveyUncheckedCreateWithoutAttributesOrderInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SurveyCreateOrConnectWithoutAttributesOrderInputSchema).optional(),
  upsert: z.lazy(() => SurveyUpsertWithoutAttributesOrderInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => SurveyWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => SurveyWhereInputSchema) ]).optional(),
  connect: z.lazy(() => SurveyWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => SurveyUpdateToOneWithWhereWithoutAttributesOrderInputSchema),z.lazy(() => SurveyUpdateWithoutAttributesOrderInputSchema),z.lazy(() => SurveyUncheckedUpdateWithoutAttributesOrderInputSchema) ]).optional(),
}).strict();

export const PropertyCreateNestedOneWithoutBrochuresInputSchema: z.ZodType<Prisma.PropertyCreateNestedOneWithoutBrochuresInput> = z.object({
  create: z.union([ z.lazy(() => PropertyCreateWithoutBrochuresInputSchema),z.lazy(() => PropertyUncheckedCreateWithoutBrochuresInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PropertyCreateOrConnectWithoutBrochuresInputSchema).optional(),
  connect: z.lazy(() => PropertyWhereUniqueInputSchema).optional()
}).strict();

export const PropertyUpdateOneRequiredWithoutBrochuresNestedInputSchema: z.ZodType<Prisma.PropertyUpdateOneRequiredWithoutBrochuresNestedInput> = z.object({
  create: z.union([ z.lazy(() => PropertyCreateWithoutBrochuresInputSchema),z.lazy(() => PropertyUncheckedCreateWithoutBrochuresInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PropertyCreateOrConnectWithoutBrochuresInputSchema).optional(),
  upsert: z.lazy(() => PropertyUpsertWithoutBrochuresInputSchema).optional(),
  connect: z.lazy(() => PropertyWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PropertyUpdateToOneWithWhereWithoutBrochuresInputSchema),z.lazy(() => PropertyUpdateWithoutBrochuresInputSchema),z.lazy(() => PropertyUncheckedUpdateWithoutBrochuresInputSchema) ]).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedJsonNullableFilterSchema: z.ZodType<Prisma.NestedJsonNullableFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const ProjectCreateWithoutOwnerInputSchema: z.ZodType<Prisma.ProjectCreateWithoutOwnerInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  surveys: z.lazy(() => SurveyCreateNestedManyWithoutProjectInputSchema).optional()
}).strict();

export const ProjectUncheckedCreateWithoutOwnerInputSchema: z.ZodType<Prisma.ProjectUncheckedCreateWithoutOwnerInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  surveys: z.lazy(() => SurveyUncheckedCreateNestedManyWithoutProjectInputSchema).optional()
}).strict();

export const ProjectCreateOrConnectWithoutOwnerInputSchema: z.ZodType<Prisma.ProjectCreateOrConnectWithoutOwnerInput> = z.object({
  where: z.lazy(() => ProjectWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProjectCreateWithoutOwnerInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutOwnerInputSchema) ]),
}).strict();

export const ProjectCreateManyOwnerInputEnvelopeSchema: z.ZodType<Prisma.ProjectCreateManyOwnerInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ProjectCreateManyOwnerInputSchema),z.lazy(() => ProjectCreateManyOwnerInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const PropertyCreateWithoutOwnerInputSchema: z.ZodType<Prisma.PropertyCreateWithoutOwnerInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  address: z.string(),
  photoUrl: z.string().optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  brochures: z.lazy(() => BrochureCreateNestedManyWithoutPropertyInputSchema).optional(),
  survey: z.lazy(() => SurveyCreateNestedOneWithoutPropertiesInputSchema)
}).strict();

export const PropertyUncheckedCreateWithoutOwnerInputSchema: z.ZodType<Prisma.PropertyUncheckedCreateWithoutOwnerInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  address: z.string(),
  photoUrl: z.string().optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  surveyId: z.string(),
  brochures: z.lazy(() => BrochureUncheckedCreateNestedManyWithoutPropertyInputSchema).optional()
}).strict();

export const PropertyCreateOrConnectWithoutOwnerInputSchema: z.ZodType<Prisma.PropertyCreateOrConnectWithoutOwnerInput> = z.object({
  where: z.lazy(() => PropertyWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PropertyCreateWithoutOwnerInputSchema),z.lazy(() => PropertyUncheckedCreateWithoutOwnerInputSchema) ]),
}).strict();

export const PropertyCreateManyOwnerInputEnvelopeSchema: z.ZodType<Prisma.PropertyCreateManyOwnerInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PropertyCreateManyOwnerInputSchema),z.lazy(() => PropertyCreateManyOwnerInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const AttributeCreateWithoutOwnerInputSchema: z.ZodType<Prisma.AttributeCreateWithoutOwnerInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  label: z.string(),
  type: z.string(),
  Survey: z.lazy(() => SurveyCreateNestedOneWithoutAttributesOrderInputSchema).optional()
}).strict();

export const AttributeUncheckedCreateWithoutOwnerInputSchema: z.ZodType<Prisma.AttributeUncheckedCreateWithoutOwnerInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  label: z.string(),
  type: z.string(),
  surveyId: z.string().optional().nullable()
}).strict();

export const AttributeCreateOrConnectWithoutOwnerInputSchema: z.ZodType<Prisma.AttributeCreateOrConnectWithoutOwnerInput> = z.object({
  where: z.lazy(() => AttributeWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AttributeCreateWithoutOwnerInputSchema),z.lazy(() => AttributeUncheckedCreateWithoutOwnerInputSchema) ]),
}).strict();

export const AttributeCreateManyOwnerInputEnvelopeSchema: z.ZodType<Prisma.AttributeCreateManyOwnerInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => AttributeCreateManyOwnerInputSchema),z.lazy(() => AttributeCreateManyOwnerInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ProjectUpsertWithWhereUniqueWithoutOwnerInputSchema: z.ZodType<Prisma.ProjectUpsertWithWhereUniqueWithoutOwnerInput> = z.object({
  where: z.lazy(() => ProjectWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ProjectUpdateWithoutOwnerInputSchema),z.lazy(() => ProjectUncheckedUpdateWithoutOwnerInputSchema) ]),
  create: z.union([ z.lazy(() => ProjectCreateWithoutOwnerInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutOwnerInputSchema) ]),
}).strict();

export const ProjectUpdateWithWhereUniqueWithoutOwnerInputSchema: z.ZodType<Prisma.ProjectUpdateWithWhereUniqueWithoutOwnerInput> = z.object({
  where: z.lazy(() => ProjectWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ProjectUpdateWithoutOwnerInputSchema),z.lazy(() => ProjectUncheckedUpdateWithoutOwnerInputSchema) ]),
}).strict();

export const ProjectUpdateManyWithWhereWithoutOwnerInputSchema: z.ZodType<Prisma.ProjectUpdateManyWithWhereWithoutOwnerInput> = z.object({
  where: z.lazy(() => ProjectScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ProjectUpdateManyMutationInputSchema),z.lazy(() => ProjectUncheckedUpdateManyWithoutOwnerInputSchema) ]),
}).strict();

export const ProjectScalarWhereInputSchema: z.ZodType<Prisma.ProjectScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProjectScalarWhereInputSchema),z.lazy(() => ProjectScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProjectScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProjectScalarWhereInputSchema),z.lazy(() => ProjectScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const PropertyUpsertWithWhereUniqueWithoutOwnerInputSchema: z.ZodType<Prisma.PropertyUpsertWithWhereUniqueWithoutOwnerInput> = z.object({
  where: z.lazy(() => PropertyWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PropertyUpdateWithoutOwnerInputSchema),z.lazy(() => PropertyUncheckedUpdateWithoutOwnerInputSchema) ]),
  create: z.union([ z.lazy(() => PropertyCreateWithoutOwnerInputSchema),z.lazy(() => PropertyUncheckedCreateWithoutOwnerInputSchema) ]),
}).strict();

export const PropertyUpdateWithWhereUniqueWithoutOwnerInputSchema: z.ZodType<Prisma.PropertyUpdateWithWhereUniqueWithoutOwnerInput> = z.object({
  where: z.lazy(() => PropertyWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PropertyUpdateWithoutOwnerInputSchema),z.lazy(() => PropertyUncheckedUpdateWithoutOwnerInputSchema) ]),
}).strict();

export const PropertyUpdateManyWithWhereWithoutOwnerInputSchema: z.ZodType<Prisma.PropertyUpdateManyWithWhereWithoutOwnerInput> = z.object({
  where: z.lazy(() => PropertyScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PropertyUpdateManyMutationInputSchema),z.lazy(() => PropertyUncheckedUpdateManyWithoutOwnerInputSchema) ]),
}).strict();

export const PropertyScalarWhereInputSchema: z.ZodType<Prisma.PropertyScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PropertyScalarWhereInputSchema),z.lazy(() => PropertyScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PropertyScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PropertyScalarWhereInputSchema),z.lazy(() => PropertyScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  address: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  photoUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  attributes: z.lazy(() => JsonNullableFilterSchema).optional(),
  surveyId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const AttributeUpsertWithWhereUniqueWithoutOwnerInputSchema: z.ZodType<Prisma.AttributeUpsertWithWhereUniqueWithoutOwnerInput> = z.object({
  where: z.lazy(() => AttributeWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => AttributeUpdateWithoutOwnerInputSchema),z.lazy(() => AttributeUncheckedUpdateWithoutOwnerInputSchema) ]),
  create: z.union([ z.lazy(() => AttributeCreateWithoutOwnerInputSchema),z.lazy(() => AttributeUncheckedCreateWithoutOwnerInputSchema) ]),
}).strict();

export const AttributeUpdateWithWhereUniqueWithoutOwnerInputSchema: z.ZodType<Prisma.AttributeUpdateWithWhereUniqueWithoutOwnerInput> = z.object({
  where: z.lazy(() => AttributeWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => AttributeUpdateWithoutOwnerInputSchema),z.lazy(() => AttributeUncheckedUpdateWithoutOwnerInputSchema) ]),
}).strict();

export const AttributeUpdateManyWithWhereWithoutOwnerInputSchema: z.ZodType<Prisma.AttributeUpdateManyWithWhereWithoutOwnerInput> = z.object({
  where: z.lazy(() => AttributeScalarWhereInputSchema),
  data: z.union([ z.lazy(() => AttributeUpdateManyMutationInputSchema),z.lazy(() => AttributeUncheckedUpdateManyWithoutOwnerInputSchema) ]),
}).strict();

export const AttributeScalarWhereInputSchema: z.ZodType<Prisma.AttributeScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AttributeScalarWhereInputSchema),z.lazy(() => AttributeScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AttributeScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AttributeScalarWhereInputSchema),z.lazy(() => AttributeScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  label: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  surveyId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const UserCreateWithoutProjectsInputSchema: z.ZodType<Prisma.UserCreateWithoutProjectsInput> = z.object({
  id: z.string().optional(),
  clerkId: z.string(),
  email: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  properties: z.lazy(() => PropertyCreateNestedManyWithoutOwnerInputSchema).optional(),
  attributes: z.lazy(() => AttributeCreateNestedManyWithoutOwnerInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutProjectsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutProjectsInput> = z.object({
  id: z.string().optional(),
  clerkId: z.string(),
  email: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  properties: z.lazy(() => PropertyUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  attributes: z.lazy(() => AttributeUncheckedCreateNestedManyWithoutOwnerInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutProjectsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutProjectsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutProjectsInputSchema),z.lazy(() => UserUncheckedCreateWithoutProjectsInputSchema) ]),
}).strict();

export const SurveyCreateWithoutProjectInputSchema: z.ZodType<Prisma.SurveyCreateWithoutProjectInput> = z.object({
  id: z.string().optional(),
  ownerId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  properties: z.lazy(() => PropertyCreateNestedManyWithoutSurveyInputSchema).optional(),
  attributesOrder: z.lazy(() => AttributeCreateNestedManyWithoutSurveyInputSchema).optional()
}).strict();

export const SurveyUncheckedCreateWithoutProjectInputSchema: z.ZodType<Prisma.SurveyUncheckedCreateWithoutProjectInput> = z.object({
  id: z.string().optional(),
  ownerId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  properties: z.lazy(() => PropertyUncheckedCreateNestedManyWithoutSurveyInputSchema).optional(),
  attributesOrder: z.lazy(() => AttributeUncheckedCreateNestedManyWithoutSurveyInputSchema).optional()
}).strict();

export const SurveyCreateOrConnectWithoutProjectInputSchema: z.ZodType<Prisma.SurveyCreateOrConnectWithoutProjectInput> = z.object({
  where: z.lazy(() => SurveyWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SurveyCreateWithoutProjectInputSchema),z.lazy(() => SurveyUncheckedCreateWithoutProjectInputSchema) ]),
}).strict();

export const SurveyCreateManyProjectInputEnvelopeSchema: z.ZodType<Prisma.SurveyCreateManyProjectInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => SurveyCreateManyProjectInputSchema),z.lazy(() => SurveyCreateManyProjectInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserUpsertWithoutProjectsInputSchema: z.ZodType<Prisma.UserUpsertWithoutProjectsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutProjectsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutProjectsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutProjectsInputSchema),z.lazy(() => UserUncheckedCreateWithoutProjectsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutProjectsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutProjectsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutProjectsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutProjectsInputSchema) ]),
}).strict();

export const UserUpdateWithoutProjectsInputSchema: z.ZodType<Prisma.UserUpdateWithoutProjectsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  properties: z.lazy(() => PropertyUpdateManyWithoutOwnerNestedInputSchema).optional(),
  attributes: z.lazy(() => AttributeUpdateManyWithoutOwnerNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutProjectsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutProjectsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  properties: z.lazy(() => PropertyUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  attributes: z.lazy(() => AttributeUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional()
}).strict();

export const SurveyUpsertWithWhereUniqueWithoutProjectInputSchema: z.ZodType<Prisma.SurveyUpsertWithWhereUniqueWithoutProjectInput> = z.object({
  where: z.lazy(() => SurveyWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => SurveyUpdateWithoutProjectInputSchema),z.lazy(() => SurveyUncheckedUpdateWithoutProjectInputSchema) ]),
  create: z.union([ z.lazy(() => SurveyCreateWithoutProjectInputSchema),z.lazy(() => SurveyUncheckedCreateWithoutProjectInputSchema) ]),
}).strict();

export const SurveyUpdateWithWhereUniqueWithoutProjectInputSchema: z.ZodType<Prisma.SurveyUpdateWithWhereUniqueWithoutProjectInput> = z.object({
  where: z.lazy(() => SurveyWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => SurveyUpdateWithoutProjectInputSchema),z.lazy(() => SurveyUncheckedUpdateWithoutProjectInputSchema) ]),
}).strict();

export const SurveyUpdateManyWithWhereWithoutProjectInputSchema: z.ZodType<Prisma.SurveyUpdateManyWithWhereWithoutProjectInput> = z.object({
  where: z.lazy(() => SurveyScalarWhereInputSchema),
  data: z.union([ z.lazy(() => SurveyUpdateManyMutationInputSchema),z.lazy(() => SurveyUncheckedUpdateManyWithoutProjectInputSchema) ]),
}).strict();

export const SurveyScalarWhereInputSchema: z.ZodType<Prisma.SurveyScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SurveyScalarWhereInputSchema),z.lazy(() => SurveyScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SurveyScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SurveyScalarWhereInputSchema),z.lazy(() => SurveyScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  projectId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const ProjectCreateWithoutSurveysInputSchema: z.ZodType<Prisma.ProjectCreateWithoutSurveysInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  owner: z.lazy(() => UserCreateNestedOneWithoutProjectsInputSchema)
}).strict();

export const ProjectUncheckedCreateWithoutSurveysInputSchema: z.ZodType<Prisma.ProjectUncheckedCreateWithoutSurveysInput> = z.object({
  id: z.string().optional(),
  ownerId: z.string(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProjectCreateOrConnectWithoutSurveysInputSchema: z.ZodType<Prisma.ProjectCreateOrConnectWithoutSurveysInput> = z.object({
  where: z.lazy(() => ProjectWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProjectCreateWithoutSurveysInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutSurveysInputSchema) ]),
}).strict();

export const PropertyCreateWithoutSurveyInputSchema: z.ZodType<Prisma.PropertyCreateWithoutSurveyInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  address: z.string(),
  photoUrl: z.string().optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  owner: z.lazy(() => UserCreateNestedOneWithoutPropertiesInputSchema),
  brochures: z.lazy(() => BrochureCreateNestedManyWithoutPropertyInputSchema).optional()
}).strict();

export const PropertyUncheckedCreateWithoutSurveyInputSchema: z.ZodType<Prisma.PropertyUncheckedCreateWithoutSurveyInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  ownerId: z.string(),
  address: z.string(),
  photoUrl: z.string().optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  brochures: z.lazy(() => BrochureUncheckedCreateNestedManyWithoutPropertyInputSchema).optional()
}).strict();

export const PropertyCreateOrConnectWithoutSurveyInputSchema: z.ZodType<Prisma.PropertyCreateOrConnectWithoutSurveyInput> = z.object({
  where: z.lazy(() => PropertyWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PropertyCreateWithoutSurveyInputSchema),z.lazy(() => PropertyUncheckedCreateWithoutSurveyInputSchema) ]),
}).strict();

export const PropertyCreateManySurveyInputEnvelopeSchema: z.ZodType<Prisma.PropertyCreateManySurveyInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PropertyCreateManySurveyInputSchema),z.lazy(() => PropertyCreateManySurveyInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const AttributeCreateWithoutSurveyInputSchema: z.ZodType<Prisma.AttributeCreateWithoutSurveyInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  label: z.string(),
  type: z.string(),
  owner: z.lazy(() => UserCreateNestedOneWithoutAttributesInputSchema).optional()
}).strict();

export const AttributeUncheckedCreateWithoutSurveyInputSchema: z.ZodType<Prisma.AttributeUncheckedCreateWithoutSurveyInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  label: z.string(),
  type: z.string(),
  ownerId: z.string().optional().nullable()
}).strict();

export const AttributeCreateOrConnectWithoutSurveyInputSchema: z.ZodType<Prisma.AttributeCreateOrConnectWithoutSurveyInput> = z.object({
  where: z.lazy(() => AttributeWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AttributeCreateWithoutSurveyInputSchema),z.lazy(() => AttributeUncheckedCreateWithoutSurveyInputSchema) ]),
}).strict();

export const AttributeCreateManySurveyInputEnvelopeSchema: z.ZodType<Prisma.AttributeCreateManySurveyInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => AttributeCreateManySurveyInputSchema),z.lazy(() => AttributeCreateManySurveyInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ProjectUpsertWithoutSurveysInputSchema: z.ZodType<Prisma.ProjectUpsertWithoutSurveysInput> = z.object({
  update: z.union([ z.lazy(() => ProjectUpdateWithoutSurveysInputSchema),z.lazy(() => ProjectUncheckedUpdateWithoutSurveysInputSchema) ]),
  create: z.union([ z.lazy(() => ProjectCreateWithoutSurveysInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutSurveysInputSchema) ]),
  where: z.lazy(() => ProjectWhereInputSchema).optional()
}).strict();

export const ProjectUpdateToOneWithWhereWithoutSurveysInputSchema: z.ZodType<Prisma.ProjectUpdateToOneWithWhereWithoutSurveysInput> = z.object({
  where: z.lazy(() => ProjectWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ProjectUpdateWithoutSurveysInputSchema),z.lazy(() => ProjectUncheckedUpdateWithoutSurveysInputSchema) ]),
}).strict();

export const ProjectUpdateWithoutSurveysInputSchema: z.ZodType<Prisma.ProjectUpdateWithoutSurveysInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutProjectsNestedInputSchema).optional()
}).strict();

export const ProjectUncheckedUpdateWithoutSurveysInputSchema: z.ZodType<Prisma.ProjectUncheckedUpdateWithoutSurveysInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PropertyUpsertWithWhereUniqueWithoutSurveyInputSchema: z.ZodType<Prisma.PropertyUpsertWithWhereUniqueWithoutSurveyInput> = z.object({
  where: z.lazy(() => PropertyWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PropertyUpdateWithoutSurveyInputSchema),z.lazy(() => PropertyUncheckedUpdateWithoutSurveyInputSchema) ]),
  create: z.union([ z.lazy(() => PropertyCreateWithoutSurveyInputSchema),z.lazy(() => PropertyUncheckedCreateWithoutSurveyInputSchema) ]),
}).strict();

export const PropertyUpdateWithWhereUniqueWithoutSurveyInputSchema: z.ZodType<Prisma.PropertyUpdateWithWhereUniqueWithoutSurveyInput> = z.object({
  where: z.lazy(() => PropertyWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PropertyUpdateWithoutSurveyInputSchema),z.lazy(() => PropertyUncheckedUpdateWithoutSurveyInputSchema) ]),
}).strict();

export const PropertyUpdateManyWithWhereWithoutSurveyInputSchema: z.ZodType<Prisma.PropertyUpdateManyWithWhereWithoutSurveyInput> = z.object({
  where: z.lazy(() => PropertyScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PropertyUpdateManyMutationInputSchema),z.lazy(() => PropertyUncheckedUpdateManyWithoutSurveyInputSchema) ]),
}).strict();

export const AttributeUpsertWithWhereUniqueWithoutSurveyInputSchema: z.ZodType<Prisma.AttributeUpsertWithWhereUniqueWithoutSurveyInput> = z.object({
  where: z.lazy(() => AttributeWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => AttributeUpdateWithoutSurveyInputSchema),z.lazy(() => AttributeUncheckedUpdateWithoutSurveyInputSchema) ]),
  create: z.union([ z.lazy(() => AttributeCreateWithoutSurveyInputSchema),z.lazy(() => AttributeUncheckedCreateWithoutSurveyInputSchema) ]),
}).strict();

export const AttributeUpdateWithWhereUniqueWithoutSurveyInputSchema: z.ZodType<Prisma.AttributeUpdateWithWhereUniqueWithoutSurveyInput> = z.object({
  where: z.lazy(() => AttributeWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => AttributeUpdateWithoutSurveyInputSchema),z.lazy(() => AttributeUncheckedUpdateWithoutSurveyInputSchema) ]),
}).strict();

export const AttributeUpdateManyWithWhereWithoutSurveyInputSchema: z.ZodType<Prisma.AttributeUpdateManyWithWhereWithoutSurveyInput> = z.object({
  where: z.lazy(() => AttributeScalarWhereInputSchema),
  data: z.union([ z.lazy(() => AttributeUpdateManyMutationInputSchema),z.lazy(() => AttributeUncheckedUpdateManyWithoutSurveyInputSchema) ]),
}).strict();

export const UserCreateWithoutPropertiesInputSchema: z.ZodType<Prisma.UserCreateWithoutPropertiesInput> = z.object({
  id: z.string().optional(),
  clerkId: z.string(),
  email: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  projects: z.lazy(() => ProjectCreateNestedManyWithoutOwnerInputSchema).optional(),
  attributes: z.lazy(() => AttributeCreateNestedManyWithoutOwnerInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutPropertiesInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutPropertiesInput> = z.object({
  id: z.string().optional(),
  clerkId: z.string(),
  email: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  projects: z.lazy(() => ProjectUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  attributes: z.lazy(() => AttributeUncheckedCreateNestedManyWithoutOwnerInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutPropertiesInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutPropertiesInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutPropertiesInputSchema),z.lazy(() => UserUncheckedCreateWithoutPropertiesInputSchema) ]),
}).strict();

export const BrochureCreateWithoutPropertyInputSchema: z.ZodType<Prisma.BrochureCreateWithoutPropertyInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  url: z.string(),
  title: z.string()
}).strict();

export const BrochureUncheckedCreateWithoutPropertyInputSchema: z.ZodType<Prisma.BrochureUncheckedCreateWithoutPropertyInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  url: z.string(),
  title: z.string()
}).strict();

export const BrochureCreateOrConnectWithoutPropertyInputSchema: z.ZodType<Prisma.BrochureCreateOrConnectWithoutPropertyInput> = z.object({
  where: z.lazy(() => BrochureWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BrochureCreateWithoutPropertyInputSchema),z.lazy(() => BrochureUncheckedCreateWithoutPropertyInputSchema) ]),
}).strict();

export const BrochureCreateManyPropertyInputEnvelopeSchema: z.ZodType<Prisma.BrochureCreateManyPropertyInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => BrochureCreateManyPropertyInputSchema),z.lazy(() => BrochureCreateManyPropertyInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const SurveyCreateWithoutPropertiesInputSchema: z.ZodType<Prisma.SurveyCreateWithoutPropertiesInput> = z.object({
  id: z.string().optional(),
  ownerId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  project: z.lazy(() => ProjectCreateNestedOneWithoutSurveysInputSchema),
  attributesOrder: z.lazy(() => AttributeCreateNestedManyWithoutSurveyInputSchema).optional()
}).strict();

export const SurveyUncheckedCreateWithoutPropertiesInputSchema: z.ZodType<Prisma.SurveyUncheckedCreateWithoutPropertiesInput> = z.object({
  id: z.string().optional(),
  ownerId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  projectId: z.string(),
  attributesOrder: z.lazy(() => AttributeUncheckedCreateNestedManyWithoutSurveyInputSchema).optional()
}).strict();

export const SurveyCreateOrConnectWithoutPropertiesInputSchema: z.ZodType<Prisma.SurveyCreateOrConnectWithoutPropertiesInput> = z.object({
  where: z.lazy(() => SurveyWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SurveyCreateWithoutPropertiesInputSchema),z.lazy(() => SurveyUncheckedCreateWithoutPropertiesInputSchema) ]),
}).strict();

export const UserUpsertWithoutPropertiesInputSchema: z.ZodType<Prisma.UserUpsertWithoutPropertiesInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutPropertiesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutPropertiesInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutPropertiesInputSchema),z.lazy(() => UserUncheckedCreateWithoutPropertiesInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutPropertiesInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutPropertiesInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutPropertiesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutPropertiesInputSchema) ]),
}).strict();

export const UserUpdateWithoutPropertiesInputSchema: z.ZodType<Prisma.UserUpdateWithoutPropertiesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  projects: z.lazy(() => ProjectUpdateManyWithoutOwnerNestedInputSchema).optional(),
  attributes: z.lazy(() => AttributeUpdateManyWithoutOwnerNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutPropertiesInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutPropertiesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  projects: z.lazy(() => ProjectUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  attributes: z.lazy(() => AttributeUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional()
}).strict();

export const BrochureUpsertWithWhereUniqueWithoutPropertyInputSchema: z.ZodType<Prisma.BrochureUpsertWithWhereUniqueWithoutPropertyInput> = z.object({
  where: z.lazy(() => BrochureWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => BrochureUpdateWithoutPropertyInputSchema),z.lazy(() => BrochureUncheckedUpdateWithoutPropertyInputSchema) ]),
  create: z.union([ z.lazy(() => BrochureCreateWithoutPropertyInputSchema),z.lazy(() => BrochureUncheckedCreateWithoutPropertyInputSchema) ]),
}).strict();

export const BrochureUpdateWithWhereUniqueWithoutPropertyInputSchema: z.ZodType<Prisma.BrochureUpdateWithWhereUniqueWithoutPropertyInput> = z.object({
  where: z.lazy(() => BrochureWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => BrochureUpdateWithoutPropertyInputSchema),z.lazy(() => BrochureUncheckedUpdateWithoutPropertyInputSchema) ]),
}).strict();

export const BrochureUpdateManyWithWhereWithoutPropertyInputSchema: z.ZodType<Prisma.BrochureUpdateManyWithWhereWithoutPropertyInput> = z.object({
  where: z.lazy(() => BrochureScalarWhereInputSchema),
  data: z.union([ z.lazy(() => BrochureUpdateManyMutationInputSchema),z.lazy(() => BrochureUncheckedUpdateManyWithoutPropertyInputSchema) ]),
}).strict();

export const BrochureScalarWhereInputSchema: z.ZodType<Prisma.BrochureScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => BrochureScalarWhereInputSchema),z.lazy(() => BrochureScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BrochureScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BrochureScalarWhereInputSchema),z.lazy(() => BrochureScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  url: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  propertyId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const SurveyUpsertWithoutPropertiesInputSchema: z.ZodType<Prisma.SurveyUpsertWithoutPropertiesInput> = z.object({
  update: z.union([ z.lazy(() => SurveyUpdateWithoutPropertiesInputSchema),z.lazy(() => SurveyUncheckedUpdateWithoutPropertiesInputSchema) ]),
  create: z.union([ z.lazy(() => SurveyCreateWithoutPropertiesInputSchema),z.lazy(() => SurveyUncheckedCreateWithoutPropertiesInputSchema) ]),
  where: z.lazy(() => SurveyWhereInputSchema).optional()
}).strict();

export const SurveyUpdateToOneWithWhereWithoutPropertiesInputSchema: z.ZodType<Prisma.SurveyUpdateToOneWithWhereWithoutPropertiesInput> = z.object({
  where: z.lazy(() => SurveyWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => SurveyUpdateWithoutPropertiesInputSchema),z.lazy(() => SurveyUncheckedUpdateWithoutPropertiesInputSchema) ]),
}).strict();

export const SurveyUpdateWithoutPropertiesInputSchema: z.ZodType<Prisma.SurveyUpdateWithoutPropertiesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  project: z.lazy(() => ProjectUpdateOneRequiredWithoutSurveysNestedInputSchema).optional(),
  attributesOrder: z.lazy(() => AttributeUpdateManyWithoutSurveyNestedInputSchema).optional()
}).strict();

export const SurveyUncheckedUpdateWithoutPropertiesInputSchema: z.ZodType<Prisma.SurveyUncheckedUpdateWithoutPropertiesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  attributesOrder: z.lazy(() => AttributeUncheckedUpdateManyWithoutSurveyNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutAttributesInputSchema: z.ZodType<Prisma.UserCreateWithoutAttributesInput> = z.object({
  id: z.string().optional(),
  clerkId: z.string(),
  email: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  projects: z.lazy(() => ProjectCreateNestedManyWithoutOwnerInputSchema).optional(),
  properties: z.lazy(() => PropertyCreateNestedManyWithoutOwnerInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutAttributesInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutAttributesInput> = z.object({
  id: z.string().optional(),
  clerkId: z.string(),
  email: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  projects: z.lazy(() => ProjectUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  properties: z.lazy(() => PropertyUncheckedCreateNestedManyWithoutOwnerInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutAttributesInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutAttributesInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutAttributesInputSchema),z.lazy(() => UserUncheckedCreateWithoutAttributesInputSchema) ]),
}).strict();

export const SurveyCreateWithoutAttributesOrderInputSchema: z.ZodType<Prisma.SurveyCreateWithoutAttributesOrderInput> = z.object({
  id: z.string().optional(),
  ownerId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  project: z.lazy(() => ProjectCreateNestedOneWithoutSurveysInputSchema),
  properties: z.lazy(() => PropertyCreateNestedManyWithoutSurveyInputSchema).optional()
}).strict();

export const SurveyUncheckedCreateWithoutAttributesOrderInputSchema: z.ZodType<Prisma.SurveyUncheckedCreateWithoutAttributesOrderInput> = z.object({
  id: z.string().optional(),
  ownerId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  projectId: z.string(),
  properties: z.lazy(() => PropertyUncheckedCreateNestedManyWithoutSurveyInputSchema).optional()
}).strict();

export const SurveyCreateOrConnectWithoutAttributesOrderInputSchema: z.ZodType<Prisma.SurveyCreateOrConnectWithoutAttributesOrderInput> = z.object({
  where: z.lazy(() => SurveyWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SurveyCreateWithoutAttributesOrderInputSchema),z.lazy(() => SurveyUncheckedCreateWithoutAttributesOrderInputSchema) ]),
}).strict();

export const UserUpsertWithoutAttributesInputSchema: z.ZodType<Prisma.UserUpsertWithoutAttributesInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutAttributesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAttributesInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutAttributesInputSchema),z.lazy(() => UserUncheckedCreateWithoutAttributesInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutAttributesInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutAttributesInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutAttributesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAttributesInputSchema) ]),
}).strict();

export const UserUpdateWithoutAttributesInputSchema: z.ZodType<Prisma.UserUpdateWithoutAttributesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  projects: z.lazy(() => ProjectUpdateManyWithoutOwnerNestedInputSchema).optional(),
  properties: z.lazy(() => PropertyUpdateManyWithoutOwnerNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutAttributesInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutAttributesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  projects: z.lazy(() => ProjectUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  properties: z.lazy(() => PropertyUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional()
}).strict();

export const SurveyUpsertWithoutAttributesOrderInputSchema: z.ZodType<Prisma.SurveyUpsertWithoutAttributesOrderInput> = z.object({
  update: z.union([ z.lazy(() => SurveyUpdateWithoutAttributesOrderInputSchema),z.lazy(() => SurveyUncheckedUpdateWithoutAttributesOrderInputSchema) ]),
  create: z.union([ z.lazy(() => SurveyCreateWithoutAttributesOrderInputSchema),z.lazy(() => SurveyUncheckedCreateWithoutAttributesOrderInputSchema) ]),
  where: z.lazy(() => SurveyWhereInputSchema).optional()
}).strict();

export const SurveyUpdateToOneWithWhereWithoutAttributesOrderInputSchema: z.ZodType<Prisma.SurveyUpdateToOneWithWhereWithoutAttributesOrderInput> = z.object({
  where: z.lazy(() => SurveyWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => SurveyUpdateWithoutAttributesOrderInputSchema),z.lazy(() => SurveyUncheckedUpdateWithoutAttributesOrderInputSchema) ]),
}).strict();

export const SurveyUpdateWithoutAttributesOrderInputSchema: z.ZodType<Prisma.SurveyUpdateWithoutAttributesOrderInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  project: z.lazy(() => ProjectUpdateOneRequiredWithoutSurveysNestedInputSchema).optional(),
  properties: z.lazy(() => PropertyUpdateManyWithoutSurveyNestedInputSchema).optional()
}).strict();

export const SurveyUncheckedUpdateWithoutAttributesOrderInputSchema: z.ZodType<Prisma.SurveyUncheckedUpdateWithoutAttributesOrderInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  properties: z.lazy(() => PropertyUncheckedUpdateManyWithoutSurveyNestedInputSchema).optional()
}).strict();

export const PropertyCreateWithoutBrochuresInputSchema: z.ZodType<Prisma.PropertyCreateWithoutBrochuresInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  address: z.string(),
  photoUrl: z.string().optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  owner: z.lazy(() => UserCreateNestedOneWithoutPropertiesInputSchema),
  survey: z.lazy(() => SurveyCreateNestedOneWithoutPropertiesInputSchema)
}).strict();

export const PropertyUncheckedCreateWithoutBrochuresInputSchema: z.ZodType<Prisma.PropertyUncheckedCreateWithoutBrochuresInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  ownerId: z.string(),
  address: z.string(),
  photoUrl: z.string().optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  surveyId: z.string()
}).strict();

export const PropertyCreateOrConnectWithoutBrochuresInputSchema: z.ZodType<Prisma.PropertyCreateOrConnectWithoutBrochuresInput> = z.object({
  where: z.lazy(() => PropertyWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PropertyCreateWithoutBrochuresInputSchema),z.lazy(() => PropertyUncheckedCreateWithoutBrochuresInputSchema) ]),
}).strict();

export const PropertyUpsertWithoutBrochuresInputSchema: z.ZodType<Prisma.PropertyUpsertWithoutBrochuresInput> = z.object({
  update: z.union([ z.lazy(() => PropertyUpdateWithoutBrochuresInputSchema),z.lazy(() => PropertyUncheckedUpdateWithoutBrochuresInputSchema) ]),
  create: z.union([ z.lazy(() => PropertyCreateWithoutBrochuresInputSchema),z.lazy(() => PropertyUncheckedCreateWithoutBrochuresInputSchema) ]),
  where: z.lazy(() => PropertyWhereInputSchema).optional()
}).strict();

export const PropertyUpdateToOneWithWhereWithoutBrochuresInputSchema: z.ZodType<Prisma.PropertyUpdateToOneWithWhereWithoutBrochuresInput> = z.object({
  where: z.lazy(() => PropertyWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PropertyUpdateWithoutBrochuresInputSchema),z.lazy(() => PropertyUncheckedUpdateWithoutBrochuresInputSchema) ]),
}).strict();

export const PropertyUpdateWithoutBrochuresInputSchema: z.ZodType<Prisma.PropertyUpdateWithoutBrochuresInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  photoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutPropertiesNestedInputSchema).optional(),
  survey: z.lazy(() => SurveyUpdateOneRequiredWithoutPropertiesNestedInputSchema).optional()
}).strict();

export const PropertyUncheckedUpdateWithoutBrochuresInputSchema: z.ZodType<Prisma.PropertyUncheckedUpdateWithoutBrochuresInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  photoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  surveyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProjectCreateManyOwnerInputSchema: z.ZodType<Prisma.ProjectCreateManyOwnerInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PropertyCreateManyOwnerInputSchema: z.ZodType<Prisma.PropertyCreateManyOwnerInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  address: z.string(),
  photoUrl: z.string().optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  surveyId: z.string()
}).strict();

export const AttributeCreateManyOwnerInputSchema: z.ZodType<Prisma.AttributeCreateManyOwnerInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  label: z.string(),
  type: z.string(),
  surveyId: z.string().optional().nullable()
}).strict();

export const ProjectUpdateWithoutOwnerInputSchema: z.ZodType<Prisma.ProjectUpdateWithoutOwnerInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  surveys: z.lazy(() => SurveyUpdateManyWithoutProjectNestedInputSchema).optional()
}).strict();

export const ProjectUncheckedUpdateWithoutOwnerInputSchema: z.ZodType<Prisma.ProjectUncheckedUpdateWithoutOwnerInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  surveys: z.lazy(() => SurveyUncheckedUpdateManyWithoutProjectNestedInputSchema).optional()
}).strict();

export const ProjectUncheckedUpdateManyWithoutOwnerInputSchema: z.ZodType<Prisma.ProjectUncheckedUpdateManyWithoutOwnerInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PropertyUpdateWithoutOwnerInputSchema: z.ZodType<Prisma.PropertyUpdateWithoutOwnerInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  photoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  brochures: z.lazy(() => BrochureUpdateManyWithoutPropertyNestedInputSchema).optional(),
  survey: z.lazy(() => SurveyUpdateOneRequiredWithoutPropertiesNestedInputSchema).optional()
}).strict();

export const PropertyUncheckedUpdateWithoutOwnerInputSchema: z.ZodType<Prisma.PropertyUncheckedUpdateWithoutOwnerInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  photoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  surveyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  brochures: z.lazy(() => BrochureUncheckedUpdateManyWithoutPropertyNestedInputSchema).optional()
}).strict();

export const PropertyUncheckedUpdateManyWithoutOwnerInputSchema: z.ZodType<Prisma.PropertyUncheckedUpdateManyWithoutOwnerInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  photoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  surveyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AttributeUpdateWithoutOwnerInputSchema: z.ZodType<Prisma.AttributeUpdateWithoutOwnerInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Survey: z.lazy(() => SurveyUpdateOneWithoutAttributesOrderNestedInputSchema).optional()
}).strict();

export const AttributeUncheckedUpdateWithoutOwnerInputSchema: z.ZodType<Prisma.AttributeUncheckedUpdateWithoutOwnerInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  surveyId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AttributeUncheckedUpdateManyWithoutOwnerInputSchema: z.ZodType<Prisma.AttributeUncheckedUpdateManyWithoutOwnerInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  surveyId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const SurveyCreateManyProjectInputSchema: z.ZodType<Prisma.SurveyCreateManyProjectInput> = z.object({
  id: z.string().optional(),
  ownerId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string()
}).strict();

export const SurveyUpdateWithoutProjectInputSchema: z.ZodType<Prisma.SurveyUpdateWithoutProjectInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  properties: z.lazy(() => PropertyUpdateManyWithoutSurveyNestedInputSchema).optional(),
  attributesOrder: z.lazy(() => AttributeUpdateManyWithoutSurveyNestedInputSchema).optional()
}).strict();

export const SurveyUncheckedUpdateWithoutProjectInputSchema: z.ZodType<Prisma.SurveyUncheckedUpdateWithoutProjectInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  properties: z.lazy(() => PropertyUncheckedUpdateManyWithoutSurveyNestedInputSchema).optional(),
  attributesOrder: z.lazy(() => AttributeUncheckedUpdateManyWithoutSurveyNestedInputSchema).optional()
}).strict();

export const SurveyUncheckedUpdateManyWithoutProjectInputSchema: z.ZodType<Prisma.SurveyUncheckedUpdateManyWithoutProjectInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PropertyCreateManySurveyInputSchema: z.ZodType<Prisma.PropertyCreateManySurveyInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  ownerId: z.string(),
  address: z.string(),
  photoUrl: z.string().optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const AttributeCreateManySurveyInputSchema: z.ZodType<Prisma.AttributeCreateManySurveyInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  label: z.string(),
  type: z.string(),
  ownerId: z.string().optional().nullable()
}).strict();

export const PropertyUpdateWithoutSurveyInputSchema: z.ZodType<Prisma.PropertyUpdateWithoutSurveyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  photoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutPropertiesNestedInputSchema).optional(),
  brochures: z.lazy(() => BrochureUpdateManyWithoutPropertyNestedInputSchema).optional()
}).strict();

export const PropertyUncheckedUpdateWithoutSurveyInputSchema: z.ZodType<Prisma.PropertyUncheckedUpdateWithoutSurveyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  photoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  brochures: z.lazy(() => BrochureUncheckedUpdateManyWithoutPropertyNestedInputSchema).optional()
}).strict();

export const PropertyUncheckedUpdateManyWithoutSurveyInputSchema: z.ZodType<Prisma.PropertyUncheckedUpdateManyWithoutSurveyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  photoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const AttributeUpdateWithoutSurveyInputSchema: z.ZodType<Prisma.AttributeUpdateWithoutSurveyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneWithoutAttributesNestedInputSchema).optional()
}).strict();

export const AttributeUncheckedUpdateWithoutSurveyInputSchema: z.ZodType<Prisma.AttributeUncheckedUpdateWithoutSurveyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AttributeUncheckedUpdateManyWithoutSurveyInputSchema: z.ZodType<Prisma.AttributeUncheckedUpdateManyWithoutSurveyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const BrochureCreateManyPropertyInputSchema: z.ZodType<Prisma.BrochureCreateManyPropertyInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  url: z.string(),
  title: z.string()
}).strict();

export const BrochureUpdateWithoutPropertyInputSchema: z.ZodType<Prisma.BrochureUpdateWithoutPropertyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BrochureUncheckedUpdateWithoutPropertyInputSchema: z.ZodType<Prisma.BrochureUncheckedUpdateWithoutPropertyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BrochureUncheckedUpdateManyWithoutPropertyInputSchema: z.ZodType<Prisma.BrochureUncheckedUpdateManyWithoutPropertyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(),UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(),
  having: UserScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const ProjectFindFirstArgsSchema: z.ZodType<Prisma.ProjectFindFirstArgs> = z.object({
  select: ProjectSelectSchema.optional(),
  include: ProjectIncludeSchema.optional(),
  where: ProjectWhereInputSchema.optional(),
  orderBy: z.union([ ProjectOrderByWithRelationInputSchema.array(),ProjectOrderByWithRelationInputSchema ]).optional(),
  cursor: ProjectWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProjectScalarFieldEnumSchema,ProjectScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProjectFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ProjectFindFirstOrThrowArgs> = z.object({
  select: ProjectSelectSchema.optional(),
  include: ProjectIncludeSchema.optional(),
  where: ProjectWhereInputSchema.optional(),
  orderBy: z.union([ ProjectOrderByWithRelationInputSchema.array(),ProjectOrderByWithRelationInputSchema ]).optional(),
  cursor: ProjectWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProjectScalarFieldEnumSchema,ProjectScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProjectFindManyArgsSchema: z.ZodType<Prisma.ProjectFindManyArgs> = z.object({
  select: ProjectSelectSchema.optional(),
  include: ProjectIncludeSchema.optional(),
  where: ProjectWhereInputSchema.optional(),
  orderBy: z.union([ ProjectOrderByWithRelationInputSchema.array(),ProjectOrderByWithRelationInputSchema ]).optional(),
  cursor: ProjectWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProjectScalarFieldEnumSchema,ProjectScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProjectAggregateArgsSchema: z.ZodType<Prisma.ProjectAggregateArgs> = z.object({
  where: ProjectWhereInputSchema.optional(),
  orderBy: z.union([ ProjectOrderByWithRelationInputSchema.array(),ProjectOrderByWithRelationInputSchema ]).optional(),
  cursor: ProjectWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProjectGroupByArgsSchema: z.ZodType<Prisma.ProjectGroupByArgs> = z.object({
  where: ProjectWhereInputSchema.optional(),
  orderBy: z.union([ ProjectOrderByWithAggregationInputSchema.array(),ProjectOrderByWithAggregationInputSchema ]).optional(),
  by: ProjectScalarFieldEnumSchema.array(),
  having: ProjectScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProjectFindUniqueArgsSchema: z.ZodType<Prisma.ProjectFindUniqueArgs> = z.object({
  select: ProjectSelectSchema.optional(),
  include: ProjectIncludeSchema.optional(),
  where: ProjectWhereUniqueInputSchema,
}).strict() ;

export const ProjectFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ProjectFindUniqueOrThrowArgs> = z.object({
  select: ProjectSelectSchema.optional(),
  include: ProjectIncludeSchema.optional(),
  where: ProjectWhereUniqueInputSchema,
}).strict() ;

export const SurveyFindFirstArgsSchema: z.ZodType<Prisma.SurveyFindFirstArgs> = z.object({
  select: SurveySelectSchema.optional(),
  include: SurveyIncludeSchema.optional(),
  where: SurveyWhereInputSchema.optional(),
  orderBy: z.union([ SurveyOrderByWithRelationInputSchema.array(),SurveyOrderByWithRelationInputSchema ]).optional(),
  cursor: SurveyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SurveyScalarFieldEnumSchema,SurveyScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SurveyFindFirstOrThrowArgsSchema: z.ZodType<Prisma.SurveyFindFirstOrThrowArgs> = z.object({
  select: SurveySelectSchema.optional(),
  include: SurveyIncludeSchema.optional(),
  where: SurveyWhereInputSchema.optional(),
  orderBy: z.union([ SurveyOrderByWithRelationInputSchema.array(),SurveyOrderByWithRelationInputSchema ]).optional(),
  cursor: SurveyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SurveyScalarFieldEnumSchema,SurveyScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SurveyFindManyArgsSchema: z.ZodType<Prisma.SurveyFindManyArgs> = z.object({
  select: SurveySelectSchema.optional(),
  include: SurveyIncludeSchema.optional(),
  where: SurveyWhereInputSchema.optional(),
  orderBy: z.union([ SurveyOrderByWithRelationInputSchema.array(),SurveyOrderByWithRelationInputSchema ]).optional(),
  cursor: SurveyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SurveyScalarFieldEnumSchema,SurveyScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SurveyAggregateArgsSchema: z.ZodType<Prisma.SurveyAggregateArgs> = z.object({
  where: SurveyWhereInputSchema.optional(),
  orderBy: z.union([ SurveyOrderByWithRelationInputSchema.array(),SurveyOrderByWithRelationInputSchema ]).optional(),
  cursor: SurveyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const SurveyGroupByArgsSchema: z.ZodType<Prisma.SurveyGroupByArgs> = z.object({
  where: SurveyWhereInputSchema.optional(),
  orderBy: z.union([ SurveyOrderByWithAggregationInputSchema.array(),SurveyOrderByWithAggregationInputSchema ]).optional(),
  by: SurveyScalarFieldEnumSchema.array(),
  having: SurveyScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const SurveyFindUniqueArgsSchema: z.ZodType<Prisma.SurveyFindUniqueArgs> = z.object({
  select: SurveySelectSchema.optional(),
  include: SurveyIncludeSchema.optional(),
  where: SurveyWhereUniqueInputSchema,
}).strict() ;

export const SurveyFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.SurveyFindUniqueOrThrowArgs> = z.object({
  select: SurveySelectSchema.optional(),
  include: SurveyIncludeSchema.optional(),
  where: SurveyWhereUniqueInputSchema,
}).strict() ;

export const PropertyFindFirstArgsSchema: z.ZodType<Prisma.PropertyFindFirstArgs> = z.object({
  select: PropertySelectSchema.optional(),
  include: PropertyIncludeSchema.optional(),
  where: PropertyWhereInputSchema.optional(),
  orderBy: z.union([ PropertyOrderByWithRelationInputSchema.array(),PropertyOrderByWithRelationInputSchema ]).optional(),
  cursor: PropertyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PropertyScalarFieldEnumSchema,PropertyScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PropertyFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PropertyFindFirstOrThrowArgs> = z.object({
  select: PropertySelectSchema.optional(),
  include: PropertyIncludeSchema.optional(),
  where: PropertyWhereInputSchema.optional(),
  orderBy: z.union([ PropertyOrderByWithRelationInputSchema.array(),PropertyOrderByWithRelationInputSchema ]).optional(),
  cursor: PropertyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PropertyScalarFieldEnumSchema,PropertyScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PropertyFindManyArgsSchema: z.ZodType<Prisma.PropertyFindManyArgs> = z.object({
  select: PropertySelectSchema.optional(),
  include: PropertyIncludeSchema.optional(),
  where: PropertyWhereInputSchema.optional(),
  orderBy: z.union([ PropertyOrderByWithRelationInputSchema.array(),PropertyOrderByWithRelationInputSchema ]).optional(),
  cursor: PropertyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PropertyScalarFieldEnumSchema,PropertyScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PropertyAggregateArgsSchema: z.ZodType<Prisma.PropertyAggregateArgs> = z.object({
  where: PropertyWhereInputSchema.optional(),
  orderBy: z.union([ PropertyOrderByWithRelationInputSchema.array(),PropertyOrderByWithRelationInputSchema ]).optional(),
  cursor: PropertyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PropertyGroupByArgsSchema: z.ZodType<Prisma.PropertyGroupByArgs> = z.object({
  where: PropertyWhereInputSchema.optional(),
  orderBy: z.union([ PropertyOrderByWithAggregationInputSchema.array(),PropertyOrderByWithAggregationInputSchema ]).optional(),
  by: PropertyScalarFieldEnumSchema.array(),
  having: PropertyScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PropertyFindUniqueArgsSchema: z.ZodType<Prisma.PropertyFindUniqueArgs> = z.object({
  select: PropertySelectSchema.optional(),
  include: PropertyIncludeSchema.optional(),
  where: PropertyWhereUniqueInputSchema,
}).strict() ;

export const PropertyFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PropertyFindUniqueOrThrowArgs> = z.object({
  select: PropertySelectSchema.optional(),
  include: PropertyIncludeSchema.optional(),
  where: PropertyWhereUniqueInputSchema,
}).strict() ;

export const AttributeFindFirstArgsSchema: z.ZodType<Prisma.AttributeFindFirstArgs> = z.object({
  select: AttributeSelectSchema.optional(),
  include: AttributeIncludeSchema.optional(),
  where: AttributeWhereInputSchema.optional(),
  orderBy: z.union([ AttributeOrderByWithRelationInputSchema.array(),AttributeOrderByWithRelationInputSchema ]).optional(),
  cursor: AttributeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AttributeScalarFieldEnumSchema,AttributeScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AttributeFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AttributeFindFirstOrThrowArgs> = z.object({
  select: AttributeSelectSchema.optional(),
  include: AttributeIncludeSchema.optional(),
  where: AttributeWhereInputSchema.optional(),
  orderBy: z.union([ AttributeOrderByWithRelationInputSchema.array(),AttributeOrderByWithRelationInputSchema ]).optional(),
  cursor: AttributeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AttributeScalarFieldEnumSchema,AttributeScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AttributeFindManyArgsSchema: z.ZodType<Prisma.AttributeFindManyArgs> = z.object({
  select: AttributeSelectSchema.optional(),
  include: AttributeIncludeSchema.optional(),
  where: AttributeWhereInputSchema.optional(),
  orderBy: z.union([ AttributeOrderByWithRelationInputSchema.array(),AttributeOrderByWithRelationInputSchema ]).optional(),
  cursor: AttributeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AttributeScalarFieldEnumSchema,AttributeScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AttributeAggregateArgsSchema: z.ZodType<Prisma.AttributeAggregateArgs> = z.object({
  where: AttributeWhereInputSchema.optional(),
  orderBy: z.union([ AttributeOrderByWithRelationInputSchema.array(),AttributeOrderByWithRelationInputSchema ]).optional(),
  cursor: AttributeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AttributeGroupByArgsSchema: z.ZodType<Prisma.AttributeGroupByArgs> = z.object({
  where: AttributeWhereInputSchema.optional(),
  orderBy: z.union([ AttributeOrderByWithAggregationInputSchema.array(),AttributeOrderByWithAggregationInputSchema ]).optional(),
  by: AttributeScalarFieldEnumSchema.array(),
  having: AttributeScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AttributeFindUniqueArgsSchema: z.ZodType<Prisma.AttributeFindUniqueArgs> = z.object({
  select: AttributeSelectSchema.optional(),
  include: AttributeIncludeSchema.optional(),
  where: AttributeWhereUniqueInputSchema,
}).strict() ;

export const AttributeFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AttributeFindUniqueOrThrowArgs> = z.object({
  select: AttributeSelectSchema.optional(),
  include: AttributeIncludeSchema.optional(),
  where: AttributeWhereUniqueInputSchema,
}).strict() ;

export const BrochureFindFirstArgsSchema: z.ZodType<Prisma.BrochureFindFirstArgs> = z.object({
  select: BrochureSelectSchema.optional(),
  include: BrochureIncludeSchema.optional(),
  where: BrochureWhereInputSchema.optional(),
  orderBy: z.union([ BrochureOrderByWithRelationInputSchema.array(),BrochureOrderByWithRelationInputSchema ]).optional(),
  cursor: BrochureWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BrochureScalarFieldEnumSchema,BrochureScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const BrochureFindFirstOrThrowArgsSchema: z.ZodType<Prisma.BrochureFindFirstOrThrowArgs> = z.object({
  select: BrochureSelectSchema.optional(),
  include: BrochureIncludeSchema.optional(),
  where: BrochureWhereInputSchema.optional(),
  orderBy: z.union([ BrochureOrderByWithRelationInputSchema.array(),BrochureOrderByWithRelationInputSchema ]).optional(),
  cursor: BrochureWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BrochureScalarFieldEnumSchema,BrochureScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const BrochureFindManyArgsSchema: z.ZodType<Prisma.BrochureFindManyArgs> = z.object({
  select: BrochureSelectSchema.optional(),
  include: BrochureIncludeSchema.optional(),
  where: BrochureWhereInputSchema.optional(),
  orderBy: z.union([ BrochureOrderByWithRelationInputSchema.array(),BrochureOrderByWithRelationInputSchema ]).optional(),
  cursor: BrochureWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BrochureScalarFieldEnumSchema,BrochureScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const BrochureAggregateArgsSchema: z.ZodType<Prisma.BrochureAggregateArgs> = z.object({
  where: BrochureWhereInputSchema.optional(),
  orderBy: z.union([ BrochureOrderByWithRelationInputSchema.array(),BrochureOrderByWithRelationInputSchema ]).optional(),
  cursor: BrochureWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const BrochureGroupByArgsSchema: z.ZodType<Prisma.BrochureGroupByArgs> = z.object({
  where: BrochureWhereInputSchema.optional(),
  orderBy: z.union([ BrochureOrderByWithAggregationInputSchema.array(),BrochureOrderByWithAggregationInputSchema ]).optional(),
  by: BrochureScalarFieldEnumSchema.array(),
  having: BrochureScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const BrochureFindUniqueArgsSchema: z.ZodType<Prisma.BrochureFindUniqueArgs> = z.object({
  select: BrochureSelectSchema.optional(),
  include: BrochureIncludeSchema.optional(),
  where: BrochureWhereUniqueInputSchema,
}).strict() ;

export const BrochureFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.BrochureFindUniqueOrThrowArgs> = z.object({
  select: BrochureSelectSchema.optional(),
  include: BrochureIncludeSchema.optional(),
  where: BrochureWhereUniqueInputSchema,
}).strict() ;

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
}).strict() ;

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  create: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
}).strict() ;

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(),
}).strict() ;

export const ProjectCreateArgsSchema: z.ZodType<Prisma.ProjectCreateArgs> = z.object({
  select: ProjectSelectSchema.optional(),
  include: ProjectIncludeSchema.optional(),
  data: z.union([ ProjectCreateInputSchema,ProjectUncheckedCreateInputSchema ]),
}).strict() ;

export const ProjectUpsertArgsSchema: z.ZodType<Prisma.ProjectUpsertArgs> = z.object({
  select: ProjectSelectSchema.optional(),
  include: ProjectIncludeSchema.optional(),
  where: ProjectWhereUniqueInputSchema,
  create: z.union([ ProjectCreateInputSchema,ProjectUncheckedCreateInputSchema ]),
  update: z.union([ ProjectUpdateInputSchema,ProjectUncheckedUpdateInputSchema ]),
}).strict() ;

export const ProjectCreateManyArgsSchema: z.ZodType<Prisma.ProjectCreateManyArgs> = z.object({
  data: z.union([ ProjectCreateManyInputSchema,ProjectCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProjectCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ProjectCreateManyAndReturnArgs> = z.object({
  data: z.union([ ProjectCreateManyInputSchema,ProjectCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProjectDeleteArgsSchema: z.ZodType<Prisma.ProjectDeleteArgs> = z.object({
  select: ProjectSelectSchema.optional(),
  include: ProjectIncludeSchema.optional(),
  where: ProjectWhereUniqueInputSchema,
}).strict() ;

export const ProjectUpdateArgsSchema: z.ZodType<Prisma.ProjectUpdateArgs> = z.object({
  select: ProjectSelectSchema.optional(),
  include: ProjectIncludeSchema.optional(),
  data: z.union([ ProjectUpdateInputSchema,ProjectUncheckedUpdateInputSchema ]),
  where: ProjectWhereUniqueInputSchema,
}).strict() ;

export const ProjectUpdateManyArgsSchema: z.ZodType<Prisma.ProjectUpdateManyArgs> = z.object({
  data: z.union([ ProjectUpdateManyMutationInputSchema,ProjectUncheckedUpdateManyInputSchema ]),
  where: ProjectWhereInputSchema.optional(),
}).strict() ;

export const ProjectDeleteManyArgsSchema: z.ZodType<Prisma.ProjectDeleteManyArgs> = z.object({
  where: ProjectWhereInputSchema.optional(),
}).strict() ;

export const SurveyCreateArgsSchema: z.ZodType<Prisma.SurveyCreateArgs> = z.object({
  select: SurveySelectSchema.optional(),
  include: SurveyIncludeSchema.optional(),
  data: z.union([ SurveyCreateInputSchema,SurveyUncheckedCreateInputSchema ]),
}).strict() ;

export const SurveyUpsertArgsSchema: z.ZodType<Prisma.SurveyUpsertArgs> = z.object({
  select: SurveySelectSchema.optional(),
  include: SurveyIncludeSchema.optional(),
  where: SurveyWhereUniqueInputSchema,
  create: z.union([ SurveyCreateInputSchema,SurveyUncheckedCreateInputSchema ]),
  update: z.union([ SurveyUpdateInputSchema,SurveyUncheckedUpdateInputSchema ]),
}).strict() ;

export const SurveyCreateManyArgsSchema: z.ZodType<Prisma.SurveyCreateManyArgs> = z.object({
  data: z.union([ SurveyCreateManyInputSchema,SurveyCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const SurveyCreateManyAndReturnArgsSchema: z.ZodType<Prisma.SurveyCreateManyAndReturnArgs> = z.object({
  data: z.union([ SurveyCreateManyInputSchema,SurveyCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const SurveyDeleteArgsSchema: z.ZodType<Prisma.SurveyDeleteArgs> = z.object({
  select: SurveySelectSchema.optional(),
  include: SurveyIncludeSchema.optional(),
  where: SurveyWhereUniqueInputSchema,
}).strict() ;

export const SurveyUpdateArgsSchema: z.ZodType<Prisma.SurveyUpdateArgs> = z.object({
  select: SurveySelectSchema.optional(),
  include: SurveyIncludeSchema.optional(),
  data: z.union([ SurveyUpdateInputSchema,SurveyUncheckedUpdateInputSchema ]),
  where: SurveyWhereUniqueInputSchema,
}).strict() ;

export const SurveyUpdateManyArgsSchema: z.ZodType<Prisma.SurveyUpdateManyArgs> = z.object({
  data: z.union([ SurveyUpdateManyMutationInputSchema,SurveyUncheckedUpdateManyInputSchema ]),
  where: SurveyWhereInputSchema.optional(),
}).strict() ;

export const SurveyDeleteManyArgsSchema: z.ZodType<Prisma.SurveyDeleteManyArgs> = z.object({
  where: SurveyWhereInputSchema.optional(),
}).strict() ;

export const PropertyCreateArgsSchema: z.ZodType<Prisma.PropertyCreateArgs> = z.object({
  select: PropertySelectSchema.optional(),
  include: PropertyIncludeSchema.optional(),
  data: z.union([ PropertyCreateInputSchema,PropertyUncheckedCreateInputSchema ]),
}).strict() ;

export const PropertyUpsertArgsSchema: z.ZodType<Prisma.PropertyUpsertArgs> = z.object({
  select: PropertySelectSchema.optional(),
  include: PropertyIncludeSchema.optional(),
  where: PropertyWhereUniqueInputSchema,
  create: z.union([ PropertyCreateInputSchema,PropertyUncheckedCreateInputSchema ]),
  update: z.union([ PropertyUpdateInputSchema,PropertyUncheckedUpdateInputSchema ]),
}).strict() ;

export const PropertyCreateManyArgsSchema: z.ZodType<Prisma.PropertyCreateManyArgs> = z.object({
  data: z.union([ PropertyCreateManyInputSchema,PropertyCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PropertyCreateManyAndReturnArgsSchema: z.ZodType<Prisma.PropertyCreateManyAndReturnArgs> = z.object({
  data: z.union([ PropertyCreateManyInputSchema,PropertyCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PropertyDeleteArgsSchema: z.ZodType<Prisma.PropertyDeleteArgs> = z.object({
  select: PropertySelectSchema.optional(),
  include: PropertyIncludeSchema.optional(),
  where: PropertyWhereUniqueInputSchema,
}).strict() ;

export const PropertyUpdateArgsSchema: z.ZodType<Prisma.PropertyUpdateArgs> = z.object({
  select: PropertySelectSchema.optional(),
  include: PropertyIncludeSchema.optional(),
  data: z.union([ PropertyUpdateInputSchema,PropertyUncheckedUpdateInputSchema ]),
  where: PropertyWhereUniqueInputSchema,
}).strict() ;

export const PropertyUpdateManyArgsSchema: z.ZodType<Prisma.PropertyUpdateManyArgs> = z.object({
  data: z.union([ PropertyUpdateManyMutationInputSchema,PropertyUncheckedUpdateManyInputSchema ]),
  where: PropertyWhereInputSchema.optional(),
}).strict() ;

export const PropertyDeleteManyArgsSchema: z.ZodType<Prisma.PropertyDeleteManyArgs> = z.object({
  where: PropertyWhereInputSchema.optional(),
}).strict() ;

export const AttributeCreateArgsSchema: z.ZodType<Prisma.AttributeCreateArgs> = z.object({
  select: AttributeSelectSchema.optional(),
  include: AttributeIncludeSchema.optional(),
  data: z.union([ AttributeCreateInputSchema,AttributeUncheckedCreateInputSchema ]),
}).strict() ;

export const AttributeUpsertArgsSchema: z.ZodType<Prisma.AttributeUpsertArgs> = z.object({
  select: AttributeSelectSchema.optional(),
  include: AttributeIncludeSchema.optional(),
  where: AttributeWhereUniqueInputSchema,
  create: z.union([ AttributeCreateInputSchema,AttributeUncheckedCreateInputSchema ]),
  update: z.union([ AttributeUpdateInputSchema,AttributeUncheckedUpdateInputSchema ]),
}).strict() ;

export const AttributeCreateManyArgsSchema: z.ZodType<Prisma.AttributeCreateManyArgs> = z.object({
  data: z.union([ AttributeCreateManyInputSchema,AttributeCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AttributeCreateManyAndReturnArgsSchema: z.ZodType<Prisma.AttributeCreateManyAndReturnArgs> = z.object({
  data: z.union([ AttributeCreateManyInputSchema,AttributeCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AttributeDeleteArgsSchema: z.ZodType<Prisma.AttributeDeleteArgs> = z.object({
  select: AttributeSelectSchema.optional(),
  include: AttributeIncludeSchema.optional(),
  where: AttributeWhereUniqueInputSchema,
}).strict() ;

export const AttributeUpdateArgsSchema: z.ZodType<Prisma.AttributeUpdateArgs> = z.object({
  select: AttributeSelectSchema.optional(),
  include: AttributeIncludeSchema.optional(),
  data: z.union([ AttributeUpdateInputSchema,AttributeUncheckedUpdateInputSchema ]),
  where: AttributeWhereUniqueInputSchema,
}).strict() ;

export const AttributeUpdateManyArgsSchema: z.ZodType<Prisma.AttributeUpdateManyArgs> = z.object({
  data: z.union([ AttributeUpdateManyMutationInputSchema,AttributeUncheckedUpdateManyInputSchema ]),
  where: AttributeWhereInputSchema.optional(),
}).strict() ;

export const AttributeDeleteManyArgsSchema: z.ZodType<Prisma.AttributeDeleteManyArgs> = z.object({
  where: AttributeWhereInputSchema.optional(),
}).strict() ;

export const BrochureCreateArgsSchema: z.ZodType<Prisma.BrochureCreateArgs> = z.object({
  select: BrochureSelectSchema.optional(),
  include: BrochureIncludeSchema.optional(),
  data: z.union([ BrochureCreateInputSchema,BrochureUncheckedCreateInputSchema ]),
}).strict() ;

export const BrochureUpsertArgsSchema: z.ZodType<Prisma.BrochureUpsertArgs> = z.object({
  select: BrochureSelectSchema.optional(),
  include: BrochureIncludeSchema.optional(),
  where: BrochureWhereUniqueInputSchema,
  create: z.union([ BrochureCreateInputSchema,BrochureUncheckedCreateInputSchema ]),
  update: z.union([ BrochureUpdateInputSchema,BrochureUncheckedUpdateInputSchema ]),
}).strict() ;

export const BrochureCreateManyArgsSchema: z.ZodType<Prisma.BrochureCreateManyArgs> = z.object({
  data: z.union([ BrochureCreateManyInputSchema,BrochureCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const BrochureCreateManyAndReturnArgsSchema: z.ZodType<Prisma.BrochureCreateManyAndReturnArgs> = z.object({
  data: z.union([ BrochureCreateManyInputSchema,BrochureCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const BrochureDeleteArgsSchema: z.ZodType<Prisma.BrochureDeleteArgs> = z.object({
  select: BrochureSelectSchema.optional(),
  include: BrochureIncludeSchema.optional(),
  where: BrochureWhereUniqueInputSchema,
}).strict() ;

export const BrochureUpdateArgsSchema: z.ZodType<Prisma.BrochureUpdateArgs> = z.object({
  select: BrochureSelectSchema.optional(),
  include: BrochureIncludeSchema.optional(),
  data: z.union([ BrochureUpdateInputSchema,BrochureUncheckedUpdateInputSchema ]),
  where: BrochureWhereUniqueInputSchema,
}).strict() ;

export const BrochureUpdateManyArgsSchema: z.ZodType<Prisma.BrochureUpdateManyArgs> = z.object({
  data: z.union([ BrochureUpdateManyMutationInputSchema,BrochureUncheckedUpdateManyInputSchema ]),
  where: BrochureWhereInputSchema.optional(),
}).strict() ;

export const BrochureDeleteManyArgsSchema: z.ZodType<Prisma.BrochureDeleteManyArgs> = z.object({
  where: BrochureWhereInputSchema.optional(),
}).strict() ;