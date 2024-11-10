import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','email','firstName','lastName']);

export const AgentScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','name','phoneNumber','githubRepoUrl','systemPrompt','ownerId']);

export const TestScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','agentId']);

export const TestAgentScalarFieldEnumSchema = z.enum(['id','name','enabled','headshotUrl','description','prompt','vapiId','agentId']);

export const TestAgentTemplateScalarFieldEnumSchema = z.enum(['id','name','headshotUrl','description']);

export const IntentScalarFieldEnumSchema = z.enum(['id','name','description','details','agentId']);

export const CallScalarFieldEnumSchema = z.enum(['id','status','result','failureReason','stereoRecordingUrl','testId','testAgentId']);

export const MessageScalarFieldEnumSchema = z.enum(['id','role','message','time','endTime','secondsFromStart','duration','callId']);

export const CallErrorScalarFieldEnumSchema = z.enum(['id','secondsFromStart','duration','type','description','callId']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const CallResultSchema = z.enum(['success','failure']);

export type CallResultType = `${z.infer<typeof CallResultSchema>}`

export const RoleSchema = z.enum(['user','bot','system']);

export type RoleType = `${z.infer<typeof RoleSchema>}`

export const CallStatusSchema = z.enum(['in_progress','completed']);

export type CallStatusType = `${z.infer<typeof CallStatusSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  email: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// AGENT SCHEMA
/////////////////////////////////////////

export const AgentSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  name: z.string(),
  phoneNumber: z.string(),
  githubRepoUrl: z.string().nullable(),
  systemPrompt: z.string(),
  ownerId: z.string().nullable(),
})

export type Agent = z.infer<typeof AgentSchema>

/////////////////////////////////////////
// TEST SCHEMA
/////////////////////////////////////////

export const TestSchema = z.object({
  id: z.string().cuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  agentId: z.string(),
})

export type Test = z.infer<typeof TestSchema>

/////////////////////////////////////////
// TEST AGENT SCHEMA
/////////////////////////////////////////

export const TestAgentSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  enabled: z.boolean(),
  headshotUrl: z.string(),
  description: z.string(),
  prompt: z.string(),
  vapiId: z.string(),
  agentId: z.string().nullable(),
})

export type TestAgent = z.infer<typeof TestAgentSchema>

/////////////////////////////////////////
// TEST AGENT TEMPLATE SCHEMA
/////////////////////////////////////////

export const TestAgentTemplateSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  headshotUrl: z.string(),
  description: z.string(),
})

export type TestAgentTemplate = z.infer<typeof TestAgentTemplateSchema>

/////////////////////////////////////////
// INTENT SCHEMA
/////////////////////////////////////////

export const IntentSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  description: z.string(),
  details: z.string(),
  agentId: z.string(),
})

export type Intent = z.infer<typeof IntentSchema>

/////////////////////////////////////////
// CALL SCHEMA
/////////////////////////////////////////

export const CallSchema = z.object({
  status: CallStatusSchema,
  result: CallResultSchema,
  id: z.string().cuid(),
  failureReason: z.string().nullable(),
  stereoRecordingUrl: z.string(),
  testId: z.string(),
  testAgentId: z.string(),
})

export type Call = z.infer<typeof CallSchema>

/////////////////////////////////////////
// MESSAGE SCHEMA
/////////////////////////////////////////

export const MessageSchema = z.object({
  role: RoleSchema,
  id: z.string().cuid(),
  message: z.string(),
  time: z.number(),
  endTime: z.number(),
  secondsFromStart: z.number(),
  duration: z.number(),
  callId: z.string(),
})

export type Message = z.infer<typeof MessageSchema>

/////////////////////////////////////////
// CALL ERROR SCHEMA
/////////////////////////////////////////

export const CallErrorSchema = z.object({
  id: z.string().cuid(),
  secondsFromStart: z.number(),
  duration: z.number(),
  type: z.string(),
  description: z.string(),
  callId: z.string(),
})

export type CallError = z.infer<typeof CallErrorSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  email: z.boolean().optional(),
  firstName: z.boolean().optional(),
  lastName: z.boolean().optional(),
}).strict()

// AGENT
//------------------------------------------------------

export const AgentIncludeSchema: z.ZodType<Prisma.AgentInclude> = z.object({
  testAgents: z.union([z.boolean(),z.lazy(() => TestAgentFindManyArgsSchema)]).optional(),
  intents: z.union([z.boolean(),z.lazy(() => IntentFindManyArgsSchema)]).optional(),
  tests: z.union([z.boolean(),z.lazy(() => TestFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => AgentCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const AgentArgsSchema: z.ZodType<Prisma.AgentDefaultArgs> = z.object({
  select: z.lazy(() => AgentSelectSchema).optional(),
  include: z.lazy(() => AgentIncludeSchema).optional(),
}).strict();

export const AgentCountOutputTypeArgsSchema: z.ZodType<Prisma.AgentCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => AgentCountOutputTypeSelectSchema).nullish(),
}).strict();

export const AgentCountOutputTypeSelectSchema: z.ZodType<Prisma.AgentCountOutputTypeSelect> = z.object({
  testAgents: z.boolean().optional(),
  intents: z.boolean().optional(),
  tests: z.boolean().optional(),
}).strict();

export const AgentSelectSchema: z.ZodType<Prisma.AgentSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  name: z.boolean().optional(),
  phoneNumber: z.boolean().optional(),
  githubRepoUrl: z.boolean().optional(),
  systemPrompt: z.boolean().optional(),
  ownerId: z.boolean().optional(),
  testAgents: z.union([z.boolean(),z.lazy(() => TestAgentFindManyArgsSchema)]).optional(),
  intents: z.union([z.boolean(),z.lazy(() => IntentFindManyArgsSchema)]).optional(),
  tests: z.union([z.boolean(),z.lazy(() => TestFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => AgentCountOutputTypeArgsSchema)]).optional(),
}).strict()

// TEST
//------------------------------------------------------

export const TestIncludeSchema: z.ZodType<Prisma.TestInclude> = z.object({
  agent: z.union([z.boolean(),z.lazy(() => AgentArgsSchema)]).optional(),
  testAgents: z.union([z.boolean(),z.lazy(() => TestAgentFindManyArgsSchema)]).optional(),
  calls: z.union([z.boolean(),z.lazy(() => CallFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TestCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const TestArgsSchema: z.ZodType<Prisma.TestDefaultArgs> = z.object({
  select: z.lazy(() => TestSelectSchema).optional(),
  include: z.lazy(() => TestIncludeSchema).optional(),
}).strict();

export const TestCountOutputTypeArgsSchema: z.ZodType<Prisma.TestCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => TestCountOutputTypeSelectSchema).nullish(),
}).strict();

export const TestCountOutputTypeSelectSchema: z.ZodType<Prisma.TestCountOutputTypeSelect> = z.object({
  testAgents: z.boolean().optional(),
  calls: z.boolean().optional(),
}).strict();

export const TestSelectSchema: z.ZodType<Prisma.TestSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  agentId: z.boolean().optional(),
  agent: z.union([z.boolean(),z.lazy(() => AgentArgsSchema)]).optional(),
  testAgents: z.union([z.boolean(),z.lazy(() => TestAgentFindManyArgsSchema)]).optional(),
  calls: z.union([z.boolean(),z.lazy(() => CallFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TestCountOutputTypeArgsSchema)]).optional(),
}).strict()

// TEST AGENT
//------------------------------------------------------

export const TestAgentIncludeSchema: z.ZodType<Prisma.TestAgentInclude> = z.object({
  Call: z.union([z.boolean(),z.lazy(() => CallFindManyArgsSchema)]).optional(),
  Agent: z.union([z.boolean(),z.lazy(() => AgentArgsSchema)]).optional(),
  tests: z.union([z.boolean(),z.lazy(() => TestFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TestAgentCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const TestAgentArgsSchema: z.ZodType<Prisma.TestAgentDefaultArgs> = z.object({
  select: z.lazy(() => TestAgentSelectSchema).optional(),
  include: z.lazy(() => TestAgentIncludeSchema).optional(),
}).strict();

export const TestAgentCountOutputTypeArgsSchema: z.ZodType<Prisma.TestAgentCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => TestAgentCountOutputTypeSelectSchema).nullish(),
}).strict();

export const TestAgentCountOutputTypeSelectSchema: z.ZodType<Prisma.TestAgentCountOutputTypeSelect> = z.object({
  Call: z.boolean().optional(),
  tests: z.boolean().optional(),
}).strict();

export const TestAgentSelectSchema: z.ZodType<Prisma.TestAgentSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  enabled: z.boolean().optional(),
  headshotUrl: z.boolean().optional(),
  description: z.boolean().optional(),
  prompt: z.boolean().optional(),
  vapiId: z.boolean().optional(),
  agentId: z.boolean().optional(),
  Call: z.union([z.boolean(),z.lazy(() => CallFindManyArgsSchema)]).optional(),
  Agent: z.union([z.boolean(),z.lazy(() => AgentArgsSchema)]).optional(),
  tests: z.union([z.boolean(),z.lazy(() => TestFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TestAgentCountOutputTypeArgsSchema)]).optional(),
}).strict()

// TEST AGENT TEMPLATE
//------------------------------------------------------

export const TestAgentTemplateSelectSchema: z.ZodType<Prisma.TestAgentTemplateSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  headshotUrl: z.boolean().optional(),
  description: z.boolean().optional(),
}).strict()

// INTENT
//------------------------------------------------------

export const IntentIncludeSchema: z.ZodType<Prisma.IntentInclude> = z.object({
  agent: z.union([z.boolean(),z.lazy(() => AgentArgsSchema)]).optional(),
}).strict()

export const IntentArgsSchema: z.ZodType<Prisma.IntentDefaultArgs> = z.object({
  select: z.lazy(() => IntentSelectSchema).optional(),
  include: z.lazy(() => IntentIncludeSchema).optional(),
}).strict();

export const IntentSelectSchema: z.ZodType<Prisma.IntentSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  details: z.boolean().optional(),
  agentId: z.boolean().optional(),
  agent: z.union([z.boolean(),z.lazy(() => AgentArgsSchema)]).optional(),
}).strict()

// CALL
//------------------------------------------------------

export const CallIncludeSchema: z.ZodType<Prisma.CallInclude> = z.object({
  test: z.union([z.boolean(),z.lazy(() => TestArgsSchema)]).optional(),
  testAgent: z.union([z.boolean(),z.lazy(() => TestAgentArgsSchema)]).optional(),
  messages: z.union([z.boolean(),z.lazy(() => MessageFindManyArgsSchema)]).optional(),
  errors: z.union([z.boolean(),z.lazy(() => CallErrorFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CallCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const CallArgsSchema: z.ZodType<Prisma.CallDefaultArgs> = z.object({
  select: z.lazy(() => CallSelectSchema).optional(),
  include: z.lazy(() => CallIncludeSchema).optional(),
}).strict();

export const CallCountOutputTypeArgsSchema: z.ZodType<Prisma.CallCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CallCountOutputTypeSelectSchema).nullish(),
}).strict();

export const CallCountOutputTypeSelectSchema: z.ZodType<Prisma.CallCountOutputTypeSelect> = z.object({
  messages: z.boolean().optional(),
  errors: z.boolean().optional(),
}).strict();

export const CallSelectSchema: z.ZodType<Prisma.CallSelect> = z.object({
  id: z.boolean().optional(),
  status: z.boolean().optional(),
  result: z.boolean().optional(),
  failureReason: z.boolean().optional(),
  stereoRecordingUrl: z.boolean().optional(),
  testId: z.boolean().optional(),
  testAgentId: z.boolean().optional(),
  test: z.union([z.boolean(),z.lazy(() => TestArgsSchema)]).optional(),
  testAgent: z.union([z.boolean(),z.lazy(() => TestAgentArgsSchema)]).optional(),
  messages: z.union([z.boolean(),z.lazy(() => MessageFindManyArgsSchema)]).optional(),
  errors: z.union([z.boolean(),z.lazy(() => CallErrorFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CallCountOutputTypeArgsSchema)]).optional(),
}).strict()

// MESSAGE
//------------------------------------------------------

export const MessageIncludeSchema: z.ZodType<Prisma.MessageInclude> = z.object({
  call: z.union([z.boolean(),z.lazy(() => CallArgsSchema)]).optional(),
}).strict()

export const MessageArgsSchema: z.ZodType<Prisma.MessageDefaultArgs> = z.object({
  select: z.lazy(() => MessageSelectSchema).optional(),
  include: z.lazy(() => MessageIncludeSchema).optional(),
}).strict();

export const MessageSelectSchema: z.ZodType<Prisma.MessageSelect> = z.object({
  id: z.boolean().optional(),
  role: z.boolean().optional(),
  message: z.boolean().optional(),
  time: z.boolean().optional(),
  endTime: z.boolean().optional(),
  secondsFromStart: z.boolean().optional(),
  duration: z.boolean().optional(),
  callId: z.boolean().optional(),
  call: z.union([z.boolean(),z.lazy(() => CallArgsSchema)]).optional(),
}).strict()

// CALL ERROR
//------------------------------------------------------

export const CallErrorIncludeSchema: z.ZodType<Prisma.CallErrorInclude> = z.object({
  call: z.union([z.boolean(),z.lazy(() => CallArgsSchema)]).optional(),
}).strict()

export const CallErrorArgsSchema: z.ZodType<Prisma.CallErrorDefaultArgs> = z.object({
  select: z.lazy(() => CallErrorSelectSchema).optional(),
  include: z.lazy(() => CallErrorIncludeSchema).optional(),
}).strict();

export const CallErrorSelectSchema: z.ZodType<Prisma.CallErrorSelect> = z.object({
  id: z.boolean().optional(),
  secondsFromStart: z.boolean().optional(),
  duration: z.boolean().optional(),
  type: z.boolean().optional(),
  description: z.boolean().optional(),
  callId: z.boolean().optional(),
  call: z.union([z.boolean(),z.lazy(() => CallArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  firstName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  lastName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  lastName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
}).strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.string(),
    email: z.string()
  }),
  z.object({
    id: z.string(),
  }),
  z.object({
    email: z.string(),
  }),
])
.and(z.object({
  id: z.string().optional(),
  email: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  firstName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  lastName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
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
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  firstName: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  lastName: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const AgentWhereInputSchema: z.ZodType<Prisma.AgentWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AgentWhereInputSchema),z.lazy(() => AgentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AgentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AgentWhereInputSchema),z.lazy(() => AgentWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  phoneNumber: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  githubRepoUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  systemPrompt: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  testAgents: z.lazy(() => TestAgentListRelationFilterSchema).optional(),
  intents: z.lazy(() => IntentListRelationFilterSchema).optional(),
  tests: z.lazy(() => TestListRelationFilterSchema).optional()
}).strict();

export const AgentOrderByWithRelationInputSchema: z.ZodType<Prisma.AgentOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  githubRepoUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  systemPrompt: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  testAgents: z.lazy(() => TestAgentOrderByRelationAggregateInputSchema).optional(),
  intents: z.lazy(() => IntentOrderByRelationAggregateInputSchema).optional(),
  tests: z.lazy(() => TestOrderByRelationAggregateInputSchema).optional()
}).strict();

export const AgentWhereUniqueInputSchema: z.ZodType<Prisma.AgentWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => AgentWhereInputSchema),z.lazy(() => AgentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AgentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AgentWhereInputSchema),z.lazy(() => AgentWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  phoneNumber: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  githubRepoUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  systemPrompt: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  testAgents: z.lazy(() => TestAgentListRelationFilterSchema).optional(),
  intents: z.lazy(() => IntentListRelationFilterSchema).optional(),
  tests: z.lazy(() => TestListRelationFilterSchema).optional()
}).strict());

export const AgentOrderByWithAggregationInputSchema: z.ZodType<Prisma.AgentOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  githubRepoUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  systemPrompt: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => AgentCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AgentMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AgentMinOrderByAggregateInputSchema).optional()
}).strict();

export const AgentScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AgentScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => AgentScalarWhereWithAggregatesInputSchema),z.lazy(() => AgentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AgentScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AgentScalarWhereWithAggregatesInputSchema),z.lazy(() => AgentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  phoneNumber: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  githubRepoUrl: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  systemPrompt: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const TestWhereInputSchema: z.ZodType<Prisma.TestWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TestWhereInputSchema),z.lazy(() => TestWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TestWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TestWhereInputSchema),z.lazy(() => TestWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  agentId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  agent: z.union([ z.lazy(() => AgentRelationFilterSchema),z.lazy(() => AgentWhereInputSchema) ]).optional(),
  testAgents: z.lazy(() => TestAgentListRelationFilterSchema).optional(),
  calls: z.lazy(() => CallListRelationFilterSchema).optional()
}).strict();

export const TestOrderByWithRelationInputSchema: z.ZodType<Prisma.TestOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  agentId: z.lazy(() => SortOrderSchema).optional(),
  agent: z.lazy(() => AgentOrderByWithRelationInputSchema).optional(),
  testAgents: z.lazy(() => TestAgentOrderByRelationAggregateInputSchema).optional(),
  calls: z.lazy(() => CallOrderByRelationAggregateInputSchema).optional()
}).strict();

export const TestWhereUniqueInputSchema: z.ZodType<Prisma.TestWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => TestWhereInputSchema),z.lazy(() => TestWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TestWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TestWhereInputSchema),z.lazy(() => TestWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  agentId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  agent: z.union([ z.lazy(() => AgentRelationFilterSchema),z.lazy(() => AgentWhereInputSchema) ]).optional(),
  testAgents: z.lazy(() => TestAgentListRelationFilterSchema).optional(),
  calls: z.lazy(() => CallListRelationFilterSchema).optional()
}).strict());

export const TestOrderByWithAggregationInputSchema: z.ZodType<Prisma.TestOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  agentId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => TestCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => TestMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => TestMinOrderByAggregateInputSchema).optional()
}).strict();

export const TestScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.TestScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => TestScalarWhereWithAggregatesInputSchema),z.lazy(() => TestScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => TestScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TestScalarWhereWithAggregatesInputSchema),z.lazy(() => TestScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  agentId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const TestAgentWhereInputSchema: z.ZodType<Prisma.TestAgentWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TestAgentWhereInputSchema),z.lazy(() => TestAgentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TestAgentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TestAgentWhereInputSchema),z.lazy(() => TestAgentWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  enabled: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  headshotUrl: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  prompt: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  vapiId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  agentId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  Call: z.lazy(() => CallListRelationFilterSchema).optional(),
  Agent: z.union([ z.lazy(() => AgentNullableRelationFilterSchema),z.lazy(() => AgentWhereInputSchema) ]).optional().nullable(),
  tests: z.lazy(() => TestListRelationFilterSchema).optional()
}).strict();

export const TestAgentOrderByWithRelationInputSchema: z.ZodType<Prisma.TestAgentOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  enabled: z.lazy(() => SortOrderSchema).optional(),
  headshotUrl: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  prompt: z.lazy(() => SortOrderSchema).optional(),
  vapiId: z.lazy(() => SortOrderSchema).optional(),
  agentId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  Call: z.lazy(() => CallOrderByRelationAggregateInputSchema).optional(),
  Agent: z.lazy(() => AgentOrderByWithRelationInputSchema).optional(),
  tests: z.lazy(() => TestOrderByRelationAggregateInputSchema).optional()
}).strict();

export const TestAgentWhereUniqueInputSchema: z.ZodType<Prisma.TestAgentWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => TestAgentWhereInputSchema),z.lazy(() => TestAgentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TestAgentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TestAgentWhereInputSchema),z.lazy(() => TestAgentWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  enabled: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  headshotUrl: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  prompt: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  vapiId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  agentId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  Call: z.lazy(() => CallListRelationFilterSchema).optional(),
  Agent: z.union([ z.lazy(() => AgentNullableRelationFilterSchema),z.lazy(() => AgentWhereInputSchema) ]).optional().nullable(),
  tests: z.lazy(() => TestListRelationFilterSchema).optional()
}).strict());

export const TestAgentOrderByWithAggregationInputSchema: z.ZodType<Prisma.TestAgentOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  enabled: z.lazy(() => SortOrderSchema).optional(),
  headshotUrl: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  prompt: z.lazy(() => SortOrderSchema).optional(),
  vapiId: z.lazy(() => SortOrderSchema).optional(),
  agentId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => TestAgentCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => TestAgentMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => TestAgentMinOrderByAggregateInputSchema).optional()
}).strict();

export const TestAgentScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.TestAgentScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => TestAgentScalarWhereWithAggregatesInputSchema),z.lazy(() => TestAgentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => TestAgentScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TestAgentScalarWhereWithAggregatesInputSchema),z.lazy(() => TestAgentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  enabled: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  headshotUrl: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  prompt: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  vapiId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  agentId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const TestAgentTemplateWhereInputSchema: z.ZodType<Prisma.TestAgentTemplateWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TestAgentTemplateWhereInputSchema),z.lazy(() => TestAgentTemplateWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TestAgentTemplateWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TestAgentTemplateWhereInputSchema),z.lazy(() => TestAgentTemplateWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  headshotUrl: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const TestAgentTemplateOrderByWithRelationInputSchema: z.ZodType<Prisma.TestAgentTemplateOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  headshotUrl: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TestAgentTemplateWhereUniqueInputSchema: z.ZodType<Prisma.TestAgentTemplateWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => TestAgentTemplateWhereInputSchema),z.lazy(() => TestAgentTemplateWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TestAgentTemplateWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TestAgentTemplateWhereInputSchema),z.lazy(() => TestAgentTemplateWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  headshotUrl: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict());

export const TestAgentTemplateOrderByWithAggregationInputSchema: z.ZodType<Prisma.TestAgentTemplateOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  headshotUrl: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => TestAgentTemplateCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => TestAgentTemplateMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => TestAgentTemplateMinOrderByAggregateInputSchema).optional()
}).strict();

export const TestAgentTemplateScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.TestAgentTemplateScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => TestAgentTemplateScalarWhereWithAggregatesInputSchema),z.lazy(() => TestAgentTemplateScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => TestAgentTemplateScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TestAgentTemplateScalarWhereWithAggregatesInputSchema),z.lazy(() => TestAgentTemplateScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  headshotUrl: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const IntentWhereInputSchema: z.ZodType<Prisma.IntentWhereInput> = z.object({
  AND: z.union([ z.lazy(() => IntentWhereInputSchema),z.lazy(() => IntentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => IntentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => IntentWhereInputSchema),z.lazy(() => IntentWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  details: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  agentId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  agent: z.union([ z.lazy(() => AgentRelationFilterSchema),z.lazy(() => AgentWhereInputSchema) ]).optional(),
}).strict();

export const IntentOrderByWithRelationInputSchema: z.ZodType<Prisma.IntentOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  details: z.lazy(() => SortOrderSchema).optional(),
  agentId: z.lazy(() => SortOrderSchema).optional(),
  agent: z.lazy(() => AgentOrderByWithRelationInputSchema).optional()
}).strict();

export const IntentWhereUniqueInputSchema: z.ZodType<Prisma.IntentWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => IntentWhereInputSchema),z.lazy(() => IntentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => IntentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => IntentWhereInputSchema),z.lazy(() => IntentWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  details: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  agentId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  agent: z.union([ z.lazy(() => AgentRelationFilterSchema),z.lazy(() => AgentWhereInputSchema) ]).optional(),
}).strict());

export const IntentOrderByWithAggregationInputSchema: z.ZodType<Prisma.IntentOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  details: z.lazy(() => SortOrderSchema).optional(),
  agentId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => IntentCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => IntentMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => IntentMinOrderByAggregateInputSchema).optional()
}).strict();

export const IntentScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.IntentScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => IntentScalarWhereWithAggregatesInputSchema),z.lazy(() => IntentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => IntentScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => IntentScalarWhereWithAggregatesInputSchema),z.lazy(() => IntentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  details: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  agentId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const CallWhereInputSchema: z.ZodType<Prisma.CallWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CallWhereInputSchema),z.lazy(() => CallWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CallWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CallWhereInputSchema),z.lazy(() => CallWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumCallStatusFilterSchema),z.lazy(() => CallStatusSchema) ]).optional(),
  result: z.union([ z.lazy(() => EnumCallResultFilterSchema),z.lazy(() => CallResultSchema) ]).optional(),
  failureReason: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  testId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  testAgentId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  test: z.union([ z.lazy(() => TestRelationFilterSchema),z.lazy(() => TestWhereInputSchema) ]).optional(),
  testAgent: z.union([ z.lazy(() => TestAgentRelationFilterSchema),z.lazy(() => TestAgentWhereInputSchema) ]).optional(),
  messages: z.lazy(() => MessageListRelationFilterSchema).optional(),
  errors: z.lazy(() => CallErrorListRelationFilterSchema).optional()
}).strict();

export const CallOrderByWithRelationInputSchema: z.ZodType<Prisma.CallOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  result: z.lazy(() => SortOrderSchema).optional(),
  failureReason: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  stereoRecordingUrl: z.lazy(() => SortOrderSchema).optional(),
  testId: z.lazy(() => SortOrderSchema).optional(),
  testAgentId: z.lazy(() => SortOrderSchema).optional(),
  test: z.lazy(() => TestOrderByWithRelationInputSchema).optional(),
  testAgent: z.lazy(() => TestAgentOrderByWithRelationInputSchema).optional(),
  messages: z.lazy(() => MessageOrderByRelationAggregateInputSchema).optional(),
  errors: z.lazy(() => CallErrorOrderByRelationAggregateInputSchema).optional()
}).strict();

export const CallWhereUniqueInputSchema: z.ZodType<Prisma.CallWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => CallWhereInputSchema),z.lazy(() => CallWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CallWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CallWhereInputSchema),z.lazy(() => CallWhereInputSchema).array() ]).optional(),
  status: z.union([ z.lazy(() => EnumCallStatusFilterSchema),z.lazy(() => CallStatusSchema) ]).optional(),
  result: z.union([ z.lazy(() => EnumCallResultFilterSchema),z.lazy(() => CallResultSchema) ]).optional(),
  failureReason: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  testId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  testAgentId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  test: z.union([ z.lazy(() => TestRelationFilterSchema),z.lazy(() => TestWhereInputSchema) ]).optional(),
  testAgent: z.union([ z.lazy(() => TestAgentRelationFilterSchema),z.lazy(() => TestAgentWhereInputSchema) ]).optional(),
  messages: z.lazy(() => MessageListRelationFilterSchema).optional(),
  errors: z.lazy(() => CallErrorListRelationFilterSchema).optional()
}).strict());

export const CallOrderByWithAggregationInputSchema: z.ZodType<Prisma.CallOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  result: z.lazy(() => SortOrderSchema).optional(),
  failureReason: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  stereoRecordingUrl: z.lazy(() => SortOrderSchema).optional(),
  testId: z.lazy(() => SortOrderSchema).optional(),
  testAgentId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CallCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CallMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CallMinOrderByAggregateInputSchema).optional()
}).strict();

export const CallScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CallScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => CallScalarWhereWithAggregatesInputSchema),z.lazy(() => CallScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CallScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CallScalarWhereWithAggregatesInputSchema),z.lazy(() => CallScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumCallStatusWithAggregatesFilterSchema),z.lazy(() => CallStatusSchema) ]).optional(),
  result: z.union([ z.lazy(() => EnumCallResultWithAggregatesFilterSchema),z.lazy(() => CallResultSchema) ]).optional(),
  failureReason: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  testId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  testAgentId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const MessageWhereInputSchema: z.ZodType<Prisma.MessageWhereInput> = z.object({
  AND: z.union([ z.lazy(() => MessageWhereInputSchema),z.lazy(() => MessageWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MessageWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MessageWhereInputSchema),z.lazy(() => MessageWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumRoleFilterSchema),z.lazy(() => RoleSchema) ]).optional(),
  message: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  time: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  endTime: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  secondsFromStart: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  duration: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  callId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  call: z.union([ z.lazy(() => CallRelationFilterSchema),z.lazy(() => CallWhereInputSchema) ]).optional(),
}).strict();

export const MessageOrderByWithRelationInputSchema: z.ZodType<Prisma.MessageOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  message: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional(),
  endTime: z.lazy(() => SortOrderSchema).optional(),
  secondsFromStart: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional(),
  callId: z.lazy(() => SortOrderSchema).optional(),
  call: z.lazy(() => CallOrderByWithRelationInputSchema).optional()
}).strict();

export const MessageWhereUniqueInputSchema: z.ZodType<Prisma.MessageWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => MessageWhereInputSchema),z.lazy(() => MessageWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MessageWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MessageWhereInputSchema),z.lazy(() => MessageWhereInputSchema).array() ]).optional(),
  role: z.union([ z.lazy(() => EnumRoleFilterSchema),z.lazy(() => RoleSchema) ]).optional(),
  message: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  time: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  endTime: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  secondsFromStart: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  duration: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  callId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  call: z.union([ z.lazy(() => CallRelationFilterSchema),z.lazy(() => CallWhereInputSchema) ]).optional(),
}).strict());

export const MessageOrderByWithAggregationInputSchema: z.ZodType<Prisma.MessageOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  message: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional(),
  endTime: z.lazy(() => SortOrderSchema).optional(),
  secondsFromStart: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional(),
  callId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => MessageCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => MessageAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => MessageMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => MessageMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => MessageSumOrderByAggregateInputSchema).optional()
}).strict();

export const MessageScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.MessageScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => MessageScalarWhereWithAggregatesInputSchema),z.lazy(() => MessageScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => MessageScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MessageScalarWhereWithAggregatesInputSchema),z.lazy(() => MessageScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumRoleWithAggregatesFilterSchema),z.lazy(() => RoleSchema) ]).optional(),
  message: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  time: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  endTime: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  secondsFromStart: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  duration: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  callId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const CallErrorWhereInputSchema: z.ZodType<Prisma.CallErrorWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CallErrorWhereInputSchema),z.lazy(() => CallErrorWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CallErrorWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CallErrorWhereInputSchema),z.lazy(() => CallErrorWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  secondsFromStart: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  duration: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  callId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  call: z.union([ z.lazy(() => CallRelationFilterSchema),z.lazy(() => CallWhereInputSchema) ]).optional(),
}).strict();

export const CallErrorOrderByWithRelationInputSchema: z.ZodType<Prisma.CallErrorOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  secondsFromStart: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  callId: z.lazy(() => SortOrderSchema).optional(),
  call: z.lazy(() => CallOrderByWithRelationInputSchema).optional()
}).strict();

export const CallErrorWhereUniqueInputSchema: z.ZodType<Prisma.CallErrorWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => CallErrorWhereInputSchema),z.lazy(() => CallErrorWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CallErrorWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CallErrorWhereInputSchema),z.lazy(() => CallErrorWhereInputSchema).array() ]).optional(),
  secondsFromStart: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  duration: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  callId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  call: z.union([ z.lazy(() => CallRelationFilterSchema),z.lazy(() => CallWhereInputSchema) ]).optional(),
}).strict());

export const CallErrorOrderByWithAggregationInputSchema: z.ZodType<Prisma.CallErrorOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  secondsFromStart: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  callId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CallErrorCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => CallErrorAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CallErrorMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CallErrorMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => CallErrorSumOrderByAggregateInputSchema).optional()
}).strict();

export const CallErrorScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CallErrorScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => CallErrorScalarWhereWithAggregatesInputSchema),z.lazy(() => CallErrorScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CallErrorScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CallErrorScalarWhereWithAggregatesInputSchema),z.lazy(() => CallErrorScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  secondsFromStart: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  duration: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  type: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  callId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  id: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  email: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  email: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  email: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable()
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AgentCreateInputSchema: z.ZodType<Prisma.AgentCreateInput> = z.object({
  id: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  phoneNumber: z.string(),
  githubRepoUrl: z.string().optional().nullable(),
  systemPrompt: z.string(),
  ownerId: z.string().optional().nullable(),
  testAgents: z.lazy(() => TestAgentCreateNestedManyWithoutAgentInputSchema).optional(),
  intents: z.lazy(() => IntentCreateNestedManyWithoutAgentInputSchema).optional(),
  tests: z.lazy(() => TestCreateNestedManyWithoutAgentInputSchema).optional()
}).strict();

export const AgentUncheckedCreateInputSchema: z.ZodType<Prisma.AgentUncheckedCreateInput> = z.object({
  id: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  phoneNumber: z.string(),
  githubRepoUrl: z.string().optional().nullable(),
  systemPrompt: z.string(),
  ownerId: z.string().optional().nullable(),
  testAgents: z.lazy(() => TestAgentUncheckedCreateNestedManyWithoutAgentInputSchema).optional(),
  intents: z.lazy(() => IntentUncheckedCreateNestedManyWithoutAgentInputSchema).optional(),
  tests: z.lazy(() => TestUncheckedCreateNestedManyWithoutAgentInputSchema).optional()
}).strict();

export const AgentUpdateInputSchema: z.ZodType<Prisma.AgentUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  githubRepoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  systemPrompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testAgents: z.lazy(() => TestAgentUpdateManyWithoutAgentNestedInputSchema).optional(),
  intents: z.lazy(() => IntentUpdateManyWithoutAgentNestedInputSchema).optional(),
  tests: z.lazy(() => TestUpdateManyWithoutAgentNestedInputSchema).optional()
}).strict();

export const AgentUncheckedUpdateInputSchema: z.ZodType<Prisma.AgentUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  githubRepoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  systemPrompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testAgents: z.lazy(() => TestAgentUncheckedUpdateManyWithoutAgentNestedInputSchema).optional(),
  intents: z.lazy(() => IntentUncheckedUpdateManyWithoutAgentNestedInputSchema).optional(),
  tests: z.lazy(() => TestUncheckedUpdateManyWithoutAgentNestedInputSchema).optional()
}).strict();

export const AgentCreateManyInputSchema: z.ZodType<Prisma.AgentCreateManyInput> = z.object({
  id: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  phoneNumber: z.string(),
  githubRepoUrl: z.string().optional().nullable(),
  systemPrompt: z.string(),
  ownerId: z.string().optional().nullable()
}).strict();

export const AgentUpdateManyMutationInputSchema: z.ZodType<Prisma.AgentUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  githubRepoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  systemPrompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AgentUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AgentUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  githubRepoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  systemPrompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const TestCreateInputSchema: z.ZodType<Prisma.TestCreateInput> = z.object({
  id: z.string().cuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  agent: z.lazy(() => AgentCreateNestedOneWithoutTestsInputSchema),
  testAgents: z.lazy(() => TestAgentCreateNestedManyWithoutTestsInputSchema).optional(),
  calls: z.lazy(() => CallCreateNestedManyWithoutTestInputSchema).optional()
}).strict();

export const TestUncheckedCreateInputSchema: z.ZodType<Prisma.TestUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  agentId: z.string(),
  testAgents: z.lazy(() => TestAgentUncheckedCreateNestedManyWithoutTestsInputSchema).optional(),
  calls: z.lazy(() => CallUncheckedCreateNestedManyWithoutTestInputSchema).optional()
}).strict();

export const TestUpdateInputSchema: z.ZodType<Prisma.TestUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  agent: z.lazy(() => AgentUpdateOneRequiredWithoutTestsNestedInputSchema).optional(),
  testAgents: z.lazy(() => TestAgentUpdateManyWithoutTestsNestedInputSchema).optional(),
  calls: z.lazy(() => CallUpdateManyWithoutTestNestedInputSchema).optional()
}).strict();

export const TestUncheckedUpdateInputSchema: z.ZodType<Prisma.TestUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  agentId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  testAgents: z.lazy(() => TestAgentUncheckedUpdateManyWithoutTestsNestedInputSchema).optional(),
  calls: z.lazy(() => CallUncheckedUpdateManyWithoutTestNestedInputSchema).optional()
}).strict();

export const TestCreateManyInputSchema: z.ZodType<Prisma.TestCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  agentId: z.string()
}).strict();

export const TestUpdateManyMutationInputSchema: z.ZodType<Prisma.TestUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TestUncheckedUpdateManyInputSchema: z.ZodType<Prisma.TestUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  agentId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TestAgentCreateInputSchema: z.ZodType<Prisma.TestAgentCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  enabled: z.boolean().optional(),
  headshotUrl: z.string(),
  description: z.string(),
  prompt: z.string(),
  vapiId: z.string(),
  Call: z.lazy(() => CallCreateNestedManyWithoutTestAgentInputSchema).optional(),
  Agent: z.lazy(() => AgentCreateNestedOneWithoutTestAgentsInputSchema).optional(),
  tests: z.lazy(() => TestCreateNestedManyWithoutTestAgentsInputSchema).optional()
}).strict();

export const TestAgentUncheckedCreateInputSchema: z.ZodType<Prisma.TestAgentUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  enabled: z.boolean().optional(),
  headshotUrl: z.string(),
  description: z.string(),
  prompt: z.string(),
  vapiId: z.string(),
  agentId: z.string().optional().nullable(),
  Call: z.lazy(() => CallUncheckedCreateNestedManyWithoutTestAgentInputSchema).optional(),
  tests: z.lazy(() => TestUncheckedCreateNestedManyWithoutTestAgentsInputSchema).optional()
}).strict();

export const TestAgentUpdateInputSchema: z.ZodType<Prisma.TestAgentUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  headshotUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  prompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  vapiId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Call: z.lazy(() => CallUpdateManyWithoutTestAgentNestedInputSchema).optional(),
  Agent: z.lazy(() => AgentUpdateOneWithoutTestAgentsNestedInputSchema).optional(),
  tests: z.lazy(() => TestUpdateManyWithoutTestAgentsNestedInputSchema).optional()
}).strict();

export const TestAgentUncheckedUpdateInputSchema: z.ZodType<Prisma.TestAgentUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  headshotUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  prompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  vapiId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  agentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  Call: z.lazy(() => CallUncheckedUpdateManyWithoutTestAgentNestedInputSchema).optional(),
  tests: z.lazy(() => TestUncheckedUpdateManyWithoutTestAgentsNestedInputSchema).optional()
}).strict();

export const TestAgentCreateManyInputSchema: z.ZodType<Prisma.TestAgentCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  enabled: z.boolean().optional(),
  headshotUrl: z.string(),
  description: z.string(),
  prompt: z.string(),
  vapiId: z.string(),
  agentId: z.string().optional().nullable()
}).strict();

export const TestAgentUpdateManyMutationInputSchema: z.ZodType<Prisma.TestAgentUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  headshotUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  prompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  vapiId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TestAgentUncheckedUpdateManyInputSchema: z.ZodType<Prisma.TestAgentUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  headshotUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  prompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  vapiId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  agentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const TestAgentTemplateCreateInputSchema: z.ZodType<Prisma.TestAgentTemplateCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  headshotUrl: z.string(),
  description: z.string()
}).strict();

export const TestAgentTemplateUncheckedCreateInputSchema: z.ZodType<Prisma.TestAgentTemplateUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  headshotUrl: z.string(),
  description: z.string()
}).strict();

export const TestAgentTemplateUpdateInputSchema: z.ZodType<Prisma.TestAgentTemplateUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  headshotUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TestAgentTemplateUncheckedUpdateInputSchema: z.ZodType<Prisma.TestAgentTemplateUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  headshotUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TestAgentTemplateCreateManyInputSchema: z.ZodType<Prisma.TestAgentTemplateCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  headshotUrl: z.string(),
  description: z.string()
}).strict();

export const TestAgentTemplateUpdateManyMutationInputSchema: z.ZodType<Prisma.TestAgentTemplateUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  headshotUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TestAgentTemplateUncheckedUpdateManyInputSchema: z.ZodType<Prisma.TestAgentTemplateUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  headshotUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const IntentCreateInputSchema: z.ZodType<Prisma.IntentCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string(),
  details: z.string(),
  agent: z.lazy(() => AgentCreateNestedOneWithoutIntentsInputSchema)
}).strict();

export const IntentUncheckedCreateInputSchema: z.ZodType<Prisma.IntentUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string(),
  details: z.string(),
  agentId: z.string()
}).strict();

export const IntentUpdateInputSchema: z.ZodType<Prisma.IntentUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  agent: z.lazy(() => AgentUpdateOneRequiredWithoutIntentsNestedInputSchema).optional()
}).strict();

export const IntentUncheckedUpdateInputSchema: z.ZodType<Prisma.IntentUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  agentId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const IntentCreateManyInputSchema: z.ZodType<Prisma.IntentCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string(),
  details: z.string(),
  agentId: z.string()
}).strict();

export const IntentUpdateManyMutationInputSchema: z.ZodType<Prisma.IntentUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const IntentUncheckedUpdateManyInputSchema: z.ZodType<Prisma.IntentUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  agentId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CallCreateInputSchema: z.ZodType<Prisma.CallCreateInput> = z.object({
  id: z.string().cuid().optional(),
  status: z.lazy(() => CallStatusSchema),
  result: z.lazy(() => CallResultSchema),
  failureReason: z.string().optional().nullable(),
  stereoRecordingUrl: z.string(),
  test: z.lazy(() => TestCreateNestedOneWithoutCallsInputSchema),
  testAgent: z.lazy(() => TestAgentCreateNestedOneWithoutCallInputSchema),
  messages: z.lazy(() => MessageCreateNestedManyWithoutCallInputSchema).optional(),
  errors: z.lazy(() => CallErrorCreateNestedManyWithoutCallInputSchema).optional()
}).strict();

export const CallUncheckedCreateInputSchema: z.ZodType<Prisma.CallUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  status: z.lazy(() => CallStatusSchema),
  result: z.lazy(() => CallResultSchema),
  failureReason: z.string().optional().nullable(),
  stereoRecordingUrl: z.string(),
  testId: z.string(),
  testAgentId: z.string(),
  messages: z.lazy(() => MessageUncheckedCreateNestedManyWithoutCallInputSchema).optional(),
  errors: z.lazy(() => CallErrorUncheckedCreateNestedManyWithoutCallInputSchema).optional()
}).strict();

export const CallUpdateInputSchema: z.ZodType<Prisma.CallUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => EnumCallStatusFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => EnumCallResultFieldUpdateOperationsInputSchema) ]).optional(),
  failureReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  test: z.lazy(() => TestUpdateOneRequiredWithoutCallsNestedInputSchema).optional(),
  testAgent: z.lazy(() => TestAgentUpdateOneRequiredWithoutCallNestedInputSchema).optional(),
  messages: z.lazy(() => MessageUpdateManyWithoutCallNestedInputSchema).optional(),
  errors: z.lazy(() => CallErrorUpdateManyWithoutCallNestedInputSchema).optional()
}).strict();

export const CallUncheckedUpdateInputSchema: z.ZodType<Prisma.CallUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => EnumCallStatusFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => EnumCallResultFieldUpdateOperationsInputSchema) ]).optional(),
  failureReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  testId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  testAgentId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  messages: z.lazy(() => MessageUncheckedUpdateManyWithoutCallNestedInputSchema).optional(),
  errors: z.lazy(() => CallErrorUncheckedUpdateManyWithoutCallNestedInputSchema).optional()
}).strict();

export const CallCreateManyInputSchema: z.ZodType<Prisma.CallCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  status: z.lazy(() => CallStatusSchema),
  result: z.lazy(() => CallResultSchema),
  failureReason: z.string().optional().nullable(),
  stereoRecordingUrl: z.string(),
  testId: z.string(),
  testAgentId: z.string()
}).strict();

export const CallUpdateManyMutationInputSchema: z.ZodType<Prisma.CallUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => EnumCallStatusFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => EnumCallResultFieldUpdateOperationsInputSchema) ]).optional(),
  failureReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CallUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CallUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => EnumCallStatusFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => EnumCallResultFieldUpdateOperationsInputSchema) ]).optional(),
  failureReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  testId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  testAgentId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MessageCreateInputSchema: z.ZodType<Prisma.MessageCreateInput> = z.object({
  id: z.string().cuid().optional(),
  role: z.lazy(() => RoleSchema),
  message: z.string(),
  time: z.number(),
  endTime: z.number(),
  secondsFromStart: z.number(),
  duration: z.number(),
  call: z.lazy(() => CallCreateNestedOneWithoutMessagesInputSchema)
}).strict();

export const MessageUncheckedCreateInputSchema: z.ZodType<Prisma.MessageUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  role: z.lazy(() => RoleSchema),
  message: z.string(),
  time: z.number(),
  endTime: z.number(),
  secondsFromStart: z.number(),
  duration: z.number(),
  callId: z.string()
}).strict();

export const MessageUpdateInputSchema: z.ZodType<Prisma.MessageUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  call: z.lazy(() => CallUpdateOneRequiredWithoutMessagesNestedInputSchema).optional()
}).strict();

export const MessageUncheckedUpdateInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  callId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MessageCreateManyInputSchema: z.ZodType<Prisma.MessageCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  role: z.lazy(() => RoleSchema),
  message: z.string(),
  time: z.number(),
  endTime: z.number(),
  secondsFromStart: z.number(),
  duration: z.number(),
  callId: z.string()
}).strict();

export const MessageUpdateManyMutationInputSchema: z.ZodType<Prisma.MessageUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MessageUncheckedUpdateManyInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  callId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CallErrorCreateInputSchema: z.ZodType<Prisma.CallErrorCreateInput> = z.object({
  id: z.string().cuid().optional(),
  secondsFromStart: z.number(),
  duration: z.number(),
  type: z.string(),
  description: z.string(),
  call: z.lazy(() => CallCreateNestedOneWithoutErrorsInputSchema)
}).strict();

export const CallErrorUncheckedCreateInputSchema: z.ZodType<Prisma.CallErrorUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  secondsFromStart: z.number(),
  duration: z.number(),
  type: z.string(),
  description: z.string(),
  callId: z.string()
}).strict();

export const CallErrorUpdateInputSchema: z.ZodType<Prisma.CallErrorUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  call: z.lazy(() => CallUpdateOneRequiredWithoutErrorsNestedInputSchema).optional()
}).strict();

export const CallErrorUncheckedUpdateInputSchema: z.ZodType<Prisma.CallErrorUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  callId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CallErrorCreateManyInputSchema: z.ZodType<Prisma.CallErrorCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  secondsFromStart: z.number(),
  duration: z.number(),
  type: z.string(),
  description: z.string(),
  callId: z.string()
}).strict();

export const CallErrorUpdateManyMutationInputSchema: z.ZodType<Prisma.CallErrorUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CallErrorUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CallErrorUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  callId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
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

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
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

export const TestAgentListRelationFilterSchema: z.ZodType<Prisma.TestAgentListRelationFilter> = z.object({
  every: z.lazy(() => TestAgentWhereInputSchema).optional(),
  some: z.lazy(() => TestAgentWhereInputSchema).optional(),
  none: z.lazy(() => TestAgentWhereInputSchema).optional()
}).strict();

export const IntentListRelationFilterSchema: z.ZodType<Prisma.IntentListRelationFilter> = z.object({
  every: z.lazy(() => IntentWhereInputSchema).optional(),
  some: z.lazy(() => IntentWhereInputSchema).optional(),
  none: z.lazy(() => IntentWhereInputSchema).optional()
}).strict();

export const TestListRelationFilterSchema: z.ZodType<Prisma.TestListRelationFilter> = z.object({
  every: z.lazy(() => TestWhereInputSchema).optional(),
  some: z.lazy(() => TestWhereInputSchema).optional(),
  none: z.lazy(() => TestWhereInputSchema).optional()
}).strict();

export const TestAgentOrderByRelationAggregateInputSchema: z.ZodType<Prisma.TestAgentOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntentOrderByRelationAggregateInputSchema: z.ZodType<Prisma.IntentOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TestOrderByRelationAggregateInputSchema: z.ZodType<Prisma.TestOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AgentCountOrderByAggregateInputSchema: z.ZodType<Prisma.AgentCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  githubRepoUrl: z.lazy(() => SortOrderSchema).optional(),
  systemPrompt: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AgentMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AgentMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  githubRepoUrl: z.lazy(() => SortOrderSchema).optional(),
  systemPrompt: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AgentMinOrderByAggregateInputSchema: z.ZodType<Prisma.AgentMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  githubRepoUrl: z.lazy(() => SortOrderSchema).optional(),
  systemPrompt: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AgentRelationFilterSchema: z.ZodType<Prisma.AgentRelationFilter> = z.object({
  is: z.lazy(() => AgentWhereInputSchema).optional(),
  isNot: z.lazy(() => AgentWhereInputSchema).optional()
}).strict();

export const CallListRelationFilterSchema: z.ZodType<Prisma.CallListRelationFilter> = z.object({
  every: z.lazy(() => CallWhereInputSchema).optional(),
  some: z.lazy(() => CallWhereInputSchema).optional(),
  none: z.lazy(() => CallWhereInputSchema).optional()
}).strict();

export const CallOrderByRelationAggregateInputSchema: z.ZodType<Prisma.CallOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TestCountOrderByAggregateInputSchema: z.ZodType<Prisma.TestCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  agentId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TestMaxOrderByAggregateInputSchema: z.ZodType<Prisma.TestMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  agentId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TestMinOrderByAggregateInputSchema: z.ZodType<Prisma.TestMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  agentId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const AgentNullableRelationFilterSchema: z.ZodType<Prisma.AgentNullableRelationFilter> = z.object({
  is: z.lazy(() => AgentWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => AgentWhereInputSchema).optional().nullable()
}).strict();

export const TestAgentCountOrderByAggregateInputSchema: z.ZodType<Prisma.TestAgentCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  enabled: z.lazy(() => SortOrderSchema).optional(),
  headshotUrl: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  prompt: z.lazy(() => SortOrderSchema).optional(),
  vapiId: z.lazy(() => SortOrderSchema).optional(),
  agentId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TestAgentMaxOrderByAggregateInputSchema: z.ZodType<Prisma.TestAgentMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  enabled: z.lazy(() => SortOrderSchema).optional(),
  headshotUrl: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  prompt: z.lazy(() => SortOrderSchema).optional(),
  vapiId: z.lazy(() => SortOrderSchema).optional(),
  agentId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TestAgentMinOrderByAggregateInputSchema: z.ZodType<Prisma.TestAgentMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  enabled: z.lazy(() => SortOrderSchema).optional(),
  headshotUrl: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  prompt: z.lazy(() => SortOrderSchema).optional(),
  vapiId: z.lazy(() => SortOrderSchema).optional(),
  agentId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const TestAgentTemplateCountOrderByAggregateInputSchema: z.ZodType<Prisma.TestAgentTemplateCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  headshotUrl: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TestAgentTemplateMaxOrderByAggregateInputSchema: z.ZodType<Prisma.TestAgentTemplateMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  headshotUrl: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TestAgentTemplateMinOrderByAggregateInputSchema: z.ZodType<Prisma.TestAgentTemplateMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  headshotUrl: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntentCountOrderByAggregateInputSchema: z.ZodType<Prisma.IntentCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  details: z.lazy(() => SortOrderSchema).optional(),
  agentId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntentMaxOrderByAggregateInputSchema: z.ZodType<Prisma.IntentMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  details: z.lazy(() => SortOrderSchema).optional(),
  agentId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntentMinOrderByAggregateInputSchema: z.ZodType<Prisma.IntentMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  details: z.lazy(() => SortOrderSchema).optional(),
  agentId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumCallStatusFilterSchema: z.ZodType<Prisma.EnumCallStatusFilter> = z.object({
  equals: z.lazy(() => CallStatusSchema).optional(),
  in: z.lazy(() => CallStatusSchema).array().optional(),
  notIn: z.lazy(() => CallStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => NestedEnumCallStatusFilterSchema) ]).optional(),
}).strict();

export const EnumCallResultFilterSchema: z.ZodType<Prisma.EnumCallResultFilter> = z.object({
  equals: z.lazy(() => CallResultSchema).optional(),
  in: z.lazy(() => CallResultSchema).array().optional(),
  notIn: z.lazy(() => CallResultSchema).array().optional(),
  not: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => NestedEnumCallResultFilterSchema) ]).optional(),
}).strict();

export const TestRelationFilterSchema: z.ZodType<Prisma.TestRelationFilter> = z.object({
  is: z.lazy(() => TestWhereInputSchema).optional(),
  isNot: z.lazy(() => TestWhereInputSchema).optional()
}).strict();

export const TestAgentRelationFilterSchema: z.ZodType<Prisma.TestAgentRelationFilter> = z.object({
  is: z.lazy(() => TestAgentWhereInputSchema).optional(),
  isNot: z.lazy(() => TestAgentWhereInputSchema).optional()
}).strict();

export const MessageListRelationFilterSchema: z.ZodType<Prisma.MessageListRelationFilter> = z.object({
  every: z.lazy(() => MessageWhereInputSchema).optional(),
  some: z.lazy(() => MessageWhereInputSchema).optional(),
  none: z.lazy(() => MessageWhereInputSchema).optional()
}).strict();

export const CallErrorListRelationFilterSchema: z.ZodType<Prisma.CallErrorListRelationFilter> = z.object({
  every: z.lazy(() => CallErrorWhereInputSchema).optional(),
  some: z.lazy(() => CallErrorWhereInputSchema).optional(),
  none: z.lazy(() => CallErrorWhereInputSchema).optional()
}).strict();

export const MessageOrderByRelationAggregateInputSchema: z.ZodType<Prisma.MessageOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CallErrorOrderByRelationAggregateInputSchema: z.ZodType<Prisma.CallErrorOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CallCountOrderByAggregateInputSchema: z.ZodType<Prisma.CallCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  result: z.lazy(() => SortOrderSchema).optional(),
  failureReason: z.lazy(() => SortOrderSchema).optional(),
  stereoRecordingUrl: z.lazy(() => SortOrderSchema).optional(),
  testId: z.lazy(() => SortOrderSchema).optional(),
  testAgentId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CallMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CallMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  result: z.lazy(() => SortOrderSchema).optional(),
  failureReason: z.lazy(() => SortOrderSchema).optional(),
  stereoRecordingUrl: z.lazy(() => SortOrderSchema).optional(),
  testId: z.lazy(() => SortOrderSchema).optional(),
  testAgentId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CallMinOrderByAggregateInputSchema: z.ZodType<Prisma.CallMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  result: z.lazy(() => SortOrderSchema).optional(),
  failureReason: z.lazy(() => SortOrderSchema).optional(),
  stereoRecordingUrl: z.lazy(() => SortOrderSchema).optional(),
  testId: z.lazy(() => SortOrderSchema).optional(),
  testAgentId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumCallStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumCallStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => CallStatusSchema).optional(),
  in: z.lazy(() => CallStatusSchema).array().optional(),
  notIn: z.lazy(() => CallStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => NestedEnumCallStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumCallStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumCallStatusFilterSchema).optional()
}).strict();

export const EnumCallResultWithAggregatesFilterSchema: z.ZodType<Prisma.EnumCallResultWithAggregatesFilter> = z.object({
  equals: z.lazy(() => CallResultSchema).optional(),
  in: z.lazy(() => CallResultSchema).array().optional(),
  notIn: z.lazy(() => CallResultSchema).array().optional(),
  not: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => NestedEnumCallResultWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumCallResultFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumCallResultFilterSchema).optional()
}).strict();

export const EnumRoleFilterSchema: z.ZodType<Prisma.EnumRoleFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleFilterSchema) ]).optional(),
}).strict();

export const FloatFilterSchema: z.ZodType<Prisma.FloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const CallRelationFilterSchema: z.ZodType<Prisma.CallRelationFilter> = z.object({
  is: z.lazy(() => CallWhereInputSchema).optional(),
  isNot: z.lazy(() => CallWhereInputSchema).optional()
}).strict();

export const MessageCountOrderByAggregateInputSchema: z.ZodType<Prisma.MessageCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  message: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional(),
  endTime: z.lazy(() => SortOrderSchema).optional(),
  secondsFromStart: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional(),
  callId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MessageAvgOrderByAggregateInputSchema: z.ZodType<Prisma.MessageAvgOrderByAggregateInput> = z.object({
  time: z.lazy(() => SortOrderSchema).optional(),
  endTime: z.lazy(() => SortOrderSchema).optional(),
  secondsFromStart: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MessageMaxOrderByAggregateInputSchema: z.ZodType<Prisma.MessageMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  message: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional(),
  endTime: z.lazy(() => SortOrderSchema).optional(),
  secondsFromStart: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional(),
  callId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MessageMinOrderByAggregateInputSchema: z.ZodType<Prisma.MessageMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  message: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional(),
  endTime: z.lazy(() => SortOrderSchema).optional(),
  secondsFromStart: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional(),
  callId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MessageSumOrderByAggregateInputSchema: z.ZodType<Prisma.MessageSumOrderByAggregateInput> = z.object({
  time: z.lazy(() => SortOrderSchema).optional(),
  endTime: z.lazy(() => SortOrderSchema).optional(),
  secondsFromStart: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumRoleWithAggregatesFilterSchema: z.ZodType<Prisma.EnumRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRoleFilterSchema).optional()
}).strict();

export const FloatWithAggregatesFilterSchema: z.ZodType<Prisma.FloatWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional()
}).strict();

export const CallErrorCountOrderByAggregateInputSchema: z.ZodType<Prisma.CallErrorCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  secondsFromStart: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  callId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CallErrorAvgOrderByAggregateInputSchema: z.ZodType<Prisma.CallErrorAvgOrderByAggregateInput> = z.object({
  secondsFromStart: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CallErrorMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CallErrorMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  secondsFromStart: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  callId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CallErrorMinOrderByAggregateInputSchema: z.ZodType<Prisma.CallErrorMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  secondsFromStart: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  callId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CallErrorSumOrderByAggregateInputSchema: z.ZodType<Prisma.CallErrorSumOrderByAggregateInput> = z.object({
  secondsFromStart: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const TestAgentCreateNestedManyWithoutAgentInputSchema: z.ZodType<Prisma.TestAgentCreateNestedManyWithoutAgentInput> = z.object({
  create: z.union([ z.lazy(() => TestAgentCreateWithoutAgentInputSchema),z.lazy(() => TestAgentCreateWithoutAgentInputSchema).array(),z.lazy(() => TestAgentUncheckedCreateWithoutAgentInputSchema),z.lazy(() => TestAgentUncheckedCreateWithoutAgentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TestAgentCreateOrConnectWithoutAgentInputSchema),z.lazy(() => TestAgentCreateOrConnectWithoutAgentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TestAgentCreateManyAgentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TestAgentWhereUniqueInputSchema),z.lazy(() => TestAgentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const IntentCreateNestedManyWithoutAgentInputSchema: z.ZodType<Prisma.IntentCreateNestedManyWithoutAgentInput> = z.object({
  create: z.union([ z.lazy(() => IntentCreateWithoutAgentInputSchema),z.lazy(() => IntentCreateWithoutAgentInputSchema).array(),z.lazy(() => IntentUncheckedCreateWithoutAgentInputSchema),z.lazy(() => IntentUncheckedCreateWithoutAgentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => IntentCreateOrConnectWithoutAgentInputSchema),z.lazy(() => IntentCreateOrConnectWithoutAgentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => IntentCreateManyAgentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => IntentWhereUniqueInputSchema),z.lazy(() => IntentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TestCreateNestedManyWithoutAgentInputSchema: z.ZodType<Prisma.TestCreateNestedManyWithoutAgentInput> = z.object({
  create: z.union([ z.lazy(() => TestCreateWithoutAgentInputSchema),z.lazy(() => TestCreateWithoutAgentInputSchema).array(),z.lazy(() => TestUncheckedCreateWithoutAgentInputSchema),z.lazy(() => TestUncheckedCreateWithoutAgentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TestCreateOrConnectWithoutAgentInputSchema),z.lazy(() => TestCreateOrConnectWithoutAgentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TestCreateManyAgentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TestWhereUniqueInputSchema),z.lazy(() => TestWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TestAgentUncheckedCreateNestedManyWithoutAgentInputSchema: z.ZodType<Prisma.TestAgentUncheckedCreateNestedManyWithoutAgentInput> = z.object({
  create: z.union([ z.lazy(() => TestAgentCreateWithoutAgentInputSchema),z.lazy(() => TestAgentCreateWithoutAgentInputSchema).array(),z.lazy(() => TestAgentUncheckedCreateWithoutAgentInputSchema),z.lazy(() => TestAgentUncheckedCreateWithoutAgentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TestAgentCreateOrConnectWithoutAgentInputSchema),z.lazy(() => TestAgentCreateOrConnectWithoutAgentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TestAgentCreateManyAgentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TestAgentWhereUniqueInputSchema),z.lazy(() => TestAgentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const IntentUncheckedCreateNestedManyWithoutAgentInputSchema: z.ZodType<Prisma.IntentUncheckedCreateNestedManyWithoutAgentInput> = z.object({
  create: z.union([ z.lazy(() => IntentCreateWithoutAgentInputSchema),z.lazy(() => IntentCreateWithoutAgentInputSchema).array(),z.lazy(() => IntentUncheckedCreateWithoutAgentInputSchema),z.lazy(() => IntentUncheckedCreateWithoutAgentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => IntentCreateOrConnectWithoutAgentInputSchema),z.lazy(() => IntentCreateOrConnectWithoutAgentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => IntentCreateManyAgentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => IntentWhereUniqueInputSchema),z.lazy(() => IntentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TestUncheckedCreateNestedManyWithoutAgentInputSchema: z.ZodType<Prisma.TestUncheckedCreateNestedManyWithoutAgentInput> = z.object({
  create: z.union([ z.lazy(() => TestCreateWithoutAgentInputSchema),z.lazy(() => TestCreateWithoutAgentInputSchema).array(),z.lazy(() => TestUncheckedCreateWithoutAgentInputSchema),z.lazy(() => TestUncheckedCreateWithoutAgentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TestCreateOrConnectWithoutAgentInputSchema),z.lazy(() => TestCreateOrConnectWithoutAgentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TestCreateManyAgentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TestWhereUniqueInputSchema),z.lazy(() => TestWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TestAgentUpdateManyWithoutAgentNestedInputSchema: z.ZodType<Prisma.TestAgentUpdateManyWithoutAgentNestedInput> = z.object({
  create: z.union([ z.lazy(() => TestAgentCreateWithoutAgentInputSchema),z.lazy(() => TestAgentCreateWithoutAgentInputSchema).array(),z.lazy(() => TestAgentUncheckedCreateWithoutAgentInputSchema),z.lazy(() => TestAgentUncheckedCreateWithoutAgentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TestAgentCreateOrConnectWithoutAgentInputSchema),z.lazy(() => TestAgentCreateOrConnectWithoutAgentInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TestAgentUpsertWithWhereUniqueWithoutAgentInputSchema),z.lazy(() => TestAgentUpsertWithWhereUniqueWithoutAgentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TestAgentCreateManyAgentInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TestAgentWhereUniqueInputSchema),z.lazy(() => TestAgentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TestAgentWhereUniqueInputSchema),z.lazy(() => TestAgentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TestAgentWhereUniqueInputSchema),z.lazy(() => TestAgentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TestAgentWhereUniqueInputSchema),z.lazy(() => TestAgentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TestAgentUpdateWithWhereUniqueWithoutAgentInputSchema),z.lazy(() => TestAgentUpdateWithWhereUniqueWithoutAgentInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TestAgentUpdateManyWithWhereWithoutAgentInputSchema),z.lazy(() => TestAgentUpdateManyWithWhereWithoutAgentInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TestAgentScalarWhereInputSchema),z.lazy(() => TestAgentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const IntentUpdateManyWithoutAgentNestedInputSchema: z.ZodType<Prisma.IntentUpdateManyWithoutAgentNestedInput> = z.object({
  create: z.union([ z.lazy(() => IntentCreateWithoutAgentInputSchema),z.lazy(() => IntentCreateWithoutAgentInputSchema).array(),z.lazy(() => IntentUncheckedCreateWithoutAgentInputSchema),z.lazy(() => IntentUncheckedCreateWithoutAgentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => IntentCreateOrConnectWithoutAgentInputSchema),z.lazy(() => IntentCreateOrConnectWithoutAgentInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => IntentUpsertWithWhereUniqueWithoutAgentInputSchema),z.lazy(() => IntentUpsertWithWhereUniqueWithoutAgentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => IntentCreateManyAgentInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => IntentWhereUniqueInputSchema),z.lazy(() => IntentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => IntentWhereUniqueInputSchema),z.lazy(() => IntentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => IntentWhereUniqueInputSchema),z.lazy(() => IntentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => IntentWhereUniqueInputSchema),z.lazy(() => IntentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => IntentUpdateWithWhereUniqueWithoutAgentInputSchema),z.lazy(() => IntentUpdateWithWhereUniqueWithoutAgentInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => IntentUpdateManyWithWhereWithoutAgentInputSchema),z.lazy(() => IntentUpdateManyWithWhereWithoutAgentInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => IntentScalarWhereInputSchema),z.lazy(() => IntentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TestUpdateManyWithoutAgentNestedInputSchema: z.ZodType<Prisma.TestUpdateManyWithoutAgentNestedInput> = z.object({
  create: z.union([ z.lazy(() => TestCreateWithoutAgentInputSchema),z.lazy(() => TestCreateWithoutAgentInputSchema).array(),z.lazy(() => TestUncheckedCreateWithoutAgentInputSchema),z.lazy(() => TestUncheckedCreateWithoutAgentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TestCreateOrConnectWithoutAgentInputSchema),z.lazy(() => TestCreateOrConnectWithoutAgentInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TestUpsertWithWhereUniqueWithoutAgentInputSchema),z.lazy(() => TestUpsertWithWhereUniqueWithoutAgentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TestCreateManyAgentInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TestWhereUniqueInputSchema),z.lazy(() => TestWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TestWhereUniqueInputSchema),z.lazy(() => TestWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TestWhereUniqueInputSchema),z.lazy(() => TestWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TestWhereUniqueInputSchema),z.lazy(() => TestWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TestUpdateWithWhereUniqueWithoutAgentInputSchema),z.lazy(() => TestUpdateWithWhereUniqueWithoutAgentInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TestUpdateManyWithWhereWithoutAgentInputSchema),z.lazy(() => TestUpdateManyWithWhereWithoutAgentInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TestScalarWhereInputSchema),z.lazy(() => TestScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TestAgentUncheckedUpdateManyWithoutAgentNestedInputSchema: z.ZodType<Prisma.TestAgentUncheckedUpdateManyWithoutAgentNestedInput> = z.object({
  create: z.union([ z.lazy(() => TestAgentCreateWithoutAgentInputSchema),z.lazy(() => TestAgentCreateWithoutAgentInputSchema).array(),z.lazy(() => TestAgentUncheckedCreateWithoutAgentInputSchema),z.lazy(() => TestAgentUncheckedCreateWithoutAgentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TestAgentCreateOrConnectWithoutAgentInputSchema),z.lazy(() => TestAgentCreateOrConnectWithoutAgentInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TestAgentUpsertWithWhereUniqueWithoutAgentInputSchema),z.lazy(() => TestAgentUpsertWithWhereUniqueWithoutAgentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TestAgentCreateManyAgentInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TestAgentWhereUniqueInputSchema),z.lazy(() => TestAgentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TestAgentWhereUniqueInputSchema),z.lazy(() => TestAgentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TestAgentWhereUniqueInputSchema),z.lazy(() => TestAgentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TestAgentWhereUniqueInputSchema),z.lazy(() => TestAgentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TestAgentUpdateWithWhereUniqueWithoutAgentInputSchema),z.lazy(() => TestAgentUpdateWithWhereUniqueWithoutAgentInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TestAgentUpdateManyWithWhereWithoutAgentInputSchema),z.lazy(() => TestAgentUpdateManyWithWhereWithoutAgentInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TestAgentScalarWhereInputSchema),z.lazy(() => TestAgentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const IntentUncheckedUpdateManyWithoutAgentNestedInputSchema: z.ZodType<Prisma.IntentUncheckedUpdateManyWithoutAgentNestedInput> = z.object({
  create: z.union([ z.lazy(() => IntentCreateWithoutAgentInputSchema),z.lazy(() => IntentCreateWithoutAgentInputSchema).array(),z.lazy(() => IntentUncheckedCreateWithoutAgentInputSchema),z.lazy(() => IntentUncheckedCreateWithoutAgentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => IntentCreateOrConnectWithoutAgentInputSchema),z.lazy(() => IntentCreateOrConnectWithoutAgentInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => IntentUpsertWithWhereUniqueWithoutAgentInputSchema),z.lazy(() => IntentUpsertWithWhereUniqueWithoutAgentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => IntentCreateManyAgentInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => IntentWhereUniqueInputSchema),z.lazy(() => IntentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => IntentWhereUniqueInputSchema),z.lazy(() => IntentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => IntentWhereUniqueInputSchema),z.lazy(() => IntentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => IntentWhereUniqueInputSchema),z.lazy(() => IntentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => IntentUpdateWithWhereUniqueWithoutAgentInputSchema),z.lazy(() => IntentUpdateWithWhereUniqueWithoutAgentInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => IntentUpdateManyWithWhereWithoutAgentInputSchema),z.lazy(() => IntentUpdateManyWithWhereWithoutAgentInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => IntentScalarWhereInputSchema),z.lazy(() => IntentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TestUncheckedUpdateManyWithoutAgentNestedInputSchema: z.ZodType<Prisma.TestUncheckedUpdateManyWithoutAgentNestedInput> = z.object({
  create: z.union([ z.lazy(() => TestCreateWithoutAgentInputSchema),z.lazy(() => TestCreateWithoutAgentInputSchema).array(),z.lazy(() => TestUncheckedCreateWithoutAgentInputSchema),z.lazy(() => TestUncheckedCreateWithoutAgentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TestCreateOrConnectWithoutAgentInputSchema),z.lazy(() => TestCreateOrConnectWithoutAgentInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TestUpsertWithWhereUniqueWithoutAgentInputSchema),z.lazy(() => TestUpsertWithWhereUniqueWithoutAgentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TestCreateManyAgentInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TestWhereUniqueInputSchema),z.lazy(() => TestWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TestWhereUniqueInputSchema),z.lazy(() => TestWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TestWhereUniqueInputSchema),z.lazy(() => TestWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TestWhereUniqueInputSchema),z.lazy(() => TestWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TestUpdateWithWhereUniqueWithoutAgentInputSchema),z.lazy(() => TestUpdateWithWhereUniqueWithoutAgentInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TestUpdateManyWithWhereWithoutAgentInputSchema),z.lazy(() => TestUpdateManyWithWhereWithoutAgentInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TestScalarWhereInputSchema),z.lazy(() => TestScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AgentCreateNestedOneWithoutTestsInputSchema: z.ZodType<Prisma.AgentCreateNestedOneWithoutTestsInput> = z.object({
  create: z.union([ z.lazy(() => AgentCreateWithoutTestsInputSchema),z.lazy(() => AgentUncheckedCreateWithoutTestsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AgentCreateOrConnectWithoutTestsInputSchema).optional(),
  connect: z.lazy(() => AgentWhereUniqueInputSchema).optional()
}).strict();

export const TestAgentCreateNestedManyWithoutTestsInputSchema: z.ZodType<Prisma.TestAgentCreateNestedManyWithoutTestsInput> = z.object({
  create: z.union([ z.lazy(() => TestAgentCreateWithoutTestsInputSchema),z.lazy(() => TestAgentCreateWithoutTestsInputSchema).array(),z.lazy(() => TestAgentUncheckedCreateWithoutTestsInputSchema),z.lazy(() => TestAgentUncheckedCreateWithoutTestsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TestAgentCreateOrConnectWithoutTestsInputSchema),z.lazy(() => TestAgentCreateOrConnectWithoutTestsInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TestAgentWhereUniqueInputSchema),z.lazy(() => TestAgentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CallCreateNestedManyWithoutTestInputSchema: z.ZodType<Prisma.CallCreateNestedManyWithoutTestInput> = z.object({
  create: z.union([ z.lazy(() => CallCreateWithoutTestInputSchema),z.lazy(() => CallCreateWithoutTestInputSchema).array(),z.lazy(() => CallUncheckedCreateWithoutTestInputSchema),z.lazy(() => CallUncheckedCreateWithoutTestInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CallCreateOrConnectWithoutTestInputSchema),z.lazy(() => CallCreateOrConnectWithoutTestInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CallCreateManyTestInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TestAgentUncheckedCreateNestedManyWithoutTestsInputSchema: z.ZodType<Prisma.TestAgentUncheckedCreateNestedManyWithoutTestsInput> = z.object({
  create: z.union([ z.lazy(() => TestAgentCreateWithoutTestsInputSchema),z.lazy(() => TestAgentCreateWithoutTestsInputSchema).array(),z.lazy(() => TestAgentUncheckedCreateWithoutTestsInputSchema),z.lazy(() => TestAgentUncheckedCreateWithoutTestsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TestAgentCreateOrConnectWithoutTestsInputSchema),z.lazy(() => TestAgentCreateOrConnectWithoutTestsInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TestAgentWhereUniqueInputSchema),z.lazy(() => TestAgentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CallUncheckedCreateNestedManyWithoutTestInputSchema: z.ZodType<Prisma.CallUncheckedCreateNestedManyWithoutTestInput> = z.object({
  create: z.union([ z.lazy(() => CallCreateWithoutTestInputSchema),z.lazy(() => CallCreateWithoutTestInputSchema).array(),z.lazy(() => CallUncheckedCreateWithoutTestInputSchema),z.lazy(() => CallUncheckedCreateWithoutTestInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CallCreateOrConnectWithoutTestInputSchema),z.lazy(() => CallCreateOrConnectWithoutTestInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CallCreateManyTestInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AgentUpdateOneRequiredWithoutTestsNestedInputSchema: z.ZodType<Prisma.AgentUpdateOneRequiredWithoutTestsNestedInput> = z.object({
  create: z.union([ z.lazy(() => AgentCreateWithoutTestsInputSchema),z.lazy(() => AgentUncheckedCreateWithoutTestsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AgentCreateOrConnectWithoutTestsInputSchema).optional(),
  upsert: z.lazy(() => AgentUpsertWithoutTestsInputSchema).optional(),
  connect: z.lazy(() => AgentWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => AgentUpdateToOneWithWhereWithoutTestsInputSchema),z.lazy(() => AgentUpdateWithoutTestsInputSchema),z.lazy(() => AgentUncheckedUpdateWithoutTestsInputSchema) ]).optional(),
}).strict();

export const TestAgentUpdateManyWithoutTestsNestedInputSchema: z.ZodType<Prisma.TestAgentUpdateManyWithoutTestsNestedInput> = z.object({
  create: z.union([ z.lazy(() => TestAgentCreateWithoutTestsInputSchema),z.lazy(() => TestAgentCreateWithoutTestsInputSchema).array(),z.lazy(() => TestAgentUncheckedCreateWithoutTestsInputSchema),z.lazy(() => TestAgentUncheckedCreateWithoutTestsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TestAgentCreateOrConnectWithoutTestsInputSchema),z.lazy(() => TestAgentCreateOrConnectWithoutTestsInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TestAgentUpsertWithWhereUniqueWithoutTestsInputSchema),z.lazy(() => TestAgentUpsertWithWhereUniqueWithoutTestsInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => TestAgentWhereUniqueInputSchema),z.lazy(() => TestAgentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TestAgentWhereUniqueInputSchema),z.lazy(() => TestAgentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TestAgentWhereUniqueInputSchema),z.lazy(() => TestAgentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TestAgentWhereUniqueInputSchema),z.lazy(() => TestAgentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TestAgentUpdateWithWhereUniqueWithoutTestsInputSchema),z.lazy(() => TestAgentUpdateWithWhereUniqueWithoutTestsInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TestAgentUpdateManyWithWhereWithoutTestsInputSchema),z.lazy(() => TestAgentUpdateManyWithWhereWithoutTestsInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TestAgentScalarWhereInputSchema),z.lazy(() => TestAgentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CallUpdateManyWithoutTestNestedInputSchema: z.ZodType<Prisma.CallUpdateManyWithoutTestNestedInput> = z.object({
  create: z.union([ z.lazy(() => CallCreateWithoutTestInputSchema),z.lazy(() => CallCreateWithoutTestInputSchema).array(),z.lazy(() => CallUncheckedCreateWithoutTestInputSchema),z.lazy(() => CallUncheckedCreateWithoutTestInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CallCreateOrConnectWithoutTestInputSchema),z.lazy(() => CallCreateOrConnectWithoutTestInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CallUpsertWithWhereUniqueWithoutTestInputSchema),z.lazy(() => CallUpsertWithWhereUniqueWithoutTestInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CallCreateManyTestInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CallUpdateWithWhereUniqueWithoutTestInputSchema),z.lazy(() => CallUpdateWithWhereUniqueWithoutTestInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CallUpdateManyWithWhereWithoutTestInputSchema),z.lazy(() => CallUpdateManyWithWhereWithoutTestInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CallScalarWhereInputSchema),z.lazy(() => CallScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TestAgentUncheckedUpdateManyWithoutTestsNestedInputSchema: z.ZodType<Prisma.TestAgentUncheckedUpdateManyWithoutTestsNestedInput> = z.object({
  create: z.union([ z.lazy(() => TestAgentCreateWithoutTestsInputSchema),z.lazy(() => TestAgentCreateWithoutTestsInputSchema).array(),z.lazy(() => TestAgentUncheckedCreateWithoutTestsInputSchema),z.lazy(() => TestAgentUncheckedCreateWithoutTestsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TestAgentCreateOrConnectWithoutTestsInputSchema),z.lazy(() => TestAgentCreateOrConnectWithoutTestsInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TestAgentUpsertWithWhereUniqueWithoutTestsInputSchema),z.lazy(() => TestAgentUpsertWithWhereUniqueWithoutTestsInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => TestAgentWhereUniqueInputSchema),z.lazy(() => TestAgentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TestAgentWhereUniqueInputSchema),z.lazy(() => TestAgentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TestAgentWhereUniqueInputSchema),z.lazy(() => TestAgentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TestAgentWhereUniqueInputSchema),z.lazy(() => TestAgentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TestAgentUpdateWithWhereUniqueWithoutTestsInputSchema),z.lazy(() => TestAgentUpdateWithWhereUniqueWithoutTestsInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TestAgentUpdateManyWithWhereWithoutTestsInputSchema),z.lazy(() => TestAgentUpdateManyWithWhereWithoutTestsInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TestAgentScalarWhereInputSchema),z.lazy(() => TestAgentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CallUncheckedUpdateManyWithoutTestNestedInputSchema: z.ZodType<Prisma.CallUncheckedUpdateManyWithoutTestNestedInput> = z.object({
  create: z.union([ z.lazy(() => CallCreateWithoutTestInputSchema),z.lazy(() => CallCreateWithoutTestInputSchema).array(),z.lazy(() => CallUncheckedCreateWithoutTestInputSchema),z.lazy(() => CallUncheckedCreateWithoutTestInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CallCreateOrConnectWithoutTestInputSchema),z.lazy(() => CallCreateOrConnectWithoutTestInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CallUpsertWithWhereUniqueWithoutTestInputSchema),z.lazy(() => CallUpsertWithWhereUniqueWithoutTestInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CallCreateManyTestInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CallUpdateWithWhereUniqueWithoutTestInputSchema),z.lazy(() => CallUpdateWithWhereUniqueWithoutTestInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CallUpdateManyWithWhereWithoutTestInputSchema),z.lazy(() => CallUpdateManyWithWhereWithoutTestInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CallScalarWhereInputSchema),z.lazy(() => CallScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CallCreateNestedManyWithoutTestAgentInputSchema: z.ZodType<Prisma.CallCreateNestedManyWithoutTestAgentInput> = z.object({
  create: z.union([ z.lazy(() => CallCreateWithoutTestAgentInputSchema),z.lazy(() => CallCreateWithoutTestAgentInputSchema).array(),z.lazy(() => CallUncheckedCreateWithoutTestAgentInputSchema),z.lazy(() => CallUncheckedCreateWithoutTestAgentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CallCreateOrConnectWithoutTestAgentInputSchema),z.lazy(() => CallCreateOrConnectWithoutTestAgentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CallCreateManyTestAgentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AgentCreateNestedOneWithoutTestAgentsInputSchema: z.ZodType<Prisma.AgentCreateNestedOneWithoutTestAgentsInput> = z.object({
  create: z.union([ z.lazy(() => AgentCreateWithoutTestAgentsInputSchema),z.lazy(() => AgentUncheckedCreateWithoutTestAgentsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AgentCreateOrConnectWithoutTestAgentsInputSchema).optional(),
  connect: z.lazy(() => AgentWhereUniqueInputSchema).optional()
}).strict();

export const TestCreateNestedManyWithoutTestAgentsInputSchema: z.ZodType<Prisma.TestCreateNestedManyWithoutTestAgentsInput> = z.object({
  create: z.union([ z.lazy(() => TestCreateWithoutTestAgentsInputSchema),z.lazy(() => TestCreateWithoutTestAgentsInputSchema).array(),z.lazy(() => TestUncheckedCreateWithoutTestAgentsInputSchema),z.lazy(() => TestUncheckedCreateWithoutTestAgentsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TestCreateOrConnectWithoutTestAgentsInputSchema),z.lazy(() => TestCreateOrConnectWithoutTestAgentsInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TestWhereUniqueInputSchema),z.lazy(() => TestWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CallUncheckedCreateNestedManyWithoutTestAgentInputSchema: z.ZodType<Prisma.CallUncheckedCreateNestedManyWithoutTestAgentInput> = z.object({
  create: z.union([ z.lazy(() => CallCreateWithoutTestAgentInputSchema),z.lazy(() => CallCreateWithoutTestAgentInputSchema).array(),z.lazy(() => CallUncheckedCreateWithoutTestAgentInputSchema),z.lazy(() => CallUncheckedCreateWithoutTestAgentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CallCreateOrConnectWithoutTestAgentInputSchema),z.lazy(() => CallCreateOrConnectWithoutTestAgentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CallCreateManyTestAgentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TestUncheckedCreateNestedManyWithoutTestAgentsInputSchema: z.ZodType<Prisma.TestUncheckedCreateNestedManyWithoutTestAgentsInput> = z.object({
  create: z.union([ z.lazy(() => TestCreateWithoutTestAgentsInputSchema),z.lazy(() => TestCreateWithoutTestAgentsInputSchema).array(),z.lazy(() => TestUncheckedCreateWithoutTestAgentsInputSchema),z.lazy(() => TestUncheckedCreateWithoutTestAgentsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TestCreateOrConnectWithoutTestAgentsInputSchema),z.lazy(() => TestCreateOrConnectWithoutTestAgentsInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TestWhereUniqueInputSchema),z.lazy(() => TestWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict();

export const CallUpdateManyWithoutTestAgentNestedInputSchema: z.ZodType<Prisma.CallUpdateManyWithoutTestAgentNestedInput> = z.object({
  create: z.union([ z.lazy(() => CallCreateWithoutTestAgentInputSchema),z.lazy(() => CallCreateWithoutTestAgentInputSchema).array(),z.lazy(() => CallUncheckedCreateWithoutTestAgentInputSchema),z.lazy(() => CallUncheckedCreateWithoutTestAgentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CallCreateOrConnectWithoutTestAgentInputSchema),z.lazy(() => CallCreateOrConnectWithoutTestAgentInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CallUpsertWithWhereUniqueWithoutTestAgentInputSchema),z.lazy(() => CallUpsertWithWhereUniqueWithoutTestAgentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CallCreateManyTestAgentInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CallUpdateWithWhereUniqueWithoutTestAgentInputSchema),z.lazy(() => CallUpdateWithWhereUniqueWithoutTestAgentInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CallUpdateManyWithWhereWithoutTestAgentInputSchema),z.lazy(() => CallUpdateManyWithWhereWithoutTestAgentInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CallScalarWhereInputSchema),z.lazy(() => CallScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AgentUpdateOneWithoutTestAgentsNestedInputSchema: z.ZodType<Prisma.AgentUpdateOneWithoutTestAgentsNestedInput> = z.object({
  create: z.union([ z.lazy(() => AgentCreateWithoutTestAgentsInputSchema),z.lazy(() => AgentUncheckedCreateWithoutTestAgentsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AgentCreateOrConnectWithoutTestAgentsInputSchema).optional(),
  upsert: z.lazy(() => AgentUpsertWithoutTestAgentsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => AgentWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => AgentWhereInputSchema) ]).optional(),
  connect: z.lazy(() => AgentWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => AgentUpdateToOneWithWhereWithoutTestAgentsInputSchema),z.lazy(() => AgentUpdateWithoutTestAgentsInputSchema),z.lazy(() => AgentUncheckedUpdateWithoutTestAgentsInputSchema) ]).optional(),
}).strict();

export const TestUpdateManyWithoutTestAgentsNestedInputSchema: z.ZodType<Prisma.TestUpdateManyWithoutTestAgentsNestedInput> = z.object({
  create: z.union([ z.lazy(() => TestCreateWithoutTestAgentsInputSchema),z.lazy(() => TestCreateWithoutTestAgentsInputSchema).array(),z.lazy(() => TestUncheckedCreateWithoutTestAgentsInputSchema),z.lazy(() => TestUncheckedCreateWithoutTestAgentsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TestCreateOrConnectWithoutTestAgentsInputSchema),z.lazy(() => TestCreateOrConnectWithoutTestAgentsInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TestUpsertWithWhereUniqueWithoutTestAgentsInputSchema),z.lazy(() => TestUpsertWithWhereUniqueWithoutTestAgentsInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => TestWhereUniqueInputSchema),z.lazy(() => TestWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TestWhereUniqueInputSchema),z.lazy(() => TestWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TestWhereUniqueInputSchema),z.lazy(() => TestWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TestWhereUniqueInputSchema),z.lazy(() => TestWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TestUpdateWithWhereUniqueWithoutTestAgentsInputSchema),z.lazy(() => TestUpdateWithWhereUniqueWithoutTestAgentsInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TestUpdateManyWithWhereWithoutTestAgentsInputSchema),z.lazy(() => TestUpdateManyWithWhereWithoutTestAgentsInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TestScalarWhereInputSchema),z.lazy(() => TestScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CallUncheckedUpdateManyWithoutTestAgentNestedInputSchema: z.ZodType<Prisma.CallUncheckedUpdateManyWithoutTestAgentNestedInput> = z.object({
  create: z.union([ z.lazy(() => CallCreateWithoutTestAgentInputSchema),z.lazy(() => CallCreateWithoutTestAgentInputSchema).array(),z.lazy(() => CallUncheckedCreateWithoutTestAgentInputSchema),z.lazy(() => CallUncheckedCreateWithoutTestAgentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CallCreateOrConnectWithoutTestAgentInputSchema),z.lazy(() => CallCreateOrConnectWithoutTestAgentInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CallUpsertWithWhereUniqueWithoutTestAgentInputSchema),z.lazy(() => CallUpsertWithWhereUniqueWithoutTestAgentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CallCreateManyTestAgentInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CallUpdateWithWhereUniqueWithoutTestAgentInputSchema),z.lazy(() => CallUpdateWithWhereUniqueWithoutTestAgentInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CallUpdateManyWithWhereWithoutTestAgentInputSchema),z.lazy(() => CallUpdateManyWithWhereWithoutTestAgentInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CallScalarWhereInputSchema),z.lazy(() => CallScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TestUncheckedUpdateManyWithoutTestAgentsNestedInputSchema: z.ZodType<Prisma.TestUncheckedUpdateManyWithoutTestAgentsNestedInput> = z.object({
  create: z.union([ z.lazy(() => TestCreateWithoutTestAgentsInputSchema),z.lazy(() => TestCreateWithoutTestAgentsInputSchema).array(),z.lazy(() => TestUncheckedCreateWithoutTestAgentsInputSchema),z.lazy(() => TestUncheckedCreateWithoutTestAgentsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TestCreateOrConnectWithoutTestAgentsInputSchema),z.lazy(() => TestCreateOrConnectWithoutTestAgentsInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TestUpsertWithWhereUniqueWithoutTestAgentsInputSchema),z.lazy(() => TestUpsertWithWhereUniqueWithoutTestAgentsInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => TestWhereUniqueInputSchema),z.lazy(() => TestWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TestWhereUniqueInputSchema),z.lazy(() => TestWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TestWhereUniqueInputSchema),z.lazy(() => TestWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TestWhereUniqueInputSchema),z.lazy(() => TestWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TestUpdateWithWhereUniqueWithoutTestAgentsInputSchema),z.lazy(() => TestUpdateWithWhereUniqueWithoutTestAgentsInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TestUpdateManyWithWhereWithoutTestAgentsInputSchema),z.lazy(() => TestUpdateManyWithWhereWithoutTestAgentsInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TestScalarWhereInputSchema),z.lazy(() => TestScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AgentCreateNestedOneWithoutIntentsInputSchema: z.ZodType<Prisma.AgentCreateNestedOneWithoutIntentsInput> = z.object({
  create: z.union([ z.lazy(() => AgentCreateWithoutIntentsInputSchema),z.lazy(() => AgentUncheckedCreateWithoutIntentsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AgentCreateOrConnectWithoutIntentsInputSchema).optional(),
  connect: z.lazy(() => AgentWhereUniqueInputSchema).optional()
}).strict();

export const AgentUpdateOneRequiredWithoutIntentsNestedInputSchema: z.ZodType<Prisma.AgentUpdateOneRequiredWithoutIntentsNestedInput> = z.object({
  create: z.union([ z.lazy(() => AgentCreateWithoutIntentsInputSchema),z.lazy(() => AgentUncheckedCreateWithoutIntentsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AgentCreateOrConnectWithoutIntentsInputSchema).optional(),
  upsert: z.lazy(() => AgentUpsertWithoutIntentsInputSchema).optional(),
  connect: z.lazy(() => AgentWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => AgentUpdateToOneWithWhereWithoutIntentsInputSchema),z.lazy(() => AgentUpdateWithoutIntentsInputSchema),z.lazy(() => AgentUncheckedUpdateWithoutIntentsInputSchema) ]).optional(),
}).strict();

export const TestCreateNestedOneWithoutCallsInputSchema: z.ZodType<Prisma.TestCreateNestedOneWithoutCallsInput> = z.object({
  create: z.union([ z.lazy(() => TestCreateWithoutCallsInputSchema),z.lazy(() => TestUncheckedCreateWithoutCallsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TestCreateOrConnectWithoutCallsInputSchema).optional(),
  connect: z.lazy(() => TestWhereUniqueInputSchema).optional()
}).strict();

export const TestAgentCreateNestedOneWithoutCallInputSchema: z.ZodType<Prisma.TestAgentCreateNestedOneWithoutCallInput> = z.object({
  create: z.union([ z.lazy(() => TestAgentCreateWithoutCallInputSchema),z.lazy(() => TestAgentUncheckedCreateWithoutCallInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TestAgentCreateOrConnectWithoutCallInputSchema).optional(),
  connect: z.lazy(() => TestAgentWhereUniqueInputSchema).optional()
}).strict();

export const MessageCreateNestedManyWithoutCallInputSchema: z.ZodType<Prisma.MessageCreateNestedManyWithoutCallInput> = z.object({
  create: z.union([ z.lazy(() => MessageCreateWithoutCallInputSchema),z.lazy(() => MessageCreateWithoutCallInputSchema).array(),z.lazy(() => MessageUncheckedCreateWithoutCallInputSchema),z.lazy(() => MessageUncheckedCreateWithoutCallInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MessageCreateOrConnectWithoutCallInputSchema),z.lazy(() => MessageCreateOrConnectWithoutCallInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MessageCreateManyCallInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MessageWhereUniqueInputSchema),z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CallErrorCreateNestedManyWithoutCallInputSchema: z.ZodType<Prisma.CallErrorCreateNestedManyWithoutCallInput> = z.object({
  create: z.union([ z.lazy(() => CallErrorCreateWithoutCallInputSchema),z.lazy(() => CallErrorCreateWithoutCallInputSchema).array(),z.lazy(() => CallErrorUncheckedCreateWithoutCallInputSchema),z.lazy(() => CallErrorUncheckedCreateWithoutCallInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CallErrorCreateOrConnectWithoutCallInputSchema),z.lazy(() => CallErrorCreateOrConnectWithoutCallInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CallErrorCreateManyCallInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CallErrorWhereUniqueInputSchema),z.lazy(() => CallErrorWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const MessageUncheckedCreateNestedManyWithoutCallInputSchema: z.ZodType<Prisma.MessageUncheckedCreateNestedManyWithoutCallInput> = z.object({
  create: z.union([ z.lazy(() => MessageCreateWithoutCallInputSchema),z.lazy(() => MessageCreateWithoutCallInputSchema).array(),z.lazy(() => MessageUncheckedCreateWithoutCallInputSchema),z.lazy(() => MessageUncheckedCreateWithoutCallInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MessageCreateOrConnectWithoutCallInputSchema),z.lazy(() => MessageCreateOrConnectWithoutCallInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MessageCreateManyCallInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MessageWhereUniqueInputSchema),z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CallErrorUncheckedCreateNestedManyWithoutCallInputSchema: z.ZodType<Prisma.CallErrorUncheckedCreateNestedManyWithoutCallInput> = z.object({
  create: z.union([ z.lazy(() => CallErrorCreateWithoutCallInputSchema),z.lazy(() => CallErrorCreateWithoutCallInputSchema).array(),z.lazy(() => CallErrorUncheckedCreateWithoutCallInputSchema),z.lazy(() => CallErrorUncheckedCreateWithoutCallInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CallErrorCreateOrConnectWithoutCallInputSchema),z.lazy(() => CallErrorCreateOrConnectWithoutCallInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CallErrorCreateManyCallInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CallErrorWhereUniqueInputSchema),z.lazy(() => CallErrorWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EnumCallStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumCallStatusFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => CallStatusSchema).optional()
}).strict();

export const EnumCallResultFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumCallResultFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => CallResultSchema).optional()
}).strict();

export const TestUpdateOneRequiredWithoutCallsNestedInputSchema: z.ZodType<Prisma.TestUpdateOneRequiredWithoutCallsNestedInput> = z.object({
  create: z.union([ z.lazy(() => TestCreateWithoutCallsInputSchema),z.lazy(() => TestUncheckedCreateWithoutCallsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TestCreateOrConnectWithoutCallsInputSchema).optional(),
  upsert: z.lazy(() => TestUpsertWithoutCallsInputSchema).optional(),
  connect: z.lazy(() => TestWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => TestUpdateToOneWithWhereWithoutCallsInputSchema),z.lazy(() => TestUpdateWithoutCallsInputSchema),z.lazy(() => TestUncheckedUpdateWithoutCallsInputSchema) ]).optional(),
}).strict();

export const TestAgentUpdateOneRequiredWithoutCallNestedInputSchema: z.ZodType<Prisma.TestAgentUpdateOneRequiredWithoutCallNestedInput> = z.object({
  create: z.union([ z.lazy(() => TestAgentCreateWithoutCallInputSchema),z.lazy(() => TestAgentUncheckedCreateWithoutCallInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TestAgentCreateOrConnectWithoutCallInputSchema).optional(),
  upsert: z.lazy(() => TestAgentUpsertWithoutCallInputSchema).optional(),
  connect: z.lazy(() => TestAgentWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => TestAgentUpdateToOneWithWhereWithoutCallInputSchema),z.lazy(() => TestAgentUpdateWithoutCallInputSchema),z.lazy(() => TestAgentUncheckedUpdateWithoutCallInputSchema) ]).optional(),
}).strict();

export const MessageUpdateManyWithoutCallNestedInputSchema: z.ZodType<Prisma.MessageUpdateManyWithoutCallNestedInput> = z.object({
  create: z.union([ z.lazy(() => MessageCreateWithoutCallInputSchema),z.lazy(() => MessageCreateWithoutCallInputSchema).array(),z.lazy(() => MessageUncheckedCreateWithoutCallInputSchema),z.lazy(() => MessageUncheckedCreateWithoutCallInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MessageCreateOrConnectWithoutCallInputSchema),z.lazy(() => MessageCreateOrConnectWithoutCallInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MessageUpsertWithWhereUniqueWithoutCallInputSchema),z.lazy(() => MessageUpsertWithWhereUniqueWithoutCallInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MessageCreateManyCallInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MessageWhereUniqueInputSchema),z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MessageWhereUniqueInputSchema),z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MessageWhereUniqueInputSchema),z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MessageWhereUniqueInputSchema),z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MessageUpdateWithWhereUniqueWithoutCallInputSchema),z.lazy(() => MessageUpdateWithWhereUniqueWithoutCallInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MessageUpdateManyWithWhereWithoutCallInputSchema),z.lazy(() => MessageUpdateManyWithWhereWithoutCallInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MessageScalarWhereInputSchema),z.lazy(() => MessageScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CallErrorUpdateManyWithoutCallNestedInputSchema: z.ZodType<Prisma.CallErrorUpdateManyWithoutCallNestedInput> = z.object({
  create: z.union([ z.lazy(() => CallErrorCreateWithoutCallInputSchema),z.lazy(() => CallErrorCreateWithoutCallInputSchema).array(),z.lazy(() => CallErrorUncheckedCreateWithoutCallInputSchema),z.lazy(() => CallErrorUncheckedCreateWithoutCallInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CallErrorCreateOrConnectWithoutCallInputSchema),z.lazy(() => CallErrorCreateOrConnectWithoutCallInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CallErrorUpsertWithWhereUniqueWithoutCallInputSchema),z.lazy(() => CallErrorUpsertWithWhereUniqueWithoutCallInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CallErrorCreateManyCallInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CallErrorWhereUniqueInputSchema),z.lazy(() => CallErrorWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CallErrorWhereUniqueInputSchema),z.lazy(() => CallErrorWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CallErrorWhereUniqueInputSchema),z.lazy(() => CallErrorWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CallErrorWhereUniqueInputSchema),z.lazy(() => CallErrorWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CallErrorUpdateWithWhereUniqueWithoutCallInputSchema),z.lazy(() => CallErrorUpdateWithWhereUniqueWithoutCallInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CallErrorUpdateManyWithWhereWithoutCallInputSchema),z.lazy(() => CallErrorUpdateManyWithWhereWithoutCallInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CallErrorScalarWhereInputSchema),z.lazy(() => CallErrorScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const MessageUncheckedUpdateManyWithoutCallNestedInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateManyWithoutCallNestedInput> = z.object({
  create: z.union([ z.lazy(() => MessageCreateWithoutCallInputSchema),z.lazy(() => MessageCreateWithoutCallInputSchema).array(),z.lazy(() => MessageUncheckedCreateWithoutCallInputSchema),z.lazy(() => MessageUncheckedCreateWithoutCallInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MessageCreateOrConnectWithoutCallInputSchema),z.lazy(() => MessageCreateOrConnectWithoutCallInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MessageUpsertWithWhereUniqueWithoutCallInputSchema),z.lazy(() => MessageUpsertWithWhereUniqueWithoutCallInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MessageCreateManyCallInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MessageWhereUniqueInputSchema),z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MessageWhereUniqueInputSchema),z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MessageWhereUniqueInputSchema),z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MessageWhereUniqueInputSchema),z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MessageUpdateWithWhereUniqueWithoutCallInputSchema),z.lazy(() => MessageUpdateWithWhereUniqueWithoutCallInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MessageUpdateManyWithWhereWithoutCallInputSchema),z.lazy(() => MessageUpdateManyWithWhereWithoutCallInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MessageScalarWhereInputSchema),z.lazy(() => MessageScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CallErrorUncheckedUpdateManyWithoutCallNestedInputSchema: z.ZodType<Prisma.CallErrorUncheckedUpdateManyWithoutCallNestedInput> = z.object({
  create: z.union([ z.lazy(() => CallErrorCreateWithoutCallInputSchema),z.lazy(() => CallErrorCreateWithoutCallInputSchema).array(),z.lazy(() => CallErrorUncheckedCreateWithoutCallInputSchema),z.lazy(() => CallErrorUncheckedCreateWithoutCallInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CallErrorCreateOrConnectWithoutCallInputSchema),z.lazy(() => CallErrorCreateOrConnectWithoutCallInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CallErrorUpsertWithWhereUniqueWithoutCallInputSchema),z.lazy(() => CallErrorUpsertWithWhereUniqueWithoutCallInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CallErrorCreateManyCallInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CallErrorWhereUniqueInputSchema),z.lazy(() => CallErrorWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CallErrorWhereUniqueInputSchema),z.lazy(() => CallErrorWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CallErrorWhereUniqueInputSchema),z.lazy(() => CallErrorWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CallErrorWhereUniqueInputSchema),z.lazy(() => CallErrorWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CallErrorUpdateWithWhereUniqueWithoutCallInputSchema),z.lazy(() => CallErrorUpdateWithWhereUniqueWithoutCallInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CallErrorUpdateManyWithWhereWithoutCallInputSchema),z.lazy(() => CallErrorUpdateManyWithWhereWithoutCallInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CallErrorScalarWhereInputSchema),z.lazy(() => CallErrorScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CallCreateNestedOneWithoutMessagesInputSchema: z.ZodType<Prisma.CallCreateNestedOneWithoutMessagesInput> = z.object({
  create: z.union([ z.lazy(() => CallCreateWithoutMessagesInputSchema),z.lazy(() => CallUncheckedCreateWithoutMessagesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CallCreateOrConnectWithoutMessagesInputSchema).optional(),
  connect: z.lazy(() => CallWhereUniqueInputSchema).optional()
}).strict();

export const EnumRoleFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumRoleFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => RoleSchema).optional()
}).strict();

export const FloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.FloatFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const CallUpdateOneRequiredWithoutMessagesNestedInputSchema: z.ZodType<Prisma.CallUpdateOneRequiredWithoutMessagesNestedInput> = z.object({
  create: z.union([ z.lazy(() => CallCreateWithoutMessagesInputSchema),z.lazy(() => CallUncheckedCreateWithoutMessagesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CallCreateOrConnectWithoutMessagesInputSchema).optional(),
  upsert: z.lazy(() => CallUpsertWithoutMessagesInputSchema).optional(),
  connect: z.lazy(() => CallWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CallUpdateToOneWithWhereWithoutMessagesInputSchema),z.lazy(() => CallUpdateWithoutMessagesInputSchema),z.lazy(() => CallUncheckedUpdateWithoutMessagesInputSchema) ]).optional(),
}).strict();

export const CallCreateNestedOneWithoutErrorsInputSchema: z.ZodType<Prisma.CallCreateNestedOneWithoutErrorsInput> = z.object({
  create: z.union([ z.lazy(() => CallCreateWithoutErrorsInputSchema),z.lazy(() => CallUncheckedCreateWithoutErrorsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CallCreateOrConnectWithoutErrorsInputSchema).optional(),
  connect: z.lazy(() => CallWhereUniqueInputSchema).optional()
}).strict();

export const CallUpdateOneRequiredWithoutErrorsNestedInputSchema: z.ZodType<Prisma.CallUpdateOneRequiredWithoutErrorsNestedInput> = z.object({
  create: z.union([ z.lazy(() => CallCreateWithoutErrorsInputSchema),z.lazy(() => CallUncheckedCreateWithoutErrorsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CallCreateOrConnectWithoutErrorsInputSchema).optional(),
  upsert: z.lazy(() => CallUpsertWithoutErrorsInputSchema).optional(),
  connect: z.lazy(() => CallWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CallUpdateToOneWithWhereWithoutErrorsInputSchema),z.lazy(() => CallUpdateWithoutErrorsInputSchema),z.lazy(() => CallUncheckedUpdateWithoutErrorsInputSchema) ]).optional(),
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

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const NestedEnumCallStatusFilterSchema: z.ZodType<Prisma.NestedEnumCallStatusFilter> = z.object({
  equals: z.lazy(() => CallStatusSchema).optional(),
  in: z.lazy(() => CallStatusSchema).array().optional(),
  notIn: z.lazy(() => CallStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => NestedEnumCallStatusFilterSchema) ]).optional(),
}).strict();

export const NestedEnumCallResultFilterSchema: z.ZodType<Prisma.NestedEnumCallResultFilter> = z.object({
  equals: z.lazy(() => CallResultSchema).optional(),
  in: z.lazy(() => CallResultSchema).array().optional(),
  notIn: z.lazy(() => CallResultSchema).array().optional(),
  not: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => NestedEnumCallResultFilterSchema) ]).optional(),
}).strict();

export const NestedEnumCallStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumCallStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => CallStatusSchema).optional(),
  in: z.lazy(() => CallStatusSchema).array().optional(),
  notIn: z.lazy(() => CallStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => NestedEnumCallStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumCallStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumCallStatusFilterSchema).optional()
}).strict();

export const NestedEnumCallResultWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumCallResultWithAggregatesFilter> = z.object({
  equals: z.lazy(() => CallResultSchema).optional(),
  in: z.lazy(() => CallResultSchema).array().optional(),
  notIn: z.lazy(() => CallResultSchema).array().optional(),
  not: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => NestedEnumCallResultWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumCallResultFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumCallResultFilterSchema).optional()
}).strict();

export const NestedEnumRoleFilterSchema: z.ZodType<Prisma.NestedEnumRoleFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleFilterSchema) ]).optional(),
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const NestedEnumRoleWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRoleFilterSchema).optional()
}).strict();

export const NestedFloatWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional()
}).strict();

export const TestAgentCreateWithoutAgentInputSchema: z.ZodType<Prisma.TestAgentCreateWithoutAgentInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  enabled: z.boolean().optional(),
  headshotUrl: z.string(),
  description: z.string(),
  prompt: z.string(),
  vapiId: z.string(),
  Call: z.lazy(() => CallCreateNestedManyWithoutTestAgentInputSchema).optional(),
  tests: z.lazy(() => TestCreateNestedManyWithoutTestAgentsInputSchema).optional()
}).strict();

export const TestAgentUncheckedCreateWithoutAgentInputSchema: z.ZodType<Prisma.TestAgentUncheckedCreateWithoutAgentInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  enabled: z.boolean().optional(),
  headshotUrl: z.string(),
  description: z.string(),
  prompt: z.string(),
  vapiId: z.string(),
  Call: z.lazy(() => CallUncheckedCreateNestedManyWithoutTestAgentInputSchema).optional(),
  tests: z.lazy(() => TestUncheckedCreateNestedManyWithoutTestAgentsInputSchema).optional()
}).strict();

export const TestAgentCreateOrConnectWithoutAgentInputSchema: z.ZodType<Prisma.TestAgentCreateOrConnectWithoutAgentInput> = z.object({
  where: z.lazy(() => TestAgentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TestAgentCreateWithoutAgentInputSchema),z.lazy(() => TestAgentUncheckedCreateWithoutAgentInputSchema) ]),
}).strict();

export const TestAgentCreateManyAgentInputEnvelopeSchema: z.ZodType<Prisma.TestAgentCreateManyAgentInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => TestAgentCreateManyAgentInputSchema),z.lazy(() => TestAgentCreateManyAgentInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const IntentCreateWithoutAgentInputSchema: z.ZodType<Prisma.IntentCreateWithoutAgentInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string(),
  details: z.string()
}).strict();

export const IntentUncheckedCreateWithoutAgentInputSchema: z.ZodType<Prisma.IntentUncheckedCreateWithoutAgentInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string(),
  details: z.string()
}).strict();

export const IntentCreateOrConnectWithoutAgentInputSchema: z.ZodType<Prisma.IntentCreateOrConnectWithoutAgentInput> = z.object({
  where: z.lazy(() => IntentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => IntentCreateWithoutAgentInputSchema),z.lazy(() => IntentUncheckedCreateWithoutAgentInputSchema) ]),
}).strict();

export const IntentCreateManyAgentInputEnvelopeSchema: z.ZodType<Prisma.IntentCreateManyAgentInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => IntentCreateManyAgentInputSchema),z.lazy(() => IntentCreateManyAgentInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const TestCreateWithoutAgentInputSchema: z.ZodType<Prisma.TestCreateWithoutAgentInput> = z.object({
  id: z.string().cuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  testAgents: z.lazy(() => TestAgentCreateNestedManyWithoutTestsInputSchema).optional(),
  calls: z.lazy(() => CallCreateNestedManyWithoutTestInputSchema).optional()
}).strict();

export const TestUncheckedCreateWithoutAgentInputSchema: z.ZodType<Prisma.TestUncheckedCreateWithoutAgentInput> = z.object({
  id: z.string().cuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  testAgents: z.lazy(() => TestAgentUncheckedCreateNestedManyWithoutTestsInputSchema).optional(),
  calls: z.lazy(() => CallUncheckedCreateNestedManyWithoutTestInputSchema).optional()
}).strict();

export const TestCreateOrConnectWithoutAgentInputSchema: z.ZodType<Prisma.TestCreateOrConnectWithoutAgentInput> = z.object({
  where: z.lazy(() => TestWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TestCreateWithoutAgentInputSchema),z.lazy(() => TestUncheckedCreateWithoutAgentInputSchema) ]),
}).strict();

export const TestCreateManyAgentInputEnvelopeSchema: z.ZodType<Prisma.TestCreateManyAgentInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => TestCreateManyAgentInputSchema),z.lazy(() => TestCreateManyAgentInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const TestAgentUpsertWithWhereUniqueWithoutAgentInputSchema: z.ZodType<Prisma.TestAgentUpsertWithWhereUniqueWithoutAgentInput> = z.object({
  where: z.lazy(() => TestAgentWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TestAgentUpdateWithoutAgentInputSchema),z.lazy(() => TestAgentUncheckedUpdateWithoutAgentInputSchema) ]),
  create: z.union([ z.lazy(() => TestAgentCreateWithoutAgentInputSchema),z.lazy(() => TestAgentUncheckedCreateWithoutAgentInputSchema) ]),
}).strict();

export const TestAgentUpdateWithWhereUniqueWithoutAgentInputSchema: z.ZodType<Prisma.TestAgentUpdateWithWhereUniqueWithoutAgentInput> = z.object({
  where: z.lazy(() => TestAgentWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TestAgentUpdateWithoutAgentInputSchema),z.lazy(() => TestAgentUncheckedUpdateWithoutAgentInputSchema) ]),
}).strict();

export const TestAgentUpdateManyWithWhereWithoutAgentInputSchema: z.ZodType<Prisma.TestAgentUpdateManyWithWhereWithoutAgentInput> = z.object({
  where: z.lazy(() => TestAgentScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TestAgentUpdateManyMutationInputSchema),z.lazy(() => TestAgentUncheckedUpdateManyWithoutAgentInputSchema) ]),
}).strict();

export const TestAgentScalarWhereInputSchema: z.ZodType<Prisma.TestAgentScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TestAgentScalarWhereInputSchema),z.lazy(() => TestAgentScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TestAgentScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TestAgentScalarWhereInputSchema),z.lazy(() => TestAgentScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  enabled: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  headshotUrl: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  prompt: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  vapiId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  agentId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const IntentUpsertWithWhereUniqueWithoutAgentInputSchema: z.ZodType<Prisma.IntentUpsertWithWhereUniqueWithoutAgentInput> = z.object({
  where: z.lazy(() => IntentWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => IntentUpdateWithoutAgentInputSchema),z.lazy(() => IntentUncheckedUpdateWithoutAgentInputSchema) ]),
  create: z.union([ z.lazy(() => IntentCreateWithoutAgentInputSchema),z.lazy(() => IntentUncheckedCreateWithoutAgentInputSchema) ]),
}).strict();

export const IntentUpdateWithWhereUniqueWithoutAgentInputSchema: z.ZodType<Prisma.IntentUpdateWithWhereUniqueWithoutAgentInput> = z.object({
  where: z.lazy(() => IntentWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => IntentUpdateWithoutAgentInputSchema),z.lazy(() => IntentUncheckedUpdateWithoutAgentInputSchema) ]),
}).strict();

export const IntentUpdateManyWithWhereWithoutAgentInputSchema: z.ZodType<Prisma.IntentUpdateManyWithWhereWithoutAgentInput> = z.object({
  where: z.lazy(() => IntentScalarWhereInputSchema),
  data: z.union([ z.lazy(() => IntentUpdateManyMutationInputSchema),z.lazy(() => IntentUncheckedUpdateManyWithoutAgentInputSchema) ]),
}).strict();

export const IntentScalarWhereInputSchema: z.ZodType<Prisma.IntentScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => IntentScalarWhereInputSchema),z.lazy(() => IntentScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => IntentScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => IntentScalarWhereInputSchema),z.lazy(() => IntentScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  details: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  agentId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const TestUpsertWithWhereUniqueWithoutAgentInputSchema: z.ZodType<Prisma.TestUpsertWithWhereUniqueWithoutAgentInput> = z.object({
  where: z.lazy(() => TestWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TestUpdateWithoutAgentInputSchema),z.lazy(() => TestUncheckedUpdateWithoutAgentInputSchema) ]),
  create: z.union([ z.lazy(() => TestCreateWithoutAgentInputSchema),z.lazy(() => TestUncheckedCreateWithoutAgentInputSchema) ]),
}).strict();

export const TestUpdateWithWhereUniqueWithoutAgentInputSchema: z.ZodType<Prisma.TestUpdateWithWhereUniqueWithoutAgentInput> = z.object({
  where: z.lazy(() => TestWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TestUpdateWithoutAgentInputSchema),z.lazy(() => TestUncheckedUpdateWithoutAgentInputSchema) ]),
}).strict();

export const TestUpdateManyWithWhereWithoutAgentInputSchema: z.ZodType<Prisma.TestUpdateManyWithWhereWithoutAgentInput> = z.object({
  where: z.lazy(() => TestScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TestUpdateManyMutationInputSchema),z.lazy(() => TestUncheckedUpdateManyWithoutAgentInputSchema) ]),
}).strict();

export const TestScalarWhereInputSchema: z.ZodType<Prisma.TestScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TestScalarWhereInputSchema),z.lazy(() => TestScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TestScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TestScalarWhereInputSchema),z.lazy(() => TestScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  agentId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const AgentCreateWithoutTestsInputSchema: z.ZodType<Prisma.AgentCreateWithoutTestsInput> = z.object({
  id: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  phoneNumber: z.string(),
  githubRepoUrl: z.string().optional().nullable(),
  systemPrompt: z.string(),
  ownerId: z.string().optional().nullable(),
  testAgents: z.lazy(() => TestAgentCreateNestedManyWithoutAgentInputSchema).optional(),
  intents: z.lazy(() => IntentCreateNestedManyWithoutAgentInputSchema).optional()
}).strict();

export const AgentUncheckedCreateWithoutTestsInputSchema: z.ZodType<Prisma.AgentUncheckedCreateWithoutTestsInput> = z.object({
  id: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  phoneNumber: z.string(),
  githubRepoUrl: z.string().optional().nullable(),
  systemPrompt: z.string(),
  ownerId: z.string().optional().nullable(),
  testAgents: z.lazy(() => TestAgentUncheckedCreateNestedManyWithoutAgentInputSchema).optional(),
  intents: z.lazy(() => IntentUncheckedCreateNestedManyWithoutAgentInputSchema).optional()
}).strict();

export const AgentCreateOrConnectWithoutTestsInputSchema: z.ZodType<Prisma.AgentCreateOrConnectWithoutTestsInput> = z.object({
  where: z.lazy(() => AgentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AgentCreateWithoutTestsInputSchema),z.lazy(() => AgentUncheckedCreateWithoutTestsInputSchema) ]),
}).strict();

export const TestAgentCreateWithoutTestsInputSchema: z.ZodType<Prisma.TestAgentCreateWithoutTestsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  enabled: z.boolean().optional(),
  headshotUrl: z.string(),
  description: z.string(),
  prompt: z.string(),
  vapiId: z.string(),
  Call: z.lazy(() => CallCreateNestedManyWithoutTestAgentInputSchema).optional(),
  Agent: z.lazy(() => AgentCreateNestedOneWithoutTestAgentsInputSchema).optional()
}).strict();

export const TestAgentUncheckedCreateWithoutTestsInputSchema: z.ZodType<Prisma.TestAgentUncheckedCreateWithoutTestsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  enabled: z.boolean().optional(),
  headshotUrl: z.string(),
  description: z.string(),
  prompt: z.string(),
  vapiId: z.string(),
  agentId: z.string().optional().nullable(),
  Call: z.lazy(() => CallUncheckedCreateNestedManyWithoutTestAgentInputSchema).optional()
}).strict();

export const TestAgentCreateOrConnectWithoutTestsInputSchema: z.ZodType<Prisma.TestAgentCreateOrConnectWithoutTestsInput> = z.object({
  where: z.lazy(() => TestAgentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TestAgentCreateWithoutTestsInputSchema),z.lazy(() => TestAgentUncheckedCreateWithoutTestsInputSchema) ]),
}).strict();

export const CallCreateWithoutTestInputSchema: z.ZodType<Prisma.CallCreateWithoutTestInput> = z.object({
  id: z.string().cuid().optional(),
  status: z.lazy(() => CallStatusSchema),
  result: z.lazy(() => CallResultSchema),
  failureReason: z.string().optional().nullable(),
  stereoRecordingUrl: z.string(),
  testAgent: z.lazy(() => TestAgentCreateNestedOneWithoutCallInputSchema),
  messages: z.lazy(() => MessageCreateNestedManyWithoutCallInputSchema).optional(),
  errors: z.lazy(() => CallErrorCreateNestedManyWithoutCallInputSchema).optional()
}).strict();

export const CallUncheckedCreateWithoutTestInputSchema: z.ZodType<Prisma.CallUncheckedCreateWithoutTestInput> = z.object({
  id: z.string().cuid().optional(),
  status: z.lazy(() => CallStatusSchema),
  result: z.lazy(() => CallResultSchema),
  failureReason: z.string().optional().nullable(),
  stereoRecordingUrl: z.string(),
  testAgentId: z.string(),
  messages: z.lazy(() => MessageUncheckedCreateNestedManyWithoutCallInputSchema).optional(),
  errors: z.lazy(() => CallErrorUncheckedCreateNestedManyWithoutCallInputSchema).optional()
}).strict();

export const CallCreateOrConnectWithoutTestInputSchema: z.ZodType<Prisma.CallCreateOrConnectWithoutTestInput> = z.object({
  where: z.lazy(() => CallWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CallCreateWithoutTestInputSchema),z.lazy(() => CallUncheckedCreateWithoutTestInputSchema) ]),
}).strict();

export const CallCreateManyTestInputEnvelopeSchema: z.ZodType<Prisma.CallCreateManyTestInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CallCreateManyTestInputSchema),z.lazy(() => CallCreateManyTestInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const AgentUpsertWithoutTestsInputSchema: z.ZodType<Prisma.AgentUpsertWithoutTestsInput> = z.object({
  update: z.union([ z.lazy(() => AgentUpdateWithoutTestsInputSchema),z.lazy(() => AgentUncheckedUpdateWithoutTestsInputSchema) ]),
  create: z.union([ z.lazy(() => AgentCreateWithoutTestsInputSchema),z.lazy(() => AgentUncheckedCreateWithoutTestsInputSchema) ]),
  where: z.lazy(() => AgentWhereInputSchema).optional()
}).strict();

export const AgentUpdateToOneWithWhereWithoutTestsInputSchema: z.ZodType<Prisma.AgentUpdateToOneWithWhereWithoutTestsInput> = z.object({
  where: z.lazy(() => AgentWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => AgentUpdateWithoutTestsInputSchema),z.lazy(() => AgentUncheckedUpdateWithoutTestsInputSchema) ]),
}).strict();

export const AgentUpdateWithoutTestsInputSchema: z.ZodType<Prisma.AgentUpdateWithoutTestsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  githubRepoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  systemPrompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testAgents: z.lazy(() => TestAgentUpdateManyWithoutAgentNestedInputSchema).optional(),
  intents: z.lazy(() => IntentUpdateManyWithoutAgentNestedInputSchema).optional()
}).strict();

export const AgentUncheckedUpdateWithoutTestsInputSchema: z.ZodType<Prisma.AgentUncheckedUpdateWithoutTestsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  githubRepoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  systemPrompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testAgents: z.lazy(() => TestAgentUncheckedUpdateManyWithoutAgentNestedInputSchema).optional(),
  intents: z.lazy(() => IntentUncheckedUpdateManyWithoutAgentNestedInputSchema).optional()
}).strict();

export const TestAgentUpsertWithWhereUniqueWithoutTestsInputSchema: z.ZodType<Prisma.TestAgentUpsertWithWhereUniqueWithoutTestsInput> = z.object({
  where: z.lazy(() => TestAgentWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TestAgentUpdateWithoutTestsInputSchema),z.lazy(() => TestAgentUncheckedUpdateWithoutTestsInputSchema) ]),
  create: z.union([ z.lazy(() => TestAgentCreateWithoutTestsInputSchema),z.lazy(() => TestAgentUncheckedCreateWithoutTestsInputSchema) ]),
}).strict();

export const TestAgentUpdateWithWhereUniqueWithoutTestsInputSchema: z.ZodType<Prisma.TestAgentUpdateWithWhereUniqueWithoutTestsInput> = z.object({
  where: z.lazy(() => TestAgentWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TestAgentUpdateWithoutTestsInputSchema),z.lazy(() => TestAgentUncheckedUpdateWithoutTestsInputSchema) ]),
}).strict();

export const TestAgentUpdateManyWithWhereWithoutTestsInputSchema: z.ZodType<Prisma.TestAgentUpdateManyWithWhereWithoutTestsInput> = z.object({
  where: z.lazy(() => TestAgentScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TestAgentUpdateManyMutationInputSchema),z.lazy(() => TestAgentUncheckedUpdateManyWithoutTestsInputSchema) ]),
}).strict();

export const CallUpsertWithWhereUniqueWithoutTestInputSchema: z.ZodType<Prisma.CallUpsertWithWhereUniqueWithoutTestInput> = z.object({
  where: z.lazy(() => CallWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CallUpdateWithoutTestInputSchema),z.lazy(() => CallUncheckedUpdateWithoutTestInputSchema) ]),
  create: z.union([ z.lazy(() => CallCreateWithoutTestInputSchema),z.lazy(() => CallUncheckedCreateWithoutTestInputSchema) ]),
}).strict();

export const CallUpdateWithWhereUniqueWithoutTestInputSchema: z.ZodType<Prisma.CallUpdateWithWhereUniqueWithoutTestInput> = z.object({
  where: z.lazy(() => CallWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CallUpdateWithoutTestInputSchema),z.lazy(() => CallUncheckedUpdateWithoutTestInputSchema) ]),
}).strict();

export const CallUpdateManyWithWhereWithoutTestInputSchema: z.ZodType<Prisma.CallUpdateManyWithWhereWithoutTestInput> = z.object({
  where: z.lazy(() => CallScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CallUpdateManyMutationInputSchema),z.lazy(() => CallUncheckedUpdateManyWithoutTestInputSchema) ]),
}).strict();

export const CallScalarWhereInputSchema: z.ZodType<Prisma.CallScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CallScalarWhereInputSchema),z.lazy(() => CallScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CallScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CallScalarWhereInputSchema),z.lazy(() => CallScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumCallStatusFilterSchema),z.lazy(() => CallStatusSchema) ]).optional(),
  result: z.union([ z.lazy(() => EnumCallResultFilterSchema),z.lazy(() => CallResultSchema) ]).optional(),
  failureReason: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  testId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  testAgentId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const CallCreateWithoutTestAgentInputSchema: z.ZodType<Prisma.CallCreateWithoutTestAgentInput> = z.object({
  id: z.string().cuid().optional(),
  status: z.lazy(() => CallStatusSchema),
  result: z.lazy(() => CallResultSchema),
  failureReason: z.string().optional().nullable(),
  stereoRecordingUrl: z.string(),
  test: z.lazy(() => TestCreateNestedOneWithoutCallsInputSchema),
  messages: z.lazy(() => MessageCreateNestedManyWithoutCallInputSchema).optional(),
  errors: z.lazy(() => CallErrorCreateNestedManyWithoutCallInputSchema).optional()
}).strict();

export const CallUncheckedCreateWithoutTestAgentInputSchema: z.ZodType<Prisma.CallUncheckedCreateWithoutTestAgentInput> = z.object({
  id: z.string().cuid().optional(),
  status: z.lazy(() => CallStatusSchema),
  result: z.lazy(() => CallResultSchema),
  failureReason: z.string().optional().nullable(),
  stereoRecordingUrl: z.string(),
  testId: z.string(),
  messages: z.lazy(() => MessageUncheckedCreateNestedManyWithoutCallInputSchema).optional(),
  errors: z.lazy(() => CallErrorUncheckedCreateNestedManyWithoutCallInputSchema).optional()
}).strict();

export const CallCreateOrConnectWithoutTestAgentInputSchema: z.ZodType<Prisma.CallCreateOrConnectWithoutTestAgentInput> = z.object({
  where: z.lazy(() => CallWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CallCreateWithoutTestAgentInputSchema),z.lazy(() => CallUncheckedCreateWithoutTestAgentInputSchema) ]),
}).strict();

export const CallCreateManyTestAgentInputEnvelopeSchema: z.ZodType<Prisma.CallCreateManyTestAgentInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CallCreateManyTestAgentInputSchema),z.lazy(() => CallCreateManyTestAgentInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const AgentCreateWithoutTestAgentsInputSchema: z.ZodType<Prisma.AgentCreateWithoutTestAgentsInput> = z.object({
  id: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  phoneNumber: z.string(),
  githubRepoUrl: z.string().optional().nullable(),
  systemPrompt: z.string(),
  ownerId: z.string().optional().nullable(),
  intents: z.lazy(() => IntentCreateNestedManyWithoutAgentInputSchema).optional(),
  tests: z.lazy(() => TestCreateNestedManyWithoutAgentInputSchema).optional()
}).strict();

export const AgentUncheckedCreateWithoutTestAgentsInputSchema: z.ZodType<Prisma.AgentUncheckedCreateWithoutTestAgentsInput> = z.object({
  id: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  phoneNumber: z.string(),
  githubRepoUrl: z.string().optional().nullable(),
  systemPrompt: z.string(),
  ownerId: z.string().optional().nullable(),
  intents: z.lazy(() => IntentUncheckedCreateNestedManyWithoutAgentInputSchema).optional(),
  tests: z.lazy(() => TestUncheckedCreateNestedManyWithoutAgentInputSchema).optional()
}).strict();

export const AgentCreateOrConnectWithoutTestAgentsInputSchema: z.ZodType<Prisma.AgentCreateOrConnectWithoutTestAgentsInput> = z.object({
  where: z.lazy(() => AgentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AgentCreateWithoutTestAgentsInputSchema),z.lazy(() => AgentUncheckedCreateWithoutTestAgentsInputSchema) ]),
}).strict();

export const TestCreateWithoutTestAgentsInputSchema: z.ZodType<Prisma.TestCreateWithoutTestAgentsInput> = z.object({
  id: z.string().cuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  agent: z.lazy(() => AgentCreateNestedOneWithoutTestsInputSchema),
  calls: z.lazy(() => CallCreateNestedManyWithoutTestInputSchema).optional()
}).strict();

export const TestUncheckedCreateWithoutTestAgentsInputSchema: z.ZodType<Prisma.TestUncheckedCreateWithoutTestAgentsInput> = z.object({
  id: z.string().cuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  agentId: z.string(),
  calls: z.lazy(() => CallUncheckedCreateNestedManyWithoutTestInputSchema).optional()
}).strict();

export const TestCreateOrConnectWithoutTestAgentsInputSchema: z.ZodType<Prisma.TestCreateOrConnectWithoutTestAgentsInput> = z.object({
  where: z.lazy(() => TestWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TestCreateWithoutTestAgentsInputSchema),z.lazy(() => TestUncheckedCreateWithoutTestAgentsInputSchema) ]),
}).strict();

export const CallUpsertWithWhereUniqueWithoutTestAgentInputSchema: z.ZodType<Prisma.CallUpsertWithWhereUniqueWithoutTestAgentInput> = z.object({
  where: z.lazy(() => CallWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CallUpdateWithoutTestAgentInputSchema),z.lazy(() => CallUncheckedUpdateWithoutTestAgentInputSchema) ]),
  create: z.union([ z.lazy(() => CallCreateWithoutTestAgentInputSchema),z.lazy(() => CallUncheckedCreateWithoutTestAgentInputSchema) ]),
}).strict();

export const CallUpdateWithWhereUniqueWithoutTestAgentInputSchema: z.ZodType<Prisma.CallUpdateWithWhereUniqueWithoutTestAgentInput> = z.object({
  where: z.lazy(() => CallWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CallUpdateWithoutTestAgentInputSchema),z.lazy(() => CallUncheckedUpdateWithoutTestAgentInputSchema) ]),
}).strict();

export const CallUpdateManyWithWhereWithoutTestAgentInputSchema: z.ZodType<Prisma.CallUpdateManyWithWhereWithoutTestAgentInput> = z.object({
  where: z.lazy(() => CallScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CallUpdateManyMutationInputSchema),z.lazy(() => CallUncheckedUpdateManyWithoutTestAgentInputSchema) ]),
}).strict();

export const AgentUpsertWithoutTestAgentsInputSchema: z.ZodType<Prisma.AgentUpsertWithoutTestAgentsInput> = z.object({
  update: z.union([ z.lazy(() => AgentUpdateWithoutTestAgentsInputSchema),z.lazy(() => AgentUncheckedUpdateWithoutTestAgentsInputSchema) ]),
  create: z.union([ z.lazy(() => AgentCreateWithoutTestAgentsInputSchema),z.lazy(() => AgentUncheckedCreateWithoutTestAgentsInputSchema) ]),
  where: z.lazy(() => AgentWhereInputSchema).optional()
}).strict();

export const AgentUpdateToOneWithWhereWithoutTestAgentsInputSchema: z.ZodType<Prisma.AgentUpdateToOneWithWhereWithoutTestAgentsInput> = z.object({
  where: z.lazy(() => AgentWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => AgentUpdateWithoutTestAgentsInputSchema),z.lazy(() => AgentUncheckedUpdateWithoutTestAgentsInputSchema) ]),
}).strict();

export const AgentUpdateWithoutTestAgentsInputSchema: z.ZodType<Prisma.AgentUpdateWithoutTestAgentsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  githubRepoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  systemPrompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  intents: z.lazy(() => IntentUpdateManyWithoutAgentNestedInputSchema).optional(),
  tests: z.lazy(() => TestUpdateManyWithoutAgentNestedInputSchema).optional()
}).strict();

export const AgentUncheckedUpdateWithoutTestAgentsInputSchema: z.ZodType<Prisma.AgentUncheckedUpdateWithoutTestAgentsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  githubRepoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  systemPrompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  intents: z.lazy(() => IntentUncheckedUpdateManyWithoutAgentNestedInputSchema).optional(),
  tests: z.lazy(() => TestUncheckedUpdateManyWithoutAgentNestedInputSchema).optional()
}).strict();

export const TestUpsertWithWhereUniqueWithoutTestAgentsInputSchema: z.ZodType<Prisma.TestUpsertWithWhereUniqueWithoutTestAgentsInput> = z.object({
  where: z.lazy(() => TestWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TestUpdateWithoutTestAgentsInputSchema),z.lazy(() => TestUncheckedUpdateWithoutTestAgentsInputSchema) ]),
  create: z.union([ z.lazy(() => TestCreateWithoutTestAgentsInputSchema),z.lazy(() => TestUncheckedCreateWithoutTestAgentsInputSchema) ]),
}).strict();

export const TestUpdateWithWhereUniqueWithoutTestAgentsInputSchema: z.ZodType<Prisma.TestUpdateWithWhereUniqueWithoutTestAgentsInput> = z.object({
  where: z.lazy(() => TestWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TestUpdateWithoutTestAgentsInputSchema),z.lazy(() => TestUncheckedUpdateWithoutTestAgentsInputSchema) ]),
}).strict();

export const TestUpdateManyWithWhereWithoutTestAgentsInputSchema: z.ZodType<Prisma.TestUpdateManyWithWhereWithoutTestAgentsInput> = z.object({
  where: z.lazy(() => TestScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TestUpdateManyMutationInputSchema),z.lazy(() => TestUncheckedUpdateManyWithoutTestAgentsInputSchema) ]),
}).strict();

export const AgentCreateWithoutIntentsInputSchema: z.ZodType<Prisma.AgentCreateWithoutIntentsInput> = z.object({
  id: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  phoneNumber: z.string(),
  githubRepoUrl: z.string().optional().nullable(),
  systemPrompt: z.string(),
  ownerId: z.string().optional().nullable(),
  testAgents: z.lazy(() => TestAgentCreateNestedManyWithoutAgentInputSchema).optional(),
  tests: z.lazy(() => TestCreateNestedManyWithoutAgentInputSchema).optional()
}).strict();

export const AgentUncheckedCreateWithoutIntentsInputSchema: z.ZodType<Prisma.AgentUncheckedCreateWithoutIntentsInput> = z.object({
  id: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  phoneNumber: z.string(),
  githubRepoUrl: z.string().optional().nullable(),
  systemPrompt: z.string(),
  ownerId: z.string().optional().nullable(),
  testAgents: z.lazy(() => TestAgentUncheckedCreateNestedManyWithoutAgentInputSchema).optional(),
  tests: z.lazy(() => TestUncheckedCreateNestedManyWithoutAgentInputSchema).optional()
}).strict();

export const AgentCreateOrConnectWithoutIntentsInputSchema: z.ZodType<Prisma.AgentCreateOrConnectWithoutIntentsInput> = z.object({
  where: z.lazy(() => AgentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AgentCreateWithoutIntentsInputSchema),z.lazy(() => AgentUncheckedCreateWithoutIntentsInputSchema) ]),
}).strict();

export const AgentUpsertWithoutIntentsInputSchema: z.ZodType<Prisma.AgentUpsertWithoutIntentsInput> = z.object({
  update: z.union([ z.lazy(() => AgentUpdateWithoutIntentsInputSchema),z.lazy(() => AgentUncheckedUpdateWithoutIntentsInputSchema) ]),
  create: z.union([ z.lazy(() => AgentCreateWithoutIntentsInputSchema),z.lazy(() => AgentUncheckedCreateWithoutIntentsInputSchema) ]),
  where: z.lazy(() => AgentWhereInputSchema).optional()
}).strict();

export const AgentUpdateToOneWithWhereWithoutIntentsInputSchema: z.ZodType<Prisma.AgentUpdateToOneWithWhereWithoutIntentsInput> = z.object({
  where: z.lazy(() => AgentWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => AgentUpdateWithoutIntentsInputSchema),z.lazy(() => AgentUncheckedUpdateWithoutIntentsInputSchema) ]),
}).strict();

export const AgentUpdateWithoutIntentsInputSchema: z.ZodType<Prisma.AgentUpdateWithoutIntentsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  githubRepoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  systemPrompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testAgents: z.lazy(() => TestAgentUpdateManyWithoutAgentNestedInputSchema).optional(),
  tests: z.lazy(() => TestUpdateManyWithoutAgentNestedInputSchema).optional()
}).strict();

export const AgentUncheckedUpdateWithoutIntentsInputSchema: z.ZodType<Prisma.AgentUncheckedUpdateWithoutIntentsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  githubRepoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  systemPrompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testAgents: z.lazy(() => TestAgentUncheckedUpdateManyWithoutAgentNestedInputSchema).optional(),
  tests: z.lazy(() => TestUncheckedUpdateManyWithoutAgentNestedInputSchema).optional()
}).strict();

export const TestCreateWithoutCallsInputSchema: z.ZodType<Prisma.TestCreateWithoutCallsInput> = z.object({
  id: z.string().cuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  agent: z.lazy(() => AgentCreateNestedOneWithoutTestsInputSchema),
  testAgents: z.lazy(() => TestAgentCreateNestedManyWithoutTestsInputSchema).optional()
}).strict();

export const TestUncheckedCreateWithoutCallsInputSchema: z.ZodType<Prisma.TestUncheckedCreateWithoutCallsInput> = z.object({
  id: z.string().cuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  agentId: z.string(),
  testAgents: z.lazy(() => TestAgentUncheckedCreateNestedManyWithoutTestsInputSchema).optional()
}).strict();

export const TestCreateOrConnectWithoutCallsInputSchema: z.ZodType<Prisma.TestCreateOrConnectWithoutCallsInput> = z.object({
  where: z.lazy(() => TestWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TestCreateWithoutCallsInputSchema),z.lazy(() => TestUncheckedCreateWithoutCallsInputSchema) ]),
}).strict();

export const TestAgentCreateWithoutCallInputSchema: z.ZodType<Prisma.TestAgentCreateWithoutCallInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  enabled: z.boolean().optional(),
  headshotUrl: z.string(),
  description: z.string(),
  prompt: z.string(),
  vapiId: z.string(),
  Agent: z.lazy(() => AgentCreateNestedOneWithoutTestAgentsInputSchema).optional(),
  tests: z.lazy(() => TestCreateNestedManyWithoutTestAgentsInputSchema).optional()
}).strict();

export const TestAgentUncheckedCreateWithoutCallInputSchema: z.ZodType<Prisma.TestAgentUncheckedCreateWithoutCallInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  enabled: z.boolean().optional(),
  headshotUrl: z.string(),
  description: z.string(),
  prompt: z.string(),
  vapiId: z.string(),
  agentId: z.string().optional().nullable(),
  tests: z.lazy(() => TestUncheckedCreateNestedManyWithoutTestAgentsInputSchema).optional()
}).strict();

export const TestAgentCreateOrConnectWithoutCallInputSchema: z.ZodType<Prisma.TestAgentCreateOrConnectWithoutCallInput> = z.object({
  where: z.lazy(() => TestAgentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TestAgentCreateWithoutCallInputSchema),z.lazy(() => TestAgentUncheckedCreateWithoutCallInputSchema) ]),
}).strict();

export const MessageCreateWithoutCallInputSchema: z.ZodType<Prisma.MessageCreateWithoutCallInput> = z.object({
  id: z.string().cuid().optional(),
  role: z.lazy(() => RoleSchema),
  message: z.string(),
  time: z.number(),
  endTime: z.number(),
  secondsFromStart: z.number(),
  duration: z.number()
}).strict();

export const MessageUncheckedCreateWithoutCallInputSchema: z.ZodType<Prisma.MessageUncheckedCreateWithoutCallInput> = z.object({
  id: z.string().cuid().optional(),
  role: z.lazy(() => RoleSchema),
  message: z.string(),
  time: z.number(),
  endTime: z.number(),
  secondsFromStart: z.number(),
  duration: z.number()
}).strict();

export const MessageCreateOrConnectWithoutCallInputSchema: z.ZodType<Prisma.MessageCreateOrConnectWithoutCallInput> = z.object({
  where: z.lazy(() => MessageWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MessageCreateWithoutCallInputSchema),z.lazy(() => MessageUncheckedCreateWithoutCallInputSchema) ]),
}).strict();

export const MessageCreateManyCallInputEnvelopeSchema: z.ZodType<Prisma.MessageCreateManyCallInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => MessageCreateManyCallInputSchema),z.lazy(() => MessageCreateManyCallInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const CallErrorCreateWithoutCallInputSchema: z.ZodType<Prisma.CallErrorCreateWithoutCallInput> = z.object({
  id: z.string().cuid().optional(),
  secondsFromStart: z.number(),
  duration: z.number(),
  type: z.string(),
  description: z.string()
}).strict();

export const CallErrorUncheckedCreateWithoutCallInputSchema: z.ZodType<Prisma.CallErrorUncheckedCreateWithoutCallInput> = z.object({
  id: z.string().cuid().optional(),
  secondsFromStart: z.number(),
  duration: z.number(),
  type: z.string(),
  description: z.string()
}).strict();

export const CallErrorCreateOrConnectWithoutCallInputSchema: z.ZodType<Prisma.CallErrorCreateOrConnectWithoutCallInput> = z.object({
  where: z.lazy(() => CallErrorWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CallErrorCreateWithoutCallInputSchema),z.lazy(() => CallErrorUncheckedCreateWithoutCallInputSchema) ]),
}).strict();

export const CallErrorCreateManyCallInputEnvelopeSchema: z.ZodType<Prisma.CallErrorCreateManyCallInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CallErrorCreateManyCallInputSchema),z.lazy(() => CallErrorCreateManyCallInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const TestUpsertWithoutCallsInputSchema: z.ZodType<Prisma.TestUpsertWithoutCallsInput> = z.object({
  update: z.union([ z.lazy(() => TestUpdateWithoutCallsInputSchema),z.lazy(() => TestUncheckedUpdateWithoutCallsInputSchema) ]),
  create: z.union([ z.lazy(() => TestCreateWithoutCallsInputSchema),z.lazy(() => TestUncheckedCreateWithoutCallsInputSchema) ]),
  where: z.lazy(() => TestWhereInputSchema).optional()
}).strict();

export const TestUpdateToOneWithWhereWithoutCallsInputSchema: z.ZodType<Prisma.TestUpdateToOneWithWhereWithoutCallsInput> = z.object({
  where: z.lazy(() => TestWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => TestUpdateWithoutCallsInputSchema),z.lazy(() => TestUncheckedUpdateWithoutCallsInputSchema) ]),
}).strict();

export const TestUpdateWithoutCallsInputSchema: z.ZodType<Prisma.TestUpdateWithoutCallsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  agent: z.lazy(() => AgentUpdateOneRequiredWithoutTestsNestedInputSchema).optional(),
  testAgents: z.lazy(() => TestAgentUpdateManyWithoutTestsNestedInputSchema).optional()
}).strict();

export const TestUncheckedUpdateWithoutCallsInputSchema: z.ZodType<Prisma.TestUncheckedUpdateWithoutCallsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  agentId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  testAgents: z.lazy(() => TestAgentUncheckedUpdateManyWithoutTestsNestedInputSchema).optional()
}).strict();

export const TestAgentUpsertWithoutCallInputSchema: z.ZodType<Prisma.TestAgentUpsertWithoutCallInput> = z.object({
  update: z.union([ z.lazy(() => TestAgentUpdateWithoutCallInputSchema),z.lazy(() => TestAgentUncheckedUpdateWithoutCallInputSchema) ]),
  create: z.union([ z.lazy(() => TestAgentCreateWithoutCallInputSchema),z.lazy(() => TestAgentUncheckedCreateWithoutCallInputSchema) ]),
  where: z.lazy(() => TestAgentWhereInputSchema).optional()
}).strict();

export const TestAgentUpdateToOneWithWhereWithoutCallInputSchema: z.ZodType<Prisma.TestAgentUpdateToOneWithWhereWithoutCallInput> = z.object({
  where: z.lazy(() => TestAgentWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => TestAgentUpdateWithoutCallInputSchema),z.lazy(() => TestAgentUncheckedUpdateWithoutCallInputSchema) ]),
}).strict();

export const TestAgentUpdateWithoutCallInputSchema: z.ZodType<Prisma.TestAgentUpdateWithoutCallInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  headshotUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  prompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  vapiId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Agent: z.lazy(() => AgentUpdateOneWithoutTestAgentsNestedInputSchema).optional(),
  tests: z.lazy(() => TestUpdateManyWithoutTestAgentsNestedInputSchema).optional()
}).strict();

export const TestAgentUncheckedUpdateWithoutCallInputSchema: z.ZodType<Prisma.TestAgentUncheckedUpdateWithoutCallInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  headshotUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  prompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  vapiId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  agentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tests: z.lazy(() => TestUncheckedUpdateManyWithoutTestAgentsNestedInputSchema).optional()
}).strict();

export const MessageUpsertWithWhereUniqueWithoutCallInputSchema: z.ZodType<Prisma.MessageUpsertWithWhereUniqueWithoutCallInput> = z.object({
  where: z.lazy(() => MessageWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => MessageUpdateWithoutCallInputSchema),z.lazy(() => MessageUncheckedUpdateWithoutCallInputSchema) ]),
  create: z.union([ z.lazy(() => MessageCreateWithoutCallInputSchema),z.lazy(() => MessageUncheckedCreateWithoutCallInputSchema) ]),
}).strict();

export const MessageUpdateWithWhereUniqueWithoutCallInputSchema: z.ZodType<Prisma.MessageUpdateWithWhereUniqueWithoutCallInput> = z.object({
  where: z.lazy(() => MessageWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => MessageUpdateWithoutCallInputSchema),z.lazy(() => MessageUncheckedUpdateWithoutCallInputSchema) ]),
}).strict();

export const MessageUpdateManyWithWhereWithoutCallInputSchema: z.ZodType<Prisma.MessageUpdateManyWithWhereWithoutCallInput> = z.object({
  where: z.lazy(() => MessageScalarWhereInputSchema),
  data: z.union([ z.lazy(() => MessageUpdateManyMutationInputSchema),z.lazy(() => MessageUncheckedUpdateManyWithoutCallInputSchema) ]),
}).strict();

export const MessageScalarWhereInputSchema: z.ZodType<Prisma.MessageScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => MessageScalarWhereInputSchema),z.lazy(() => MessageScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MessageScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MessageScalarWhereInputSchema),z.lazy(() => MessageScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumRoleFilterSchema),z.lazy(() => RoleSchema) ]).optional(),
  message: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  time: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  endTime: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  secondsFromStart: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  duration: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  callId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const CallErrorUpsertWithWhereUniqueWithoutCallInputSchema: z.ZodType<Prisma.CallErrorUpsertWithWhereUniqueWithoutCallInput> = z.object({
  where: z.lazy(() => CallErrorWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CallErrorUpdateWithoutCallInputSchema),z.lazy(() => CallErrorUncheckedUpdateWithoutCallInputSchema) ]),
  create: z.union([ z.lazy(() => CallErrorCreateWithoutCallInputSchema),z.lazy(() => CallErrorUncheckedCreateWithoutCallInputSchema) ]),
}).strict();

export const CallErrorUpdateWithWhereUniqueWithoutCallInputSchema: z.ZodType<Prisma.CallErrorUpdateWithWhereUniqueWithoutCallInput> = z.object({
  where: z.lazy(() => CallErrorWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CallErrorUpdateWithoutCallInputSchema),z.lazy(() => CallErrorUncheckedUpdateWithoutCallInputSchema) ]),
}).strict();

export const CallErrorUpdateManyWithWhereWithoutCallInputSchema: z.ZodType<Prisma.CallErrorUpdateManyWithWhereWithoutCallInput> = z.object({
  where: z.lazy(() => CallErrorScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CallErrorUpdateManyMutationInputSchema),z.lazy(() => CallErrorUncheckedUpdateManyWithoutCallInputSchema) ]),
}).strict();

export const CallErrorScalarWhereInputSchema: z.ZodType<Prisma.CallErrorScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CallErrorScalarWhereInputSchema),z.lazy(() => CallErrorScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CallErrorScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CallErrorScalarWhereInputSchema),z.lazy(() => CallErrorScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  secondsFromStart: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  duration: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  callId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const CallCreateWithoutMessagesInputSchema: z.ZodType<Prisma.CallCreateWithoutMessagesInput> = z.object({
  id: z.string().cuid().optional(),
  status: z.lazy(() => CallStatusSchema),
  result: z.lazy(() => CallResultSchema),
  failureReason: z.string().optional().nullable(),
  stereoRecordingUrl: z.string(),
  test: z.lazy(() => TestCreateNestedOneWithoutCallsInputSchema),
  testAgent: z.lazy(() => TestAgentCreateNestedOneWithoutCallInputSchema),
  errors: z.lazy(() => CallErrorCreateNestedManyWithoutCallInputSchema).optional()
}).strict();

export const CallUncheckedCreateWithoutMessagesInputSchema: z.ZodType<Prisma.CallUncheckedCreateWithoutMessagesInput> = z.object({
  id: z.string().cuid().optional(),
  status: z.lazy(() => CallStatusSchema),
  result: z.lazy(() => CallResultSchema),
  failureReason: z.string().optional().nullable(),
  stereoRecordingUrl: z.string(),
  testId: z.string(),
  testAgentId: z.string(),
  errors: z.lazy(() => CallErrorUncheckedCreateNestedManyWithoutCallInputSchema).optional()
}).strict();

export const CallCreateOrConnectWithoutMessagesInputSchema: z.ZodType<Prisma.CallCreateOrConnectWithoutMessagesInput> = z.object({
  where: z.lazy(() => CallWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CallCreateWithoutMessagesInputSchema),z.lazy(() => CallUncheckedCreateWithoutMessagesInputSchema) ]),
}).strict();

export const CallUpsertWithoutMessagesInputSchema: z.ZodType<Prisma.CallUpsertWithoutMessagesInput> = z.object({
  update: z.union([ z.lazy(() => CallUpdateWithoutMessagesInputSchema),z.lazy(() => CallUncheckedUpdateWithoutMessagesInputSchema) ]),
  create: z.union([ z.lazy(() => CallCreateWithoutMessagesInputSchema),z.lazy(() => CallUncheckedCreateWithoutMessagesInputSchema) ]),
  where: z.lazy(() => CallWhereInputSchema).optional()
}).strict();

export const CallUpdateToOneWithWhereWithoutMessagesInputSchema: z.ZodType<Prisma.CallUpdateToOneWithWhereWithoutMessagesInput> = z.object({
  where: z.lazy(() => CallWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CallUpdateWithoutMessagesInputSchema),z.lazy(() => CallUncheckedUpdateWithoutMessagesInputSchema) ]),
}).strict();

export const CallUpdateWithoutMessagesInputSchema: z.ZodType<Prisma.CallUpdateWithoutMessagesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => EnumCallStatusFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => EnumCallResultFieldUpdateOperationsInputSchema) ]).optional(),
  failureReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  test: z.lazy(() => TestUpdateOneRequiredWithoutCallsNestedInputSchema).optional(),
  testAgent: z.lazy(() => TestAgentUpdateOneRequiredWithoutCallNestedInputSchema).optional(),
  errors: z.lazy(() => CallErrorUpdateManyWithoutCallNestedInputSchema).optional()
}).strict();

export const CallUncheckedUpdateWithoutMessagesInputSchema: z.ZodType<Prisma.CallUncheckedUpdateWithoutMessagesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => EnumCallStatusFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => EnumCallResultFieldUpdateOperationsInputSchema) ]).optional(),
  failureReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  testId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  testAgentId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  errors: z.lazy(() => CallErrorUncheckedUpdateManyWithoutCallNestedInputSchema).optional()
}).strict();

export const CallCreateWithoutErrorsInputSchema: z.ZodType<Prisma.CallCreateWithoutErrorsInput> = z.object({
  id: z.string().cuid().optional(),
  status: z.lazy(() => CallStatusSchema),
  result: z.lazy(() => CallResultSchema),
  failureReason: z.string().optional().nullable(),
  stereoRecordingUrl: z.string(),
  test: z.lazy(() => TestCreateNestedOneWithoutCallsInputSchema),
  testAgent: z.lazy(() => TestAgentCreateNestedOneWithoutCallInputSchema),
  messages: z.lazy(() => MessageCreateNestedManyWithoutCallInputSchema).optional()
}).strict();

export const CallUncheckedCreateWithoutErrorsInputSchema: z.ZodType<Prisma.CallUncheckedCreateWithoutErrorsInput> = z.object({
  id: z.string().cuid().optional(),
  status: z.lazy(() => CallStatusSchema),
  result: z.lazy(() => CallResultSchema),
  failureReason: z.string().optional().nullable(),
  stereoRecordingUrl: z.string(),
  testId: z.string(),
  testAgentId: z.string(),
  messages: z.lazy(() => MessageUncheckedCreateNestedManyWithoutCallInputSchema).optional()
}).strict();

export const CallCreateOrConnectWithoutErrorsInputSchema: z.ZodType<Prisma.CallCreateOrConnectWithoutErrorsInput> = z.object({
  where: z.lazy(() => CallWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CallCreateWithoutErrorsInputSchema),z.lazy(() => CallUncheckedCreateWithoutErrorsInputSchema) ]),
}).strict();

export const CallUpsertWithoutErrorsInputSchema: z.ZodType<Prisma.CallUpsertWithoutErrorsInput> = z.object({
  update: z.union([ z.lazy(() => CallUpdateWithoutErrorsInputSchema),z.lazy(() => CallUncheckedUpdateWithoutErrorsInputSchema) ]),
  create: z.union([ z.lazy(() => CallCreateWithoutErrorsInputSchema),z.lazy(() => CallUncheckedCreateWithoutErrorsInputSchema) ]),
  where: z.lazy(() => CallWhereInputSchema).optional()
}).strict();

export const CallUpdateToOneWithWhereWithoutErrorsInputSchema: z.ZodType<Prisma.CallUpdateToOneWithWhereWithoutErrorsInput> = z.object({
  where: z.lazy(() => CallWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CallUpdateWithoutErrorsInputSchema),z.lazy(() => CallUncheckedUpdateWithoutErrorsInputSchema) ]),
}).strict();

export const CallUpdateWithoutErrorsInputSchema: z.ZodType<Prisma.CallUpdateWithoutErrorsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => EnumCallStatusFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => EnumCallResultFieldUpdateOperationsInputSchema) ]).optional(),
  failureReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  test: z.lazy(() => TestUpdateOneRequiredWithoutCallsNestedInputSchema).optional(),
  testAgent: z.lazy(() => TestAgentUpdateOneRequiredWithoutCallNestedInputSchema).optional(),
  messages: z.lazy(() => MessageUpdateManyWithoutCallNestedInputSchema).optional()
}).strict();

export const CallUncheckedUpdateWithoutErrorsInputSchema: z.ZodType<Prisma.CallUncheckedUpdateWithoutErrorsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => EnumCallStatusFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => EnumCallResultFieldUpdateOperationsInputSchema) ]).optional(),
  failureReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  testId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  testAgentId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  messages: z.lazy(() => MessageUncheckedUpdateManyWithoutCallNestedInputSchema).optional()
}).strict();

export const TestAgentCreateManyAgentInputSchema: z.ZodType<Prisma.TestAgentCreateManyAgentInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  enabled: z.boolean().optional(),
  headshotUrl: z.string(),
  description: z.string(),
  prompt: z.string(),
  vapiId: z.string()
}).strict();

export const IntentCreateManyAgentInputSchema: z.ZodType<Prisma.IntentCreateManyAgentInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string(),
  details: z.string()
}).strict();

export const TestCreateManyAgentInputSchema: z.ZodType<Prisma.TestCreateManyAgentInput> = z.object({
  id: z.string().cuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TestAgentUpdateWithoutAgentInputSchema: z.ZodType<Prisma.TestAgentUpdateWithoutAgentInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  headshotUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  prompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  vapiId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Call: z.lazy(() => CallUpdateManyWithoutTestAgentNestedInputSchema).optional(),
  tests: z.lazy(() => TestUpdateManyWithoutTestAgentsNestedInputSchema).optional()
}).strict();

export const TestAgentUncheckedUpdateWithoutAgentInputSchema: z.ZodType<Prisma.TestAgentUncheckedUpdateWithoutAgentInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  headshotUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  prompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  vapiId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Call: z.lazy(() => CallUncheckedUpdateManyWithoutTestAgentNestedInputSchema).optional(),
  tests: z.lazy(() => TestUncheckedUpdateManyWithoutTestAgentsNestedInputSchema).optional()
}).strict();

export const TestAgentUncheckedUpdateManyWithoutAgentInputSchema: z.ZodType<Prisma.TestAgentUncheckedUpdateManyWithoutAgentInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  headshotUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  prompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  vapiId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const IntentUpdateWithoutAgentInputSchema: z.ZodType<Prisma.IntentUpdateWithoutAgentInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const IntentUncheckedUpdateWithoutAgentInputSchema: z.ZodType<Prisma.IntentUncheckedUpdateWithoutAgentInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const IntentUncheckedUpdateManyWithoutAgentInputSchema: z.ZodType<Prisma.IntentUncheckedUpdateManyWithoutAgentInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TestUpdateWithoutAgentInputSchema: z.ZodType<Prisma.TestUpdateWithoutAgentInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  testAgents: z.lazy(() => TestAgentUpdateManyWithoutTestsNestedInputSchema).optional(),
  calls: z.lazy(() => CallUpdateManyWithoutTestNestedInputSchema).optional()
}).strict();

export const TestUncheckedUpdateWithoutAgentInputSchema: z.ZodType<Prisma.TestUncheckedUpdateWithoutAgentInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  testAgents: z.lazy(() => TestAgentUncheckedUpdateManyWithoutTestsNestedInputSchema).optional(),
  calls: z.lazy(() => CallUncheckedUpdateManyWithoutTestNestedInputSchema).optional()
}).strict();

export const TestUncheckedUpdateManyWithoutAgentInputSchema: z.ZodType<Prisma.TestUncheckedUpdateManyWithoutAgentInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CallCreateManyTestInputSchema: z.ZodType<Prisma.CallCreateManyTestInput> = z.object({
  id: z.string().cuid().optional(),
  status: z.lazy(() => CallStatusSchema),
  result: z.lazy(() => CallResultSchema),
  failureReason: z.string().optional().nullable(),
  stereoRecordingUrl: z.string(),
  testAgentId: z.string()
}).strict();

export const TestAgentUpdateWithoutTestsInputSchema: z.ZodType<Prisma.TestAgentUpdateWithoutTestsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  headshotUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  prompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  vapiId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Call: z.lazy(() => CallUpdateManyWithoutTestAgentNestedInputSchema).optional(),
  Agent: z.lazy(() => AgentUpdateOneWithoutTestAgentsNestedInputSchema).optional()
}).strict();

export const TestAgentUncheckedUpdateWithoutTestsInputSchema: z.ZodType<Prisma.TestAgentUncheckedUpdateWithoutTestsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  headshotUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  prompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  vapiId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  agentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  Call: z.lazy(() => CallUncheckedUpdateManyWithoutTestAgentNestedInputSchema).optional()
}).strict();

export const TestAgentUncheckedUpdateManyWithoutTestsInputSchema: z.ZodType<Prisma.TestAgentUncheckedUpdateManyWithoutTestsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  headshotUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  prompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  vapiId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  agentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const CallUpdateWithoutTestInputSchema: z.ZodType<Prisma.CallUpdateWithoutTestInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => EnumCallStatusFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => EnumCallResultFieldUpdateOperationsInputSchema) ]).optional(),
  failureReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  testAgent: z.lazy(() => TestAgentUpdateOneRequiredWithoutCallNestedInputSchema).optional(),
  messages: z.lazy(() => MessageUpdateManyWithoutCallNestedInputSchema).optional(),
  errors: z.lazy(() => CallErrorUpdateManyWithoutCallNestedInputSchema).optional()
}).strict();

export const CallUncheckedUpdateWithoutTestInputSchema: z.ZodType<Prisma.CallUncheckedUpdateWithoutTestInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => EnumCallStatusFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => EnumCallResultFieldUpdateOperationsInputSchema) ]).optional(),
  failureReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  testAgentId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  messages: z.lazy(() => MessageUncheckedUpdateManyWithoutCallNestedInputSchema).optional(),
  errors: z.lazy(() => CallErrorUncheckedUpdateManyWithoutCallNestedInputSchema).optional()
}).strict();

export const CallUncheckedUpdateManyWithoutTestInputSchema: z.ZodType<Prisma.CallUncheckedUpdateManyWithoutTestInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => EnumCallStatusFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => EnumCallResultFieldUpdateOperationsInputSchema) ]).optional(),
  failureReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  testAgentId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CallCreateManyTestAgentInputSchema: z.ZodType<Prisma.CallCreateManyTestAgentInput> = z.object({
  id: z.string().cuid().optional(),
  status: z.lazy(() => CallStatusSchema),
  result: z.lazy(() => CallResultSchema),
  failureReason: z.string().optional().nullable(),
  stereoRecordingUrl: z.string(),
  testId: z.string()
}).strict();

export const CallUpdateWithoutTestAgentInputSchema: z.ZodType<Prisma.CallUpdateWithoutTestAgentInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => EnumCallStatusFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => EnumCallResultFieldUpdateOperationsInputSchema) ]).optional(),
  failureReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  test: z.lazy(() => TestUpdateOneRequiredWithoutCallsNestedInputSchema).optional(),
  messages: z.lazy(() => MessageUpdateManyWithoutCallNestedInputSchema).optional(),
  errors: z.lazy(() => CallErrorUpdateManyWithoutCallNestedInputSchema).optional()
}).strict();

export const CallUncheckedUpdateWithoutTestAgentInputSchema: z.ZodType<Prisma.CallUncheckedUpdateWithoutTestAgentInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => EnumCallStatusFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => EnumCallResultFieldUpdateOperationsInputSchema) ]).optional(),
  failureReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  testId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  messages: z.lazy(() => MessageUncheckedUpdateManyWithoutCallNestedInputSchema).optional(),
  errors: z.lazy(() => CallErrorUncheckedUpdateManyWithoutCallNestedInputSchema).optional()
}).strict();

export const CallUncheckedUpdateManyWithoutTestAgentInputSchema: z.ZodType<Prisma.CallUncheckedUpdateManyWithoutTestAgentInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => EnumCallStatusFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => EnumCallResultFieldUpdateOperationsInputSchema) ]).optional(),
  failureReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  testId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TestUpdateWithoutTestAgentsInputSchema: z.ZodType<Prisma.TestUpdateWithoutTestAgentsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  agent: z.lazy(() => AgentUpdateOneRequiredWithoutTestsNestedInputSchema).optional(),
  calls: z.lazy(() => CallUpdateManyWithoutTestNestedInputSchema).optional()
}).strict();

export const TestUncheckedUpdateWithoutTestAgentsInputSchema: z.ZodType<Prisma.TestUncheckedUpdateWithoutTestAgentsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  agentId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  calls: z.lazy(() => CallUncheckedUpdateManyWithoutTestNestedInputSchema).optional()
}).strict();

export const TestUncheckedUpdateManyWithoutTestAgentsInputSchema: z.ZodType<Prisma.TestUncheckedUpdateManyWithoutTestAgentsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  agentId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MessageCreateManyCallInputSchema: z.ZodType<Prisma.MessageCreateManyCallInput> = z.object({
  id: z.string().cuid().optional(),
  role: z.lazy(() => RoleSchema),
  message: z.string(),
  time: z.number(),
  endTime: z.number(),
  secondsFromStart: z.number(),
  duration: z.number()
}).strict();

export const CallErrorCreateManyCallInputSchema: z.ZodType<Prisma.CallErrorCreateManyCallInput> = z.object({
  id: z.string().cuid().optional(),
  secondsFromStart: z.number(),
  duration: z.number(),
  type: z.string(),
  description: z.string()
}).strict();

export const MessageUpdateWithoutCallInputSchema: z.ZodType<Prisma.MessageUpdateWithoutCallInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MessageUncheckedUpdateWithoutCallInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateWithoutCallInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MessageUncheckedUpdateManyWithoutCallInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateManyWithoutCallInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CallErrorUpdateWithoutCallInputSchema: z.ZodType<Prisma.CallErrorUpdateWithoutCallInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CallErrorUncheckedUpdateWithoutCallInputSchema: z.ZodType<Prisma.CallErrorUncheckedUpdateWithoutCallInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CallErrorUncheckedUpdateManyWithoutCallInputSchema: z.ZodType<Prisma.CallErrorUncheckedUpdateManyWithoutCallInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
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
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const AgentFindFirstArgsSchema: z.ZodType<Prisma.AgentFindFirstArgs> = z.object({
  select: AgentSelectSchema.optional(),
  include: AgentIncludeSchema.optional(),
  where: AgentWhereInputSchema.optional(),
  orderBy: z.union([ AgentOrderByWithRelationInputSchema.array(),AgentOrderByWithRelationInputSchema ]).optional(),
  cursor: AgentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AgentScalarFieldEnumSchema,AgentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AgentFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AgentFindFirstOrThrowArgs> = z.object({
  select: AgentSelectSchema.optional(),
  include: AgentIncludeSchema.optional(),
  where: AgentWhereInputSchema.optional(),
  orderBy: z.union([ AgentOrderByWithRelationInputSchema.array(),AgentOrderByWithRelationInputSchema ]).optional(),
  cursor: AgentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AgentScalarFieldEnumSchema,AgentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AgentFindManyArgsSchema: z.ZodType<Prisma.AgentFindManyArgs> = z.object({
  select: AgentSelectSchema.optional(),
  include: AgentIncludeSchema.optional(),
  where: AgentWhereInputSchema.optional(),
  orderBy: z.union([ AgentOrderByWithRelationInputSchema.array(),AgentOrderByWithRelationInputSchema ]).optional(),
  cursor: AgentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AgentScalarFieldEnumSchema,AgentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AgentAggregateArgsSchema: z.ZodType<Prisma.AgentAggregateArgs> = z.object({
  where: AgentWhereInputSchema.optional(),
  orderBy: z.union([ AgentOrderByWithRelationInputSchema.array(),AgentOrderByWithRelationInputSchema ]).optional(),
  cursor: AgentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AgentGroupByArgsSchema: z.ZodType<Prisma.AgentGroupByArgs> = z.object({
  where: AgentWhereInputSchema.optional(),
  orderBy: z.union([ AgentOrderByWithAggregationInputSchema.array(),AgentOrderByWithAggregationInputSchema ]).optional(),
  by: AgentScalarFieldEnumSchema.array(),
  having: AgentScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AgentFindUniqueArgsSchema: z.ZodType<Prisma.AgentFindUniqueArgs> = z.object({
  select: AgentSelectSchema.optional(),
  include: AgentIncludeSchema.optional(),
  where: AgentWhereUniqueInputSchema,
}).strict() ;

export const AgentFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AgentFindUniqueOrThrowArgs> = z.object({
  select: AgentSelectSchema.optional(),
  include: AgentIncludeSchema.optional(),
  where: AgentWhereUniqueInputSchema,
}).strict() ;

export const TestFindFirstArgsSchema: z.ZodType<Prisma.TestFindFirstArgs> = z.object({
  select: TestSelectSchema.optional(),
  include: TestIncludeSchema.optional(),
  where: TestWhereInputSchema.optional(),
  orderBy: z.union([ TestOrderByWithRelationInputSchema.array(),TestOrderByWithRelationInputSchema ]).optional(),
  cursor: TestWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TestScalarFieldEnumSchema,TestScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TestFindFirstOrThrowArgsSchema: z.ZodType<Prisma.TestFindFirstOrThrowArgs> = z.object({
  select: TestSelectSchema.optional(),
  include: TestIncludeSchema.optional(),
  where: TestWhereInputSchema.optional(),
  orderBy: z.union([ TestOrderByWithRelationInputSchema.array(),TestOrderByWithRelationInputSchema ]).optional(),
  cursor: TestWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TestScalarFieldEnumSchema,TestScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TestFindManyArgsSchema: z.ZodType<Prisma.TestFindManyArgs> = z.object({
  select: TestSelectSchema.optional(),
  include: TestIncludeSchema.optional(),
  where: TestWhereInputSchema.optional(),
  orderBy: z.union([ TestOrderByWithRelationInputSchema.array(),TestOrderByWithRelationInputSchema ]).optional(),
  cursor: TestWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TestScalarFieldEnumSchema,TestScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TestAggregateArgsSchema: z.ZodType<Prisma.TestAggregateArgs> = z.object({
  where: TestWhereInputSchema.optional(),
  orderBy: z.union([ TestOrderByWithRelationInputSchema.array(),TestOrderByWithRelationInputSchema ]).optional(),
  cursor: TestWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TestGroupByArgsSchema: z.ZodType<Prisma.TestGroupByArgs> = z.object({
  where: TestWhereInputSchema.optional(),
  orderBy: z.union([ TestOrderByWithAggregationInputSchema.array(),TestOrderByWithAggregationInputSchema ]).optional(),
  by: TestScalarFieldEnumSchema.array(),
  having: TestScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TestFindUniqueArgsSchema: z.ZodType<Prisma.TestFindUniqueArgs> = z.object({
  select: TestSelectSchema.optional(),
  include: TestIncludeSchema.optional(),
  where: TestWhereUniqueInputSchema,
}).strict() ;

export const TestFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.TestFindUniqueOrThrowArgs> = z.object({
  select: TestSelectSchema.optional(),
  include: TestIncludeSchema.optional(),
  where: TestWhereUniqueInputSchema,
}).strict() ;

export const TestAgentFindFirstArgsSchema: z.ZodType<Prisma.TestAgentFindFirstArgs> = z.object({
  select: TestAgentSelectSchema.optional(),
  include: TestAgentIncludeSchema.optional(),
  where: TestAgentWhereInputSchema.optional(),
  orderBy: z.union([ TestAgentOrderByWithRelationInputSchema.array(),TestAgentOrderByWithRelationInputSchema ]).optional(),
  cursor: TestAgentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TestAgentScalarFieldEnumSchema,TestAgentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TestAgentFindFirstOrThrowArgsSchema: z.ZodType<Prisma.TestAgentFindFirstOrThrowArgs> = z.object({
  select: TestAgentSelectSchema.optional(),
  include: TestAgentIncludeSchema.optional(),
  where: TestAgentWhereInputSchema.optional(),
  orderBy: z.union([ TestAgentOrderByWithRelationInputSchema.array(),TestAgentOrderByWithRelationInputSchema ]).optional(),
  cursor: TestAgentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TestAgentScalarFieldEnumSchema,TestAgentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TestAgentFindManyArgsSchema: z.ZodType<Prisma.TestAgentFindManyArgs> = z.object({
  select: TestAgentSelectSchema.optional(),
  include: TestAgentIncludeSchema.optional(),
  where: TestAgentWhereInputSchema.optional(),
  orderBy: z.union([ TestAgentOrderByWithRelationInputSchema.array(),TestAgentOrderByWithRelationInputSchema ]).optional(),
  cursor: TestAgentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TestAgentScalarFieldEnumSchema,TestAgentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TestAgentAggregateArgsSchema: z.ZodType<Prisma.TestAgentAggregateArgs> = z.object({
  where: TestAgentWhereInputSchema.optional(),
  orderBy: z.union([ TestAgentOrderByWithRelationInputSchema.array(),TestAgentOrderByWithRelationInputSchema ]).optional(),
  cursor: TestAgentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TestAgentGroupByArgsSchema: z.ZodType<Prisma.TestAgentGroupByArgs> = z.object({
  where: TestAgentWhereInputSchema.optional(),
  orderBy: z.union([ TestAgentOrderByWithAggregationInputSchema.array(),TestAgentOrderByWithAggregationInputSchema ]).optional(),
  by: TestAgentScalarFieldEnumSchema.array(),
  having: TestAgentScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TestAgentFindUniqueArgsSchema: z.ZodType<Prisma.TestAgentFindUniqueArgs> = z.object({
  select: TestAgentSelectSchema.optional(),
  include: TestAgentIncludeSchema.optional(),
  where: TestAgentWhereUniqueInputSchema,
}).strict() ;

export const TestAgentFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.TestAgentFindUniqueOrThrowArgs> = z.object({
  select: TestAgentSelectSchema.optional(),
  include: TestAgentIncludeSchema.optional(),
  where: TestAgentWhereUniqueInputSchema,
}).strict() ;

export const TestAgentTemplateFindFirstArgsSchema: z.ZodType<Prisma.TestAgentTemplateFindFirstArgs> = z.object({
  select: TestAgentTemplateSelectSchema.optional(),
  where: TestAgentTemplateWhereInputSchema.optional(),
  orderBy: z.union([ TestAgentTemplateOrderByWithRelationInputSchema.array(),TestAgentTemplateOrderByWithRelationInputSchema ]).optional(),
  cursor: TestAgentTemplateWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TestAgentTemplateScalarFieldEnumSchema,TestAgentTemplateScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TestAgentTemplateFindFirstOrThrowArgsSchema: z.ZodType<Prisma.TestAgentTemplateFindFirstOrThrowArgs> = z.object({
  select: TestAgentTemplateSelectSchema.optional(),
  where: TestAgentTemplateWhereInputSchema.optional(),
  orderBy: z.union([ TestAgentTemplateOrderByWithRelationInputSchema.array(),TestAgentTemplateOrderByWithRelationInputSchema ]).optional(),
  cursor: TestAgentTemplateWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TestAgentTemplateScalarFieldEnumSchema,TestAgentTemplateScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TestAgentTemplateFindManyArgsSchema: z.ZodType<Prisma.TestAgentTemplateFindManyArgs> = z.object({
  select: TestAgentTemplateSelectSchema.optional(),
  where: TestAgentTemplateWhereInputSchema.optional(),
  orderBy: z.union([ TestAgentTemplateOrderByWithRelationInputSchema.array(),TestAgentTemplateOrderByWithRelationInputSchema ]).optional(),
  cursor: TestAgentTemplateWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TestAgentTemplateScalarFieldEnumSchema,TestAgentTemplateScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TestAgentTemplateAggregateArgsSchema: z.ZodType<Prisma.TestAgentTemplateAggregateArgs> = z.object({
  where: TestAgentTemplateWhereInputSchema.optional(),
  orderBy: z.union([ TestAgentTemplateOrderByWithRelationInputSchema.array(),TestAgentTemplateOrderByWithRelationInputSchema ]).optional(),
  cursor: TestAgentTemplateWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TestAgentTemplateGroupByArgsSchema: z.ZodType<Prisma.TestAgentTemplateGroupByArgs> = z.object({
  where: TestAgentTemplateWhereInputSchema.optional(),
  orderBy: z.union([ TestAgentTemplateOrderByWithAggregationInputSchema.array(),TestAgentTemplateOrderByWithAggregationInputSchema ]).optional(),
  by: TestAgentTemplateScalarFieldEnumSchema.array(),
  having: TestAgentTemplateScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TestAgentTemplateFindUniqueArgsSchema: z.ZodType<Prisma.TestAgentTemplateFindUniqueArgs> = z.object({
  select: TestAgentTemplateSelectSchema.optional(),
  where: TestAgentTemplateWhereUniqueInputSchema,
}).strict() ;

export const TestAgentTemplateFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.TestAgentTemplateFindUniqueOrThrowArgs> = z.object({
  select: TestAgentTemplateSelectSchema.optional(),
  where: TestAgentTemplateWhereUniqueInputSchema,
}).strict() ;

export const IntentFindFirstArgsSchema: z.ZodType<Prisma.IntentFindFirstArgs> = z.object({
  select: IntentSelectSchema.optional(),
  include: IntentIncludeSchema.optional(),
  where: IntentWhereInputSchema.optional(),
  orderBy: z.union([ IntentOrderByWithRelationInputSchema.array(),IntentOrderByWithRelationInputSchema ]).optional(),
  cursor: IntentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ IntentScalarFieldEnumSchema,IntentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const IntentFindFirstOrThrowArgsSchema: z.ZodType<Prisma.IntentFindFirstOrThrowArgs> = z.object({
  select: IntentSelectSchema.optional(),
  include: IntentIncludeSchema.optional(),
  where: IntentWhereInputSchema.optional(),
  orderBy: z.union([ IntentOrderByWithRelationInputSchema.array(),IntentOrderByWithRelationInputSchema ]).optional(),
  cursor: IntentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ IntentScalarFieldEnumSchema,IntentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const IntentFindManyArgsSchema: z.ZodType<Prisma.IntentFindManyArgs> = z.object({
  select: IntentSelectSchema.optional(),
  include: IntentIncludeSchema.optional(),
  where: IntentWhereInputSchema.optional(),
  orderBy: z.union([ IntentOrderByWithRelationInputSchema.array(),IntentOrderByWithRelationInputSchema ]).optional(),
  cursor: IntentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ IntentScalarFieldEnumSchema,IntentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const IntentAggregateArgsSchema: z.ZodType<Prisma.IntentAggregateArgs> = z.object({
  where: IntentWhereInputSchema.optional(),
  orderBy: z.union([ IntentOrderByWithRelationInputSchema.array(),IntentOrderByWithRelationInputSchema ]).optional(),
  cursor: IntentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const IntentGroupByArgsSchema: z.ZodType<Prisma.IntentGroupByArgs> = z.object({
  where: IntentWhereInputSchema.optional(),
  orderBy: z.union([ IntentOrderByWithAggregationInputSchema.array(),IntentOrderByWithAggregationInputSchema ]).optional(),
  by: IntentScalarFieldEnumSchema.array(),
  having: IntentScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const IntentFindUniqueArgsSchema: z.ZodType<Prisma.IntentFindUniqueArgs> = z.object({
  select: IntentSelectSchema.optional(),
  include: IntentIncludeSchema.optional(),
  where: IntentWhereUniqueInputSchema,
}).strict() ;

export const IntentFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.IntentFindUniqueOrThrowArgs> = z.object({
  select: IntentSelectSchema.optional(),
  include: IntentIncludeSchema.optional(),
  where: IntentWhereUniqueInputSchema,
}).strict() ;

export const CallFindFirstArgsSchema: z.ZodType<Prisma.CallFindFirstArgs> = z.object({
  select: CallSelectSchema.optional(),
  include: CallIncludeSchema.optional(),
  where: CallWhereInputSchema.optional(),
  orderBy: z.union([ CallOrderByWithRelationInputSchema.array(),CallOrderByWithRelationInputSchema ]).optional(),
  cursor: CallWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CallScalarFieldEnumSchema,CallScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CallFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CallFindFirstOrThrowArgs> = z.object({
  select: CallSelectSchema.optional(),
  include: CallIncludeSchema.optional(),
  where: CallWhereInputSchema.optional(),
  orderBy: z.union([ CallOrderByWithRelationInputSchema.array(),CallOrderByWithRelationInputSchema ]).optional(),
  cursor: CallWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CallScalarFieldEnumSchema,CallScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CallFindManyArgsSchema: z.ZodType<Prisma.CallFindManyArgs> = z.object({
  select: CallSelectSchema.optional(),
  include: CallIncludeSchema.optional(),
  where: CallWhereInputSchema.optional(),
  orderBy: z.union([ CallOrderByWithRelationInputSchema.array(),CallOrderByWithRelationInputSchema ]).optional(),
  cursor: CallWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CallScalarFieldEnumSchema,CallScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CallAggregateArgsSchema: z.ZodType<Prisma.CallAggregateArgs> = z.object({
  where: CallWhereInputSchema.optional(),
  orderBy: z.union([ CallOrderByWithRelationInputSchema.array(),CallOrderByWithRelationInputSchema ]).optional(),
  cursor: CallWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CallGroupByArgsSchema: z.ZodType<Prisma.CallGroupByArgs> = z.object({
  where: CallWhereInputSchema.optional(),
  orderBy: z.union([ CallOrderByWithAggregationInputSchema.array(),CallOrderByWithAggregationInputSchema ]).optional(),
  by: CallScalarFieldEnumSchema.array(),
  having: CallScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CallFindUniqueArgsSchema: z.ZodType<Prisma.CallFindUniqueArgs> = z.object({
  select: CallSelectSchema.optional(),
  include: CallIncludeSchema.optional(),
  where: CallWhereUniqueInputSchema,
}).strict() ;

export const CallFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CallFindUniqueOrThrowArgs> = z.object({
  select: CallSelectSchema.optional(),
  include: CallIncludeSchema.optional(),
  where: CallWhereUniqueInputSchema,
}).strict() ;

export const MessageFindFirstArgsSchema: z.ZodType<Prisma.MessageFindFirstArgs> = z.object({
  select: MessageSelectSchema.optional(),
  include: MessageIncludeSchema.optional(),
  where: MessageWhereInputSchema.optional(),
  orderBy: z.union([ MessageOrderByWithRelationInputSchema.array(),MessageOrderByWithRelationInputSchema ]).optional(),
  cursor: MessageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MessageScalarFieldEnumSchema,MessageScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const MessageFindFirstOrThrowArgsSchema: z.ZodType<Prisma.MessageFindFirstOrThrowArgs> = z.object({
  select: MessageSelectSchema.optional(),
  include: MessageIncludeSchema.optional(),
  where: MessageWhereInputSchema.optional(),
  orderBy: z.union([ MessageOrderByWithRelationInputSchema.array(),MessageOrderByWithRelationInputSchema ]).optional(),
  cursor: MessageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MessageScalarFieldEnumSchema,MessageScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const MessageFindManyArgsSchema: z.ZodType<Prisma.MessageFindManyArgs> = z.object({
  select: MessageSelectSchema.optional(),
  include: MessageIncludeSchema.optional(),
  where: MessageWhereInputSchema.optional(),
  orderBy: z.union([ MessageOrderByWithRelationInputSchema.array(),MessageOrderByWithRelationInputSchema ]).optional(),
  cursor: MessageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MessageScalarFieldEnumSchema,MessageScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const MessageAggregateArgsSchema: z.ZodType<Prisma.MessageAggregateArgs> = z.object({
  where: MessageWhereInputSchema.optional(),
  orderBy: z.union([ MessageOrderByWithRelationInputSchema.array(),MessageOrderByWithRelationInputSchema ]).optional(),
  cursor: MessageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const MessageGroupByArgsSchema: z.ZodType<Prisma.MessageGroupByArgs> = z.object({
  where: MessageWhereInputSchema.optional(),
  orderBy: z.union([ MessageOrderByWithAggregationInputSchema.array(),MessageOrderByWithAggregationInputSchema ]).optional(),
  by: MessageScalarFieldEnumSchema.array(),
  having: MessageScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const MessageFindUniqueArgsSchema: z.ZodType<Prisma.MessageFindUniqueArgs> = z.object({
  select: MessageSelectSchema.optional(),
  include: MessageIncludeSchema.optional(),
  where: MessageWhereUniqueInputSchema,
}).strict() ;

export const MessageFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.MessageFindUniqueOrThrowArgs> = z.object({
  select: MessageSelectSchema.optional(),
  include: MessageIncludeSchema.optional(),
  where: MessageWhereUniqueInputSchema,
}).strict() ;

export const CallErrorFindFirstArgsSchema: z.ZodType<Prisma.CallErrorFindFirstArgs> = z.object({
  select: CallErrorSelectSchema.optional(),
  include: CallErrorIncludeSchema.optional(),
  where: CallErrorWhereInputSchema.optional(),
  orderBy: z.union([ CallErrorOrderByWithRelationInputSchema.array(),CallErrorOrderByWithRelationInputSchema ]).optional(),
  cursor: CallErrorWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CallErrorScalarFieldEnumSchema,CallErrorScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CallErrorFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CallErrorFindFirstOrThrowArgs> = z.object({
  select: CallErrorSelectSchema.optional(),
  include: CallErrorIncludeSchema.optional(),
  where: CallErrorWhereInputSchema.optional(),
  orderBy: z.union([ CallErrorOrderByWithRelationInputSchema.array(),CallErrorOrderByWithRelationInputSchema ]).optional(),
  cursor: CallErrorWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CallErrorScalarFieldEnumSchema,CallErrorScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CallErrorFindManyArgsSchema: z.ZodType<Prisma.CallErrorFindManyArgs> = z.object({
  select: CallErrorSelectSchema.optional(),
  include: CallErrorIncludeSchema.optional(),
  where: CallErrorWhereInputSchema.optional(),
  orderBy: z.union([ CallErrorOrderByWithRelationInputSchema.array(),CallErrorOrderByWithRelationInputSchema ]).optional(),
  cursor: CallErrorWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CallErrorScalarFieldEnumSchema,CallErrorScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CallErrorAggregateArgsSchema: z.ZodType<Prisma.CallErrorAggregateArgs> = z.object({
  where: CallErrorWhereInputSchema.optional(),
  orderBy: z.union([ CallErrorOrderByWithRelationInputSchema.array(),CallErrorOrderByWithRelationInputSchema ]).optional(),
  cursor: CallErrorWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CallErrorGroupByArgsSchema: z.ZodType<Prisma.CallErrorGroupByArgs> = z.object({
  where: CallErrorWhereInputSchema.optional(),
  orderBy: z.union([ CallErrorOrderByWithAggregationInputSchema.array(),CallErrorOrderByWithAggregationInputSchema ]).optional(),
  by: CallErrorScalarFieldEnumSchema.array(),
  having: CallErrorScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CallErrorFindUniqueArgsSchema: z.ZodType<Prisma.CallErrorFindUniqueArgs> = z.object({
  select: CallErrorSelectSchema.optional(),
  include: CallErrorIncludeSchema.optional(),
  where: CallErrorWhereUniqueInputSchema,
}).strict() ;

export const CallErrorFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CallErrorFindUniqueOrThrowArgs> = z.object({
  select: CallErrorSelectSchema.optional(),
  include: CallErrorIncludeSchema.optional(),
  where: CallErrorWhereUniqueInputSchema,
}).strict() ;

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  data: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
}).strict() ;

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
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
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
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

export const AgentCreateArgsSchema: z.ZodType<Prisma.AgentCreateArgs> = z.object({
  select: AgentSelectSchema.optional(),
  include: AgentIncludeSchema.optional(),
  data: z.union([ AgentCreateInputSchema,AgentUncheckedCreateInputSchema ]),
}).strict() ;

export const AgentUpsertArgsSchema: z.ZodType<Prisma.AgentUpsertArgs> = z.object({
  select: AgentSelectSchema.optional(),
  include: AgentIncludeSchema.optional(),
  where: AgentWhereUniqueInputSchema,
  create: z.union([ AgentCreateInputSchema,AgentUncheckedCreateInputSchema ]),
  update: z.union([ AgentUpdateInputSchema,AgentUncheckedUpdateInputSchema ]),
}).strict() ;

export const AgentCreateManyArgsSchema: z.ZodType<Prisma.AgentCreateManyArgs> = z.object({
  data: z.union([ AgentCreateManyInputSchema,AgentCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AgentCreateManyAndReturnArgsSchema: z.ZodType<Prisma.AgentCreateManyAndReturnArgs> = z.object({
  data: z.union([ AgentCreateManyInputSchema,AgentCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AgentDeleteArgsSchema: z.ZodType<Prisma.AgentDeleteArgs> = z.object({
  select: AgentSelectSchema.optional(),
  include: AgentIncludeSchema.optional(),
  where: AgentWhereUniqueInputSchema,
}).strict() ;

export const AgentUpdateArgsSchema: z.ZodType<Prisma.AgentUpdateArgs> = z.object({
  select: AgentSelectSchema.optional(),
  include: AgentIncludeSchema.optional(),
  data: z.union([ AgentUpdateInputSchema,AgentUncheckedUpdateInputSchema ]),
  where: AgentWhereUniqueInputSchema,
}).strict() ;

export const AgentUpdateManyArgsSchema: z.ZodType<Prisma.AgentUpdateManyArgs> = z.object({
  data: z.union([ AgentUpdateManyMutationInputSchema,AgentUncheckedUpdateManyInputSchema ]),
  where: AgentWhereInputSchema.optional(),
}).strict() ;

export const AgentDeleteManyArgsSchema: z.ZodType<Prisma.AgentDeleteManyArgs> = z.object({
  where: AgentWhereInputSchema.optional(),
}).strict() ;

export const TestCreateArgsSchema: z.ZodType<Prisma.TestCreateArgs> = z.object({
  select: TestSelectSchema.optional(),
  include: TestIncludeSchema.optional(),
  data: z.union([ TestCreateInputSchema,TestUncheckedCreateInputSchema ]),
}).strict() ;

export const TestUpsertArgsSchema: z.ZodType<Prisma.TestUpsertArgs> = z.object({
  select: TestSelectSchema.optional(),
  include: TestIncludeSchema.optional(),
  where: TestWhereUniqueInputSchema,
  create: z.union([ TestCreateInputSchema,TestUncheckedCreateInputSchema ]),
  update: z.union([ TestUpdateInputSchema,TestUncheckedUpdateInputSchema ]),
}).strict() ;

export const TestCreateManyArgsSchema: z.ZodType<Prisma.TestCreateManyArgs> = z.object({
  data: z.union([ TestCreateManyInputSchema,TestCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TestCreateManyAndReturnArgsSchema: z.ZodType<Prisma.TestCreateManyAndReturnArgs> = z.object({
  data: z.union([ TestCreateManyInputSchema,TestCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TestDeleteArgsSchema: z.ZodType<Prisma.TestDeleteArgs> = z.object({
  select: TestSelectSchema.optional(),
  include: TestIncludeSchema.optional(),
  where: TestWhereUniqueInputSchema,
}).strict() ;

export const TestUpdateArgsSchema: z.ZodType<Prisma.TestUpdateArgs> = z.object({
  select: TestSelectSchema.optional(),
  include: TestIncludeSchema.optional(),
  data: z.union([ TestUpdateInputSchema,TestUncheckedUpdateInputSchema ]),
  where: TestWhereUniqueInputSchema,
}).strict() ;

export const TestUpdateManyArgsSchema: z.ZodType<Prisma.TestUpdateManyArgs> = z.object({
  data: z.union([ TestUpdateManyMutationInputSchema,TestUncheckedUpdateManyInputSchema ]),
  where: TestWhereInputSchema.optional(),
}).strict() ;

export const TestDeleteManyArgsSchema: z.ZodType<Prisma.TestDeleteManyArgs> = z.object({
  where: TestWhereInputSchema.optional(),
}).strict() ;

export const TestAgentCreateArgsSchema: z.ZodType<Prisma.TestAgentCreateArgs> = z.object({
  select: TestAgentSelectSchema.optional(),
  include: TestAgentIncludeSchema.optional(),
  data: z.union([ TestAgentCreateInputSchema,TestAgentUncheckedCreateInputSchema ]),
}).strict() ;

export const TestAgentUpsertArgsSchema: z.ZodType<Prisma.TestAgentUpsertArgs> = z.object({
  select: TestAgentSelectSchema.optional(),
  include: TestAgentIncludeSchema.optional(),
  where: TestAgentWhereUniqueInputSchema,
  create: z.union([ TestAgentCreateInputSchema,TestAgentUncheckedCreateInputSchema ]),
  update: z.union([ TestAgentUpdateInputSchema,TestAgentUncheckedUpdateInputSchema ]),
}).strict() ;

export const TestAgentCreateManyArgsSchema: z.ZodType<Prisma.TestAgentCreateManyArgs> = z.object({
  data: z.union([ TestAgentCreateManyInputSchema,TestAgentCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TestAgentCreateManyAndReturnArgsSchema: z.ZodType<Prisma.TestAgentCreateManyAndReturnArgs> = z.object({
  data: z.union([ TestAgentCreateManyInputSchema,TestAgentCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TestAgentDeleteArgsSchema: z.ZodType<Prisma.TestAgentDeleteArgs> = z.object({
  select: TestAgentSelectSchema.optional(),
  include: TestAgentIncludeSchema.optional(),
  where: TestAgentWhereUniqueInputSchema,
}).strict() ;

export const TestAgentUpdateArgsSchema: z.ZodType<Prisma.TestAgentUpdateArgs> = z.object({
  select: TestAgentSelectSchema.optional(),
  include: TestAgentIncludeSchema.optional(),
  data: z.union([ TestAgentUpdateInputSchema,TestAgentUncheckedUpdateInputSchema ]),
  where: TestAgentWhereUniqueInputSchema,
}).strict() ;

export const TestAgentUpdateManyArgsSchema: z.ZodType<Prisma.TestAgentUpdateManyArgs> = z.object({
  data: z.union([ TestAgentUpdateManyMutationInputSchema,TestAgentUncheckedUpdateManyInputSchema ]),
  where: TestAgentWhereInputSchema.optional(),
}).strict() ;

export const TestAgentDeleteManyArgsSchema: z.ZodType<Prisma.TestAgentDeleteManyArgs> = z.object({
  where: TestAgentWhereInputSchema.optional(),
}).strict() ;

export const TestAgentTemplateCreateArgsSchema: z.ZodType<Prisma.TestAgentTemplateCreateArgs> = z.object({
  select: TestAgentTemplateSelectSchema.optional(),
  data: z.union([ TestAgentTemplateCreateInputSchema,TestAgentTemplateUncheckedCreateInputSchema ]),
}).strict() ;

export const TestAgentTemplateUpsertArgsSchema: z.ZodType<Prisma.TestAgentTemplateUpsertArgs> = z.object({
  select: TestAgentTemplateSelectSchema.optional(),
  where: TestAgentTemplateWhereUniqueInputSchema,
  create: z.union([ TestAgentTemplateCreateInputSchema,TestAgentTemplateUncheckedCreateInputSchema ]),
  update: z.union([ TestAgentTemplateUpdateInputSchema,TestAgentTemplateUncheckedUpdateInputSchema ]),
}).strict() ;

export const TestAgentTemplateCreateManyArgsSchema: z.ZodType<Prisma.TestAgentTemplateCreateManyArgs> = z.object({
  data: z.union([ TestAgentTemplateCreateManyInputSchema,TestAgentTemplateCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TestAgentTemplateCreateManyAndReturnArgsSchema: z.ZodType<Prisma.TestAgentTemplateCreateManyAndReturnArgs> = z.object({
  data: z.union([ TestAgentTemplateCreateManyInputSchema,TestAgentTemplateCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TestAgentTemplateDeleteArgsSchema: z.ZodType<Prisma.TestAgentTemplateDeleteArgs> = z.object({
  select: TestAgentTemplateSelectSchema.optional(),
  where: TestAgentTemplateWhereUniqueInputSchema,
}).strict() ;

export const TestAgentTemplateUpdateArgsSchema: z.ZodType<Prisma.TestAgentTemplateUpdateArgs> = z.object({
  select: TestAgentTemplateSelectSchema.optional(),
  data: z.union([ TestAgentTemplateUpdateInputSchema,TestAgentTemplateUncheckedUpdateInputSchema ]),
  where: TestAgentTemplateWhereUniqueInputSchema,
}).strict() ;

export const TestAgentTemplateUpdateManyArgsSchema: z.ZodType<Prisma.TestAgentTemplateUpdateManyArgs> = z.object({
  data: z.union([ TestAgentTemplateUpdateManyMutationInputSchema,TestAgentTemplateUncheckedUpdateManyInputSchema ]),
  where: TestAgentTemplateWhereInputSchema.optional(),
}).strict() ;

export const TestAgentTemplateDeleteManyArgsSchema: z.ZodType<Prisma.TestAgentTemplateDeleteManyArgs> = z.object({
  where: TestAgentTemplateWhereInputSchema.optional(),
}).strict() ;

export const IntentCreateArgsSchema: z.ZodType<Prisma.IntentCreateArgs> = z.object({
  select: IntentSelectSchema.optional(),
  include: IntentIncludeSchema.optional(),
  data: z.union([ IntentCreateInputSchema,IntentUncheckedCreateInputSchema ]),
}).strict() ;

export const IntentUpsertArgsSchema: z.ZodType<Prisma.IntentUpsertArgs> = z.object({
  select: IntentSelectSchema.optional(),
  include: IntentIncludeSchema.optional(),
  where: IntentWhereUniqueInputSchema,
  create: z.union([ IntentCreateInputSchema,IntentUncheckedCreateInputSchema ]),
  update: z.union([ IntentUpdateInputSchema,IntentUncheckedUpdateInputSchema ]),
}).strict() ;

export const IntentCreateManyArgsSchema: z.ZodType<Prisma.IntentCreateManyArgs> = z.object({
  data: z.union([ IntentCreateManyInputSchema,IntentCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const IntentCreateManyAndReturnArgsSchema: z.ZodType<Prisma.IntentCreateManyAndReturnArgs> = z.object({
  data: z.union([ IntentCreateManyInputSchema,IntentCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const IntentDeleteArgsSchema: z.ZodType<Prisma.IntentDeleteArgs> = z.object({
  select: IntentSelectSchema.optional(),
  include: IntentIncludeSchema.optional(),
  where: IntentWhereUniqueInputSchema,
}).strict() ;

export const IntentUpdateArgsSchema: z.ZodType<Prisma.IntentUpdateArgs> = z.object({
  select: IntentSelectSchema.optional(),
  include: IntentIncludeSchema.optional(),
  data: z.union([ IntentUpdateInputSchema,IntentUncheckedUpdateInputSchema ]),
  where: IntentWhereUniqueInputSchema,
}).strict() ;

export const IntentUpdateManyArgsSchema: z.ZodType<Prisma.IntentUpdateManyArgs> = z.object({
  data: z.union([ IntentUpdateManyMutationInputSchema,IntentUncheckedUpdateManyInputSchema ]),
  where: IntentWhereInputSchema.optional(),
}).strict() ;

export const IntentDeleteManyArgsSchema: z.ZodType<Prisma.IntentDeleteManyArgs> = z.object({
  where: IntentWhereInputSchema.optional(),
}).strict() ;

export const CallCreateArgsSchema: z.ZodType<Prisma.CallCreateArgs> = z.object({
  select: CallSelectSchema.optional(),
  include: CallIncludeSchema.optional(),
  data: z.union([ CallCreateInputSchema,CallUncheckedCreateInputSchema ]),
}).strict() ;

export const CallUpsertArgsSchema: z.ZodType<Prisma.CallUpsertArgs> = z.object({
  select: CallSelectSchema.optional(),
  include: CallIncludeSchema.optional(),
  where: CallWhereUniqueInputSchema,
  create: z.union([ CallCreateInputSchema,CallUncheckedCreateInputSchema ]),
  update: z.union([ CallUpdateInputSchema,CallUncheckedUpdateInputSchema ]),
}).strict() ;

export const CallCreateManyArgsSchema: z.ZodType<Prisma.CallCreateManyArgs> = z.object({
  data: z.union([ CallCreateManyInputSchema,CallCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CallCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CallCreateManyAndReturnArgs> = z.object({
  data: z.union([ CallCreateManyInputSchema,CallCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CallDeleteArgsSchema: z.ZodType<Prisma.CallDeleteArgs> = z.object({
  select: CallSelectSchema.optional(),
  include: CallIncludeSchema.optional(),
  where: CallWhereUniqueInputSchema,
}).strict() ;

export const CallUpdateArgsSchema: z.ZodType<Prisma.CallUpdateArgs> = z.object({
  select: CallSelectSchema.optional(),
  include: CallIncludeSchema.optional(),
  data: z.union([ CallUpdateInputSchema,CallUncheckedUpdateInputSchema ]),
  where: CallWhereUniqueInputSchema,
}).strict() ;

export const CallUpdateManyArgsSchema: z.ZodType<Prisma.CallUpdateManyArgs> = z.object({
  data: z.union([ CallUpdateManyMutationInputSchema,CallUncheckedUpdateManyInputSchema ]),
  where: CallWhereInputSchema.optional(),
}).strict() ;

export const CallDeleteManyArgsSchema: z.ZodType<Prisma.CallDeleteManyArgs> = z.object({
  where: CallWhereInputSchema.optional(),
}).strict() ;

export const MessageCreateArgsSchema: z.ZodType<Prisma.MessageCreateArgs> = z.object({
  select: MessageSelectSchema.optional(),
  include: MessageIncludeSchema.optional(),
  data: z.union([ MessageCreateInputSchema,MessageUncheckedCreateInputSchema ]),
}).strict() ;

export const MessageUpsertArgsSchema: z.ZodType<Prisma.MessageUpsertArgs> = z.object({
  select: MessageSelectSchema.optional(),
  include: MessageIncludeSchema.optional(),
  where: MessageWhereUniqueInputSchema,
  create: z.union([ MessageCreateInputSchema,MessageUncheckedCreateInputSchema ]),
  update: z.union([ MessageUpdateInputSchema,MessageUncheckedUpdateInputSchema ]),
}).strict() ;

export const MessageCreateManyArgsSchema: z.ZodType<Prisma.MessageCreateManyArgs> = z.object({
  data: z.union([ MessageCreateManyInputSchema,MessageCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const MessageCreateManyAndReturnArgsSchema: z.ZodType<Prisma.MessageCreateManyAndReturnArgs> = z.object({
  data: z.union([ MessageCreateManyInputSchema,MessageCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const MessageDeleteArgsSchema: z.ZodType<Prisma.MessageDeleteArgs> = z.object({
  select: MessageSelectSchema.optional(),
  include: MessageIncludeSchema.optional(),
  where: MessageWhereUniqueInputSchema,
}).strict() ;

export const MessageUpdateArgsSchema: z.ZodType<Prisma.MessageUpdateArgs> = z.object({
  select: MessageSelectSchema.optional(),
  include: MessageIncludeSchema.optional(),
  data: z.union([ MessageUpdateInputSchema,MessageUncheckedUpdateInputSchema ]),
  where: MessageWhereUniqueInputSchema,
}).strict() ;

export const MessageUpdateManyArgsSchema: z.ZodType<Prisma.MessageUpdateManyArgs> = z.object({
  data: z.union([ MessageUpdateManyMutationInputSchema,MessageUncheckedUpdateManyInputSchema ]),
  where: MessageWhereInputSchema.optional(),
}).strict() ;

export const MessageDeleteManyArgsSchema: z.ZodType<Prisma.MessageDeleteManyArgs> = z.object({
  where: MessageWhereInputSchema.optional(),
}).strict() ;

export const CallErrorCreateArgsSchema: z.ZodType<Prisma.CallErrorCreateArgs> = z.object({
  select: CallErrorSelectSchema.optional(),
  include: CallErrorIncludeSchema.optional(),
  data: z.union([ CallErrorCreateInputSchema,CallErrorUncheckedCreateInputSchema ]),
}).strict() ;

export const CallErrorUpsertArgsSchema: z.ZodType<Prisma.CallErrorUpsertArgs> = z.object({
  select: CallErrorSelectSchema.optional(),
  include: CallErrorIncludeSchema.optional(),
  where: CallErrorWhereUniqueInputSchema,
  create: z.union([ CallErrorCreateInputSchema,CallErrorUncheckedCreateInputSchema ]),
  update: z.union([ CallErrorUpdateInputSchema,CallErrorUncheckedUpdateInputSchema ]),
}).strict() ;

export const CallErrorCreateManyArgsSchema: z.ZodType<Prisma.CallErrorCreateManyArgs> = z.object({
  data: z.union([ CallErrorCreateManyInputSchema,CallErrorCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CallErrorCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CallErrorCreateManyAndReturnArgs> = z.object({
  data: z.union([ CallErrorCreateManyInputSchema,CallErrorCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CallErrorDeleteArgsSchema: z.ZodType<Prisma.CallErrorDeleteArgs> = z.object({
  select: CallErrorSelectSchema.optional(),
  include: CallErrorIncludeSchema.optional(),
  where: CallErrorWhereUniqueInputSchema,
}).strict() ;

export const CallErrorUpdateArgsSchema: z.ZodType<Prisma.CallErrorUpdateArgs> = z.object({
  select: CallErrorSelectSchema.optional(),
  include: CallErrorIncludeSchema.optional(),
  data: z.union([ CallErrorUpdateInputSchema,CallErrorUncheckedUpdateInputSchema ]),
  where: CallErrorWhereUniqueInputSchema,
}).strict() ;

export const CallErrorUpdateManyArgsSchema: z.ZodType<Prisma.CallErrorUpdateManyArgs> = z.object({
  data: z.union([ CallErrorUpdateManyMutationInputSchema,CallErrorUncheckedUpdateManyInputSchema ]),
  where: CallErrorWhereInputSchema.optional(),
}).strict() ;

export const CallErrorDeleteManyArgsSchema: z.ZodType<Prisma.CallErrorDeleteManyArgs> = z.object({
  where: CallErrorWhereInputSchema.optional(),
}).strict() ;