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

export const ApiKeyScalarFieldEnumSchema = z.enum(['orgId','apiKey']);

export const AgentScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','ownerId','name','phoneNumber','customerAgentId','githubRepoUrl','systemPrompt','extraProperties','enableSlackNotifications']);

export const TestScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','agentId','gitBranch','gitCommit','runFromApi']);

export const TestAgentScalarFieldEnumSchema = z.enum(['id','ownerId','name','headshotUrl','description','prompt','enabled','defaultSelected','order']);

export const CallScalarFieldEnumSchema = z.enum(['id','createdAt','ownerId','deleted','vapiCallId','customerCallId','ofOneDeviceId','status','result','failureReason','stereoRecordingUrl','monoRecordingUrl','startedAt','endedAt','regionId','metadata','latencyP50','latencyP90','latencyP95','interruptionP50','interruptionP90','interruptionP95','numInterruptions','duration','isRead','readBy','agentId','testId','testAgentId','scenarioId','evalSetToSuccess']);

export const MessageScalarFieldEnumSchema = z.enum(['id','role','message','time','endTime','secondsFromStart','duration','name','result','toolCalls','callId']);

export const CallErrorScalarFieldEnumSchema = z.enum(['id','secondsFromStart','duration','type','description','callId']);

export const CallRecordingScalarFieldEnumSchema = z.enum(['id','audioUrl','createdAt','processed','agentId','regionId','duration']);

export const ScenarioScalarFieldEnumSchema = z.enum(['id','createdAt','agentId','name','instructions','successCriteria','includeDateTime','timezone','deleted']);

export const EvaluationTemplateScalarFieldEnumSchema = z.enum(['id','createdAt','name','description','params','type','resultType','contentType','toolCallExpectedResult','ownerId','deleted']);

export const GeneralEvaluationScalarFieldEnumSchema = z.enum(['id','agentId','evaluationId']);

export const EvaluationScalarFieldEnumSchema = z.enum(['id','createdAt','enabled','isCritical','params','evaluationTemplateId','scenarioId','evaluationGroupId']);

export const EvaluationResultScalarFieldEnumSchema = z.enum(['id','createdAt','callId','evaluationId','result','success','secondsFromStart','duration','type','details','evaluationTemplateId']);

export const LatencyBlockScalarFieldEnumSchema = z.enum(['id','secondsFromStart','duration','callId']);

export const InterruptionScalarFieldEnumSchema = z.enum(['id','secondsFromStart','duration','callId','text']);

export const EvaluationGroupScalarFieldEnumSchema = z.enum(['id','createdAt','ownerId','name','condition','enabled','savedSearchId']);

export const SavedSearchScalarFieldEnumSchema = z.enum(['id','createdAt','name','ownerId','isDefault','agentId','lookbackPeriod','timeRange','chartPeriod','customerCallId','metadata']);

export const AlertScalarFieldEnumSchema = z.enum(['id','createdAt','ownerId','name','savedSearchId','type','details','enabled']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const JsonNullValueInputSchema = z.enum(['JsonNull',]).transform((value) => (value === 'JsonNull' ? Prisma.JsonNull : value));

export const NullableJsonNullValueInputSchema = z.enum(['DbNull','JsonNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.DbNull : value);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.JsonNull : value === 'AnyNull' ? Prisma.AnyNull : value);

export const NullsOrderSchema = z.enum(['first','last']);

export const CallResultSchema = z.enum(['success','failure']);

export type CallResultType = `${z.infer<typeof CallResultSchema>}`

export const RoleSchema = z.enum(['user','bot','system','tool_calls','tool_call_result']);

export type RoleType = `${z.infer<typeof RoleSchema>}`

export const CallStatusSchema = z.enum(['queued','in_progress','analyzing','completed']);

export type CallStatusType = `${z.infer<typeof CallStatusSchema>}`

export const EvalTypeSchema = z.enum(['scenario','general']);

export type EvalTypeType = `${z.infer<typeof EvalTypeSchema>}`

export const EvalResultTypeSchema = z.enum(['boolean','number','percentage']);

export type EvalResultTypeType = `${z.infer<typeof EvalResultTypeSchema>}`

export const EvalContentTypeSchema = z.enum(['tool','content']);

export type EvalContentTypeType = `${z.infer<typeof EvalContentTypeSchema>}`

export const AlertTypeSchema = z.enum(['evalSet','latency']);

export type AlertTypeType = `${z.infer<typeof AlertTypeSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// API KEY SCHEMA
/////////////////////////////////////////

export const ApiKeySchema = z.object({
  orgId: z.string(),
  apiKey: z.string(),
})

export type ApiKey = z.infer<typeof ApiKeySchema>

/////////////////////////////////////////
// AGENT SCHEMA
/////////////////////////////////////////

export const AgentSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  ownerId: z.string(),
  name: z.string(),
  phoneNumber: z.string(),
  customerAgentId: z.string(),
  githubRepoUrl: z.string().nullable(),
  systemPrompt: z.string(),
  extraProperties: JsonValueSchema,
  enableSlackNotifications: z.boolean(),
})

export type Agent = z.infer<typeof AgentSchema>

/////////////////////////////////////////
// TEST SCHEMA
/////////////////////////////////////////

export const TestSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  agentId: z.string(),
  gitBranch: z.string().nullable(),
  gitCommit: z.string().nullable(),
  runFromApi: z.boolean(),
})

export type Test = z.infer<typeof TestSchema>

/////////////////////////////////////////
// TEST AGENT SCHEMA
/////////////////////////////////////////

export const TestAgentSchema = z.object({
  id: z.string(),
  ownerId: z.string().nullable(),
  name: z.string(),
  headshotUrl: z.string(),
  description: z.string(),
  prompt: z.string(),
  enabled: z.boolean(),
  defaultSelected: z.boolean(),
  order: z.number().int(),
})

export type TestAgent = z.infer<typeof TestAgentSchema>

/////////////////////////////////////////
// CALL SCHEMA
/////////////////////////////////////////

export const CallSchema = z.object({
  status: CallStatusSchema,
  result: CallResultSchema.nullable(),
  id: z.string(),
  createdAt: z.coerce.date(),
  ownerId: z.string().nullable(),
  deleted: z.boolean(),
  vapiCallId: z.string().nullable(),
  customerCallId: z.string().nullable(),
  ofOneDeviceId: z.string().nullable(),
  failureReason: z.string().nullable(),
  stereoRecordingUrl: z.string(),
  monoRecordingUrl: z.string().nullable(),
  startedAt: z.string().nullable(),
  endedAt: z.string().nullable(),
  regionId: z.string().nullable(),
  metadata: JsonValueSchema.nullable(),
  latencyP50: z.number().nullable(),
  latencyP90: z.number().nullable(),
  latencyP95: z.number().nullable(),
  interruptionP50: z.number().nullable(),
  interruptionP90: z.number().nullable(),
  interruptionP95: z.number().nullable(),
  numInterruptions: z.number().int().nullable(),
  duration: z.number().nullable(),
  isRead: z.boolean().nullable(),
  readBy: z.string().nullable(),
  agentId: z.string().nullable(),
  testId: z.string().nullable(),
  testAgentId: z.string().nullable(),
  scenarioId: z.string().nullable(),
  evalSetToSuccess: JsonValueSchema,
})

export type Call = z.infer<typeof CallSchema>

/////////////////////////////////////////
// MESSAGE SCHEMA
/////////////////////////////////////////

export const MessageSchema = z.object({
  role: RoleSchema,
  id: z.string(),
  message: z.string(),
  time: z.number(),
  endTime: z.number(),
  secondsFromStart: z.number(),
  duration: z.number(),
  name: z.string(),
  result: z.string(),
  toolCalls: JsonValueSchema,
  callId: z.string(),
})

export type Message = z.infer<typeof MessageSchema>

/////////////////////////////////////////
// CALL ERROR SCHEMA
/////////////////////////////////////////

export const CallErrorSchema = z.object({
  id: z.string(),
  secondsFromStart: z.number(),
  duration: z.number(),
  type: z.string().nullable(),
  description: z.string(),
  callId: z.string(),
})

export type CallError = z.infer<typeof CallErrorSchema>

/////////////////////////////////////////
// CALL RECORDING SCHEMA
/////////////////////////////////////////

export const CallRecordingSchema = z.object({
  id: z.string(),
  audioUrl: z.string(),
  createdAt: z.coerce.date(),
  processed: z.boolean(),
  agentId: z.string().nullable(),
  regionId: z.string().nullable(),
  duration: z.number().nullable(),
})

export type CallRecording = z.infer<typeof CallRecordingSchema>

/////////////////////////////////////////
// SCENARIO SCHEMA
/////////////////////////////////////////

export const ScenarioSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  agentId: z.string(),
  name: z.string(),
  instructions: z.string(),
  successCriteria: z.string(),
  includeDateTime: z.boolean(),
  timezone: z.string().nullable(),
  deleted: z.boolean(),
})

export type Scenario = z.infer<typeof ScenarioSchema>

/////////////////////////////////////////
// EVALUATION TEMPLATE SCHEMA
/////////////////////////////////////////

export const EvaluationTemplateSchema = z.object({
  type: EvalTypeSchema,
  resultType: EvalResultTypeSchema,
  contentType: EvalContentTypeSchema,
  id: z.string(),
  createdAt: z.coerce.date(),
  name: z.string(),
  description: z.string(),
  params: z.string().array(),
  toolCallExpectedResult: z.string(),
  ownerId: z.string().nullable(),
  deleted: z.boolean(),
})

export type EvaluationTemplate = z.infer<typeof EvaluationTemplateSchema>

/////////////////////////////////////////
// GENERAL EVALUATION SCHEMA
/////////////////////////////////////////

export const GeneralEvaluationSchema = z.object({
  id: z.string(),
  agentId: z.string(),
  evaluationId: z.string(),
})

export type GeneralEvaluation = z.infer<typeof GeneralEvaluationSchema>

/////////////////////////////////////////
// EVALUATION SCHEMA
/////////////////////////////////////////

export const EvaluationSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  enabled: z.boolean(),
  isCritical: z.boolean(),
  params: JsonValueSchema,
  evaluationTemplateId: z.string(),
  scenarioId: z.string().nullable(),
  evaluationGroupId: z.string().nullable(),
})

export type Evaluation = z.infer<typeof EvaluationSchema>

/////////////////////////////////////////
// EVALUATION RESULT SCHEMA
/////////////////////////////////////////

export const EvaluationResultSchema = z.object({
  type: EvalResultTypeSchema,
  id: z.string(),
  createdAt: z.coerce.date(),
  callId: z.string().nullable(),
  evaluationId: z.string(),
  result: z.string(),
  success: z.boolean(),
  secondsFromStart: z.number().nullable(),
  duration: z.number().nullable(),
  details: z.string(),
  evaluationTemplateId: z.string().nullable(),
})

export type EvaluationResult = z.infer<typeof EvaluationResultSchema>

/////////////////////////////////////////
// LATENCY BLOCK SCHEMA
/////////////////////////////////////////

export const LatencyBlockSchema = z.object({
  id: z.string(),
  secondsFromStart: z.number(),
  duration: z.number(),
  callId: z.string(),
})

export type LatencyBlock = z.infer<typeof LatencyBlockSchema>

/////////////////////////////////////////
// INTERRUPTION SCHEMA
/////////////////////////////////////////

export const InterruptionSchema = z.object({
  id: z.string(),
  secondsFromStart: z.number(),
  duration: z.number(),
  callId: z.string(),
  text: z.string(),
})

export type Interruption = z.infer<typeof InterruptionSchema>

/////////////////////////////////////////
// EVALUATION GROUP SCHEMA
/////////////////////////////////////////

export const EvaluationGroupSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  ownerId: z.string(),
  name: z.string(),
  condition: z.string(),
  enabled: z.boolean(),
  savedSearchId: z.string().nullable(),
})

export type EvaluationGroup = z.infer<typeof EvaluationGroupSchema>

/////////////////////////////////////////
// SAVED SEARCH SCHEMA
/////////////////////////////////////////

export const SavedSearchSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  name: z.string(),
  ownerId: z.string(),
  isDefault: z.boolean(),
  agentId: z.string().array(),
  lookbackPeriod: JsonValueSchema,
  timeRange: JsonValueSchema.nullable(),
  chartPeriod: z.number().int(),
  customerCallId: z.string().nullable(),
  metadata: JsonValueSchema.nullable(),
})

export type SavedSearch = z.infer<typeof SavedSearchSchema>

/////////////////////////////////////////
// ALERT SCHEMA
/////////////////////////////////////////

export const AlertSchema = z.object({
  type: AlertTypeSchema,
  id: z.string(),
  createdAt: z.coerce.date(),
  ownerId: z.string(),
  name: z.string(),
  savedSearchId: z.string(),
  details: JsonValueSchema,
  enabled: z.boolean(),
})

export type Alert = z.infer<typeof AlertSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// API KEY
//------------------------------------------------------

export const ApiKeySelectSchema: z.ZodType<Prisma.ApiKeySelect> = z.object({
  orgId: z.boolean().optional(),
  apiKey: z.boolean().optional(),
}).strict()

// AGENT
//------------------------------------------------------

export const AgentIncludeSchema: z.ZodType<Prisma.AgentInclude> = z.object({
  enabledTestAgents: z.union([z.boolean(),z.lazy(() => TestAgentFindManyArgsSchema)]).optional(),
  scenarios: z.union([z.boolean(),z.lazy(() => ScenarioFindManyArgsSchema)]).optional(),
  tests: z.union([z.boolean(),z.lazy(() => TestFindManyArgsSchema)]).optional(),
  calls: z.union([z.boolean(),z.lazy(() => CallFindManyArgsSchema)]).optional(),
  generalEvaluations: z.union([z.boolean(),z.lazy(() => GeneralEvaluationFindManyArgsSchema)]).optional(),
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
  enabledTestAgents: z.boolean().optional(),
  scenarios: z.boolean().optional(),
  tests: z.boolean().optional(),
  calls: z.boolean().optional(),
  generalEvaluations: z.boolean().optional(),
}).strict();

export const AgentSelectSchema: z.ZodType<Prisma.AgentSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  ownerId: z.boolean().optional(),
  name: z.boolean().optional(),
  phoneNumber: z.boolean().optional(),
  customerAgentId: z.boolean().optional(),
  githubRepoUrl: z.boolean().optional(),
  systemPrompt: z.boolean().optional(),
  extraProperties: z.boolean().optional(),
  enableSlackNotifications: z.boolean().optional(),
  enabledTestAgents: z.union([z.boolean(),z.lazy(() => TestAgentFindManyArgsSchema)]).optional(),
  scenarios: z.union([z.boolean(),z.lazy(() => ScenarioFindManyArgsSchema)]).optional(),
  tests: z.union([z.boolean(),z.lazy(() => TestFindManyArgsSchema)]).optional(),
  calls: z.union([z.boolean(),z.lazy(() => CallFindManyArgsSchema)]).optional(),
  generalEvaluations: z.union([z.boolean(),z.lazy(() => GeneralEvaluationFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => AgentCountOutputTypeArgsSchema)]).optional(),
}).strict()

// TEST
//------------------------------------------------------

export const TestIncludeSchema: z.ZodType<Prisma.TestInclude> = z.object({
  agent: z.union([z.boolean(),z.lazy(() => AgentArgsSchema)]).optional(),
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
  calls: z.boolean().optional(),
}).strict();

export const TestSelectSchema: z.ZodType<Prisma.TestSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  agentId: z.boolean().optional(),
  gitBranch: z.boolean().optional(),
  gitCommit: z.boolean().optional(),
  runFromApi: z.boolean().optional(),
  agent: z.union([z.boolean(),z.lazy(() => AgentArgsSchema)]).optional(),
  calls: z.union([z.boolean(),z.lazy(() => CallFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TestCountOutputTypeArgsSchema)]).optional(),
}).strict()

// TEST AGENT
//------------------------------------------------------

export const TestAgentIncludeSchema: z.ZodType<Prisma.TestAgentInclude> = z.object({
  agents: z.union([z.boolean(),z.lazy(() => AgentFindManyArgsSchema)]).optional(),
  calls: z.union([z.boolean(),z.lazy(() => CallFindManyArgsSchema)]).optional(),
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
  agents: z.boolean().optional(),
  calls: z.boolean().optional(),
}).strict();

export const TestAgentSelectSchema: z.ZodType<Prisma.TestAgentSelect> = z.object({
  id: z.boolean().optional(),
  ownerId: z.boolean().optional(),
  name: z.boolean().optional(),
  headshotUrl: z.boolean().optional(),
  description: z.boolean().optional(),
  prompt: z.boolean().optional(),
  enabled: z.boolean().optional(),
  defaultSelected: z.boolean().optional(),
  order: z.boolean().optional(),
  agents: z.union([z.boolean(),z.lazy(() => AgentFindManyArgsSchema)]).optional(),
  calls: z.union([z.boolean(),z.lazy(() => CallFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TestAgentCountOutputTypeArgsSchema)]).optional(),
}).strict()

// CALL
//------------------------------------------------------

export const CallIncludeSchema: z.ZodType<Prisma.CallInclude> = z.object({
  agent: z.union([z.boolean(),z.lazy(() => AgentArgsSchema)]).optional(),
  test: z.union([z.boolean(),z.lazy(() => TestArgsSchema)]).optional(),
  testAgent: z.union([z.boolean(),z.lazy(() => TestAgentArgsSchema)]).optional(),
  scenario: z.union([z.boolean(),z.lazy(() => ScenarioArgsSchema)]).optional(),
  evaluationResults: z.union([z.boolean(),z.lazy(() => EvaluationResultFindManyArgsSchema)]).optional(),
  messages: z.union([z.boolean(),z.lazy(() => MessageFindManyArgsSchema)]).optional(),
  latencyBlocks: z.union([z.boolean(),z.lazy(() => LatencyBlockFindManyArgsSchema)]).optional(),
  interruptions: z.union([z.boolean(),z.lazy(() => InterruptionFindManyArgsSchema)]).optional(),
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
  evaluationResults: z.boolean().optional(),
  messages: z.boolean().optional(),
  latencyBlocks: z.boolean().optional(),
  interruptions: z.boolean().optional(),
  errors: z.boolean().optional(),
}).strict();

export const CallSelectSchema: z.ZodType<Prisma.CallSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  ownerId: z.boolean().optional(),
  deleted: z.boolean().optional(),
  vapiCallId: z.boolean().optional(),
  customerCallId: z.boolean().optional(),
  ofOneDeviceId: z.boolean().optional(),
  status: z.boolean().optional(),
  result: z.boolean().optional(),
  failureReason: z.boolean().optional(),
  stereoRecordingUrl: z.boolean().optional(),
  monoRecordingUrl: z.boolean().optional(),
  startedAt: z.boolean().optional(),
  endedAt: z.boolean().optional(),
  regionId: z.boolean().optional(),
  metadata: z.boolean().optional(),
  latencyP50: z.boolean().optional(),
  latencyP90: z.boolean().optional(),
  latencyP95: z.boolean().optional(),
  interruptionP50: z.boolean().optional(),
  interruptionP90: z.boolean().optional(),
  interruptionP95: z.boolean().optional(),
  numInterruptions: z.boolean().optional(),
  duration: z.boolean().optional(),
  isRead: z.boolean().optional(),
  readBy: z.boolean().optional(),
  agentId: z.boolean().optional(),
  testId: z.boolean().optional(),
  testAgentId: z.boolean().optional(),
  scenarioId: z.boolean().optional(),
  evalSetToSuccess: z.boolean().optional(),
  agent: z.union([z.boolean(),z.lazy(() => AgentArgsSchema)]).optional(),
  test: z.union([z.boolean(),z.lazy(() => TestArgsSchema)]).optional(),
  testAgent: z.union([z.boolean(),z.lazy(() => TestAgentArgsSchema)]).optional(),
  scenario: z.union([z.boolean(),z.lazy(() => ScenarioArgsSchema)]).optional(),
  evaluationResults: z.union([z.boolean(),z.lazy(() => EvaluationResultFindManyArgsSchema)]).optional(),
  messages: z.union([z.boolean(),z.lazy(() => MessageFindManyArgsSchema)]).optional(),
  latencyBlocks: z.union([z.boolean(),z.lazy(() => LatencyBlockFindManyArgsSchema)]).optional(),
  interruptions: z.union([z.boolean(),z.lazy(() => InterruptionFindManyArgsSchema)]).optional(),
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
  name: z.boolean().optional(),
  result: z.boolean().optional(),
  toolCalls: z.boolean().optional(),
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

// CALL RECORDING
//------------------------------------------------------

export const CallRecordingSelectSchema: z.ZodType<Prisma.CallRecordingSelect> = z.object({
  id: z.boolean().optional(),
  audioUrl: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  processed: z.boolean().optional(),
  agentId: z.boolean().optional(),
  regionId: z.boolean().optional(),
  duration: z.boolean().optional(),
}).strict()

// SCENARIO
//------------------------------------------------------

export const ScenarioIncludeSchema: z.ZodType<Prisma.ScenarioInclude> = z.object({
  agent: z.union([z.boolean(),z.lazy(() => AgentArgsSchema)]).optional(),
  calls: z.union([z.boolean(),z.lazy(() => CallFindManyArgsSchema)]).optional(),
  evaluations: z.union([z.boolean(),z.lazy(() => EvaluationFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ScenarioCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const ScenarioArgsSchema: z.ZodType<Prisma.ScenarioDefaultArgs> = z.object({
  select: z.lazy(() => ScenarioSelectSchema).optional(),
  include: z.lazy(() => ScenarioIncludeSchema).optional(),
}).strict();

export const ScenarioCountOutputTypeArgsSchema: z.ZodType<Prisma.ScenarioCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ScenarioCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ScenarioCountOutputTypeSelectSchema: z.ZodType<Prisma.ScenarioCountOutputTypeSelect> = z.object({
  calls: z.boolean().optional(),
  evaluations: z.boolean().optional(),
}).strict();

export const ScenarioSelectSchema: z.ZodType<Prisma.ScenarioSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  agentId: z.boolean().optional(),
  name: z.boolean().optional(),
  instructions: z.boolean().optional(),
  successCriteria: z.boolean().optional(),
  includeDateTime: z.boolean().optional(),
  timezone: z.boolean().optional(),
  deleted: z.boolean().optional(),
  agent: z.union([z.boolean(),z.lazy(() => AgentArgsSchema)]).optional(),
  calls: z.union([z.boolean(),z.lazy(() => CallFindManyArgsSchema)]).optional(),
  evaluations: z.union([z.boolean(),z.lazy(() => EvaluationFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ScenarioCountOutputTypeArgsSchema)]).optional(),
}).strict()

// EVALUATION TEMPLATE
//------------------------------------------------------

export const EvaluationTemplateIncludeSchema: z.ZodType<Prisma.EvaluationTemplateInclude> = z.object({
  evaluationResults: z.union([z.boolean(),z.lazy(() => EvaluationResultFindManyArgsSchema)]).optional(),
  evaluations: z.union([z.boolean(),z.lazy(() => EvaluationFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => EvaluationTemplateCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const EvaluationTemplateArgsSchema: z.ZodType<Prisma.EvaluationTemplateDefaultArgs> = z.object({
  select: z.lazy(() => EvaluationTemplateSelectSchema).optional(),
  include: z.lazy(() => EvaluationTemplateIncludeSchema).optional(),
}).strict();

export const EvaluationTemplateCountOutputTypeArgsSchema: z.ZodType<Prisma.EvaluationTemplateCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => EvaluationTemplateCountOutputTypeSelectSchema).nullish(),
}).strict();

export const EvaluationTemplateCountOutputTypeSelectSchema: z.ZodType<Prisma.EvaluationTemplateCountOutputTypeSelect> = z.object({
  evaluationResults: z.boolean().optional(),
  evaluations: z.boolean().optional(),
}).strict();

export const EvaluationTemplateSelectSchema: z.ZodType<Prisma.EvaluationTemplateSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  params: z.boolean().optional(),
  type: z.boolean().optional(),
  resultType: z.boolean().optional(),
  contentType: z.boolean().optional(),
  toolCallExpectedResult: z.boolean().optional(),
  ownerId: z.boolean().optional(),
  deleted: z.boolean().optional(),
  evaluationResults: z.union([z.boolean(),z.lazy(() => EvaluationResultFindManyArgsSchema)]).optional(),
  evaluations: z.union([z.boolean(),z.lazy(() => EvaluationFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => EvaluationTemplateCountOutputTypeArgsSchema)]).optional(),
}).strict()

// GENERAL EVALUATION
//------------------------------------------------------

export const GeneralEvaluationIncludeSchema: z.ZodType<Prisma.GeneralEvaluationInclude> = z.object({
  agent: z.union([z.boolean(),z.lazy(() => AgentArgsSchema)]).optional(),
  evaluation: z.union([z.boolean(),z.lazy(() => EvaluationArgsSchema)]).optional(),
}).strict()

export const GeneralEvaluationArgsSchema: z.ZodType<Prisma.GeneralEvaluationDefaultArgs> = z.object({
  select: z.lazy(() => GeneralEvaluationSelectSchema).optional(),
  include: z.lazy(() => GeneralEvaluationIncludeSchema).optional(),
}).strict();

export const GeneralEvaluationSelectSchema: z.ZodType<Prisma.GeneralEvaluationSelect> = z.object({
  id: z.boolean().optional(),
  agentId: z.boolean().optional(),
  evaluationId: z.boolean().optional(),
  agent: z.union([z.boolean(),z.lazy(() => AgentArgsSchema)]).optional(),
  evaluation: z.union([z.boolean(),z.lazy(() => EvaluationArgsSchema)]).optional(),
}).strict()

// EVALUATION
//------------------------------------------------------

export const EvaluationIncludeSchema: z.ZodType<Prisma.EvaluationInclude> = z.object({
  evaluationTemplate: z.union([z.boolean(),z.lazy(() => EvaluationTemplateArgsSchema)]).optional(),
  scenario: z.union([z.boolean(),z.lazy(() => ScenarioArgsSchema)]).optional(),
  evaluationGroup: z.union([z.boolean(),z.lazy(() => EvaluationGroupArgsSchema)]).optional(),
  evaluationResults: z.union([z.boolean(),z.lazy(() => EvaluationResultFindManyArgsSchema)]).optional(),
  generalEvaluations: z.union([z.boolean(),z.lazy(() => GeneralEvaluationFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => EvaluationCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const EvaluationArgsSchema: z.ZodType<Prisma.EvaluationDefaultArgs> = z.object({
  select: z.lazy(() => EvaluationSelectSchema).optional(),
  include: z.lazy(() => EvaluationIncludeSchema).optional(),
}).strict();

export const EvaluationCountOutputTypeArgsSchema: z.ZodType<Prisma.EvaluationCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => EvaluationCountOutputTypeSelectSchema).nullish(),
}).strict();

export const EvaluationCountOutputTypeSelectSchema: z.ZodType<Prisma.EvaluationCountOutputTypeSelect> = z.object({
  evaluationResults: z.boolean().optional(),
  generalEvaluations: z.boolean().optional(),
}).strict();

export const EvaluationSelectSchema: z.ZodType<Prisma.EvaluationSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  enabled: z.boolean().optional(),
  isCritical: z.boolean().optional(),
  params: z.boolean().optional(),
  evaluationTemplateId: z.boolean().optional(),
  scenarioId: z.boolean().optional(),
  evaluationGroupId: z.boolean().optional(),
  evaluationTemplate: z.union([z.boolean(),z.lazy(() => EvaluationTemplateArgsSchema)]).optional(),
  scenario: z.union([z.boolean(),z.lazy(() => ScenarioArgsSchema)]).optional(),
  evaluationGroup: z.union([z.boolean(),z.lazy(() => EvaluationGroupArgsSchema)]).optional(),
  evaluationResults: z.union([z.boolean(),z.lazy(() => EvaluationResultFindManyArgsSchema)]).optional(),
  generalEvaluations: z.union([z.boolean(),z.lazy(() => GeneralEvaluationFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => EvaluationCountOutputTypeArgsSchema)]).optional(),
}).strict()

// EVALUATION RESULT
//------------------------------------------------------

export const EvaluationResultIncludeSchema: z.ZodType<Prisma.EvaluationResultInclude> = z.object({
  call: z.union([z.boolean(),z.lazy(() => CallArgsSchema)]).optional(),
  evaluation: z.union([z.boolean(),z.lazy(() => EvaluationArgsSchema)]).optional(),
  evaluationTemplate: z.union([z.boolean(),z.lazy(() => EvaluationTemplateArgsSchema)]).optional(),
}).strict()

export const EvaluationResultArgsSchema: z.ZodType<Prisma.EvaluationResultDefaultArgs> = z.object({
  select: z.lazy(() => EvaluationResultSelectSchema).optional(),
  include: z.lazy(() => EvaluationResultIncludeSchema).optional(),
}).strict();

export const EvaluationResultSelectSchema: z.ZodType<Prisma.EvaluationResultSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  callId: z.boolean().optional(),
  evaluationId: z.boolean().optional(),
  result: z.boolean().optional(),
  success: z.boolean().optional(),
  secondsFromStart: z.boolean().optional(),
  duration: z.boolean().optional(),
  type: z.boolean().optional(),
  details: z.boolean().optional(),
  evaluationTemplateId: z.boolean().optional(),
  call: z.union([z.boolean(),z.lazy(() => CallArgsSchema)]).optional(),
  evaluation: z.union([z.boolean(),z.lazy(() => EvaluationArgsSchema)]).optional(),
  evaluationTemplate: z.union([z.boolean(),z.lazy(() => EvaluationTemplateArgsSchema)]).optional(),
}).strict()

// LATENCY BLOCK
//------------------------------------------------------

export const LatencyBlockIncludeSchema: z.ZodType<Prisma.LatencyBlockInclude> = z.object({
  call: z.union([z.boolean(),z.lazy(() => CallArgsSchema)]).optional(),
}).strict()

export const LatencyBlockArgsSchema: z.ZodType<Prisma.LatencyBlockDefaultArgs> = z.object({
  select: z.lazy(() => LatencyBlockSelectSchema).optional(),
  include: z.lazy(() => LatencyBlockIncludeSchema).optional(),
}).strict();

export const LatencyBlockSelectSchema: z.ZodType<Prisma.LatencyBlockSelect> = z.object({
  id: z.boolean().optional(),
  secondsFromStart: z.boolean().optional(),
  duration: z.boolean().optional(),
  callId: z.boolean().optional(),
  call: z.union([z.boolean(),z.lazy(() => CallArgsSchema)]).optional(),
}).strict()

// INTERRUPTION
//------------------------------------------------------

export const InterruptionIncludeSchema: z.ZodType<Prisma.InterruptionInclude> = z.object({
  call: z.union([z.boolean(),z.lazy(() => CallArgsSchema)]).optional(),
}).strict()

export const InterruptionArgsSchema: z.ZodType<Prisma.InterruptionDefaultArgs> = z.object({
  select: z.lazy(() => InterruptionSelectSchema).optional(),
  include: z.lazy(() => InterruptionIncludeSchema).optional(),
}).strict();

export const InterruptionSelectSchema: z.ZodType<Prisma.InterruptionSelect> = z.object({
  id: z.boolean().optional(),
  secondsFromStart: z.boolean().optional(),
  duration: z.boolean().optional(),
  callId: z.boolean().optional(),
  text: z.boolean().optional(),
  call: z.union([z.boolean(),z.lazy(() => CallArgsSchema)]).optional(),
}).strict()

// EVALUATION GROUP
//------------------------------------------------------

export const EvaluationGroupIncludeSchema: z.ZodType<Prisma.EvaluationGroupInclude> = z.object({
  evaluations: z.union([z.boolean(),z.lazy(() => EvaluationFindManyArgsSchema)]).optional(),
  savedSearch: z.union([z.boolean(),z.lazy(() => SavedSearchArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => EvaluationGroupCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const EvaluationGroupArgsSchema: z.ZodType<Prisma.EvaluationGroupDefaultArgs> = z.object({
  select: z.lazy(() => EvaluationGroupSelectSchema).optional(),
  include: z.lazy(() => EvaluationGroupIncludeSchema).optional(),
}).strict();

export const EvaluationGroupCountOutputTypeArgsSchema: z.ZodType<Prisma.EvaluationGroupCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => EvaluationGroupCountOutputTypeSelectSchema).nullish(),
}).strict();

export const EvaluationGroupCountOutputTypeSelectSchema: z.ZodType<Prisma.EvaluationGroupCountOutputTypeSelect> = z.object({
  evaluations: z.boolean().optional(),
}).strict();

export const EvaluationGroupSelectSchema: z.ZodType<Prisma.EvaluationGroupSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  ownerId: z.boolean().optional(),
  name: z.boolean().optional(),
  condition: z.boolean().optional(),
  enabled: z.boolean().optional(),
  savedSearchId: z.boolean().optional(),
  evaluations: z.union([z.boolean(),z.lazy(() => EvaluationFindManyArgsSchema)]).optional(),
  savedSearch: z.union([z.boolean(),z.lazy(() => SavedSearchArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => EvaluationGroupCountOutputTypeArgsSchema)]).optional(),
}).strict()

// SAVED SEARCH
//------------------------------------------------------

export const SavedSearchIncludeSchema: z.ZodType<Prisma.SavedSearchInclude> = z.object({
  evaluationGroups: z.union([z.boolean(),z.lazy(() => EvaluationGroupFindManyArgsSchema)]).optional(),
  alerts: z.union([z.boolean(),z.lazy(() => AlertFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => SavedSearchCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const SavedSearchArgsSchema: z.ZodType<Prisma.SavedSearchDefaultArgs> = z.object({
  select: z.lazy(() => SavedSearchSelectSchema).optional(),
  include: z.lazy(() => SavedSearchIncludeSchema).optional(),
}).strict();

export const SavedSearchCountOutputTypeArgsSchema: z.ZodType<Prisma.SavedSearchCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => SavedSearchCountOutputTypeSelectSchema).nullish(),
}).strict();

export const SavedSearchCountOutputTypeSelectSchema: z.ZodType<Prisma.SavedSearchCountOutputTypeSelect> = z.object({
  evaluationGroups: z.boolean().optional(),
  alerts: z.boolean().optional(),
}).strict();

export const SavedSearchSelectSchema: z.ZodType<Prisma.SavedSearchSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  name: z.boolean().optional(),
  ownerId: z.boolean().optional(),
  isDefault: z.boolean().optional(),
  agentId: z.boolean().optional(),
  lookbackPeriod: z.boolean().optional(),
  timeRange: z.boolean().optional(),
  chartPeriod: z.boolean().optional(),
  customerCallId: z.boolean().optional(),
  metadata: z.boolean().optional(),
  evaluationGroups: z.union([z.boolean(),z.lazy(() => EvaluationGroupFindManyArgsSchema)]).optional(),
  alerts: z.union([z.boolean(),z.lazy(() => AlertFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => SavedSearchCountOutputTypeArgsSchema)]).optional(),
}).strict()

// ALERT
//------------------------------------------------------

export const AlertIncludeSchema: z.ZodType<Prisma.AlertInclude> = z.object({
  savedSearch: z.union([z.boolean(),z.lazy(() => SavedSearchArgsSchema)]).optional(),
}).strict()

export const AlertArgsSchema: z.ZodType<Prisma.AlertDefaultArgs> = z.object({
  select: z.lazy(() => AlertSelectSchema).optional(),
  include: z.lazy(() => AlertIncludeSchema).optional(),
}).strict();

export const AlertSelectSchema: z.ZodType<Prisma.AlertSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  ownerId: z.boolean().optional(),
  name: z.boolean().optional(),
  savedSearchId: z.boolean().optional(),
  type: z.boolean().optional(),
  details: z.boolean().optional(),
  enabled: z.boolean().optional(),
  savedSearch: z.union([z.boolean(),z.lazy(() => SavedSearchArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const ApiKeyWhereInputSchema: z.ZodType<Prisma.ApiKeyWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ApiKeyWhereInputSchema),z.lazy(() => ApiKeyWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ApiKeyWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ApiKeyWhereInputSchema),z.lazy(() => ApiKeyWhereInputSchema).array() ]).optional(),
  orgId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  apiKey: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const ApiKeyOrderByWithRelationInputSchema: z.ZodType<Prisma.ApiKeyOrderByWithRelationInput> = z.object({
  orgId: z.lazy(() => SortOrderSchema).optional(),
  apiKey: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ApiKeyWhereUniqueInputSchema: z.ZodType<Prisma.ApiKeyWhereUniqueInput> = z.object({
  orgId: z.string()
})
.and(z.object({
  orgId: z.string().optional(),
  AND: z.union([ z.lazy(() => ApiKeyWhereInputSchema),z.lazy(() => ApiKeyWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ApiKeyWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ApiKeyWhereInputSchema),z.lazy(() => ApiKeyWhereInputSchema).array() ]).optional(),
  apiKey: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict());

export const ApiKeyOrderByWithAggregationInputSchema: z.ZodType<Prisma.ApiKeyOrderByWithAggregationInput> = z.object({
  orgId: z.lazy(() => SortOrderSchema).optional(),
  apiKey: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ApiKeyCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ApiKeyMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ApiKeyMinOrderByAggregateInputSchema).optional()
}).strict();

export const ApiKeyScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ApiKeyScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ApiKeyScalarWhereWithAggregatesInputSchema),z.lazy(() => ApiKeyScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ApiKeyScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ApiKeyScalarWhereWithAggregatesInputSchema),z.lazy(() => ApiKeyScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  orgId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  apiKey: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const AgentWhereInputSchema: z.ZodType<Prisma.AgentWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AgentWhereInputSchema),z.lazy(() => AgentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AgentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AgentWhereInputSchema),z.lazy(() => AgentWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  phoneNumber: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  customerAgentId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  githubRepoUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  systemPrompt: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  extraProperties: z.lazy(() => JsonFilterSchema).optional(),
  enableSlackNotifications: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  enabledTestAgents: z.lazy(() => TestAgentListRelationFilterSchema).optional(),
  scenarios: z.lazy(() => ScenarioListRelationFilterSchema).optional(),
  tests: z.lazy(() => TestListRelationFilterSchema).optional(),
  calls: z.lazy(() => CallListRelationFilterSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationListRelationFilterSchema).optional()
}).strict();

export const AgentOrderByWithRelationInputSchema: z.ZodType<Prisma.AgentOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  customerAgentId: z.lazy(() => SortOrderSchema).optional(),
  githubRepoUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  systemPrompt: z.lazy(() => SortOrderSchema).optional(),
  extraProperties: z.lazy(() => SortOrderSchema).optional(),
  enableSlackNotifications: z.lazy(() => SortOrderSchema).optional(),
  enabledTestAgents: z.lazy(() => TestAgentOrderByRelationAggregateInputSchema).optional(),
  scenarios: z.lazy(() => ScenarioOrderByRelationAggregateInputSchema).optional(),
  tests: z.lazy(() => TestOrderByRelationAggregateInputSchema).optional(),
  calls: z.lazy(() => CallOrderByRelationAggregateInputSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationOrderByRelationAggregateInputSchema).optional()
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
  ownerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  phoneNumber: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  customerAgentId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  githubRepoUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  systemPrompt: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  extraProperties: z.lazy(() => JsonFilterSchema).optional(),
  enableSlackNotifications: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  enabledTestAgents: z.lazy(() => TestAgentListRelationFilterSchema).optional(),
  scenarios: z.lazy(() => ScenarioListRelationFilterSchema).optional(),
  tests: z.lazy(() => TestListRelationFilterSchema).optional(),
  calls: z.lazy(() => CallListRelationFilterSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationListRelationFilterSchema).optional()
}).strict());

export const AgentOrderByWithAggregationInputSchema: z.ZodType<Prisma.AgentOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  customerAgentId: z.lazy(() => SortOrderSchema).optional(),
  githubRepoUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  systemPrompt: z.lazy(() => SortOrderSchema).optional(),
  extraProperties: z.lazy(() => SortOrderSchema).optional(),
  enableSlackNotifications: z.lazy(() => SortOrderSchema).optional(),
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
  ownerId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  phoneNumber: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  customerAgentId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  githubRepoUrl: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  systemPrompt: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  extraProperties: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  enableSlackNotifications: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
}).strict();

export const TestWhereInputSchema: z.ZodType<Prisma.TestWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TestWhereInputSchema),z.lazy(() => TestWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TestWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TestWhereInputSchema),z.lazy(() => TestWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  agentId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  gitBranch: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  gitCommit: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  runFromApi: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  agent: z.union([ z.lazy(() => AgentRelationFilterSchema),z.lazy(() => AgentWhereInputSchema) ]).optional(),
  calls: z.lazy(() => CallListRelationFilterSchema).optional()
}).strict();

export const TestOrderByWithRelationInputSchema: z.ZodType<Prisma.TestOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  agentId: z.lazy(() => SortOrderSchema).optional(),
  gitBranch: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  gitCommit: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  runFromApi: z.lazy(() => SortOrderSchema).optional(),
  agent: z.lazy(() => AgentOrderByWithRelationInputSchema).optional(),
  calls: z.lazy(() => CallOrderByRelationAggregateInputSchema).optional()
}).strict();

export const TestWhereUniqueInputSchema: z.ZodType<Prisma.TestWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => TestWhereInputSchema),z.lazy(() => TestWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TestWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TestWhereInputSchema),z.lazy(() => TestWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  agentId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  gitBranch: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  gitCommit: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  runFromApi: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  agent: z.union([ z.lazy(() => AgentRelationFilterSchema),z.lazy(() => AgentWhereInputSchema) ]).optional(),
  calls: z.lazy(() => CallListRelationFilterSchema).optional()
}).strict());

export const TestOrderByWithAggregationInputSchema: z.ZodType<Prisma.TestOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  agentId: z.lazy(() => SortOrderSchema).optional(),
  gitBranch: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  gitCommit: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  runFromApi: z.lazy(() => SortOrderSchema).optional(),
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
  gitBranch: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  gitCommit: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  runFromApi: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
}).strict();

export const TestAgentWhereInputSchema: z.ZodType<Prisma.TestAgentWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TestAgentWhereInputSchema),z.lazy(() => TestAgentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TestAgentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TestAgentWhereInputSchema),z.lazy(() => TestAgentWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  headshotUrl: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  prompt: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  enabled: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  defaultSelected: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  order: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  agents: z.lazy(() => AgentListRelationFilterSchema).optional(),
  calls: z.lazy(() => CallListRelationFilterSchema).optional()
}).strict();

export const TestAgentOrderByWithRelationInputSchema: z.ZodType<Prisma.TestAgentOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  headshotUrl: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  prompt: z.lazy(() => SortOrderSchema).optional(),
  enabled: z.lazy(() => SortOrderSchema).optional(),
  defaultSelected: z.lazy(() => SortOrderSchema).optional(),
  order: z.lazy(() => SortOrderSchema).optional(),
  agents: z.lazy(() => AgentOrderByRelationAggregateInputSchema).optional(),
  calls: z.lazy(() => CallOrderByRelationAggregateInputSchema).optional()
}).strict();

export const TestAgentWhereUniqueInputSchema: z.ZodType<Prisma.TestAgentWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => TestAgentWhereInputSchema),z.lazy(() => TestAgentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TestAgentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TestAgentWhereInputSchema),z.lazy(() => TestAgentWhereInputSchema).array() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  headshotUrl: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  prompt: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  enabled: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  defaultSelected: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  order: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  agents: z.lazy(() => AgentListRelationFilterSchema).optional(),
  calls: z.lazy(() => CallListRelationFilterSchema).optional()
}).strict());

export const TestAgentOrderByWithAggregationInputSchema: z.ZodType<Prisma.TestAgentOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  headshotUrl: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  prompt: z.lazy(() => SortOrderSchema).optional(),
  enabled: z.lazy(() => SortOrderSchema).optional(),
  defaultSelected: z.lazy(() => SortOrderSchema).optional(),
  order: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => TestAgentCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => TestAgentAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => TestAgentMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => TestAgentMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => TestAgentSumOrderByAggregateInputSchema).optional()
}).strict();

export const TestAgentScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.TestAgentScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => TestAgentScalarWhereWithAggregatesInputSchema),z.lazy(() => TestAgentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => TestAgentScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TestAgentScalarWhereWithAggregatesInputSchema),z.lazy(() => TestAgentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  headshotUrl: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  prompt: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  enabled: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  defaultSelected: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  order: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const CallWhereInputSchema: z.ZodType<Prisma.CallWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CallWhereInputSchema),z.lazy(() => CallWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CallWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CallWhereInputSchema),z.lazy(() => CallWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  deleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  vapiCallId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  customerCallId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  ofOneDeviceId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  status: z.union([ z.lazy(() => EnumCallStatusFilterSchema),z.lazy(() => CallStatusSchema) ]).optional(),
  result: z.union([ z.lazy(() => EnumCallResultNullableFilterSchema),z.lazy(() => CallResultSchema) ]).optional().nullable(),
  failureReason: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  monoRecordingUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  startedAt: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  endedAt: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  regionId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  metadata: z.lazy(() => JsonNullableFilterSchema).optional(),
  latencyP50: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  latencyP90: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  latencyP95: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  interruptionP50: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  interruptionP90: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  interruptionP95: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  numInterruptions: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  duration: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  isRead: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  readBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  agentId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  testId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  testAgentId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  scenarioId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  evalSetToSuccess: z.lazy(() => JsonFilterSchema).optional(),
  agent: z.union([ z.lazy(() => AgentNullableRelationFilterSchema),z.lazy(() => AgentWhereInputSchema) ]).optional().nullable(),
  test: z.union([ z.lazy(() => TestNullableRelationFilterSchema),z.lazy(() => TestWhereInputSchema) ]).optional().nullable(),
  testAgent: z.union([ z.lazy(() => TestAgentNullableRelationFilterSchema),z.lazy(() => TestAgentWhereInputSchema) ]).optional().nullable(),
  scenario: z.union([ z.lazy(() => ScenarioNullableRelationFilterSchema),z.lazy(() => ScenarioWhereInputSchema) ]).optional().nullable(),
  evaluationResults: z.lazy(() => EvaluationResultListRelationFilterSchema).optional(),
  messages: z.lazy(() => MessageListRelationFilterSchema).optional(),
  latencyBlocks: z.lazy(() => LatencyBlockListRelationFilterSchema).optional(),
  interruptions: z.lazy(() => InterruptionListRelationFilterSchema).optional(),
  errors: z.lazy(() => CallErrorListRelationFilterSchema).optional()
}).strict();

export const CallOrderByWithRelationInputSchema: z.ZodType<Prisma.CallOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional(),
  vapiCallId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  customerCallId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  ofOneDeviceId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  result: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  failureReason: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  stereoRecordingUrl: z.lazy(() => SortOrderSchema).optional(),
  monoRecordingUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  startedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  endedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  regionId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  metadata: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  latencyP50: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  latencyP90: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  latencyP95: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  interruptionP50: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  interruptionP90: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  interruptionP95: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  numInterruptions: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  duration: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  isRead: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  readBy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  agentId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  testId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  testAgentId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  scenarioId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  evalSetToSuccess: z.lazy(() => SortOrderSchema).optional(),
  agent: z.lazy(() => AgentOrderByWithRelationInputSchema).optional(),
  test: z.lazy(() => TestOrderByWithRelationInputSchema).optional(),
  testAgent: z.lazy(() => TestAgentOrderByWithRelationInputSchema).optional(),
  scenario: z.lazy(() => ScenarioOrderByWithRelationInputSchema).optional(),
  evaluationResults: z.lazy(() => EvaluationResultOrderByRelationAggregateInputSchema).optional(),
  messages: z.lazy(() => MessageOrderByRelationAggregateInputSchema).optional(),
  latencyBlocks: z.lazy(() => LatencyBlockOrderByRelationAggregateInputSchema).optional(),
  interruptions: z.lazy(() => InterruptionOrderByRelationAggregateInputSchema).optional(),
  errors: z.lazy(() => CallErrorOrderByRelationAggregateInputSchema).optional()
}).strict();

export const CallWhereUniqueInputSchema: z.ZodType<Prisma.CallWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => CallWhereInputSchema),z.lazy(() => CallWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CallWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CallWhereInputSchema),z.lazy(() => CallWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  deleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  vapiCallId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  customerCallId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  ofOneDeviceId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  status: z.union([ z.lazy(() => EnumCallStatusFilterSchema),z.lazy(() => CallStatusSchema) ]).optional(),
  result: z.union([ z.lazy(() => EnumCallResultNullableFilterSchema),z.lazy(() => CallResultSchema) ]).optional().nullable(),
  failureReason: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  monoRecordingUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  startedAt: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  endedAt: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  regionId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  metadata: z.lazy(() => JsonNullableFilterSchema).optional(),
  latencyP50: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  latencyP90: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  latencyP95: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  interruptionP50: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  interruptionP90: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  interruptionP95: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  numInterruptions: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  duration: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  isRead: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  readBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  agentId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  testId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  testAgentId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  scenarioId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  evalSetToSuccess: z.lazy(() => JsonFilterSchema).optional(),
  agent: z.union([ z.lazy(() => AgentNullableRelationFilterSchema),z.lazy(() => AgentWhereInputSchema) ]).optional().nullable(),
  test: z.union([ z.lazy(() => TestNullableRelationFilterSchema),z.lazy(() => TestWhereInputSchema) ]).optional().nullable(),
  testAgent: z.union([ z.lazy(() => TestAgentNullableRelationFilterSchema),z.lazy(() => TestAgentWhereInputSchema) ]).optional().nullable(),
  scenario: z.union([ z.lazy(() => ScenarioNullableRelationFilterSchema),z.lazy(() => ScenarioWhereInputSchema) ]).optional().nullable(),
  evaluationResults: z.lazy(() => EvaluationResultListRelationFilterSchema).optional(),
  messages: z.lazy(() => MessageListRelationFilterSchema).optional(),
  latencyBlocks: z.lazy(() => LatencyBlockListRelationFilterSchema).optional(),
  interruptions: z.lazy(() => InterruptionListRelationFilterSchema).optional(),
  errors: z.lazy(() => CallErrorListRelationFilterSchema).optional()
}).strict());

export const CallOrderByWithAggregationInputSchema: z.ZodType<Prisma.CallOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional(),
  vapiCallId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  customerCallId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  ofOneDeviceId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  result: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  failureReason: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  stereoRecordingUrl: z.lazy(() => SortOrderSchema).optional(),
  monoRecordingUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  startedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  endedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  regionId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  metadata: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  latencyP50: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  latencyP90: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  latencyP95: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  interruptionP50: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  interruptionP90: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  interruptionP95: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  numInterruptions: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  duration: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  isRead: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  readBy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  agentId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  testId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  testAgentId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  scenarioId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  evalSetToSuccess: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CallCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => CallAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CallMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CallMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => CallSumOrderByAggregateInputSchema).optional()
}).strict();

export const CallScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CallScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => CallScalarWhereWithAggregatesInputSchema),z.lazy(() => CallScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CallScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CallScalarWhereWithAggregatesInputSchema),z.lazy(() => CallScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  deleted: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  vapiCallId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  customerCallId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  ofOneDeviceId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  status: z.union([ z.lazy(() => EnumCallStatusWithAggregatesFilterSchema),z.lazy(() => CallStatusSchema) ]).optional(),
  result: z.union([ z.lazy(() => EnumCallResultNullableWithAggregatesFilterSchema),z.lazy(() => CallResultSchema) ]).optional().nullable(),
  failureReason: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  monoRecordingUrl: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  startedAt: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  endedAt: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  regionId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  metadata: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  latencyP50: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  latencyP90: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  latencyP95: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  interruptionP50: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  interruptionP90: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  interruptionP95: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  numInterruptions: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  duration: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  isRead: z.union([ z.lazy(() => BoolNullableWithAggregatesFilterSchema),z.boolean() ]).optional().nullable(),
  readBy: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  agentId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  testId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  testAgentId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  scenarioId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  evalSetToSuccess: z.lazy(() => JsonWithAggregatesFilterSchema).optional()
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
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  result: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  toolCalls: z.lazy(() => JsonFilterSchema).optional(),
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
  name: z.lazy(() => SortOrderSchema).optional(),
  result: z.lazy(() => SortOrderSchema).optional(),
  toolCalls: z.lazy(() => SortOrderSchema).optional(),
  callId: z.lazy(() => SortOrderSchema).optional(),
  call: z.lazy(() => CallOrderByWithRelationInputSchema).optional()
}).strict();

export const MessageWhereUniqueInputSchema: z.ZodType<Prisma.MessageWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => MessageWhereInputSchema),z.lazy(() => MessageWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MessageWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MessageWhereInputSchema),z.lazy(() => MessageWhereInputSchema).array() ]).optional(),
  role: z.union([ z.lazy(() => EnumRoleFilterSchema),z.lazy(() => RoleSchema) ]).optional(),
  message: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  time: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  endTime: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  secondsFromStart: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  duration: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  result: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  toolCalls: z.lazy(() => JsonFilterSchema).optional(),
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
  name: z.lazy(() => SortOrderSchema).optional(),
  result: z.lazy(() => SortOrderSchema).optional(),
  toolCalls: z.lazy(() => SortOrderSchema).optional(),
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
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  result: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  toolCalls: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  callId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const CallErrorWhereInputSchema: z.ZodType<Prisma.CallErrorWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CallErrorWhereInputSchema),z.lazy(() => CallErrorWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CallErrorWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CallErrorWhereInputSchema),z.lazy(() => CallErrorWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  secondsFromStart: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  duration: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  type: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  callId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  call: z.union([ z.lazy(() => CallRelationFilterSchema),z.lazy(() => CallWhereInputSchema) ]).optional(),
}).strict();

export const CallErrorOrderByWithRelationInputSchema: z.ZodType<Prisma.CallErrorOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  secondsFromStart: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional(),
  type: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  callId: z.lazy(() => SortOrderSchema).optional(),
  call: z.lazy(() => CallOrderByWithRelationInputSchema).optional()
}).strict();

export const CallErrorWhereUniqueInputSchema: z.ZodType<Prisma.CallErrorWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => CallErrorWhereInputSchema),z.lazy(() => CallErrorWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CallErrorWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CallErrorWhereInputSchema),z.lazy(() => CallErrorWhereInputSchema).array() ]).optional(),
  secondsFromStart: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  duration: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  type: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  callId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  call: z.union([ z.lazy(() => CallRelationFilterSchema),z.lazy(() => CallWhereInputSchema) ]).optional(),
}).strict());

export const CallErrorOrderByWithAggregationInputSchema: z.ZodType<Prisma.CallErrorOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  secondsFromStart: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional(),
  type: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
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
  type: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  description: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  callId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const CallRecordingWhereInputSchema: z.ZodType<Prisma.CallRecordingWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CallRecordingWhereInputSchema),z.lazy(() => CallRecordingWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CallRecordingWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CallRecordingWhereInputSchema),z.lazy(() => CallRecordingWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  audioUrl: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  processed: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  agentId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  regionId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  duration: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
}).strict();

export const CallRecordingOrderByWithRelationInputSchema: z.ZodType<Prisma.CallRecordingOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  audioUrl: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  processed: z.lazy(() => SortOrderSchema).optional(),
  agentId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  regionId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  duration: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
}).strict();

export const CallRecordingWhereUniqueInputSchema: z.ZodType<Prisma.CallRecordingWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => CallRecordingWhereInputSchema),z.lazy(() => CallRecordingWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CallRecordingWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CallRecordingWhereInputSchema),z.lazy(() => CallRecordingWhereInputSchema).array() ]).optional(),
  audioUrl: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  processed: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  agentId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  regionId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  duration: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
}).strict());

export const CallRecordingOrderByWithAggregationInputSchema: z.ZodType<Prisma.CallRecordingOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  audioUrl: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  processed: z.lazy(() => SortOrderSchema).optional(),
  agentId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  regionId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  duration: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => CallRecordingCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => CallRecordingAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CallRecordingMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CallRecordingMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => CallRecordingSumOrderByAggregateInputSchema).optional()
}).strict();

export const CallRecordingScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CallRecordingScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => CallRecordingScalarWhereWithAggregatesInputSchema),z.lazy(() => CallRecordingScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CallRecordingScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CallRecordingScalarWhereWithAggregatesInputSchema),z.lazy(() => CallRecordingScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  audioUrl: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  processed: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  agentId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  regionId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  duration: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
}).strict();

export const ScenarioWhereInputSchema: z.ZodType<Prisma.ScenarioWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ScenarioWhereInputSchema),z.lazy(() => ScenarioWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ScenarioWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ScenarioWhereInputSchema),z.lazy(() => ScenarioWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  agentId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  instructions: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  successCriteria: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  includeDateTime: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  timezone: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  deleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  agent: z.union([ z.lazy(() => AgentRelationFilterSchema),z.lazy(() => AgentWhereInputSchema) ]).optional(),
  calls: z.lazy(() => CallListRelationFilterSchema).optional(),
  evaluations: z.lazy(() => EvaluationListRelationFilterSchema).optional()
}).strict();

export const ScenarioOrderByWithRelationInputSchema: z.ZodType<Prisma.ScenarioOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  agentId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  instructions: z.lazy(() => SortOrderSchema).optional(),
  successCriteria: z.lazy(() => SortOrderSchema).optional(),
  includeDateTime: z.lazy(() => SortOrderSchema).optional(),
  timezone: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional(),
  agent: z.lazy(() => AgentOrderByWithRelationInputSchema).optional(),
  calls: z.lazy(() => CallOrderByRelationAggregateInputSchema).optional(),
  evaluations: z.lazy(() => EvaluationOrderByRelationAggregateInputSchema).optional()
}).strict();

export const ScenarioWhereUniqueInputSchema: z.ZodType<Prisma.ScenarioWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => ScenarioWhereInputSchema),z.lazy(() => ScenarioWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ScenarioWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ScenarioWhereInputSchema),z.lazy(() => ScenarioWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  agentId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  instructions: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  successCriteria: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  includeDateTime: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  timezone: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  deleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  agent: z.union([ z.lazy(() => AgentRelationFilterSchema),z.lazy(() => AgentWhereInputSchema) ]).optional(),
  calls: z.lazy(() => CallListRelationFilterSchema).optional(),
  evaluations: z.lazy(() => EvaluationListRelationFilterSchema).optional()
}).strict());

export const ScenarioOrderByWithAggregationInputSchema: z.ZodType<Prisma.ScenarioOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  agentId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  instructions: z.lazy(() => SortOrderSchema).optional(),
  successCriteria: z.lazy(() => SortOrderSchema).optional(),
  includeDateTime: z.lazy(() => SortOrderSchema).optional(),
  timezone: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ScenarioCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ScenarioMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ScenarioMinOrderByAggregateInputSchema).optional()
}).strict();

export const ScenarioScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ScenarioScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ScenarioScalarWhereWithAggregatesInputSchema),z.lazy(() => ScenarioScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ScenarioScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ScenarioScalarWhereWithAggregatesInputSchema),z.lazy(() => ScenarioScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  agentId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  instructions: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  successCriteria: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  includeDateTime: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  timezone: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  deleted: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
}).strict();

export const EvaluationTemplateWhereInputSchema: z.ZodType<Prisma.EvaluationTemplateWhereInput> = z.object({
  AND: z.union([ z.lazy(() => EvaluationTemplateWhereInputSchema),z.lazy(() => EvaluationTemplateWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvaluationTemplateWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvaluationTemplateWhereInputSchema),z.lazy(() => EvaluationTemplateWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  params: z.lazy(() => StringNullableListFilterSchema).optional(),
  type: z.union([ z.lazy(() => EnumEvalTypeFilterSchema),z.lazy(() => EvalTypeSchema) ]).optional(),
  resultType: z.union([ z.lazy(() => EnumEvalResultTypeFilterSchema),z.lazy(() => EvalResultTypeSchema) ]).optional(),
  contentType: z.union([ z.lazy(() => EnumEvalContentTypeFilterSchema),z.lazy(() => EvalContentTypeSchema) ]).optional(),
  toolCallExpectedResult: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  deleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  evaluationResults: z.lazy(() => EvaluationResultListRelationFilterSchema).optional(),
  evaluations: z.lazy(() => EvaluationListRelationFilterSchema).optional()
}).strict();

export const EvaluationTemplateOrderByWithRelationInputSchema: z.ZodType<Prisma.EvaluationTemplateOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  params: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  resultType: z.lazy(() => SortOrderSchema).optional(),
  contentType: z.lazy(() => SortOrderSchema).optional(),
  toolCallExpectedResult: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional(),
  evaluationResults: z.lazy(() => EvaluationResultOrderByRelationAggregateInputSchema).optional(),
  evaluations: z.lazy(() => EvaluationOrderByRelationAggregateInputSchema).optional()
}).strict();

export const EvaluationTemplateWhereUniqueInputSchema: z.ZodType<Prisma.EvaluationTemplateWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => EvaluationTemplateWhereInputSchema),z.lazy(() => EvaluationTemplateWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvaluationTemplateWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvaluationTemplateWhereInputSchema),z.lazy(() => EvaluationTemplateWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  params: z.lazy(() => StringNullableListFilterSchema).optional(),
  type: z.union([ z.lazy(() => EnumEvalTypeFilterSchema),z.lazy(() => EvalTypeSchema) ]).optional(),
  resultType: z.union([ z.lazy(() => EnumEvalResultTypeFilterSchema),z.lazy(() => EvalResultTypeSchema) ]).optional(),
  contentType: z.union([ z.lazy(() => EnumEvalContentTypeFilterSchema),z.lazy(() => EvalContentTypeSchema) ]).optional(),
  toolCallExpectedResult: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  deleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  evaluationResults: z.lazy(() => EvaluationResultListRelationFilterSchema).optional(),
  evaluations: z.lazy(() => EvaluationListRelationFilterSchema).optional()
}).strict());

export const EvaluationTemplateOrderByWithAggregationInputSchema: z.ZodType<Prisma.EvaluationTemplateOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  params: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  resultType: z.lazy(() => SortOrderSchema).optional(),
  contentType: z.lazy(() => SortOrderSchema).optional(),
  toolCallExpectedResult: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => EvaluationTemplateCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => EvaluationTemplateMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => EvaluationTemplateMinOrderByAggregateInputSchema).optional()
}).strict();

export const EvaluationTemplateScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.EvaluationTemplateScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => EvaluationTemplateScalarWhereWithAggregatesInputSchema),z.lazy(() => EvaluationTemplateScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvaluationTemplateScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvaluationTemplateScalarWhereWithAggregatesInputSchema),z.lazy(() => EvaluationTemplateScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  params: z.lazy(() => StringNullableListFilterSchema).optional(),
  type: z.union([ z.lazy(() => EnumEvalTypeWithAggregatesFilterSchema),z.lazy(() => EvalTypeSchema) ]).optional(),
  resultType: z.union([ z.lazy(() => EnumEvalResultTypeWithAggregatesFilterSchema),z.lazy(() => EvalResultTypeSchema) ]).optional(),
  contentType: z.union([ z.lazy(() => EnumEvalContentTypeWithAggregatesFilterSchema),z.lazy(() => EvalContentTypeSchema) ]).optional(),
  toolCallExpectedResult: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  deleted: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
}).strict();

export const GeneralEvaluationWhereInputSchema: z.ZodType<Prisma.GeneralEvaluationWhereInput> = z.object({
  AND: z.union([ z.lazy(() => GeneralEvaluationWhereInputSchema),z.lazy(() => GeneralEvaluationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => GeneralEvaluationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => GeneralEvaluationWhereInputSchema),z.lazy(() => GeneralEvaluationWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  agentId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  evaluationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  agent: z.union([ z.lazy(() => AgentRelationFilterSchema),z.lazy(() => AgentWhereInputSchema) ]).optional(),
  evaluation: z.union([ z.lazy(() => EvaluationRelationFilterSchema),z.lazy(() => EvaluationWhereInputSchema) ]).optional(),
}).strict();

export const GeneralEvaluationOrderByWithRelationInputSchema: z.ZodType<Prisma.GeneralEvaluationOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  agentId: z.lazy(() => SortOrderSchema).optional(),
  evaluationId: z.lazy(() => SortOrderSchema).optional(),
  agent: z.lazy(() => AgentOrderByWithRelationInputSchema).optional(),
  evaluation: z.lazy(() => EvaluationOrderByWithRelationInputSchema).optional()
}).strict();

export const GeneralEvaluationWhereUniqueInputSchema: z.ZodType<Prisma.GeneralEvaluationWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => GeneralEvaluationWhereInputSchema),z.lazy(() => GeneralEvaluationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => GeneralEvaluationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => GeneralEvaluationWhereInputSchema),z.lazy(() => GeneralEvaluationWhereInputSchema).array() ]).optional(),
  agentId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  evaluationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  agent: z.union([ z.lazy(() => AgentRelationFilterSchema),z.lazy(() => AgentWhereInputSchema) ]).optional(),
  evaluation: z.union([ z.lazy(() => EvaluationRelationFilterSchema),z.lazy(() => EvaluationWhereInputSchema) ]).optional(),
}).strict());

export const GeneralEvaluationOrderByWithAggregationInputSchema: z.ZodType<Prisma.GeneralEvaluationOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  agentId: z.lazy(() => SortOrderSchema).optional(),
  evaluationId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => GeneralEvaluationCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => GeneralEvaluationMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => GeneralEvaluationMinOrderByAggregateInputSchema).optional()
}).strict();

export const GeneralEvaluationScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.GeneralEvaluationScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => GeneralEvaluationScalarWhereWithAggregatesInputSchema),z.lazy(() => GeneralEvaluationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => GeneralEvaluationScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => GeneralEvaluationScalarWhereWithAggregatesInputSchema),z.lazy(() => GeneralEvaluationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  agentId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  evaluationId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const EvaluationWhereInputSchema: z.ZodType<Prisma.EvaluationWhereInput> = z.object({
  AND: z.union([ z.lazy(() => EvaluationWhereInputSchema),z.lazy(() => EvaluationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvaluationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvaluationWhereInputSchema),z.lazy(() => EvaluationWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  enabled: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  isCritical: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  params: z.lazy(() => JsonFilterSchema).optional(),
  evaluationTemplateId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  scenarioId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  evaluationGroupId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  evaluationTemplate: z.union([ z.lazy(() => EvaluationTemplateRelationFilterSchema),z.lazy(() => EvaluationTemplateWhereInputSchema) ]).optional(),
  scenario: z.union([ z.lazy(() => ScenarioNullableRelationFilterSchema),z.lazy(() => ScenarioWhereInputSchema) ]).optional().nullable(),
  evaluationGroup: z.union([ z.lazy(() => EvaluationGroupNullableRelationFilterSchema),z.lazy(() => EvaluationGroupWhereInputSchema) ]).optional().nullable(),
  evaluationResults: z.lazy(() => EvaluationResultListRelationFilterSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationListRelationFilterSchema).optional()
}).strict();

export const EvaluationOrderByWithRelationInputSchema: z.ZodType<Prisma.EvaluationOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  enabled: z.lazy(() => SortOrderSchema).optional(),
  isCritical: z.lazy(() => SortOrderSchema).optional(),
  params: z.lazy(() => SortOrderSchema).optional(),
  evaluationTemplateId: z.lazy(() => SortOrderSchema).optional(),
  scenarioId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  evaluationGroupId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  evaluationTemplate: z.lazy(() => EvaluationTemplateOrderByWithRelationInputSchema).optional(),
  scenario: z.lazy(() => ScenarioOrderByWithRelationInputSchema).optional(),
  evaluationGroup: z.lazy(() => EvaluationGroupOrderByWithRelationInputSchema).optional(),
  evaluationResults: z.lazy(() => EvaluationResultOrderByRelationAggregateInputSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationOrderByRelationAggregateInputSchema).optional()
}).strict();

export const EvaluationWhereUniqueInputSchema: z.ZodType<Prisma.EvaluationWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => EvaluationWhereInputSchema),z.lazy(() => EvaluationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvaluationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvaluationWhereInputSchema),z.lazy(() => EvaluationWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  enabled: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  isCritical: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  params: z.lazy(() => JsonFilterSchema).optional(),
  evaluationTemplateId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  scenarioId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  evaluationGroupId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  evaluationTemplate: z.union([ z.lazy(() => EvaluationTemplateRelationFilterSchema),z.lazy(() => EvaluationTemplateWhereInputSchema) ]).optional(),
  scenario: z.union([ z.lazy(() => ScenarioNullableRelationFilterSchema),z.lazy(() => ScenarioWhereInputSchema) ]).optional().nullable(),
  evaluationGroup: z.union([ z.lazy(() => EvaluationGroupNullableRelationFilterSchema),z.lazy(() => EvaluationGroupWhereInputSchema) ]).optional().nullable(),
  evaluationResults: z.lazy(() => EvaluationResultListRelationFilterSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationListRelationFilterSchema).optional()
}).strict());

export const EvaluationOrderByWithAggregationInputSchema: z.ZodType<Prisma.EvaluationOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  enabled: z.lazy(() => SortOrderSchema).optional(),
  isCritical: z.lazy(() => SortOrderSchema).optional(),
  params: z.lazy(() => SortOrderSchema).optional(),
  evaluationTemplateId: z.lazy(() => SortOrderSchema).optional(),
  scenarioId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  evaluationGroupId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => EvaluationCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => EvaluationMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => EvaluationMinOrderByAggregateInputSchema).optional()
}).strict();

export const EvaluationScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.EvaluationScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => EvaluationScalarWhereWithAggregatesInputSchema),z.lazy(() => EvaluationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvaluationScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvaluationScalarWhereWithAggregatesInputSchema),z.lazy(() => EvaluationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  enabled: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  isCritical: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  params: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  evaluationTemplateId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  scenarioId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  evaluationGroupId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const EvaluationResultWhereInputSchema: z.ZodType<Prisma.EvaluationResultWhereInput> = z.object({
  AND: z.union([ z.lazy(() => EvaluationResultWhereInputSchema),z.lazy(() => EvaluationResultWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvaluationResultWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvaluationResultWhereInputSchema),z.lazy(() => EvaluationResultWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  callId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  evaluationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  result: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  success: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  secondsFromStart: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  duration: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  type: z.union([ z.lazy(() => EnumEvalResultTypeFilterSchema),z.lazy(() => EvalResultTypeSchema) ]).optional(),
  details: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  evaluationTemplateId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  call: z.union([ z.lazy(() => CallNullableRelationFilterSchema),z.lazy(() => CallWhereInputSchema) ]).optional().nullable(),
  evaluation: z.union([ z.lazy(() => EvaluationRelationFilterSchema),z.lazy(() => EvaluationWhereInputSchema) ]).optional(),
  evaluationTemplate: z.union([ z.lazy(() => EvaluationTemplateNullableRelationFilterSchema),z.lazy(() => EvaluationTemplateWhereInputSchema) ]).optional().nullable(),
}).strict();

export const EvaluationResultOrderByWithRelationInputSchema: z.ZodType<Prisma.EvaluationResultOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  callId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  evaluationId: z.lazy(() => SortOrderSchema).optional(),
  result: z.lazy(() => SortOrderSchema).optional(),
  success: z.lazy(() => SortOrderSchema).optional(),
  secondsFromStart: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  duration: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  details: z.lazy(() => SortOrderSchema).optional(),
  evaluationTemplateId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  call: z.lazy(() => CallOrderByWithRelationInputSchema).optional(),
  evaluation: z.lazy(() => EvaluationOrderByWithRelationInputSchema).optional(),
  evaluationTemplate: z.lazy(() => EvaluationTemplateOrderByWithRelationInputSchema).optional()
}).strict();

export const EvaluationResultWhereUniqueInputSchema: z.ZodType<Prisma.EvaluationResultWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => EvaluationResultWhereInputSchema),z.lazy(() => EvaluationResultWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvaluationResultWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvaluationResultWhereInputSchema),z.lazy(() => EvaluationResultWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  callId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  evaluationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  result: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  success: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  secondsFromStart: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  duration: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  type: z.union([ z.lazy(() => EnumEvalResultTypeFilterSchema),z.lazy(() => EvalResultTypeSchema) ]).optional(),
  details: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  evaluationTemplateId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  call: z.union([ z.lazy(() => CallNullableRelationFilterSchema),z.lazy(() => CallWhereInputSchema) ]).optional().nullable(),
  evaluation: z.union([ z.lazy(() => EvaluationRelationFilterSchema),z.lazy(() => EvaluationWhereInputSchema) ]).optional(),
  evaluationTemplate: z.union([ z.lazy(() => EvaluationTemplateNullableRelationFilterSchema),z.lazy(() => EvaluationTemplateWhereInputSchema) ]).optional().nullable(),
}).strict());

export const EvaluationResultOrderByWithAggregationInputSchema: z.ZodType<Prisma.EvaluationResultOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  callId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  evaluationId: z.lazy(() => SortOrderSchema).optional(),
  result: z.lazy(() => SortOrderSchema).optional(),
  success: z.lazy(() => SortOrderSchema).optional(),
  secondsFromStart: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  duration: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  details: z.lazy(() => SortOrderSchema).optional(),
  evaluationTemplateId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => EvaluationResultCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => EvaluationResultAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => EvaluationResultMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => EvaluationResultMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => EvaluationResultSumOrderByAggregateInputSchema).optional()
}).strict();

export const EvaluationResultScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.EvaluationResultScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => EvaluationResultScalarWhereWithAggregatesInputSchema),z.lazy(() => EvaluationResultScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvaluationResultScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvaluationResultScalarWhereWithAggregatesInputSchema),z.lazy(() => EvaluationResultScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  callId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  evaluationId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  result: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  success: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  secondsFromStart: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  duration: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  type: z.union([ z.lazy(() => EnumEvalResultTypeWithAggregatesFilterSchema),z.lazy(() => EvalResultTypeSchema) ]).optional(),
  details: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  evaluationTemplateId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const LatencyBlockWhereInputSchema: z.ZodType<Prisma.LatencyBlockWhereInput> = z.object({
  AND: z.union([ z.lazy(() => LatencyBlockWhereInputSchema),z.lazy(() => LatencyBlockWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LatencyBlockWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LatencyBlockWhereInputSchema),z.lazy(() => LatencyBlockWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  secondsFromStart: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  duration: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  callId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  call: z.union([ z.lazy(() => CallRelationFilterSchema),z.lazy(() => CallWhereInputSchema) ]).optional(),
}).strict();

export const LatencyBlockOrderByWithRelationInputSchema: z.ZodType<Prisma.LatencyBlockOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  secondsFromStart: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional(),
  callId: z.lazy(() => SortOrderSchema).optional(),
  call: z.lazy(() => CallOrderByWithRelationInputSchema).optional()
}).strict();

export const LatencyBlockWhereUniqueInputSchema: z.ZodType<Prisma.LatencyBlockWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => LatencyBlockWhereInputSchema),z.lazy(() => LatencyBlockWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LatencyBlockWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LatencyBlockWhereInputSchema),z.lazy(() => LatencyBlockWhereInputSchema).array() ]).optional(),
  secondsFromStart: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  duration: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  callId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  call: z.union([ z.lazy(() => CallRelationFilterSchema),z.lazy(() => CallWhereInputSchema) ]).optional(),
}).strict());

export const LatencyBlockOrderByWithAggregationInputSchema: z.ZodType<Prisma.LatencyBlockOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  secondsFromStart: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional(),
  callId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => LatencyBlockCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => LatencyBlockAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => LatencyBlockMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => LatencyBlockMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => LatencyBlockSumOrderByAggregateInputSchema).optional()
}).strict();

export const LatencyBlockScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.LatencyBlockScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => LatencyBlockScalarWhereWithAggregatesInputSchema),z.lazy(() => LatencyBlockScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => LatencyBlockScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LatencyBlockScalarWhereWithAggregatesInputSchema),z.lazy(() => LatencyBlockScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  secondsFromStart: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  duration: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  callId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const InterruptionWhereInputSchema: z.ZodType<Prisma.InterruptionWhereInput> = z.object({
  AND: z.union([ z.lazy(() => InterruptionWhereInputSchema),z.lazy(() => InterruptionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => InterruptionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => InterruptionWhereInputSchema),z.lazy(() => InterruptionWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  secondsFromStart: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  duration: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  callId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  text: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  call: z.union([ z.lazy(() => CallRelationFilterSchema),z.lazy(() => CallWhereInputSchema) ]).optional(),
}).strict();

export const InterruptionOrderByWithRelationInputSchema: z.ZodType<Prisma.InterruptionOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  secondsFromStart: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional(),
  callId: z.lazy(() => SortOrderSchema).optional(),
  text: z.lazy(() => SortOrderSchema).optional(),
  call: z.lazy(() => CallOrderByWithRelationInputSchema).optional()
}).strict();

export const InterruptionWhereUniqueInputSchema: z.ZodType<Prisma.InterruptionWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => InterruptionWhereInputSchema),z.lazy(() => InterruptionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => InterruptionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => InterruptionWhereInputSchema),z.lazy(() => InterruptionWhereInputSchema).array() ]).optional(),
  secondsFromStart: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  duration: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  callId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  text: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  call: z.union([ z.lazy(() => CallRelationFilterSchema),z.lazy(() => CallWhereInputSchema) ]).optional(),
}).strict());

export const InterruptionOrderByWithAggregationInputSchema: z.ZodType<Prisma.InterruptionOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  secondsFromStart: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional(),
  callId: z.lazy(() => SortOrderSchema).optional(),
  text: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => InterruptionCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => InterruptionAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => InterruptionMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => InterruptionMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => InterruptionSumOrderByAggregateInputSchema).optional()
}).strict();

export const InterruptionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.InterruptionScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => InterruptionScalarWhereWithAggregatesInputSchema),z.lazy(() => InterruptionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => InterruptionScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => InterruptionScalarWhereWithAggregatesInputSchema),z.lazy(() => InterruptionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  secondsFromStart: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  duration: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  callId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  text: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const EvaluationGroupWhereInputSchema: z.ZodType<Prisma.EvaluationGroupWhereInput> = z.object({
  AND: z.union([ z.lazy(() => EvaluationGroupWhereInputSchema),z.lazy(() => EvaluationGroupWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvaluationGroupWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvaluationGroupWhereInputSchema),z.lazy(() => EvaluationGroupWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  condition: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  enabled: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  savedSearchId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  evaluations: z.lazy(() => EvaluationListRelationFilterSchema).optional(),
  savedSearch: z.union([ z.lazy(() => SavedSearchNullableRelationFilterSchema),z.lazy(() => SavedSearchWhereInputSchema) ]).optional().nullable(),
}).strict();

export const EvaluationGroupOrderByWithRelationInputSchema: z.ZodType<Prisma.EvaluationGroupOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  condition: z.lazy(() => SortOrderSchema).optional(),
  enabled: z.lazy(() => SortOrderSchema).optional(),
  savedSearchId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  evaluations: z.lazy(() => EvaluationOrderByRelationAggregateInputSchema).optional(),
  savedSearch: z.lazy(() => SavedSearchOrderByWithRelationInputSchema).optional()
}).strict();

export const EvaluationGroupWhereUniqueInputSchema: z.ZodType<Prisma.EvaluationGroupWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => EvaluationGroupWhereInputSchema),z.lazy(() => EvaluationGroupWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvaluationGroupWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvaluationGroupWhereInputSchema),z.lazy(() => EvaluationGroupWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  condition: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  enabled: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  savedSearchId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  evaluations: z.lazy(() => EvaluationListRelationFilterSchema).optional(),
  savedSearch: z.union([ z.lazy(() => SavedSearchNullableRelationFilterSchema),z.lazy(() => SavedSearchWhereInputSchema) ]).optional().nullable(),
}).strict());

export const EvaluationGroupOrderByWithAggregationInputSchema: z.ZodType<Prisma.EvaluationGroupOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  condition: z.lazy(() => SortOrderSchema).optional(),
  enabled: z.lazy(() => SortOrderSchema).optional(),
  savedSearchId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => EvaluationGroupCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => EvaluationGroupMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => EvaluationGroupMinOrderByAggregateInputSchema).optional()
}).strict();

export const EvaluationGroupScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.EvaluationGroupScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => EvaluationGroupScalarWhereWithAggregatesInputSchema),z.lazy(() => EvaluationGroupScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvaluationGroupScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvaluationGroupScalarWhereWithAggregatesInputSchema),z.lazy(() => EvaluationGroupScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  condition: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  enabled: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  savedSearchId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const SavedSearchWhereInputSchema: z.ZodType<Prisma.SavedSearchWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SavedSearchWhereInputSchema),z.lazy(() => SavedSearchWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SavedSearchWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SavedSearchWhereInputSchema),z.lazy(() => SavedSearchWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  isDefault: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  agentId: z.lazy(() => StringNullableListFilterSchema).optional(),
  lookbackPeriod: z.lazy(() => JsonFilterSchema).optional(),
  timeRange: z.lazy(() => JsonNullableFilterSchema).optional(),
  chartPeriod: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  customerCallId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  metadata: z.lazy(() => JsonNullableFilterSchema).optional(),
  evaluationGroups: z.lazy(() => EvaluationGroupListRelationFilterSchema).optional(),
  alerts: z.lazy(() => AlertListRelationFilterSchema).optional()
}).strict();

export const SavedSearchOrderByWithRelationInputSchema: z.ZodType<Prisma.SavedSearchOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  isDefault: z.lazy(() => SortOrderSchema).optional(),
  agentId: z.lazy(() => SortOrderSchema).optional(),
  lookbackPeriod: z.lazy(() => SortOrderSchema).optional(),
  timeRange: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  chartPeriod: z.lazy(() => SortOrderSchema).optional(),
  customerCallId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  metadata: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  evaluationGroups: z.lazy(() => EvaluationGroupOrderByRelationAggregateInputSchema).optional(),
  alerts: z.lazy(() => AlertOrderByRelationAggregateInputSchema).optional()
}).strict();

export const SavedSearchWhereUniqueInputSchema: z.ZodType<Prisma.SavedSearchWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => SavedSearchWhereInputSchema),z.lazy(() => SavedSearchWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SavedSearchWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SavedSearchWhereInputSchema),z.lazy(() => SavedSearchWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  isDefault: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  agentId: z.lazy(() => StringNullableListFilterSchema).optional(),
  lookbackPeriod: z.lazy(() => JsonFilterSchema).optional(),
  timeRange: z.lazy(() => JsonNullableFilterSchema).optional(),
  chartPeriod: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  customerCallId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  metadata: z.lazy(() => JsonNullableFilterSchema).optional(),
  evaluationGroups: z.lazy(() => EvaluationGroupListRelationFilterSchema).optional(),
  alerts: z.lazy(() => AlertListRelationFilterSchema).optional()
}).strict());

export const SavedSearchOrderByWithAggregationInputSchema: z.ZodType<Prisma.SavedSearchOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  isDefault: z.lazy(() => SortOrderSchema).optional(),
  agentId: z.lazy(() => SortOrderSchema).optional(),
  lookbackPeriod: z.lazy(() => SortOrderSchema).optional(),
  timeRange: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  chartPeriod: z.lazy(() => SortOrderSchema).optional(),
  customerCallId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  metadata: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => SavedSearchCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => SavedSearchAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => SavedSearchMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => SavedSearchMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => SavedSearchSumOrderByAggregateInputSchema).optional()
}).strict();

export const SavedSearchScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.SavedSearchScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => SavedSearchScalarWhereWithAggregatesInputSchema),z.lazy(() => SavedSearchScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => SavedSearchScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SavedSearchScalarWhereWithAggregatesInputSchema),z.lazy(() => SavedSearchScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  isDefault: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  agentId: z.lazy(() => StringNullableListFilterSchema).optional(),
  lookbackPeriod: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  timeRange: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  chartPeriod: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  customerCallId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  metadata: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional()
}).strict();

export const AlertWhereInputSchema: z.ZodType<Prisma.AlertWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AlertWhereInputSchema),z.lazy(() => AlertWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AlertWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AlertWhereInputSchema),z.lazy(() => AlertWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  savedSearchId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumAlertTypeFilterSchema),z.lazy(() => AlertTypeSchema) ]).optional(),
  details: z.lazy(() => JsonFilterSchema).optional(),
  enabled: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  savedSearch: z.union([ z.lazy(() => SavedSearchRelationFilterSchema),z.lazy(() => SavedSearchWhereInputSchema) ]).optional(),
}).strict();

export const AlertOrderByWithRelationInputSchema: z.ZodType<Prisma.AlertOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  savedSearchId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  details: z.lazy(() => SortOrderSchema).optional(),
  enabled: z.lazy(() => SortOrderSchema).optional(),
  savedSearch: z.lazy(() => SavedSearchOrderByWithRelationInputSchema).optional()
}).strict();

export const AlertWhereUniqueInputSchema: z.ZodType<Prisma.AlertWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => AlertWhereInputSchema),z.lazy(() => AlertWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AlertWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AlertWhereInputSchema),z.lazy(() => AlertWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  savedSearchId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumAlertTypeFilterSchema),z.lazy(() => AlertTypeSchema) ]).optional(),
  details: z.lazy(() => JsonFilterSchema).optional(),
  enabled: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  savedSearch: z.union([ z.lazy(() => SavedSearchRelationFilterSchema),z.lazy(() => SavedSearchWhereInputSchema) ]).optional(),
}).strict());

export const AlertOrderByWithAggregationInputSchema: z.ZodType<Prisma.AlertOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  savedSearchId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  details: z.lazy(() => SortOrderSchema).optional(),
  enabled: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => AlertCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AlertMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AlertMinOrderByAggregateInputSchema).optional()
}).strict();

export const AlertScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AlertScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => AlertScalarWhereWithAggregatesInputSchema),z.lazy(() => AlertScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AlertScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AlertScalarWhereWithAggregatesInputSchema),z.lazy(() => AlertScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  savedSearchId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumAlertTypeWithAggregatesFilterSchema),z.lazy(() => AlertTypeSchema) ]).optional(),
  details: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  enabled: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
}).strict();

export const ApiKeyCreateInputSchema: z.ZodType<Prisma.ApiKeyCreateInput> = z.object({
  orgId: z.string(),
  apiKey: z.string()
}).strict();

export const ApiKeyUncheckedCreateInputSchema: z.ZodType<Prisma.ApiKeyUncheckedCreateInput> = z.object({
  orgId: z.string(),
  apiKey: z.string()
}).strict();

export const ApiKeyUpdateInputSchema: z.ZodType<Prisma.ApiKeyUpdateInput> = z.object({
  orgId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  apiKey: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ApiKeyUncheckedUpdateInputSchema: z.ZodType<Prisma.ApiKeyUncheckedUpdateInput> = z.object({
  orgId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  apiKey: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ApiKeyCreateManyInputSchema: z.ZodType<Prisma.ApiKeyCreateManyInput> = z.object({
  orgId: z.string(),
  apiKey: z.string()
}).strict();

export const ApiKeyUpdateManyMutationInputSchema: z.ZodType<Prisma.ApiKeyUpdateManyMutationInput> = z.object({
  orgId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  apiKey: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ApiKeyUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ApiKeyUncheckedUpdateManyInput> = z.object({
  orgId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  apiKey: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AgentCreateInputSchema: z.ZodType<Prisma.AgentCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  ownerId: z.string(),
  name: z.string(),
  phoneNumber: z.string().optional(),
  customerAgentId: z.string(),
  githubRepoUrl: z.string().optional().nullable(),
  systemPrompt: z.string().optional(),
  extraProperties: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enableSlackNotifications: z.boolean().optional(),
  enabledTestAgents: z.lazy(() => TestAgentCreateNestedManyWithoutAgentsInputSchema).optional(),
  scenarios: z.lazy(() => ScenarioCreateNestedManyWithoutAgentInputSchema).optional(),
  tests: z.lazy(() => TestCreateNestedManyWithoutAgentInputSchema).optional(),
  calls: z.lazy(() => CallCreateNestedManyWithoutAgentInputSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationCreateNestedManyWithoutAgentInputSchema).optional()
}).strict();

export const AgentUncheckedCreateInputSchema: z.ZodType<Prisma.AgentUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  ownerId: z.string(),
  name: z.string(),
  phoneNumber: z.string().optional(),
  customerAgentId: z.string(),
  githubRepoUrl: z.string().optional().nullable(),
  systemPrompt: z.string().optional(),
  extraProperties: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enableSlackNotifications: z.boolean().optional(),
  enabledTestAgents: z.lazy(() => TestAgentUncheckedCreateNestedManyWithoutAgentsInputSchema).optional(),
  scenarios: z.lazy(() => ScenarioUncheckedCreateNestedManyWithoutAgentInputSchema).optional(),
  tests: z.lazy(() => TestUncheckedCreateNestedManyWithoutAgentInputSchema).optional(),
  calls: z.lazy(() => CallUncheckedCreateNestedManyWithoutAgentInputSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationUncheckedCreateNestedManyWithoutAgentInputSchema).optional()
}).strict();

export const AgentUpdateInputSchema: z.ZodType<Prisma.AgentUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerAgentId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  githubRepoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  systemPrompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  extraProperties: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enableSlackNotifications: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  enabledTestAgents: z.lazy(() => TestAgentUpdateManyWithoutAgentsNestedInputSchema).optional(),
  scenarios: z.lazy(() => ScenarioUpdateManyWithoutAgentNestedInputSchema).optional(),
  tests: z.lazy(() => TestUpdateManyWithoutAgentNestedInputSchema).optional(),
  calls: z.lazy(() => CallUpdateManyWithoutAgentNestedInputSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationUpdateManyWithoutAgentNestedInputSchema).optional()
}).strict();

export const AgentUncheckedUpdateInputSchema: z.ZodType<Prisma.AgentUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerAgentId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  githubRepoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  systemPrompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  extraProperties: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enableSlackNotifications: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  enabledTestAgents: z.lazy(() => TestAgentUncheckedUpdateManyWithoutAgentsNestedInputSchema).optional(),
  scenarios: z.lazy(() => ScenarioUncheckedUpdateManyWithoutAgentNestedInputSchema).optional(),
  tests: z.lazy(() => TestUncheckedUpdateManyWithoutAgentNestedInputSchema).optional(),
  calls: z.lazy(() => CallUncheckedUpdateManyWithoutAgentNestedInputSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationUncheckedUpdateManyWithoutAgentNestedInputSchema).optional()
}).strict();

export const AgentCreateManyInputSchema: z.ZodType<Prisma.AgentCreateManyInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  ownerId: z.string(),
  name: z.string(),
  phoneNumber: z.string().optional(),
  customerAgentId: z.string(),
  githubRepoUrl: z.string().optional().nullable(),
  systemPrompt: z.string().optional(),
  extraProperties: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enableSlackNotifications: z.boolean().optional()
}).strict();

export const AgentUpdateManyMutationInputSchema: z.ZodType<Prisma.AgentUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerAgentId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  githubRepoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  systemPrompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  extraProperties: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enableSlackNotifications: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AgentUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AgentUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerAgentId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  githubRepoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  systemPrompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  extraProperties: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enableSlackNotifications: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TestCreateInputSchema: z.ZodType<Prisma.TestCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  gitBranch: z.string().optional().nullable(),
  gitCommit: z.string().optional().nullable(),
  runFromApi: z.boolean().optional(),
  agent: z.lazy(() => AgentCreateNestedOneWithoutTestsInputSchema),
  calls: z.lazy(() => CallCreateNestedManyWithoutTestInputSchema).optional()
}).strict();

export const TestUncheckedCreateInputSchema: z.ZodType<Prisma.TestUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  agentId: z.string(),
  gitBranch: z.string().optional().nullable(),
  gitCommit: z.string().optional().nullable(),
  runFromApi: z.boolean().optional(),
  calls: z.lazy(() => CallUncheckedCreateNestedManyWithoutTestInputSchema).optional()
}).strict();

export const TestUpdateInputSchema: z.ZodType<Prisma.TestUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  gitBranch: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  gitCommit: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  runFromApi: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  agent: z.lazy(() => AgentUpdateOneRequiredWithoutTestsNestedInputSchema).optional(),
  calls: z.lazy(() => CallUpdateManyWithoutTestNestedInputSchema).optional()
}).strict();

export const TestUncheckedUpdateInputSchema: z.ZodType<Prisma.TestUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  agentId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gitBranch: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  gitCommit: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  runFromApi: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  calls: z.lazy(() => CallUncheckedUpdateManyWithoutTestNestedInputSchema).optional()
}).strict();

export const TestCreateManyInputSchema: z.ZodType<Prisma.TestCreateManyInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  agentId: z.string(),
  gitBranch: z.string().optional().nullable(),
  gitCommit: z.string().optional().nullable(),
  runFromApi: z.boolean().optional()
}).strict();

export const TestUpdateManyMutationInputSchema: z.ZodType<Prisma.TestUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  gitBranch: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  gitCommit: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  runFromApi: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TestUncheckedUpdateManyInputSchema: z.ZodType<Prisma.TestUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  agentId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gitBranch: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  gitCommit: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  runFromApi: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TestAgentCreateInputSchema: z.ZodType<Prisma.TestAgentCreateInput> = z.object({
  id: z.string().optional(),
  ownerId: z.string().optional().nullable(),
  name: z.string(),
  headshotUrl: z.string(),
  description: z.string(),
  prompt: z.string(),
  enabled: z.boolean().optional(),
  defaultSelected: z.boolean().optional(),
  order: z.number().int().optional(),
  agents: z.lazy(() => AgentCreateNestedManyWithoutEnabledTestAgentsInputSchema).optional(),
  calls: z.lazy(() => CallCreateNestedManyWithoutTestAgentInputSchema).optional()
}).strict();

export const TestAgentUncheckedCreateInputSchema: z.ZodType<Prisma.TestAgentUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  ownerId: z.string().optional().nullable(),
  name: z.string(),
  headshotUrl: z.string(),
  description: z.string(),
  prompt: z.string(),
  enabled: z.boolean().optional(),
  defaultSelected: z.boolean().optional(),
  order: z.number().int().optional(),
  agents: z.lazy(() => AgentUncheckedCreateNestedManyWithoutEnabledTestAgentsInputSchema).optional(),
  calls: z.lazy(() => CallUncheckedCreateNestedManyWithoutTestAgentInputSchema).optional()
}).strict();

export const TestAgentUpdateInputSchema: z.ZodType<Prisma.TestAgentUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  headshotUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  prompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  defaultSelected: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  agents: z.lazy(() => AgentUpdateManyWithoutEnabledTestAgentsNestedInputSchema).optional(),
  calls: z.lazy(() => CallUpdateManyWithoutTestAgentNestedInputSchema).optional()
}).strict();

export const TestAgentUncheckedUpdateInputSchema: z.ZodType<Prisma.TestAgentUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  headshotUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  prompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  defaultSelected: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  agents: z.lazy(() => AgentUncheckedUpdateManyWithoutEnabledTestAgentsNestedInputSchema).optional(),
  calls: z.lazy(() => CallUncheckedUpdateManyWithoutTestAgentNestedInputSchema).optional()
}).strict();

export const TestAgentCreateManyInputSchema: z.ZodType<Prisma.TestAgentCreateManyInput> = z.object({
  id: z.string().optional(),
  ownerId: z.string().optional().nullable(),
  name: z.string(),
  headshotUrl: z.string(),
  description: z.string(),
  prompt: z.string(),
  enabled: z.boolean().optional(),
  defaultSelected: z.boolean().optional(),
  order: z.number().int().optional()
}).strict();

export const TestAgentUpdateManyMutationInputSchema: z.ZodType<Prisma.TestAgentUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  headshotUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  prompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  defaultSelected: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TestAgentUncheckedUpdateManyInputSchema: z.ZodType<Prisma.TestAgentUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  headshotUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  prompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  defaultSelected: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CallCreateInputSchema: z.ZodType<Prisma.CallCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  ownerId: z.string().optional().nullable(),
  deleted: z.boolean().optional(),
  vapiCallId: z.string().optional().nullable(),
  customerCallId: z.string().optional().nullable(),
  ofOneDeviceId: z.string().optional().nullable(),
  status: z.lazy(() => CallStatusSchema),
  result: z.lazy(() => CallResultSchema).optional().nullable(),
  failureReason: z.string().optional().nullable(),
  stereoRecordingUrl: z.string(),
  monoRecordingUrl: z.string().optional().nullable(),
  startedAt: z.string().optional().nullable(),
  endedAt: z.string().optional().nullable(),
  regionId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.number().optional().nullable(),
  latencyP90: z.number().optional().nullable(),
  latencyP95: z.number().optional().nullable(),
  interruptionP50: z.number().optional().nullable(),
  interruptionP90: z.number().optional().nullable(),
  interruptionP95: z.number().optional().nullable(),
  numInterruptions: z.number().int().optional().nullable(),
  duration: z.number().optional().nullable(),
  isRead: z.boolean().optional().nullable(),
  readBy: z.string().optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  agent: z.lazy(() => AgentCreateNestedOneWithoutCallsInputSchema).optional(),
  test: z.lazy(() => TestCreateNestedOneWithoutCallsInputSchema).optional(),
  testAgent: z.lazy(() => TestAgentCreateNestedOneWithoutCallsInputSchema).optional(),
  scenario: z.lazy(() => ScenarioCreateNestedOneWithoutCallsInputSchema).optional(),
  evaluationResults: z.lazy(() => EvaluationResultCreateNestedManyWithoutCallInputSchema).optional(),
  messages: z.lazy(() => MessageCreateNestedManyWithoutCallInputSchema).optional(),
  latencyBlocks: z.lazy(() => LatencyBlockCreateNestedManyWithoutCallInputSchema).optional(),
  interruptions: z.lazy(() => InterruptionCreateNestedManyWithoutCallInputSchema).optional(),
  errors: z.lazy(() => CallErrorCreateNestedManyWithoutCallInputSchema).optional()
}).strict();

export const CallUncheckedCreateInputSchema: z.ZodType<Prisma.CallUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  ownerId: z.string().optional().nullable(),
  deleted: z.boolean().optional(),
  vapiCallId: z.string().optional().nullable(),
  customerCallId: z.string().optional().nullable(),
  ofOneDeviceId: z.string().optional().nullable(),
  status: z.lazy(() => CallStatusSchema),
  result: z.lazy(() => CallResultSchema).optional().nullable(),
  failureReason: z.string().optional().nullable(),
  stereoRecordingUrl: z.string(),
  monoRecordingUrl: z.string().optional().nullable(),
  startedAt: z.string().optional().nullable(),
  endedAt: z.string().optional().nullable(),
  regionId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.number().optional().nullable(),
  latencyP90: z.number().optional().nullable(),
  latencyP95: z.number().optional().nullable(),
  interruptionP50: z.number().optional().nullable(),
  interruptionP90: z.number().optional().nullable(),
  interruptionP95: z.number().optional().nullable(),
  numInterruptions: z.number().int().optional().nullable(),
  duration: z.number().optional().nullable(),
  isRead: z.boolean().optional().nullable(),
  readBy: z.string().optional().nullable(),
  agentId: z.string().optional().nullable(),
  testId: z.string().optional().nullable(),
  testAgentId: z.string().optional().nullable(),
  scenarioId: z.string().optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationResults: z.lazy(() => EvaluationResultUncheckedCreateNestedManyWithoutCallInputSchema).optional(),
  messages: z.lazy(() => MessageUncheckedCreateNestedManyWithoutCallInputSchema).optional(),
  latencyBlocks: z.lazy(() => LatencyBlockUncheckedCreateNestedManyWithoutCallInputSchema).optional(),
  interruptions: z.lazy(() => InterruptionUncheckedCreateNestedManyWithoutCallInputSchema).optional(),
  errors: z.lazy(() => CallErrorUncheckedCreateNestedManyWithoutCallInputSchema).optional()
}).strict();

export const CallUpdateInputSchema: z.ZodType<Prisma.CallUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  vapiCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ofOneDeviceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => EnumCallStatusFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => NullableEnumCallResultFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  failureReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  monoRecordingUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  regionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numInterruptions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isRead: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  readBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  agent: z.lazy(() => AgentUpdateOneWithoutCallsNestedInputSchema).optional(),
  test: z.lazy(() => TestUpdateOneWithoutCallsNestedInputSchema).optional(),
  testAgent: z.lazy(() => TestAgentUpdateOneWithoutCallsNestedInputSchema).optional(),
  scenario: z.lazy(() => ScenarioUpdateOneWithoutCallsNestedInputSchema).optional(),
  evaluationResults: z.lazy(() => EvaluationResultUpdateManyWithoutCallNestedInputSchema).optional(),
  messages: z.lazy(() => MessageUpdateManyWithoutCallNestedInputSchema).optional(),
  latencyBlocks: z.lazy(() => LatencyBlockUpdateManyWithoutCallNestedInputSchema).optional(),
  interruptions: z.lazy(() => InterruptionUpdateManyWithoutCallNestedInputSchema).optional(),
  errors: z.lazy(() => CallErrorUpdateManyWithoutCallNestedInputSchema).optional()
}).strict();

export const CallUncheckedUpdateInputSchema: z.ZodType<Prisma.CallUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  vapiCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ofOneDeviceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => EnumCallStatusFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => NullableEnumCallResultFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  failureReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  monoRecordingUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  regionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numInterruptions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isRead: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  readBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  agentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testAgentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scenarioId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationResults: z.lazy(() => EvaluationResultUncheckedUpdateManyWithoutCallNestedInputSchema).optional(),
  messages: z.lazy(() => MessageUncheckedUpdateManyWithoutCallNestedInputSchema).optional(),
  latencyBlocks: z.lazy(() => LatencyBlockUncheckedUpdateManyWithoutCallNestedInputSchema).optional(),
  interruptions: z.lazy(() => InterruptionUncheckedUpdateManyWithoutCallNestedInputSchema).optional(),
  errors: z.lazy(() => CallErrorUncheckedUpdateManyWithoutCallNestedInputSchema).optional()
}).strict();

export const CallCreateManyInputSchema: z.ZodType<Prisma.CallCreateManyInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  ownerId: z.string().optional().nullable(),
  deleted: z.boolean().optional(),
  vapiCallId: z.string().optional().nullable(),
  customerCallId: z.string().optional().nullable(),
  ofOneDeviceId: z.string().optional().nullable(),
  status: z.lazy(() => CallStatusSchema),
  result: z.lazy(() => CallResultSchema).optional().nullable(),
  failureReason: z.string().optional().nullable(),
  stereoRecordingUrl: z.string(),
  monoRecordingUrl: z.string().optional().nullable(),
  startedAt: z.string().optional().nullable(),
  endedAt: z.string().optional().nullable(),
  regionId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.number().optional().nullable(),
  latencyP90: z.number().optional().nullable(),
  latencyP95: z.number().optional().nullable(),
  interruptionP50: z.number().optional().nullable(),
  interruptionP90: z.number().optional().nullable(),
  interruptionP95: z.number().optional().nullable(),
  numInterruptions: z.number().int().optional().nullable(),
  duration: z.number().optional().nullable(),
  isRead: z.boolean().optional().nullable(),
  readBy: z.string().optional().nullable(),
  agentId: z.string().optional().nullable(),
  testId: z.string().optional().nullable(),
  testAgentId: z.string().optional().nullable(),
  scenarioId: z.string().optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const CallUpdateManyMutationInputSchema: z.ZodType<Prisma.CallUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  vapiCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ofOneDeviceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => EnumCallStatusFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => NullableEnumCallResultFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  failureReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  monoRecordingUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  regionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numInterruptions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isRead: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  readBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const CallUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CallUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  vapiCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ofOneDeviceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => EnumCallStatusFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => NullableEnumCallResultFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  failureReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  monoRecordingUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  regionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numInterruptions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isRead: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  readBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  agentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testAgentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scenarioId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const MessageCreateInputSchema: z.ZodType<Prisma.MessageCreateInput> = z.object({
  id: z.string().optional(),
  role: z.lazy(() => RoleSchema),
  message: z.string().optional(),
  time: z.number().optional(),
  endTime: z.number().optional(),
  secondsFromStart: z.number().optional(),
  duration: z.number().optional(),
  name: z.string().optional(),
  result: z.string().optional(),
  toolCalls: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  call: z.lazy(() => CallCreateNestedOneWithoutMessagesInputSchema)
}).strict();

export const MessageUncheckedCreateInputSchema: z.ZodType<Prisma.MessageUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  role: z.lazy(() => RoleSchema),
  message: z.string().optional(),
  time: z.number().optional(),
  endTime: z.number().optional(),
  secondsFromStart: z.number().optional(),
  duration: z.number().optional(),
  name: z.string().optional(),
  result: z.string().optional(),
  toolCalls: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  callId: z.string()
}).strict();

export const MessageUpdateInputSchema: z.ZodType<Prisma.MessageUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  toolCalls: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  call: z.lazy(() => CallUpdateOneRequiredWithoutMessagesNestedInputSchema).optional()
}).strict();

export const MessageUncheckedUpdateInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  toolCalls: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  callId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MessageCreateManyInputSchema: z.ZodType<Prisma.MessageCreateManyInput> = z.object({
  id: z.string().optional(),
  role: z.lazy(() => RoleSchema),
  message: z.string().optional(),
  time: z.number().optional(),
  endTime: z.number().optional(),
  secondsFromStart: z.number().optional(),
  duration: z.number().optional(),
  name: z.string().optional(),
  result: z.string().optional(),
  toolCalls: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  callId: z.string()
}).strict();

export const MessageUpdateManyMutationInputSchema: z.ZodType<Prisma.MessageUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  toolCalls: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const MessageUncheckedUpdateManyInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  toolCalls: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  callId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CallErrorCreateInputSchema: z.ZodType<Prisma.CallErrorCreateInput> = z.object({
  id: z.string().optional(),
  secondsFromStart: z.number(),
  duration: z.number(),
  type: z.string().optional().nullable(),
  description: z.string(),
  call: z.lazy(() => CallCreateNestedOneWithoutErrorsInputSchema)
}).strict();

export const CallErrorUncheckedCreateInputSchema: z.ZodType<Prisma.CallErrorUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  secondsFromStart: z.number(),
  duration: z.number(),
  type: z.string().optional().nullable(),
  description: z.string(),
  callId: z.string()
}).strict();

export const CallErrorUpdateInputSchema: z.ZodType<Prisma.CallErrorUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  call: z.lazy(() => CallUpdateOneRequiredWithoutErrorsNestedInputSchema).optional()
}).strict();

export const CallErrorUncheckedUpdateInputSchema: z.ZodType<Prisma.CallErrorUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  callId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CallErrorCreateManyInputSchema: z.ZodType<Prisma.CallErrorCreateManyInput> = z.object({
  id: z.string().optional(),
  secondsFromStart: z.number(),
  duration: z.number(),
  type: z.string().optional().nullable(),
  description: z.string(),
  callId: z.string()
}).strict();

export const CallErrorUpdateManyMutationInputSchema: z.ZodType<Prisma.CallErrorUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CallErrorUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CallErrorUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  callId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CallRecordingCreateInputSchema: z.ZodType<Prisma.CallRecordingCreateInput> = z.object({
  id: z.string(),
  audioUrl: z.string(),
  createdAt: z.coerce.date().optional(),
  processed: z.boolean().optional(),
  agentId: z.string().optional().nullable(),
  regionId: z.string().optional().nullable(),
  duration: z.number().optional().nullable()
}).strict();

export const CallRecordingUncheckedCreateInputSchema: z.ZodType<Prisma.CallRecordingUncheckedCreateInput> = z.object({
  id: z.string(),
  audioUrl: z.string(),
  createdAt: z.coerce.date().optional(),
  processed: z.boolean().optional(),
  agentId: z.string().optional().nullable(),
  regionId: z.string().optional().nullable(),
  duration: z.number().optional().nullable()
}).strict();

export const CallRecordingUpdateInputSchema: z.ZodType<Prisma.CallRecordingUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  audioUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  processed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  agentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  regionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const CallRecordingUncheckedUpdateInputSchema: z.ZodType<Prisma.CallRecordingUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  audioUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  processed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  agentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  regionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const CallRecordingCreateManyInputSchema: z.ZodType<Prisma.CallRecordingCreateManyInput> = z.object({
  id: z.string(),
  audioUrl: z.string(),
  createdAt: z.coerce.date().optional(),
  processed: z.boolean().optional(),
  agentId: z.string().optional().nullable(),
  regionId: z.string().optional().nullable(),
  duration: z.number().optional().nullable()
}).strict();

export const CallRecordingUpdateManyMutationInputSchema: z.ZodType<Prisma.CallRecordingUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  audioUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  processed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  agentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  regionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const CallRecordingUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CallRecordingUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  audioUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  processed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  agentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  regionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ScenarioCreateInputSchema: z.ZodType<Prisma.ScenarioCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  name: z.string(),
  instructions: z.string(),
  successCriteria: z.string().optional(),
  includeDateTime: z.boolean().optional(),
  timezone: z.string().optional().nullable(),
  deleted: z.boolean().optional(),
  agent: z.lazy(() => AgentCreateNestedOneWithoutScenariosInputSchema),
  calls: z.lazy(() => CallCreateNestedManyWithoutScenarioInputSchema).optional(),
  evaluations: z.lazy(() => EvaluationCreateNestedManyWithoutScenarioInputSchema).optional()
}).strict();

export const ScenarioUncheckedCreateInputSchema: z.ZodType<Prisma.ScenarioUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  agentId: z.string(),
  name: z.string(),
  instructions: z.string(),
  successCriteria: z.string().optional(),
  includeDateTime: z.boolean().optional(),
  timezone: z.string().optional().nullable(),
  deleted: z.boolean().optional(),
  calls: z.lazy(() => CallUncheckedCreateNestedManyWithoutScenarioInputSchema).optional(),
  evaluations: z.lazy(() => EvaluationUncheckedCreateNestedManyWithoutScenarioInputSchema).optional()
}).strict();

export const ScenarioUpdateInputSchema: z.ZodType<Prisma.ScenarioUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  instructions: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  successCriteria: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  includeDateTime: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  timezone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  agent: z.lazy(() => AgentUpdateOneRequiredWithoutScenariosNestedInputSchema).optional(),
  calls: z.lazy(() => CallUpdateManyWithoutScenarioNestedInputSchema).optional(),
  evaluations: z.lazy(() => EvaluationUpdateManyWithoutScenarioNestedInputSchema).optional()
}).strict();

export const ScenarioUncheckedUpdateInputSchema: z.ZodType<Prisma.ScenarioUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  agentId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  instructions: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  successCriteria: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  includeDateTime: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  timezone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  calls: z.lazy(() => CallUncheckedUpdateManyWithoutScenarioNestedInputSchema).optional(),
  evaluations: z.lazy(() => EvaluationUncheckedUpdateManyWithoutScenarioNestedInputSchema).optional()
}).strict();

export const ScenarioCreateManyInputSchema: z.ZodType<Prisma.ScenarioCreateManyInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  agentId: z.string(),
  name: z.string(),
  instructions: z.string(),
  successCriteria: z.string().optional(),
  includeDateTime: z.boolean().optional(),
  timezone: z.string().optional().nullable(),
  deleted: z.boolean().optional()
}).strict();

export const ScenarioUpdateManyMutationInputSchema: z.ZodType<Prisma.ScenarioUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  instructions: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  successCriteria: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  includeDateTime: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  timezone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ScenarioUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ScenarioUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  agentId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  instructions: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  successCriteria: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  includeDateTime: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  timezone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EvaluationTemplateCreateInputSchema: z.ZodType<Prisma.EvaluationTemplateCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  name: z.string(),
  description: z.string(),
  params: z.union([ z.lazy(() => EvaluationTemplateCreateparamsInputSchema),z.string().array() ]).optional(),
  type: z.lazy(() => EvalTypeSchema),
  resultType: z.lazy(() => EvalResultTypeSchema),
  contentType: z.lazy(() => EvalContentTypeSchema).optional(),
  toolCallExpectedResult: z.string().optional(),
  ownerId: z.string().optional().nullable(),
  deleted: z.boolean().optional(),
  evaluationResults: z.lazy(() => EvaluationResultCreateNestedManyWithoutEvaluationTemplateInputSchema).optional(),
  evaluations: z.lazy(() => EvaluationCreateNestedManyWithoutEvaluationTemplateInputSchema).optional()
}).strict();

export const EvaluationTemplateUncheckedCreateInputSchema: z.ZodType<Prisma.EvaluationTemplateUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  name: z.string(),
  description: z.string(),
  params: z.union([ z.lazy(() => EvaluationTemplateCreateparamsInputSchema),z.string().array() ]).optional(),
  type: z.lazy(() => EvalTypeSchema),
  resultType: z.lazy(() => EvalResultTypeSchema),
  contentType: z.lazy(() => EvalContentTypeSchema).optional(),
  toolCallExpectedResult: z.string().optional(),
  ownerId: z.string().optional().nullable(),
  deleted: z.boolean().optional(),
  evaluationResults: z.lazy(() => EvaluationResultUncheckedCreateNestedManyWithoutEvaluationTemplateInputSchema).optional(),
  evaluations: z.lazy(() => EvaluationUncheckedCreateNestedManyWithoutEvaluationTemplateInputSchema).optional()
}).strict();

export const EvaluationTemplateUpdateInputSchema: z.ZodType<Prisma.EvaluationTemplateUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  params: z.union([ z.lazy(() => EvaluationTemplateUpdateparamsInputSchema),z.string().array() ]).optional(),
  type: z.union([ z.lazy(() => EvalTypeSchema),z.lazy(() => EnumEvalTypeFieldUpdateOperationsInputSchema) ]).optional(),
  resultType: z.union([ z.lazy(() => EvalResultTypeSchema),z.lazy(() => EnumEvalResultTypeFieldUpdateOperationsInputSchema) ]).optional(),
  contentType: z.union([ z.lazy(() => EvalContentTypeSchema),z.lazy(() => EnumEvalContentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  toolCallExpectedResult: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  evaluationResults: z.lazy(() => EvaluationResultUpdateManyWithoutEvaluationTemplateNestedInputSchema).optional(),
  evaluations: z.lazy(() => EvaluationUpdateManyWithoutEvaluationTemplateNestedInputSchema).optional()
}).strict();

export const EvaluationTemplateUncheckedUpdateInputSchema: z.ZodType<Prisma.EvaluationTemplateUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  params: z.union([ z.lazy(() => EvaluationTemplateUpdateparamsInputSchema),z.string().array() ]).optional(),
  type: z.union([ z.lazy(() => EvalTypeSchema),z.lazy(() => EnumEvalTypeFieldUpdateOperationsInputSchema) ]).optional(),
  resultType: z.union([ z.lazy(() => EvalResultTypeSchema),z.lazy(() => EnumEvalResultTypeFieldUpdateOperationsInputSchema) ]).optional(),
  contentType: z.union([ z.lazy(() => EvalContentTypeSchema),z.lazy(() => EnumEvalContentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  toolCallExpectedResult: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  evaluationResults: z.lazy(() => EvaluationResultUncheckedUpdateManyWithoutEvaluationTemplateNestedInputSchema).optional(),
  evaluations: z.lazy(() => EvaluationUncheckedUpdateManyWithoutEvaluationTemplateNestedInputSchema).optional()
}).strict();

export const EvaluationTemplateCreateManyInputSchema: z.ZodType<Prisma.EvaluationTemplateCreateManyInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  name: z.string(),
  description: z.string(),
  params: z.union([ z.lazy(() => EvaluationTemplateCreateparamsInputSchema),z.string().array() ]).optional(),
  type: z.lazy(() => EvalTypeSchema),
  resultType: z.lazy(() => EvalResultTypeSchema),
  contentType: z.lazy(() => EvalContentTypeSchema).optional(),
  toolCallExpectedResult: z.string().optional(),
  ownerId: z.string().optional().nullable(),
  deleted: z.boolean().optional()
}).strict();

export const EvaluationTemplateUpdateManyMutationInputSchema: z.ZodType<Prisma.EvaluationTemplateUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  params: z.union([ z.lazy(() => EvaluationTemplateUpdateparamsInputSchema),z.string().array() ]).optional(),
  type: z.union([ z.lazy(() => EvalTypeSchema),z.lazy(() => EnumEvalTypeFieldUpdateOperationsInputSchema) ]).optional(),
  resultType: z.union([ z.lazy(() => EvalResultTypeSchema),z.lazy(() => EnumEvalResultTypeFieldUpdateOperationsInputSchema) ]).optional(),
  contentType: z.union([ z.lazy(() => EvalContentTypeSchema),z.lazy(() => EnumEvalContentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  toolCallExpectedResult: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EvaluationTemplateUncheckedUpdateManyInputSchema: z.ZodType<Prisma.EvaluationTemplateUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  params: z.union([ z.lazy(() => EvaluationTemplateUpdateparamsInputSchema),z.string().array() ]).optional(),
  type: z.union([ z.lazy(() => EvalTypeSchema),z.lazy(() => EnumEvalTypeFieldUpdateOperationsInputSchema) ]).optional(),
  resultType: z.union([ z.lazy(() => EvalResultTypeSchema),z.lazy(() => EnumEvalResultTypeFieldUpdateOperationsInputSchema) ]).optional(),
  contentType: z.union([ z.lazy(() => EvalContentTypeSchema),z.lazy(() => EnumEvalContentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  toolCallExpectedResult: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const GeneralEvaluationCreateInputSchema: z.ZodType<Prisma.GeneralEvaluationCreateInput> = z.object({
  id: z.string().optional(),
  agent: z.lazy(() => AgentCreateNestedOneWithoutGeneralEvaluationsInputSchema),
  evaluation: z.lazy(() => EvaluationCreateNestedOneWithoutGeneralEvaluationsInputSchema)
}).strict();

export const GeneralEvaluationUncheckedCreateInputSchema: z.ZodType<Prisma.GeneralEvaluationUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  agentId: z.string(),
  evaluationId: z.string()
}).strict();

export const GeneralEvaluationUpdateInputSchema: z.ZodType<Prisma.GeneralEvaluationUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  agent: z.lazy(() => AgentUpdateOneRequiredWithoutGeneralEvaluationsNestedInputSchema).optional(),
  evaluation: z.lazy(() => EvaluationUpdateOneRequiredWithoutGeneralEvaluationsNestedInputSchema).optional()
}).strict();

export const GeneralEvaluationUncheckedUpdateInputSchema: z.ZodType<Prisma.GeneralEvaluationUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  agentId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  evaluationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const GeneralEvaluationCreateManyInputSchema: z.ZodType<Prisma.GeneralEvaluationCreateManyInput> = z.object({
  id: z.string().optional(),
  agentId: z.string(),
  evaluationId: z.string()
}).strict();

export const GeneralEvaluationUpdateManyMutationInputSchema: z.ZodType<Prisma.GeneralEvaluationUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const GeneralEvaluationUncheckedUpdateManyInputSchema: z.ZodType<Prisma.GeneralEvaluationUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  agentId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  evaluationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EvaluationCreateInputSchema: z.ZodType<Prisma.EvaluationCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  enabled: z.boolean().optional(),
  isCritical: z.boolean().optional(),
  params: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationTemplate: z.lazy(() => EvaluationTemplateCreateNestedOneWithoutEvaluationsInputSchema),
  scenario: z.lazy(() => ScenarioCreateNestedOneWithoutEvaluationsInputSchema).optional(),
  evaluationGroup: z.lazy(() => EvaluationGroupCreateNestedOneWithoutEvaluationsInputSchema).optional(),
  evaluationResults: z.lazy(() => EvaluationResultCreateNestedManyWithoutEvaluationInputSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationCreateNestedManyWithoutEvaluationInputSchema).optional()
}).strict();

export const EvaluationUncheckedCreateInputSchema: z.ZodType<Prisma.EvaluationUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  enabled: z.boolean().optional(),
  isCritical: z.boolean().optional(),
  params: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationTemplateId: z.string(),
  scenarioId: z.string().optional().nullable(),
  evaluationGroupId: z.string().optional().nullable(),
  evaluationResults: z.lazy(() => EvaluationResultUncheckedCreateNestedManyWithoutEvaluationInputSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationUncheckedCreateNestedManyWithoutEvaluationInputSchema).optional()
}).strict();

export const EvaluationUpdateInputSchema: z.ZodType<Prisma.EvaluationUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isCritical: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  params: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationTemplate: z.lazy(() => EvaluationTemplateUpdateOneRequiredWithoutEvaluationsNestedInputSchema).optional(),
  scenario: z.lazy(() => ScenarioUpdateOneWithoutEvaluationsNestedInputSchema).optional(),
  evaluationGroup: z.lazy(() => EvaluationGroupUpdateOneWithoutEvaluationsNestedInputSchema).optional(),
  evaluationResults: z.lazy(() => EvaluationResultUpdateManyWithoutEvaluationNestedInputSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationUpdateManyWithoutEvaluationNestedInputSchema).optional()
}).strict();

export const EvaluationUncheckedUpdateInputSchema: z.ZodType<Prisma.EvaluationUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isCritical: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  params: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationTemplateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  scenarioId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evaluationGroupId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evaluationResults: z.lazy(() => EvaluationResultUncheckedUpdateManyWithoutEvaluationNestedInputSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationUncheckedUpdateManyWithoutEvaluationNestedInputSchema).optional()
}).strict();

export const EvaluationCreateManyInputSchema: z.ZodType<Prisma.EvaluationCreateManyInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  enabled: z.boolean().optional(),
  isCritical: z.boolean().optional(),
  params: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationTemplateId: z.string(),
  scenarioId: z.string().optional().nullable(),
  evaluationGroupId: z.string().optional().nullable()
}).strict();

export const EvaluationUpdateManyMutationInputSchema: z.ZodType<Prisma.EvaluationUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isCritical: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  params: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const EvaluationUncheckedUpdateManyInputSchema: z.ZodType<Prisma.EvaluationUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isCritical: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  params: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationTemplateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  scenarioId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evaluationGroupId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const EvaluationResultCreateInputSchema: z.ZodType<Prisma.EvaluationResultCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  result: z.string(),
  success: z.boolean(),
  secondsFromStart: z.number().optional().nullable(),
  duration: z.number().optional().nullable(),
  type: z.lazy(() => EvalResultTypeSchema),
  details: z.string(),
  call: z.lazy(() => CallCreateNestedOneWithoutEvaluationResultsInputSchema).optional(),
  evaluation: z.lazy(() => EvaluationCreateNestedOneWithoutEvaluationResultsInputSchema),
  evaluationTemplate: z.lazy(() => EvaluationTemplateCreateNestedOneWithoutEvaluationResultsInputSchema).optional()
}).strict();

export const EvaluationResultUncheckedCreateInputSchema: z.ZodType<Prisma.EvaluationResultUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  callId: z.string().optional().nullable(),
  evaluationId: z.string(),
  result: z.string(),
  success: z.boolean(),
  secondsFromStart: z.number().optional().nullable(),
  duration: z.number().optional().nullable(),
  type: z.lazy(() => EvalResultTypeSchema),
  details: z.string(),
  evaluationTemplateId: z.string().optional().nullable()
}).strict();

export const EvaluationResultUpdateInputSchema: z.ZodType<Prisma.EvaluationResultUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  success: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => EvalResultTypeSchema),z.lazy(() => EnumEvalResultTypeFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  call: z.lazy(() => CallUpdateOneWithoutEvaluationResultsNestedInputSchema).optional(),
  evaluation: z.lazy(() => EvaluationUpdateOneRequiredWithoutEvaluationResultsNestedInputSchema).optional(),
  evaluationTemplate: z.lazy(() => EvaluationTemplateUpdateOneWithoutEvaluationResultsNestedInputSchema).optional()
}).strict();

export const EvaluationResultUncheckedUpdateInputSchema: z.ZodType<Prisma.EvaluationResultUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  callId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evaluationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  success: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => EvalResultTypeSchema),z.lazy(() => EnumEvalResultTypeFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  evaluationTemplateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const EvaluationResultCreateManyInputSchema: z.ZodType<Prisma.EvaluationResultCreateManyInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  callId: z.string().optional().nullable(),
  evaluationId: z.string(),
  result: z.string(),
  success: z.boolean(),
  secondsFromStart: z.number().optional().nullable(),
  duration: z.number().optional().nullable(),
  type: z.lazy(() => EvalResultTypeSchema),
  details: z.string(),
  evaluationTemplateId: z.string().optional().nullable()
}).strict();

export const EvaluationResultUpdateManyMutationInputSchema: z.ZodType<Prisma.EvaluationResultUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  success: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => EvalResultTypeSchema),z.lazy(() => EnumEvalResultTypeFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EvaluationResultUncheckedUpdateManyInputSchema: z.ZodType<Prisma.EvaluationResultUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  callId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evaluationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  success: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => EvalResultTypeSchema),z.lazy(() => EnumEvalResultTypeFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  evaluationTemplateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const LatencyBlockCreateInputSchema: z.ZodType<Prisma.LatencyBlockCreateInput> = z.object({
  id: z.string().optional(),
  secondsFromStart: z.number(),
  duration: z.number(),
  call: z.lazy(() => CallCreateNestedOneWithoutLatencyBlocksInputSchema)
}).strict();

export const LatencyBlockUncheckedCreateInputSchema: z.ZodType<Prisma.LatencyBlockUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  secondsFromStart: z.number(),
  duration: z.number(),
  callId: z.string()
}).strict();

export const LatencyBlockUpdateInputSchema: z.ZodType<Prisma.LatencyBlockUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  call: z.lazy(() => CallUpdateOneRequiredWithoutLatencyBlocksNestedInputSchema).optional()
}).strict();

export const LatencyBlockUncheckedUpdateInputSchema: z.ZodType<Prisma.LatencyBlockUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  callId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LatencyBlockCreateManyInputSchema: z.ZodType<Prisma.LatencyBlockCreateManyInput> = z.object({
  id: z.string().optional(),
  secondsFromStart: z.number(),
  duration: z.number(),
  callId: z.string()
}).strict();

export const LatencyBlockUpdateManyMutationInputSchema: z.ZodType<Prisma.LatencyBlockUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LatencyBlockUncheckedUpdateManyInputSchema: z.ZodType<Prisma.LatencyBlockUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  callId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const InterruptionCreateInputSchema: z.ZodType<Prisma.InterruptionCreateInput> = z.object({
  id: z.string().optional(),
  secondsFromStart: z.number(),
  duration: z.number(),
  text: z.string(),
  call: z.lazy(() => CallCreateNestedOneWithoutInterruptionsInputSchema)
}).strict();

export const InterruptionUncheckedCreateInputSchema: z.ZodType<Prisma.InterruptionUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  secondsFromStart: z.number(),
  duration: z.number(),
  callId: z.string(),
  text: z.string()
}).strict();

export const InterruptionUpdateInputSchema: z.ZodType<Prisma.InterruptionUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  text: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  call: z.lazy(() => CallUpdateOneRequiredWithoutInterruptionsNestedInputSchema).optional()
}).strict();

export const InterruptionUncheckedUpdateInputSchema: z.ZodType<Prisma.InterruptionUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  callId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  text: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const InterruptionCreateManyInputSchema: z.ZodType<Prisma.InterruptionCreateManyInput> = z.object({
  id: z.string().optional(),
  secondsFromStart: z.number(),
  duration: z.number(),
  callId: z.string(),
  text: z.string()
}).strict();

export const InterruptionUpdateManyMutationInputSchema: z.ZodType<Prisma.InterruptionUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  text: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const InterruptionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.InterruptionUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  callId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  text: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EvaluationGroupCreateInputSchema: z.ZodType<Prisma.EvaluationGroupCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  ownerId: z.string(),
  name: z.string(),
  condition: z.string().optional(),
  enabled: z.boolean().optional(),
  evaluations: z.lazy(() => EvaluationCreateNestedManyWithoutEvaluationGroupInputSchema).optional(),
  savedSearch: z.lazy(() => SavedSearchCreateNestedOneWithoutEvaluationGroupsInputSchema).optional()
}).strict();

export const EvaluationGroupUncheckedCreateInputSchema: z.ZodType<Prisma.EvaluationGroupUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  ownerId: z.string(),
  name: z.string(),
  condition: z.string().optional(),
  enabled: z.boolean().optional(),
  savedSearchId: z.string().optional().nullable(),
  evaluations: z.lazy(() => EvaluationUncheckedCreateNestedManyWithoutEvaluationGroupInputSchema).optional()
}).strict();

export const EvaluationGroupUpdateInputSchema: z.ZodType<Prisma.EvaluationGroupUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  condition: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  evaluations: z.lazy(() => EvaluationUpdateManyWithoutEvaluationGroupNestedInputSchema).optional(),
  savedSearch: z.lazy(() => SavedSearchUpdateOneWithoutEvaluationGroupsNestedInputSchema).optional()
}).strict();

export const EvaluationGroupUncheckedUpdateInputSchema: z.ZodType<Prisma.EvaluationGroupUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  condition: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  savedSearchId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evaluations: z.lazy(() => EvaluationUncheckedUpdateManyWithoutEvaluationGroupNestedInputSchema).optional()
}).strict();

export const EvaluationGroupCreateManyInputSchema: z.ZodType<Prisma.EvaluationGroupCreateManyInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  ownerId: z.string(),
  name: z.string(),
  condition: z.string().optional(),
  enabled: z.boolean().optional(),
  savedSearchId: z.string().optional().nullable()
}).strict();

export const EvaluationGroupUpdateManyMutationInputSchema: z.ZodType<Prisma.EvaluationGroupUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  condition: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EvaluationGroupUncheckedUpdateManyInputSchema: z.ZodType<Prisma.EvaluationGroupUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  condition: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  savedSearchId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const SavedSearchCreateInputSchema: z.ZodType<Prisma.SavedSearchCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  name: z.string(),
  ownerId: z.string(),
  isDefault: z.boolean().optional(),
  agentId: z.union([ z.lazy(() => SavedSearchCreateagentIdInputSchema),z.string().array() ]).optional(),
  lookbackPeriod: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  timeRange: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  chartPeriod: z.number().int(),
  customerCallId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationGroups: z.lazy(() => EvaluationGroupCreateNestedManyWithoutSavedSearchInputSchema).optional(),
  alerts: z.lazy(() => AlertCreateNestedManyWithoutSavedSearchInputSchema).optional()
}).strict();

export const SavedSearchUncheckedCreateInputSchema: z.ZodType<Prisma.SavedSearchUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  name: z.string(),
  ownerId: z.string(),
  isDefault: z.boolean().optional(),
  agentId: z.union([ z.lazy(() => SavedSearchCreateagentIdInputSchema),z.string().array() ]).optional(),
  lookbackPeriod: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  timeRange: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  chartPeriod: z.number().int(),
  customerCallId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationGroups: z.lazy(() => EvaluationGroupUncheckedCreateNestedManyWithoutSavedSearchInputSchema).optional(),
  alerts: z.lazy(() => AlertUncheckedCreateNestedManyWithoutSavedSearchInputSchema).optional()
}).strict();

export const SavedSearchUpdateInputSchema: z.ZodType<Prisma.SavedSearchUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDefault: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  agentId: z.union([ z.lazy(() => SavedSearchUpdateagentIdInputSchema),z.string().array() ]).optional(),
  lookbackPeriod: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  timeRange: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  chartPeriod: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  customerCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationGroups: z.lazy(() => EvaluationGroupUpdateManyWithoutSavedSearchNestedInputSchema).optional(),
  alerts: z.lazy(() => AlertUpdateManyWithoutSavedSearchNestedInputSchema).optional()
}).strict();

export const SavedSearchUncheckedUpdateInputSchema: z.ZodType<Prisma.SavedSearchUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDefault: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  agentId: z.union([ z.lazy(() => SavedSearchUpdateagentIdInputSchema),z.string().array() ]).optional(),
  lookbackPeriod: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  timeRange: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  chartPeriod: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  customerCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationGroups: z.lazy(() => EvaluationGroupUncheckedUpdateManyWithoutSavedSearchNestedInputSchema).optional(),
  alerts: z.lazy(() => AlertUncheckedUpdateManyWithoutSavedSearchNestedInputSchema).optional()
}).strict();

export const SavedSearchCreateManyInputSchema: z.ZodType<Prisma.SavedSearchCreateManyInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  name: z.string(),
  ownerId: z.string(),
  isDefault: z.boolean().optional(),
  agentId: z.union([ z.lazy(() => SavedSearchCreateagentIdInputSchema),z.string().array() ]).optional(),
  lookbackPeriod: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  timeRange: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  chartPeriod: z.number().int(),
  customerCallId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const SavedSearchUpdateManyMutationInputSchema: z.ZodType<Prisma.SavedSearchUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDefault: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  agentId: z.union([ z.lazy(() => SavedSearchUpdateagentIdInputSchema),z.string().array() ]).optional(),
  lookbackPeriod: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  timeRange: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  chartPeriod: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  customerCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const SavedSearchUncheckedUpdateManyInputSchema: z.ZodType<Prisma.SavedSearchUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDefault: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  agentId: z.union([ z.lazy(() => SavedSearchUpdateagentIdInputSchema),z.string().array() ]).optional(),
  lookbackPeriod: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  timeRange: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  chartPeriod: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  customerCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const AlertCreateInputSchema: z.ZodType<Prisma.AlertCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  ownerId: z.string(),
  name: z.string(),
  type: z.lazy(() => AlertTypeSchema),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  enabled: z.boolean().optional(),
  savedSearch: z.lazy(() => SavedSearchCreateNestedOneWithoutAlertsInputSchema)
}).strict();

export const AlertUncheckedCreateInputSchema: z.ZodType<Prisma.AlertUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  ownerId: z.string(),
  name: z.string(),
  savedSearchId: z.string(),
  type: z.lazy(() => AlertTypeSchema),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  enabled: z.boolean().optional()
}).strict();

export const AlertUpdateInputSchema: z.ZodType<Prisma.AlertUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => AlertTypeSchema),z.lazy(() => EnumAlertTypeFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  savedSearch: z.lazy(() => SavedSearchUpdateOneRequiredWithoutAlertsNestedInputSchema).optional()
}).strict();

export const AlertUncheckedUpdateInputSchema: z.ZodType<Prisma.AlertUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  savedSearchId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => AlertTypeSchema),z.lazy(() => EnumAlertTypeFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AlertCreateManyInputSchema: z.ZodType<Prisma.AlertCreateManyInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  ownerId: z.string(),
  name: z.string(),
  savedSearchId: z.string(),
  type: z.lazy(() => AlertTypeSchema),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  enabled: z.boolean().optional()
}).strict();

export const AlertUpdateManyMutationInputSchema: z.ZodType<Prisma.AlertUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => AlertTypeSchema),z.lazy(() => EnumAlertTypeFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AlertUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AlertUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  savedSearchId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => AlertTypeSchema),z.lazy(() => EnumAlertTypeFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
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

export const ApiKeyCountOrderByAggregateInputSchema: z.ZodType<Prisma.ApiKeyCountOrderByAggregateInput> = z.object({
  orgId: z.lazy(() => SortOrderSchema).optional(),
  apiKey: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ApiKeyMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ApiKeyMaxOrderByAggregateInput> = z.object({
  orgId: z.lazy(() => SortOrderSchema).optional(),
  apiKey: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ApiKeyMinOrderByAggregateInputSchema: z.ZodType<Prisma.ApiKeyMinOrderByAggregateInput> = z.object({
  orgId: z.lazy(() => SortOrderSchema).optional(),
  apiKey: z.lazy(() => SortOrderSchema).optional()
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

export const JsonFilterSchema: z.ZodType<Prisma.JsonFilter> = z.object({
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

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const TestAgentListRelationFilterSchema: z.ZodType<Prisma.TestAgentListRelationFilter> = z.object({
  every: z.lazy(() => TestAgentWhereInputSchema).optional(),
  some: z.lazy(() => TestAgentWhereInputSchema).optional(),
  none: z.lazy(() => TestAgentWhereInputSchema).optional()
}).strict();

export const ScenarioListRelationFilterSchema: z.ZodType<Prisma.ScenarioListRelationFilter> = z.object({
  every: z.lazy(() => ScenarioWhereInputSchema).optional(),
  some: z.lazy(() => ScenarioWhereInputSchema).optional(),
  none: z.lazy(() => ScenarioWhereInputSchema).optional()
}).strict();

export const TestListRelationFilterSchema: z.ZodType<Prisma.TestListRelationFilter> = z.object({
  every: z.lazy(() => TestWhereInputSchema).optional(),
  some: z.lazy(() => TestWhereInputSchema).optional(),
  none: z.lazy(() => TestWhereInputSchema).optional()
}).strict();

export const CallListRelationFilterSchema: z.ZodType<Prisma.CallListRelationFilter> = z.object({
  every: z.lazy(() => CallWhereInputSchema).optional(),
  some: z.lazy(() => CallWhereInputSchema).optional(),
  none: z.lazy(() => CallWhereInputSchema).optional()
}).strict();

export const GeneralEvaluationListRelationFilterSchema: z.ZodType<Prisma.GeneralEvaluationListRelationFilter> = z.object({
  every: z.lazy(() => GeneralEvaluationWhereInputSchema).optional(),
  some: z.lazy(() => GeneralEvaluationWhereInputSchema).optional(),
  none: z.lazy(() => GeneralEvaluationWhereInputSchema).optional()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const TestAgentOrderByRelationAggregateInputSchema: z.ZodType<Prisma.TestAgentOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ScenarioOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ScenarioOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TestOrderByRelationAggregateInputSchema: z.ZodType<Prisma.TestOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CallOrderByRelationAggregateInputSchema: z.ZodType<Prisma.CallOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const GeneralEvaluationOrderByRelationAggregateInputSchema: z.ZodType<Prisma.GeneralEvaluationOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AgentCountOrderByAggregateInputSchema: z.ZodType<Prisma.AgentCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  customerAgentId: z.lazy(() => SortOrderSchema).optional(),
  githubRepoUrl: z.lazy(() => SortOrderSchema).optional(),
  systemPrompt: z.lazy(() => SortOrderSchema).optional(),
  extraProperties: z.lazy(() => SortOrderSchema).optional(),
  enableSlackNotifications: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AgentMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AgentMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  customerAgentId: z.lazy(() => SortOrderSchema).optional(),
  githubRepoUrl: z.lazy(() => SortOrderSchema).optional(),
  systemPrompt: z.lazy(() => SortOrderSchema).optional(),
  enableSlackNotifications: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AgentMinOrderByAggregateInputSchema: z.ZodType<Prisma.AgentMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  customerAgentId: z.lazy(() => SortOrderSchema).optional(),
  githubRepoUrl: z.lazy(() => SortOrderSchema).optional(),
  systemPrompt: z.lazy(() => SortOrderSchema).optional(),
  enableSlackNotifications: z.lazy(() => SortOrderSchema).optional()
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

export const JsonWithAggregatesFilterSchema: z.ZodType<Prisma.JsonWithAggregatesFilter> = z.object({
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
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonFilterSchema).optional()
}).strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const AgentRelationFilterSchema: z.ZodType<Prisma.AgentRelationFilter> = z.object({
  is: z.lazy(() => AgentWhereInputSchema).optional(),
  isNot: z.lazy(() => AgentWhereInputSchema).optional()
}).strict();

export const TestCountOrderByAggregateInputSchema: z.ZodType<Prisma.TestCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  agentId: z.lazy(() => SortOrderSchema).optional(),
  gitBranch: z.lazy(() => SortOrderSchema).optional(),
  gitCommit: z.lazy(() => SortOrderSchema).optional(),
  runFromApi: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TestMaxOrderByAggregateInputSchema: z.ZodType<Prisma.TestMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  agentId: z.lazy(() => SortOrderSchema).optional(),
  gitBranch: z.lazy(() => SortOrderSchema).optional(),
  gitCommit: z.lazy(() => SortOrderSchema).optional(),
  runFromApi: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TestMinOrderByAggregateInputSchema: z.ZodType<Prisma.TestMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  agentId: z.lazy(() => SortOrderSchema).optional(),
  gitBranch: z.lazy(() => SortOrderSchema).optional(),
  gitCommit: z.lazy(() => SortOrderSchema).optional(),
  runFromApi: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const AgentListRelationFilterSchema: z.ZodType<Prisma.AgentListRelationFilter> = z.object({
  every: z.lazy(() => AgentWhereInputSchema).optional(),
  some: z.lazy(() => AgentWhereInputSchema).optional(),
  none: z.lazy(() => AgentWhereInputSchema).optional()
}).strict();

export const AgentOrderByRelationAggregateInputSchema: z.ZodType<Prisma.AgentOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TestAgentCountOrderByAggregateInputSchema: z.ZodType<Prisma.TestAgentCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  headshotUrl: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  prompt: z.lazy(() => SortOrderSchema).optional(),
  enabled: z.lazy(() => SortOrderSchema).optional(),
  defaultSelected: z.lazy(() => SortOrderSchema).optional(),
  order: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TestAgentAvgOrderByAggregateInputSchema: z.ZodType<Prisma.TestAgentAvgOrderByAggregateInput> = z.object({
  order: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TestAgentMaxOrderByAggregateInputSchema: z.ZodType<Prisma.TestAgentMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  headshotUrl: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  prompt: z.lazy(() => SortOrderSchema).optional(),
  enabled: z.lazy(() => SortOrderSchema).optional(),
  defaultSelected: z.lazy(() => SortOrderSchema).optional(),
  order: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TestAgentMinOrderByAggregateInputSchema: z.ZodType<Prisma.TestAgentMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  headshotUrl: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  prompt: z.lazy(() => SortOrderSchema).optional(),
  enabled: z.lazy(() => SortOrderSchema).optional(),
  defaultSelected: z.lazy(() => SortOrderSchema).optional(),
  order: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TestAgentSumOrderByAggregateInputSchema: z.ZodType<Prisma.TestAgentSumOrderByAggregateInput> = z.object({
  order: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const EnumCallStatusFilterSchema: z.ZodType<Prisma.EnumCallStatusFilter> = z.object({
  equals: z.lazy(() => CallStatusSchema).optional(),
  in: z.lazy(() => CallStatusSchema).array().optional(),
  notIn: z.lazy(() => CallStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => NestedEnumCallStatusFilterSchema) ]).optional(),
}).strict();

export const EnumCallResultNullableFilterSchema: z.ZodType<Prisma.EnumCallResultNullableFilter> = z.object({
  equals: z.lazy(() => CallResultSchema).optional().nullable(),
  in: z.lazy(() => CallResultSchema).array().optional().nullable(),
  notIn: z.lazy(() => CallResultSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => NestedEnumCallResultNullableFilterSchema) ]).optional().nullable(),
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

export const FloatNullableFilterSchema: z.ZodType<Prisma.FloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const IntNullableFilterSchema: z.ZodType<Prisma.IntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const BoolNullableFilterSchema: z.ZodType<Prisma.BoolNullableFilter> = z.object({
  equals: z.boolean().optional().nullable(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const AgentNullableRelationFilterSchema: z.ZodType<Prisma.AgentNullableRelationFilter> = z.object({
  is: z.lazy(() => AgentWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => AgentWhereInputSchema).optional().nullable()
}).strict();

export const TestNullableRelationFilterSchema: z.ZodType<Prisma.TestNullableRelationFilter> = z.object({
  is: z.lazy(() => TestWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => TestWhereInputSchema).optional().nullable()
}).strict();

export const TestAgentNullableRelationFilterSchema: z.ZodType<Prisma.TestAgentNullableRelationFilter> = z.object({
  is: z.lazy(() => TestAgentWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => TestAgentWhereInputSchema).optional().nullable()
}).strict();

export const ScenarioNullableRelationFilterSchema: z.ZodType<Prisma.ScenarioNullableRelationFilter> = z.object({
  is: z.lazy(() => ScenarioWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => ScenarioWhereInputSchema).optional().nullable()
}).strict();

export const EvaluationResultListRelationFilterSchema: z.ZodType<Prisma.EvaluationResultListRelationFilter> = z.object({
  every: z.lazy(() => EvaluationResultWhereInputSchema).optional(),
  some: z.lazy(() => EvaluationResultWhereInputSchema).optional(),
  none: z.lazy(() => EvaluationResultWhereInputSchema).optional()
}).strict();

export const MessageListRelationFilterSchema: z.ZodType<Prisma.MessageListRelationFilter> = z.object({
  every: z.lazy(() => MessageWhereInputSchema).optional(),
  some: z.lazy(() => MessageWhereInputSchema).optional(),
  none: z.lazy(() => MessageWhereInputSchema).optional()
}).strict();

export const LatencyBlockListRelationFilterSchema: z.ZodType<Prisma.LatencyBlockListRelationFilter> = z.object({
  every: z.lazy(() => LatencyBlockWhereInputSchema).optional(),
  some: z.lazy(() => LatencyBlockWhereInputSchema).optional(),
  none: z.lazy(() => LatencyBlockWhereInputSchema).optional()
}).strict();

export const InterruptionListRelationFilterSchema: z.ZodType<Prisma.InterruptionListRelationFilter> = z.object({
  every: z.lazy(() => InterruptionWhereInputSchema).optional(),
  some: z.lazy(() => InterruptionWhereInputSchema).optional(),
  none: z.lazy(() => InterruptionWhereInputSchema).optional()
}).strict();

export const CallErrorListRelationFilterSchema: z.ZodType<Prisma.CallErrorListRelationFilter> = z.object({
  every: z.lazy(() => CallErrorWhereInputSchema).optional(),
  some: z.lazy(() => CallErrorWhereInputSchema).optional(),
  none: z.lazy(() => CallErrorWhereInputSchema).optional()
}).strict();

export const EvaluationResultOrderByRelationAggregateInputSchema: z.ZodType<Prisma.EvaluationResultOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MessageOrderByRelationAggregateInputSchema: z.ZodType<Prisma.MessageOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LatencyBlockOrderByRelationAggregateInputSchema: z.ZodType<Prisma.LatencyBlockOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const InterruptionOrderByRelationAggregateInputSchema: z.ZodType<Prisma.InterruptionOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CallErrorOrderByRelationAggregateInputSchema: z.ZodType<Prisma.CallErrorOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CallCountOrderByAggregateInputSchema: z.ZodType<Prisma.CallCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional(),
  vapiCallId: z.lazy(() => SortOrderSchema).optional(),
  customerCallId: z.lazy(() => SortOrderSchema).optional(),
  ofOneDeviceId: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  result: z.lazy(() => SortOrderSchema).optional(),
  failureReason: z.lazy(() => SortOrderSchema).optional(),
  stereoRecordingUrl: z.lazy(() => SortOrderSchema).optional(),
  monoRecordingUrl: z.lazy(() => SortOrderSchema).optional(),
  startedAt: z.lazy(() => SortOrderSchema).optional(),
  endedAt: z.lazy(() => SortOrderSchema).optional(),
  regionId: z.lazy(() => SortOrderSchema).optional(),
  metadata: z.lazy(() => SortOrderSchema).optional(),
  latencyP50: z.lazy(() => SortOrderSchema).optional(),
  latencyP90: z.lazy(() => SortOrderSchema).optional(),
  latencyP95: z.lazy(() => SortOrderSchema).optional(),
  interruptionP50: z.lazy(() => SortOrderSchema).optional(),
  interruptionP90: z.lazy(() => SortOrderSchema).optional(),
  interruptionP95: z.lazy(() => SortOrderSchema).optional(),
  numInterruptions: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional(),
  isRead: z.lazy(() => SortOrderSchema).optional(),
  readBy: z.lazy(() => SortOrderSchema).optional(),
  agentId: z.lazy(() => SortOrderSchema).optional(),
  testId: z.lazy(() => SortOrderSchema).optional(),
  testAgentId: z.lazy(() => SortOrderSchema).optional(),
  scenarioId: z.lazy(() => SortOrderSchema).optional(),
  evalSetToSuccess: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CallAvgOrderByAggregateInputSchema: z.ZodType<Prisma.CallAvgOrderByAggregateInput> = z.object({
  latencyP50: z.lazy(() => SortOrderSchema).optional(),
  latencyP90: z.lazy(() => SortOrderSchema).optional(),
  latencyP95: z.lazy(() => SortOrderSchema).optional(),
  interruptionP50: z.lazy(() => SortOrderSchema).optional(),
  interruptionP90: z.lazy(() => SortOrderSchema).optional(),
  interruptionP95: z.lazy(() => SortOrderSchema).optional(),
  numInterruptions: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CallMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CallMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional(),
  vapiCallId: z.lazy(() => SortOrderSchema).optional(),
  customerCallId: z.lazy(() => SortOrderSchema).optional(),
  ofOneDeviceId: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  result: z.lazy(() => SortOrderSchema).optional(),
  failureReason: z.lazy(() => SortOrderSchema).optional(),
  stereoRecordingUrl: z.lazy(() => SortOrderSchema).optional(),
  monoRecordingUrl: z.lazy(() => SortOrderSchema).optional(),
  startedAt: z.lazy(() => SortOrderSchema).optional(),
  endedAt: z.lazy(() => SortOrderSchema).optional(),
  regionId: z.lazy(() => SortOrderSchema).optional(),
  latencyP50: z.lazy(() => SortOrderSchema).optional(),
  latencyP90: z.lazy(() => SortOrderSchema).optional(),
  latencyP95: z.lazy(() => SortOrderSchema).optional(),
  interruptionP50: z.lazy(() => SortOrderSchema).optional(),
  interruptionP90: z.lazy(() => SortOrderSchema).optional(),
  interruptionP95: z.lazy(() => SortOrderSchema).optional(),
  numInterruptions: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional(),
  isRead: z.lazy(() => SortOrderSchema).optional(),
  readBy: z.lazy(() => SortOrderSchema).optional(),
  agentId: z.lazy(() => SortOrderSchema).optional(),
  testId: z.lazy(() => SortOrderSchema).optional(),
  testAgentId: z.lazy(() => SortOrderSchema).optional(),
  scenarioId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CallMinOrderByAggregateInputSchema: z.ZodType<Prisma.CallMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional(),
  vapiCallId: z.lazy(() => SortOrderSchema).optional(),
  customerCallId: z.lazy(() => SortOrderSchema).optional(),
  ofOneDeviceId: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  result: z.lazy(() => SortOrderSchema).optional(),
  failureReason: z.lazy(() => SortOrderSchema).optional(),
  stereoRecordingUrl: z.lazy(() => SortOrderSchema).optional(),
  monoRecordingUrl: z.lazy(() => SortOrderSchema).optional(),
  startedAt: z.lazy(() => SortOrderSchema).optional(),
  endedAt: z.lazy(() => SortOrderSchema).optional(),
  regionId: z.lazy(() => SortOrderSchema).optional(),
  latencyP50: z.lazy(() => SortOrderSchema).optional(),
  latencyP90: z.lazy(() => SortOrderSchema).optional(),
  latencyP95: z.lazy(() => SortOrderSchema).optional(),
  interruptionP50: z.lazy(() => SortOrderSchema).optional(),
  interruptionP90: z.lazy(() => SortOrderSchema).optional(),
  interruptionP95: z.lazy(() => SortOrderSchema).optional(),
  numInterruptions: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional(),
  isRead: z.lazy(() => SortOrderSchema).optional(),
  readBy: z.lazy(() => SortOrderSchema).optional(),
  agentId: z.lazy(() => SortOrderSchema).optional(),
  testId: z.lazy(() => SortOrderSchema).optional(),
  testAgentId: z.lazy(() => SortOrderSchema).optional(),
  scenarioId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CallSumOrderByAggregateInputSchema: z.ZodType<Prisma.CallSumOrderByAggregateInput> = z.object({
  latencyP50: z.lazy(() => SortOrderSchema).optional(),
  latencyP90: z.lazy(() => SortOrderSchema).optional(),
  latencyP95: z.lazy(() => SortOrderSchema).optional(),
  interruptionP50: z.lazy(() => SortOrderSchema).optional(),
  interruptionP90: z.lazy(() => SortOrderSchema).optional(),
  interruptionP95: z.lazy(() => SortOrderSchema).optional(),
  numInterruptions: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional()
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

export const EnumCallResultNullableWithAggregatesFilterSchema: z.ZodType<Prisma.EnumCallResultNullableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => CallResultSchema).optional().nullable(),
  in: z.lazy(() => CallResultSchema).array().optional().nullable(),
  notIn: z.lazy(() => CallResultSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => NestedEnumCallResultNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumCallResultNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumCallResultNullableFilterSchema).optional()
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

export const FloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.FloatNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional()
}).strict();

export const IntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.IntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();

export const BoolNullableWithAggregatesFilterSchema: z.ZodType<Prisma.BoolNullableWithAggregatesFilter> = z.object({
  equals: z.boolean().optional().nullable(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolNullableFilterSchema).optional()
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
  name: z.lazy(() => SortOrderSchema).optional(),
  result: z.lazy(() => SortOrderSchema).optional(),
  toolCalls: z.lazy(() => SortOrderSchema).optional(),
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
  name: z.lazy(() => SortOrderSchema).optional(),
  result: z.lazy(() => SortOrderSchema).optional(),
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
  name: z.lazy(() => SortOrderSchema).optional(),
  result: z.lazy(() => SortOrderSchema).optional(),
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

export const CallRecordingCountOrderByAggregateInputSchema: z.ZodType<Prisma.CallRecordingCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  audioUrl: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  processed: z.lazy(() => SortOrderSchema).optional(),
  agentId: z.lazy(() => SortOrderSchema).optional(),
  regionId: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CallRecordingAvgOrderByAggregateInputSchema: z.ZodType<Prisma.CallRecordingAvgOrderByAggregateInput> = z.object({
  duration: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CallRecordingMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CallRecordingMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  audioUrl: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  processed: z.lazy(() => SortOrderSchema).optional(),
  agentId: z.lazy(() => SortOrderSchema).optional(),
  regionId: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CallRecordingMinOrderByAggregateInputSchema: z.ZodType<Prisma.CallRecordingMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  audioUrl: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  processed: z.lazy(() => SortOrderSchema).optional(),
  agentId: z.lazy(() => SortOrderSchema).optional(),
  regionId: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CallRecordingSumOrderByAggregateInputSchema: z.ZodType<Prisma.CallRecordingSumOrderByAggregateInput> = z.object({
  duration: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvaluationListRelationFilterSchema: z.ZodType<Prisma.EvaluationListRelationFilter> = z.object({
  every: z.lazy(() => EvaluationWhereInputSchema).optional(),
  some: z.lazy(() => EvaluationWhereInputSchema).optional(),
  none: z.lazy(() => EvaluationWhereInputSchema).optional()
}).strict();

export const EvaluationOrderByRelationAggregateInputSchema: z.ZodType<Prisma.EvaluationOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ScenarioCountOrderByAggregateInputSchema: z.ZodType<Prisma.ScenarioCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  agentId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  instructions: z.lazy(() => SortOrderSchema).optional(),
  successCriteria: z.lazy(() => SortOrderSchema).optional(),
  includeDateTime: z.lazy(() => SortOrderSchema).optional(),
  timezone: z.lazy(() => SortOrderSchema).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ScenarioMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ScenarioMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  agentId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  instructions: z.lazy(() => SortOrderSchema).optional(),
  successCriteria: z.lazy(() => SortOrderSchema).optional(),
  includeDateTime: z.lazy(() => SortOrderSchema).optional(),
  timezone: z.lazy(() => SortOrderSchema).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ScenarioMinOrderByAggregateInputSchema: z.ZodType<Prisma.ScenarioMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  agentId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  instructions: z.lazy(() => SortOrderSchema).optional(),
  successCriteria: z.lazy(() => SortOrderSchema).optional(),
  includeDateTime: z.lazy(() => SortOrderSchema).optional(),
  timezone: z.lazy(() => SortOrderSchema).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringNullableListFilterSchema: z.ZodType<Prisma.StringNullableListFilter> = z.object({
  equals: z.string().array().optional().nullable(),
  has: z.string().optional().nullable(),
  hasEvery: z.string().array().optional(),
  hasSome: z.string().array().optional(),
  isEmpty: z.boolean().optional()
}).strict();

export const EnumEvalTypeFilterSchema: z.ZodType<Prisma.EnumEvalTypeFilter> = z.object({
  equals: z.lazy(() => EvalTypeSchema).optional(),
  in: z.lazy(() => EvalTypeSchema).array().optional(),
  notIn: z.lazy(() => EvalTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => EvalTypeSchema),z.lazy(() => NestedEnumEvalTypeFilterSchema) ]).optional(),
}).strict();

export const EnumEvalResultTypeFilterSchema: z.ZodType<Prisma.EnumEvalResultTypeFilter> = z.object({
  equals: z.lazy(() => EvalResultTypeSchema).optional(),
  in: z.lazy(() => EvalResultTypeSchema).array().optional(),
  notIn: z.lazy(() => EvalResultTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => EvalResultTypeSchema),z.lazy(() => NestedEnumEvalResultTypeFilterSchema) ]).optional(),
}).strict();

export const EnumEvalContentTypeFilterSchema: z.ZodType<Prisma.EnumEvalContentTypeFilter> = z.object({
  equals: z.lazy(() => EvalContentTypeSchema).optional(),
  in: z.lazy(() => EvalContentTypeSchema).array().optional(),
  notIn: z.lazy(() => EvalContentTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => EvalContentTypeSchema),z.lazy(() => NestedEnumEvalContentTypeFilterSchema) ]).optional(),
}).strict();

export const EvaluationTemplateCountOrderByAggregateInputSchema: z.ZodType<Prisma.EvaluationTemplateCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  params: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  resultType: z.lazy(() => SortOrderSchema).optional(),
  contentType: z.lazy(() => SortOrderSchema).optional(),
  toolCallExpectedResult: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvaluationTemplateMaxOrderByAggregateInputSchema: z.ZodType<Prisma.EvaluationTemplateMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  resultType: z.lazy(() => SortOrderSchema).optional(),
  contentType: z.lazy(() => SortOrderSchema).optional(),
  toolCallExpectedResult: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvaluationTemplateMinOrderByAggregateInputSchema: z.ZodType<Prisma.EvaluationTemplateMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  resultType: z.lazy(() => SortOrderSchema).optional(),
  contentType: z.lazy(() => SortOrderSchema).optional(),
  toolCallExpectedResult: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumEvalTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumEvalTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => EvalTypeSchema).optional(),
  in: z.lazy(() => EvalTypeSchema).array().optional(),
  notIn: z.lazy(() => EvalTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => EvalTypeSchema),z.lazy(() => NestedEnumEvalTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumEvalTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumEvalTypeFilterSchema).optional()
}).strict();

export const EnumEvalResultTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumEvalResultTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => EvalResultTypeSchema).optional(),
  in: z.lazy(() => EvalResultTypeSchema).array().optional(),
  notIn: z.lazy(() => EvalResultTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => EvalResultTypeSchema),z.lazy(() => NestedEnumEvalResultTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumEvalResultTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumEvalResultTypeFilterSchema).optional()
}).strict();

export const EnumEvalContentTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumEvalContentTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => EvalContentTypeSchema).optional(),
  in: z.lazy(() => EvalContentTypeSchema).array().optional(),
  notIn: z.lazy(() => EvalContentTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => EvalContentTypeSchema),z.lazy(() => NestedEnumEvalContentTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumEvalContentTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumEvalContentTypeFilterSchema).optional()
}).strict();

export const EvaluationRelationFilterSchema: z.ZodType<Prisma.EvaluationRelationFilter> = z.object({
  is: z.lazy(() => EvaluationWhereInputSchema).optional(),
  isNot: z.lazy(() => EvaluationWhereInputSchema).optional()
}).strict();

export const GeneralEvaluationCountOrderByAggregateInputSchema: z.ZodType<Prisma.GeneralEvaluationCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  agentId: z.lazy(() => SortOrderSchema).optional(),
  evaluationId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const GeneralEvaluationMaxOrderByAggregateInputSchema: z.ZodType<Prisma.GeneralEvaluationMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  agentId: z.lazy(() => SortOrderSchema).optional(),
  evaluationId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const GeneralEvaluationMinOrderByAggregateInputSchema: z.ZodType<Prisma.GeneralEvaluationMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  agentId: z.lazy(() => SortOrderSchema).optional(),
  evaluationId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvaluationTemplateRelationFilterSchema: z.ZodType<Prisma.EvaluationTemplateRelationFilter> = z.object({
  is: z.lazy(() => EvaluationTemplateWhereInputSchema).optional(),
  isNot: z.lazy(() => EvaluationTemplateWhereInputSchema).optional()
}).strict();

export const EvaluationGroupNullableRelationFilterSchema: z.ZodType<Prisma.EvaluationGroupNullableRelationFilter> = z.object({
  is: z.lazy(() => EvaluationGroupWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => EvaluationGroupWhereInputSchema).optional().nullable()
}).strict();

export const EvaluationCountOrderByAggregateInputSchema: z.ZodType<Prisma.EvaluationCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  enabled: z.lazy(() => SortOrderSchema).optional(),
  isCritical: z.lazy(() => SortOrderSchema).optional(),
  params: z.lazy(() => SortOrderSchema).optional(),
  evaluationTemplateId: z.lazy(() => SortOrderSchema).optional(),
  scenarioId: z.lazy(() => SortOrderSchema).optional(),
  evaluationGroupId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvaluationMaxOrderByAggregateInputSchema: z.ZodType<Prisma.EvaluationMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  enabled: z.lazy(() => SortOrderSchema).optional(),
  isCritical: z.lazy(() => SortOrderSchema).optional(),
  evaluationTemplateId: z.lazy(() => SortOrderSchema).optional(),
  scenarioId: z.lazy(() => SortOrderSchema).optional(),
  evaluationGroupId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvaluationMinOrderByAggregateInputSchema: z.ZodType<Prisma.EvaluationMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  enabled: z.lazy(() => SortOrderSchema).optional(),
  isCritical: z.lazy(() => SortOrderSchema).optional(),
  evaluationTemplateId: z.lazy(() => SortOrderSchema).optional(),
  scenarioId: z.lazy(() => SortOrderSchema).optional(),
  evaluationGroupId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CallNullableRelationFilterSchema: z.ZodType<Prisma.CallNullableRelationFilter> = z.object({
  is: z.lazy(() => CallWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => CallWhereInputSchema).optional().nullable()
}).strict();

export const EvaluationTemplateNullableRelationFilterSchema: z.ZodType<Prisma.EvaluationTemplateNullableRelationFilter> = z.object({
  is: z.lazy(() => EvaluationTemplateWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => EvaluationTemplateWhereInputSchema).optional().nullable()
}).strict();

export const EvaluationResultCountOrderByAggregateInputSchema: z.ZodType<Prisma.EvaluationResultCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  callId: z.lazy(() => SortOrderSchema).optional(),
  evaluationId: z.lazy(() => SortOrderSchema).optional(),
  result: z.lazy(() => SortOrderSchema).optional(),
  success: z.lazy(() => SortOrderSchema).optional(),
  secondsFromStart: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  details: z.lazy(() => SortOrderSchema).optional(),
  evaluationTemplateId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvaluationResultAvgOrderByAggregateInputSchema: z.ZodType<Prisma.EvaluationResultAvgOrderByAggregateInput> = z.object({
  secondsFromStart: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvaluationResultMaxOrderByAggregateInputSchema: z.ZodType<Prisma.EvaluationResultMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  callId: z.lazy(() => SortOrderSchema).optional(),
  evaluationId: z.lazy(() => SortOrderSchema).optional(),
  result: z.lazy(() => SortOrderSchema).optional(),
  success: z.lazy(() => SortOrderSchema).optional(),
  secondsFromStart: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  details: z.lazy(() => SortOrderSchema).optional(),
  evaluationTemplateId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvaluationResultMinOrderByAggregateInputSchema: z.ZodType<Prisma.EvaluationResultMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  callId: z.lazy(() => SortOrderSchema).optional(),
  evaluationId: z.lazy(() => SortOrderSchema).optional(),
  result: z.lazy(() => SortOrderSchema).optional(),
  success: z.lazy(() => SortOrderSchema).optional(),
  secondsFromStart: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  details: z.lazy(() => SortOrderSchema).optional(),
  evaluationTemplateId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvaluationResultSumOrderByAggregateInputSchema: z.ZodType<Prisma.EvaluationResultSumOrderByAggregateInput> = z.object({
  secondsFromStart: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LatencyBlockCountOrderByAggregateInputSchema: z.ZodType<Prisma.LatencyBlockCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  secondsFromStart: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional(),
  callId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LatencyBlockAvgOrderByAggregateInputSchema: z.ZodType<Prisma.LatencyBlockAvgOrderByAggregateInput> = z.object({
  secondsFromStart: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LatencyBlockMaxOrderByAggregateInputSchema: z.ZodType<Prisma.LatencyBlockMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  secondsFromStart: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional(),
  callId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LatencyBlockMinOrderByAggregateInputSchema: z.ZodType<Prisma.LatencyBlockMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  secondsFromStart: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional(),
  callId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LatencyBlockSumOrderByAggregateInputSchema: z.ZodType<Prisma.LatencyBlockSumOrderByAggregateInput> = z.object({
  secondsFromStart: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const InterruptionCountOrderByAggregateInputSchema: z.ZodType<Prisma.InterruptionCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  secondsFromStart: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional(),
  callId: z.lazy(() => SortOrderSchema).optional(),
  text: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const InterruptionAvgOrderByAggregateInputSchema: z.ZodType<Prisma.InterruptionAvgOrderByAggregateInput> = z.object({
  secondsFromStart: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const InterruptionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.InterruptionMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  secondsFromStart: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional(),
  callId: z.lazy(() => SortOrderSchema).optional(),
  text: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const InterruptionMinOrderByAggregateInputSchema: z.ZodType<Prisma.InterruptionMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  secondsFromStart: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional(),
  callId: z.lazy(() => SortOrderSchema).optional(),
  text: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const InterruptionSumOrderByAggregateInputSchema: z.ZodType<Prisma.InterruptionSumOrderByAggregateInput> = z.object({
  secondsFromStart: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SavedSearchNullableRelationFilterSchema: z.ZodType<Prisma.SavedSearchNullableRelationFilter> = z.object({
  is: z.lazy(() => SavedSearchWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => SavedSearchWhereInputSchema).optional().nullable()
}).strict();

export const EvaluationGroupCountOrderByAggregateInputSchema: z.ZodType<Prisma.EvaluationGroupCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  condition: z.lazy(() => SortOrderSchema).optional(),
  enabled: z.lazy(() => SortOrderSchema).optional(),
  savedSearchId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvaluationGroupMaxOrderByAggregateInputSchema: z.ZodType<Prisma.EvaluationGroupMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  condition: z.lazy(() => SortOrderSchema).optional(),
  enabled: z.lazy(() => SortOrderSchema).optional(),
  savedSearchId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvaluationGroupMinOrderByAggregateInputSchema: z.ZodType<Prisma.EvaluationGroupMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  condition: z.lazy(() => SortOrderSchema).optional(),
  enabled: z.lazy(() => SortOrderSchema).optional(),
  savedSearchId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvaluationGroupListRelationFilterSchema: z.ZodType<Prisma.EvaluationGroupListRelationFilter> = z.object({
  every: z.lazy(() => EvaluationGroupWhereInputSchema).optional(),
  some: z.lazy(() => EvaluationGroupWhereInputSchema).optional(),
  none: z.lazy(() => EvaluationGroupWhereInputSchema).optional()
}).strict();

export const AlertListRelationFilterSchema: z.ZodType<Prisma.AlertListRelationFilter> = z.object({
  every: z.lazy(() => AlertWhereInputSchema).optional(),
  some: z.lazy(() => AlertWhereInputSchema).optional(),
  none: z.lazy(() => AlertWhereInputSchema).optional()
}).strict();

export const EvaluationGroupOrderByRelationAggregateInputSchema: z.ZodType<Prisma.EvaluationGroupOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AlertOrderByRelationAggregateInputSchema: z.ZodType<Prisma.AlertOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SavedSearchCountOrderByAggregateInputSchema: z.ZodType<Prisma.SavedSearchCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  isDefault: z.lazy(() => SortOrderSchema).optional(),
  agentId: z.lazy(() => SortOrderSchema).optional(),
  lookbackPeriod: z.lazy(() => SortOrderSchema).optional(),
  timeRange: z.lazy(() => SortOrderSchema).optional(),
  chartPeriod: z.lazy(() => SortOrderSchema).optional(),
  customerCallId: z.lazy(() => SortOrderSchema).optional(),
  metadata: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SavedSearchAvgOrderByAggregateInputSchema: z.ZodType<Prisma.SavedSearchAvgOrderByAggregateInput> = z.object({
  chartPeriod: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SavedSearchMaxOrderByAggregateInputSchema: z.ZodType<Prisma.SavedSearchMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  isDefault: z.lazy(() => SortOrderSchema).optional(),
  chartPeriod: z.lazy(() => SortOrderSchema).optional(),
  customerCallId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SavedSearchMinOrderByAggregateInputSchema: z.ZodType<Prisma.SavedSearchMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  isDefault: z.lazy(() => SortOrderSchema).optional(),
  chartPeriod: z.lazy(() => SortOrderSchema).optional(),
  customerCallId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SavedSearchSumOrderByAggregateInputSchema: z.ZodType<Prisma.SavedSearchSumOrderByAggregateInput> = z.object({
  chartPeriod: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumAlertTypeFilterSchema: z.ZodType<Prisma.EnumAlertTypeFilter> = z.object({
  equals: z.lazy(() => AlertTypeSchema).optional(),
  in: z.lazy(() => AlertTypeSchema).array().optional(),
  notIn: z.lazy(() => AlertTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => AlertTypeSchema),z.lazy(() => NestedEnumAlertTypeFilterSchema) ]).optional(),
}).strict();

export const SavedSearchRelationFilterSchema: z.ZodType<Prisma.SavedSearchRelationFilter> = z.object({
  is: z.lazy(() => SavedSearchWhereInputSchema).optional(),
  isNot: z.lazy(() => SavedSearchWhereInputSchema).optional()
}).strict();

export const AlertCountOrderByAggregateInputSchema: z.ZodType<Prisma.AlertCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  savedSearchId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  details: z.lazy(() => SortOrderSchema).optional(),
  enabled: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AlertMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AlertMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  savedSearchId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  enabled: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AlertMinOrderByAggregateInputSchema: z.ZodType<Prisma.AlertMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  savedSearchId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  enabled: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumAlertTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumAlertTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => AlertTypeSchema).optional(),
  in: z.lazy(() => AlertTypeSchema).array().optional(),
  notIn: z.lazy(() => AlertTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => AlertTypeSchema),z.lazy(() => NestedEnumAlertTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumAlertTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumAlertTypeFilterSchema).optional()
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const TestAgentCreateNestedManyWithoutAgentsInputSchema: z.ZodType<Prisma.TestAgentCreateNestedManyWithoutAgentsInput> = z.object({
  create: z.union([ z.lazy(() => TestAgentCreateWithoutAgentsInputSchema),z.lazy(() => TestAgentCreateWithoutAgentsInputSchema).array(),z.lazy(() => TestAgentUncheckedCreateWithoutAgentsInputSchema),z.lazy(() => TestAgentUncheckedCreateWithoutAgentsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TestAgentCreateOrConnectWithoutAgentsInputSchema),z.lazy(() => TestAgentCreateOrConnectWithoutAgentsInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TestAgentWhereUniqueInputSchema),z.lazy(() => TestAgentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ScenarioCreateNestedManyWithoutAgentInputSchema: z.ZodType<Prisma.ScenarioCreateNestedManyWithoutAgentInput> = z.object({
  create: z.union([ z.lazy(() => ScenarioCreateWithoutAgentInputSchema),z.lazy(() => ScenarioCreateWithoutAgentInputSchema).array(),z.lazy(() => ScenarioUncheckedCreateWithoutAgentInputSchema),z.lazy(() => ScenarioUncheckedCreateWithoutAgentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ScenarioCreateOrConnectWithoutAgentInputSchema),z.lazy(() => ScenarioCreateOrConnectWithoutAgentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ScenarioCreateManyAgentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ScenarioWhereUniqueInputSchema),z.lazy(() => ScenarioWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TestCreateNestedManyWithoutAgentInputSchema: z.ZodType<Prisma.TestCreateNestedManyWithoutAgentInput> = z.object({
  create: z.union([ z.lazy(() => TestCreateWithoutAgentInputSchema),z.lazy(() => TestCreateWithoutAgentInputSchema).array(),z.lazy(() => TestUncheckedCreateWithoutAgentInputSchema),z.lazy(() => TestUncheckedCreateWithoutAgentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TestCreateOrConnectWithoutAgentInputSchema),z.lazy(() => TestCreateOrConnectWithoutAgentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TestCreateManyAgentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TestWhereUniqueInputSchema),z.lazy(() => TestWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CallCreateNestedManyWithoutAgentInputSchema: z.ZodType<Prisma.CallCreateNestedManyWithoutAgentInput> = z.object({
  create: z.union([ z.lazy(() => CallCreateWithoutAgentInputSchema),z.lazy(() => CallCreateWithoutAgentInputSchema).array(),z.lazy(() => CallUncheckedCreateWithoutAgentInputSchema),z.lazy(() => CallUncheckedCreateWithoutAgentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CallCreateOrConnectWithoutAgentInputSchema),z.lazy(() => CallCreateOrConnectWithoutAgentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CallCreateManyAgentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const GeneralEvaluationCreateNestedManyWithoutAgentInputSchema: z.ZodType<Prisma.GeneralEvaluationCreateNestedManyWithoutAgentInput> = z.object({
  create: z.union([ z.lazy(() => GeneralEvaluationCreateWithoutAgentInputSchema),z.lazy(() => GeneralEvaluationCreateWithoutAgentInputSchema).array(),z.lazy(() => GeneralEvaluationUncheckedCreateWithoutAgentInputSchema),z.lazy(() => GeneralEvaluationUncheckedCreateWithoutAgentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => GeneralEvaluationCreateOrConnectWithoutAgentInputSchema),z.lazy(() => GeneralEvaluationCreateOrConnectWithoutAgentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => GeneralEvaluationCreateManyAgentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => GeneralEvaluationWhereUniqueInputSchema),z.lazy(() => GeneralEvaluationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TestAgentUncheckedCreateNestedManyWithoutAgentsInputSchema: z.ZodType<Prisma.TestAgentUncheckedCreateNestedManyWithoutAgentsInput> = z.object({
  create: z.union([ z.lazy(() => TestAgentCreateWithoutAgentsInputSchema),z.lazy(() => TestAgentCreateWithoutAgentsInputSchema).array(),z.lazy(() => TestAgentUncheckedCreateWithoutAgentsInputSchema),z.lazy(() => TestAgentUncheckedCreateWithoutAgentsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TestAgentCreateOrConnectWithoutAgentsInputSchema),z.lazy(() => TestAgentCreateOrConnectWithoutAgentsInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TestAgentWhereUniqueInputSchema),z.lazy(() => TestAgentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ScenarioUncheckedCreateNestedManyWithoutAgentInputSchema: z.ZodType<Prisma.ScenarioUncheckedCreateNestedManyWithoutAgentInput> = z.object({
  create: z.union([ z.lazy(() => ScenarioCreateWithoutAgentInputSchema),z.lazy(() => ScenarioCreateWithoutAgentInputSchema).array(),z.lazy(() => ScenarioUncheckedCreateWithoutAgentInputSchema),z.lazy(() => ScenarioUncheckedCreateWithoutAgentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ScenarioCreateOrConnectWithoutAgentInputSchema),z.lazy(() => ScenarioCreateOrConnectWithoutAgentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ScenarioCreateManyAgentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ScenarioWhereUniqueInputSchema),z.lazy(() => ScenarioWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TestUncheckedCreateNestedManyWithoutAgentInputSchema: z.ZodType<Prisma.TestUncheckedCreateNestedManyWithoutAgentInput> = z.object({
  create: z.union([ z.lazy(() => TestCreateWithoutAgentInputSchema),z.lazy(() => TestCreateWithoutAgentInputSchema).array(),z.lazy(() => TestUncheckedCreateWithoutAgentInputSchema),z.lazy(() => TestUncheckedCreateWithoutAgentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TestCreateOrConnectWithoutAgentInputSchema),z.lazy(() => TestCreateOrConnectWithoutAgentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TestCreateManyAgentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TestWhereUniqueInputSchema),z.lazy(() => TestWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CallUncheckedCreateNestedManyWithoutAgentInputSchema: z.ZodType<Prisma.CallUncheckedCreateNestedManyWithoutAgentInput> = z.object({
  create: z.union([ z.lazy(() => CallCreateWithoutAgentInputSchema),z.lazy(() => CallCreateWithoutAgentInputSchema).array(),z.lazy(() => CallUncheckedCreateWithoutAgentInputSchema),z.lazy(() => CallUncheckedCreateWithoutAgentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CallCreateOrConnectWithoutAgentInputSchema),z.lazy(() => CallCreateOrConnectWithoutAgentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CallCreateManyAgentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const GeneralEvaluationUncheckedCreateNestedManyWithoutAgentInputSchema: z.ZodType<Prisma.GeneralEvaluationUncheckedCreateNestedManyWithoutAgentInput> = z.object({
  create: z.union([ z.lazy(() => GeneralEvaluationCreateWithoutAgentInputSchema),z.lazy(() => GeneralEvaluationCreateWithoutAgentInputSchema).array(),z.lazy(() => GeneralEvaluationUncheckedCreateWithoutAgentInputSchema),z.lazy(() => GeneralEvaluationUncheckedCreateWithoutAgentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => GeneralEvaluationCreateOrConnectWithoutAgentInputSchema),z.lazy(() => GeneralEvaluationCreateOrConnectWithoutAgentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => GeneralEvaluationCreateManyAgentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => GeneralEvaluationWhereUniqueInputSchema),z.lazy(() => GeneralEvaluationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict();

export const TestAgentUpdateManyWithoutAgentsNestedInputSchema: z.ZodType<Prisma.TestAgentUpdateManyWithoutAgentsNestedInput> = z.object({
  create: z.union([ z.lazy(() => TestAgentCreateWithoutAgentsInputSchema),z.lazy(() => TestAgentCreateWithoutAgentsInputSchema).array(),z.lazy(() => TestAgentUncheckedCreateWithoutAgentsInputSchema),z.lazy(() => TestAgentUncheckedCreateWithoutAgentsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TestAgentCreateOrConnectWithoutAgentsInputSchema),z.lazy(() => TestAgentCreateOrConnectWithoutAgentsInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TestAgentUpsertWithWhereUniqueWithoutAgentsInputSchema),z.lazy(() => TestAgentUpsertWithWhereUniqueWithoutAgentsInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => TestAgentWhereUniqueInputSchema),z.lazy(() => TestAgentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TestAgentWhereUniqueInputSchema),z.lazy(() => TestAgentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TestAgentWhereUniqueInputSchema),z.lazy(() => TestAgentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TestAgentWhereUniqueInputSchema),z.lazy(() => TestAgentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TestAgentUpdateWithWhereUniqueWithoutAgentsInputSchema),z.lazy(() => TestAgentUpdateWithWhereUniqueWithoutAgentsInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TestAgentUpdateManyWithWhereWithoutAgentsInputSchema),z.lazy(() => TestAgentUpdateManyWithWhereWithoutAgentsInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TestAgentScalarWhereInputSchema),z.lazy(() => TestAgentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ScenarioUpdateManyWithoutAgentNestedInputSchema: z.ZodType<Prisma.ScenarioUpdateManyWithoutAgentNestedInput> = z.object({
  create: z.union([ z.lazy(() => ScenarioCreateWithoutAgentInputSchema),z.lazy(() => ScenarioCreateWithoutAgentInputSchema).array(),z.lazy(() => ScenarioUncheckedCreateWithoutAgentInputSchema),z.lazy(() => ScenarioUncheckedCreateWithoutAgentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ScenarioCreateOrConnectWithoutAgentInputSchema),z.lazy(() => ScenarioCreateOrConnectWithoutAgentInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ScenarioUpsertWithWhereUniqueWithoutAgentInputSchema),z.lazy(() => ScenarioUpsertWithWhereUniqueWithoutAgentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ScenarioCreateManyAgentInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ScenarioWhereUniqueInputSchema),z.lazy(() => ScenarioWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ScenarioWhereUniqueInputSchema),z.lazy(() => ScenarioWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ScenarioWhereUniqueInputSchema),z.lazy(() => ScenarioWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ScenarioWhereUniqueInputSchema),z.lazy(() => ScenarioWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ScenarioUpdateWithWhereUniqueWithoutAgentInputSchema),z.lazy(() => ScenarioUpdateWithWhereUniqueWithoutAgentInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ScenarioUpdateManyWithWhereWithoutAgentInputSchema),z.lazy(() => ScenarioUpdateManyWithWhereWithoutAgentInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ScenarioScalarWhereInputSchema),z.lazy(() => ScenarioScalarWhereInputSchema).array() ]).optional(),
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

export const CallUpdateManyWithoutAgentNestedInputSchema: z.ZodType<Prisma.CallUpdateManyWithoutAgentNestedInput> = z.object({
  create: z.union([ z.lazy(() => CallCreateWithoutAgentInputSchema),z.lazy(() => CallCreateWithoutAgentInputSchema).array(),z.lazy(() => CallUncheckedCreateWithoutAgentInputSchema),z.lazy(() => CallUncheckedCreateWithoutAgentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CallCreateOrConnectWithoutAgentInputSchema),z.lazy(() => CallCreateOrConnectWithoutAgentInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CallUpsertWithWhereUniqueWithoutAgentInputSchema),z.lazy(() => CallUpsertWithWhereUniqueWithoutAgentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CallCreateManyAgentInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CallUpdateWithWhereUniqueWithoutAgentInputSchema),z.lazy(() => CallUpdateWithWhereUniqueWithoutAgentInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CallUpdateManyWithWhereWithoutAgentInputSchema),z.lazy(() => CallUpdateManyWithWhereWithoutAgentInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CallScalarWhereInputSchema),z.lazy(() => CallScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const GeneralEvaluationUpdateManyWithoutAgentNestedInputSchema: z.ZodType<Prisma.GeneralEvaluationUpdateManyWithoutAgentNestedInput> = z.object({
  create: z.union([ z.lazy(() => GeneralEvaluationCreateWithoutAgentInputSchema),z.lazy(() => GeneralEvaluationCreateWithoutAgentInputSchema).array(),z.lazy(() => GeneralEvaluationUncheckedCreateWithoutAgentInputSchema),z.lazy(() => GeneralEvaluationUncheckedCreateWithoutAgentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => GeneralEvaluationCreateOrConnectWithoutAgentInputSchema),z.lazy(() => GeneralEvaluationCreateOrConnectWithoutAgentInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => GeneralEvaluationUpsertWithWhereUniqueWithoutAgentInputSchema),z.lazy(() => GeneralEvaluationUpsertWithWhereUniqueWithoutAgentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => GeneralEvaluationCreateManyAgentInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => GeneralEvaluationWhereUniqueInputSchema),z.lazy(() => GeneralEvaluationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => GeneralEvaluationWhereUniqueInputSchema),z.lazy(() => GeneralEvaluationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => GeneralEvaluationWhereUniqueInputSchema),z.lazy(() => GeneralEvaluationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => GeneralEvaluationWhereUniqueInputSchema),z.lazy(() => GeneralEvaluationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => GeneralEvaluationUpdateWithWhereUniqueWithoutAgentInputSchema),z.lazy(() => GeneralEvaluationUpdateWithWhereUniqueWithoutAgentInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => GeneralEvaluationUpdateManyWithWhereWithoutAgentInputSchema),z.lazy(() => GeneralEvaluationUpdateManyWithWhereWithoutAgentInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => GeneralEvaluationScalarWhereInputSchema),z.lazy(() => GeneralEvaluationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TestAgentUncheckedUpdateManyWithoutAgentsNestedInputSchema: z.ZodType<Prisma.TestAgentUncheckedUpdateManyWithoutAgentsNestedInput> = z.object({
  create: z.union([ z.lazy(() => TestAgentCreateWithoutAgentsInputSchema),z.lazy(() => TestAgentCreateWithoutAgentsInputSchema).array(),z.lazy(() => TestAgentUncheckedCreateWithoutAgentsInputSchema),z.lazy(() => TestAgentUncheckedCreateWithoutAgentsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TestAgentCreateOrConnectWithoutAgentsInputSchema),z.lazy(() => TestAgentCreateOrConnectWithoutAgentsInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TestAgentUpsertWithWhereUniqueWithoutAgentsInputSchema),z.lazy(() => TestAgentUpsertWithWhereUniqueWithoutAgentsInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => TestAgentWhereUniqueInputSchema),z.lazy(() => TestAgentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TestAgentWhereUniqueInputSchema),z.lazy(() => TestAgentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TestAgentWhereUniqueInputSchema),z.lazy(() => TestAgentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TestAgentWhereUniqueInputSchema),z.lazy(() => TestAgentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TestAgentUpdateWithWhereUniqueWithoutAgentsInputSchema),z.lazy(() => TestAgentUpdateWithWhereUniqueWithoutAgentsInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TestAgentUpdateManyWithWhereWithoutAgentsInputSchema),z.lazy(() => TestAgentUpdateManyWithWhereWithoutAgentsInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TestAgentScalarWhereInputSchema),z.lazy(() => TestAgentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ScenarioUncheckedUpdateManyWithoutAgentNestedInputSchema: z.ZodType<Prisma.ScenarioUncheckedUpdateManyWithoutAgentNestedInput> = z.object({
  create: z.union([ z.lazy(() => ScenarioCreateWithoutAgentInputSchema),z.lazy(() => ScenarioCreateWithoutAgentInputSchema).array(),z.lazy(() => ScenarioUncheckedCreateWithoutAgentInputSchema),z.lazy(() => ScenarioUncheckedCreateWithoutAgentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ScenarioCreateOrConnectWithoutAgentInputSchema),z.lazy(() => ScenarioCreateOrConnectWithoutAgentInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ScenarioUpsertWithWhereUniqueWithoutAgentInputSchema),z.lazy(() => ScenarioUpsertWithWhereUniqueWithoutAgentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ScenarioCreateManyAgentInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ScenarioWhereUniqueInputSchema),z.lazy(() => ScenarioWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ScenarioWhereUniqueInputSchema),z.lazy(() => ScenarioWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ScenarioWhereUniqueInputSchema),z.lazy(() => ScenarioWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ScenarioWhereUniqueInputSchema),z.lazy(() => ScenarioWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ScenarioUpdateWithWhereUniqueWithoutAgentInputSchema),z.lazy(() => ScenarioUpdateWithWhereUniqueWithoutAgentInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ScenarioUpdateManyWithWhereWithoutAgentInputSchema),z.lazy(() => ScenarioUpdateManyWithWhereWithoutAgentInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ScenarioScalarWhereInputSchema),z.lazy(() => ScenarioScalarWhereInputSchema).array() ]).optional(),
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

export const CallUncheckedUpdateManyWithoutAgentNestedInputSchema: z.ZodType<Prisma.CallUncheckedUpdateManyWithoutAgentNestedInput> = z.object({
  create: z.union([ z.lazy(() => CallCreateWithoutAgentInputSchema),z.lazy(() => CallCreateWithoutAgentInputSchema).array(),z.lazy(() => CallUncheckedCreateWithoutAgentInputSchema),z.lazy(() => CallUncheckedCreateWithoutAgentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CallCreateOrConnectWithoutAgentInputSchema),z.lazy(() => CallCreateOrConnectWithoutAgentInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CallUpsertWithWhereUniqueWithoutAgentInputSchema),z.lazy(() => CallUpsertWithWhereUniqueWithoutAgentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CallCreateManyAgentInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CallUpdateWithWhereUniqueWithoutAgentInputSchema),z.lazy(() => CallUpdateWithWhereUniqueWithoutAgentInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CallUpdateManyWithWhereWithoutAgentInputSchema),z.lazy(() => CallUpdateManyWithWhereWithoutAgentInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CallScalarWhereInputSchema),z.lazy(() => CallScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const GeneralEvaluationUncheckedUpdateManyWithoutAgentNestedInputSchema: z.ZodType<Prisma.GeneralEvaluationUncheckedUpdateManyWithoutAgentNestedInput> = z.object({
  create: z.union([ z.lazy(() => GeneralEvaluationCreateWithoutAgentInputSchema),z.lazy(() => GeneralEvaluationCreateWithoutAgentInputSchema).array(),z.lazy(() => GeneralEvaluationUncheckedCreateWithoutAgentInputSchema),z.lazy(() => GeneralEvaluationUncheckedCreateWithoutAgentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => GeneralEvaluationCreateOrConnectWithoutAgentInputSchema),z.lazy(() => GeneralEvaluationCreateOrConnectWithoutAgentInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => GeneralEvaluationUpsertWithWhereUniqueWithoutAgentInputSchema),z.lazy(() => GeneralEvaluationUpsertWithWhereUniqueWithoutAgentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => GeneralEvaluationCreateManyAgentInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => GeneralEvaluationWhereUniqueInputSchema),z.lazy(() => GeneralEvaluationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => GeneralEvaluationWhereUniqueInputSchema),z.lazy(() => GeneralEvaluationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => GeneralEvaluationWhereUniqueInputSchema),z.lazy(() => GeneralEvaluationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => GeneralEvaluationWhereUniqueInputSchema),z.lazy(() => GeneralEvaluationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => GeneralEvaluationUpdateWithWhereUniqueWithoutAgentInputSchema),z.lazy(() => GeneralEvaluationUpdateWithWhereUniqueWithoutAgentInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => GeneralEvaluationUpdateManyWithWhereWithoutAgentInputSchema),z.lazy(() => GeneralEvaluationUpdateManyWithWhereWithoutAgentInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => GeneralEvaluationScalarWhereInputSchema),z.lazy(() => GeneralEvaluationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AgentCreateNestedOneWithoutTestsInputSchema: z.ZodType<Prisma.AgentCreateNestedOneWithoutTestsInput> = z.object({
  create: z.union([ z.lazy(() => AgentCreateWithoutTestsInputSchema),z.lazy(() => AgentUncheckedCreateWithoutTestsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AgentCreateOrConnectWithoutTestsInputSchema).optional(),
  connect: z.lazy(() => AgentWhereUniqueInputSchema).optional()
}).strict();

export const CallCreateNestedManyWithoutTestInputSchema: z.ZodType<Prisma.CallCreateNestedManyWithoutTestInput> = z.object({
  create: z.union([ z.lazy(() => CallCreateWithoutTestInputSchema),z.lazy(() => CallCreateWithoutTestInputSchema).array(),z.lazy(() => CallUncheckedCreateWithoutTestInputSchema),z.lazy(() => CallUncheckedCreateWithoutTestInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CallCreateOrConnectWithoutTestInputSchema),z.lazy(() => CallCreateOrConnectWithoutTestInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CallCreateManyTestInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
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

export const AgentCreateNestedManyWithoutEnabledTestAgentsInputSchema: z.ZodType<Prisma.AgentCreateNestedManyWithoutEnabledTestAgentsInput> = z.object({
  create: z.union([ z.lazy(() => AgentCreateWithoutEnabledTestAgentsInputSchema),z.lazy(() => AgentCreateWithoutEnabledTestAgentsInputSchema).array(),z.lazy(() => AgentUncheckedCreateWithoutEnabledTestAgentsInputSchema),z.lazy(() => AgentUncheckedCreateWithoutEnabledTestAgentsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AgentCreateOrConnectWithoutEnabledTestAgentsInputSchema),z.lazy(() => AgentCreateOrConnectWithoutEnabledTestAgentsInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AgentWhereUniqueInputSchema),z.lazy(() => AgentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CallCreateNestedManyWithoutTestAgentInputSchema: z.ZodType<Prisma.CallCreateNestedManyWithoutTestAgentInput> = z.object({
  create: z.union([ z.lazy(() => CallCreateWithoutTestAgentInputSchema),z.lazy(() => CallCreateWithoutTestAgentInputSchema).array(),z.lazy(() => CallUncheckedCreateWithoutTestAgentInputSchema),z.lazy(() => CallUncheckedCreateWithoutTestAgentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CallCreateOrConnectWithoutTestAgentInputSchema),z.lazy(() => CallCreateOrConnectWithoutTestAgentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CallCreateManyTestAgentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AgentUncheckedCreateNestedManyWithoutEnabledTestAgentsInputSchema: z.ZodType<Prisma.AgentUncheckedCreateNestedManyWithoutEnabledTestAgentsInput> = z.object({
  create: z.union([ z.lazy(() => AgentCreateWithoutEnabledTestAgentsInputSchema),z.lazy(() => AgentCreateWithoutEnabledTestAgentsInputSchema).array(),z.lazy(() => AgentUncheckedCreateWithoutEnabledTestAgentsInputSchema),z.lazy(() => AgentUncheckedCreateWithoutEnabledTestAgentsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AgentCreateOrConnectWithoutEnabledTestAgentsInputSchema),z.lazy(() => AgentCreateOrConnectWithoutEnabledTestAgentsInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AgentWhereUniqueInputSchema),z.lazy(() => AgentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CallUncheckedCreateNestedManyWithoutTestAgentInputSchema: z.ZodType<Prisma.CallUncheckedCreateNestedManyWithoutTestAgentInput> = z.object({
  create: z.union([ z.lazy(() => CallCreateWithoutTestAgentInputSchema),z.lazy(() => CallCreateWithoutTestAgentInputSchema).array(),z.lazy(() => CallUncheckedCreateWithoutTestAgentInputSchema),z.lazy(() => CallUncheckedCreateWithoutTestAgentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CallCreateOrConnectWithoutTestAgentInputSchema),z.lazy(() => CallCreateOrConnectWithoutTestAgentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CallCreateManyTestAgentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const AgentUpdateManyWithoutEnabledTestAgentsNestedInputSchema: z.ZodType<Prisma.AgentUpdateManyWithoutEnabledTestAgentsNestedInput> = z.object({
  create: z.union([ z.lazy(() => AgentCreateWithoutEnabledTestAgentsInputSchema),z.lazy(() => AgentCreateWithoutEnabledTestAgentsInputSchema).array(),z.lazy(() => AgentUncheckedCreateWithoutEnabledTestAgentsInputSchema),z.lazy(() => AgentUncheckedCreateWithoutEnabledTestAgentsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AgentCreateOrConnectWithoutEnabledTestAgentsInputSchema),z.lazy(() => AgentCreateOrConnectWithoutEnabledTestAgentsInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AgentUpsertWithWhereUniqueWithoutEnabledTestAgentsInputSchema),z.lazy(() => AgentUpsertWithWhereUniqueWithoutEnabledTestAgentsInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => AgentWhereUniqueInputSchema),z.lazy(() => AgentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AgentWhereUniqueInputSchema),z.lazy(() => AgentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AgentWhereUniqueInputSchema),z.lazy(() => AgentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AgentWhereUniqueInputSchema),z.lazy(() => AgentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AgentUpdateWithWhereUniqueWithoutEnabledTestAgentsInputSchema),z.lazy(() => AgentUpdateWithWhereUniqueWithoutEnabledTestAgentsInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AgentUpdateManyWithWhereWithoutEnabledTestAgentsInputSchema),z.lazy(() => AgentUpdateManyWithWhereWithoutEnabledTestAgentsInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AgentScalarWhereInputSchema),z.lazy(() => AgentScalarWhereInputSchema).array() ]).optional(),
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

export const AgentUncheckedUpdateManyWithoutEnabledTestAgentsNestedInputSchema: z.ZodType<Prisma.AgentUncheckedUpdateManyWithoutEnabledTestAgentsNestedInput> = z.object({
  create: z.union([ z.lazy(() => AgentCreateWithoutEnabledTestAgentsInputSchema),z.lazy(() => AgentCreateWithoutEnabledTestAgentsInputSchema).array(),z.lazy(() => AgentUncheckedCreateWithoutEnabledTestAgentsInputSchema),z.lazy(() => AgentUncheckedCreateWithoutEnabledTestAgentsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AgentCreateOrConnectWithoutEnabledTestAgentsInputSchema),z.lazy(() => AgentCreateOrConnectWithoutEnabledTestAgentsInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AgentUpsertWithWhereUniqueWithoutEnabledTestAgentsInputSchema),z.lazy(() => AgentUpsertWithWhereUniqueWithoutEnabledTestAgentsInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => AgentWhereUniqueInputSchema),z.lazy(() => AgentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AgentWhereUniqueInputSchema),z.lazy(() => AgentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AgentWhereUniqueInputSchema),z.lazy(() => AgentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AgentWhereUniqueInputSchema),z.lazy(() => AgentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AgentUpdateWithWhereUniqueWithoutEnabledTestAgentsInputSchema),z.lazy(() => AgentUpdateWithWhereUniqueWithoutEnabledTestAgentsInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AgentUpdateManyWithWhereWithoutEnabledTestAgentsInputSchema),z.lazy(() => AgentUpdateManyWithWhereWithoutEnabledTestAgentsInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AgentScalarWhereInputSchema),z.lazy(() => AgentScalarWhereInputSchema).array() ]).optional(),
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

export const AgentCreateNestedOneWithoutCallsInputSchema: z.ZodType<Prisma.AgentCreateNestedOneWithoutCallsInput> = z.object({
  create: z.union([ z.lazy(() => AgentCreateWithoutCallsInputSchema),z.lazy(() => AgentUncheckedCreateWithoutCallsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AgentCreateOrConnectWithoutCallsInputSchema).optional(),
  connect: z.lazy(() => AgentWhereUniqueInputSchema).optional()
}).strict();

export const TestCreateNestedOneWithoutCallsInputSchema: z.ZodType<Prisma.TestCreateNestedOneWithoutCallsInput> = z.object({
  create: z.union([ z.lazy(() => TestCreateWithoutCallsInputSchema),z.lazy(() => TestUncheckedCreateWithoutCallsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TestCreateOrConnectWithoutCallsInputSchema).optional(),
  connect: z.lazy(() => TestWhereUniqueInputSchema).optional()
}).strict();

export const TestAgentCreateNestedOneWithoutCallsInputSchema: z.ZodType<Prisma.TestAgentCreateNestedOneWithoutCallsInput> = z.object({
  create: z.union([ z.lazy(() => TestAgentCreateWithoutCallsInputSchema),z.lazy(() => TestAgentUncheckedCreateWithoutCallsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TestAgentCreateOrConnectWithoutCallsInputSchema).optional(),
  connect: z.lazy(() => TestAgentWhereUniqueInputSchema).optional()
}).strict();

export const ScenarioCreateNestedOneWithoutCallsInputSchema: z.ZodType<Prisma.ScenarioCreateNestedOneWithoutCallsInput> = z.object({
  create: z.union([ z.lazy(() => ScenarioCreateWithoutCallsInputSchema),z.lazy(() => ScenarioUncheckedCreateWithoutCallsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ScenarioCreateOrConnectWithoutCallsInputSchema).optional(),
  connect: z.lazy(() => ScenarioWhereUniqueInputSchema).optional()
}).strict();

export const EvaluationResultCreateNestedManyWithoutCallInputSchema: z.ZodType<Prisma.EvaluationResultCreateNestedManyWithoutCallInput> = z.object({
  create: z.union([ z.lazy(() => EvaluationResultCreateWithoutCallInputSchema),z.lazy(() => EvaluationResultCreateWithoutCallInputSchema).array(),z.lazy(() => EvaluationResultUncheckedCreateWithoutCallInputSchema),z.lazy(() => EvaluationResultUncheckedCreateWithoutCallInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EvaluationResultCreateOrConnectWithoutCallInputSchema),z.lazy(() => EvaluationResultCreateOrConnectWithoutCallInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EvaluationResultCreateManyCallInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => EvaluationResultWhereUniqueInputSchema),z.lazy(() => EvaluationResultWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const MessageCreateNestedManyWithoutCallInputSchema: z.ZodType<Prisma.MessageCreateNestedManyWithoutCallInput> = z.object({
  create: z.union([ z.lazy(() => MessageCreateWithoutCallInputSchema),z.lazy(() => MessageCreateWithoutCallInputSchema).array(),z.lazy(() => MessageUncheckedCreateWithoutCallInputSchema),z.lazy(() => MessageUncheckedCreateWithoutCallInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MessageCreateOrConnectWithoutCallInputSchema),z.lazy(() => MessageCreateOrConnectWithoutCallInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MessageCreateManyCallInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MessageWhereUniqueInputSchema),z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const LatencyBlockCreateNestedManyWithoutCallInputSchema: z.ZodType<Prisma.LatencyBlockCreateNestedManyWithoutCallInput> = z.object({
  create: z.union([ z.lazy(() => LatencyBlockCreateWithoutCallInputSchema),z.lazy(() => LatencyBlockCreateWithoutCallInputSchema).array(),z.lazy(() => LatencyBlockUncheckedCreateWithoutCallInputSchema),z.lazy(() => LatencyBlockUncheckedCreateWithoutCallInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LatencyBlockCreateOrConnectWithoutCallInputSchema),z.lazy(() => LatencyBlockCreateOrConnectWithoutCallInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LatencyBlockCreateManyCallInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => LatencyBlockWhereUniqueInputSchema),z.lazy(() => LatencyBlockWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const InterruptionCreateNestedManyWithoutCallInputSchema: z.ZodType<Prisma.InterruptionCreateNestedManyWithoutCallInput> = z.object({
  create: z.union([ z.lazy(() => InterruptionCreateWithoutCallInputSchema),z.lazy(() => InterruptionCreateWithoutCallInputSchema).array(),z.lazy(() => InterruptionUncheckedCreateWithoutCallInputSchema),z.lazy(() => InterruptionUncheckedCreateWithoutCallInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => InterruptionCreateOrConnectWithoutCallInputSchema),z.lazy(() => InterruptionCreateOrConnectWithoutCallInputSchema).array() ]).optional(),
  createMany: z.lazy(() => InterruptionCreateManyCallInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => InterruptionWhereUniqueInputSchema),z.lazy(() => InterruptionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CallErrorCreateNestedManyWithoutCallInputSchema: z.ZodType<Prisma.CallErrorCreateNestedManyWithoutCallInput> = z.object({
  create: z.union([ z.lazy(() => CallErrorCreateWithoutCallInputSchema),z.lazy(() => CallErrorCreateWithoutCallInputSchema).array(),z.lazy(() => CallErrorUncheckedCreateWithoutCallInputSchema),z.lazy(() => CallErrorUncheckedCreateWithoutCallInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CallErrorCreateOrConnectWithoutCallInputSchema),z.lazy(() => CallErrorCreateOrConnectWithoutCallInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CallErrorCreateManyCallInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CallErrorWhereUniqueInputSchema),z.lazy(() => CallErrorWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EvaluationResultUncheckedCreateNestedManyWithoutCallInputSchema: z.ZodType<Prisma.EvaluationResultUncheckedCreateNestedManyWithoutCallInput> = z.object({
  create: z.union([ z.lazy(() => EvaluationResultCreateWithoutCallInputSchema),z.lazy(() => EvaluationResultCreateWithoutCallInputSchema).array(),z.lazy(() => EvaluationResultUncheckedCreateWithoutCallInputSchema),z.lazy(() => EvaluationResultUncheckedCreateWithoutCallInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EvaluationResultCreateOrConnectWithoutCallInputSchema),z.lazy(() => EvaluationResultCreateOrConnectWithoutCallInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EvaluationResultCreateManyCallInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => EvaluationResultWhereUniqueInputSchema),z.lazy(() => EvaluationResultWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const MessageUncheckedCreateNestedManyWithoutCallInputSchema: z.ZodType<Prisma.MessageUncheckedCreateNestedManyWithoutCallInput> = z.object({
  create: z.union([ z.lazy(() => MessageCreateWithoutCallInputSchema),z.lazy(() => MessageCreateWithoutCallInputSchema).array(),z.lazy(() => MessageUncheckedCreateWithoutCallInputSchema),z.lazy(() => MessageUncheckedCreateWithoutCallInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MessageCreateOrConnectWithoutCallInputSchema),z.lazy(() => MessageCreateOrConnectWithoutCallInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MessageCreateManyCallInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MessageWhereUniqueInputSchema),z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const LatencyBlockUncheckedCreateNestedManyWithoutCallInputSchema: z.ZodType<Prisma.LatencyBlockUncheckedCreateNestedManyWithoutCallInput> = z.object({
  create: z.union([ z.lazy(() => LatencyBlockCreateWithoutCallInputSchema),z.lazy(() => LatencyBlockCreateWithoutCallInputSchema).array(),z.lazy(() => LatencyBlockUncheckedCreateWithoutCallInputSchema),z.lazy(() => LatencyBlockUncheckedCreateWithoutCallInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LatencyBlockCreateOrConnectWithoutCallInputSchema),z.lazy(() => LatencyBlockCreateOrConnectWithoutCallInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LatencyBlockCreateManyCallInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => LatencyBlockWhereUniqueInputSchema),z.lazy(() => LatencyBlockWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const InterruptionUncheckedCreateNestedManyWithoutCallInputSchema: z.ZodType<Prisma.InterruptionUncheckedCreateNestedManyWithoutCallInput> = z.object({
  create: z.union([ z.lazy(() => InterruptionCreateWithoutCallInputSchema),z.lazy(() => InterruptionCreateWithoutCallInputSchema).array(),z.lazy(() => InterruptionUncheckedCreateWithoutCallInputSchema),z.lazy(() => InterruptionUncheckedCreateWithoutCallInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => InterruptionCreateOrConnectWithoutCallInputSchema),z.lazy(() => InterruptionCreateOrConnectWithoutCallInputSchema).array() ]).optional(),
  createMany: z.lazy(() => InterruptionCreateManyCallInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => InterruptionWhereUniqueInputSchema),z.lazy(() => InterruptionWhereUniqueInputSchema).array() ]).optional(),
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

export const NullableEnumCallResultFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableEnumCallResultFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => CallResultSchema).optional().nullable()
}).strict();

export const NullableFloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableFloatFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const NullableIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableIntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const NullableBoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableBoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional().nullable()
}).strict();

export const AgentUpdateOneWithoutCallsNestedInputSchema: z.ZodType<Prisma.AgentUpdateOneWithoutCallsNestedInput> = z.object({
  create: z.union([ z.lazy(() => AgentCreateWithoutCallsInputSchema),z.lazy(() => AgentUncheckedCreateWithoutCallsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AgentCreateOrConnectWithoutCallsInputSchema).optional(),
  upsert: z.lazy(() => AgentUpsertWithoutCallsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => AgentWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => AgentWhereInputSchema) ]).optional(),
  connect: z.lazy(() => AgentWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => AgentUpdateToOneWithWhereWithoutCallsInputSchema),z.lazy(() => AgentUpdateWithoutCallsInputSchema),z.lazy(() => AgentUncheckedUpdateWithoutCallsInputSchema) ]).optional(),
}).strict();

export const TestUpdateOneWithoutCallsNestedInputSchema: z.ZodType<Prisma.TestUpdateOneWithoutCallsNestedInput> = z.object({
  create: z.union([ z.lazy(() => TestCreateWithoutCallsInputSchema),z.lazy(() => TestUncheckedCreateWithoutCallsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TestCreateOrConnectWithoutCallsInputSchema).optional(),
  upsert: z.lazy(() => TestUpsertWithoutCallsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => TestWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => TestWhereInputSchema) ]).optional(),
  connect: z.lazy(() => TestWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => TestUpdateToOneWithWhereWithoutCallsInputSchema),z.lazy(() => TestUpdateWithoutCallsInputSchema),z.lazy(() => TestUncheckedUpdateWithoutCallsInputSchema) ]).optional(),
}).strict();

export const TestAgentUpdateOneWithoutCallsNestedInputSchema: z.ZodType<Prisma.TestAgentUpdateOneWithoutCallsNestedInput> = z.object({
  create: z.union([ z.lazy(() => TestAgentCreateWithoutCallsInputSchema),z.lazy(() => TestAgentUncheckedCreateWithoutCallsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TestAgentCreateOrConnectWithoutCallsInputSchema).optional(),
  upsert: z.lazy(() => TestAgentUpsertWithoutCallsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => TestAgentWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => TestAgentWhereInputSchema) ]).optional(),
  connect: z.lazy(() => TestAgentWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => TestAgentUpdateToOneWithWhereWithoutCallsInputSchema),z.lazy(() => TestAgentUpdateWithoutCallsInputSchema),z.lazy(() => TestAgentUncheckedUpdateWithoutCallsInputSchema) ]).optional(),
}).strict();

export const ScenarioUpdateOneWithoutCallsNestedInputSchema: z.ZodType<Prisma.ScenarioUpdateOneWithoutCallsNestedInput> = z.object({
  create: z.union([ z.lazy(() => ScenarioCreateWithoutCallsInputSchema),z.lazy(() => ScenarioUncheckedCreateWithoutCallsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ScenarioCreateOrConnectWithoutCallsInputSchema).optional(),
  upsert: z.lazy(() => ScenarioUpsertWithoutCallsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ScenarioWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ScenarioWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ScenarioWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ScenarioUpdateToOneWithWhereWithoutCallsInputSchema),z.lazy(() => ScenarioUpdateWithoutCallsInputSchema),z.lazy(() => ScenarioUncheckedUpdateWithoutCallsInputSchema) ]).optional(),
}).strict();

export const EvaluationResultUpdateManyWithoutCallNestedInputSchema: z.ZodType<Prisma.EvaluationResultUpdateManyWithoutCallNestedInput> = z.object({
  create: z.union([ z.lazy(() => EvaluationResultCreateWithoutCallInputSchema),z.lazy(() => EvaluationResultCreateWithoutCallInputSchema).array(),z.lazy(() => EvaluationResultUncheckedCreateWithoutCallInputSchema),z.lazy(() => EvaluationResultUncheckedCreateWithoutCallInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EvaluationResultCreateOrConnectWithoutCallInputSchema),z.lazy(() => EvaluationResultCreateOrConnectWithoutCallInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => EvaluationResultUpsertWithWhereUniqueWithoutCallInputSchema),z.lazy(() => EvaluationResultUpsertWithWhereUniqueWithoutCallInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EvaluationResultCreateManyCallInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => EvaluationResultWhereUniqueInputSchema),z.lazy(() => EvaluationResultWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => EvaluationResultWhereUniqueInputSchema),z.lazy(() => EvaluationResultWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => EvaluationResultWhereUniqueInputSchema),z.lazy(() => EvaluationResultWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => EvaluationResultWhereUniqueInputSchema),z.lazy(() => EvaluationResultWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => EvaluationResultUpdateWithWhereUniqueWithoutCallInputSchema),z.lazy(() => EvaluationResultUpdateWithWhereUniqueWithoutCallInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => EvaluationResultUpdateManyWithWhereWithoutCallInputSchema),z.lazy(() => EvaluationResultUpdateManyWithWhereWithoutCallInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => EvaluationResultScalarWhereInputSchema),z.lazy(() => EvaluationResultScalarWhereInputSchema).array() ]).optional(),
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

export const LatencyBlockUpdateManyWithoutCallNestedInputSchema: z.ZodType<Prisma.LatencyBlockUpdateManyWithoutCallNestedInput> = z.object({
  create: z.union([ z.lazy(() => LatencyBlockCreateWithoutCallInputSchema),z.lazy(() => LatencyBlockCreateWithoutCallInputSchema).array(),z.lazy(() => LatencyBlockUncheckedCreateWithoutCallInputSchema),z.lazy(() => LatencyBlockUncheckedCreateWithoutCallInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LatencyBlockCreateOrConnectWithoutCallInputSchema),z.lazy(() => LatencyBlockCreateOrConnectWithoutCallInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => LatencyBlockUpsertWithWhereUniqueWithoutCallInputSchema),z.lazy(() => LatencyBlockUpsertWithWhereUniqueWithoutCallInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LatencyBlockCreateManyCallInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => LatencyBlockWhereUniqueInputSchema),z.lazy(() => LatencyBlockWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => LatencyBlockWhereUniqueInputSchema),z.lazy(() => LatencyBlockWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => LatencyBlockWhereUniqueInputSchema),z.lazy(() => LatencyBlockWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => LatencyBlockWhereUniqueInputSchema),z.lazy(() => LatencyBlockWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => LatencyBlockUpdateWithWhereUniqueWithoutCallInputSchema),z.lazy(() => LatencyBlockUpdateWithWhereUniqueWithoutCallInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => LatencyBlockUpdateManyWithWhereWithoutCallInputSchema),z.lazy(() => LatencyBlockUpdateManyWithWhereWithoutCallInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => LatencyBlockScalarWhereInputSchema),z.lazy(() => LatencyBlockScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const InterruptionUpdateManyWithoutCallNestedInputSchema: z.ZodType<Prisma.InterruptionUpdateManyWithoutCallNestedInput> = z.object({
  create: z.union([ z.lazy(() => InterruptionCreateWithoutCallInputSchema),z.lazy(() => InterruptionCreateWithoutCallInputSchema).array(),z.lazy(() => InterruptionUncheckedCreateWithoutCallInputSchema),z.lazy(() => InterruptionUncheckedCreateWithoutCallInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => InterruptionCreateOrConnectWithoutCallInputSchema),z.lazy(() => InterruptionCreateOrConnectWithoutCallInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => InterruptionUpsertWithWhereUniqueWithoutCallInputSchema),z.lazy(() => InterruptionUpsertWithWhereUniqueWithoutCallInputSchema).array() ]).optional(),
  createMany: z.lazy(() => InterruptionCreateManyCallInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => InterruptionWhereUniqueInputSchema),z.lazy(() => InterruptionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => InterruptionWhereUniqueInputSchema),z.lazy(() => InterruptionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => InterruptionWhereUniqueInputSchema),z.lazy(() => InterruptionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => InterruptionWhereUniqueInputSchema),z.lazy(() => InterruptionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => InterruptionUpdateWithWhereUniqueWithoutCallInputSchema),z.lazy(() => InterruptionUpdateWithWhereUniqueWithoutCallInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => InterruptionUpdateManyWithWhereWithoutCallInputSchema),z.lazy(() => InterruptionUpdateManyWithWhereWithoutCallInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => InterruptionScalarWhereInputSchema),z.lazy(() => InterruptionScalarWhereInputSchema).array() ]).optional(),
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

export const EvaluationResultUncheckedUpdateManyWithoutCallNestedInputSchema: z.ZodType<Prisma.EvaluationResultUncheckedUpdateManyWithoutCallNestedInput> = z.object({
  create: z.union([ z.lazy(() => EvaluationResultCreateWithoutCallInputSchema),z.lazy(() => EvaluationResultCreateWithoutCallInputSchema).array(),z.lazy(() => EvaluationResultUncheckedCreateWithoutCallInputSchema),z.lazy(() => EvaluationResultUncheckedCreateWithoutCallInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EvaluationResultCreateOrConnectWithoutCallInputSchema),z.lazy(() => EvaluationResultCreateOrConnectWithoutCallInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => EvaluationResultUpsertWithWhereUniqueWithoutCallInputSchema),z.lazy(() => EvaluationResultUpsertWithWhereUniqueWithoutCallInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EvaluationResultCreateManyCallInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => EvaluationResultWhereUniqueInputSchema),z.lazy(() => EvaluationResultWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => EvaluationResultWhereUniqueInputSchema),z.lazy(() => EvaluationResultWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => EvaluationResultWhereUniqueInputSchema),z.lazy(() => EvaluationResultWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => EvaluationResultWhereUniqueInputSchema),z.lazy(() => EvaluationResultWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => EvaluationResultUpdateWithWhereUniqueWithoutCallInputSchema),z.lazy(() => EvaluationResultUpdateWithWhereUniqueWithoutCallInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => EvaluationResultUpdateManyWithWhereWithoutCallInputSchema),z.lazy(() => EvaluationResultUpdateManyWithWhereWithoutCallInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => EvaluationResultScalarWhereInputSchema),z.lazy(() => EvaluationResultScalarWhereInputSchema).array() ]).optional(),
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

export const LatencyBlockUncheckedUpdateManyWithoutCallNestedInputSchema: z.ZodType<Prisma.LatencyBlockUncheckedUpdateManyWithoutCallNestedInput> = z.object({
  create: z.union([ z.lazy(() => LatencyBlockCreateWithoutCallInputSchema),z.lazy(() => LatencyBlockCreateWithoutCallInputSchema).array(),z.lazy(() => LatencyBlockUncheckedCreateWithoutCallInputSchema),z.lazy(() => LatencyBlockUncheckedCreateWithoutCallInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LatencyBlockCreateOrConnectWithoutCallInputSchema),z.lazy(() => LatencyBlockCreateOrConnectWithoutCallInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => LatencyBlockUpsertWithWhereUniqueWithoutCallInputSchema),z.lazy(() => LatencyBlockUpsertWithWhereUniqueWithoutCallInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LatencyBlockCreateManyCallInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => LatencyBlockWhereUniqueInputSchema),z.lazy(() => LatencyBlockWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => LatencyBlockWhereUniqueInputSchema),z.lazy(() => LatencyBlockWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => LatencyBlockWhereUniqueInputSchema),z.lazy(() => LatencyBlockWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => LatencyBlockWhereUniqueInputSchema),z.lazy(() => LatencyBlockWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => LatencyBlockUpdateWithWhereUniqueWithoutCallInputSchema),z.lazy(() => LatencyBlockUpdateWithWhereUniqueWithoutCallInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => LatencyBlockUpdateManyWithWhereWithoutCallInputSchema),z.lazy(() => LatencyBlockUpdateManyWithWhereWithoutCallInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => LatencyBlockScalarWhereInputSchema),z.lazy(() => LatencyBlockScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const InterruptionUncheckedUpdateManyWithoutCallNestedInputSchema: z.ZodType<Prisma.InterruptionUncheckedUpdateManyWithoutCallNestedInput> = z.object({
  create: z.union([ z.lazy(() => InterruptionCreateWithoutCallInputSchema),z.lazy(() => InterruptionCreateWithoutCallInputSchema).array(),z.lazy(() => InterruptionUncheckedCreateWithoutCallInputSchema),z.lazy(() => InterruptionUncheckedCreateWithoutCallInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => InterruptionCreateOrConnectWithoutCallInputSchema),z.lazy(() => InterruptionCreateOrConnectWithoutCallInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => InterruptionUpsertWithWhereUniqueWithoutCallInputSchema),z.lazy(() => InterruptionUpsertWithWhereUniqueWithoutCallInputSchema).array() ]).optional(),
  createMany: z.lazy(() => InterruptionCreateManyCallInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => InterruptionWhereUniqueInputSchema),z.lazy(() => InterruptionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => InterruptionWhereUniqueInputSchema),z.lazy(() => InterruptionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => InterruptionWhereUniqueInputSchema),z.lazy(() => InterruptionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => InterruptionWhereUniqueInputSchema),z.lazy(() => InterruptionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => InterruptionUpdateWithWhereUniqueWithoutCallInputSchema),z.lazy(() => InterruptionUpdateWithWhereUniqueWithoutCallInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => InterruptionUpdateManyWithWhereWithoutCallInputSchema),z.lazy(() => InterruptionUpdateManyWithWhereWithoutCallInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => InterruptionScalarWhereInputSchema),z.lazy(() => InterruptionScalarWhereInputSchema).array() ]).optional(),
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

export const AgentCreateNestedOneWithoutScenariosInputSchema: z.ZodType<Prisma.AgentCreateNestedOneWithoutScenariosInput> = z.object({
  create: z.union([ z.lazy(() => AgentCreateWithoutScenariosInputSchema),z.lazy(() => AgentUncheckedCreateWithoutScenariosInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AgentCreateOrConnectWithoutScenariosInputSchema).optional(),
  connect: z.lazy(() => AgentWhereUniqueInputSchema).optional()
}).strict();

export const CallCreateNestedManyWithoutScenarioInputSchema: z.ZodType<Prisma.CallCreateNestedManyWithoutScenarioInput> = z.object({
  create: z.union([ z.lazy(() => CallCreateWithoutScenarioInputSchema),z.lazy(() => CallCreateWithoutScenarioInputSchema).array(),z.lazy(() => CallUncheckedCreateWithoutScenarioInputSchema),z.lazy(() => CallUncheckedCreateWithoutScenarioInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CallCreateOrConnectWithoutScenarioInputSchema),z.lazy(() => CallCreateOrConnectWithoutScenarioInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CallCreateManyScenarioInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EvaluationCreateNestedManyWithoutScenarioInputSchema: z.ZodType<Prisma.EvaluationCreateNestedManyWithoutScenarioInput> = z.object({
  create: z.union([ z.lazy(() => EvaluationCreateWithoutScenarioInputSchema),z.lazy(() => EvaluationCreateWithoutScenarioInputSchema).array(),z.lazy(() => EvaluationUncheckedCreateWithoutScenarioInputSchema),z.lazy(() => EvaluationUncheckedCreateWithoutScenarioInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EvaluationCreateOrConnectWithoutScenarioInputSchema),z.lazy(() => EvaluationCreateOrConnectWithoutScenarioInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EvaluationCreateManyScenarioInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => EvaluationWhereUniqueInputSchema),z.lazy(() => EvaluationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CallUncheckedCreateNestedManyWithoutScenarioInputSchema: z.ZodType<Prisma.CallUncheckedCreateNestedManyWithoutScenarioInput> = z.object({
  create: z.union([ z.lazy(() => CallCreateWithoutScenarioInputSchema),z.lazy(() => CallCreateWithoutScenarioInputSchema).array(),z.lazy(() => CallUncheckedCreateWithoutScenarioInputSchema),z.lazy(() => CallUncheckedCreateWithoutScenarioInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CallCreateOrConnectWithoutScenarioInputSchema),z.lazy(() => CallCreateOrConnectWithoutScenarioInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CallCreateManyScenarioInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EvaluationUncheckedCreateNestedManyWithoutScenarioInputSchema: z.ZodType<Prisma.EvaluationUncheckedCreateNestedManyWithoutScenarioInput> = z.object({
  create: z.union([ z.lazy(() => EvaluationCreateWithoutScenarioInputSchema),z.lazy(() => EvaluationCreateWithoutScenarioInputSchema).array(),z.lazy(() => EvaluationUncheckedCreateWithoutScenarioInputSchema),z.lazy(() => EvaluationUncheckedCreateWithoutScenarioInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EvaluationCreateOrConnectWithoutScenarioInputSchema),z.lazy(() => EvaluationCreateOrConnectWithoutScenarioInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EvaluationCreateManyScenarioInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => EvaluationWhereUniqueInputSchema),z.lazy(() => EvaluationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AgentUpdateOneRequiredWithoutScenariosNestedInputSchema: z.ZodType<Prisma.AgentUpdateOneRequiredWithoutScenariosNestedInput> = z.object({
  create: z.union([ z.lazy(() => AgentCreateWithoutScenariosInputSchema),z.lazy(() => AgentUncheckedCreateWithoutScenariosInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AgentCreateOrConnectWithoutScenariosInputSchema).optional(),
  upsert: z.lazy(() => AgentUpsertWithoutScenariosInputSchema).optional(),
  connect: z.lazy(() => AgentWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => AgentUpdateToOneWithWhereWithoutScenariosInputSchema),z.lazy(() => AgentUpdateWithoutScenariosInputSchema),z.lazy(() => AgentUncheckedUpdateWithoutScenariosInputSchema) ]).optional(),
}).strict();

export const CallUpdateManyWithoutScenarioNestedInputSchema: z.ZodType<Prisma.CallUpdateManyWithoutScenarioNestedInput> = z.object({
  create: z.union([ z.lazy(() => CallCreateWithoutScenarioInputSchema),z.lazy(() => CallCreateWithoutScenarioInputSchema).array(),z.lazy(() => CallUncheckedCreateWithoutScenarioInputSchema),z.lazy(() => CallUncheckedCreateWithoutScenarioInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CallCreateOrConnectWithoutScenarioInputSchema),z.lazy(() => CallCreateOrConnectWithoutScenarioInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CallUpsertWithWhereUniqueWithoutScenarioInputSchema),z.lazy(() => CallUpsertWithWhereUniqueWithoutScenarioInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CallCreateManyScenarioInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CallUpdateWithWhereUniqueWithoutScenarioInputSchema),z.lazy(() => CallUpdateWithWhereUniqueWithoutScenarioInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CallUpdateManyWithWhereWithoutScenarioInputSchema),z.lazy(() => CallUpdateManyWithWhereWithoutScenarioInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CallScalarWhereInputSchema),z.lazy(() => CallScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const EvaluationUpdateManyWithoutScenarioNestedInputSchema: z.ZodType<Prisma.EvaluationUpdateManyWithoutScenarioNestedInput> = z.object({
  create: z.union([ z.lazy(() => EvaluationCreateWithoutScenarioInputSchema),z.lazy(() => EvaluationCreateWithoutScenarioInputSchema).array(),z.lazy(() => EvaluationUncheckedCreateWithoutScenarioInputSchema),z.lazy(() => EvaluationUncheckedCreateWithoutScenarioInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EvaluationCreateOrConnectWithoutScenarioInputSchema),z.lazy(() => EvaluationCreateOrConnectWithoutScenarioInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => EvaluationUpsertWithWhereUniqueWithoutScenarioInputSchema),z.lazy(() => EvaluationUpsertWithWhereUniqueWithoutScenarioInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EvaluationCreateManyScenarioInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => EvaluationWhereUniqueInputSchema),z.lazy(() => EvaluationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => EvaluationWhereUniqueInputSchema),z.lazy(() => EvaluationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => EvaluationWhereUniqueInputSchema),z.lazy(() => EvaluationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => EvaluationWhereUniqueInputSchema),z.lazy(() => EvaluationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => EvaluationUpdateWithWhereUniqueWithoutScenarioInputSchema),z.lazy(() => EvaluationUpdateWithWhereUniqueWithoutScenarioInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => EvaluationUpdateManyWithWhereWithoutScenarioInputSchema),z.lazy(() => EvaluationUpdateManyWithWhereWithoutScenarioInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => EvaluationScalarWhereInputSchema),z.lazy(() => EvaluationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CallUncheckedUpdateManyWithoutScenarioNestedInputSchema: z.ZodType<Prisma.CallUncheckedUpdateManyWithoutScenarioNestedInput> = z.object({
  create: z.union([ z.lazy(() => CallCreateWithoutScenarioInputSchema),z.lazy(() => CallCreateWithoutScenarioInputSchema).array(),z.lazy(() => CallUncheckedCreateWithoutScenarioInputSchema),z.lazy(() => CallUncheckedCreateWithoutScenarioInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CallCreateOrConnectWithoutScenarioInputSchema),z.lazy(() => CallCreateOrConnectWithoutScenarioInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CallUpsertWithWhereUniqueWithoutScenarioInputSchema),z.lazy(() => CallUpsertWithWhereUniqueWithoutScenarioInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CallCreateManyScenarioInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CallUpdateWithWhereUniqueWithoutScenarioInputSchema),z.lazy(() => CallUpdateWithWhereUniqueWithoutScenarioInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CallUpdateManyWithWhereWithoutScenarioInputSchema),z.lazy(() => CallUpdateManyWithWhereWithoutScenarioInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CallScalarWhereInputSchema),z.lazy(() => CallScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const EvaluationUncheckedUpdateManyWithoutScenarioNestedInputSchema: z.ZodType<Prisma.EvaluationUncheckedUpdateManyWithoutScenarioNestedInput> = z.object({
  create: z.union([ z.lazy(() => EvaluationCreateWithoutScenarioInputSchema),z.lazy(() => EvaluationCreateWithoutScenarioInputSchema).array(),z.lazy(() => EvaluationUncheckedCreateWithoutScenarioInputSchema),z.lazy(() => EvaluationUncheckedCreateWithoutScenarioInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EvaluationCreateOrConnectWithoutScenarioInputSchema),z.lazy(() => EvaluationCreateOrConnectWithoutScenarioInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => EvaluationUpsertWithWhereUniqueWithoutScenarioInputSchema),z.lazy(() => EvaluationUpsertWithWhereUniqueWithoutScenarioInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EvaluationCreateManyScenarioInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => EvaluationWhereUniqueInputSchema),z.lazy(() => EvaluationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => EvaluationWhereUniqueInputSchema),z.lazy(() => EvaluationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => EvaluationWhereUniqueInputSchema),z.lazy(() => EvaluationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => EvaluationWhereUniqueInputSchema),z.lazy(() => EvaluationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => EvaluationUpdateWithWhereUniqueWithoutScenarioInputSchema),z.lazy(() => EvaluationUpdateWithWhereUniqueWithoutScenarioInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => EvaluationUpdateManyWithWhereWithoutScenarioInputSchema),z.lazy(() => EvaluationUpdateManyWithWhereWithoutScenarioInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => EvaluationScalarWhereInputSchema),z.lazy(() => EvaluationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const EvaluationTemplateCreateparamsInputSchema: z.ZodType<Prisma.EvaluationTemplateCreateparamsInput> = z.object({
  set: z.string().array()
}).strict();

export const EvaluationResultCreateNestedManyWithoutEvaluationTemplateInputSchema: z.ZodType<Prisma.EvaluationResultCreateNestedManyWithoutEvaluationTemplateInput> = z.object({
  create: z.union([ z.lazy(() => EvaluationResultCreateWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationResultCreateWithoutEvaluationTemplateInputSchema).array(),z.lazy(() => EvaluationResultUncheckedCreateWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationResultUncheckedCreateWithoutEvaluationTemplateInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EvaluationResultCreateOrConnectWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationResultCreateOrConnectWithoutEvaluationTemplateInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EvaluationResultCreateManyEvaluationTemplateInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => EvaluationResultWhereUniqueInputSchema),z.lazy(() => EvaluationResultWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EvaluationCreateNestedManyWithoutEvaluationTemplateInputSchema: z.ZodType<Prisma.EvaluationCreateNestedManyWithoutEvaluationTemplateInput> = z.object({
  create: z.union([ z.lazy(() => EvaluationCreateWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationCreateWithoutEvaluationTemplateInputSchema).array(),z.lazy(() => EvaluationUncheckedCreateWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationUncheckedCreateWithoutEvaluationTemplateInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EvaluationCreateOrConnectWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationCreateOrConnectWithoutEvaluationTemplateInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EvaluationCreateManyEvaluationTemplateInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => EvaluationWhereUniqueInputSchema),z.lazy(() => EvaluationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EvaluationResultUncheckedCreateNestedManyWithoutEvaluationTemplateInputSchema: z.ZodType<Prisma.EvaluationResultUncheckedCreateNestedManyWithoutEvaluationTemplateInput> = z.object({
  create: z.union([ z.lazy(() => EvaluationResultCreateWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationResultCreateWithoutEvaluationTemplateInputSchema).array(),z.lazy(() => EvaluationResultUncheckedCreateWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationResultUncheckedCreateWithoutEvaluationTemplateInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EvaluationResultCreateOrConnectWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationResultCreateOrConnectWithoutEvaluationTemplateInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EvaluationResultCreateManyEvaluationTemplateInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => EvaluationResultWhereUniqueInputSchema),z.lazy(() => EvaluationResultWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EvaluationUncheckedCreateNestedManyWithoutEvaluationTemplateInputSchema: z.ZodType<Prisma.EvaluationUncheckedCreateNestedManyWithoutEvaluationTemplateInput> = z.object({
  create: z.union([ z.lazy(() => EvaluationCreateWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationCreateWithoutEvaluationTemplateInputSchema).array(),z.lazy(() => EvaluationUncheckedCreateWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationUncheckedCreateWithoutEvaluationTemplateInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EvaluationCreateOrConnectWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationCreateOrConnectWithoutEvaluationTemplateInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EvaluationCreateManyEvaluationTemplateInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => EvaluationWhereUniqueInputSchema),z.lazy(() => EvaluationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EvaluationTemplateUpdateparamsInputSchema: z.ZodType<Prisma.EvaluationTemplateUpdateparamsInput> = z.object({
  set: z.string().array().optional(),
  push: z.union([ z.string(),z.string().array() ]).optional(),
}).strict();

export const EnumEvalTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumEvalTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => EvalTypeSchema).optional()
}).strict();

export const EnumEvalResultTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumEvalResultTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => EvalResultTypeSchema).optional()
}).strict();

export const EnumEvalContentTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumEvalContentTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => EvalContentTypeSchema).optional()
}).strict();

export const EvaluationResultUpdateManyWithoutEvaluationTemplateNestedInputSchema: z.ZodType<Prisma.EvaluationResultUpdateManyWithoutEvaluationTemplateNestedInput> = z.object({
  create: z.union([ z.lazy(() => EvaluationResultCreateWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationResultCreateWithoutEvaluationTemplateInputSchema).array(),z.lazy(() => EvaluationResultUncheckedCreateWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationResultUncheckedCreateWithoutEvaluationTemplateInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EvaluationResultCreateOrConnectWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationResultCreateOrConnectWithoutEvaluationTemplateInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => EvaluationResultUpsertWithWhereUniqueWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationResultUpsertWithWhereUniqueWithoutEvaluationTemplateInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EvaluationResultCreateManyEvaluationTemplateInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => EvaluationResultWhereUniqueInputSchema),z.lazy(() => EvaluationResultWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => EvaluationResultWhereUniqueInputSchema),z.lazy(() => EvaluationResultWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => EvaluationResultWhereUniqueInputSchema),z.lazy(() => EvaluationResultWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => EvaluationResultWhereUniqueInputSchema),z.lazy(() => EvaluationResultWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => EvaluationResultUpdateWithWhereUniqueWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationResultUpdateWithWhereUniqueWithoutEvaluationTemplateInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => EvaluationResultUpdateManyWithWhereWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationResultUpdateManyWithWhereWithoutEvaluationTemplateInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => EvaluationResultScalarWhereInputSchema),z.lazy(() => EvaluationResultScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const EvaluationUpdateManyWithoutEvaluationTemplateNestedInputSchema: z.ZodType<Prisma.EvaluationUpdateManyWithoutEvaluationTemplateNestedInput> = z.object({
  create: z.union([ z.lazy(() => EvaluationCreateWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationCreateWithoutEvaluationTemplateInputSchema).array(),z.lazy(() => EvaluationUncheckedCreateWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationUncheckedCreateWithoutEvaluationTemplateInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EvaluationCreateOrConnectWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationCreateOrConnectWithoutEvaluationTemplateInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => EvaluationUpsertWithWhereUniqueWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationUpsertWithWhereUniqueWithoutEvaluationTemplateInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EvaluationCreateManyEvaluationTemplateInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => EvaluationWhereUniqueInputSchema),z.lazy(() => EvaluationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => EvaluationWhereUniqueInputSchema),z.lazy(() => EvaluationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => EvaluationWhereUniqueInputSchema),z.lazy(() => EvaluationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => EvaluationWhereUniqueInputSchema),z.lazy(() => EvaluationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => EvaluationUpdateWithWhereUniqueWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationUpdateWithWhereUniqueWithoutEvaluationTemplateInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => EvaluationUpdateManyWithWhereWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationUpdateManyWithWhereWithoutEvaluationTemplateInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => EvaluationScalarWhereInputSchema),z.lazy(() => EvaluationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const EvaluationResultUncheckedUpdateManyWithoutEvaluationTemplateNestedInputSchema: z.ZodType<Prisma.EvaluationResultUncheckedUpdateManyWithoutEvaluationTemplateNestedInput> = z.object({
  create: z.union([ z.lazy(() => EvaluationResultCreateWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationResultCreateWithoutEvaluationTemplateInputSchema).array(),z.lazy(() => EvaluationResultUncheckedCreateWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationResultUncheckedCreateWithoutEvaluationTemplateInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EvaluationResultCreateOrConnectWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationResultCreateOrConnectWithoutEvaluationTemplateInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => EvaluationResultUpsertWithWhereUniqueWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationResultUpsertWithWhereUniqueWithoutEvaluationTemplateInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EvaluationResultCreateManyEvaluationTemplateInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => EvaluationResultWhereUniqueInputSchema),z.lazy(() => EvaluationResultWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => EvaluationResultWhereUniqueInputSchema),z.lazy(() => EvaluationResultWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => EvaluationResultWhereUniqueInputSchema),z.lazy(() => EvaluationResultWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => EvaluationResultWhereUniqueInputSchema),z.lazy(() => EvaluationResultWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => EvaluationResultUpdateWithWhereUniqueWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationResultUpdateWithWhereUniqueWithoutEvaluationTemplateInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => EvaluationResultUpdateManyWithWhereWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationResultUpdateManyWithWhereWithoutEvaluationTemplateInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => EvaluationResultScalarWhereInputSchema),z.lazy(() => EvaluationResultScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const EvaluationUncheckedUpdateManyWithoutEvaluationTemplateNestedInputSchema: z.ZodType<Prisma.EvaluationUncheckedUpdateManyWithoutEvaluationTemplateNestedInput> = z.object({
  create: z.union([ z.lazy(() => EvaluationCreateWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationCreateWithoutEvaluationTemplateInputSchema).array(),z.lazy(() => EvaluationUncheckedCreateWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationUncheckedCreateWithoutEvaluationTemplateInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EvaluationCreateOrConnectWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationCreateOrConnectWithoutEvaluationTemplateInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => EvaluationUpsertWithWhereUniqueWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationUpsertWithWhereUniqueWithoutEvaluationTemplateInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EvaluationCreateManyEvaluationTemplateInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => EvaluationWhereUniqueInputSchema),z.lazy(() => EvaluationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => EvaluationWhereUniqueInputSchema),z.lazy(() => EvaluationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => EvaluationWhereUniqueInputSchema),z.lazy(() => EvaluationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => EvaluationWhereUniqueInputSchema),z.lazy(() => EvaluationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => EvaluationUpdateWithWhereUniqueWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationUpdateWithWhereUniqueWithoutEvaluationTemplateInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => EvaluationUpdateManyWithWhereWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationUpdateManyWithWhereWithoutEvaluationTemplateInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => EvaluationScalarWhereInputSchema),z.lazy(() => EvaluationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AgentCreateNestedOneWithoutGeneralEvaluationsInputSchema: z.ZodType<Prisma.AgentCreateNestedOneWithoutGeneralEvaluationsInput> = z.object({
  create: z.union([ z.lazy(() => AgentCreateWithoutGeneralEvaluationsInputSchema),z.lazy(() => AgentUncheckedCreateWithoutGeneralEvaluationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AgentCreateOrConnectWithoutGeneralEvaluationsInputSchema).optional(),
  connect: z.lazy(() => AgentWhereUniqueInputSchema).optional()
}).strict();

export const EvaluationCreateNestedOneWithoutGeneralEvaluationsInputSchema: z.ZodType<Prisma.EvaluationCreateNestedOneWithoutGeneralEvaluationsInput> = z.object({
  create: z.union([ z.lazy(() => EvaluationCreateWithoutGeneralEvaluationsInputSchema),z.lazy(() => EvaluationUncheckedCreateWithoutGeneralEvaluationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EvaluationCreateOrConnectWithoutGeneralEvaluationsInputSchema).optional(),
  connect: z.lazy(() => EvaluationWhereUniqueInputSchema).optional()
}).strict();

export const AgentUpdateOneRequiredWithoutGeneralEvaluationsNestedInputSchema: z.ZodType<Prisma.AgentUpdateOneRequiredWithoutGeneralEvaluationsNestedInput> = z.object({
  create: z.union([ z.lazy(() => AgentCreateWithoutGeneralEvaluationsInputSchema),z.lazy(() => AgentUncheckedCreateWithoutGeneralEvaluationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AgentCreateOrConnectWithoutGeneralEvaluationsInputSchema).optional(),
  upsert: z.lazy(() => AgentUpsertWithoutGeneralEvaluationsInputSchema).optional(),
  connect: z.lazy(() => AgentWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => AgentUpdateToOneWithWhereWithoutGeneralEvaluationsInputSchema),z.lazy(() => AgentUpdateWithoutGeneralEvaluationsInputSchema),z.lazy(() => AgentUncheckedUpdateWithoutGeneralEvaluationsInputSchema) ]).optional(),
}).strict();

export const EvaluationUpdateOneRequiredWithoutGeneralEvaluationsNestedInputSchema: z.ZodType<Prisma.EvaluationUpdateOneRequiredWithoutGeneralEvaluationsNestedInput> = z.object({
  create: z.union([ z.lazy(() => EvaluationCreateWithoutGeneralEvaluationsInputSchema),z.lazy(() => EvaluationUncheckedCreateWithoutGeneralEvaluationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EvaluationCreateOrConnectWithoutGeneralEvaluationsInputSchema).optional(),
  upsert: z.lazy(() => EvaluationUpsertWithoutGeneralEvaluationsInputSchema).optional(),
  connect: z.lazy(() => EvaluationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => EvaluationUpdateToOneWithWhereWithoutGeneralEvaluationsInputSchema),z.lazy(() => EvaluationUpdateWithoutGeneralEvaluationsInputSchema),z.lazy(() => EvaluationUncheckedUpdateWithoutGeneralEvaluationsInputSchema) ]).optional(),
}).strict();

export const EvaluationTemplateCreateNestedOneWithoutEvaluationsInputSchema: z.ZodType<Prisma.EvaluationTemplateCreateNestedOneWithoutEvaluationsInput> = z.object({
  create: z.union([ z.lazy(() => EvaluationTemplateCreateWithoutEvaluationsInputSchema),z.lazy(() => EvaluationTemplateUncheckedCreateWithoutEvaluationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EvaluationTemplateCreateOrConnectWithoutEvaluationsInputSchema).optional(),
  connect: z.lazy(() => EvaluationTemplateWhereUniqueInputSchema).optional()
}).strict();

export const ScenarioCreateNestedOneWithoutEvaluationsInputSchema: z.ZodType<Prisma.ScenarioCreateNestedOneWithoutEvaluationsInput> = z.object({
  create: z.union([ z.lazy(() => ScenarioCreateWithoutEvaluationsInputSchema),z.lazy(() => ScenarioUncheckedCreateWithoutEvaluationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ScenarioCreateOrConnectWithoutEvaluationsInputSchema).optional(),
  connect: z.lazy(() => ScenarioWhereUniqueInputSchema).optional()
}).strict();

export const EvaluationGroupCreateNestedOneWithoutEvaluationsInputSchema: z.ZodType<Prisma.EvaluationGroupCreateNestedOneWithoutEvaluationsInput> = z.object({
  create: z.union([ z.lazy(() => EvaluationGroupCreateWithoutEvaluationsInputSchema),z.lazy(() => EvaluationGroupUncheckedCreateWithoutEvaluationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EvaluationGroupCreateOrConnectWithoutEvaluationsInputSchema).optional(),
  connect: z.lazy(() => EvaluationGroupWhereUniqueInputSchema).optional()
}).strict();

export const EvaluationResultCreateNestedManyWithoutEvaluationInputSchema: z.ZodType<Prisma.EvaluationResultCreateNestedManyWithoutEvaluationInput> = z.object({
  create: z.union([ z.lazy(() => EvaluationResultCreateWithoutEvaluationInputSchema),z.lazy(() => EvaluationResultCreateWithoutEvaluationInputSchema).array(),z.lazy(() => EvaluationResultUncheckedCreateWithoutEvaluationInputSchema),z.lazy(() => EvaluationResultUncheckedCreateWithoutEvaluationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EvaluationResultCreateOrConnectWithoutEvaluationInputSchema),z.lazy(() => EvaluationResultCreateOrConnectWithoutEvaluationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EvaluationResultCreateManyEvaluationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => EvaluationResultWhereUniqueInputSchema),z.lazy(() => EvaluationResultWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const GeneralEvaluationCreateNestedManyWithoutEvaluationInputSchema: z.ZodType<Prisma.GeneralEvaluationCreateNestedManyWithoutEvaluationInput> = z.object({
  create: z.union([ z.lazy(() => GeneralEvaluationCreateWithoutEvaluationInputSchema),z.lazy(() => GeneralEvaluationCreateWithoutEvaluationInputSchema).array(),z.lazy(() => GeneralEvaluationUncheckedCreateWithoutEvaluationInputSchema),z.lazy(() => GeneralEvaluationUncheckedCreateWithoutEvaluationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => GeneralEvaluationCreateOrConnectWithoutEvaluationInputSchema),z.lazy(() => GeneralEvaluationCreateOrConnectWithoutEvaluationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => GeneralEvaluationCreateManyEvaluationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => GeneralEvaluationWhereUniqueInputSchema),z.lazy(() => GeneralEvaluationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EvaluationResultUncheckedCreateNestedManyWithoutEvaluationInputSchema: z.ZodType<Prisma.EvaluationResultUncheckedCreateNestedManyWithoutEvaluationInput> = z.object({
  create: z.union([ z.lazy(() => EvaluationResultCreateWithoutEvaluationInputSchema),z.lazy(() => EvaluationResultCreateWithoutEvaluationInputSchema).array(),z.lazy(() => EvaluationResultUncheckedCreateWithoutEvaluationInputSchema),z.lazy(() => EvaluationResultUncheckedCreateWithoutEvaluationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EvaluationResultCreateOrConnectWithoutEvaluationInputSchema),z.lazy(() => EvaluationResultCreateOrConnectWithoutEvaluationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EvaluationResultCreateManyEvaluationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => EvaluationResultWhereUniqueInputSchema),z.lazy(() => EvaluationResultWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const GeneralEvaluationUncheckedCreateNestedManyWithoutEvaluationInputSchema: z.ZodType<Prisma.GeneralEvaluationUncheckedCreateNestedManyWithoutEvaluationInput> = z.object({
  create: z.union([ z.lazy(() => GeneralEvaluationCreateWithoutEvaluationInputSchema),z.lazy(() => GeneralEvaluationCreateWithoutEvaluationInputSchema).array(),z.lazy(() => GeneralEvaluationUncheckedCreateWithoutEvaluationInputSchema),z.lazy(() => GeneralEvaluationUncheckedCreateWithoutEvaluationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => GeneralEvaluationCreateOrConnectWithoutEvaluationInputSchema),z.lazy(() => GeneralEvaluationCreateOrConnectWithoutEvaluationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => GeneralEvaluationCreateManyEvaluationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => GeneralEvaluationWhereUniqueInputSchema),z.lazy(() => GeneralEvaluationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EvaluationTemplateUpdateOneRequiredWithoutEvaluationsNestedInputSchema: z.ZodType<Prisma.EvaluationTemplateUpdateOneRequiredWithoutEvaluationsNestedInput> = z.object({
  create: z.union([ z.lazy(() => EvaluationTemplateCreateWithoutEvaluationsInputSchema),z.lazy(() => EvaluationTemplateUncheckedCreateWithoutEvaluationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EvaluationTemplateCreateOrConnectWithoutEvaluationsInputSchema).optional(),
  upsert: z.lazy(() => EvaluationTemplateUpsertWithoutEvaluationsInputSchema).optional(),
  connect: z.lazy(() => EvaluationTemplateWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => EvaluationTemplateUpdateToOneWithWhereWithoutEvaluationsInputSchema),z.lazy(() => EvaluationTemplateUpdateWithoutEvaluationsInputSchema),z.lazy(() => EvaluationTemplateUncheckedUpdateWithoutEvaluationsInputSchema) ]).optional(),
}).strict();

export const ScenarioUpdateOneWithoutEvaluationsNestedInputSchema: z.ZodType<Prisma.ScenarioUpdateOneWithoutEvaluationsNestedInput> = z.object({
  create: z.union([ z.lazy(() => ScenarioCreateWithoutEvaluationsInputSchema),z.lazy(() => ScenarioUncheckedCreateWithoutEvaluationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ScenarioCreateOrConnectWithoutEvaluationsInputSchema).optional(),
  upsert: z.lazy(() => ScenarioUpsertWithoutEvaluationsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ScenarioWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ScenarioWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ScenarioWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ScenarioUpdateToOneWithWhereWithoutEvaluationsInputSchema),z.lazy(() => ScenarioUpdateWithoutEvaluationsInputSchema),z.lazy(() => ScenarioUncheckedUpdateWithoutEvaluationsInputSchema) ]).optional(),
}).strict();

export const EvaluationGroupUpdateOneWithoutEvaluationsNestedInputSchema: z.ZodType<Prisma.EvaluationGroupUpdateOneWithoutEvaluationsNestedInput> = z.object({
  create: z.union([ z.lazy(() => EvaluationGroupCreateWithoutEvaluationsInputSchema),z.lazy(() => EvaluationGroupUncheckedCreateWithoutEvaluationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EvaluationGroupCreateOrConnectWithoutEvaluationsInputSchema).optional(),
  upsert: z.lazy(() => EvaluationGroupUpsertWithoutEvaluationsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => EvaluationGroupWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => EvaluationGroupWhereInputSchema) ]).optional(),
  connect: z.lazy(() => EvaluationGroupWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => EvaluationGroupUpdateToOneWithWhereWithoutEvaluationsInputSchema),z.lazy(() => EvaluationGroupUpdateWithoutEvaluationsInputSchema),z.lazy(() => EvaluationGroupUncheckedUpdateWithoutEvaluationsInputSchema) ]).optional(),
}).strict();

export const EvaluationResultUpdateManyWithoutEvaluationNestedInputSchema: z.ZodType<Prisma.EvaluationResultUpdateManyWithoutEvaluationNestedInput> = z.object({
  create: z.union([ z.lazy(() => EvaluationResultCreateWithoutEvaluationInputSchema),z.lazy(() => EvaluationResultCreateWithoutEvaluationInputSchema).array(),z.lazy(() => EvaluationResultUncheckedCreateWithoutEvaluationInputSchema),z.lazy(() => EvaluationResultUncheckedCreateWithoutEvaluationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EvaluationResultCreateOrConnectWithoutEvaluationInputSchema),z.lazy(() => EvaluationResultCreateOrConnectWithoutEvaluationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => EvaluationResultUpsertWithWhereUniqueWithoutEvaluationInputSchema),z.lazy(() => EvaluationResultUpsertWithWhereUniqueWithoutEvaluationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EvaluationResultCreateManyEvaluationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => EvaluationResultWhereUniqueInputSchema),z.lazy(() => EvaluationResultWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => EvaluationResultWhereUniqueInputSchema),z.lazy(() => EvaluationResultWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => EvaluationResultWhereUniqueInputSchema),z.lazy(() => EvaluationResultWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => EvaluationResultWhereUniqueInputSchema),z.lazy(() => EvaluationResultWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => EvaluationResultUpdateWithWhereUniqueWithoutEvaluationInputSchema),z.lazy(() => EvaluationResultUpdateWithWhereUniqueWithoutEvaluationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => EvaluationResultUpdateManyWithWhereWithoutEvaluationInputSchema),z.lazy(() => EvaluationResultUpdateManyWithWhereWithoutEvaluationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => EvaluationResultScalarWhereInputSchema),z.lazy(() => EvaluationResultScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const GeneralEvaluationUpdateManyWithoutEvaluationNestedInputSchema: z.ZodType<Prisma.GeneralEvaluationUpdateManyWithoutEvaluationNestedInput> = z.object({
  create: z.union([ z.lazy(() => GeneralEvaluationCreateWithoutEvaluationInputSchema),z.lazy(() => GeneralEvaluationCreateWithoutEvaluationInputSchema).array(),z.lazy(() => GeneralEvaluationUncheckedCreateWithoutEvaluationInputSchema),z.lazy(() => GeneralEvaluationUncheckedCreateWithoutEvaluationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => GeneralEvaluationCreateOrConnectWithoutEvaluationInputSchema),z.lazy(() => GeneralEvaluationCreateOrConnectWithoutEvaluationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => GeneralEvaluationUpsertWithWhereUniqueWithoutEvaluationInputSchema),z.lazy(() => GeneralEvaluationUpsertWithWhereUniqueWithoutEvaluationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => GeneralEvaluationCreateManyEvaluationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => GeneralEvaluationWhereUniqueInputSchema),z.lazy(() => GeneralEvaluationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => GeneralEvaluationWhereUniqueInputSchema),z.lazy(() => GeneralEvaluationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => GeneralEvaluationWhereUniqueInputSchema),z.lazy(() => GeneralEvaluationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => GeneralEvaluationWhereUniqueInputSchema),z.lazy(() => GeneralEvaluationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => GeneralEvaluationUpdateWithWhereUniqueWithoutEvaluationInputSchema),z.lazy(() => GeneralEvaluationUpdateWithWhereUniqueWithoutEvaluationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => GeneralEvaluationUpdateManyWithWhereWithoutEvaluationInputSchema),z.lazy(() => GeneralEvaluationUpdateManyWithWhereWithoutEvaluationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => GeneralEvaluationScalarWhereInputSchema),z.lazy(() => GeneralEvaluationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const EvaluationResultUncheckedUpdateManyWithoutEvaluationNestedInputSchema: z.ZodType<Prisma.EvaluationResultUncheckedUpdateManyWithoutEvaluationNestedInput> = z.object({
  create: z.union([ z.lazy(() => EvaluationResultCreateWithoutEvaluationInputSchema),z.lazy(() => EvaluationResultCreateWithoutEvaluationInputSchema).array(),z.lazy(() => EvaluationResultUncheckedCreateWithoutEvaluationInputSchema),z.lazy(() => EvaluationResultUncheckedCreateWithoutEvaluationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EvaluationResultCreateOrConnectWithoutEvaluationInputSchema),z.lazy(() => EvaluationResultCreateOrConnectWithoutEvaluationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => EvaluationResultUpsertWithWhereUniqueWithoutEvaluationInputSchema),z.lazy(() => EvaluationResultUpsertWithWhereUniqueWithoutEvaluationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EvaluationResultCreateManyEvaluationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => EvaluationResultWhereUniqueInputSchema),z.lazy(() => EvaluationResultWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => EvaluationResultWhereUniqueInputSchema),z.lazy(() => EvaluationResultWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => EvaluationResultWhereUniqueInputSchema),z.lazy(() => EvaluationResultWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => EvaluationResultWhereUniqueInputSchema),z.lazy(() => EvaluationResultWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => EvaluationResultUpdateWithWhereUniqueWithoutEvaluationInputSchema),z.lazy(() => EvaluationResultUpdateWithWhereUniqueWithoutEvaluationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => EvaluationResultUpdateManyWithWhereWithoutEvaluationInputSchema),z.lazy(() => EvaluationResultUpdateManyWithWhereWithoutEvaluationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => EvaluationResultScalarWhereInputSchema),z.lazy(() => EvaluationResultScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const GeneralEvaluationUncheckedUpdateManyWithoutEvaluationNestedInputSchema: z.ZodType<Prisma.GeneralEvaluationUncheckedUpdateManyWithoutEvaluationNestedInput> = z.object({
  create: z.union([ z.lazy(() => GeneralEvaluationCreateWithoutEvaluationInputSchema),z.lazy(() => GeneralEvaluationCreateWithoutEvaluationInputSchema).array(),z.lazy(() => GeneralEvaluationUncheckedCreateWithoutEvaluationInputSchema),z.lazy(() => GeneralEvaluationUncheckedCreateWithoutEvaluationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => GeneralEvaluationCreateOrConnectWithoutEvaluationInputSchema),z.lazy(() => GeneralEvaluationCreateOrConnectWithoutEvaluationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => GeneralEvaluationUpsertWithWhereUniqueWithoutEvaluationInputSchema),z.lazy(() => GeneralEvaluationUpsertWithWhereUniqueWithoutEvaluationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => GeneralEvaluationCreateManyEvaluationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => GeneralEvaluationWhereUniqueInputSchema),z.lazy(() => GeneralEvaluationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => GeneralEvaluationWhereUniqueInputSchema),z.lazy(() => GeneralEvaluationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => GeneralEvaluationWhereUniqueInputSchema),z.lazy(() => GeneralEvaluationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => GeneralEvaluationWhereUniqueInputSchema),z.lazy(() => GeneralEvaluationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => GeneralEvaluationUpdateWithWhereUniqueWithoutEvaluationInputSchema),z.lazy(() => GeneralEvaluationUpdateWithWhereUniqueWithoutEvaluationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => GeneralEvaluationUpdateManyWithWhereWithoutEvaluationInputSchema),z.lazy(() => GeneralEvaluationUpdateManyWithWhereWithoutEvaluationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => GeneralEvaluationScalarWhereInputSchema),z.lazy(() => GeneralEvaluationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CallCreateNestedOneWithoutEvaluationResultsInputSchema: z.ZodType<Prisma.CallCreateNestedOneWithoutEvaluationResultsInput> = z.object({
  create: z.union([ z.lazy(() => CallCreateWithoutEvaluationResultsInputSchema),z.lazy(() => CallUncheckedCreateWithoutEvaluationResultsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CallCreateOrConnectWithoutEvaluationResultsInputSchema).optional(),
  connect: z.lazy(() => CallWhereUniqueInputSchema).optional()
}).strict();

export const EvaluationCreateNestedOneWithoutEvaluationResultsInputSchema: z.ZodType<Prisma.EvaluationCreateNestedOneWithoutEvaluationResultsInput> = z.object({
  create: z.union([ z.lazy(() => EvaluationCreateWithoutEvaluationResultsInputSchema),z.lazy(() => EvaluationUncheckedCreateWithoutEvaluationResultsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EvaluationCreateOrConnectWithoutEvaluationResultsInputSchema).optional(),
  connect: z.lazy(() => EvaluationWhereUniqueInputSchema).optional()
}).strict();

export const EvaluationTemplateCreateNestedOneWithoutEvaluationResultsInputSchema: z.ZodType<Prisma.EvaluationTemplateCreateNestedOneWithoutEvaluationResultsInput> = z.object({
  create: z.union([ z.lazy(() => EvaluationTemplateCreateWithoutEvaluationResultsInputSchema),z.lazy(() => EvaluationTemplateUncheckedCreateWithoutEvaluationResultsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EvaluationTemplateCreateOrConnectWithoutEvaluationResultsInputSchema).optional(),
  connect: z.lazy(() => EvaluationTemplateWhereUniqueInputSchema).optional()
}).strict();

export const CallUpdateOneWithoutEvaluationResultsNestedInputSchema: z.ZodType<Prisma.CallUpdateOneWithoutEvaluationResultsNestedInput> = z.object({
  create: z.union([ z.lazy(() => CallCreateWithoutEvaluationResultsInputSchema),z.lazy(() => CallUncheckedCreateWithoutEvaluationResultsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CallCreateOrConnectWithoutEvaluationResultsInputSchema).optional(),
  upsert: z.lazy(() => CallUpsertWithoutEvaluationResultsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => CallWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => CallWhereInputSchema) ]).optional(),
  connect: z.lazy(() => CallWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CallUpdateToOneWithWhereWithoutEvaluationResultsInputSchema),z.lazy(() => CallUpdateWithoutEvaluationResultsInputSchema),z.lazy(() => CallUncheckedUpdateWithoutEvaluationResultsInputSchema) ]).optional(),
}).strict();

export const EvaluationUpdateOneRequiredWithoutEvaluationResultsNestedInputSchema: z.ZodType<Prisma.EvaluationUpdateOneRequiredWithoutEvaluationResultsNestedInput> = z.object({
  create: z.union([ z.lazy(() => EvaluationCreateWithoutEvaluationResultsInputSchema),z.lazy(() => EvaluationUncheckedCreateWithoutEvaluationResultsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EvaluationCreateOrConnectWithoutEvaluationResultsInputSchema).optional(),
  upsert: z.lazy(() => EvaluationUpsertWithoutEvaluationResultsInputSchema).optional(),
  connect: z.lazy(() => EvaluationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => EvaluationUpdateToOneWithWhereWithoutEvaluationResultsInputSchema),z.lazy(() => EvaluationUpdateWithoutEvaluationResultsInputSchema),z.lazy(() => EvaluationUncheckedUpdateWithoutEvaluationResultsInputSchema) ]).optional(),
}).strict();

export const EvaluationTemplateUpdateOneWithoutEvaluationResultsNestedInputSchema: z.ZodType<Prisma.EvaluationTemplateUpdateOneWithoutEvaluationResultsNestedInput> = z.object({
  create: z.union([ z.lazy(() => EvaluationTemplateCreateWithoutEvaluationResultsInputSchema),z.lazy(() => EvaluationTemplateUncheckedCreateWithoutEvaluationResultsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EvaluationTemplateCreateOrConnectWithoutEvaluationResultsInputSchema).optional(),
  upsert: z.lazy(() => EvaluationTemplateUpsertWithoutEvaluationResultsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => EvaluationTemplateWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => EvaluationTemplateWhereInputSchema) ]).optional(),
  connect: z.lazy(() => EvaluationTemplateWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => EvaluationTemplateUpdateToOneWithWhereWithoutEvaluationResultsInputSchema),z.lazy(() => EvaluationTemplateUpdateWithoutEvaluationResultsInputSchema),z.lazy(() => EvaluationTemplateUncheckedUpdateWithoutEvaluationResultsInputSchema) ]).optional(),
}).strict();

export const CallCreateNestedOneWithoutLatencyBlocksInputSchema: z.ZodType<Prisma.CallCreateNestedOneWithoutLatencyBlocksInput> = z.object({
  create: z.union([ z.lazy(() => CallCreateWithoutLatencyBlocksInputSchema),z.lazy(() => CallUncheckedCreateWithoutLatencyBlocksInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CallCreateOrConnectWithoutLatencyBlocksInputSchema).optional(),
  connect: z.lazy(() => CallWhereUniqueInputSchema).optional()
}).strict();

export const CallUpdateOneRequiredWithoutLatencyBlocksNestedInputSchema: z.ZodType<Prisma.CallUpdateOneRequiredWithoutLatencyBlocksNestedInput> = z.object({
  create: z.union([ z.lazy(() => CallCreateWithoutLatencyBlocksInputSchema),z.lazy(() => CallUncheckedCreateWithoutLatencyBlocksInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CallCreateOrConnectWithoutLatencyBlocksInputSchema).optional(),
  upsert: z.lazy(() => CallUpsertWithoutLatencyBlocksInputSchema).optional(),
  connect: z.lazy(() => CallWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CallUpdateToOneWithWhereWithoutLatencyBlocksInputSchema),z.lazy(() => CallUpdateWithoutLatencyBlocksInputSchema),z.lazy(() => CallUncheckedUpdateWithoutLatencyBlocksInputSchema) ]).optional(),
}).strict();

export const CallCreateNestedOneWithoutInterruptionsInputSchema: z.ZodType<Prisma.CallCreateNestedOneWithoutInterruptionsInput> = z.object({
  create: z.union([ z.lazy(() => CallCreateWithoutInterruptionsInputSchema),z.lazy(() => CallUncheckedCreateWithoutInterruptionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CallCreateOrConnectWithoutInterruptionsInputSchema).optional(),
  connect: z.lazy(() => CallWhereUniqueInputSchema).optional()
}).strict();

export const CallUpdateOneRequiredWithoutInterruptionsNestedInputSchema: z.ZodType<Prisma.CallUpdateOneRequiredWithoutInterruptionsNestedInput> = z.object({
  create: z.union([ z.lazy(() => CallCreateWithoutInterruptionsInputSchema),z.lazy(() => CallUncheckedCreateWithoutInterruptionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CallCreateOrConnectWithoutInterruptionsInputSchema).optional(),
  upsert: z.lazy(() => CallUpsertWithoutInterruptionsInputSchema).optional(),
  connect: z.lazy(() => CallWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CallUpdateToOneWithWhereWithoutInterruptionsInputSchema),z.lazy(() => CallUpdateWithoutInterruptionsInputSchema),z.lazy(() => CallUncheckedUpdateWithoutInterruptionsInputSchema) ]).optional(),
}).strict();

export const EvaluationCreateNestedManyWithoutEvaluationGroupInputSchema: z.ZodType<Prisma.EvaluationCreateNestedManyWithoutEvaluationGroupInput> = z.object({
  create: z.union([ z.lazy(() => EvaluationCreateWithoutEvaluationGroupInputSchema),z.lazy(() => EvaluationCreateWithoutEvaluationGroupInputSchema).array(),z.lazy(() => EvaluationUncheckedCreateWithoutEvaluationGroupInputSchema),z.lazy(() => EvaluationUncheckedCreateWithoutEvaluationGroupInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EvaluationCreateOrConnectWithoutEvaluationGroupInputSchema),z.lazy(() => EvaluationCreateOrConnectWithoutEvaluationGroupInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EvaluationCreateManyEvaluationGroupInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => EvaluationWhereUniqueInputSchema),z.lazy(() => EvaluationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SavedSearchCreateNestedOneWithoutEvaluationGroupsInputSchema: z.ZodType<Prisma.SavedSearchCreateNestedOneWithoutEvaluationGroupsInput> = z.object({
  create: z.union([ z.lazy(() => SavedSearchCreateWithoutEvaluationGroupsInputSchema),z.lazy(() => SavedSearchUncheckedCreateWithoutEvaluationGroupsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SavedSearchCreateOrConnectWithoutEvaluationGroupsInputSchema).optional(),
  connect: z.lazy(() => SavedSearchWhereUniqueInputSchema).optional()
}).strict();

export const EvaluationUncheckedCreateNestedManyWithoutEvaluationGroupInputSchema: z.ZodType<Prisma.EvaluationUncheckedCreateNestedManyWithoutEvaluationGroupInput> = z.object({
  create: z.union([ z.lazy(() => EvaluationCreateWithoutEvaluationGroupInputSchema),z.lazy(() => EvaluationCreateWithoutEvaluationGroupInputSchema).array(),z.lazy(() => EvaluationUncheckedCreateWithoutEvaluationGroupInputSchema),z.lazy(() => EvaluationUncheckedCreateWithoutEvaluationGroupInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EvaluationCreateOrConnectWithoutEvaluationGroupInputSchema),z.lazy(() => EvaluationCreateOrConnectWithoutEvaluationGroupInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EvaluationCreateManyEvaluationGroupInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => EvaluationWhereUniqueInputSchema),z.lazy(() => EvaluationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EvaluationUpdateManyWithoutEvaluationGroupNestedInputSchema: z.ZodType<Prisma.EvaluationUpdateManyWithoutEvaluationGroupNestedInput> = z.object({
  create: z.union([ z.lazy(() => EvaluationCreateWithoutEvaluationGroupInputSchema),z.lazy(() => EvaluationCreateWithoutEvaluationGroupInputSchema).array(),z.lazy(() => EvaluationUncheckedCreateWithoutEvaluationGroupInputSchema),z.lazy(() => EvaluationUncheckedCreateWithoutEvaluationGroupInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EvaluationCreateOrConnectWithoutEvaluationGroupInputSchema),z.lazy(() => EvaluationCreateOrConnectWithoutEvaluationGroupInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => EvaluationUpsertWithWhereUniqueWithoutEvaluationGroupInputSchema),z.lazy(() => EvaluationUpsertWithWhereUniqueWithoutEvaluationGroupInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EvaluationCreateManyEvaluationGroupInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => EvaluationWhereUniqueInputSchema),z.lazy(() => EvaluationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => EvaluationWhereUniqueInputSchema),z.lazy(() => EvaluationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => EvaluationWhereUniqueInputSchema),z.lazy(() => EvaluationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => EvaluationWhereUniqueInputSchema),z.lazy(() => EvaluationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => EvaluationUpdateWithWhereUniqueWithoutEvaluationGroupInputSchema),z.lazy(() => EvaluationUpdateWithWhereUniqueWithoutEvaluationGroupInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => EvaluationUpdateManyWithWhereWithoutEvaluationGroupInputSchema),z.lazy(() => EvaluationUpdateManyWithWhereWithoutEvaluationGroupInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => EvaluationScalarWhereInputSchema),z.lazy(() => EvaluationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SavedSearchUpdateOneWithoutEvaluationGroupsNestedInputSchema: z.ZodType<Prisma.SavedSearchUpdateOneWithoutEvaluationGroupsNestedInput> = z.object({
  create: z.union([ z.lazy(() => SavedSearchCreateWithoutEvaluationGroupsInputSchema),z.lazy(() => SavedSearchUncheckedCreateWithoutEvaluationGroupsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SavedSearchCreateOrConnectWithoutEvaluationGroupsInputSchema).optional(),
  upsert: z.lazy(() => SavedSearchUpsertWithoutEvaluationGroupsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => SavedSearchWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => SavedSearchWhereInputSchema) ]).optional(),
  connect: z.lazy(() => SavedSearchWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => SavedSearchUpdateToOneWithWhereWithoutEvaluationGroupsInputSchema),z.lazy(() => SavedSearchUpdateWithoutEvaluationGroupsInputSchema),z.lazy(() => SavedSearchUncheckedUpdateWithoutEvaluationGroupsInputSchema) ]).optional(),
}).strict();

export const EvaluationUncheckedUpdateManyWithoutEvaluationGroupNestedInputSchema: z.ZodType<Prisma.EvaluationUncheckedUpdateManyWithoutEvaluationGroupNestedInput> = z.object({
  create: z.union([ z.lazy(() => EvaluationCreateWithoutEvaluationGroupInputSchema),z.lazy(() => EvaluationCreateWithoutEvaluationGroupInputSchema).array(),z.lazy(() => EvaluationUncheckedCreateWithoutEvaluationGroupInputSchema),z.lazy(() => EvaluationUncheckedCreateWithoutEvaluationGroupInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EvaluationCreateOrConnectWithoutEvaluationGroupInputSchema),z.lazy(() => EvaluationCreateOrConnectWithoutEvaluationGroupInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => EvaluationUpsertWithWhereUniqueWithoutEvaluationGroupInputSchema),z.lazy(() => EvaluationUpsertWithWhereUniqueWithoutEvaluationGroupInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EvaluationCreateManyEvaluationGroupInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => EvaluationWhereUniqueInputSchema),z.lazy(() => EvaluationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => EvaluationWhereUniqueInputSchema),z.lazy(() => EvaluationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => EvaluationWhereUniqueInputSchema),z.lazy(() => EvaluationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => EvaluationWhereUniqueInputSchema),z.lazy(() => EvaluationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => EvaluationUpdateWithWhereUniqueWithoutEvaluationGroupInputSchema),z.lazy(() => EvaluationUpdateWithWhereUniqueWithoutEvaluationGroupInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => EvaluationUpdateManyWithWhereWithoutEvaluationGroupInputSchema),z.lazy(() => EvaluationUpdateManyWithWhereWithoutEvaluationGroupInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => EvaluationScalarWhereInputSchema),z.lazy(() => EvaluationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SavedSearchCreateagentIdInputSchema: z.ZodType<Prisma.SavedSearchCreateagentIdInput> = z.object({
  set: z.string().array()
}).strict();

export const EvaluationGroupCreateNestedManyWithoutSavedSearchInputSchema: z.ZodType<Prisma.EvaluationGroupCreateNestedManyWithoutSavedSearchInput> = z.object({
  create: z.union([ z.lazy(() => EvaluationGroupCreateWithoutSavedSearchInputSchema),z.lazy(() => EvaluationGroupCreateWithoutSavedSearchInputSchema).array(),z.lazy(() => EvaluationGroupUncheckedCreateWithoutSavedSearchInputSchema),z.lazy(() => EvaluationGroupUncheckedCreateWithoutSavedSearchInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EvaluationGroupCreateOrConnectWithoutSavedSearchInputSchema),z.lazy(() => EvaluationGroupCreateOrConnectWithoutSavedSearchInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EvaluationGroupCreateManySavedSearchInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => EvaluationGroupWhereUniqueInputSchema),z.lazy(() => EvaluationGroupWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AlertCreateNestedManyWithoutSavedSearchInputSchema: z.ZodType<Prisma.AlertCreateNestedManyWithoutSavedSearchInput> = z.object({
  create: z.union([ z.lazy(() => AlertCreateWithoutSavedSearchInputSchema),z.lazy(() => AlertCreateWithoutSavedSearchInputSchema).array(),z.lazy(() => AlertUncheckedCreateWithoutSavedSearchInputSchema),z.lazy(() => AlertUncheckedCreateWithoutSavedSearchInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AlertCreateOrConnectWithoutSavedSearchInputSchema),z.lazy(() => AlertCreateOrConnectWithoutSavedSearchInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AlertCreateManySavedSearchInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AlertWhereUniqueInputSchema),z.lazy(() => AlertWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EvaluationGroupUncheckedCreateNestedManyWithoutSavedSearchInputSchema: z.ZodType<Prisma.EvaluationGroupUncheckedCreateNestedManyWithoutSavedSearchInput> = z.object({
  create: z.union([ z.lazy(() => EvaluationGroupCreateWithoutSavedSearchInputSchema),z.lazy(() => EvaluationGroupCreateWithoutSavedSearchInputSchema).array(),z.lazy(() => EvaluationGroupUncheckedCreateWithoutSavedSearchInputSchema),z.lazy(() => EvaluationGroupUncheckedCreateWithoutSavedSearchInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EvaluationGroupCreateOrConnectWithoutSavedSearchInputSchema),z.lazy(() => EvaluationGroupCreateOrConnectWithoutSavedSearchInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EvaluationGroupCreateManySavedSearchInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => EvaluationGroupWhereUniqueInputSchema),z.lazy(() => EvaluationGroupWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AlertUncheckedCreateNestedManyWithoutSavedSearchInputSchema: z.ZodType<Prisma.AlertUncheckedCreateNestedManyWithoutSavedSearchInput> = z.object({
  create: z.union([ z.lazy(() => AlertCreateWithoutSavedSearchInputSchema),z.lazy(() => AlertCreateWithoutSavedSearchInputSchema).array(),z.lazy(() => AlertUncheckedCreateWithoutSavedSearchInputSchema),z.lazy(() => AlertUncheckedCreateWithoutSavedSearchInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AlertCreateOrConnectWithoutSavedSearchInputSchema),z.lazy(() => AlertCreateOrConnectWithoutSavedSearchInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AlertCreateManySavedSearchInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AlertWhereUniqueInputSchema),z.lazy(() => AlertWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SavedSearchUpdateagentIdInputSchema: z.ZodType<Prisma.SavedSearchUpdateagentIdInput> = z.object({
  set: z.string().array().optional(),
  push: z.union([ z.string(),z.string().array() ]).optional(),
}).strict();

export const EvaluationGroupUpdateManyWithoutSavedSearchNestedInputSchema: z.ZodType<Prisma.EvaluationGroupUpdateManyWithoutSavedSearchNestedInput> = z.object({
  create: z.union([ z.lazy(() => EvaluationGroupCreateWithoutSavedSearchInputSchema),z.lazy(() => EvaluationGroupCreateWithoutSavedSearchInputSchema).array(),z.lazy(() => EvaluationGroupUncheckedCreateWithoutSavedSearchInputSchema),z.lazy(() => EvaluationGroupUncheckedCreateWithoutSavedSearchInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EvaluationGroupCreateOrConnectWithoutSavedSearchInputSchema),z.lazy(() => EvaluationGroupCreateOrConnectWithoutSavedSearchInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => EvaluationGroupUpsertWithWhereUniqueWithoutSavedSearchInputSchema),z.lazy(() => EvaluationGroupUpsertWithWhereUniqueWithoutSavedSearchInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EvaluationGroupCreateManySavedSearchInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => EvaluationGroupWhereUniqueInputSchema),z.lazy(() => EvaluationGroupWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => EvaluationGroupWhereUniqueInputSchema),z.lazy(() => EvaluationGroupWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => EvaluationGroupWhereUniqueInputSchema),z.lazy(() => EvaluationGroupWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => EvaluationGroupWhereUniqueInputSchema),z.lazy(() => EvaluationGroupWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => EvaluationGroupUpdateWithWhereUniqueWithoutSavedSearchInputSchema),z.lazy(() => EvaluationGroupUpdateWithWhereUniqueWithoutSavedSearchInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => EvaluationGroupUpdateManyWithWhereWithoutSavedSearchInputSchema),z.lazy(() => EvaluationGroupUpdateManyWithWhereWithoutSavedSearchInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => EvaluationGroupScalarWhereInputSchema),z.lazy(() => EvaluationGroupScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AlertUpdateManyWithoutSavedSearchNestedInputSchema: z.ZodType<Prisma.AlertUpdateManyWithoutSavedSearchNestedInput> = z.object({
  create: z.union([ z.lazy(() => AlertCreateWithoutSavedSearchInputSchema),z.lazy(() => AlertCreateWithoutSavedSearchInputSchema).array(),z.lazy(() => AlertUncheckedCreateWithoutSavedSearchInputSchema),z.lazy(() => AlertUncheckedCreateWithoutSavedSearchInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AlertCreateOrConnectWithoutSavedSearchInputSchema),z.lazy(() => AlertCreateOrConnectWithoutSavedSearchInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AlertUpsertWithWhereUniqueWithoutSavedSearchInputSchema),z.lazy(() => AlertUpsertWithWhereUniqueWithoutSavedSearchInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AlertCreateManySavedSearchInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AlertWhereUniqueInputSchema),z.lazy(() => AlertWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AlertWhereUniqueInputSchema),z.lazy(() => AlertWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AlertWhereUniqueInputSchema),z.lazy(() => AlertWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AlertWhereUniqueInputSchema),z.lazy(() => AlertWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AlertUpdateWithWhereUniqueWithoutSavedSearchInputSchema),z.lazy(() => AlertUpdateWithWhereUniqueWithoutSavedSearchInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AlertUpdateManyWithWhereWithoutSavedSearchInputSchema),z.lazy(() => AlertUpdateManyWithWhereWithoutSavedSearchInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AlertScalarWhereInputSchema),z.lazy(() => AlertScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const EvaluationGroupUncheckedUpdateManyWithoutSavedSearchNestedInputSchema: z.ZodType<Prisma.EvaluationGroupUncheckedUpdateManyWithoutSavedSearchNestedInput> = z.object({
  create: z.union([ z.lazy(() => EvaluationGroupCreateWithoutSavedSearchInputSchema),z.lazy(() => EvaluationGroupCreateWithoutSavedSearchInputSchema).array(),z.lazy(() => EvaluationGroupUncheckedCreateWithoutSavedSearchInputSchema),z.lazy(() => EvaluationGroupUncheckedCreateWithoutSavedSearchInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EvaluationGroupCreateOrConnectWithoutSavedSearchInputSchema),z.lazy(() => EvaluationGroupCreateOrConnectWithoutSavedSearchInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => EvaluationGroupUpsertWithWhereUniqueWithoutSavedSearchInputSchema),z.lazy(() => EvaluationGroupUpsertWithWhereUniqueWithoutSavedSearchInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EvaluationGroupCreateManySavedSearchInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => EvaluationGroupWhereUniqueInputSchema),z.lazy(() => EvaluationGroupWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => EvaluationGroupWhereUniqueInputSchema),z.lazy(() => EvaluationGroupWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => EvaluationGroupWhereUniqueInputSchema),z.lazy(() => EvaluationGroupWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => EvaluationGroupWhereUniqueInputSchema),z.lazy(() => EvaluationGroupWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => EvaluationGroupUpdateWithWhereUniqueWithoutSavedSearchInputSchema),z.lazy(() => EvaluationGroupUpdateWithWhereUniqueWithoutSavedSearchInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => EvaluationGroupUpdateManyWithWhereWithoutSavedSearchInputSchema),z.lazy(() => EvaluationGroupUpdateManyWithWhereWithoutSavedSearchInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => EvaluationGroupScalarWhereInputSchema),z.lazy(() => EvaluationGroupScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AlertUncheckedUpdateManyWithoutSavedSearchNestedInputSchema: z.ZodType<Prisma.AlertUncheckedUpdateManyWithoutSavedSearchNestedInput> = z.object({
  create: z.union([ z.lazy(() => AlertCreateWithoutSavedSearchInputSchema),z.lazy(() => AlertCreateWithoutSavedSearchInputSchema).array(),z.lazy(() => AlertUncheckedCreateWithoutSavedSearchInputSchema),z.lazy(() => AlertUncheckedCreateWithoutSavedSearchInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AlertCreateOrConnectWithoutSavedSearchInputSchema),z.lazy(() => AlertCreateOrConnectWithoutSavedSearchInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AlertUpsertWithWhereUniqueWithoutSavedSearchInputSchema),z.lazy(() => AlertUpsertWithWhereUniqueWithoutSavedSearchInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AlertCreateManySavedSearchInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AlertWhereUniqueInputSchema),z.lazy(() => AlertWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AlertWhereUniqueInputSchema),z.lazy(() => AlertWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AlertWhereUniqueInputSchema),z.lazy(() => AlertWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AlertWhereUniqueInputSchema),z.lazy(() => AlertWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AlertUpdateWithWhereUniqueWithoutSavedSearchInputSchema),z.lazy(() => AlertUpdateWithWhereUniqueWithoutSavedSearchInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AlertUpdateManyWithWhereWithoutSavedSearchInputSchema),z.lazy(() => AlertUpdateManyWithWhereWithoutSavedSearchInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AlertScalarWhereInputSchema),z.lazy(() => AlertScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SavedSearchCreateNestedOneWithoutAlertsInputSchema: z.ZodType<Prisma.SavedSearchCreateNestedOneWithoutAlertsInput> = z.object({
  create: z.union([ z.lazy(() => SavedSearchCreateWithoutAlertsInputSchema),z.lazy(() => SavedSearchUncheckedCreateWithoutAlertsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SavedSearchCreateOrConnectWithoutAlertsInputSchema).optional(),
  connect: z.lazy(() => SavedSearchWhereUniqueInputSchema).optional()
}).strict();

export const EnumAlertTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumAlertTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => AlertTypeSchema).optional()
}).strict();

export const SavedSearchUpdateOneRequiredWithoutAlertsNestedInputSchema: z.ZodType<Prisma.SavedSearchUpdateOneRequiredWithoutAlertsNestedInput> = z.object({
  create: z.union([ z.lazy(() => SavedSearchCreateWithoutAlertsInputSchema),z.lazy(() => SavedSearchUncheckedCreateWithoutAlertsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SavedSearchCreateOrConnectWithoutAlertsInputSchema).optional(),
  upsert: z.lazy(() => SavedSearchUpsertWithoutAlertsInputSchema).optional(),
  connect: z.lazy(() => SavedSearchWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => SavedSearchUpdateToOneWithWhereWithoutAlertsInputSchema),z.lazy(() => SavedSearchUpdateWithoutAlertsInputSchema),z.lazy(() => SavedSearchUncheckedUpdateWithoutAlertsInputSchema) ]).optional(),
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

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
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

export const NestedJsonFilterSchema: z.ZodType<Prisma.NestedJsonFilter> = z.object({
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

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
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

export const NestedEnumCallStatusFilterSchema: z.ZodType<Prisma.NestedEnumCallStatusFilter> = z.object({
  equals: z.lazy(() => CallStatusSchema).optional(),
  in: z.lazy(() => CallStatusSchema).array().optional(),
  notIn: z.lazy(() => CallStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => NestedEnumCallStatusFilterSchema) ]).optional(),
}).strict();

export const NestedEnumCallResultNullableFilterSchema: z.ZodType<Prisma.NestedEnumCallResultNullableFilter> = z.object({
  equals: z.lazy(() => CallResultSchema).optional().nullable(),
  in: z.lazy(() => CallResultSchema).array().optional().nullable(),
  notIn: z.lazy(() => CallResultSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => NestedEnumCallResultNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedBoolNullableFilterSchema: z.ZodType<Prisma.NestedBoolNullableFilter> = z.object({
  equals: z.boolean().optional().nullable(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolNullableFilterSchema) ]).optional().nullable(),
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

export const NestedEnumCallResultNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumCallResultNullableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => CallResultSchema).optional().nullable(),
  in: z.lazy(() => CallResultSchema).array().optional().nullable(),
  notIn: z.lazy(() => CallResultSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => NestedEnumCallResultNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumCallResultNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumCallResultNullableFilterSchema).optional()
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

export const NestedFloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional()
}).strict();

export const NestedIntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();

export const NestedBoolNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolNullableWithAggregatesFilter> = z.object({
  equals: z.boolean().optional().nullable(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolNullableFilterSchema).optional()
}).strict();

export const NestedEnumRoleFilterSchema: z.ZodType<Prisma.NestedEnumRoleFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleFilterSchema) ]).optional(),
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

export const NestedEnumEvalTypeFilterSchema: z.ZodType<Prisma.NestedEnumEvalTypeFilter> = z.object({
  equals: z.lazy(() => EvalTypeSchema).optional(),
  in: z.lazy(() => EvalTypeSchema).array().optional(),
  notIn: z.lazy(() => EvalTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => EvalTypeSchema),z.lazy(() => NestedEnumEvalTypeFilterSchema) ]).optional(),
}).strict();

export const NestedEnumEvalResultTypeFilterSchema: z.ZodType<Prisma.NestedEnumEvalResultTypeFilter> = z.object({
  equals: z.lazy(() => EvalResultTypeSchema).optional(),
  in: z.lazy(() => EvalResultTypeSchema).array().optional(),
  notIn: z.lazy(() => EvalResultTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => EvalResultTypeSchema),z.lazy(() => NestedEnumEvalResultTypeFilterSchema) ]).optional(),
}).strict();

export const NestedEnumEvalContentTypeFilterSchema: z.ZodType<Prisma.NestedEnumEvalContentTypeFilter> = z.object({
  equals: z.lazy(() => EvalContentTypeSchema).optional(),
  in: z.lazy(() => EvalContentTypeSchema).array().optional(),
  notIn: z.lazy(() => EvalContentTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => EvalContentTypeSchema),z.lazy(() => NestedEnumEvalContentTypeFilterSchema) ]).optional(),
}).strict();

export const NestedEnumEvalTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumEvalTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => EvalTypeSchema).optional(),
  in: z.lazy(() => EvalTypeSchema).array().optional(),
  notIn: z.lazy(() => EvalTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => EvalTypeSchema),z.lazy(() => NestedEnumEvalTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumEvalTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumEvalTypeFilterSchema).optional()
}).strict();

export const NestedEnumEvalResultTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumEvalResultTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => EvalResultTypeSchema).optional(),
  in: z.lazy(() => EvalResultTypeSchema).array().optional(),
  notIn: z.lazy(() => EvalResultTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => EvalResultTypeSchema),z.lazy(() => NestedEnumEvalResultTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumEvalResultTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumEvalResultTypeFilterSchema).optional()
}).strict();

export const NestedEnumEvalContentTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumEvalContentTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => EvalContentTypeSchema).optional(),
  in: z.lazy(() => EvalContentTypeSchema).array().optional(),
  notIn: z.lazy(() => EvalContentTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => EvalContentTypeSchema),z.lazy(() => NestedEnumEvalContentTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumEvalContentTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumEvalContentTypeFilterSchema).optional()
}).strict();

export const NestedEnumAlertTypeFilterSchema: z.ZodType<Prisma.NestedEnumAlertTypeFilter> = z.object({
  equals: z.lazy(() => AlertTypeSchema).optional(),
  in: z.lazy(() => AlertTypeSchema).array().optional(),
  notIn: z.lazy(() => AlertTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => AlertTypeSchema),z.lazy(() => NestedEnumAlertTypeFilterSchema) ]).optional(),
}).strict();

export const NestedEnumAlertTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumAlertTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => AlertTypeSchema).optional(),
  in: z.lazy(() => AlertTypeSchema).array().optional(),
  notIn: z.lazy(() => AlertTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => AlertTypeSchema),z.lazy(() => NestedEnumAlertTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumAlertTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumAlertTypeFilterSchema).optional()
}).strict();

export const TestAgentCreateWithoutAgentsInputSchema: z.ZodType<Prisma.TestAgentCreateWithoutAgentsInput> = z.object({
  id: z.string().optional(),
  ownerId: z.string().optional().nullable(),
  name: z.string(),
  headshotUrl: z.string(),
  description: z.string(),
  prompt: z.string(),
  enabled: z.boolean().optional(),
  defaultSelected: z.boolean().optional(),
  order: z.number().int().optional(),
  calls: z.lazy(() => CallCreateNestedManyWithoutTestAgentInputSchema).optional()
}).strict();

export const TestAgentUncheckedCreateWithoutAgentsInputSchema: z.ZodType<Prisma.TestAgentUncheckedCreateWithoutAgentsInput> = z.object({
  id: z.string().optional(),
  ownerId: z.string().optional().nullable(),
  name: z.string(),
  headshotUrl: z.string(),
  description: z.string(),
  prompt: z.string(),
  enabled: z.boolean().optional(),
  defaultSelected: z.boolean().optional(),
  order: z.number().int().optional(),
  calls: z.lazy(() => CallUncheckedCreateNestedManyWithoutTestAgentInputSchema).optional()
}).strict();

export const TestAgentCreateOrConnectWithoutAgentsInputSchema: z.ZodType<Prisma.TestAgentCreateOrConnectWithoutAgentsInput> = z.object({
  where: z.lazy(() => TestAgentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TestAgentCreateWithoutAgentsInputSchema),z.lazy(() => TestAgentUncheckedCreateWithoutAgentsInputSchema) ]),
}).strict();

export const ScenarioCreateWithoutAgentInputSchema: z.ZodType<Prisma.ScenarioCreateWithoutAgentInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  name: z.string(),
  instructions: z.string(),
  successCriteria: z.string().optional(),
  includeDateTime: z.boolean().optional(),
  timezone: z.string().optional().nullable(),
  deleted: z.boolean().optional(),
  calls: z.lazy(() => CallCreateNestedManyWithoutScenarioInputSchema).optional(),
  evaluations: z.lazy(() => EvaluationCreateNestedManyWithoutScenarioInputSchema).optional()
}).strict();

export const ScenarioUncheckedCreateWithoutAgentInputSchema: z.ZodType<Prisma.ScenarioUncheckedCreateWithoutAgentInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  name: z.string(),
  instructions: z.string(),
  successCriteria: z.string().optional(),
  includeDateTime: z.boolean().optional(),
  timezone: z.string().optional().nullable(),
  deleted: z.boolean().optional(),
  calls: z.lazy(() => CallUncheckedCreateNestedManyWithoutScenarioInputSchema).optional(),
  evaluations: z.lazy(() => EvaluationUncheckedCreateNestedManyWithoutScenarioInputSchema).optional()
}).strict();

export const ScenarioCreateOrConnectWithoutAgentInputSchema: z.ZodType<Prisma.ScenarioCreateOrConnectWithoutAgentInput> = z.object({
  where: z.lazy(() => ScenarioWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ScenarioCreateWithoutAgentInputSchema),z.lazy(() => ScenarioUncheckedCreateWithoutAgentInputSchema) ]),
}).strict();

export const ScenarioCreateManyAgentInputEnvelopeSchema: z.ZodType<Prisma.ScenarioCreateManyAgentInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ScenarioCreateManyAgentInputSchema),z.lazy(() => ScenarioCreateManyAgentInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const TestCreateWithoutAgentInputSchema: z.ZodType<Prisma.TestCreateWithoutAgentInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  gitBranch: z.string().optional().nullable(),
  gitCommit: z.string().optional().nullable(),
  runFromApi: z.boolean().optional(),
  calls: z.lazy(() => CallCreateNestedManyWithoutTestInputSchema).optional()
}).strict();

export const TestUncheckedCreateWithoutAgentInputSchema: z.ZodType<Prisma.TestUncheckedCreateWithoutAgentInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  gitBranch: z.string().optional().nullable(),
  gitCommit: z.string().optional().nullable(),
  runFromApi: z.boolean().optional(),
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

export const CallCreateWithoutAgentInputSchema: z.ZodType<Prisma.CallCreateWithoutAgentInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  ownerId: z.string().optional().nullable(),
  deleted: z.boolean().optional(),
  vapiCallId: z.string().optional().nullable(),
  customerCallId: z.string().optional().nullable(),
  ofOneDeviceId: z.string().optional().nullable(),
  status: z.lazy(() => CallStatusSchema),
  result: z.lazy(() => CallResultSchema).optional().nullable(),
  failureReason: z.string().optional().nullable(),
  stereoRecordingUrl: z.string(),
  monoRecordingUrl: z.string().optional().nullable(),
  startedAt: z.string().optional().nullable(),
  endedAt: z.string().optional().nullable(),
  regionId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.number().optional().nullable(),
  latencyP90: z.number().optional().nullable(),
  latencyP95: z.number().optional().nullable(),
  interruptionP50: z.number().optional().nullable(),
  interruptionP90: z.number().optional().nullable(),
  interruptionP95: z.number().optional().nullable(),
  numInterruptions: z.number().int().optional().nullable(),
  duration: z.number().optional().nullable(),
  isRead: z.boolean().optional().nullable(),
  readBy: z.string().optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  test: z.lazy(() => TestCreateNestedOneWithoutCallsInputSchema).optional(),
  testAgent: z.lazy(() => TestAgentCreateNestedOneWithoutCallsInputSchema).optional(),
  scenario: z.lazy(() => ScenarioCreateNestedOneWithoutCallsInputSchema).optional(),
  evaluationResults: z.lazy(() => EvaluationResultCreateNestedManyWithoutCallInputSchema).optional(),
  messages: z.lazy(() => MessageCreateNestedManyWithoutCallInputSchema).optional(),
  latencyBlocks: z.lazy(() => LatencyBlockCreateNestedManyWithoutCallInputSchema).optional(),
  interruptions: z.lazy(() => InterruptionCreateNestedManyWithoutCallInputSchema).optional(),
  errors: z.lazy(() => CallErrorCreateNestedManyWithoutCallInputSchema).optional()
}).strict();

export const CallUncheckedCreateWithoutAgentInputSchema: z.ZodType<Prisma.CallUncheckedCreateWithoutAgentInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  ownerId: z.string().optional().nullable(),
  deleted: z.boolean().optional(),
  vapiCallId: z.string().optional().nullable(),
  customerCallId: z.string().optional().nullable(),
  ofOneDeviceId: z.string().optional().nullable(),
  status: z.lazy(() => CallStatusSchema),
  result: z.lazy(() => CallResultSchema).optional().nullable(),
  failureReason: z.string().optional().nullable(),
  stereoRecordingUrl: z.string(),
  monoRecordingUrl: z.string().optional().nullable(),
  startedAt: z.string().optional().nullable(),
  endedAt: z.string().optional().nullable(),
  regionId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.number().optional().nullable(),
  latencyP90: z.number().optional().nullable(),
  latencyP95: z.number().optional().nullable(),
  interruptionP50: z.number().optional().nullable(),
  interruptionP90: z.number().optional().nullable(),
  interruptionP95: z.number().optional().nullable(),
  numInterruptions: z.number().int().optional().nullable(),
  duration: z.number().optional().nullable(),
  isRead: z.boolean().optional().nullable(),
  readBy: z.string().optional().nullable(),
  testId: z.string().optional().nullable(),
  testAgentId: z.string().optional().nullable(),
  scenarioId: z.string().optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationResults: z.lazy(() => EvaluationResultUncheckedCreateNestedManyWithoutCallInputSchema).optional(),
  messages: z.lazy(() => MessageUncheckedCreateNestedManyWithoutCallInputSchema).optional(),
  latencyBlocks: z.lazy(() => LatencyBlockUncheckedCreateNestedManyWithoutCallInputSchema).optional(),
  interruptions: z.lazy(() => InterruptionUncheckedCreateNestedManyWithoutCallInputSchema).optional(),
  errors: z.lazy(() => CallErrorUncheckedCreateNestedManyWithoutCallInputSchema).optional()
}).strict();

export const CallCreateOrConnectWithoutAgentInputSchema: z.ZodType<Prisma.CallCreateOrConnectWithoutAgentInput> = z.object({
  where: z.lazy(() => CallWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CallCreateWithoutAgentInputSchema),z.lazy(() => CallUncheckedCreateWithoutAgentInputSchema) ]),
}).strict();

export const CallCreateManyAgentInputEnvelopeSchema: z.ZodType<Prisma.CallCreateManyAgentInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CallCreateManyAgentInputSchema),z.lazy(() => CallCreateManyAgentInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const GeneralEvaluationCreateWithoutAgentInputSchema: z.ZodType<Prisma.GeneralEvaluationCreateWithoutAgentInput> = z.object({
  id: z.string().optional(),
  evaluation: z.lazy(() => EvaluationCreateNestedOneWithoutGeneralEvaluationsInputSchema)
}).strict();

export const GeneralEvaluationUncheckedCreateWithoutAgentInputSchema: z.ZodType<Prisma.GeneralEvaluationUncheckedCreateWithoutAgentInput> = z.object({
  id: z.string().optional(),
  evaluationId: z.string()
}).strict();

export const GeneralEvaluationCreateOrConnectWithoutAgentInputSchema: z.ZodType<Prisma.GeneralEvaluationCreateOrConnectWithoutAgentInput> = z.object({
  where: z.lazy(() => GeneralEvaluationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => GeneralEvaluationCreateWithoutAgentInputSchema),z.lazy(() => GeneralEvaluationUncheckedCreateWithoutAgentInputSchema) ]),
}).strict();

export const GeneralEvaluationCreateManyAgentInputEnvelopeSchema: z.ZodType<Prisma.GeneralEvaluationCreateManyAgentInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => GeneralEvaluationCreateManyAgentInputSchema),z.lazy(() => GeneralEvaluationCreateManyAgentInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const TestAgentUpsertWithWhereUniqueWithoutAgentsInputSchema: z.ZodType<Prisma.TestAgentUpsertWithWhereUniqueWithoutAgentsInput> = z.object({
  where: z.lazy(() => TestAgentWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TestAgentUpdateWithoutAgentsInputSchema),z.lazy(() => TestAgentUncheckedUpdateWithoutAgentsInputSchema) ]),
  create: z.union([ z.lazy(() => TestAgentCreateWithoutAgentsInputSchema),z.lazy(() => TestAgentUncheckedCreateWithoutAgentsInputSchema) ]),
}).strict();

export const TestAgentUpdateWithWhereUniqueWithoutAgentsInputSchema: z.ZodType<Prisma.TestAgentUpdateWithWhereUniqueWithoutAgentsInput> = z.object({
  where: z.lazy(() => TestAgentWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TestAgentUpdateWithoutAgentsInputSchema),z.lazy(() => TestAgentUncheckedUpdateWithoutAgentsInputSchema) ]),
}).strict();

export const TestAgentUpdateManyWithWhereWithoutAgentsInputSchema: z.ZodType<Prisma.TestAgentUpdateManyWithWhereWithoutAgentsInput> = z.object({
  where: z.lazy(() => TestAgentScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TestAgentUpdateManyMutationInputSchema),z.lazy(() => TestAgentUncheckedUpdateManyWithoutAgentsInputSchema) ]),
}).strict();

export const TestAgentScalarWhereInputSchema: z.ZodType<Prisma.TestAgentScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TestAgentScalarWhereInputSchema),z.lazy(() => TestAgentScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TestAgentScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TestAgentScalarWhereInputSchema),z.lazy(() => TestAgentScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  headshotUrl: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  prompt: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  enabled: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  defaultSelected: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  order: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict();

export const ScenarioUpsertWithWhereUniqueWithoutAgentInputSchema: z.ZodType<Prisma.ScenarioUpsertWithWhereUniqueWithoutAgentInput> = z.object({
  where: z.lazy(() => ScenarioWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ScenarioUpdateWithoutAgentInputSchema),z.lazy(() => ScenarioUncheckedUpdateWithoutAgentInputSchema) ]),
  create: z.union([ z.lazy(() => ScenarioCreateWithoutAgentInputSchema),z.lazy(() => ScenarioUncheckedCreateWithoutAgentInputSchema) ]),
}).strict();

export const ScenarioUpdateWithWhereUniqueWithoutAgentInputSchema: z.ZodType<Prisma.ScenarioUpdateWithWhereUniqueWithoutAgentInput> = z.object({
  where: z.lazy(() => ScenarioWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ScenarioUpdateWithoutAgentInputSchema),z.lazy(() => ScenarioUncheckedUpdateWithoutAgentInputSchema) ]),
}).strict();

export const ScenarioUpdateManyWithWhereWithoutAgentInputSchema: z.ZodType<Prisma.ScenarioUpdateManyWithWhereWithoutAgentInput> = z.object({
  where: z.lazy(() => ScenarioScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ScenarioUpdateManyMutationInputSchema),z.lazy(() => ScenarioUncheckedUpdateManyWithoutAgentInputSchema) ]),
}).strict();

export const ScenarioScalarWhereInputSchema: z.ZodType<Prisma.ScenarioScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ScenarioScalarWhereInputSchema),z.lazy(() => ScenarioScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ScenarioScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ScenarioScalarWhereInputSchema),z.lazy(() => ScenarioScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  agentId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  instructions: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  successCriteria: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  includeDateTime: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  timezone: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  deleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
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
  gitBranch: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  gitCommit: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  runFromApi: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
}).strict();

export const CallUpsertWithWhereUniqueWithoutAgentInputSchema: z.ZodType<Prisma.CallUpsertWithWhereUniqueWithoutAgentInput> = z.object({
  where: z.lazy(() => CallWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CallUpdateWithoutAgentInputSchema),z.lazy(() => CallUncheckedUpdateWithoutAgentInputSchema) ]),
  create: z.union([ z.lazy(() => CallCreateWithoutAgentInputSchema),z.lazy(() => CallUncheckedCreateWithoutAgentInputSchema) ]),
}).strict();

export const CallUpdateWithWhereUniqueWithoutAgentInputSchema: z.ZodType<Prisma.CallUpdateWithWhereUniqueWithoutAgentInput> = z.object({
  where: z.lazy(() => CallWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CallUpdateWithoutAgentInputSchema),z.lazy(() => CallUncheckedUpdateWithoutAgentInputSchema) ]),
}).strict();

export const CallUpdateManyWithWhereWithoutAgentInputSchema: z.ZodType<Prisma.CallUpdateManyWithWhereWithoutAgentInput> = z.object({
  where: z.lazy(() => CallScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CallUpdateManyMutationInputSchema),z.lazy(() => CallUncheckedUpdateManyWithoutAgentInputSchema) ]),
}).strict();

export const CallScalarWhereInputSchema: z.ZodType<Prisma.CallScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CallScalarWhereInputSchema),z.lazy(() => CallScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CallScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CallScalarWhereInputSchema),z.lazy(() => CallScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  deleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  vapiCallId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  customerCallId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  ofOneDeviceId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  status: z.union([ z.lazy(() => EnumCallStatusFilterSchema),z.lazy(() => CallStatusSchema) ]).optional(),
  result: z.union([ z.lazy(() => EnumCallResultNullableFilterSchema),z.lazy(() => CallResultSchema) ]).optional().nullable(),
  failureReason: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  monoRecordingUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  startedAt: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  endedAt: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  regionId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  metadata: z.lazy(() => JsonNullableFilterSchema).optional(),
  latencyP50: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  latencyP90: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  latencyP95: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  interruptionP50: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  interruptionP90: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  interruptionP95: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  numInterruptions: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  duration: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  isRead: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  readBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  agentId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  testId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  testAgentId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  scenarioId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  evalSetToSuccess: z.lazy(() => JsonFilterSchema).optional()
}).strict();

export const GeneralEvaluationUpsertWithWhereUniqueWithoutAgentInputSchema: z.ZodType<Prisma.GeneralEvaluationUpsertWithWhereUniqueWithoutAgentInput> = z.object({
  where: z.lazy(() => GeneralEvaluationWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => GeneralEvaluationUpdateWithoutAgentInputSchema),z.lazy(() => GeneralEvaluationUncheckedUpdateWithoutAgentInputSchema) ]),
  create: z.union([ z.lazy(() => GeneralEvaluationCreateWithoutAgentInputSchema),z.lazy(() => GeneralEvaluationUncheckedCreateWithoutAgentInputSchema) ]),
}).strict();

export const GeneralEvaluationUpdateWithWhereUniqueWithoutAgentInputSchema: z.ZodType<Prisma.GeneralEvaluationUpdateWithWhereUniqueWithoutAgentInput> = z.object({
  where: z.lazy(() => GeneralEvaluationWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => GeneralEvaluationUpdateWithoutAgentInputSchema),z.lazy(() => GeneralEvaluationUncheckedUpdateWithoutAgentInputSchema) ]),
}).strict();

export const GeneralEvaluationUpdateManyWithWhereWithoutAgentInputSchema: z.ZodType<Prisma.GeneralEvaluationUpdateManyWithWhereWithoutAgentInput> = z.object({
  where: z.lazy(() => GeneralEvaluationScalarWhereInputSchema),
  data: z.union([ z.lazy(() => GeneralEvaluationUpdateManyMutationInputSchema),z.lazy(() => GeneralEvaluationUncheckedUpdateManyWithoutAgentInputSchema) ]),
}).strict();

export const GeneralEvaluationScalarWhereInputSchema: z.ZodType<Prisma.GeneralEvaluationScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => GeneralEvaluationScalarWhereInputSchema),z.lazy(() => GeneralEvaluationScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => GeneralEvaluationScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => GeneralEvaluationScalarWhereInputSchema),z.lazy(() => GeneralEvaluationScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  agentId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  evaluationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const AgentCreateWithoutTestsInputSchema: z.ZodType<Prisma.AgentCreateWithoutTestsInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  ownerId: z.string(),
  name: z.string(),
  phoneNumber: z.string().optional(),
  customerAgentId: z.string(),
  githubRepoUrl: z.string().optional().nullable(),
  systemPrompt: z.string().optional(),
  extraProperties: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enableSlackNotifications: z.boolean().optional(),
  enabledTestAgents: z.lazy(() => TestAgentCreateNestedManyWithoutAgentsInputSchema).optional(),
  scenarios: z.lazy(() => ScenarioCreateNestedManyWithoutAgentInputSchema).optional(),
  calls: z.lazy(() => CallCreateNestedManyWithoutAgentInputSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationCreateNestedManyWithoutAgentInputSchema).optional()
}).strict();

export const AgentUncheckedCreateWithoutTestsInputSchema: z.ZodType<Prisma.AgentUncheckedCreateWithoutTestsInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  ownerId: z.string(),
  name: z.string(),
  phoneNumber: z.string().optional(),
  customerAgentId: z.string(),
  githubRepoUrl: z.string().optional().nullable(),
  systemPrompt: z.string().optional(),
  extraProperties: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enableSlackNotifications: z.boolean().optional(),
  enabledTestAgents: z.lazy(() => TestAgentUncheckedCreateNestedManyWithoutAgentsInputSchema).optional(),
  scenarios: z.lazy(() => ScenarioUncheckedCreateNestedManyWithoutAgentInputSchema).optional(),
  calls: z.lazy(() => CallUncheckedCreateNestedManyWithoutAgentInputSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationUncheckedCreateNestedManyWithoutAgentInputSchema).optional()
}).strict();

export const AgentCreateOrConnectWithoutTestsInputSchema: z.ZodType<Prisma.AgentCreateOrConnectWithoutTestsInput> = z.object({
  where: z.lazy(() => AgentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AgentCreateWithoutTestsInputSchema),z.lazy(() => AgentUncheckedCreateWithoutTestsInputSchema) ]),
}).strict();

export const CallCreateWithoutTestInputSchema: z.ZodType<Prisma.CallCreateWithoutTestInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  ownerId: z.string().optional().nullable(),
  deleted: z.boolean().optional(),
  vapiCallId: z.string().optional().nullable(),
  customerCallId: z.string().optional().nullable(),
  ofOneDeviceId: z.string().optional().nullable(),
  status: z.lazy(() => CallStatusSchema),
  result: z.lazy(() => CallResultSchema).optional().nullable(),
  failureReason: z.string().optional().nullable(),
  stereoRecordingUrl: z.string(),
  monoRecordingUrl: z.string().optional().nullable(),
  startedAt: z.string().optional().nullable(),
  endedAt: z.string().optional().nullable(),
  regionId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.number().optional().nullable(),
  latencyP90: z.number().optional().nullable(),
  latencyP95: z.number().optional().nullable(),
  interruptionP50: z.number().optional().nullable(),
  interruptionP90: z.number().optional().nullable(),
  interruptionP95: z.number().optional().nullable(),
  numInterruptions: z.number().int().optional().nullable(),
  duration: z.number().optional().nullable(),
  isRead: z.boolean().optional().nullable(),
  readBy: z.string().optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  agent: z.lazy(() => AgentCreateNestedOneWithoutCallsInputSchema).optional(),
  testAgent: z.lazy(() => TestAgentCreateNestedOneWithoutCallsInputSchema).optional(),
  scenario: z.lazy(() => ScenarioCreateNestedOneWithoutCallsInputSchema).optional(),
  evaluationResults: z.lazy(() => EvaluationResultCreateNestedManyWithoutCallInputSchema).optional(),
  messages: z.lazy(() => MessageCreateNestedManyWithoutCallInputSchema).optional(),
  latencyBlocks: z.lazy(() => LatencyBlockCreateNestedManyWithoutCallInputSchema).optional(),
  interruptions: z.lazy(() => InterruptionCreateNestedManyWithoutCallInputSchema).optional(),
  errors: z.lazy(() => CallErrorCreateNestedManyWithoutCallInputSchema).optional()
}).strict();

export const CallUncheckedCreateWithoutTestInputSchema: z.ZodType<Prisma.CallUncheckedCreateWithoutTestInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  ownerId: z.string().optional().nullable(),
  deleted: z.boolean().optional(),
  vapiCallId: z.string().optional().nullable(),
  customerCallId: z.string().optional().nullable(),
  ofOneDeviceId: z.string().optional().nullable(),
  status: z.lazy(() => CallStatusSchema),
  result: z.lazy(() => CallResultSchema).optional().nullable(),
  failureReason: z.string().optional().nullable(),
  stereoRecordingUrl: z.string(),
  monoRecordingUrl: z.string().optional().nullable(),
  startedAt: z.string().optional().nullable(),
  endedAt: z.string().optional().nullable(),
  regionId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.number().optional().nullable(),
  latencyP90: z.number().optional().nullable(),
  latencyP95: z.number().optional().nullable(),
  interruptionP50: z.number().optional().nullable(),
  interruptionP90: z.number().optional().nullable(),
  interruptionP95: z.number().optional().nullable(),
  numInterruptions: z.number().int().optional().nullable(),
  duration: z.number().optional().nullable(),
  isRead: z.boolean().optional().nullable(),
  readBy: z.string().optional().nullable(),
  agentId: z.string().optional().nullable(),
  testAgentId: z.string().optional().nullable(),
  scenarioId: z.string().optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationResults: z.lazy(() => EvaluationResultUncheckedCreateNestedManyWithoutCallInputSchema).optional(),
  messages: z.lazy(() => MessageUncheckedCreateNestedManyWithoutCallInputSchema).optional(),
  latencyBlocks: z.lazy(() => LatencyBlockUncheckedCreateNestedManyWithoutCallInputSchema).optional(),
  interruptions: z.lazy(() => InterruptionUncheckedCreateNestedManyWithoutCallInputSchema).optional(),
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
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerAgentId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  githubRepoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  systemPrompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  extraProperties: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enableSlackNotifications: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  enabledTestAgents: z.lazy(() => TestAgentUpdateManyWithoutAgentsNestedInputSchema).optional(),
  scenarios: z.lazy(() => ScenarioUpdateManyWithoutAgentNestedInputSchema).optional(),
  calls: z.lazy(() => CallUpdateManyWithoutAgentNestedInputSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationUpdateManyWithoutAgentNestedInputSchema).optional()
}).strict();

export const AgentUncheckedUpdateWithoutTestsInputSchema: z.ZodType<Prisma.AgentUncheckedUpdateWithoutTestsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerAgentId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  githubRepoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  systemPrompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  extraProperties: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enableSlackNotifications: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  enabledTestAgents: z.lazy(() => TestAgentUncheckedUpdateManyWithoutAgentsNestedInputSchema).optional(),
  scenarios: z.lazy(() => ScenarioUncheckedUpdateManyWithoutAgentNestedInputSchema).optional(),
  calls: z.lazy(() => CallUncheckedUpdateManyWithoutAgentNestedInputSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationUncheckedUpdateManyWithoutAgentNestedInputSchema).optional()
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

export const AgentCreateWithoutEnabledTestAgentsInputSchema: z.ZodType<Prisma.AgentCreateWithoutEnabledTestAgentsInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  ownerId: z.string(),
  name: z.string(),
  phoneNumber: z.string().optional(),
  customerAgentId: z.string(),
  githubRepoUrl: z.string().optional().nullable(),
  systemPrompt: z.string().optional(),
  extraProperties: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enableSlackNotifications: z.boolean().optional(),
  scenarios: z.lazy(() => ScenarioCreateNestedManyWithoutAgentInputSchema).optional(),
  tests: z.lazy(() => TestCreateNestedManyWithoutAgentInputSchema).optional(),
  calls: z.lazy(() => CallCreateNestedManyWithoutAgentInputSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationCreateNestedManyWithoutAgentInputSchema).optional()
}).strict();

export const AgentUncheckedCreateWithoutEnabledTestAgentsInputSchema: z.ZodType<Prisma.AgentUncheckedCreateWithoutEnabledTestAgentsInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  ownerId: z.string(),
  name: z.string(),
  phoneNumber: z.string().optional(),
  customerAgentId: z.string(),
  githubRepoUrl: z.string().optional().nullable(),
  systemPrompt: z.string().optional(),
  extraProperties: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enableSlackNotifications: z.boolean().optional(),
  scenarios: z.lazy(() => ScenarioUncheckedCreateNestedManyWithoutAgentInputSchema).optional(),
  tests: z.lazy(() => TestUncheckedCreateNestedManyWithoutAgentInputSchema).optional(),
  calls: z.lazy(() => CallUncheckedCreateNestedManyWithoutAgentInputSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationUncheckedCreateNestedManyWithoutAgentInputSchema).optional()
}).strict();

export const AgentCreateOrConnectWithoutEnabledTestAgentsInputSchema: z.ZodType<Prisma.AgentCreateOrConnectWithoutEnabledTestAgentsInput> = z.object({
  where: z.lazy(() => AgentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AgentCreateWithoutEnabledTestAgentsInputSchema),z.lazy(() => AgentUncheckedCreateWithoutEnabledTestAgentsInputSchema) ]),
}).strict();

export const CallCreateWithoutTestAgentInputSchema: z.ZodType<Prisma.CallCreateWithoutTestAgentInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  ownerId: z.string().optional().nullable(),
  deleted: z.boolean().optional(),
  vapiCallId: z.string().optional().nullable(),
  customerCallId: z.string().optional().nullable(),
  ofOneDeviceId: z.string().optional().nullable(),
  status: z.lazy(() => CallStatusSchema),
  result: z.lazy(() => CallResultSchema).optional().nullable(),
  failureReason: z.string().optional().nullable(),
  stereoRecordingUrl: z.string(),
  monoRecordingUrl: z.string().optional().nullable(),
  startedAt: z.string().optional().nullable(),
  endedAt: z.string().optional().nullable(),
  regionId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.number().optional().nullable(),
  latencyP90: z.number().optional().nullable(),
  latencyP95: z.number().optional().nullable(),
  interruptionP50: z.number().optional().nullable(),
  interruptionP90: z.number().optional().nullable(),
  interruptionP95: z.number().optional().nullable(),
  numInterruptions: z.number().int().optional().nullable(),
  duration: z.number().optional().nullable(),
  isRead: z.boolean().optional().nullable(),
  readBy: z.string().optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  agent: z.lazy(() => AgentCreateNestedOneWithoutCallsInputSchema).optional(),
  test: z.lazy(() => TestCreateNestedOneWithoutCallsInputSchema).optional(),
  scenario: z.lazy(() => ScenarioCreateNestedOneWithoutCallsInputSchema).optional(),
  evaluationResults: z.lazy(() => EvaluationResultCreateNestedManyWithoutCallInputSchema).optional(),
  messages: z.lazy(() => MessageCreateNestedManyWithoutCallInputSchema).optional(),
  latencyBlocks: z.lazy(() => LatencyBlockCreateNestedManyWithoutCallInputSchema).optional(),
  interruptions: z.lazy(() => InterruptionCreateNestedManyWithoutCallInputSchema).optional(),
  errors: z.lazy(() => CallErrorCreateNestedManyWithoutCallInputSchema).optional()
}).strict();

export const CallUncheckedCreateWithoutTestAgentInputSchema: z.ZodType<Prisma.CallUncheckedCreateWithoutTestAgentInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  ownerId: z.string().optional().nullable(),
  deleted: z.boolean().optional(),
  vapiCallId: z.string().optional().nullable(),
  customerCallId: z.string().optional().nullable(),
  ofOneDeviceId: z.string().optional().nullable(),
  status: z.lazy(() => CallStatusSchema),
  result: z.lazy(() => CallResultSchema).optional().nullable(),
  failureReason: z.string().optional().nullable(),
  stereoRecordingUrl: z.string(),
  monoRecordingUrl: z.string().optional().nullable(),
  startedAt: z.string().optional().nullable(),
  endedAt: z.string().optional().nullable(),
  regionId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.number().optional().nullable(),
  latencyP90: z.number().optional().nullable(),
  latencyP95: z.number().optional().nullable(),
  interruptionP50: z.number().optional().nullable(),
  interruptionP90: z.number().optional().nullable(),
  interruptionP95: z.number().optional().nullable(),
  numInterruptions: z.number().int().optional().nullable(),
  duration: z.number().optional().nullable(),
  isRead: z.boolean().optional().nullable(),
  readBy: z.string().optional().nullable(),
  agentId: z.string().optional().nullable(),
  testId: z.string().optional().nullable(),
  scenarioId: z.string().optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationResults: z.lazy(() => EvaluationResultUncheckedCreateNestedManyWithoutCallInputSchema).optional(),
  messages: z.lazy(() => MessageUncheckedCreateNestedManyWithoutCallInputSchema).optional(),
  latencyBlocks: z.lazy(() => LatencyBlockUncheckedCreateNestedManyWithoutCallInputSchema).optional(),
  interruptions: z.lazy(() => InterruptionUncheckedCreateNestedManyWithoutCallInputSchema).optional(),
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

export const AgentUpsertWithWhereUniqueWithoutEnabledTestAgentsInputSchema: z.ZodType<Prisma.AgentUpsertWithWhereUniqueWithoutEnabledTestAgentsInput> = z.object({
  where: z.lazy(() => AgentWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => AgentUpdateWithoutEnabledTestAgentsInputSchema),z.lazy(() => AgentUncheckedUpdateWithoutEnabledTestAgentsInputSchema) ]),
  create: z.union([ z.lazy(() => AgentCreateWithoutEnabledTestAgentsInputSchema),z.lazy(() => AgentUncheckedCreateWithoutEnabledTestAgentsInputSchema) ]),
}).strict();

export const AgentUpdateWithWhereUniqueWithoutEnabledTestAgentsInputSchema: z.ZodType<Prisma.AgentUpdateWithWhereUniqueWithoutEnabledTestAgentsInput> = z.object({
  where: z.lazy(() => AgentWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => AgentUpdateWithoutEnabledTestAgentsInputSchema),z.lazy(() => AgentUncheckedUpdateWithoutEnabledTestAgentsInputSchema) ]),
}).strict();

export const AgentUpdateManyWithWhereWithoutEnabledTestAgentsInputSchema: z.ZodType<Prisma.AgentUpdateManyWithWhereWithoutEnabledTestAgentsInput> = z.object({
  where: z.lazy(() => AgentScalarWhereInputSchema),
  data: z.union([ z.lazy(() => AgentUpdateManyMutationInputSchema),z.lazy(() => AgentUncheckedUpdateManyWithoutEnabledTestAgentsInputSchema) ]),
}).strict();

export const AgentScalarWhereInputSchema: z.ZodType<Prisma.AgentScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AgentScalarWhereInputSchema),z.lazy(() => AgentScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AgentScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AgentScalarWhereInputSchema),z.lazy(() => AgentScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  phoneNumber: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  customerAgentId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  githubRepoUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  systemPrompt: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  extraProperties: z.lazy(() => JsonFilterSchema).optional(),
  enableSlackNotifications: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
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

export const AgentCreateWithoutCallsInputSchema: z.ZodType<Prisma.AgentCreateWithoutCallsInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  ownerId: z.string(),
  name: z.string(),
  phoneNumber: z.string().optional(),
  customerAgentId: z.string(),
  githubRepoUrl: z.string().optional().nullable(),
  systemPrompt: z.string().optional(),
  extraProperties: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enableSlackNotifications: z.boolean().optional(),
  enabledTestAgents: z.lazy(() => TestAgentCreateNestedManyWithoutAgentsInputSchema).optional(),
  scenarios: z.lazy(() => ScenarioCreateNestedManyWithoutAgentInputSchema).optional(),
  tests: z.lazy(() => TestCreateNestedManyWithoutAgentInputSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationCreateNestedManyWithoutAgentInputSchema).optional()
}).strict();

export const AgentUncheckedCreateWithoutCallsInputSchema: z.ZodType<Prisma.AgentUncheckedCreateWithoutCallsInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  ownerId: z.string(),
  name: z.string(),
  phoneNumber: z.string().optional(),
  customerAgentId: z.string(),
  githubRepoUrl: z.string().optional().nullable(),
  systemPrompt: z.string().optional(),
  extraProperties: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enableSlackNotifications: z.boolean().optional(),
  enabledTestAgents: z.lazy(() => TestAgentUncheckedCreateNestedManyWithoutAgentsInputSchema).optional(),
  scenarios: z.lazy(() => ScenarioUncheckedCreateNestedManyWithoutAgentInputSchema).optional(),
  tests: z.lazy(() => TestUncheckedCreateNestedManyWithoutAgentInputSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationUncheckedCreateNestedManyWithoutAgentInputSchema).optional()
}).strict();

export const AgentCreateOrConnectWithoutCallsInputSchema: z.ZodType<Prisma.AgentCreateOrConnectWithoutCallsInput> = z.object({
  where: z.lazy(() => AgentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AgentCreateWithoutCallsInputSchema),z.lazy(() => AgentUncheckedCreateWithoutCallsInputSchema) ]),
}).strict();

export const TestCreateWithoutCallsInputSchema: z.ZodType<Prisma.TestCreateWithoutCallsInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  gitBranch: z.string().optional().nullable(),
  gitCommit: z.string().optional().nullable(),
  runFromApi: z.boolean().optional(),
  agent: z.lazy(() => AgentCreateNestedOneWithoutTestsInputSchema)
}).strict();

export const TestUncheckedCreateWithoutCallsInputSchema: z.ZodType<Prisma.TestUncheckedCreateWithoutCallsInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  agentId: z.string(),
  gitBranch: z.string().optional().nullable(),
  gitCommit: z.string().optional().nullable(),
  runFromApi: z.boolean().optional()
}).strict();

export const TestCreateOrConnectWithoutCallsInputSchema: z.ZodType<Prisma.TestCreateOrConnectWithoutCallsInput> = z.object({
  where: z.lazy(() => TestWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TestCreateWithoutCallsInputSchema),z.lazy(() => TestUncheckedCreateWithoutCallsInputSchema) ]),
}).strict();

export const TestAgentCreateWithoutCallsInputSchema: z.ZodType<Prisma.TestAgentCreateWithoutCallsInput> = z.object({
  id: z.string().optional(),
  ownerId: z.string().optional().nullable(),
  name: z.string(),
  headshotUrl: z.string(),
  description: z.string(),
  prompt: z.string(),
  enabled: z.boolean().optional(),
  defaultSelected: z.boolean().optional(),
  order: z.number().int().optional(),
  agents: z.lazy(() => AgentCreateNestedManyWithoutEnabledTestAgentsInputSchema).optional()
}).strict();

export const TestAgentUncheckedCreateWithoutCallsInputSchema: z.ZodType<Prisma.TestAgentUncheckedCreateWithoutCallsInput> = z.object({
  id: z.string().optional(),
  ownerId: z.string().optional().nullable(),
  name: z.string(),
  headshotUrl: z.string(),
  description: z.string(),
  prompt: z.string(),
  enabled: z.boolean().optional(),
  defaultSelected: z.boolean().optional(),
  order: z.number().int().optional(),
  agents: z.lazy(() => AgentUncheckedCreateNestedManyWithoutEnabledTestAgentsInputSchema).optional()
}).strict();

export const TestAgentCreateOrConnectWithoutCallsInputSchema: z.ZodType<Prisma.TestAgentCreateOrConnectWithoutCallsInput> = z.object({
  where: z.lazy(() => TestAgentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TestAgentCreateWithoutCallsInputSchema),z.lazy(() => TestAgentUncheckedCreateWithoutCallsInputSchema) ]),
}).strict();

export const ScenarioCreateWithoutCallsInputSchema: z.ZodType<Prisma.ScenarioCreateWithoutCallsInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  name: z.string(),
  instructions: z.string(),
  successCriteria: z.string().optional(),
  includeDateTime: z.boolean().optional(),
  timezone: z.string().optional().nullable(),
  deleted: z.boolean().optional(),
  agent: z.lazy(() => AgentCreateNestedOneWithoutScenariosInputSchema),
  evaluations: z.lazy(() => EvaluationCreateNestedManyWithoutScenarioInputSchema).optional()
}).strict();

export const ScenarioUncheckedCreateWithoutCallsInputSchema: z.ZodType<Prisma.ScenarioUncheckedCreateWithoutCallsInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  agentId: z.string(),
  name: z.string(),
  instructions: z.string(),
  successCriteria: z.string().optional(),
  includeDateTime: z.boolean().optional(),
  timezone: z.string().optional().nullable(),
  deleted: z.boolean().optional(),
  evaluations: z.lazy(() => EvaluationUncheckedCreateNestedManyWithoutScenarioInputSchema).optional()
}).strict();

export const ScenarioCreateOrConnectWithoutCallsInputSchema: z.ZodType<Prisma.ScenarioCreateOrConnectWithoutCallsInput> = z.object({
  where: z.lazy(() => ScenarioWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ScenarioCreateWithoutCallsInputSchema),z.lazy(() => ScenarioUncheckedCreateWithoutCallsInputSchema) ]),
}).strict();

export const EvaluationResultCreateWithoutCallInputSchema: z.ZodType<Prisma.EvaluationResultCreateWithoutCallInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  result: z.string(),
  success: z.boolean(),
  secondsFromStart: z.number().optional().nullable(),
  duration: z.number().optional().nullable(),
  type: z.lazy(() => EvalResultTypeSchema),
  details: z.string(),
  evaluation: z.lazy(() => EvaluationCreateNestedOneWithoutEvaluationResultsInputSchema),
  evaluationTemplate: z.lazy(() => EvaluationTemplateCreateNestedOneWithoutEvaluationResultsInputSchema).optional()
}).strict();

export const EvaluationResultUncheckedCreateWithoutCallInputSchema: z.ZodType<Prisma.EvaluationResultUncheckedCreateWithoutCallInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  evaluationId: z.string(),
  result: z.string(),
  success: z.boolean(),
  secondsFromStart: z.number().optional().nullable(),
  duration: z.number().optional().nullable(),
  type: z.lazy(() => EvalResultTypeSchema),
  details: z.string(),
  evaluationTemplateId: z.string().optional().nullable()
}).strict();

export const EvaluationResultCreateOrConnectWithoutCallInputSchema: z.ZodType<Prisma.EvaluationResultCreateOrConnectWithoutCallInput> = z.object({
  where: z.lazy(() => EvaluationResultWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => EvaluationResultCreateWithoutCallInputSchema),z.lazy(() => EvaluationResultUncheckedCreateWithoutCallInputSchema) ]),
}).strict();

export const EvaluationResultCreateManyCallInputEnvelopeSchema: z.ZodType<Prisma.EvaluationResultCreateManyCallInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => EvaluationResultCreateManyCallInputSchema),z.lazy(() => EvaluationResultCreateManyCallInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const MessageCreateWithoutCallInputSchema: z.ZodType<Prisma.MessageCreateWithoutCallInput> = z.object({
  id: z.string().optional(),
  role: z.lazy(() => RoleSchema),
  message: z.string().optional(),
  time: z.number().optional(),
  endTime: z.number().optional(),
  secondsFromStart: z.number().optional(),
  duration: z.number().optional(),
  name: z.string().optional(),
  result: z.string().optional(),
  toolCalls: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const MessageUncheckedCreateWithoutCallInputSchema: z.ZodType<Prisma.MessageUncheckedCreateWithoutCallInput> = z.object({
  id: z.string().optional(),
  role: z.lazy(() => RoleSchema),
  message: z.string().optional(),
  time: z.number().optional(),
  endTime: z.number().optional(),
  secondsFromStart: z.number().optional(),
  duration: z.number().optional(),
  name: z.string().optional(),
  result: z.string().optional(),
  toolCalls: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const MessageCreateOrConnectWithoutCallInputSchema: z.ZodType<Prisma.MessageCreateOrConnectWithoutCallInput> = z.object({
  where: z.lazy(() => MessageWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MessageCreateWithoutCallInputSchema),z.lazy(() => MessageUncheckedCreateWithoutCallInputSchema) ]),
}).strict();

export const MessageCreateManyCallInputEnvelopeSchema: z.ZodType<Prisma.MessageCreateManyCallInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => MessageCreateManyCallInputSchema),z.lazy(() => MessageCreateManyCallInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const LatencyBlockCreateWithoutCallInputSchema: z.ZodType<Prisma.LatencyBlockCreateWithoutCallInput> = z.object({
  id: z.string().optional(),
  secondsFromStart: z.number(),
  duration: z.number()
}).strict();

export const LatencyBlockUncheckedCreateWithoutCallInputSchema: z.ZodType<Prisma.LatencyBlockUncheckedCreateWithoutCallInput> = z.object({
  id: z.string().optional(),
  secondsFromStart: z.number(),
  duration: z.number()
}).strict();

export const LatencyBlockCreateOrConnectWithoutCallInputSchema: z.ZodType<Prisma.LatencyBlockCreateOrConnectWithoutCallInput> = z.object({
  where: z.lazy(() => LatencyBlockWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => LatencyBlockCreateWithoutCallInputSchema),z.lazy(() => LatencyBlockUncheckedCreateWithoutCallInputSchema) ]),
}).strict();

export const LatencyBlockCreateManyCallInputEnvelopeSchema: z.ZodType<Prisma.LatencyBlockCreateManyCallInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => LatencyBlockCreateManyCallInputSchema),z.lazy(() => LatencyBlockCreateManyCallInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const InterruptionCreateWithoutCallInputSchema: z.ZodType<Prisma.InterruptionCreateWithoutCallInput> = z.object({
  id: z.string().optional(),
  secondsFromStart: z.number(),
  duration: z.number(),
  text: z.string()
}).strict();

export const InterruptionUncheckedCreateWithoutCallInputSchema: z.ZodType<Prisma.InterruptionUncheckedCreateWithoutCallInput> = z.object({
  id: z.string().optional(),
  secondsFromStart: z.number(),
  duration: z.number(),
  text: z.string()
}).strict();

export const InterruptionCreateOrConnectWithoutCallInputSchema: z.ZodType<Prisma.InterruptionCreateOrConnectWithoutCallInput> = z.object({
  where: z.lazy(() => InterruptionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => InterruptionCreateWithoutCallInputSchema),z.lazy(() => InterruptionUncheckedCreateWithoutCallInputSchema) ]),
}).strict();

export const InterruptionCreateManyCallInputEnvelopeSchema: z.ZodType<Prisma.InterruptionCreateManyCallInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => InterruptionCreateManyCallInputSchema),z.lazy(() => InterruptionCreateManyCallInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const CallErrorCreateWithoutCallInputSchema: z.ZodType<Prisma.CallErrorCreateWithoutCallInput> = z.object({
  id: z.string().optional(),
  secondsFromStart: z.number(),
  duration: z.number(),
  type: z.string().optional().nullable(),
  description: z.string()
}).strict();

export const CallErrorUncheckedCreateWithoutCallInputSchema: z.ZodType<Prisma.CallErrorUncheckedCreateWithoutCallInput> = z.object({
  id: z.string().optional(),
  secondsFromStart: z.number(),
  duration: z.number(),
  type: z.string().optional().nullable(),
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

export const AgentUpsertWithoutCallsInputSchema: z.ZodType<Prisma.AgentUpsertWithoutCallsInput> = z.object({
  update: z.union([ z.lazy(() => AgentUpdateWithoutCallsInputSchema),z.lazy(() => AgentUncheckedUpdateWithoutCallsInputSchema) ]),
  create: z.union([ z.lazy(() => AgentCreateWithoutCallsInputSchema),z.lazy(() => AgentUncheckedCreateWithoutCallsInputSchema) ]),
  where: z.lazy(() => AgentWhereInputSchema).optional()
}).strict();

export const AgentUpdateToOneWithWhereWithoutCallsInputSchema: z.ZodType<Prisma.AgentUpdateToOneWithWhereWithoutCallsInput> = z.object({
  where: z.lazy(() => AgentWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => AgentUpdateWithoutCallsInputSchema),z.lazy(() => AgentUncheckedUpdateWithoutCallsInputSchema) ]),
}).strict();

export const AgentUpdateWithoutCallsInputSchema: z.ZodType<Prisma.AgentUpdateWithoutCallsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerAgentId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  githubRepoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  systemPrompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  extraProperties: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enableSlackNotifications: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  enabledTestAgents: z.lazy(() => TestAgentUpdateManyWithoutAgentsNestedInputSchema).optional(),
  scenarios: z.lazy(() => ScenarioUpdateManyWithoutAgentNestedInputSchema).optional(),
  tests: z.lazy(() => TestUpdateManyWithoutAgentNestedInputSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationUpdateManyWithoutAgentNestedInputSchema).optional()
}).strict();

export const AgentUncheckedUpdateWithoutCallsInputSchema: z.ZodType<Prisma.AgentUncheckedUpdateWithoutCallsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerAgentId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  githubRepoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  systemPrompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  extraProperties: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enableSlackNotifications: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  enabledTestAgents: z.lazy(() => TestAgentUncheckedUpdateManyWithoutAgentsNestedInputSchema).optional(),
  scenarios: z.lazy(() => ScenarioUncheckedUpdateManyWithoutAgentNestedInputSchema).optional(),
  tests: z.lazy(() => TestUncheckedUpdateManyWithoutAgentNestedInputSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationUncheckedUpdateManyWithoutAgentNestedInputSchema).optional()
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
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  gitBranch: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  gitCommit: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  runFromApi: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  agent: z.lazy(() => AgentUpdateOneRequiredWithoutTestsNestedInputSchema).optional()
}).strict();

export const TestUncheckedUpdateWithoutCallsInputSchema: z.ZodType<Prisma.TestUncheckedUpdateWithoutCallsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  agentId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gitBranch: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  gitCommit: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  runFromApi: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TestAgentUpsertWithoutCallsInputSchema: z.ZodType<Prisma.TestAgentUpsertWithoutCallsInput> = z.object({
  update: z.union([ z.lazy(() => TestAgentUpdateWithoutCallsInputSchema),z.lazy(() => TestAgentUncheckedUpdateWithoutCallsInputSchema) ]),
  create: z.union([ z.lazy(() => TestAgentCreateWithoutCallsInputSchema),z.lazy(() => TestAgentUncheckedCreateWithoutCallsInputSchema) ]),
  where: z.lazy(() => TestAgentWhereInputSchema).optional()
}).strict();

export const TestAgentUpdateToOneWithWhereWithoutCallsInputSchema: z.ZodType<Prisma.TestAgentUpdateToOneWithWhereWithoutCallsInput> = z.object({
  where: z.lazy(() => TestAgentWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => TestAgentUpdateWithoutCallsInputSchema),z.lazy(() => TestAgentUncheckedUpdateWithoutCallsInputSchema) ]),
}).strict();

export const TestAgentUpdateWithoutCallsInputSchema: z.ZodType<Prisma.TestAgentUpdateWithoutCallsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  headshotUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  prompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  defaultSelected: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  agents: z.lazy(() => AgentUpdateManyWithoutEnabledTestAgentsNestedInputSchema).optional()
}).strict();

export const TestAgentUncheckedUpdateWithoutCallsInputSchema: z.ZodType<Prisma.TestAgentUncheckedUpdateWithoutCallsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  headshotUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  prompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  defaultSelected: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  agents: z.lazy(() => AgentUncheckedUpdateManyWithoutEnabledTestAgentsNestedInputSchema).optional()
}).strict();

export const ScenarioUpsertWithoutCallsInputSchema: z.ZodType<Prisma.ScenarioUpsertWithoutCallsInput> = z.object({
  update: z.union([ z.lazy(() => ScenarioUpdateWithoutCallsInputSchema),z.lazy(() => ScenarioUncheckedUpdateWithoutCallsInputSchema) ]),
  create: z.union([ z.lazy(() => ScenarioCreateWithoutCallsInputSchema),z.lazy(() => ScenarioUncheckedCreateWithoutCallsInputSchema) ]),
  where: z.lazy(() => ScenarioWhereInputSchema).optional()
}).strict();

export const ScenarioUpdateToOneWithWhereWithoutCallsInputSchema: z.ZodType<Prisma.ScenarioUpdateToOneWithWhereWithoutCallsInput> = z.object({
  where: z.lazy(() => ScenarioWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ScenarioUpdateWithoutCallsInputSchema),z.lazy(() => ScenarioUncheckedUpdateWithoutCallsInputSchema) ]),
}).strict();

export const ScenarioUpdateWithoutCallsInputSchema: z.ZodType<Prisma.ScenarioUpdateWithoutCallsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  instructions: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  successCriteria: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  includeDateTime: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  timezone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  agent: z.lazy(() => AgentUpdateOneRequiredWithoutScenariosNestedInputSchema).optional(),
  evaluations: z.lazy(() => EvaluationUpdateManyWithoutScenarioNestedInputSchema).optional()
}).strict();

export const ScenarioUncheckedUpdateWithoutCallsInputSchema: z.ZodType<Prisma.ScenarioUncheckedUpdateWithoutCallsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  agentId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  instructions: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  successCriteria: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  includeDateTime: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  timezone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  evaluations: z.lazy(() => EvaluationUncheckedUpdateManyWithoutScenarioNestedInputSchema).optional()
}).strict();

export const EvaluationResultUpsertWithWhereUniqueWithoutCallInputSchema: z.ZodType<Prisma.EvaluationResultUpsertWithWhereUniqueWithoutCallInput> = z.object({
  where: z.lazy(() => EvaluationResultWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => EvaluationResultUpdateWithoutCallInputSchema),z.lazy(() => EvaluationResultUncheckedUpdateWithoutCallInputSchema) ]),
  create: z.union([ z.lazy(() => EvaluationResultCreateWithoutCallInputSchema),z.lazy(() => EvaluationResultUncheckedCreateWithoutCallInputSchema) ]),
}).strict();

export const EvaluationResultUpdateWithWhereUniqueWithoutCallInputSchema: z.ZodType<Prisma.EvaluationResultUpdateWithWhereUniqueWithoutCallInput> = z.object({
  where: z.lazy(() => EvaluationResultWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => EvaluationResultUpdateWithoutCallInputSchema),z.lazy(() => EvaluationResultUncheckedUpdateWithoutCallInputSchema) ]),
}).strict();

export const EvaluationResultUpdateManyWithWhereWithoutCallInputSchema: z.ZodType<Prisma.EvaluationResultUpdateManyWithWhereWithoutCallInput> = z.object({
  where: z.lazy(() => EvaluationResultScalarWhereInputSchema),
  data: z.union([ z.lazy(() => EvaluationResultUpdateManyMutationInputSchema),z.lazy(() => EvaluationResultUncheckedUpdateManyWithoutCallInputSchema) ]),
}).strict();

export const EvaluationResultScalarWhereInputSchema: z.ZodType<Prisma.EvaluationResultScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => EvaluationResultScalarWhereInputSchema),z.lazy(() => EvaluationResultScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvaluationResultScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvaluationResultScalarWhereInputSchema),z.lazy(() => EvaluationResultScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  callId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  evaluationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  result: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  success: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  secondsFromStart: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  duration: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  type: z.union([ z.lazy(() => EnumEvalResultTypeFilterSchema),z.lazy(() => EvalResultTypeSchema) ]).optional(),
  details: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  evaluationTemplateId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
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
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  result: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  toolCalls: z.lazy(() => JsonFilterSchema).optional(),
  callId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const LatencyBlockUpsertWithWhereUniqueWithoutCallInputSchema: z.ZodType<Prisma.LatencyBlockUpsertWithWhereUniqueWithoutCallInput> = z.object({
  where: z.lazy(() => LatencyBlockWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => LatencyBlockUpdateWithoutCallInputSchema),z.lazy(() => LatencyBlockUncheckedUpdateWithoutCallInputSchema) ]),
  create: z.union([ z.lazy(() => LatencyBlockCreateWithoutCallInputSchema),z.lazy(() => LatencyBlockUncheckedCreateWithoutCallInputSchema) ]),
}).strict();

export const LatencyBlockUpdateWithWhereUniqueWithoutCallInputSchema: z.ZodType<Prisma.LatencyBlockUpdateWithWhereUniqueWithoutCallInput> = z.object({
  where: z.lazy(() => LatencyBlockWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => LatencyBlockUpdateWithoutCallInputSchema),z.lazy(() => LatencyBlockUncheckedUpdateWithoutCallInputSchema) ]),
}).strict();

export const LatencyBlockUpdateManyWithWhereWithoutCallInputSchema: z.ZodType<Prisma.LatencyBlockUpdateManyWithWhereWithoutCallInput> = z.object({
  where: z.lazy(() => LatencyBlockScalarWhereInputSchema),
  data: z.union([ z.lazy(() => LatencyBlockUpdateManyMutationInputSchema),z.lazy(() => LatencyBlockUncheckedUpdateManyWithoutCallInputSchema) ]),
}).strict();

export const LatencyBlockScalarWhereInputSchema: z.ZodType<Prisma.LatencyBlockScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => LatencyBlockScalarWhereInputSchema),z.lazy(() => LatencyBlockScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LatencyBlockScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LatencyBlockScalarWhereInputSchema),z.lazy(() => LatencyBlockScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  secondsFromStart: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  duration: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  callId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const InterruptionUpsertWithWhereUniqueWithoutCallInputSchema: z.ZodType<Prisma.InterruptionUpsertWithWhereUniqueWithoutCallInput> = z.object({
  where: z.lazy(() => InterruptionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => InterruptionUpdateWithoutCallInputSchema),z.lazy(() => InterruptionUncheckedUpdateWithoutCallInputSchema) ]),
  create: z.union([ z.lazy(() => InterruptionCreateWithoutCallInputSchema),z.lazy(() => InterruptionUncheckedCreateWithoutCallInputSchema) ]),
}).strict();

export const InterruptionUpdateWithWhereUniqueWithoutCallInputSchema: z.ZodType<Prisma.InterruptionUpdateWithWhereUniqueWithoutCallInput> = z.object({
  where: z.lazy(() => InterruptionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => InterruptionUpdateWithoutCallInputSchema),z.lazy(() => InterruptionUncheckedUpdateWithoutCallInputSchema) ]),
}).strict();

export const InterruptionUpdateManyWithWhereWithoutCallInputSchema: z.ZodType<Prisma.InterruptionUpdateManyWithWhereWithoutCallInput> = z.object({
  where: z.lazy(() => InterruptionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => InterruptionUpdateManyMutationInputSchema),z.lazy(() => InterruptionUncheckedUpdateManyWithoutCallInputSchema) ]),
}).strict();

export const InterruptionScalarWhereInputSchema: z.ZodType<Prisma.InterruptionScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => InterruptionScalarWhereInputSchema),z.lazy(() => InterruptionScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => InterruptionScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => InterruptionScalarWhereInputSchema),z.lazy(() => InterruptionScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  secondsFromStart: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  duration: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  callId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  text: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
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
  type: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  callId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const CallCreateWithoutMessagesInputSchema: z.ZodType<Prisma.CallCreateWithoutMessagesInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  ownerId: z.string().optional().nullable(),
  deleted: z.boolean().optional(),
  vapiCallId: z.string().optional().nullable(),
  customerCallId: z.string().optional().nullable(),
  ofOneDeviceId: z.string().optional().nullable(),
  status: z.lazy(() => CallStatusSchema),
  result: z.lazy(() => CallResultSchema).optional().nullable(),
  failureReason: z.string().optional().nullable(),
  stereoRecordingUrl: z.string(),
  monoRecordingUrl: z.string().optional().nullable(),
  startedAt: z.string().optional().nullable(),
  endedAt: z.string().optional().nullable(),
  regionId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.number().optional().nullable(),
  latencyP90: z.number().optional().nullable(),
  latencyP95: z.number().optional().nullable(),
  interruptionP50: z.number().optional().nullable(),
  interruptionP90: z.number().optional().nullable(),
  interruptionP95: z.number().optional().nullable(),
  numInterruptions: z.number().int().optional().nullable(),
  duration: z.number().optional().nullable(),
  isRead: z.boolean().optional().nullable(),
  readBy: z.string().optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  agent: z.lazy(() => AgentCreateNestedOneWithoutCallsInputSchema).optional(),
  test: z.lazy(() => TestCreateNestedOneWithoutCallsInputSchema).optional(),
  testAgent: z.lazy(() => TestAgentCreateNestedOneWithoutCallsInputSchema).optional(),
  scenario: z.lazy(() => ScenarioCreateNestedOneWithoutCallsInputSchema).optional(),
  evaluationResults: z.lazy(() => EvaluationResultCreateNestedManyWithoutCallInputSchema).optional(),
  latencyBlocks: z.lazy(() => LatencyBlockCreateNestedManyWithoutCallInputSchema).optional(),
  interruptions: z.lazy(() => InterruptionCreateNestedManyWithoutCallInputSchema).optional(),
  errors: z.lazy(() => CallErrorCreateNestedManyWithoutCallInputSchema).optional()
}).strict();

export const CallUncheckedCreateWithoutMessagesInputSchema: z.ZodType<Prisma.CallUncheckedCreateWithoutMessagesInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  ownerId: z.string().optional().nullable(),
  deleted: z.boolean().optional(),
  vapiCallId: z.string().optional().nullable(),
  customerCallId: z.string().optional().nullable(),
  ofOneDeviceId: z.string().optional().nullable(),
  status: z.lazy(() => CallStatusSchema),
  result: z.lazy(() => CallResultSchema).optional().nullable(),
  failureReason: z.string().optional().nullable(),
  stereoRecordingUrl: z.string(),
  monoRecordingUrl: z.string().optional().nullable(),
  startedAt: z.string().optional().nullable(),
  endedAt: z.string().optional().nullable(),
  regionId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.number().optional().nullable(),
  latencyP90: z.number().optional().nullable(),
  latencyP95: z.number().optional().nullable(),
  interruptionP50: z.number().optional().nullable(),
  interruptionP90: z.number().optional().nullable(),
  interruptionP95: z.number().optional().nullable(),
  numInterruptions: z.number().int().optional().nullable(),
  duration: z.number().optional().nullable(),
  isRead: z.boolean().optional().nullable(),
  readBy: z.string().optional().nullable(),
  agentId: z.string().optional().nullable(),
  testId: z.string().optional().nullable(),
  testAgentId: z.string().optional().nullable(),
  scenarioId: z.string().optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationResults: z.lazy(() => EvaluationResultUncheckedCreateNestedManyWithoutCallInputSchema).optional(),
  latencyBlocks: z.lazy(() => LatencyBlockUncheckedCreateNestedManyWithoutCallInputSchema).optional(),
  interruptions: z.lazy(() => InterruptionUncheckedCreateNestedManyWithoutCallInputSchema).optional(),
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
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  vapiCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ofOneDeviceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => EnumCallStatusFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => NullableEnumCallResultFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  failureReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  monoRecordingUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  regionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numInterruptions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isRead: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  readBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  agent: z.lazy(() => AgentUpdateOneWithoutCallsNestedInputSchema).optional(),
  test: z.lazy(() => TestUpdateOneWithoutCallsNestedInputSchema).optional(),
  testAgent: z.lazy(() => TestAgentUpdateOneWithoutCallsNestedInputSchema).optional(),
  scenario: z.lazy(() => ScenarioUpdateOneWithoutCallsNestedInputSchema).optional(),
  evaluationResults: z.lazy(() => EvaluationResultUpdateManyWithoutCallNestedInputSchema).optional(),
  latencyBlocks: z.lazy(() => LatencyBlockUpdateManyWithoutCallNestedInputSchema).optional(),
  interruptions: z.lazy(() => InterruptionUpdateManyWithoutCallNestedInputSchema).optional(),
  errors: z.lazy(() => CallErrorUpdateManyWithoutCallNestedInputSchema).optional()
}).strict();

export const CallUncheckedUpdateWithoutMessagesInputSchema: z.ZodType<Prisma.CallUncheckedUpdateWithoutMessagesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  vapiCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ofOneDeviceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => EnumCallStatusFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => NullableEnumCallResultFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  failureReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  monoRecordingUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  regionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numInterruptions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isRead: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  readBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  agentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testAgentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scenarioId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationResults: z.lazy(() => EvaluationResultUncheckedUpdateManyWithoutCallNestedInputSchema).optional(),
  latencyBlocks: z.lazy(() => LatencyBlockUncheckedUpdateManyWithoutCallNestedInputSchema).optional(),
  interruptions: z.lazy(() => InterruptionUncheckedUpdateManyWithoutCallNestedInputSchema).optional(),
  errors: z.lazy(() => CallErrorUncheckedUpdateManyWithoutCallNestedInputSchema).optional()
}).strict();

export const CallCreateWithoutErrorsInputSchema: z.ZodType<Prisma.CallCreateWithoutErrorsInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  ownerId: z.string().optional().nullable(),
  deleted: z.boolean().optional(),
  vapiCallId: z.string().optional().nullable(),
  customerCallId: z.string().optional().nullable(),
  ofOneDeviceId: z.string().optional().nullable(),
  status: z.lazy(() => CallStatusSchema),
  result: z.lazy(() => CallResultSchema).optional().nullable(),
  failureReason: z.string().optional().nullable(),
  stereoRecordingUrl: z.string(),
  monoRecordingUrl: z.string().optional().nullable(),
  startedAt: z.string().optional().nullable(),
  endedAt: z.string().optional().nullable(),
  regionId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.number().optional().nullable(),
  latencyP90: z.number().optional().nullable(),
  latencyP95: z.number().optional().nullable(),
  interruptionP50: z.number().optional().nullable(),
  interruptionP90: z.number().optional().nullable(),
  interruptionP95: z.number().optional().nullable(),
  numInterruptions: z.number().int().optional().nullable(),
  duration: z.number().optional().nullable(),
  isRead: z.boolean().optional().nullable(),
  readBy: z.string().optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  agent: z.lazy(() => AgentCreateNestedOneWithoutCallsInputSchema).optional(),
  test: z.lazy(() => TestCreateNestedOneWithoutCallsInputSchema).optional(),
  testAgent: z.lazy(() => TestAgentCreateNestedOneWithoutCallsInputSchema).optional(),
  scenario: z.lazy(() => ScenarioCreateNestedOneWithoutCallsInputSchema).optional(),
  evaluationResults: z.lazy(() => EvaluationResultCreateNestedManyWithoutCallInputSchema).optional(),
  messages: z.lazy(() => MessageCreateNestedManyWithoutCallInputSchema).optional(),
  latencyBlocks: z.lazy(() => LatencyBlockCreateNestedManyWithoutCallInputSchema).optional(),
  interruptions: z.lazy(() => InterruptionCreateNestedManyWithoutCallInputSchema).optional()
}).strict();

export const CallUncheckedCreateWithoutErrorsInputSchema: z.ZodType<Prisma.CallUncheckedCreateWithoutErrorsInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  ownerId: z.string().optional().nullable(),
  deleted: z.boolean().optional(),
  vapiCallId: z.string().optional().nullable(),
  customerCallId: z.string().optional().nullable(),
  ofOneDeviceId: z.string().optional().nullable(),
  status: z.lazy(() => CallStatusSchema),
  result: z.lazy(() => CallResultSchema).optional().nullable(),
  failureReason: z.string().optional().nullable(),
  stereoRecordingUrl: z.string(),
  monoRecordingUrl: z.string().optional().nullable(),
  startedAt: z.string().optional().nullable(),
  endedAt: z.string().optional().nullable(),
  regionId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.number().optional().nullable(),
  latencyP90: z.number().optional().nullable(),
  latencyP95: z.number().optional().nullable(),
  interruptionP50: z.number().optional().nullable(),
  interruptionP90: z.number().optional().nullable(),
  interruptionP95: z.number().optional().nullable(),
  numInterruptions: z.number().int().optional().nullable(),
  duration: z.number().optional().nullable(),
  isRead: z.boolean().optional().nullable(),
  readBy: z.string().optional().nullable(),
  agentId: z.string().optional().nullable(),
  testId: z.string().optional().nullable(),
  testAgentId: z.string().optional().nullable(),
  scenarioId: z.string().optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationResults: z.lazy(() => EvaluationResultUncheckedCreateNestedManyWithoutCallInputSchema).optional(),
  messages: z.lazy(() => MessageUncheckedCreateNestedManyWithoutCallInputSchema).optional(),
  latencyBlocks: z.lazy(() => LatencyBlockUncheckedCreateNestedManyWithoutCallInputSchema).optional(),
  interruptions: z.lazy(() => InterruptionUncheckedCreateNestedManyWithoutCallInputSchema).optional()
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
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  vapiCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ofOneDeviceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => EnumCallStatusFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => NullableEnumCallResultFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  failureReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  monoRecordingUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  regionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numInterruptions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isRead: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  readBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  agent: z.lazy(() => AgentUpdateOneWithoutCallsNestedInputSchema).optional(),
  test: z.lazy(() => TestUpdateOneWithoutCallsNestedInputSchema).optional(),
  testAgent: z.lazy(() => TestAgentUpdateOneWithoutCallsNestedInputSchema).optional(),
  scenario: z.lazy(() => ScenarioUpdateOneWithoutCallsNestedInputSchema).optional(),
  evaluationResults: z.lazy(() => EvaluationResultUpdateManyWithoutCallNestedInputSchema).optional(),
  messages: z.lazy(() => MessageUpdateManyWithoutCallNestedInputSchema).optional(),
  latencyBlocks: z.lazy(() => LatencyBlockUpdateManyWithoutCallNestedInputSchema).optional(),
  interruptions: z.lazy(() => InterruptionUpdateManyWithoutCallNestedInputSchema).optional()
}).strict();

export const CallUncheckedUpdateWithoutErrorsInputSchema: z.ZodType<Prisma.CallUncheckedUpdateWithoutErrorsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  vapiCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ofOneDeviceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => EnumCallStatusFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => NullableEnumCallResultFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  failureReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  monoRecordingUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  regionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numInterruptions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isRead: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  readBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  agentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testAgentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scenarioId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationResults: z.lazy(() => EvaluationResultUncheckedUpdateManyWithoutCallNestedInputSchema).optional(),
  messages: z.lazy(() => MessageUncheckedUpdateManyWithoutCallNestedInputSchema).optional(),
  latencyBlocks: z.lazy(() => LatencyBlockUncheckedUpdateManyWithoutCallNestedInputSchema).optional(),
  interruptions: z.lazy(() => InterruptionUncheckedUpdateManyWithoutCallNestedInputSchema).optional()
}).strict();

export const AgentCreateWithoutScenariosInputSchema: z.ZodType<Prisma.AgentCreateWithoutScenariosInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  ownerId: z.string(),
  name: z.string(),
  phoneNumber: z.string().optional(),
  customerAgentId: z.string(),
  githubRepoUrl: z.string().optional().nullable(),
  systemPrompt: z.string().optional(),
  extraProperties: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enableSlackNotifications: z.boolean().optional(),
  enabledTestAgents: z.lazy(() => TestAgentCreateNestedManyWithoutAgentsInputSchema).optional(),
  tests: z.lazy(() => TestCreateNestedManyWithoutAgentInputSchema).optional(),
  calls: z.lazy(() => CallCreateNestedManyWithoutAgentInputSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationCreateNestedManyWithoutAgentInputSchema).optional()
}).strict();

export const AgentUncheckedCreateWithoutScenariosInputSchema: z.ZodType<Prisma.AgentUncheckedCreateWithoutScenariosInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  ownerId: z.string(),
  name: z.string(),
  phoneNumber: z.string().optional(),
  customerAgentId: z.string(),
  githubRepoUrl: z.string().optional().nullable(),
  systemPrompt: z.string().optional(),
  extraProperties: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enableSlackNotifications: z.boolean().optional(),
  enabledTestAgents: z.lazy(() => TestAgentUncheckedCreateNestedManyWithoutAgentsInputSchema).optional(),
  tests: z.lazy(() => TestUncheckedCreateNestedManyWithoutAgentInputSchema).optional(),
  calls: z.lazy(() => CallUncheckedCreateNestedManyWithoutAgentInputSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationUncheckedCreateNestedManyWithoutAgentInputSchema).optional()
}).strict();

export const AgentCreateOrConnectWithoutScenariosInputSchema: z.ZodType<Prisma.AgentCreateOrConnectWithoutScenariosInput> = z.object({
  where: z.lazy(() => AgentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AgentCreateWithoutScenariosInputSchema),z.lazy(() => AgentUncheckedCreateWithoutScenariosInputSchema) ]),
}).strict();

export const CallCreateWithoutScenarioInputSchema: z.ZodType<Prisma.CallCreateWithoutScenarioInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  ownerId: z.string().optional().nullable(),
  deleted: z.boolean().optional(),
  vapiCallId: z.string().optional().nullable(),
  customerCallId: z.string().optional().nullable(),
  ofOneDeviceId: z.string().optional().nullable(),
  status: z.lazy(() => CallStatusSchema),
  result: z.lazy(() => CallResultSchema).optional().nullable(),
  failureReason: z.string().optional().nullable(),
  stereoRecordingUrl: z.string(),
  monoRecordingUrl: z.string().optional().nullable(),
  startedAt: z.string().optional().nullable(),
  endedAt: z.string().optional().nullable(),
  regionId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.number().optional().nullable(),
  latencyP90: z.number().optional().nullable(),
  latencyP95: z.number().optional().nullable(),
  interruptionP50: z.number().optional().nullable(),
  interruptionP90: z.number().optional().nullable(),
  interruptionP95: z.number().optional().nullable(),
  numInterruptions: z.number().int().optional().nullable(),
  duration: z.number().optional().nullable(),
  isRead: z.boolean().optional().nullable(),
  readBy: z.string().optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  agent: z.lazy(() => AgentCreateNestedOneWithoutCallsInputSchema).optional(),
  test: z.lazy(() => TestCreateNestedOneWithoutCallsInputSchema).optional(),
  testAgent: z.lazy(() => TestAgentCreateNestedOneWithoutCallsInputSchema).optional(),
  evaluationResults: z.lazy(() => EvaluationResultCreateNestedManyWithoutCallInputSchema).optional(),
  messages: z.lazy(() => MessageCreateNestedManyWithoutCallInputSchema).optional(),
  latencyBlocks: z.lazy(() => LatencyBlockCreateNestedManyWithoutCallInputSchema).optional(),
  interruptions: z.lazy(() => InterruptionCreateNestedManyWithoutCallInputSchema).optional(),
  errors: z.lazy(() => CallErrorCreateNestedManyWithoutCallInputSchema).optional()
}).strict();

export const CallUncheckedCreateWithoutScenarioInputSchema: z.ZodType<Prisma.CallUncheckedCreateWithoutScenarioInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  ownerId: z.string().optional().nullable(),
  deleted: z.boolean().optional(),
  vapiCallId: z.string().optional().nullable(),
  customerCallId: z.string().optional().nullable(),
  ofOneDeviceId: z.string().optional().nullable(),
  status: z.lazy(() => CallStatusSchema),
  result: z.lazy(() => CallResultSchema).optional().nullable(),
  failureReason: z.string().optional().nullable(),
  stereoRecordingUrl: z.string(),
  monoRecordingUrl: z.string().optional().nullable(),
  startedAt: z.string().optional().nullable(),
  endedAt: z.string().optional().nullable(),
  regionId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.number().optional().nullable(),
  latencyP90: z.number().optional().nullable(),
  latencyP95: z.number().optional().nullable(),
  interruptionP50: z.number().optional().nullable(),
  interruptionP90: z.number().optional().nullable(),
  interruptionP95: z.number().optional().nullable(),
  numInterruptions: z.number().int().optional().nullable(),
  duration: z.number().optional().nullable(),
  isRead: z.boolean().optional().nullable(),
  readBy: z.string().optional().nullable(),
  agentId: z.string().optional().nullable(),
  testId: z.string().optional().nullable(),
  testAgentId: z.string().optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationResults: z.lazy(() => EvaluationResultUncheckedCreateNestedManyWithoutCallInputSchema).optional(),
  messages: z.lazy(() => MessageUncheckedCreateNestedManyWithoutCallInputSchema).optional(),
  latencyBlocks: z.lazy(() => LatencyBlockUncheckedCreateNestedManyWithoutCallInputSchema).optional(),
  interruptions: z.lazy(() => InterruptionUncheckedCreateNestedManyWithoutCallInputSchema).optional(),
  errors: z.lazy(() => CallErrorUncheckedCreateNestedManyWithoutCallInputSchema).optional()
}).strict();

export const CallCreateOrConnectWithoutScenarioInputSchema: z.ZodType<Prisma.CallCreateOrConnectWithoutScenarioInput> = z.object({
  where: z.lazy(() => CallWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CallCreateWithoutScenarioInputSchema),z.lazy(() => CallUncheckedCreateWithoutScenarioInputSchema) ]),
}).strict();

export const CallCreateManyScenarioInputEnvelopeSchema: z.ZodType<Prisma.CallCreateManyScenarioInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CallCreateManyScenarioInputSchema),z.lazy(() => CallCreateManyScenarioInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const EvaluationCreateWithoutScenarioInputSchema: z.ZodType<Prisma.EvaluationCreateWithoutScenarioInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  enabled: z.boolean().optional(),
  isCritical: z.boolean().optional(),
  params: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationTemplate: z.lazy(() => EvaluationTemplateCreateNestedOneWithoutEvaluationsInputSchema),
  evaluationGroup: z.lazy(() => EvaluationGroupCreateNestedOneWithoutEvaluationsInputSchema).optional(),
  evaluationResults: z.lazy(() => EvaluationResultCreateNestedManyWithoutEvaluationInputSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationCreateNestedManyWithoutEvaluationInputSchema).optional()
}).strict();

export const EvaluationUncheckedCreateWithoutScenarioInputSchema: z.ZodType<Prisma.EvaluationUncheckedCreateWithoutScenarioInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  enabled: z.boolean().optional(),
  isCritical: z.boolean().optional(),
  params: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationTemplateId: z.string(),
  evaluationGroupId: z.string().optional().nullable(),
  evaluationResults: z.lazy(() => EvaluationResultUncheckedCreateNestedManyWithoutEvaluationInputSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationUncheckedCreateNestedManyWithoutEvaluationInputSchema).optional()
}).strict();

export const EvaluationCreateOrConnectWithoutScenarioInputSchema: z.ZodType<Prisma.EvaluationCreateOrConnectWithoutScenarioInput> = z.object({
  where: z.lazy(() => EvaluationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => EvaluationCreateWithoutScenarioInputSchema),z.lazy(() => EvaluationUncheckedCreateWithoutScenarioInputSchema) ]),
}).strict();

export const EvaluationCreateManyScenarioInputEnvelopeSchema: z.ZodType<Prisma.EvaluationCreateManyScenarioInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => EvaluationCreateManyScenarioInputSchema),z.lazy(() => EvaluationCreateManyScenarioInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const AgentUpsertWithoutScenariosInputSchema: z.ZodType<Prisma.AgentUpsertWithoutScenariosInput> = z.object({
  update: z.union([ z.lazy(() => AgentUpdateWithoutScenariosInputSchema),z.lazy(() => AgentUncheckedUpdateWithoutScenariosInputSchema) ]),
  create: z.union([ z.lazy(() => AgentCreateWithoutScenariosInputSchema),z.lazy(() => AgentUncheckedCreateWithoutScenariosInputSchema) ]),
  where: z.lazy(() => AgentWhereInputSchema).optional()
}).strict();

export const AgentUpdateToOneWithWhereWithoutScenariosInputSchema: z.ZodType<Prisma.AgentUpdateToOneWithWhereWithoutScenariosInput> = z.object({
  where: z.lazy(() => AgentWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => AgentUpdateWithoutScenariosInputSchema),z.lazy(() => AgentUncheckedUpdateWithoutScenariosInputSchema) ]),
}).strict();

export const AgentUpdateWithoutScenariosInputSchema: z.ZodType<Prisma.AgentUpdateWithoutScenariosInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerAgentId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  githubRepoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  systemPrompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  extraProperties: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enableSlackNotifications: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  enabledTestAgents: z.lazy(() => TestAgentUpdateManyWithoutAgentsNestedInputSchema).optional(),
  tests: z.lazy(() => TestUpdateManyWithoutAgentNestedInputSchema).optional(),
  calls: z.lazy(() => CallUpdateManyWithoutAgentNestedInputSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationUpdateManyWithoutAgentNestedInputSchema).optional()
}).strict();

export const AgentUncheckedUpdateWithoutScenariosInputSchema: z.ZodType<Prisma.AgentUncheckedUpdateWithoutScenariosInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerAgentId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  githubRepoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  systemPrompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  extraProperties: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enableSlackNotifications: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  enabledTestAgents: z.lazy(() => TestAgentUncheckedUpdateManyWithoutAgentsNestedInputSchema).optional(),
  tests: z.lazy(() => TestUncheckedUpdateManyWithoutAgentNestedInputSchema).optional(),
  calls: z.lazy(() => CallUncheckedUpdateManyWithoutAgentNestedInputSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationUncheckedUpdateManyWithoutAgentNestedInputSchema).optional()
}).strict();

export const CallUpsertWithWhereUniqueWithoutScenarioInputSchema: z.ZodType<Prisma.CallUpsertWithWhereUniqueWithoutScenarioInput> = z.object({
  where: z.lazy(() => CallWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CallUpdateWithoutScenarioInputSchema),z.lazy(() => CallUncheckedUpdateWithoutScenarioInputSchema) ]),
  create: z.union([ z.lazy(() => CallCreateWithoutScenarioInputSchema),z.lazy(() => CallUncheckedCreateWithoutScenarioInputSchema) ]),
}).strict();

export const CallUpdateWithWhereUniqueWithoutScenarioInputSchema: z.ZodType<Prisma.CallUpdateWithWhereUniqueWithoutScenarioInput> = z.object({
  where: z.lazy(() => CallWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CallUpdateWithoutScenarioInputSchema),z.lazy(() => CallUncheckedUpdateWithoutScenarioInputSchema) ]),
}).strict();

export const CallUpdateManyWithWhereWithoutScenarioInputSchema: z.ZodType<Prisma.CallUpdateManyWithWhereWithoutScenarioInput> = z.object({
  where: z.lazy(() => CallScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CallUpdateManyMutationInputSchema),z.lazy(() => CallUncheckedUpdateManyWithoutScenarioInputSchema) ]),
}).strict();

export const EvaluationUpsertWithWhereUniqueWithoutScenarioInputSchema: z.ZodType<Prisma.EvaluationUpsertWithWhereUniqueWithoutScenarioInput> = z.object({
  where: z.lazy(() => EvaluationWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => EvaluationUpdateWithoutScenarioInputSchema),z.lazy(() => EvaluationUncheckedUpdateWithoutScenarioInputSchema) ]),
  create: z.union([ z.lazy(() => EvaluationCreateWithoutScenarioInputSchema),z.lazy(() => EvaluationUncheckedCreateWithoutScenarioInputSchema) ]),
}).strict();

export const EvaluationUpdateWithWhereUniqueWithoutScenarioInputSchema: z.ZodType<Prisma.EvaluationUpdateWithWhereUniqueWithoutScenarioInput> = z.object({
  where: z.lazy(() => EvaluationWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => EvaluationUpdateWithoutScenarioInputSchema),z.lazy(() => EvaluationUncheckedUpdateWithoutScenarioInputSchema) ]),
}).strict();

export const EvaluationUpdateManyWithWhereWithoutScenarioInputSchema: z.ZodType<Prisma.EvaluationUpdateManyWithWhereWithoutScenarioInput> = z.object({
  where: z.lazy(() => EvaluationScalarWhereInputSchema),
  data: z.union([ z.lazy(() => EvaluationUpdateManyMutationInputSchema),z.lazy(() => EvaluationUncheckedUpdateManyWithoutScenarioInputSchema) ]),
}).strict();

export const EvaluationScalarWhereInputSchema: z.ZodType<Prisma.EvaluationScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => EvaluationScalarWhereInputSchema),z.lazy(() => EvaluationScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvaluationScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvaluationScalarWhereInputSchema),z.lazy(() => EvaluationScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  enabled: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  isCritical: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  params: z.lazy(() => JsonFilterSchema).optional(),
  evaluationTemplateId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  scenarioId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  evaluationGroupId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const EvaluationResultCreateWithoutEvaluationTemplateInputSchema: z.ZodType<Prisma.EvaluationResultCreateWithoutEvaluationTemplateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  result: z.string(),
  success: z.boolean(),
  secondsFromStart: z.number().optional().nullable(),
  duration: z.number().optional().nullable(),
  type: z.lazy(() => EvalResultTypeSchema),
  details: z.string(),
  call: z.lazy(() => CallCreateNestedOneWithoutEvaluationResultsInputSchema).optional(),
  evaluation: z.lazy(() => EvaluationCreateNestedOneWithoutEvaluationResultsInputSchema)
}).strict();

export const EvaluationResultUncheckedCreateWithoutEvaluationTemplateInputSchema: z.ZodType<Prisma.EvaluationResultUncheckedCreateWithoutEvaluationTemplateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  callId: z.string().optional().nullable(),
  evaluationId: z.string(),
  result: z.string(),
  success: z.boolean(),
  secondsFromStart: z.number().optional().nullable(),
  duration: z.number().optional().nullable(),
  type: z.lazy(() => EvalResultTypeSchema),
  details: z.string()
}).strict();

export const EvaluationResultCreateOrConnectWithoutEvaluationTemplateInputSchema: z.ZodType<Prisma.EvaluationResultCreateOrConnectWithoutEvaluationTemplateInput> = z.object({
  where: z.lazy(() => EvaluationResultWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => EvaluationResultCreateWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationResultUncheckedCreateWithoutEvaluationTemplateInputSchema) ]),
}).strict();

export const EvaluationResultCreateManyEvaluationTemplateInputEnvelopeSchema: z.ZodType<Prisma.EvaluationResultCreateManyEvaluationTemplateInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => EvaluationResultCreateManyEvaluationTemplateInputSchema),z.lazy(() => EvaluationResultCreateManyEvaluationTemplateInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const EvaluationCreateWithoutEvaluationTemplateInputSchema: z.ZodType<Prisma.EvaluationCreateWithoutEvaluationTemplateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  enabled: z.boolean().optional(),
  isCritical: z.boolean().optional(),
  params: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  scenario: z.lazy(() => ScenarioCreateNestedOneWithoutEvaluationsInputSchema).optional(),
  evaluationGroup: z.lazy(() => EvaluationGroupCreateNestedOneWithoutEvaluationsInputSchema).optional(),
  evaluationResults: z.lazy(() => EvaluationResultCreateNestedManyWithoutEvaluationInputSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationCreateNestedManyWithoutEvaluationInputSchema).optional()
}).strict();

export const EvaluationUncheckedCreateWithoutEvaluationTemplateInputSchema: z.ZodType<Prisma.EvaluationUncheckedCreateWithoutEvaluationTemplateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  enabled: z.boolean().optional(),
  isCritical: z.boolean().optional(),
  params: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  scenarioId: z.string().optional().nullable(),
  evaluationGroupId: z.string().optional().nullable(),
  evaluationResults: z.lazy(() => EvaluationResultUncheckedCreateNestedManyWithoutEvaluationInputSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationUncheckedCreateNestedManyWithoutEvaluationInputSchema).optional()
}).strict();

export const EvaluationCreateOrConnectWithoutEvaluationTemplateInputSchema: z.ZodType<Prisma.EvaluationCreateOrConnectWithoutEvaluationTemplateInput> = z.object({
  where: z.lazy(() => EvaluationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => EvaluationCreateWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationUncheckedCreateWithoutEvaluationTemplateInputSchema) ]),
}).strict();

export const EvaluationCreateManyEvaluationTemplateInputEnvelopeSchema: z.ZodType<Prisma.EvaluationCreateManyEvaluationTemplateInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => EvaluationCreateManyEvaluationTemplateInputSchema),z.lazy(() => EvaluationCreateManyEvaluationTemplateInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const EvaluationResultUpsertWithWhereUniqueWithoutEvaluationTemplateInputSchema: z.ZodType<Prisma.EvaluationResultUpsertWithWhereUniqueWithoutEvaluationTemplateInput> = z.object({
  where: z.lazy(() => EvaluationResultWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => EvaluationResultUpdateWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationResultUncheckedUpdateWithoutEvaluationTemplateInputSchema) ]),
  create: z.union([ z.lazy(() => EvaluationResultCreateWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationResultUncheckedCreateWithoutEvaluationTemplateInputSchema) ]),
}).strict();

export const EvaluationResultUpdateWithWhereUniqueWithoutEvaluationTemplateInputSchema: z.ZodType<Prisma.EvaluationResultUpdateWithWhereUniqueWithoutEvaluationTemplateInput> = z.object({
  where: z.lazy(() => EvaluationResultWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => EvaluationResultUpdateWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationResultUncheckedUpdateWithoutEvaluationTemplateInputSchema) ]),
}).strict();

export const EvaluationResultUpdateManyWithWhereWithoutEvaluationTemplateInputSchema: z.ZodType<Prisma.EvaluationResultUpdateManyWithWhereWithoutEvaluationTemplateInput> = z.object({
  where: z.lazy(() => EvaluationResultScalarWhereInputSchema),
  data: z.union([ z.lazy(() => EvaluationResultUpdateManyMutationInputSchema),z.lazy(() => EvaluationResultUncheckedUpdateManyWithoutEvaluationTemplateInputSchema) ]),
}).strict();

export const EvaluationUpsertWithWhereUniqueWithoutEvaluationTemplateInputSchema: z.ZodType<Prisma.EvaluationUpsertWithWhereUniqueWithoutEvaluationTemplateInput> = z.object({
  where: z.lazy(() => EvaluationWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => EvaluationUpdateWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationUncheckedUpdateWithoutEvaluationTemplateInputSchema) ]),
  create: z.union([ z.lazy(() => EvaluationCreateWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationUncheckedCreateWithoutEvaluationTemplateInputSchema) ]),
}).strict();

export const EvaluationUpdateWithWhereUniqueWithoutEvaluationTemplateInputSchema: z.ZodType<Prisma.EvaluationUpdateWithWhereUniqueWithoutEvaluationTemplateInput> = z.object({
  where: z.lazy(() => EvaluationWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => EvaluationUpdateWithoutEvaluationTemplateInputSchema),z.lazy(() => EvaluationUncheckedUpdateWithoutEvaluationTemplateInputSchema) ]),
}).strict();

export const EvaluationUpdateManyWithWhereWithoutEvaluationTemplateInputSchema: z.ZodType<Prisma.EvaluationUpdateManyWithWhereWithoutEvaluationTemplateInput> = z.object({
  where: z.lazy(() => EvaluationScalarWhereInputSchema),
  data: z.union([ z.lazy(() => EvaluationUpdateManyMutationInputSchema),z.lazy(() => EvaluationUncheckedUpdateManyWithoutEvaluationTemplateInputSchema) ]),
}).strict();

export const AgentCreateWithoutGeneralEvaluationsInputSchema: z.ZodType<Prisma.AgentCreateWithoutGeneralEvaluationsInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  ownerId: z.string(),
  name: z.string(),
  phoneNumber: z.string().optional(),
  customerAgentId: z.string(),
  githubRepoUrl: z.string().optional().nullable(),
  systemPrompt: z.string().optional(),
  extraProperties: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enableSlackNotifications: z.boolean().optional(),
  enabledTestAgents: z.lazy(() => TestAgentCreateNestedManyWithoutAgentsInputSchema).optional(),
  scenarios: z.lazy(() => ScenarioCreateNestedManyWithoutAgentInputSchema).optional(),
  tests: z.lazy(() => TestCreateNestedManyWithoutAgentInputSchema).optional(),
  calls: z.lazy(() => CallCreateNestedManyWithoutAgentInputSchema).optional()
}).strict();

export const AgentUncheckedCreateWithoutGeneralEvaluationsInputSchema: z.ZodType<Prisma.AgentUncheckedCreateWithoutGeneralEvaluationsInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  ownerId: z.string(),
  name: z.string(),
  phoneNumber: z.string().optional(),
  customerAgentId: z.string(),
  githubRepoUrl: z.string().optional().nullable(),
  systemPrompt: z.string().optional(),
  extraProperties: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enableSlackNotifications: z.boolean().optional(),
  enabledTestAgents: z.lazy(() => TestAgentUncheckedCreateNestedManyWithoutAgentsInputSchema).optional(),
  scenarios: z.lazy(() => ScenarioUncheckedCreateNestedManyWithoutAgentInputSchema).optional(),
  tests: z.lazy(() => TestUncheckedCreateNestedManyWithoutAgentInputSchema).optional(),
  calls: z.lazy(() => CallUncheckedCreateNestedManyWithoutAgentInputSchema).optional()
}).strict();

export const AgentCreateOrConnectWithoutGeneralEvaluationsInputSchema: z.ZodType<Prisma.AgentCreateOrConnectWithoutGeneralEvaluationsInput> = z.object({
  where: z.lazy(() => AgentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AgentCreateWithoutGeneralEvaluationsInputSchema),z.lazy(() => AgentUncheckedCreateWithoutGeneralEvaluationsInputSchema) ]),
}).strict();

export const EvaluationCreateWithoutGeneralEvaluationsInputSchema: z.ZodType<Prisma.EvaluationCreateWithoutGeneralEvaluationsInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  enabled: z.boolean().optional(),
  isCritical: z.boolean().optional(),
  params: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationTemplate: z.lazy(() => EvaluationTemplateCreateNestedOneWithoutEvaluationsInputSchema),
  scenario: z.lazy(() => ScenarioCreateNestedOneWithoutEvaluationsInputSchema).optional(),
  evaluationGroup: z.lazy(() => EvaluationGroupCreateNestedOneWithoutEvaluationsInputSchema).optional(),
  evaluationResults: z.lazy(() => EvaluationResultCreateNestedManyWithoutEvaluationInputSchema).optional()
}).strict();

export const EvaluationUncheckedCreateWithoutGeneralEvaluationsInputSchema: z.ZodType<Prisma.EvaluationUncheckedCreateWithoutGeneralEvaluationsInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  enabled: z.boolean().optional(),
  isCritical: z.boolean().optional(),
  params: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationTemplateId: z.string(),
  scenarioId: z.string().optional().nullable(),
  evaluationGroupId: z.string().optional().nullable(),
  evaluationResults: z.lazy(() => EvaluationResultUncheckedCreateNestedManyWithoutEvaluationInputSchema).optional()
}).strict();

export const EvaluationCreateOrConnectWithoutGeneralEvaluationsInputSchema: z.ZodType<Prisma.EvaluationCreateOrConnectWithoutGeneralEvaluationsInput> = z.object({
  where: z.lazy(() => EvaluationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => EvaluationCreateWithoutGeneralEvaluationsInputSchema),z.lazy(() => EvaluationUncheckedCreateWithoutGeneralEvaluationsInputSchema) ]),
}).strict();

export const AgentUpsertWithoutGeneralEvaluationsInputSchema: z.ZodType<Prisma.AgentUpsertWithoutGeneralEvaluationsInput> = z.object({
  update: z.union([ z.lazy(() => AgentUpdateWithoutGeneralEvaluationsInputSchema),z.lazy(() => AgentUncheckedUpdateWithoutGeneralEvaluationsInputSchema) ]),
  create: z.union([ z.lazy(() => AgentCreateWithoutGeneralEvaluationsInputSchema),z.lazy(() => AgentUncheckedCreateWithoutGeneralEvaluationsInputSchema) ]),
  where: z.lazy(() => AgentWhereInputSchema).optional()
}).strict();

export const AgentUpdateToOneWithWhereWithoutGeneralEvaluationsInputSchema: z.ZodType<Prisma.AgentUpdateToOneWithWhereWithoutGeneralEvaluationsInput> = z.object({
  where: z.lazy(() => AgentWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => AgentUpdateWithoutGeneralEvaluationsInputSchema),z.lazy(() => AgentUncheckedUpdateWithoutGeneralEvaluationsInputSchema) ]),
}).strict();

export const AgentUpdateWithoutGeneralEvaluationsInputSchema: z.ZodType<Prisma.AgentUpdateWithoutGeneralEvaluationsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerAgentId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  githubRepoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  systemPrompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  extraProperties: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enableSlackNotifications: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  enabledTestAgents: z.lazy(() => TestAgentUpdateManyWithoutAgentsNestedInputSchema).optional(),
  scenarios: z.lazy(() => ScenarioUpdateManyWithoutAgentNestedInputSchema).optional(),
  tests: z.lazy(() => TestUpdateManyWithoutAgentNestedInputSchema).optional(),
  calls: z.lazy(() => CallUpdateManyWithoutAgentNestedInputSchema).optional()
}).strict();

export const AgentUncheckedUpdateWithoutGeneralEvaluationsInputSchema: z.ZodType<Prisma.AgentUncheckedUpdateWithoutGeneralEvaluationsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerAgentId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  githubRepoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  systemPrompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  extraProperties: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enableSlackNotifications: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  enabledTestAgents: z.lazy(() => TestAgentUncheckedUpdateManyWithoutAgentsNestedInputSchema).optional(),
  scenarios: z.lazy(() => ScenarioUncheckedUpdateManyWithoutAgentNestedInputSchema).optional(),
  tests: z.lazy(() => TestUncheckedUpdateManyWithoutAgentNestedInputSchema).optional(),
  calls: z.lazy(() => CallUncheckedUpdateManyWithoutAgentNestedInputSchema).optional()
}).strict();

export const EvaluationUpsertWithoutGeneralEvaluationsInputSchema: z.ZodType<Prisma.EvaluationUpsertWithoutGeneralEvaluationsInput> = z.object({
  update: z.union([ z.lazy(() => EvaluationUpdateWithoutGeneralEvaluationsInputSchema),z.lazy(() => EvaluationUncheckedUpdateWithoutGeneralEvaluationsInputSchema) ]),
  create: z.union([ z.lazy(() => EvaluationCreateWithoutGeneralEvaluationsInputSchema),z.lazy(() => EvaluationUncheckedCreateWithoutGeneralEvaluationsInputSchema) ]),
  where: z.lazy(() => EvaluationWhereInputSchema).optional()
}).strict();

export const EvaluationUpdateToOneWithWhereWithoutGeneralEvaluationsInputSchema: z.ZodType<Prisma.EvaluationUpdateToOneWithWhereWithoutGeneralEvaluationsInput> = z.object({
  where: z.lazy(() => EvaluationWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => EvaluationUpdateWithoutGeneralEvaluationsInputSchema),z.lazy(() => EvaluationUncheckedUpdateWithoutGeneralEvaluationsInputSchema) ]),
}).strict();

export const EvaluationUpdateWithoutGeneralEvaluationsInputSchema: z.ZodType<Prisma.EvaluationUpdateWithoutGeneralEvaluationsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isCritical: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  params: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationTemplate: z.lazy(() => EvaluationTemplateUpdateOneRequiredWithoutEvaluationsNestedInputSchema).optional(),
  scenario: z.lazy(() => ScenarioUpdateOneWithoutEvaluationsNestedInputSchema).optional(),
  evaluationGroup: z.lazy(() => EvaluationGroupUpdateOneWithoutEvaluationsNestedInputSchema).optional(),
  evaluationResults: z.lazy(() => EvaluationResultUpdateManyWithoutEvaluationNestedInputSchema).optional()
}).strict();

export const EvaluationUncheckedUpdateWithoutGeneralEvaluationsInputSchema: z.ZodType<Prisma.EvaluationUncheckedUpdateWithoutGeneralEvaluationsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isCritical: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  params: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationTemplateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  scenarioId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evaluationGroupId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evaluationResults: z.lazy(() => EvaluationResultUncheckedUpdateManyWithoutEvaluationNestedInputSchema).optional()
}).strict();

export const EvaluationTemplateCreateWithoutEvaluationsInputSchema: z.ZodType<Prisma.EvaluationTemplateCreateWithoutEvaluationsInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  name: z.string(),
  description: z.string(),
  params: z.union([ z.lazy(() => EvaluationTemplateCreateparamsInputSchema),z.string().array() ]).optional(),
  type: z.lazy(() => EvalTypeSchema),
  resultType: z.lazy(() => EvalResultTypeSchema),
  contentType: z.lazy(() => EvalContentTypeSchema).optional(),
  toolCallExpectedResult: z.string().optional(),
  ownerId: z.string().optional().nullable(),
  deleted: z.boolean().optional(),
  evaluationResults: z.lazy(() => EvaluationResultCreateNestedManyWithoutEvaluationTemplateInputSchema).optional()
}).strict();

export const EvaluationTemplateUncheckedCreateWithoutEvaluationsInputSchema: z.ZodType<Prisma.EvaluationTemplateUncheckedCreateWithoutEvaluationsInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  name: z.string(),
  description: z.string(),
  params: z.union([ z.lazy(() => EvaluationTemplateCreateparamsInputSchema),z.string().array() ]).optional(),
  type: z.lazy(() => EvalTypeSchema),
  resultType: z.lazy(() => EvalResultTypeSchema),
  contentType: z.lazy(() => EvalContentTypeSchema).optional(),
  toolCallExpectedResult: z.string().optional(),
  ownerId: z.string().optional().nullable(),
  deleted: z.boolean().optional(),
  evaluationResults: z.lazy(() => EvaluationResultUncheckedCreateNestedManyWithoutEvaluationTemplateInputSchema).optional()
}).strict();

export const EvaluationTemplateCreateOrConnectWithoutEvaluationsInputSchema: z.ZodType<Prisma.EvaluationTemplateCreateOrConnectWithoutEvaluationsInput> = z.object({
  where: z.lazy(() => EvaluationTemplateWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => EvaluationTemplateCreateWithoutEvaluationsInputSchema),z.lazy(() => EvaluationTemplateUncheckedCreateWithoutEvaluationsInputSchema) ]),
}).strict();

export const ScenarioCreateWithoutEvaluationsInputSchema: z.ZodType<Prisma.ScenarioCreateWithoutEvaluationsInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  name: z.string(),
  instructions: z.string(),
  successCriteria: z.string().optional(),
  includeDateTime: z.boolean().optional(),
  timezone: z.string().optional().nullable(),
  deleted: z.boolean().optional(),
  agent: z.lazy(() => AgentCreateNestedOneWithoutScenariosInputSchema),
  calls: z.lazy(() => CallCreateNestedManyWithoutScenarioInputSchema).optional()
}).strict();

export const ScenarioUncheckedCreateWithoutEvaluationsInputSchema: z.ZodType<Prisma.ScenarioUncheckedCreateWithoutEvaluationsInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  agentId: z.string(),
  name: z.string(),
  instructions: z.string(),
  successCriteria: z.string().optional(),
  includeDateTime: z.boolean().optional(),
  timezone: z.string().optional().nullable(),
  deleted: z.boolean().optional(),
  calls: z.lazy(() => CallUncheckedCreateNestedManyWithoutScenarioInputSchema).optional()
}).strict();

export const ScenarioCreateOrConnectWithoutEvaluationsInputSchema: z.ZodType<Prisma.ScenarioCreateOrConnectWithoutEvaluationsInput> = z.object({
  where: z.lazy(() => ScenarioWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ScenarioCreateWithoutEvaluationsInputSchema),z.lazy(() => ScenarioUncheckedCreateWithoutEvaluationsInputSchema) ]),
}).strict();

export const EvaluationGroupCreateWithoutEvaluationsInputSchema: z.ZodType<Prisma.EvaluationGroupCreateWithoutEvaluationsInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  ownerId: z.string(),
  name: z.string(),
  condition: z.string().optional(),
  enabled: z.boolean().optional(),
  savedSearch: z.lazy(() => SavedSearchCreateNestedOneWithoutEvaluationGroupsInputSchema).optional()
}).strict();

export const EvaluationGroupUncheckedCreateWithoutEvaluationsInputSchema: z.ZodType<Prisma.EvaluationGroupUncheckedCreateWithoutEvaluationsInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  ownerId: z.string(),
  name: z.string(),
  condition: z.string().optional(),
  enabled: z.boolean().optional(),
  savedSearchId: z.string().optional().nullable()
}).strict();

export const EvaluationGroupCreateOrConnectWithoutEvaluationsInputSchema: z.ZodType<Prisma.EvaluationGroupCreateOrConnectWithoutEvaluationsInput> = z.object({
  where: z.lazy(() => EvaluationGroupWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => EvaluationGroupCreateWithoutEvaluationsInputSchema),z.lazy(() => EvaluationGroupUncheckedCreateWithoutEvaluationsInputSchema) ]),
}).strict();

export const EvaluationResultCreateWithoutEvaluationInputSchema: z.ZodType<Prisma.EvaluationResultCreateWithoutEvaluationInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  result: z.string(),
  success: z.boolean(),
  secondsFromStart: z.number().optional().nullable(),
  duration: z.number().optional().nullable(),
  type: z.lazy(() => EvalResultTypeSchema),
  details: z.string(),
  call: z.lazy(() => CallCreateNestedOneWithoutEvaluationResultsInputSchema).optional(),
  evaluationTemplate: z.lazy(() => EvaluationTemplateCreateNestedOneWithoutEvaluationResultsInputSchema).optional()
}).strict();

export const EvaluationResultUncheckedCreateWithoutEvaluationInputSchema: z.ZodType<Prisma.EvaluationResultUncheckedCreateWithoutEvaluationInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  callId: z.string().optional().nullable(),
  result: z.string(),
  success: z.boolean(),
  secondsFromStart: z.number().optional().nullable(),
  duration: z.number().optional().nullable(),
  type: z.lazy(() => EvalResultTypeSchema),
  details: z.string(),
  evaluationTemplateId: z.string().optional().nullable()
}).strict();

export const EvaluationResultCreateOrConnectWithoutEvaluationInputSchema: z.ZodType<Prisma.EvaluationResultCreateOrConnectWithoutEvaluationInput> = z.object({
  where: z.lazy(() => EvaluationResultWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => EvaluationResultCreateWithoutEvaluationInputSchema),z.lazy(() => EvaluationResultUncheckedCreateWithoutEvaluationInputSchema) ]),
}).strict();

export const EvaluationResultCreateManyEvaluationInputEnvelopeSchema: z.ZodType<Prisma.EvaluationResultCreateManyEvaluationInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => EvaluationResultCreateManyEvaluationInputSchema),z.lazy(() => EvaluationResultCreateManyEvaluationInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const GeneralEvaluationCreateWithoutEvaluationInputSchema: z.ZodType<Prisma.GeneralEvaluationCreateWithoutEvaluationInput> = z.object({
  id: z.string().optional(),
  agent: z.lazy(() => AgentCreateNestedOneWithoutGeneralEvaluationsInputSchema)
}).strict();

export const GeneralEvaluationUncheckedCreateWithoutEvaluationInputSchema: z.ZodType<Prisma.GeneralEvaluationUncheckedCreateWithoutEvaluationInput> = z.object({
  id: z.string().optional(),
  agentId: z.string()
}).strict();

export const GeneralEvaluationCreateOrConnectWithoutEvaluationInputSchema: z.ZodType<Prisma.GeneralEvaluationCreateOrConnectWithoutEvaluationInput> = z.object({
  where: z.lazy(() => GeneralEvaluationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => GeneralEvaluationCreateWithoutEvaluationInputSchema),z.lazy(() => GeneralEvaluationUncheckedCreateWithoutEvaluationInputSchema) ]),
}).strict();

export const GeneralEvaluationCreateManyEvaluationInputEnvelopeSchema: z.ZodType<Prisma.GeneralEvaluationCreateManyEvaluationInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => GeneralEvaluationCreateManyEvaluationInputSchema),z.lazy(() => GeneralEvaluationCreateManyEvaluationInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const EvaluationTemplateUpsertWithoutEvaluationsInputSchema: z.ZodType<Prisma.EvaluationTemplateUpsertWithoutEvaluationsInput> = z.object({
  update: z.union([ z.lazy(() => EvaluationTemplateUpdateWithoutEvaluationsInputSchema),z.lazy(() => EvaluationTemplateUncheckedUpdateWithoutEvaluationsInputSchema) ]),
  create: z.union([ z.lazy(() => EvaluationTemplateCreateWithoutEvaluationsInputSchema),z.lazy(() => EvaluationTemplateUncheckedCreateWithoutEvaluationsInputSchema) ]),
  where: z.lazy(() => EvaluationTemplateWhereInputSchema).optional()
}).strict();

export const EvaluationTemplateUpdateToOneWithWhereWithoutEvaluationsInputSchema: z.ZodType<Prisma.EvaluationTemplateUpdateToOneWithWhereWithoutEvaluationsInput> = z.object({
  where: z.lazy(() => EvaluationTemplateWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => EvaluationTemplateUpdateWithoutEvaluationsInputSchema),z.lazy(() => EvaluationTemplateUncheckedUpdateWithoutEvaluationsInputSchema) ]),
}).strict();

export const EvaluationTemplateUpdateWithoutEvaluationsInputSchema: z.ZodType<Prisma.EvaluationTemplateUpdateWithoutEvaluationsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  params: z.union([ z.lazy(() => EvaluationTemplateUpdateparamsInputSchema),z.string().array() ]).optional(),
  type: z.union([ z.lazy(() => EvalTypeSchema),z.lazy(() => EnumEvalTypeFieldUpdateOperationsInputSchema) ]).optional(),
  resultType: z.union([ z.lazy(() => EvalResultTypeSchema),z.lazy(() => EnumEvalResultTypeFieldUpdateOperationsInputSchema) ]).optional(),
  contentType: z.union([ z.lazy(() => EvalContentTypeSchema),z.lazy(() => EnumEvalContentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  toolCallExpectedResult: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  evaluationResults: z.lazy(() => EvaluationResultUpdateManyWithoutEvaluationTemplateNestedInputSchema).optional()
}).strict();

export const EvaluationTemplateUncheckedUpdateWithoutEvaluationsInputSchema: z.ZodType<Prisma.EvaluationTemplateUncheckedUpdateWithoutEvaluationsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  params: z.union([ z.lazy(() => EvaluationTemplateUpdateparamsInputSchema),z.string().array() ]).optional(),
  type: z.union([ z.lazy(() => EvalTypeSchema),z.lazy(() => EnumEvalTypeFieldUpdateOperationsInputSchema) ]).optional(),
  resultType: z.union([ z.lazy(() => EvalResultTypeSchema),z.lazy(() => EnumEvalResultTypeFieldUpdateOperationsInputSchema) ]).optional(),
  contentType: z.union([ z.lazy(() => EvalContentTypeSchema),z.lazy(() => EnumEvalContentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  toolCallExpectedResult: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  evaluationResults: z.lazy(() => EvaluationResultUncheckedUpdateManyWithoutEvaluationTemplateNestedInputSchema).optional()
}).strict();

export const ScenarioUpsertWithoutEvaluationsInputSchema: z.ZodType<Prisma.ScenarioUpsertWithoutEvaluationsInput> = z.object({
  update: z.union([ z.lazy(() => ScenarioUpdateWithoutEvaluationsInputSchema),z.lazy(() => ScenarioUncheckedUpdateWithoutEvaluationsInputSchema) ]),
  create: z.union([ z.lazy(() => ScenarioCreateWithoutEvaluationsInputSchema),z.lazy(() => ScenarioUncheckedCreateWithoutEvaluationsInputSchema) ]),
  where: z.lazy(() => ScenarioWhereInputSchema).optional()
}).strict();

export const ScenarioUpdateToOneWithWhereWithoutEvaluationsInputSchema: z.ZodType<Prisma.ScenarioUpdateToOneWithWhereWithoutEvaluationsInput> = z.object({
  where: z.lazy(() => ScenarioWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ScenarioUpdateWithoutEvaluationsInputSchema),z.lazy(() => ScenarioUncheckedUpdateWithoutEvaluationsInputSchema) ]),
}).strict();

export const ScenarioUpdateWithoutEvaluationsInputSchema: z.ZodType<Prisma.ScenarioUpdateWithoutEvaluationsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  instructions: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  successCriteria: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  includeDateTime: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  timezone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  agent: z.lazy(() => AgentUpdateOneRequiredWithoutScenariosNestedInputSchema).optional(),
  calls: z.lazy(() => CallUpdateManyWithoutScenarioNestedInputSchema).optional()
}).strict();

export const ScenarioUncheckedUpdateWithoutEvaluationsInputSchema: z.ZodType<Prisma.ScenarioUncheckedUpdateWithoutEvaluationsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  agentId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  instructions: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  successCriteria: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  includeDateTime: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  timezone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  calls: z.lazy(() => CallUncheckedUpdateManyWithoutScenarioNestedInputSchema).optional()
}).strict();

export const EvaluationGroupUpsertWithoutEvaluationsInputSchema: z.ZodType<Prisma.EvaluationGroupUpsertWithoutEvaluationsInput> = z.object({
  update: z.union([ z.lazy(() => EvaluationGroupUpdateWithoutEvaluationsInputSchema),z.lazy(() => EvaluationGroupUncheckedUpdateWithoutEvaluationsInputSchema) ]),
  create: z.union([ z.lazy(() => EvaluationGroupCreateWithoutEvaluationsInputSchema),z.lazy(() => EvaluationGroupUncheckedCreateWithoutEvaluationsInputSchema) ]),
  where: z.lazy(() => EvaluationGroupWhereInputSchema).optional()
}).strict();

export const EvaluationGroupUpdateToOneWithWhereWithoutEvaluationsInputSchema: z.ZodType<Prisma.EvaluationGroupUpdateToOneWithWhereWithoutEvaluationsInput> = z.object({
  where: z.lazy(() => EvaluationGroupWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => EvaluationGroupUpdateWithoutEvaluationsInputSchema),z.lazy(() => EvaluationGroupUncheckedUpdateWithoutEvaluationsInputSchema) ]),
}).strict();

export const EvaluationGroupUpdateWithoutEvaluationsInputSchema: z.ZodType<Prisma.EvaluationGroupUpdateWithoutEvaluationsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  condition: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  savedSearch: z.lazy(() => SavedSearchUpdateOneWithoutEvaluationGroupsNestedInputSchema).optional()
}).strict();

export const EvaluationGroupUncheckedUpdateWithoutEvaluationsInputSchema: z.ZodType<Prisma.EvaluationGroupUncheckedUpdateWithoutEvaluationsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  condition: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  savedSearchId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const EvaluationResultUpsertWithWhereUniqueWithoutEvaluationInputSchema: z.ZodType<Prisma.EvaluationResultUpsertWithWhereUniqueWithoutEvaluationInput> = z.object({
  where: z.lazy(() => EvaluationResultWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => EvaluationResultUpdateWithoutEvaluationInputSchema),z.lazy(() => EvaluationResultUncheckedUpdateWithoutEvaluationInputSchema) ]),
  create: z.union([ z.lazy(() => EvaluationResultCreateWithoutEvaluationInputSchema),z.lazy(() => EvaluationResultUncheckedCreateWithoutEvaluationInputSchema) ]),
}).strict();

export const EvaluationResultUpdateWithWhereUniqueWithoutEvaluationInputSchema: z.ZodType<Prisma.EvaluationResultUpdateWithWhereUniqueWithoutEvaluationInput> = z.object({
  where: z.lazy(() => EvaluationResultWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => EvaluationResultUpdateWithoutEvaluationInputSchema),z.lazy(() => EvaluationResultUncheckedUpdateWithoutEvaluationInputSchema) ]),
}).strict();

export const EvaluationResultUpdateManyWithWhereWithoutEvaluationInputSchema: z.ZodType<Prisma.EvaluationResultUpdateManyWithWhereWithoutEvaluationInput> = z.object({
  where: z.lazy(() => EvaluationResultScalarWhereInputSchema),
  data: z.union([ z.lazy(() => EvaluationResultUpdateManyMutationInputSchema),z.lazy(() => EvaluationResultUncheckedUpdateManyWithoutEvaluationInputSchema) ]),
}).strict();

export const GeneralEvaluationUpsertWithWhereUniqueWithoutEvaluationInputSchema: z.ZodType<Prisma.GeneralEvaluationUpsertWithWhereUniqueWithoutEvaluationInput> = z.object({
  where: z.lazy(() => GeneralEvaluationWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => GeneralEvaluationUpdateWithoutEvaluationInputSchema),z.lazy(() => GeneralEvaluationUncheckedUpdateWithoutEvaluationInputSchema) ]),
  create: z.union([ z.lazy(() => GeneralEvaluationCreateWithoutEvaluationInputSchema),z.lazy(() => GeneralEvaluationUncheckedCreateWithoutEvaluationInputSchema) ]),
}).strict();

export const GeneralEvaluationUpdateWithWhereUniqueWithoutEvaluationInputSchema: z.ZodType<Prisma.GeneralEvaluationUpdateWithWhereUniqueWithoutEvaluationInput> = z.object({
  where: z.lazy(() => GeneralEvaluationWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => GeneralEvaluationUpdateWithoutEvaluationInputSchema),z.lazy(() => GeneralEvaluationUncheckedUpdateWithoutEvaluationInputSchema) ]),
}).strict();

export const GeneralEvaluationUpdateManyWithWhereWithoutEvaluationInputSchema: z.ZodType<Prisma.GeneralEvaluationUpdateManyWithWhereWithoutEvaluationInput> = z.object({
  where: z.lazy(() => GeneralEvaluationScalarWhereInputSchema),
  data: z.union([ z.lazy(() => GeneralEvaluationUpdateManyMutationInputSchema),z.lazy(() => GeneralEvaluationUncheckedUpdateManyWithoutEvaluationInputSchema) ]),
}).strict();

export const CallCreateWithoutEvaluationResultsInputSchema: z.ZodType<Prisma.CallCreateWithoutEvaluationResultsInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  ownerId: z.string().optional().nullable(),
  deleted: z.boolean().optional(),
  vapiCallId: z.string().optional().nullable(),
  customerCallId: z.string().optional().nullable(),
  ofOneDeviceId: z.string().optional().nullable(),
  status: z.lazy(() => CallStatusSchema),
  result: z.lazy(() => CallResultSchema).optional().nullable(),
  failureReason: z.string().optional().nullable(),
  stereoRecordingUrl: z.string(),
  monoRecordingUrl: z.string().optional().nullable(),
  startedAt: z.string().optional().nullable(),
  endedAt: z.string().optional().nullable(),
  regionId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.number().optional().nullable(),
  latencyP90: z.number().optional().nullable(),
  latencyP95: z.number().optional().nullable(),
  interruptionP50: z.number().optional().nullable(),
  interruptionP90: z.number().optional().nullable(),
  interruptionP95: z.number().optional().nullable(),
  numInterruptions: z.number().int().optional().nullable(),
  duration: z.number().optional().nullable(),
  isRead: z.boolean().optional().nullable(),
  readBy: z.string().optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  agent: z.lazy(() => AgentCreateNestedOneWithoutCallsInputSchema).optional(),
  test: z.lazy(() => TestCreateNestedOneWithoutCallsInputSchema).optional(),
  testAgent: z.lazy(() => TestAgentCreateNestedOneWithoutCallsInputSchema).optional(),
  scenario: z.lazy(() => ScenarioCreateNestedOneWithoutCallsInputSchema).optional(),
  messages: z.lazy(() => MessageCreateNestedManyWithoutCallInputSchema).optional(),
  latencyBlocks: z.lazy(() => LatencyBlockCreateNestedManyWithoutCallInputSchema).optional(),
  interruptions: z.lazy(() => InterruptionCreateNestedManyWithoutCallInputSchema).optional(),
  errors: z.lazy(() => CallErrorCreateNestedManyWithoutCallInputSchema).optional()
}).strict();

export const CallUncheckedCreateWithoutEvaluationResultsInputSchema: z.ZodType<Prisma.CallUncheckedCreateWithoutEvaluationResultsInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  ownerId: z.string().optional().nullable(),
  deleted: z.boolean().optional(),
  vapiCallId: z.string().optional().nullable(),
  customerCallId: z.string().optional().nullable(),
  ofOneDeviceId: z.string().optional().nullable(),
  status: z.lazy(() => CallStatusSchema),
  result: z.lazy(() => CallResultSchema).optional().nullable(),
  failureReason: z.string().optional().nullable(),
  stereoRecordingUrl: z.string(),
  monoRecordingUrl: z.string().optional().nullable(),
  startedAt: z.string().optional().nullable(),
  endedAt: z.string().optional().nullable(),
  regionId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.number().optional().nullable(),
  latencyP90: z.number().optional().nullable(),
  latencyP95: z.number().optional().nullable(),
  interruptionP50: z.number().optional().nullable(),
  interruptionP90: z.number().optional().nullable(),
  interruptionP95: z.number().optional().nullable(),
  numInterruptions: z.number().int().optional().nullable(),
  duration: z.number().optional().nullable(),
  isRead: z.boolean().optional().nullable(),
  readBy: z.string().optional().nullable(),
  agentId: z.string().optional().nullable(),
  testId: z.string().optional().nullable(),
  testAgentId: z.string().optional().nullable(),
  scenarioId: z.string().optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  messages: z.lazy(() => MessageUncheckedCreateNestedManyWithoutCallInputSchema).optional(),
  latencyBlocks: z.lazy(() => LatencyBlockUncheckedCreateNestedManyWithoutCallInputSchema).optional(),
  interruptions: z.lazy(() => InterruptionUncheckedCreateNestedManyWithoutCallInputSchema).optional(),
  errors: z.lazy(() => CallErrorUncheckedCreateNestedManyWithoutCallInputSchema).optional()
}).strict();

export const CallCreateOrConnectWithoutEvaluationResultsInputSchema: z.ZodType<Prisma.CallCreateOrConnectWithoutEvaluationResultsInput> = z.object({
  where: z.lazy(() => CallWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CallCreateWithoutEvaluationResultsInputSchema),z.lazy(() => CallUncheckedCreateWithoutEvaluationResultsInputSchema) ]),
}).strict();

export const EvaluationCreateWithoutEvaluationResultsInputSchema: z.ZodType<Prisma.EvaluationCreateWithoutEvaluationResultsInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  enabled: z.boolean().optional(),
  isCritical: z.boolean().optional(),
  params: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationTemplate: z.lazy(() => EvaluationTemplateCreateNestedOneWithoutEvaluationsInputSchema),
  scenario: z.lazy(() => ScenarioCreateNestedOneWithoutEvaluationsInputSchema).optional(),
  evaluationGroup: z.lazy(() => EvaluationGroupCreateNestedOneWithoutEvaluationsInputSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationCreateNestedManyWithoutEvaluationInputSchema).optional()
}).strict();

export const EvaluationUncheckedCreateWithoutEvaluationResultsInputSchema: z.ZodType<Prisma.EvaluationUncheckedCreateWithoutEvaluationResultsInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  enabled: z.boolean().optional(),
  isCritical: z.boolean().optional(),
  params: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationTemplateId: z.string(),
  scenarioId: z.string().optional().nullable(),
  evaluationGroupId: z.string().optional().nullable(),
  generalEvaluations: z.lazy(() => GeneralEvaluationUncheckedCreateNestedManyWithoutEvaluationInputSchema).optional()
}).strict();

export const EvaluationCreateOrConnectWithoutEvaluationResultsInputSchema: z.ZodType<Prisma.EvaluationCreateOrConnectWithoutEvaluationResultsInput> = z.object({
  where: z.lazy(() => EvaluationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => EvaluationCreateWithoutEvaluationResultsInputSchema),z.lazy(() => EvaluationUncheckedCreateWithoutEvaluationResultsInputSchema) ]),
}).strict();

export const EvaluationTemplateCreateWithoutEvaluationResultsInputSchema: z.ZodType<Prisma.EvaluationTemplateCreateWithoutEvaluationResultsInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  name: z.string(),
  description: z.string(),
  params: z.union([ z.lazy(() => EvaluationTemplateCreateparamsInputSchema),z.string().array() ]).optional(),
  type: z.lazy(() => EvalTypeSchema),
  resultType: z.lazy(() => EvalResultTypeSchema),
  contentType: z.lazy(() => EvalContentTypeSchema).optional(),
  toolCallExpectedResult: z.string().optional(),
  ownerId: z.string().optional().nullable(),
  deleted: z.boolean().optional(),
  evaluations: z.lazy(() => EvaluationCreateNestedManyWithoutEvaluationTemplateInputSchema).optional()
}).strict();

export const EvaluationTemplateUncheckedCreateWithoutEvaluationResultsInputSchema: z.ZodType<Prisma.EvaluationTemplateUncheckedCreateWithoutEvaluationResultsInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  name: z.string(),
  description: z.string(),
  params: z.union([ z.lazy(() => EvaluationTemplateCreateparamsInputSchema),z.string().array() ]).optional(),
  type: z.lazy(() => EvalTypeSchema),
  resultType: z.lazy(() => EvalResultTypeSchema),
  contentType: z.lazy(() => EvalContentTypeSchema).optional(),
  toolCallExpectedResult: z.string().optional(),
  ownerId: z.string().optional().nullable(),
  deleted: z.boolean().optional(),
  evaluations: z.lazy(() => EvaluationUncheckedCreateNestedManyWithoutEvaluationTemplateInputSchema).optional()
}).strict();

export const EvaluationTemplateCreateOrConnectWithoutEvaluationResultsInputSchema: z.ZodType<Prisma.EvaluationTemplateCreateOrConnectWithoutEvaluationResultsInput> = z.object({
  where: z.lazy(() => EvaluationTemplateWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => EvaluationTemplateCreateWithoutEvaluationResultsInputSchema),z.lazy(() => EvaluationTemplateUncheckedCreateWithoutEvaluationResultsInputSchema) ]),
}).strict();

export const CallUpsertWithoutEvaluationResultsInputSchema: z.ZodType<Prisma.CallUpsertWithoutEvaluationResultsInput> = z.object({
  update: z.union([ z.lazy(() => CallUpdateWithoutEvaluationResultsInputSchema),z.lazy(() => CallUncheckedUpdateWithoutEvaluationResultsInputSchema) ]),
  create: z.union([ z.lazy(() => CallCreateWithoutEvaluationResultsInputSchema),z.lazy(() => CallUncheckedCreateWithoutEvaluationResultsInputSchema) ]),
  where: z.lazy(() => CallWhereInputSchema).optional()
}).strict();

export const CallUpdateToOneWithWhereWithoutEvaluationResultsInputSchema: z.ZodType<Prisma.CallUpdateToOneWithWhereWithoutEvaluationResultsInput> = z.object({
  where: z.lazy(() => CallWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CallUpdateWithoutEvaluationResultsInputSchema),z.lazy(() => CallUncheckedUpdateWithoutEvaluationResultsInputSchema) ]),
}).strict();

export const CallUpdateWithoutEvaluationResultsInputSchema: z.ZodType<Prisma.CallUpdateWithoutEvaluationResultsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  vapiCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ofOneDeviceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => EnumCallStatusFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => NullableEnumCallResultFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  failureReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  monoRecordingUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  regionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numInterruptions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isRead: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  readBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  agent: z.lazy(() => AgentUpdateOneWithoutCallsNestedInputSchema).optional(),
  test: z.lazy(() => TestUpdateOneWithoutCallsNestedInputSchema).optional(),
  testAgent: z.lazy(() => TestAgentUpdateOneWithoutCallsNestedInputSchema).optional(),
  scenario: z.lazy(() => ScenarioUpdateOneWithoutCallsNestedInputSchema).optional(),
  messages: z.lazy(() => MessageUpdateManyWithoutCallNestedInputSchema).optional(),
  latencyBlocks: z.lazy(() => LatencyBlockUpdateManyWithoutCallNestedInputSchema).optional(),
  interruptions: z.lazy(() => InterruptionUpdateManyWithoutCallNestedInputSchema).optional(),
  errors: z.lazy(() => CallErrorUpdateManyWithoutCallNestedInputSchema).optional()
}).strict();

export const CallUncheckedUpdateWithoutEvaluationResultsInputSchema: z.ZodType<Prisma.CallUncheckedUpdateWithoutEvaluationResultsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  vapiCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ofOneDeviceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => EnumCallStatusFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => NullableEnumCallResultFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  failureReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  monoRecordingUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  regionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numInterruptions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isRead: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  readBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  agentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testAgentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scenarioId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  messages: z.lazy(() => MessageUncheckedUpdateManyWithoutCallNestedInputSchema).optional(),
  latencyBlocks: z.lazy(() => LatencyBlockUncheckedUpdateManyWithoutCallNestedInputSchema).optional(),
  interruptions: z.lazy(() => InterruptionUncheckedUpdateManyWithoutCallNestedInputSchema).optional(),
  errors: z.lazy(() => CallErrorUncheckedUpdateManyWithoutCallNestedInputSchema).optional()
}).strict();

export const EvaluationUpsertWithoutEvaluationResultsInputSchema: z.ZodType<Prisma.EvaluationUpsertWithoutEvaluationResultsInput> = z.object({
  update: z.union([ z.lazy(() => EvaluationUpdateWithoutEvaluationResultsInputSchema),z.lazy(() => EvaluationUncheckedUpdateWithoutEvaluationResultsInputSchema) ]),
  create: z.union([ z.lazy(() => EvaluationCreateWithoutEvaluationResultsInputSchema),z.lazy(() => EvaluationUncheckedCreateWithoutEvaluationResultsInputSchema) ]),
  where: z.lazy(() => EvaluationWhereInputSchema).optional()
}).strict();

export const EvaluationUpdateToOneWithWhereWithoutEvaluationResultsInputSchema: z.ZodType<Prisma.EvaluationUpdateToOneWithWhereWithoutEvaluationResultsInput> = z.object({
  where: z.lazy(() => EvaluationWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => EvaluationUpdateWithoutEvaluationResultsInputSchema),z.lazy(() => EvaluationUncheckedUpdateWithoutEvaluationResultsInputSchema) ]),
}).strict();

export const EvaluationUpdateWithoutEvaluationResultsInputSchema: z.ZodType<Prisma.EvaluationUpdateWithoutEvaluationResultsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isCritical: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  params: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationTemplate: z.lazy(() => EvaluationTemplateUpdateOneRequiredWithoutEvaluationsNestedInputSchema).optional(),
  scenario: z.lazy(() => ScenarioUpdateOneWithoutEvaluationsNestedInputSchema).optional(),
  evaluationGroup: z.lazy(() => EvaluationGroupUpdateOneWithoutEvaluationsNestedInputSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationUpdateManyWithoutEvaluationNestedInputSchema).optional()
}).strict();

export const EvaluationUncheckedUpdateWithoutEvaluationResultsInputSchema: z.ZodType<Prisma.EvaluationUncheckedUpdateWithoutEvaluationResultsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isCritical: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  params: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationTemplateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  scenarioId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evaluationGroupId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  generalEvaluations: z.lazy(() => GeneralEvaluationUncheckedUpdateManyWithoutEvaluationNestedInputSchema).optional()
}).strict();

export const EvaluationTemplateUpsertWithoutEvaluationResultsInputSchema: z.ZodType<Prisma.EvaluationTemplateUpsertWithoutEvaluationResultsInput> = z.object({
  update: z.union([ z.lazy(() => EvaluationTemplateUpdateWithoutEvaluationResultsInputSchema),z.lazy(() => EvaluationTemplateUncheckedUpdateWithoutEvaluationResultsInputSchema) ]),
  create: z.union([ z.lazy(() => EvaluationTemplateCreateWithoutEvaluationResultsInputSchema),z.lazy(() => EvaluationTemplateUncheckedCreateWithoutEvaluationResultsInputSchema) ]),
  where: z.lazy(() => EvaluationTemplateWhereInputSchema).optional()
}).strict();

export const EvaluationTemplateUpdateToOneWithWhereWithoutEvaluationResultsInputSchema: z.ZodType<Prisma.EvaluationTemplateUpdateToOneWithWhereWithoutEvaluationResultsInput> = z.object({
  where: z.lazy(() => EvaluationTemplateWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => EvaluationTemplateUpdateWithoutEvaluationResultsInputSchema),z.lazy(() => EvaluationTemplateUncheckedUpdateWithoutEvaluationResultsInputSchema) ]),
}).strict();

export const EvaluationTemplateUpdateWithoutEvaluationResultsInputSchema: z.ZodType<Prisma.EvaluationTemplateUpdateWithoutEvaluationResultsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  params: z.union([ z.lazy(() => EvaluationTemplateUpdateparamsInputSchema),z.string().array() ]).optional(),
  type: z.union([ z.lazy(() => EvalTypeSchema),z.lazy(() => EnumEvalTypeFieldUpdateOperationsInputSchema) ]).optional(),
  resultType: z.union([ z.lazy(() => EvalResultTypeSchema),z.lazy(() => EnumEvalResultTypeFieldUpdateOperationsInputSchema) ]).optional(),
  contentType: z.union([ z.lazy(() => EvalContentTypeSchema),z.lazy(() => EnumEvalContentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  toolCallExpectedResult: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  evaluations: z.lazy(() => EvaluationUpdateManyWithoutEvaluationTemplateNestedInputSchema).optional()
}).strict();

export const EvaluationTemplateUncheckedUpdateWithoutEvaluationResultsInputSchema: z.ZodType<Prisma.EvaluationTemplateUncheckedUpdateWithoutEvaluationResultsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  params: z.union([ z.lazy(() => EvaluationTemplateUpdateparamsInputSchema),z.string().array() ]).optional(),
  type: z.union([ z.lazy(() => EvalTypeSchema),z.lazy(() => EnumEvalTypeFieldUpdateOperationsInputSchema) ]).optional(),
  resultType: z.union([ z.lazy(() => EvalResultTypeSchema),z.lazy(() => EnumEvalResultTypeFieldUpdateOperationsInputSchema) ]).optional(),
  contentType: z.union([ z.lazy(() => EvalContentTypeSchema),z.lazy(() => EnumEvalContentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  toolCallExpectedResult: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  evaluations: z.lazy(() => EvaluationUncheckedUpdateManyWithoutEvaluationTemplateNestedInputSchema).optional()
}).strict();

export const CallCreateWithoutLatencyBlocksInputSchema: z.ZodType<Prisma.CallCreateWithoutLatencyBlocksInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  ownerId: z.string().optional().nullable(),
  deleted: z.boolean().optional(),
  vapiCallId: z.string().optional().nullable(),
  customerCallId: z.string().optional().nullable(),
  ofOneDeviceId: z.string().optional().nullable(),
  status: z.lazy(() => CallStatusSchema),
  result: z.lazy(() => CallResultSchema).optional().nullable(),
  failureReason: z.string().optional().nullable(),
  stereoRecordingUrl: z.string(),
  monoRecordingUrl: z.string().optional().nullable(),
  startedAt: z.string().optional().nullable(),
  endedAt: z.string().optional().nullable(),
  regionId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.number().optional().nullable(),
  latencyP90: z.number().optional().nullable(),
  latencyP95: z.number().optional().nullable(),
  interruptionP50: z.number().optional().nullable(),
  interruptionP90: z.number().optional().nullable(),
  interruptionP95: z.number().optional().nullable(),
  numInterruptions: z.number().int().optional().nullable(),
  duration: z.number().optional().nullable(),
  isRead: z.boolean().optional().nullable(),
  readBy: z.string().optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  agent: z.lazy(() => AgentCreateNestedOneWithoutCallsInputSchema).optional(),
  test: z.lazy(() => TestCreateNestedOneWithoutCallsInputSchema).optional(),
  testAgent: z.lazy(() => TestAgentCreateNestedOneWithoutCallsInputSchema).optional(),
  scenario: z.lazy(() => ScenarioCreateNestedOneWithoutCallsInputSchema).optional(),
  evaluationResults: z.lazy(() => EvaluationResultCreateNestedManyWithoutCallInputSchema).optional(),
  messages: z.lazy(() => MessageCreateNestedManyWithoutCallInputSchema).optional(),
  interruptions: z.lazy(() => InterruptionCreateNestedManyWithoutCallInputSchema).optional(),
  errors: z.lazy(() => CallErrorCreateNestedManyWithoutCallInputSchema).optional()
}).strict();

export const CallUncheckedCreateWithoutLatencyBlocksInputSchema: z.ZodType<Prisma.CallUncheckedCreateWithoutLatencyBlocksInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  ownerId: z.string().optional().nullable(),
  deleted: z.boolean().optional(),
  vapiCallId: z.string().optional().nullable(),
  customerCallId: z.string().optional().nullable(),
  ofOneDeviceId: z.string().optional().nullable(),
  status: z.lazy(() => CallStatusSchema),
  result: z.lazy(() => CallResultSchema).optional().nullable(),
  failureReason: z.string().optional().nullable(),
  stereoRecordingUrl: z.string(),
  monoRecordingUrl: z.string().optional().nullable(),
  startedAt: z.string().optional().nullable(),
  endedAt: z.string().optional().nullable(),
  regionId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.number().optional().nullable(),
  latencyP90: z.number().optional().nullable(),
  latencyP95: z.number().optional().nullable(),
  interruptionP50: z.number().optional().nullable(),
  interruptionP90: z.number().optional().nullable(),
  interruptionP95: z.number().optional().nullable(),
  numInterruptions: z.number().int().optional().nullable(),
  duration: z.number().optional().nullable(),
  isRead: z.boolean().optional().nullable(),
  readBy: z.string().optional().nullable(),
  agentId: z.string().optional().nullable(),
  testId: z.string().optional().nullable(),
  testAgentId: z.string().optional().nullable(),
  scenarioId: z.string().optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationResults: z.lazy(() => EvaluationResultUncheckedCreateNestedManyWithoutCallInputSchema).optional(),
  messages: z.lazy(() => MessageUncheckedCreateNestedManyWithoutCallInputSchema).optional(),
  interruptions: z.lazy(() => InterruptionUncheckedCreateNestedManyWithoutCallInputSchema).optional(),
  errors: z.lazy(() => CallErrorUncheckedCreateNestedManyWithoutCallInputSchema).optional()
}).strict();

export const CallCreateOrConnectWithoutLatencyBlocksInputSchema: z.ZodType<Prisma.CallCreateOrConnectWithoutLatencyBlocksInput> = z.object({
  where: z.lazy(() => CallWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CallCreateWithoutLatencyBlocksInputSchema),z.lazy(() => CallUncheckedCreateWithoutLatencyBlocksInputSchema) ]),
}).strict();

export const CallUpsertWithoutLatencyBlocksInputSchema: z.ZodType<Prisma.CallUpsertWithoutLatencyBlocksInput> = z.object({
  update: z.union([ z.lazy(() => CallUpdateWithoutLatencyBlocksInputSchema),z.lazy(() => CallUncheckedUpdateWithoutLatencyBlocksInputSchema) ]),
  create: z.union([ z.lazy(() => CallCreateWithoutLatencyBlocksInputSchema),z.lazy(() => CallUncheckedCreateWithoutLatencyBlocksInputSchema) ]),
  where: z.lazy(() => CallWhereInputSchema).optional()
}).strict();

export const CallUpdateToOneWithWhereWithoutLatencyBlocksInputSchema: z.ZodType<Prisma.CallUpdateToOneWithWhereWithoutLatencyBlocksInput> = z.object({
  where: z.lazy(() => CallWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CallUpdateWithoutLatencyBlocksInputSchema),z.lazy(() => CallUncheckedUpdateWithoutLatencyBlocksInputSchema) ]),
}).strict();

export const CallUpdateWithoutLatencyBlocksInputSchema: z.ZodType<Prisma.CallUpdateWithoutLatencyBlocksInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  vapiCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ofOneDeviceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => EnumCallStatusFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => NullableEnumCallResultFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  failureReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  monoRecordingUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  regionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numInterruptions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isRead: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  readBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  agent: z.lazy(() => AgentUpdateOneWithoutCallsNestedInputSchema).optional(),
  test: z.lazy(() => TestUpdateOneWithoutCallsNestedInputSchema).optional(),
  testAgent: z.lazy(() => TestAgentUpdateOneWithoutCallsNestedInputSchema).optional(),
  scenario: z.lazy(() => ScenarioUpdateOneWithoutCallsNestedInputSchema).optional(),
  evaluationResults: z.lazy(() => EvaluationResultUpdateManyWithoutCallNestedInputSchema).optional(),
  messages: z.lazy(() => MessageUpdateManyWithoutCallNestedInputSchema).optional(),
  interruptions: z.lazy(() => InterruptionUpdateManyWithoutCallNestedInputSchema).optional(),
  errors: z.lazy(() => CallErrorUpdateManyWithoutCallNestedInputSchema).optional()
}).strict();

export const CallUncheckedUpdateWithoutLatencyBlocksInputSchema: z.ZodType<Prisma.CallUncheckedUpdateWithoutLatencyBlocksInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  vapiCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ofOneDeviceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => EnumCallStatusFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => NullableEnumCallResultFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  failureReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  monoRecordingUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  regionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numInterruptions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isRead: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  readBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  agentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testAgentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scenarioId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationResults: z.lazy(() => EvaluationResultUncheckedUpdateManyWithoutCallNestedInputSchema).optional(),
  messages: z.lazy(() => MessageUncheckedUpdateManyWithoutCallNestedInputSchema).optional(),
  interruptions: z.lazy(() => InterruptionUncheckedUpdateManyWithoutCallNestedInputSchema).optional(),
  errors: z.lazy(() => CallErrorUncheckedUpdateManyWithoutCallNestedInputSchema).optional()
}).strict();

export const CallCreateWithoutInterruptionsInputSchema: z.ZodType<Prisma.CallCreateWithoutInterruptionsInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  ownerId: z.string().optional().nullable(),
  deleted: z.boolean().optional(),
  vapiCallId: z.string().optional().nullable(),
  customerCallId: z.string().optional().nullable(),
  ofOneDeviceId: z.string().optional().nullable(),
  status: z.lazy(() => CallStatusSchema),
  result: z.lazy(() => CallResultSchema).optional().nullable(),
  failureReason: z.string().optional().nullable(),
  stereoRecordingUrl: z.string(),
  monoRecordingUrl: z.string().optional().nullable(),
  startedAt: z.string().optional().nullable(),
  endedAt: z.string().optional().nullable(),
  regionId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.number().optional().nullable(),
  latencyP90: z.number().optional().nullable(),
  latencyP95: z.number().optional().nullable(),
  interruptionP50: z.number().optional().nullable(),
  interruptionP90: z.number().optional().nullable(),
  interruptionP95: z.number().optional().nullable(),
  numInterruptions: z.number().int().optional().nullable(),
  duration: z.number().optional().nullable(),
  isRead: z.boolean().optional().nullable(),
  readBy: z.string().optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  agent: z.lazy(() => AgentCreateNestedOneWithoutCallsInputSchema).optional(),
  test: z.lazy(() => TestCreateNestedOneWithoutCallsInputSchema).optional(),
  testAgent: z.lazy(() => TestAgentCreateNestedOneWithoutCallsInputSchema).optional(),
  scenario: z.lazy(() => ScenarioCreateNestedOneWithoutCallsInputSchema).optional(),
  evaluationResults: z.lazy(() => EvaluationResultCreateNestedManyWithoutCallInputSchema).optional(),
  messages: z.lazy(() => MessageCreateNestedManyWithoutCallInputSchema).optional(),
  latencyBlocks: z.lazy(() => LatencyBlockCreateNestedManyWithoutCallInputSchema).optional(),
  errors: z.lazy(() => CallErrorCreateNestedManyWithoutCallInputSchema).optional()
}).strict();

export const CallUncheckedCreateWithoutInterruptionsInputSchema: z.ZodType<Prisma.CallUncheckedCreateWithoutInterruptionsInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  ownerId: z.string().optional().nullable(),
  deleted: z.boolean().optional(),
  vapiCallId: z.string().optional().nullable(),
  customerCallId: z.string().optional().nullable(),
  ofOneDeviceId: z.string().optional().nullable(),
  status: z.lazy(() => CallStatusSchema),
  result: z.lazy(() => CallResultSchema).optional().nullable(),
  failureReason: z.string().optional().nullable(),
  stereoRecordingUrl: z.string(),
  monoRecordingUrl: z.string().optional().nullable(),
  startedAt: z.string().optional().nullable(),
  endedAt: z.string().optional().nullable(),
  regionId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.number().optional().nullable(),
  latencyP90: z.number().optional().nullable(),
  latencyP95: z.number().optional().nullable(),
  interruptionP50: z.number().optional().nullable(),
  interruptionP90: z.number().optional().nullable(),
  interruptionP95: z.number().optional().nullable(),
  numInterruptions: z.number().int().optional().nullable(),
  duration: z.number().optional().nullable(),
  isRead: z.boolean().optional().nullable(),
  readBy: z.string().optional().nullable(),
  agentId: z.string().optional().nullable(),
  testId: z.string().optional().nullable(),
  testAgentId: z.string().optional().nullable(),
  scenarioId: z.string().optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationResults: z.lazy(() => EvaluationResultUncheckedCreateNestedManyWithoutCallInputSchema).optional(),
  messages: z.lazy(() => MessageUncheckedCreateNestedManyWithoutCallInputSchema).optional(),
  latencyBlocks: z.lazy(() => LatencyBlockUncheckedCreateNestedManyWithoutCallInputSchema).optional(),
  errors: z.lazy(() => CallErrorUncheckedCreateNestedManyWithoutCallInputSchema).optional()
}).strict();

export const CallCreateOrConnectWithoutInterruptionsInputSchema: z.ZodType<Prisma.CallCreateOrConnectWithoutInterruptionsInput> = z.object({
  where: z.lazy(() => CallWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CallCreateWithoutInterruptionsInputSchema),z.lazy(() => CallUncheckedCreateWithoutInterruptionsInputSchema) ]),
}).strict();

export const CallUpsertWithoutInterruptionsInputSchema: z.ZodType<Prisma.CallUpsertWithoutInterruptionsInput> = z.object({
  update: z.union([ z.lazy(() => CallUpdateWithoutInterruptionsInputSchema),z.lazy(() => CallUncheckedUpdateWithoutInterruptionsInputSchema) ]),
  create: z.union([ z.lazy(() => CallCreateWithoutInterruptionsInputSchema),z.lazy(() => CallUncheckedCreateWithoutInterruptionsInputSchema) ]),
  where: z.lazy(() => CallWhereInputSchema).optional()
}).strict();

export const CallUpdateToOneWithWhereWithoutInterruptionsInputSchema: z.ZodType<Prisma.CallUpdateToOneWithWhereWithoutInterruptionsInput> = z.object({
  where: z.lazy(() => CallWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CallUpdateWithoutInterruptionsInputSchema),z.lazy(() => CallUncheckedUpdateWithoutInterruptionsInputSchema) ]),
}).strict();

export const CallUpdateWithoutInterruptionsInputSchema: z.ZodType<Prisma.CallUpdateWithoutInterruptionsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  vapiCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ofOneDeviceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => EnumCallStatusFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => NullableEnumCallResultFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  failureReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  monoRecordingUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  regionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numInterruptions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isRead: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  readBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  agent: z.lazy(() => AgentUpdateOneWithoutCallsNestedInputSchema).optional(),
  test: z.lazy(() => TestUpdateOneWithoutCallsNestedInputSchema).optional(),
  testAgent: z.lazy(() => TestAgentUpdateOneWithoutCallsNestedInputSchema).optional(),
  scenario: z.lazy(() => ScenarioUpdateOneWithoutCallsNestedInputSchema).optional(),
  evaluationResults: z.lazy(() => EvaluationResultUpdateManyWithoutCallNestedInputSchema).optional(),
  messages: z.lazy(() => MessageUpdateManyWithoutCallNestedInputSchema).optional(),
  latencyBlocks: z.lazy(() => LatencyBlockUpdateManyWithoutCallNestedInputSchema).optional(),
  errors: z.lazy(() => CallErrorUpdateManyWithoutCallNestedInputSchema).optional()
}).strict();

export const CallUncheckedUpdateWithoutInterruptionsInputSchema: z.ZodType<Prisma.CallUncheckedUpdateWithoutInterruptionsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  vapiCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ofOneDeviceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => EnumCallStatusFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => NullableEnumCallResultFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  failureReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  monoRecordingUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  regionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numInterruptions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isRead: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  readBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  agentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testAgentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scenarioId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationResults: z.lazy(() => EvaluationResultUncheckedUpdateManyWithoutCallNestedInputSchema).optional(),
  messages: z.lazy(() => MessageUncheckedUpdateManyWithoutCallNestedInputSchema).optional(),
  latencyBlocks: z.lazy(() => LatencyBlockUncheckedUpdateManyWithoutCallNestedInputSchema).optional(),
  errors: z.lazy(() => CallErrorUncheckedUpdateManyWithoutCallNestedInputSchema).optional()
}).strict();

export const EvaluationCreateWithoutEvaluationGroupInputSchema: z.ZodType<Prisma.EvaluationCreateWithoutEvaluationGroupInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  enabled: z.boolean().optional(),
  isCritical: z.boolean().optional(),
  params: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationTemplate: z.lazy(() => EvaluationTemplateCreateNestedOneWithoutEvaluationsInputSchema),
  scenario: z.lazy(() => ScenarioCreateNestedOneWithoutEvaluationsInputSchema).optional(),
  evaluationResults: z.lazy(() => EvaluationResultCreateNestedManyWithoutEvaluationInputSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationCreateNestedManyWithoutEvaluationInputSchema).optional()
}).strict();

export const EvaluationUncheckedCreateWithoutEvaluationGroupInputSchema: z.ZodType<Prisma.EvaluationUncheckedCreateWithoutEvaluationGroupInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  enabled: z.boolean().optional(),
  isCritical: z.boolean().optional(),
  params: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationTemplateId: z.string(),
  scenarioId: z.string().optional().nullable(),
  evaluationResults: z.lazy(() => EvaluationResultUncheckedCreateNestedManyWithoutEvaluationInputSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationUncheckedCreateNestedManyWithoutEvaluationInputSchema).optional()
}).strict();

export const EvaluationCreateOrConnectWithoutEvaluationGroupInputSchema: z.ZodType<Prisma.EvaluationCreateOrConnectWithoutEvaluationGroupInput> = z.object({
  where: z.lazy(() => EvaluationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => EvaluationCreateWithoutEvaluationGroupInputSchema),z.lazy(() => EvaluationUncheckedCreateWithoutEvaluationGroupInputSchema) ]),
}).strict();

export const EvaluationCreateManyEvaluationGroupInputEnvelopeSchema: z.ZodType<Prisma.EvaluationCreateManyEvaluationGroupInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => EvaluationCreateManyEvaluationGroupInputSchema),z.lazy(() => EvaluationCreateManyEvaluationGroupInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const SavedSearchCreateWithoutEvaluationGroupsInputSchema: z.ZodType<Prisma.SavedSearchCreateWithoutEvaluationGroupsInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  name: z.string(),
  ownerId: z.string(),
  isDefault: z.boolean().optional(),
  agentId: z.union([ z.lazy(() => SavedSearchCreateagentIdInputSchema),z.string().array() ]).optional(),
  lookbackPeriod: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  timeRange: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  chartPeriod: z.number().int(),
  customerCallId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  alerts: z.lazy(() => AlertCreateNestedManyWithoutSavedSearchInputSchema).optional()
}).strict();

export const SavedSearchUncheckedCreateWithoutEvaluationGroupsInputSchema: z.ZodType<Prisma.SavedSearchUncheckedCreateWithoutEvaluationGroupsInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  name: z.string(),
  ownerId: z.string(),
  isDefault: z.boolean().optional(),
  agentId: z.union([ z.lazy(() => SavedSearchCreateagentIdInputSchema),z.string().array() ]).optional(),
  lookbackPeriod: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  timeRange: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  chartPeriod: z.number().int(),
  customerCallId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  alerts: z.lazy(() => AlertUncheckedCreateNestedManyWithoutSavedSearchInputSchema).optional()
}).strict();

export const SavedSearchCreateOrConnectWithoutEvaluationGroupsInputSchema: z.ZodType<Prisma.SavedSearchCreateOrConnectWithoutEvaluationGroupsInput> = z.object({
  where: z.lazy(() => SavedSearchWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SavedSearchCreateWithoutEvaluationGroupsInputSchema),z.lazy(() => SavedSearchUncheckedCreateWithoutEvaluationGroupsInputSchema) ]),
}).strict();

export const EvaluationUpsertWithWhereUniqueWithoutEvaluationGroupInputSchema: z.ZodType<Prisma.EvaluationUpsertWithWhereUniqueWithoutEvaluationGroupInput> = z.object({
  where: z.lazy(() => EvaluationWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => EvaluationUpdateWithoutEvaluationGroupInputSchema),z.lazy(() => EvaluationUncheckedUpdateWithoutEvaluationGroupInputSchema) ]),
  create: z.union([ z.lazy(() => EvaluationCreateWithoutEvaluationGroupInputSchema),z.lazy(() => EvaluationUncheckedCreateWithoutEvaluationGroupInputSchema) ]),
}).strict();

export const EvaluationUpdateWithWhereUniqueWithoutEvaluationGroupInputSchema: z.ZodType<Prisma.EvaluationUpdateWithWhereUniqueWithoutEvaluationGroupInput> = z.object({
  where: z.lazy(() => EvaluationWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => EvaluationUpdateWithoutEvaluationGroupInputSchema),z.lazy(() => EvaluationUncheckedUpdateWithoutEvaluationGroupInputSchema) ]),
}).strict();

export const EvaluationUpdateManyWithWhereWithoutEvaluationGroupInputSchema: z.ZodType<Prisma.EvaluationUpdateManyWithWhereWithoutEvaluationGroupInput> = z.object({
  where: z.lazy(() => EvaluationScalarWhereInputSchema),
  data: z.union([ z.lazy(() => EvaluationUpdateManyMutationInputSchema),z.lazy(() => EvaluationUncheckedUpdateManyWithoutEvaluationGroupInputSchema) ]),
}).strict();

export const SavedSearchUpsertWithoutEvaluationGroupsInputSchema: z.ZodType<Prisma.SavedSearchUpsertWithoutEvaluationGroupsInput> = z.object({
  update: z.union([ z.lazy(() => SavedSearchUpdateWithoutEvaluationGroupsInputSchema),z.lazy(() => SavedSearchUncheckedUpdateWithoutEvaluationGroupsInputSchema) ]),
  create: z.union([ z.lazy(() => SavedSearchCreateWithoutEvaluationGroupsInputSchema),z.lazy(() => SavedSearchUncheckedCreateWithoutEvaluationGroupsInputSchema) ]),
  where: z.lazy(() => SavedSearchWhereInputSchema).optional()
}).strict();

export const SavedSearchUpdateToOneWithWhereWithoutEvaluationGroupsInputSchema: z.ZodType<Prisma.SavedSearchUpdateToOneWithWhereWithoutEvaluationGroupsInput> = z.object({
  where: z.lazy(() => SavedSearchWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => SavedSearchUpdateWithoutEvaluationGroupsInputSchema),z.lazy(() => SavedSearchUncheckedUpdateWithoutEvaluationGroupsInputSchema) ]),
}).strict();

export const SavedSearchUpdateWithoutEvaluationGroupsInputSchema: z.ZodType<Prisma.SavedSearchUpdateWithoutEvaluationGroupsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDefault: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  agentId: z.union([ z.lazy(() => SavedSearchUpdateagentIdInputSchema),z.string().array() ]).optional(),
  lookbackPeriod: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  timeRange: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  chartPeriod: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  customerCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  alerts: z.lazy(() => AlertUpdateManyWithoutSavedSearchNestedInputSchema).optional()
}).strict();

export const SavedSearchUncheckedUpdateWithoutEvaluationGroupsInputSchema: z.ZodType<Prisma.SavedSearchUncheckedUpdateWithoutEvaluationGroupsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDefault: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  agentId: z.union([ z.lazy(() => SavedSearchUpdateagentIdInputSchema),z.string().array() ]).optional(),
  lookbackPeriod: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  timeRange: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  chartPeriod: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  customerCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  alerts: z.lazy(() => AlertUncheckedUpdateManyWithoutSavedSearchNestedInputSchema).optional()
}).strict();

export const EvaluationGroupCreateWithoutSavedSearchInputSchema: z.ZodType<Prisma.EvaluationGroupCreateWithoutSavedSearchInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  ownerId: z.string(),
  name: z.string(),
  condition: z.string().optional(),
  enabled: z.boolean().optional(),
  evaluations: z.lazy(() => EvaluationCreateNestedManyWithoutEvaluationGroupInputSchema).optional()
}).strict();

export const EvaluationGroupUncheckedCreateWithoutSavedSearchInputSchema: z.ZodType<Prisma.EvaluationGroupUncheckedCreateWithoutSavedSearchInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  ownerId: z.string(),
  name: z.string(),
  condition: z.string().optional(),
  enabled: z.boolean().optional(),
  evaluations: z.lazy(() => EvaluationUncheckedCreateNestedManyWithoutEvaluationGroupInputSchema).optional()
}).strict();

export const EvaluationGroupCreateOrConnectWithoutSavedSearchInputSchema: z.ZodType<Prisma.EvaluationGroupCreateOrConnectWithoutSavedSearchInput> = z.object({
  where: z.lazy(() => EvaluationGroupWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => EvaluationGroupCreateWithoutSavedSearchInputSchema),z.lazy(() => EvaluationGroupUncheckedCreateWithoutSavedSearchInputSchema) ]),
}).strict();

export const EvaluationGroupCreateManySavedSearchInputEnvelopeSchema: z.ZodType<Prisma.EvaluationGroupCreateManySavedSearchInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => EvaluationGroupCreateManySavedSearchInputSchema),z.lazy(() => EvaluationGroupCreateManySavedSearchInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const AlertCreateWithoutSavedSearchInputSchema: z.ZodType<Prisma.AlertCreateWithoutSavedSearchInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  ownerId: z.string(),
  name: z.string(),
  type: z.lazy(() => AlertTypeSchema),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  enabled: z.boolean().optional()
}).strict();

export const AlertUncheckedCreateWithoutSavedSearchInputSchema: z.ZodType<Prisma.AlertUncheckedCreateWithoutSavedSearchInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  ownerId: z.string(),
  name: z.string(),
  type: z.lazy(() => AlertTypeSchema),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  enabled: z.boolean().optional()
}).strict();

export const AlertCreateOrConnectWithoutSavedSearchInputSchema: z.ZodType<Prisma.AlertCreateOrConnectWithoutSavedSearchInput> = z.object({
  where: z.lazy(() => AlertWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AlertCreateWithoutSavedSearchInputSchema),z.lazy(() => AlertUncheckedCreateWithoutSavedSearchInputSchema) ]),
}).strict();

export const AlertCreateManySavedSearchInputEnvelopeSchema: z.ZodType<Prisma.AlertCreateManySavedSearchInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => AlertCreateManySavedSearchInputSchema),z.lazy(() => AlertCreateManySavedSearchInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const EvaluationGroupUpsertWithWhereUniqueWithoutSavedSearchInputSchema: z.ZodType<Prisma.EvaluationGroupUpsertWithWhereUniqueWithoutSavedSearchInput> = z.object({
  where: z.lazy(() => EvaluationGroupWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => EvaluationGroupUpdateWithoutSavedSearchInputSchema),z.lazy(() => EvaluationGroupUncheckedUpdateWithoutSavedSearchInputSchema) ]),
  create: z.union([ z.lazy(() => EvaluationGroupCreateWithoutSavedSearchInputSchema),z.lazy(() => EvaluationGroupUncheckedCreateWithoutSavedSearchInputSchema) ]),
}).strict();

export const EvaluationGroupUpdateWithWhereUniqueWithoutSavedSearchInputSchema: z.ZodType<Prisma.EvaluationGroupUpdateWithWhereUniqueWithoutSavedSearchInput> = z.object({
  where: z.lazy(() => EvaluationGroupWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => EvaluationGroupUpdateWithoutSavedSearchInputSchema),z.lazy(() => EvaluationGroupUncheckedUpdateWithoutSavedSearchInputSchema) ]),
}).strict();

export const EvaluationGroupUpdateManyWithWhereWithoutSavedSearchInputSchema: z.ZodType<Prisma.EvaluationGroupUpdateManyWithWhereWithoutSavedSearchInput> = z.object({
  where: z.lazy(() => EvaluationGroupScalarWhereInputSchema),
  data: z.union([ z.lazy(() => EvaluationGroupUpdateManyMutationInputSchema),z.lazy(() => EvaluationGroupUncheckedUpdateManyWithoutSavedSearchInputSchema) ]),
}).strict();

export const EvaluationGroupScalarWhereInputSchema: z.ZodType<Prisma.EvaluationGroupScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => EvaluationGroupScalarWhereInputSchema),z.lazy(() => EvaluationGroupScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvaluationGroupScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvaluationGroupScalarWhereInputSchema),z.lazy(() => EvaluationGroupScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  condition: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  enabled: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  savedSearchId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const AlertUpsertWithWhereUniqueWithoutSavedSearchInputSchema: z.ZodType<Prisma.AlertUpsertWithWhereUniqueWithoutSavedSearchInput> = z.object({
  where: z.lazy(() => AlertWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => AlertUpdateWithoutSavedSearchInputSchema),z.lazy(() => AlertUncheckedUpdateWithoutSavedSearchInputSchema) ]),
  create: z.union([ z.lazy(() => AlertCreateWithoutSavedSearchInputSchema),z.lazy(() => AlertUncheckedCreateWithoutSavedSearchInputSchema) ]),
}).strict();

export const AlertUpdateWithWhereUniqueWithoutSavedSearchInputSchema: z.ZodType<Prisma.AlertUpdateWithWhereUniqueWithoutSavedSearchInput> = z.object({
  where: z.lazy(() => AlertWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => AlertUpdateWithoutSavedSearchInputSchema),z.lazy(() => AlertUncheckedUpdateWithoutSavedSearchInputSchema) ]),
}).strict();

export const AlertUpdateManyWithWhereWithoutSavedSearchInputSchema: z.ZodType<Prisma.AlertUpdateManyWithWhereWithoutSavedSearchInput> = z.object({
  where: z.lazy(() => AlertScalarWhereInputSchema),
  data: z.union([ z.lazy(() => AlertUpdateManyMutationInputSchema),z.lazy(() => AlertUncheckedUpdateManyWithoutSavedSearchInputSchema) ]),
}).strict();

export const AlertScalarWhereInputSchema: z.ZodType<Prisma.AlertScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AlertScalarWhereInputSchema),z.lazy(() => AlertScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AlertScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AlertScalarWhereInputSchema),z.lazy(() => AlertScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  savedSearchId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumAlertTypeFilterSchema),z.lazy(() => AlertTypeSchema) ]).optional(),
  details: z.lazy(() => JsonFilterSchema).optional(),
  enabled: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
}).strict();

export const SavedSearchCreateWithoutAlertsInputSchema: z.ZodType<Prisma.SavedSearchCreateWithoutAlertsInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  name: z.string(),
  ownerId: z.string(),
  isDefault: z.boolean().optional(),
  agentId: z.union([ z.lazy(() => SavedSearchCreateagentIdInputSchema),z.string().array() ]).optional(),
  lookbackPeriod: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  timeRange: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  chartPeriod: z.number().int(),
  customerCallId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationGroups: z.lazy(() => EvaluationGroupCreateNestedManyWithoutSavedSearchInputSchema).optional()
}).strict();

export const SavedSearchUncheckedCreateWithoutAlertsInputSchema: z.ZodType<Prisma.SavedSearchUncheckedCreateWithoutAlertsInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  name: z.string(),
  ownerId: z.string(),
  isDefault: z.boolean().optional(),
  agentId: z.union([ z.lazy(() => SavedSearchCreateagentIdInputSchema),z.string().array() ]).optional(),
  lookbackPeriod: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  timeRange: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  chartPeriod: z.number().int(),
  customerCallId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationGroups: z.lazy(() => EvaluationGroupUncheckedCreateNestedManyWithoutSavedSearchInputSchema).optional()
}).strict();

export const SavedSearchCreateOrConnectWithoutAlertsInputSchema: z.ZodType<Prisma.SavedSearchCreateOrConnectWithoutAlertsInput> = z.object({
  where: z.lazy(() => SavedSearchWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SavedSearchCreateWithoutAlertsInputSchema),z.lazy(() => SavedSearchUncheckedCreateWithoutAlertsInputSchema) ]),
}).strict();

export const SavedSearchUpsertWithoutAlertsInputSchema: z.ZodType<Prisma.SavedSearchUpsertWithoutAlertsInput> = z.object({
  update: z.union([ z.lazy(() => SavedSearchUpdateWithoutAlertsInputSchema),z.lazy(() => SavedSearchUncheckedUpdateWithoutAlertsInputSchema) ]),
  create: z.union([ z.lazy(() => SavedSearchCreateWithoutAlertsInputSchema),z.lazy(() => SavedSearchUncheckedCreateWithoutAlertsInputSchema) ]),
  where: z.lazy(() => SavedSearchWhereInputSchema).optional()
}).strict();

export const SavedSearchUpdateToOneWithWhereWithoutAlertsInputSchema: z.ZodType<Prisma.SavedSearchUpdateToOneWithWhereWithoutAlertsInput> = z.object({
  where: z.lazy(() => SavedSearchWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => SavedSearchUpdateWithoutAlertsInputSchema),z.lazy(() => SavedSearchUncheckedUpdateWithoutAlertsInputSchema) ]),
}).strict();

export const SavedSearchUpdateWithoutAlertsInputSchema: z.ZodType<Prisma.SavedSearchUpdateWithoutAlertsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDefault: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  agentId: z.union([ z.lazy(() => SavedSearchUpdateagentIdInputSchema),z.string().array() ]).optional(),
  lookbackPeriod: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  timeRange: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  chartPeriod: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  customerCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationGroups: z.lazy(() => EvaluationGroupUpdateManyWithoutSavedSearchNestedInputSchema).optional()
}).strict();

export const SavedSearchUncheckedUpdateWithoutAlertsInputSchema: z.ZodType<Prisma.SavedSearchUncheckedUpdateWithoutAlertsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDefault: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  agentId: z.union([ z.lazy(() => SavedSearchUpdateagentIdInputSchema),z.string().array() ]).optional(),
  lookbackPeriod: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  timeRange: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  chartPeriod: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  customerCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationGroups: z.lazy(() => EvaluationGroupUncheckedUpdateManyWithoutSavedSearchNestedInputSchema).optional()
}).strict();

export const ScenarioCreateManyAgentInputSchema: z.ZodType<Prisma.ScenarioCreateManyAgentInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  name: z.string(),
  instructions: z.string(),
  successCriteria: z.string().optional(),
  includeDateTime: z.boolean().optional(),
  timezone: z.string().optional().nullable(),
  deleted: z.boolean().optional()
}).strict();

export const TestCreateManyAgentInputSchema: z.ZodType<Prisma.TestCreateManyAgentInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  gitBranch: z.string().optional().nullable(),
  gitCommit: z.string().optional().nullable(),
  runFromApi: z.boolean().optional()
}).strict();

export const CallCreateManyAgentInputSchema: z.ZodType<Prisma.CallCreateManyAgentInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  ownerId: z.string().optional().nullable(),
  deleted: z.boolean().optional(),
  vapiCallId: z.string().optional().nullable(),
  customerCallId: z.string().optional().nullable(),
  ofOneDeviceId: z.string().optional().nullable(),
  status: z.lazy(() => CallStatusSchema),
  result: z.lazy(() => CallResultSchema).optional().nullable(),
  failureReason: z.string().optional().nullable(),
  stereoRecordingUrl: z.string(),
  monoRecordingUrl: z.string().optional().nullable(),
  startedAt: z.string().optional().nullable(),
  endedAt: z.string().optional().nullable(),
  regionId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.number().optional().nullable(),
  latencyP90: z.number().optional().nullable(),
  latencyP95: z.number().optional().nullable(),
  interruptionP50: z.number().optional().nullable(),
  interruptionP90: z.number().optional().nullable(),
  interruptionP95: z.number().optional().nullable(),
  numInterruptions: z.number().int().optional().nullable(),
  duration: z.number().optional().nullable(),
  isRead: z.boolean().optional().nullable(),
  readBy: z.string().optional().nullable(),
  testId: z.string().optional().nullable(),
  testAgentId: z.string().optional().nullable(),
  scenarioId: z.string().optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const GeneralEvaluationCreateManyAgentInputSchema: z.ZodType<Prisma.GeneralEvaluationCreateManyAgentInput> = z.object({
  id: z.string().optional(),
  evaluationId: z.string()
}).strict();

export const TestAgentUpdateWithoutAgentsInputSchema: z.ZodType<Prisma.TestAgentUpdateWithoutAgentsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  headshotUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  prompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  defaultSelected: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  calls: z.lazy(() => CallUpdateManyWithoutTestAgentNestedInputSchema).optional()
}).strict();

export const TestAgentUncheckedUpdateWithoutAgentsInputSchema: z.ZodType<Prisma.TestAgentUncheckedUpdateWithoutAgentsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  headshotUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  prompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  defaultSelected: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  calls: z.lazy(() => CallUncheckedUpdateManyWithoutTestAgentNestedInputSchema).optional()
}).strict();

export const TestAgentUncheckedUpdateManyWithoutAgentsInputSchema: z.ZodType<Prisma.TestAgentUncheckedUpdateManyWithoutAgentsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  headshotUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  prompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  defaultSelected: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ScenarioUpdateWithoutAgentInputSchema: z.ZodType<Prisma.ScenarioUpdateWithoutAgentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  instructions: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  successCriteria: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  includeDateTime: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  timezone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  calls: z.lazy(() => CallUpdateManyWithoutScenarioNestedInputSchema).optional(),
  evaluations: z.lazy(() => EvaluationUpdateManyWithoutScenarioNestedInputSchema).optional()
}).strict();

export const ScenarioUncheckedUpdateWithoutAgentInputSchema: z.ZodType<Prisma.ScenarioUncheckedUpdateWithoutAgentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  instructions: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  successCriteria: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  includeDateTime: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  timezone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  calls: z.lazy(() => CallUncheckedUpdateManyWithoutScenarioNestedInputSchema).optional(),
  evaluations: z.lazy(() => EvaluationUncheckedUpdateManyWithoutScenarioNestedInputSchema).optional()
}).strict();

export const ScenarioUncheckedUpdateManyWithoutAgentInputSchema: z.ZodType<Prisma.ScenarioUncheckedUpdateManyWithoutAgentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  instructions: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  successCriteria: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  includeDateTime: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  timezone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TestUpdateWithoutAgentInputSchema: z.ZodType<Prisma.TestUpdateWithoutAgentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  gitBranch: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  gitCommit: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  runFromApi: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  calls: z.lazy(() => CallUpdateManyWithoutTestNestedInputSchema).optional()
}).strict();

export const TestUncheckedUpdateWithoutAgentInputSchema: z.ZodType<Prisma.TestUncheckedUpdateWithoutAgentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  gitBranch: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  gitCommit: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  runFromApi: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  calls: z.lazy(() => CallUncheckedUpdateManyWithoutTestNestedInputSchema).optional()
}).strict();

export const TestUncheckedUpdateManyWithoutAgentInputSchema: z.ZodType<Prisma.TestUncheckedUpdateManyWithoutAgentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  gitBranch: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  gitCommit: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  runFromApi: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CallUpdateWithoutAgentInputSchema: z.ZodType<Prisma.CallUpdateWithoutAgentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  vapiCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ofOneDeviceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => EnumCallStatusFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => NullableEnumCallResultFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  failureReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  monoRecordingUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  regionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numInterruptions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isRead: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  readBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  test: z.lazy(() => TestUpdateOneWithoutCallsNestedInputSchema).optional(),
  testAgent: z.lazy(() => TestAgentUpdateOneWithoutCallsNestedInputSchema).optional(),
  scenario: z.lazy(() => ScenarioUpdateOneWithoutCallsNestedInputSchema).optional(),
  evaluationResults: z.lazy(() => EvaluationResultUpdateManyWithoutCallNestedInputSchema).optional(),
  messages: z.lazy(() => MessageUpdateManyWithoutCallNestedInputSchema).optional(),
  latencyBlocks: z.lazy(() => LatencyBlockUpdateManyWithoutCallNestedInputSchema).optional(),
  interruptions: z.lazy(() => InterruptionUpdateManyWithoutCallNestedInputSchema).optional(),
  errors: z.lazy(() => CallErrorUpdateManyWithoutCallNestedInputSchema).optional()
}).strict();

export const CallUncheckedUpdateWithoutAgentInputSchema: z.ZodType<Prisma.CallUncheckedUpdateWithoutAgentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  vapiCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ofOneDeviceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => EnumCallStatusFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => NullableEnumCallResultFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  failureReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  monoRecordingUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  regionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numInterruptions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isRead: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  readBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testAgentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scenarioId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationResults: z.lazy(() => EvaluationResultUncheckedUpdateManyWithoutCallNestedInputSchema).optional(),
  messages: z.lazy(() => MessageUncheckedUpdateManyWithoutCallNestedInputSchema).optional(),
  latencyBlocks: z.lazy(() => LatencyBlockUncheckedUpdateManyWithoutCallNestedInputSchema).optional(),
  interruptions: z.lazy(() => InterruptionUncheckedUpdateManyWithoutCallNestedInputSchema).optional(),
  errors: z.lazy(() => CallErrorUncheckedUpdateManyWithoutCallNestedInputSchema).optional()
}).strict();

export const CallUncheckedUpdateManyWithoutAgentInputSchema: z.ZodType<Prisma.CallUncheckedUpdateManyWithoutAgentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  vapiCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ofOneDeviceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => EnumCallStatusFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => NullableEnumCallResultFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  failureReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  monoRecordingUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  regionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numInterruptions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isRead: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  readBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testAgentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scenarioId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const GeneralEvaluationUpdateWithoutAgentInputSchema: z.ZodType<Prisma.GeneralEvaluationUpdateWithoutAgentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  evaluation: z.lazy(() => EvaluationUpdateOneRequiredWithoutGeneralEvaluationsNestedInputSchema).optional()
}).strict();

export const GeneralEvaluationUncheckedUpdateWithoutAgentInputSchema: z.ZodType<Prisma.GeneralEvaluationUncheckedUpdateWithoutAgentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  evaluationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const GeneralEvaluationUncheckedUpdateManyWithoutAgentInputSchema: z.ZodType<Prisma.GeneralEvaluationUncheckedUpdateManyWithoutAgentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  evaluationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CallCreateManyTestInputSchema: z.ZodType<Prisma.CallCreateManyTestInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  ownerId: z.string().optional().nullable(),
  deleted: z.boolean().optional(),
  vapiCallId: z.string().optional().nullable(),
  customerCallId: z.string().optional().nullable(),
  ofOneDeviceId: z.string().optional().nullable(),
  status: z.lazy(() => CallStatusSchema),
  result: z.lazy(() => CallResultSchema).optional().nullable(),
  failureReason: z.string().optional().nullable(),
  stereoRecordingUrl: z.string(),
  monoRecordingUrl: z.string().optional().nullable(),
  startedAt: z.string().optional().nullable(),
  endedAt: z.string().optional().nullable(),
  regionId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.number().optional().nullable(),
  latencyP90: z.number().optional().nullable(),
  latencyP95: z.number().optional().nullable(),
  interruptionP50: z.number().optional().nullable(),
  interruptionP90: z.number().optional().nullable(),
  interruptionP95: z.number().optional().nullable(),
  numInterruptions: z.number().int().optional().nullable(),
  duration: z.number().optional().nullable(),
  isRead: z.boolean().optional().nullable(),
  readBy: z.string().optional().nullable(),
  agentId: z.string().optional().nullable(),
  testAgentId: z.string().optional().nullable(),
  scenarioId: z.string().optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const CallUpdateWithoutTestInputSchema: z.ZodType<Prisma.CallUpdateWithoutTestInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  vapiCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ofOneDeviceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => EnumCallStatusFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => NullableEnumCallResultFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  failureReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  monoRecordingUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  regionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numInterruptions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isRead: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  readBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  agent: z.lazy(() => AgentUpdateOneWithoutCallsNestedInputSchema).optional(),
  testAgent: z.lazy(() => TestAgentUpdateOneWithoutCallsNestedInputSchema).optional(),
  scenario: z.lazy(() => ScenarioUpdateOneWithoutCallsNestedInputSchema).optional(),
  evaluationResults: z.lazy(() => EvaluationResultUpdateManyWithoutCallNestedInputSchema).optional(),
  messages: z.lazy(() => MessageUpdateManyWithoutCallNestedInputSchema).optional(),
  latencyBlocks: z.lazy(() => LatencyBlockUpdateManyWithoutCallNestedInputSchema).optional(),
  interruptions: z.lazy(() => InterruptionUpdateManyWithoutCallNestedInputSchema).optional(),
  errors: z.lazy(() => CallErrorUpdateManyWithoutCallNestedInputSchema).optional()
}).strict();

export const CallUncheckedUpdateWithoutTestInputSchema: z.ZodType<Prisma.CallUncheckedUpdateWithoutTestInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  vapiCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ofOneDeviceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => EnumCallStatusFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => NullableEnumCallResultFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  failureReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  monoRecordingUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  regionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numInterruptions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isRead: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  readBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  agentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testAgentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scenarioId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationResults: z.lazy(() => EvaluationResultUncheckedUpdateManyWithoutCallNestedInputSchema).optional(),
  messages: z.lazy(() => MessageUncheckedUpdateManyWithoutCallNestedInputSchema).optional(),
  latencyBlocks: z.lazy(() => LatencyBlockUncheckedUpdateManyWithoutCallNestedInputSchema).optional(),
  interruptions: z.lazy(() => InterruptionUncheckedUpdateManyWithoutCallNestedInputSchema).optional(),
  errors: z.lazy(() => CallErrorUncheckedUpdateManyWithoutCallNestedInputSchema).optional()
}).strict();

export const CallUncheckedUpdateManyWithoutTestInputSchema: z.ZodType<Prisma.CallUncheckedUpdateManyWithoutTestInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  vapiCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ofOneDeviceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => EnumCallStatusFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => NullableEnumCallResultFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  failureReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  monoRecordingUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  regionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numInterruptions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isRead: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  readBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  agentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testAgentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scenarioId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const CallCreateManyTestAgentInputSchema: z.ZodType<Prisma.CallCreateManyTestAgentInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  ownerId: z.string().optional().nullable(),
  deleted: z.boolean().optional(),
  vapiCallId: z.string().optional().nullable(),
  customerCallId: z.string().optional().nullable(),
  ofOneDeviceId: z.string().optional().nullable(),
  status: z.lazy(() => CallStatusSchema),
  result: z.lazy(() => CallResultSchema).optional().nullable(),
  failureReason: z.string().optional().nullable(),
  stereoRecordingUrl: z.string(),
  monoRecordingUrl: z.string().optional().nullable(),
  startedAt: z.string().optional().nullable(),
  endedAt: z.string().optional().nullable(),
  regionId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.number().optional().nullable(),
  latencyP90: z.number().optional().nullable(),
  latencyP95: z.number().optional().nullable(),
  interruptionP50: z.number().optional().nullable(),
  interruptionP90: z.number().optional().nullable(),
  interruptionP95: z.number().optional().nullable(),
  numInterruptions: z.number().int().optional().nullable(),
  duration: z.number().optional().nullable(),
  isRead: z.boolean().optional().nullable(),
  readBy: z.string().optional().nullable(),
  agentId: z.string().optional().nullable(),
  testId: z.string().optional().nullable(),
  scenarioId: z.string().optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const AgentUpdateWithoutEnabledTestAgentsInputSchema: z.ZodType<Prisma.AgentUpdateWithoutEnabledTestAgentsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerAgentId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  githubRepoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  systemPrompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  extraProperties: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enableSlackNotifications: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  scenarios: z.lazy(() => ScenarioUpdateManyWithoutAgentNestedInputSchema).optional(),
  tests: z.lazy(() => TestUpdateManyWithoutAgentNestedInputSchema).optional(),
  calls: z.lazy(() => CallUpdateManyWithoutAgentNestedInputSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationUpdateManyWithoutAgentNestedInputSchema).optional()
}).strict();

export const AgentUncheckedUpdateWithoutEnabledTestAgentsInputSchema: z.ZodType<Prisma.AgentUncheckedUpdateWithoutEnabledTestAgentsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerAgentId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  githubRepoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  systemPrompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  extraProperties: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enableSlackNotifications: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  scenarios: z.lazy(() => ScenarioUncheckedUpdateManyWithoutAgentNestedInputSchema).optional(),
  tests: z.lazy(() => TestUncheckedUpdateManyWithoutAgentNestedInputSchema).optional(),
  calls: z.lazy(() => CallUncheckedUpdateManyWithoutAgentNestedInputSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationUncheckedUpdateManyWithoutAgentNestedInputSchema).optional()
}).strict();

export const AgentUncheckedUpdateManyWithoutEnabledTestAgentsInputSchema: z.ZodType<Prisma.AgentUncheckedUpdateManyWithoutEnabledTestAgentsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerAgentId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  githubRepoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  systemPrompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  extraProperties: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enableSlackNotifications: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CallUpdateWithoutTestAgentInputSchema: z.ZodType<Prisma.CallUpdateWithoutTestAgentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  vapiCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ofOneDeviceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => EnumCallStatusFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => NullableEnumCallResultFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  failureReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  monoRecordingUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  regionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numInterruptions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isRead: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  readBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  agent: z.lazy(() => AgentUpdateOneWithoutCallsNestedInputSchema).optional(),
  test: z.lazy(() => TestUpdateOneWithoutCallsNestedInputSchema).optional(),
  scenario: z.lazy(() => ScenarioUpdateOneWithoutCallsNestedInputSchema).optional(),
  evaluationResults: z.lazy(() => EvaluationResultUpdateManyWithoutCallNestedInputSchema).optional(),
  messages: z.lazy(() => MessageUpdateManyWithoutCallNestedInputSchema).optional(),
  latencyBlocks: z.lazy(() => LatencyBlockUpdateManyWithoutCallNestedInputSchema).optional(),
  interruptions: z.lazy(() => InterruptionUpdateManyWithoutCallNestedInputSchema).optional(),
  errors: z.lazy(() => CallErrorUpdateManyWithoutCallNestedInputSchema).optional()
}).strict();

export const CallUncheckedUpdateWithoutTestAgentInputSchema: z.ZodType<Prisma.CallUncheckedUpdateWithoutTestAgentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  vapiCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ofOneDeviceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => EnumCallStatusFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => NullableEnumCallResultFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  failureReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  monoRecordingUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  regionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numInterruptions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isRead: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  readBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  agentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scenarioId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationResults: z.lazy(() => EvaluationResultUncheckedUpdateManyWithoutCallNestedInputSchema).optional(),
  messages: z.lazy(() => MessageUncheckedUpdateManyWithoutCallNestedInputSchema).optional(),
  latencyBlocks: z.lazy(() => LatencyBlockUncheckedUpdateManyWithoutCallNestedInputSchema).optional(),
  interruptions: z.lazy(() => InterruptionUncheckedUpdateManyWithoutCallNestedInputSchema).optional(),
  errors: z.lazy(() => CallErrorUncheckedUpdateManyWithoutCallNestedInputSchema).optional()
}).strict();

export const CallUncheckedUpdateManyWithoutTestAgentInputSchema: z.ZodType<Prisma.CallUncheckedUpdateManyWithoutTestAgentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  vapiCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ofOneDeviceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => EnumCallStatusFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => NullableEnumCallResultFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  failureReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  monoRecordingUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  regionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numInterruptions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isRead: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  readBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  agentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scenarioId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const EvaluationResultCreateManyCallInputSchema: z.ZodType<Prisma.EvaluationResultCreateManyCallInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  evaluationId: z.string(),
  result: z.string(),
  success: z.boolean(),
  secondsFromStart: z.number().optional().nullable(),
  duration: z.number().optional().nullable(),
  type: z.lazy(() => EvalResultTypeSchema),
  details: z.string(),
  evaluationTemplateId: z.string().optional().nullable()
}).strict();

export const MessageCreateManyCallInputSchema: z.ZodType<Prisma.MessageCreateManyCallInput> = z.object({
  id: z.string().optional(),
  role: z.lazy(() => RoleSchema),
  message: z.string().optional(),
  time: z.number().optional(),
  endTime: z.number().optional(),
  secondsFromStart: z.number().optional(),
  duration: z.number().optional(),
  name: z.string().optional(),
  result: z.string().optional(),
  toolCalls: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const LatencyBlockCreateManyCallInputSchema: z.ZodType<Prisma.LatencyBlockCreateManyCallInput> = z.object({
  id: z.string().optional(),
  secondsFromStart: z.number(),
  duration: z.number()
}).strict();

export const InterruptionCreateManyCallInputSchema: z.ZodType<Prisma.InterruptionCreateManyCallInput> = z.object({
  id: z.string().optional(),
  secondsFromStart: z.number(),
  duration: z.number(),
  text: z.string()
}).strict();

export const CallErrorCreateManyCallInputSchema: z.ZodType<Prisma.CallErrorCreateManyCallInput> = z.object({
  id: z.string().optional(),
  secondsFromStart: z.number(),
  duration: z.number(),
  type: z.string().optional().nullable(),
  description: z.string()
}).strict();

export const EvaluationResultUpdateWithoutCallInputSchema: z.ZodType<Prisma.EvaluationResultUpdateWithoutCallInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  success: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => EvalResultTypeSchema),z.lazy(() => EnumEvalResultTypeFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  evaluation: z.lazy(() => EvaluationUpdateOneRequiredWithoutEvaluationResultsNestedInputSchema).optional(),
  evaluationTemplate: z.lazy(() => EvaluationTemplateUpdateOneWithoutEvaluationResultsNestedInputSchema).optional()
}).strict();

export const EvaluationResultUncheckedUpdateWithoutCallInputSchema: z.ZodType<Prisma.EvaluationResultUncheckedUpdateWithoutCallInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  evaluationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  success: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => EvalResultTypeSchema),z.lazy(() => EnumEvalResultTypeFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  evaluationTemplateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const EvaluationResultUncheckedUpdateManyWithoutCallInputSchema: z.ZodType<Prisma.EvaluationResultUncheckedUpdateManyWithoutCallInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  evaluationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  success: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => EvalResultTypeSchema),z.lazy(() => EnumEvalResultTypeFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  evaluationTemplateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const MessageUpdateWithoutCallInputSchema: z.ZodType<Prisma.MessageUpdateWithoutCallInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  toolCalls: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const MessageUncheckedUpdateWithoutCallInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateWithoutCallInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  toolCalls: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const MessageUncheckedUpdateManyWithoutCallInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateManyWithoutCallInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  toolCalls: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const LatencyBlockUpdateWithoutCallInputSchema: z.ZodType<Prisma.LatencyBlockUpdateWithoutCallInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LatencyBlockUncheckedUpdateWithoutCallInputSchema: z.ZodType<Prisma.LatencyBlockUncheckedUpdateWithoutCallInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LatencyBlockUncheckedUpdateManyWithoutCallInputSchema: z.ZodType<Prisma.LatencyBlockUncheckedUpdateManyWithoutCallInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const InterruptionUpdateWithoutCallInputSchema: z.ZodType<Prisma.InterruptionUpdateWithoutCallInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  text: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const InterruptionUncheckedUpdateWithoutCallInputSchema: z.ZodType<Prisma.InterruptionUncheckedUpdateWithoutCallInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  text: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const InterruptionUncheckedUpdateManyWithoutCallInputSchema: z.ZodType<Prisma.InterruptionUncheckedUpdateManyWithoutCallInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  text: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CallErrorUpdateWithoutCallInputSchema: z.ZodType<Prisma.CallErrorUpdateWithoutCallInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CallErrorUncheckedUpdateWithoutCallInputSchema: z.ZodType<Prisma.CallErrorUncheckedUpdateWithoutCallInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CallErrorUncheckedUpdateManyWithoutCallInputSchema: z.ZodType<Prisma.CallErrorUncheckedUpdateManyWithoutCallInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CallCreateManyScenarioInputSchema: z.ZodType<Prisma.CallCreateManyScenarioInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  ownerId: z.string().optional().nullable(),
  deleted: z.boolean().optional(),
  vapiCallId: z.string().optional().nullable(),
  customerCallId: z.string().optional().nullable(),
  ofOneDeviceId: z.string().optional().nullable(),
  status: z.lazy(() => CallStatusSchema),
  result: z.lazy(() => CallResultSchema).optional().nullable(),
  failureReason: z.string().optional().nullable(),
  stereoRecordingUrl: z.string(),
  monoRecordingUrl: z.string().optional().nullable(),
  startedAt: z.string().optional().nullable(),
  endedAt: z.string().optional().nullable(),
  regionId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.number().optional().nullable(),
  latencyP90: z.number().optional().nullable(),
  latencyP95: z.number().optional().nullable(),
  interruptionP50: z.number().optional().nullable(),
  interruptionP90: z.number().optional().nullable(),
  interruptionP95: z.number().optional().nullable(),
  numInterruptions: z.number().int().optional().nullable(),
  duration: z.number().optional().nullable(),
  isRead: z.boolean().optional().nullable(),
  readBy: z.string().optional().nullable(),
  agentId: z.string().optional().nullable(),
  testId: z.string().optional().nullable(),
  testAgentId: z.string().optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const EvaluationCreateManyScenarioInputSchema: z.ZodType<Prisma.EvaluationCreateManyScenarioInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  enabled: z.boolean().optional(),
  isCritical: z.boolean().optional(),
  params: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationTemplateId: z.string(),
  evaluationGroupId: z.string().optional().nullable()
}).strict();

export const CallUpdateWithoutScenarioInputSchema: z.ZodType<Prisma.CallUpdateWithoutScenarioInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  vapiCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ofOneDeviceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => EnumCallStatusFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => NullableEnumCallResultFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  failureReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  monoRecordingUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  regionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numInterruptions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isRead: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  readBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  agent: z.lazy(() => AgentUpdateOneWithoutCallsNestedInputSchema).optional(),
  test: z.lazy(() => TestUpdateOneWithoutCallsNestedInputSchema).optional(),
  testAgent: z.lazy(() => TestAgentUpdateOneWithoutCallsNestedInputSchema).optional(),
  evaluationResults: z.lazy(() => EvaluationResultUpdateManyWithoutCallNestedInputSchema).optional(),
  messages: z.lazy(() => MessageUpdateManyWithoutCallNestedInputSchema).optional(),
  latencyBlocks: z.lazy(() => LatencyBlockUpdateManyWithoutCallNestedInputSchema).optional(),
  interruptions: z.lazy(() => InterruptionUpdateManyWithoutCallNestedInputSchema).optional(),
  errors: z.lazy(() => CallErrorUpdateManyWithoutCallNestedInputSchema).optional()
}).strict();

export const CallUncheckedUpdateWithoutScenarioInputSchema: z.ZodType<Prisma.CallUncheckedUpdateWithoutScenarioInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  vapiCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ofOneDeviceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => EnumCallStatusFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => NullableEnumCallResultFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  failureReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  monoRecordingUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  regionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numInterruptions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isRead: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  readBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  agentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testAgentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationResults: z.lazy(() => EvaluationResultUncheckedUpdateManyWithoutCallNestedInputSchema).optional(),
  messages: z.lazy(() => MessageUncheckedUpdateManyWithoutCallNestedInputSchema).optional(),
  latencyBlocks: z.lazy(() => LatencyBlockUncheckedUpdateManyWithoutCallNestedInputSchema).optional(),
  interruptions: z.lazy(() => InterruptionUncheckedUpdateManyWithoutCallNestedInputSchema).optional(),
  errors: z.lazy(() => CallErrorUncheckedUpdateManyWithoutCallNestedInputSchema).optional()
}).strict();

export const CallUncheckedUpdateManyWithoutScenarioInputSchema: z.ZodType<Prisma.CallUncheckedUpdateManyWithoutScenarioInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  vapiCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerCallId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ofOneDeviceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => CallStatusSchema),z.lazy(() => EnumCallStatusFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => CallResultSchema),z.lazy(() => NullableEnumCallResultFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  failureReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stereoRecordingUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  monoRecordingUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endedAt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  regionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  latencyP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latencyP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP50: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP90: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  interruptionP95: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numInterruptions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isRead: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  readBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  agentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testAgentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evalSetToSuccess: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const EvaluationUpdateWithoutScenarioInputSchema: z.ZodType<Prisma.EvaluationUpdateWithoutScenarioInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isCritical: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  params: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationTemplate: z.lazy(() => EvaluationTemplateUpdateOneRequiredWithoutEvaluationsNestedInputSchema).optional(),
  evaluationGroup: z.lazy(() => EvaluationGroupUpdateOneWithoutEvaluationsNestedInputSchema).optional(),
  evaluationResults: z.lazy(() => EvaluationResultUpdateManyWithoutEvaluationNestedInputSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationUpdateManyWithoutEvaluationNestedInputSchema).optional()
}).strict();

export const EvaluationUncheckedUpdateWithoutScenarioInputSchema: z.ZodType<Prisma.EvaluationUncheckedUpdateWithoutScenarioInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isCritical: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  params: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationTemplateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  evaluationGroupId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evaluationResults: z.lazy(() => EvaluationResultUncheckedUpdateManyWithoutEvaluationNestedInputSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationUncheckedUpdateManyWithoutEvaluationNestedInputSchema).optional()
}).strict();

export const EvaluationUncheckedUpdateManyWithoutScenarioInputSchema: z.ZodType<Prisma.EvaluationUncheckedUpdateManyWithoutScenarioInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isCritical: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  params: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationTemplateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  evaluationGroupId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const EvaluationResultCreateManyEvaluationTemplateInputSchema: z.ZodType<Prisma.EvaluationResultCreateManyEvaluationTemplateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  callId: z.string().optional().nullable(),
  evaluationId: z.string(),
  result: z.string(),
  success: z.boolean(),
  secondsFromStart: z.number().optional().nullable(),
  duration: z.number().optional().nullable(),
  type: z.lazy(() => EvalResultTypeSchema),
  details: z.string()
}).strict();

export const EvaluationCreateManyEvaluationTemplateInputSchema: z.ZodType<Prisma.EvaluationCreateManyEvaluationTemplateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  enabled: z.boolean().optional(),
  isCritical: z.boolean().optional(),
  params: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  scenarioId: z.string().optional().nullable(),
  evaluationGroupId: z.string().optional().nullable()
}).strict();

export const EvaluationResultUpdateWithoutEvaluationTemplateInputSchema: z.ZodType<Prisma.EvaluationResultUpdateWithoutEvaluationTemplateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  success: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => EvalResultTypeSchema),z.lazy(() => EnumEvalResultTypeFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  call: z.lazy(() => CallUpdateOneWithoutEvaluationResultsNestedInputSchema).optional(),
  evaluation: z.lazy(() => EvaluationUpdateOneRequiredWithoutEvaluationResultsNestedInputSchema).optional()
}).strict();

export const EvaluationResultUncheckedUpdateWithoutEvaluationTemplateInputSchema: z.ZodType<Prisma.EvaluationResultUncheckedUpdateWithoutEvaluationTemplateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  callId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evaluationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  success: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => EvalResultTypeSchema),z.lazy(() => EnumEvalResultTypeFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EvaluationResultUncheckedUpdateManyWithoutEvaluationTemplateInputSchema: z.ZodType<Prisma.EvaluationResultUncheckedUpdateManyWithoutEvaluationTemplateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  callId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evaluationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  success: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => EvalResultTypeSchema),z.lazy(() => EnumEvalResultTypeFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EvaluationUpdateWithoutEvaluationTemplateInputSchema: z.ZodType<Prisma.EvaluationUpdateWithoutEvaluationTemplateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isCritical: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  params: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  scenario: z.lazy(() => ScenarioUpdateOneWithoutEvaluationsNestedInputSchema).optional(),
  evaluationGroup: z.lazy(() => EvaluationGroupUpdateOneWithoutEvaluationsNestedInputSchema).optional(),
  evaluationResults: z.lazy(() => EvaluationResultUpdateManyWithoutEvaluationNestedInputSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationUpdateManyWithoutEvaluationNestedInputSchema).optional()
}).strict();

export const EvaluationUncheckedUpdateWithoutEvaluationTemplateInputSchema: z.ZodType<Prisma.EvaluationUncheckedUpdateWithoutEvaluationTemplateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isCritical: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  params: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  scenarioId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evaluationGroupId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evaluationResults: z.lazy(() => EvaluationResultUncheckedUpdateManyWithoutEvaluationNestedInputSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationUncheckedUpdateManyWithoutEvaluationNestedInputSchema).optional()
}).strict();

export const EvaluationUncheckedUpdateManyWithoutEvaluationTemplateInputSchema: z.ZodType<Prisma.EvaluationUncheckedUpdateManyWithoutEvaluationTemplateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isCritical: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  params: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  scenarioId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evaluationGroupId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const EvaluationResultCreateManyEvaluationInputSchema: z.ZodType<Prisma.EvaluationResultCreateManyEvaluationInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  callId: z.string().optional().nullable(),
  result: z.string(),
  success: z.boolean(),
  secondsFromStart: z.number().optional().nullable(),
  duration: z.number().optional().nullable(),
  type: z.lazy(() => EvalResultTypeSchema),
  details: z.string(),
  evaluationTemplateId: z.string().optional().nullable()
}).strict();

export const GeneralEvaluationCreateManyEvaluationInputSchema: z.ZodType<Prisma.GeneralEvaluationCreateManyEvaluationInput> = z.object({
  id: z.string().optional(),
  agentId: z.string()
}).strict();

export const EvaluationResultUpdateWithoutEvaluationInputSchema: z.ZodType<Prisma.EvaluationResultUpdateWithoutEvaluationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  success: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => EvalResultTypeSchema),z.lazy(() => EnumEvalResultTypeFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  call: z.lazy(() => CallUpdateOneWithoutEvaluationResultsNestedInputSchema).optional(),
  evaluationTemplate: z.lazy(() => EvaluationTemplateUpdateOneWithoutEvaluationResultsNestedInputSchema).optional()
}).strict();

export const EvaluationResultUncheckedUpdateWithoutEvaluationInputSchema: z.ZodType<Prisma.EvaluationResultUncheckedUpdateWithoutEvaluationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  callId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  result: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  success: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => EvalResultTypeSchema),z.lazy(() => EnumEvalResultTypeFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  evaluationTemplateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const EvaluationResultUncheckedUpdateManyWithoutEvaluationInputSchema: z.ZodType<Prisma.EvaluationResultUncheckedUpdateManyWithoutEvaluationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  callId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  result: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  success: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  secondsFromStart: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  duration: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => EvalResultTypeSchema),z.lazy(() => EnumEvalResultTypeFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  evaluationTemplateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const GeneralEvaluationUpdateWithoutEvaluationInputSchema: z.ZodType<Prisma.GeneralEvaluationUpdateWithoutEvaluationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  agent: z.lazy(() => AgentUpdateOneRequiredWithoutGeneralEvaluationsNestedInputSchema).optional()
}).strict();

export const GeneralEvaluationUncheckedUpdateWithoutEvaluationInputSchema: z.ZodType<Prisma.GeneralEvaluationUncheckedUpdateWithoutEvaluationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  agentId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const GeneralEvaluationUncheckedUpdateManyWithoutEvaluationInputSchema: z.ZodType<Prisma.GeneralEvaluationUncheckedUpdateManyWithoutEvaluationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  agentId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EvaluationCreateManyEvaluationGroupInputSchema: z.ZodType<Prisma.EvaluationCreateManyEvaluationGroupInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  enabled: z.boolean().optional(),
  isCritical: z.boolean().optional(),
  params: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationTemplateId: z.string(),
  scenarioId: z.string().optional().nullable()
}).strict();

export const EvaluationUpdateWithoutEvaluationGroupInputSchema: z.ZodType<Prisma.EvaluationUpdateWithoutEvaluationGroupInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isCritical: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  params: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationTemplate: z.lazy(() => EvaluationTemplateUpdateOneRequiredWithoutEvaluationsNestedInputSchema).optional(),
  scenario: z.lazy(() => ScenarioUpdateOneWithoutEvaluationsNestedInputSchema).optional(),
  evaluationResults: z.lazy(() => EvaluationResultUpdateManyWithoutEvaluationNestedInputSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationUpdateManyWithoutEvaluationNestedInputSchema).optional()
}).strict();

export const EvaluationUncheckedUpdateWithoutEvaluationGroupInputSchema: z.ZodType<Prisma.EvaluationUncheckedUpdateWithoutEvaluationGroupInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isCritical: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  params: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationTemplateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  scenarioId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evaluationResults: z.lazy(() => EvaluationResultUncheckedUpdateManyWithoutEvaluationNestedInputSchema).optional(),
  generalEvaluations: z.lazy(() => GeneralEvaluationUncheckedUpdateManyWithoutEvaluationNestedInputSchema).optional()
}).strict();

export const EvaluationUncheckedUpdateManyWithoutEvaluationGroupInputSchema: z.ZodType<Prisma.EvaluationUncheckedUpdateManyWithoutEvaluationGroupInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isCritical: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  params: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  evaluationTemplateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  scenarioId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const EvaluationGroupCreateManySavedSearchInputSchema: z.ZodType<Prisma.EvaluationGroupCreateManySavedSearchInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  ownerId: z.string(),
  name: z.string(),
  condition: z.string().optional(),
  enabled: z.boolean().optional()
}).strict();

export const AlertCreateManySavedSearchInputSchema: z.ZodType<Prisma.AlertCreateManySavedSearchInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  ownerId: z.string(),
  name: z.string(),
  type: z.lazy(() => AlertTypeSchema),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  enabled: z.boolean().optional()
}).strict();

export const EvaluationGroupUpdateWithoutSavedSearchInputSchema: z.ZodType<Prisma.EvaluationGroupUpdateWithoutSavedSearchInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  condition: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  evaluations: z.lazy(() => EvaluationUpdateManyWithoutEvaluationGroupNestedInputSchema).optional()
}).strict();

export const EvaluationGroupUncheckedUpdateWithoutSavedSearchInputSchema: z.ZodType<Prisma.EvaluationGroupUncheckedUpdateWithoutSavedSearchInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  condition: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  evaluations: z.lazy(() => EvaluationUncheckedUpdateManyWithoutEvaluationGroupNestedInputSchema).optional()
}).strict();

export const EvaluationGroupUncheckedUpdateManyWithoutSavedSearchInputSchema: z.ZodType<Prisma.EvaluationGroupUncheckedUpdateManyWithoutSavedSearchInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  condition: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AlertUpdateWithoutSavedSearchInputSchema: z.ZodType<Prisma.AlertUpdateWithoutSavedSearchInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => AlertTypeSchema),z.lazy(() => EnumAlertTypeFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AlertUncheckedUpdateWithoutSavedSearchInputSchema: z.ZodType<Prisma.AlertUncheckedUpdateWithoutSavedSearchInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => AlertTypeSchema),z.lazy(() => EnumAlertTypeFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AlertUncheckedUpdateManyWithoutSavedSearchInputSchema: z.ZodType<Prisma.AlertUncheckedUpdateManyWithoutSavedSearchInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => AlertTypeSchema),z.lazy(() => EnumAlertTypeFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const ApiKeyFindFirstArgsSchema: z.ZodType<Prisma.ApiKeyFindFirstArgs> = z.object({
  select: ApiKeySelectSchema.optional(),
  where: ApiKeyWhereInputSchema.optional(),
  orderBy: z.union([ ApiKeyOrderByWithRelationInputSchema.array(),ApiKeyOrderByWithRelationInputSchema ]).optional(),
  cursor: ApiKeyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ApiKeyScalarFieldEnumSchema,ApiKeyScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ApiKeyFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ApiKeyFindFirstOrThrowArgs> = z.object({
  select: ApiKeySelectSchema.optional(),
  where: ApiKeyWhereInputSchema.optional(),
  orderBy: z.union([ ApiKeyOrderByWithRelationInputSchema.array(),ApiKeyOrderByWithRelationInputSchema ]).optional(),
  cursor: ApiKeyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ApiKeyScalarFieldEnumSchema,ApiKeyScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ApiKeyFindManyArgsSchema: z.ZodType<Prisma.ApiKeyFindManyArgs> = z.object({
  select: ApiKeySelectSchema.optional(),
  where: ApiKeyWhereInputSchema.optional(),
  orderBy: z.union([ ApiKeyOrderByWithRelationInputSchema.array(),ApiKeyOrderByWithRelationInputSchema ]).optional(),
  cursor: ApiKeyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ApiKeyScalarFieldEnumSchema,ApiKeyScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ApiKeyAggregateArgsSchema: z.ZodType<Prisma.ApiKeyAggregateArgs> = z.object({
  where: ApiKeyWhereInputSchema.optional(),
  orderBy: z.union([ ApiKeyOrderByWithRelationInputSchema.array(),ApiKeyOrderByWithRelationInputSchema ]).optional(),
  cursor: ApiKeyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ApiKeyGroupByArgsSchema: z.ZodType<Prisma.ApiKeyGroupByArgs> = z.object({
  where: ApiKeyWhereInputSchema.optional(),
  orderBy: z.union([ ApiKeyOrderByWithAggregationInputSchema.array(),ApiKeyOrderByWithAggregationInputSchema ]).optional(),
  by: ApiKeyScalarFieldEnumSchema.array(),
  having: ApiKeyScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ApiKeyFindUniqueArgsSchema: z.ZodType<Prisma.ApiKeyFindUniqueArgs> = z.object({
  select: ApiKeySelectSchema.optional(),
  where: ApiKeyWhereUniqueInputSchema,
}).strict() ;

export const ApiKeyFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ApiKeyFindUniqueOrThrowArgs> = z.object({
  select: ApiKeySelectSchema.optional(),
  where: ApiKeyWhereUniqueInputSchema,
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

export const CallRecordingFindFirstArgsSchema: z.ZodType<Prisma.CallRecordingFindFirstArgs> = z.object({
  select: CallRecordingSelectSchema.optional(),
  where: CallRecordingWhereInputSchema.optional(),
  orderBy: z.union([ CallRecordingOrderByWithRelationInputSchema.array(),CallRecordingOrderByWithRelationInputSchema ]).optional(),
  cursor: CallRecordingWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CallRecordingScalarFieldEnumSchema,CallRecordingScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CallRecordingFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CallRecordingFindFirstOrThrowArgs> = z.object({
  select: CallRecordingSelectSchema.optional(),
  where: CallRecordingWhereInputSchema.optional(),
  orderBy: z.union([ CallRecordingOrderByWithRelationInputSchema.array(),CallRecordingOrderByWithRelationInputSchema ]).optional(),
  cursor: CallRecordingWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CallRecordingScalarFieldEnumSchema,CallRecordingScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CallRecordingFindManyArgsSchema: z.ZodType<Prisma.CallRecordingFindManyArgs> = z.object({
  select: CallRecordingSelectSchema.optional(),
  where: CallRecordingWhereInputSchema.optional(),
  orderBy: z.union([ CallRecordingOrderByWithRelationInputSchema.array(),CallRecordingOrderByWithRelationInputSchema ]).optional(),
  cursor: CallRecordingWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CallRecordingScalarFieldEnumSchema,CallRecordingScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CallRecordingAggregateArgsSchema: z.ZodType<Prisma.CallRecordingAggregateArgs> = z.object({
  where: CallRecordingWhereInputSchema.optional(),
  orderBy: z.union([ CallRecordingOrderByWithRelationInputSchema.array(),CallRecordingOrderByWithRelationInputSchema ]).optional(),
  cursor: CallRecordingWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CallRecordingGroupByArgsSchema: z.ZodType<Prisma.CallRecordingGroupByArgs> = z.object({
  where: CallRecordingWhereInputSchema.optional(),
  orderBy: z.union([ CallRecordingOrderByWithAggregationInputSchema.array(),CallRecordingOrderByWithAggregationInputSchema ]).optional(),
  by: CallRecordingScalarFieldEnumSchema.array(),
  having: CallRecordingScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CallRecordingFindUniqueArgsSchema: z.ZodType<Prisma.CallRecordingFindUniqueArgs> = z.object({
  select: CallRecordingSelectSchema.optional(),
  where: CallRecordingWhereUniqueInputSchema,
}).strict() ;

export const CallRecordingFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CallRecordingFindUniqueOrThrowArgs> = z.object({
  select: CallRecordingSelectSchema.optional(),
  where: CallRecordingWhereUniqueInputSchema,
}).strict() ;

export const ScenarioFindFirstArgsSchema: z.ZodType<Prisma.ScenarioFindFirstArgs> = z.object({
  select: ScenarioSelectSchema.optional(),
  include: ScenarioIncludeSchema.optional(),
  where: ScenarioWhereInputSchema.optional(),
  orderBy: z.union([ ScenarioOrderByWithRelationInputSchema.array(),ScenarioOrderByWithRelationInputSchema ]).optional(),
  cursor: ScenarioWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ScenarioScalarFieldEnumSchema,ScenarioScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ScenarioFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ScenarioFindFirstOrThrowArgs> = z.object({
  select: ScenarioSelectSchema.optional(),
  include: ScenarioIncludeSchema.optional(),
  where: ScenarioWhereInputSchema.optional(),
  orderBy: z.union([ ScenarioOrderByWithRelationInputSchema.array(),ScenarioOrderByWithRelationInputSchema ]).optional(),
  cursor: ScenarioWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ScenarioScalarFieldEnumSchema,ScenarioScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ScenarioFindManyArgsSchema: z.ZodType<Prisma.ScenarioFindManyArgs> = z.object({
  select: ScenarioSelectSchema.optional(),
  include: ScenarioIncludeSchema.optional(),
  where: ScenarioWhereInputSchema.optional(),
  orderBy: z.union([ ScenarioOrderByWithRelationInputSchema.array(),ScenarioOrderByWithRelationInputSchema ]).optional(),
  cursor: ScenarioWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ScenarioScalarFieldEnumSchema,ScenarioScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ScenarioAggregateArgsSchema: z.ZodType<Prisma.ScenarioAggregateArgs> = z.object({
  where: ScenarioWhereInputSchema.optional(),
  orderBy: z.union([ ScenarioOrderByWithRelationInputSchema.array(),ScenarioOrderByWithRelationInputSchema ]).optional(),
  cursor: ScenarioWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ScenarioGroupByArgsSchema: z.ZodType<Prisma.ScenarioGroupByArgs> = z.object({
  where: ScenarioWhereInputSchema.optional(),
  orderBy: z.union([ ScenarioOrderByWithAggregationInputSchema.array(),ScenarioOrderByWithAggregationInputSchema ]).optional(),
  by: ScenarioScalarFieldEnumSchema.array(),
  having: ScenarioScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ScenarioFindUniqueArgsSchema: z.ZodType<Prisma.ScenarioFindUniqueArgs> = z.object({
  select: ScenarioSelectSchema.optional(),
  include: ScenarioIncludeSchema.optional(),
  where: ScenarioWhereUniqueInputSchema,
}).strict() ;

export const ScenarioFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ScenarioFindUniqueOrThrowArgs> = z.object({
  select: ScenarioSelectSchema.optional(),
  include: ScenarioIncludeSchema.optional(),
  where: ScenarioWhereUniqueInputSchema,
}).strict() ;

export const EvaluationTemplateFindFirstArgsSchema: z.ZodType<Prisma.EvaluationTemplateFindFirstArgs> = z.object({
  select: EvaluationTemplateSelectSchema.optional(),
  include: EvaluationTemplateIncludeSchema.optional(),
  where: EvaluationTemplateWhereInputSchema.optional(),
  orderBy: z.union([ EvaluationTemplateOrderByWithRelationInputSchema.array(),EvaluationTemplateOrderByWithRelationInputSchema ]).optional(),
  cursor: EvaluationTemplateWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvaluationTemplateScalarFieldEnumSchema,EvaluationTemplateScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EvaluationTemplateFindFirstOrThrowArgsSchema: z.ZodType<Prisma.EvaluationTemplateFindFirstOrThrowArgs> = z.object({
  select: EvaluationTemplateSelectSchema.optional(),
  include: EvaluationTemplateIncludeSchema.optional(),
  where: EvaluationTemplateWhereInputSchema.optional(),
  orderBy: z.union([ EvaluationTemplateOrderByWithRelationInputSchema.array(),EvaluationTemplateOrderByWithRelationInputSchema ]).optional(),
  cursor: EvaluationTemplateWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvaluationTemplateScalarFieldEnumSchema,EvaluationTemplateScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EvaluationTemplateFindManyArgsSchema: z.ZodType<Prisma.EvaluationTemplateFindManyArgs> = z.object({
  select: EvaluationTemplateSelectSchema.optional(),
  include: EvaluationTemplateIncludeSchema.optional(),
  where: EvaluationTemplateWhereInputSchema.optional(),
  orderBy: z.union([ EvaluationTemplateOrderByWithRelationInputSchema.array(),EvaluationTemplateOrderByWithRelationInputSchema ]).optional(),
  cursor: EvaluationTemplateWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvaluationTemplateScalarFieldEnumSchema,EvaluationTemplateScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EvaluationTemplateAggregateArgsSchema: z.ZodType<Prisma.EvaluationTemplateAggregateArgs> = z.object({
  where: EvaluationTemplateWhereInputSchema.optional(),
  orderBy: z.union([ EvaluationTemplateOrderByWithRelationInputSchema.array(),EvaluationTemplateOrderByWithRelationInputSchema ]).optional(),
  cursor: EvaluationTemplateWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EvaluationTemplateGroupByArgsSchema: z.ZodType<Prisma.EvaluationTemplateGroupByArgs> = z.object({
  where: EvaluationTemplateWhereInputSchema.optional(),
  orderBy: z.union([ EvaluationTemplateOrderByWithAggregationInputSchema.array(),EvaluationTemplateOrderByWithAggregationInputSchema ]).optional(),
  by: EvaluationTemplateScalarFieldEnumSchema.array(),
  having: EvaluationTemplateScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EvaluationTemplateFindUniqueArgsSchema: z.ZodType<Prisma.EvaluationTemplateFindUniqueArgs> = z.object({
  select: EvaluationTemplateSelectSchema.optional(),
  include: EvaluationTemplateIncludeSchema.optional(),
  where: EvaluationTemplateWhereUniqueInputSchema,
}).strict() ;

export const EvaluationTemplateFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.EvaluationTemplateFindUniqueOrThrowArgs> = z.object({
  select: EvaluationTemplateSelectSchema.optional(),
  include: EvaluationTemplateIncludeSchema.optional(),
  where: EvaluationTemplateWhereUniqueInputSchema,
}).strict() ;

export const GeneralEvaluationFindFirstArgsSchema: z.ZodType<Prisma.GeneralEvaluationFindFirstArgs> = z.object({
  select: GeneralEvaluationSelectSchema.optional(),
  include: GeneralEvaluationIncludeSchema.optional(),
  where: GeneralEvaluationWhereInputSchema.optional(),
  orderBy: z.union([ GeneralEvaluationOrderByWithRelationInputSchema.array(),GeneralEvaluationOrderByWithRelationInputSchema ]).optional(),
  cursor: GeneralEvaluationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ GeneralEvaluationScalarFieldEnumSchema,GeneralEvaluationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const GeneralEvaluationFindFirstOrThrowArgsSchema: z.ZodType<Prisma.GeneralEvaluationFindFirstOrThrowArgs> = z.object({
  select: GeneralEvaluationSelectSchema.optional(),
  include: GeneralEvaluationIncludeSchema.optional(),
  where: GeneralEvaluationWhereInputSchema.optional(),
  orderBy: z.union([ GeneralEvaluationOrderByWithRelationInputSchema.array(),GeneralEvaluationOrderByWithRelationInputSchema ]).optional(),
  cursor: GeneralEvaluationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ GeneralEvaluationScalarFieldEnumSchema,GeneralEvaluationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const GeneralEvaluationFindManyArgsSchema: z.ZodType<Prisma.GeneralEvaluationFindManyArgs> = z.object({
  select: GeneralEvaluationSelectSchema.optional(),
  include: GeneralEvaluationIncludeSchema.optional(),
  where: GeneralEvaluationWhereInputSchema.optional(),
  orderBy: z.union([ GeneralEvaluationOrderByWithRelationInputSchema.array(),GeneralEvaluationOrderByWithRelationInputSchema ]).optional(),
  cursor: GeneralEvaluationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ GeneralEvaluationScalarFieldEnumSchema,GeneralEvaluationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const GeneralEvaluationAggregateArgsSchema: z.ZodType<Prisma.GeneralEvaluationAggregateArgs> = z.object({
  where: GeneralEvaluationWhereInputSchema.optional(),
  orderBy: z.union([ GeneralEvaluationOrderByWithRelationInputSchema.array(),GeneralEvaluationOrderByWithRelationInputSchema ]).optional(),
  cursor: GeneralEvaluationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const GeneralEvaluationGroupByArgsSchema: z.ZodType<Prisma.GeneralEvaluationGroupByArgs> = z.object({
  where: GeneralEvaluationWhereInputSchema.optional(),
  orderBy: z.union([ GeneralEvaluationOrderByWithAggregationInputSchema.array(),GeneralEvaluationOrderByWithAggregationInputSchema ]).optional(),
  by: GeneralEvaluationScalarFieldEnumSchema.array(),
  having: GeneralEvaluationScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const GeneralEvaluationFindUniqueArgsSchema: z.ZodType<Prisma.GeneralEvaluationFindUniqueArgs> = z.object({
  select: GeneralEvaluationSelectSchema.optional(),
  include: GeneralEvaluationIncludeSchema.optional(),
  where: GeneralEvaluationWhereUniqueInputSchema,
}).strict() ;

export const GeneralEvaluationFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.GeneralEvaluationFindUniqueOrThrowArgs> = z.object({
  select: GeneralEvaluationSelectSchema.optional(),
  include: GeneralEvaluationIncludeSchema.optional(),
  where: GeneralEvaluationWhereUniqueInputSchema,
}).strict() ;

export const EvaluationFindFirstArgsSchema: z.ZodType<Prisma.EvaluationFindFirstArgs> = z.object({
  select: EvaluationSelectSchema.optional(),
  include: EvaluationIncludeSchema.optional(),
  where: EvaluationWhereInputSchema.optional(),
  orderBy: z.union([ EvaluationOrderByWithRelationInputSchema.array(),EvaluationOrderByWithRelationInputSchema ]).optional(),
  cursor: EvaluationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvaluationScalarFieldEnumSchema,EvaluationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EvaluationFindFirstOrThrowArgsSchema: z.ZodType<Prisma.EvaluationFindFirstOrThrowArgs> = z.object({
  select: EvaluationSelectSchema.optional(),
  include: EvaluationIncludeSchema.optional(),
  where: EvaluationWhereInputSchema.optional(),
  orderBy: z.union([ EvaluationOrderByWithRelationInputSchema.array(),EvaluationOrderByWithRelationInputSchema ]).optional(),
  cursor: EvaluationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvaluationScalarFieldEnumSchema,EvaluationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EvaluationFindManyArgsSchema: z.ZodType<Prisma.EvaluationFindManyArgs> = z.object({
  select: EvaluationSelectSchema.optional(),
  include: EvaluationIncludeSchema.optional(),
  where: EvaluationWhereInputSchema.optional(),
  orderBy: z.union([ EvaluationOrderByWithRelationInputSchema.array(),EvaluationOrderByWithRelationInputSchema ]).optional(),
  cursor: EvaluationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvaluationScalarFieldEnumSchema,EvaluationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EvaluationAggregateArgsSchema: z.ZodType<Prisma.EvaluationAggregateArgs> = z.object({
  where: EvaluationWhereInputSchema.optional(),
  orderBy: z.union([ EvaluationOrderByWithRelationInputSchema.array(),EvaluationOrderByWithRelationInputSchema ]).optional(),
  cursor: EvaluationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EvaluationGroupByArgsSchema: z.ZodType<Prisma.EvaluationGroupByArgs> = z.object({
  where: EvaluationWhereInputSchema.optional(),
  orderBy: z.union([ EvaluationOrderByWithAggregationInputSchema.array(),EvaluationOrderByWithAggregationInputSchema ]).optional(),
  by: EvaluationScalarFieldEnumSchema.array(),
  having: EvaluationScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EvaluationFindUniqueArgsSchema: z.ZodType<Prisma.EvaluationFindUniqueArgs> = z.object({
  select: EvaluationSelectSchema.optional(),
  include: EvaluationIncludeSchema.optional(),
  where: EvaluationWhereUniqueInputSchema,
}).strict() ;

export const EvaluationFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.EvaluationFindUniqueOrThrowArgs> = z.object({
  select: EvaluationSelectSchema.optional(),
  include: EvaluationIncludeSchema.optional(),
  where: EvaluationWhereUniqueInputSchema,
}).strict() ;

export const EvaluationResultFindFirstArgsSchema: z.ZodType<Prisma.EvaluationResultFindFirstArgs> = z.object({
  select: EvaluationResultSelectSchema.optional(),
  include: EvaluationResultIncludeSchema.optional(),
  where: EvaluationResultWhereInputSchema.optional(),
  orderBy: z.union([ EvaluationResultOrderByWithRelationInputSchema.array(),EvaluationResultOrderByWithRelationInputSchema ]).optional(),
  cursor: EvaluationResultWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvaluationResultScalarFieldEnumSchema,EvaluationResultScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EvaluationResultFindFirstOrThrowArgsSchema: z.ZodType<Prisma.EvaluationResultFindFirstOrThrowArgs> = z.object({
  select: EvaluationResultSelectSchema.optional(),
  include: EvaluationResultIncludeSchema.optional(),
  where: EvaluationResultWhereInputSchema.optional(),
  orderBy: z.union([ EvaluationResultOrderByWithRelationInputSchema.array(),EvaluationResultOrderByWithRelationInputSchema ]).optional(),
  cursor: EvaluationResultWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvaluationResultScalarFieldEnumSchema,EvaluationResultScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EvaluationResultFindManyArgsSchema: z.ZodType<Prisma.EvaluationResultFindManyArgs> = z.object({
  select: EvaluationResultSelectSchema.optional(),
  include: EvaluationResultIncludeSchema.optional(),
  where: EvaluationResultWhereInputSchema.optional(),
  orderBy: z.union([ EvaluationResultOrderByWithRelationInputSchema.array(),EvaluationResultOrderByWithRelationInputSchema ]).optional(),
  cursor: EvaluationResultWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvaluationResultScalarFieldEnumSchema,EvaluationResultScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EvaluationResultAggregateArgsSchema: z.ZodType<Prisma.EvaluationResultAggregateArgs> = z.object({
  where: EvaluationResultWhereInputSchema.optional(),
  orderBy: z.union([ EvaluationResultOrderByWithRelationInputSchema.array(),EvaluationResultOrderByWithRelationInputSchema ]).optional(),
  cursor: EvaluationResultWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EvaluationResultGroupByArgsSchema: z.ZodType<Prisma.EvaluationResultGroupByArgs> = z.object({
  where: EvaluationResultWhereInputSchema.optional(),
  orderBy: z.union([ EvaluationResultOrderByWithAggregationInputSchema.array(),EvaluationResultOrderByWithAggregationInputSchema ]).optional(),
  by: EvaluationResultScalarFieldEnumSchema.array(),
  having: EvaluationResultScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EvaluationResultFindUniqueArgsSchema: z.ZodType<Prisma.EvaluationResultFindUniqueArgs> = z.object({
  select: EvaluationResultSelectSchema.optional(),
  include: EvaluationResultIncludeSchema.optional(),
  where: EvaluationResultWhereUniqueInputSchema,
}).strict() ;

export const EvaluationResultFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.EvaluationResultFindUniqueOrThrowArgs> = z.object({
  select: EvaluationResultSelectSchema.optional(),
  include: EvaluationResultIncludeSchema.optional(),
  where: EvaluationResultWhereUniqueInputSchema,
}).strict() ;

export const LatencyBlockFindFirstArgsSchema: z.ZodType<Prisma.LatencyBlockFindFirstArgs> = z.object({
  select: LatencyBlockSelectSchema.optional(),
  include: LatencyBlockIncludeSchema.optional(),
  where: LatencyBlockWhereInputSchema.optional(),
  orderBy: z.union([ LatencyBlockOrderByWithRelationInputSchema.array(),LatencyBlockOrderByWithRelationInputSchema ]).optional(),
  cursor: LatencyBlockWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LatencyBlockScalarFieldEnumSchema,LatencyBlockScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const LatencyBlockFindFirstOrThrowArgsSchema: z.ZodType<Prisma.LatencyBlockFindFirstOrThrowArgs> = z.object({
  select: LatencyBlockSelectSchema.optional(),
  include: LatencyBlockIncludeSchema.optional(),
  where: LatencyBlockWhereInputSchema.optional(),
  orderBy: z.union([ LatencyBlockOrderByWithRelationInputSchema.array(),LatencyBlockOrderByWithRelationInputSchema ]).optional(),
  cursor: LatencyBlockWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LatencyBlockScalarFieldEnumSchema,LatencyBlockScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const LatencyBlockFindManyArgsSchema: z.ZodType<Prisma.LatencyBlockFindManyArgs> = z.object({
  select: LatencyBlockSelectSchema.optional(),
  include: LatencyBlockIncludeSchema.optional(),
  where: LatencyBlockWhereInputSchema.optional(),
  orderBy: z.union([ LatencyBlockOrderByWithRelationInputSchema.array(),LatencyBlockOrderByWithRelationInputSchema ]).optional(),
  cursor: LatencyBlockWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LatencyBlockScalarFieldEnumSchema,LatencyBlockScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const LatencyBlockAggregateArgsSchema: z.ZodType<Prisma.LatencyBlockAggregateArgs> = z.object({
  where: LatencyBlockWhereInputSchema.optional(),
  orderBy: z.union([ LatencyBlockOrderByWithRelationInputSchema.array(),LatencyBlockOrderByWithRelationInputSchema ]).optional(),
  cursor: LatencyBlockWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const LatencyBlockGroupByArgsSchema: z.ZodType<Prisma.LatencyBlockGroupByArgs> = z.object({
  where: LatencyBlockWhereInputSchema.optional(),
  orderBy: z.union([ LatencyBlockOrderByWithAggregationInputSchema.array(),LatencyBlockOrderByWithAggregationInputSchema ]).optional(),
  by: LatencyBlockScalarFieldEnumSchema.array(),
  having: LatencyBlockScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const LatencyBlockFindUniqueArgsSchema: z.ZodType<Prisma.LatencyBlockFindUniqueArgs> = z.object({
  select: LatencyBlockSelectSchema.optional(),
  include: LatencyBlockIncludeSchema.optional(),
  where: LatencyBlockWhereUniqueInputSchema,
}).strict() ;

export const LatencyBlockFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.LatencyBlockFindUniqueOrThrowArgs> = z.object({
  select: LatencyBlockSelectSchema.optional(),
  include: LatencyBlockIncludeSchema.optional(),
  where: LatencyBlockWhereUniqueInputSchema,
}).strict() ;

export const InterruptionFindFirstArgsSchema: z.ZodType<Prisma.InterruptionFindFirstArgs> = z.object({
  select: InterruptionSelectSchema.optional(),
  include: InterruptionIncludeSchema.optional(),
  where: InterruptionWhereInputSchema.optional(),
  orderBy: z.union([ InterruptionOrderByWithRelationInputSchema.array(),InterruptionOrderByWithRelationInputSchema ]).optional(),
  cursor: InterruptionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ InterruptionScalarFieldEnumSchema,InterruptionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const InterruptionFindFirstOrThrowArgsSchema: z.ZodType<Prisma.InterruptionFindFirstOrThrowArgs> = z.object({
  select: InterruptionSelectSchema.optional(),
  include: InterruptionIncludeSchema.optional(),
  where: InterruptionWhereInputSchema.optional(),
  orderBy: z.union([ InterruptionOrderByWithRelationInputSchema.array(),InterruptionOrderByWithRelationInputSchema ]).optional(),
  cursor: InterruptionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ InterruptionScalarFieldEnumSchema,InterruptionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const InterruptionFindManyArgsSchema: z.ZodType<Prisma.InterruptionFindManyArgs> = z.object({
  select: InterruptionSelectSchema.optional(),
  include: InterruptionIncludeSchema.optional(),
  where: InterruptionWhereInputSchema.optional(),
  orderBy: z.union([ InterruptionOrderByWithRelationInputSchema.array(),InterruptionOrderByWithRelationInputSchema ]).optional(),
  cursor: InterruptionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ InterruptionScalarFieldEnumSchema,InterruptionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const InterruptionAggregateArgsSchema: z.ZodType<Prisma.InterruptionAggregateArgs> = z.object({
  where: InterruptionWhereInputSchema.optional(),
  orderBy: z.union([ InterruptionOrderByWithRelationInputSchema.array(),InterruptionOrderByWithRelationInputSchema ]).optional(),
  cursor: InterruptionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const InterruptionGroupByArgsSchema: z.ZodType<Prisma.InterruptionGroupByArgs> = z.object({
  where: InterruptionWhereInputSchema.optional(),
  orderBy: z.union([ InterruptionOrderByWithAggregationInputSchema.array(),InterruptionOrderByWithAggregationInputSchema ]).optional(),
  by: InterruptionScalarFieldEnumSchema.array(),
  having: InterruptionScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const InterruptionFindUniqueArgsSchema: z.ZodType<Prisma.InterruptionFindUniqueArgs> = z.object({
  select: InterruptionSelectSchema.optional(),
  include: InterruptionIncludeSchema.optional(),
  where: InterruptionWhereUniqueInputSchema,
}).strict() ;

export const InterruptionFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.InterruptionFindUniqueOrThrowArgs> = z.object({
  select: InterruptionSelectSchema.optional(),
  include: InterruptionIncludeSchema.optional(),
  where: InterruptionWhereUniqueInputSchema,
}).strict() ;

export const EvaluationGroupFindFirstArgsSchema: z.ZodType<Prisma.EvaluationGroupFindFirstArgs> = z.object({
  select: EvaluationGroupSelectSchema.optional(),
  include: EvaluationGroupIncludeSchema.optional(),
  where: EvaluationGroupWhereInputSchema.optional(),
  orderBy: z.union([ EvaluationGroupOrderByWithRelationInputSchema.array(),EvaluationGroupOrderByWithRelationInputSchema ]).optional(),
  cursor: EvaluationGroupWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvaluationGroupScalarFieldEnumSchema,EvaluationGroupScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EvaluationGroupFindFirstOrThrowArgsSchema: z.ZodType<Prisma.EvaluationGroupFindFirstOrThrowArgs> = z.object({
  select: EvaluationGroupSelectSchema.optional(),
  include: EvaluationGroupIncludeSchema.optional(),
  where: EvaluationGroupWhereInputSchema.optional(),
  orderBy: z.union([ EvaluationGroupOrderByWithRelationInputSchema.array(),EvaluationGroupOrderByWithRelationInputSchema ]).optional(),
  cursor: EvaluationGroupWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvaluationGroupScalarFieldEnumSchema,EvaluationGroupScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EvaluationGroupFindManyArgsSchema: z.ZodType<Prisma.EvaluationGroupFindManyArgs> = z.object({
  select: EvaluationGroupSelectSchema.optional(),
  include: EvaluationGroupIncludeSchema.optional(),
  where: EvaluationGroupWhereInputSchema.optional(),
  orderBy: z.union([ EvaluationGroupOrderByWithRelationInputSchema.array(),EvaluationGroupOrderByWithRelationInputSchema ]).optional(),
  cursor: EvaluationGroupWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvaluationGroupScalarFieldEnumSchema,EvaluationGroupScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EvaluationGroupAggregateArgsSchema: z.ZodType<Prisma.EvaluationGroupAggregateArgs> = z.object({
  where: EvaluationGroupWhereInputSchema.optional(),
  orderBy: z.union([ EvaluationGroupOrderByWithRelationInputSchema.array(),EvaluationGroupOrderByWithRelationInputSchema ]).optional(),
  cursor: EvaluationGroupWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EvaluationGroupGroupByArgsSchema: z.ZodType<Prisma.EvaluationGroupGroupByArgs> = z.object({
  where: EvaluationGroupWhereInputSchema.optional(),
  orderBy: z.union([ EvaluationGroupOrderByWithAggregationInputSchema.array(),EvaluationGroupOrderByWithAggregationInputSchema ]).optional(),
  by: EvaluationGroupScalarFieldEnumSchema.array(),
  having: EvaluationGroupScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EvaluationGroupFindUniqueArgsSchema: z.ZodType<Prisma.EvaluationGroupFindUniqueArgs> = z.object({
  select: EvaluationGroupSelectSchema.optional(),
  include: EvaluationGroupIncludeSchema.optional(),
  where: EvaluationGroupWhereUniqueInputSchema,
}).strict() ;

export const EvaluationGroupFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.EvaluationGroupFindUniqueOrThrowArgs> = z.object({
  select: EvaluationGroupSelectSchema.optional(),
  include: EvaluationGroupIncludeSchema.optional(),
  where: EvaluationGroupWhereUniqueInputSchema,
}).strict() ;

export const SavedSearchFindFirstArgsSchema: z.ZodType<Prisma.SavedSearchFindFirstArgs> = z.object({
  select: SavedSearchSelectSchema.optional(),
  include: SavedSearchIncludeSchema.optional(),
  where: SavedSearchWhereInputSchema.optional(),
  orderBy: z.union([ SavedSearchOrderByWithRelationInputSchema.array(),SavedSearchOrderByWithRelationInputSchema ]).optional(),
  cursor: SavedSearchWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SavedSearchScalarFieldEnumSchema,SavedSearchScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SavedSearchFindFirstOrThrowArgsSchema: z.ZodType<Prisma.SavedSearchFindFirstOrThrowArgs> = z.object({
  select: SavedSearchSelectSchema.optional(),
  include: SavedSearchIncludeSchema.optional(),
  where: SavedSearchWhereInputSchema.optional(),
  orderBy: z.union([ SavedSearchOrderByWithRelationInputSchema.array(),SavedSearchOrderByWithRelationInputSchema ]).optional(),
  cursor: SavedSearchWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SavedSearchScalarFieldEnumSchema,SavedSearchScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SavedSearchFindManyArgsSchema: z.ZodType<Prisma.SavedSearchFindManyArgs> = z.object({
  select: SavedSearchSelectSchema.optional(),
  include: SavedSearchIncludeSchema.optional(),
  where: SavedSearchWhereInputSchema.optional(),
  orderBy: z.union([ SavedSearchOrderByWithRelationInputSchema.array(),SavedSearchOrderByWithRelationInputSchema ]).optional(),
  cursor: SavedSearchWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SavedSearchScalarFieldEnumSchema,SavedSearchScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SavedSearchAggregateArgsSchema: z.ZodType<Prisma.SavedSearchAggregateArgs> = z.object({
  where: SavedSearchWhereInputSchema.optional(),
  orderBy: z.union([ SavedSearchOrderByWithRelationInputSchema.array(),SavedSearchOrderByWithRelationInputSchema ]).optional(),
  cursor: SavedSearchWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const SavedSearchGroupByArgsSchema: z.ZodType<Prisma.SavedSearchGroupByArgs> = z.object({
  where: SavedSearchWhereInputSchema.optional(),
  orderBy: z.union([ SavedSearchOrderByWithAggregationInputSchema.array(),SavedSearchOrderByWithAggregationInputSchema ]).optional(),
  by: SavedSearchScalarFieldEnumSchema.array(),
  having: SavedSearchScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const SavedSearchFindUniqueArgsSchema: z.ZodType<Prisma.SavedSearchFindUniqueArgs> = z.object({
  select: SavedSearchSelectSchema.optional(),
  include: SavedSearchIncludeSchema.optional(),
  where: SavedSearchWhereUniqueInputSchema,
}).strict() ;

export const SavedSearchFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.SavedSearchFindUniqueOrThrowArgs> = z.object({
  select: SavedSearchSelectSchema.optional(),
  include: SavedSearchIncludeSchema.optional(),
  where: SavedSearchWhereUniqueInputSchema,
}).strict() ;

export const AlertFindFirstArgsSchema: z.ZodType<Prisma.AlertFindFirstArgs> = z.object({
  select: AlertSelectSchema.optional(),
  include: AlertIncludeSchema.optional(),
  where: AlertWhereInputSchema.optional(),
  orderBy: z.union([ AlertOrderByWithRelationInputSchema.array(),AlertOrderByWithRelationInputSchema ]).optional(),
  cursor: AlertWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AlertScalarFieldEnumSchema,AlertScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AlertFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AlertFindFirstOrThrowArgs> = z.object({
  select: AlertSelectSchema.optional(),
  include: AlertIncludeSchema.optional(),
  where: AlertWhereInputSchema.optional(),
  orderBy: z.union([ AlertOrderByWithRelationInputSchema.array(),AlertOrderByWithRelationInputSchema ]).optional(),
  cursor: AlertWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AlertScalarFieldEnumSchema,AlertScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AlertFindManyArgsSchema: z.ZodType<Prisma.AlertFindManyArgs> = z.object({
  select: AlertSelectSchema.optional(),
  include: AlertIncludeSchema.optional(),
  where: AlertWhereInputSchema.optional(),
  orderBy: z.union([ AlertOrderByWithRelationInputSchema.array(),AlertOrderByWithRelationInputSchema ]).optional(),
  cursor: AlertWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AlertScalarFieldEnumSchema,AlertScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AlertAggregateArgsSchema: z.ZodType<Prisma.AlertAggregateArgs> = z.object({
  where: AlertWhereInputSchema.optional(),
  orderBy: z.union([ AlertOrderByWithRelationInputSchema.array(),AlertOrderByWithRelationInputSchema ]).optional(),
  cursor: AlertWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AlertGroupByArgsSchema: z.ZodType<Prisma.AlertGroupByArgs> = z.object({
  where: AlertWhereInputSchema.optional(),
  orderBy: z.union([ AlertOrderByWithAggregationInputSchema.array(),AlertOrderByWithAggregationInputSchema ]).optional(),
  by: AlertScalarFieldEnumSchema.array(),
  having: AlertScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AlertFindUniqueArgsSchema: z.ZodType<Prisma.AlertFindUniqueArgs> = z.object({
  select: AlertSelectSchema.optional(),
  include: AlertIncludeSchema.optional(),
  where: AlertWhereUniqueInputSchema,
}).strict() ;

export const AlertFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AlertFindUniqueOrThrowArgs> = z.object({
  select: AlertSelectSchema.optional(),
  include: AlertIncludeSchema.optional(),
  where: AlertWhereUniqueInputSchema,
}).strict() ;

export const ApiKeyCreateArgsSchema: z.ZodType<Prisma.ApiKeyCreateArgs> = z.object({
  select: ApiKeySelectSchema.optional(),
  data: z.union([ ApiKeyCreateInputSchema,ApiKeyUncheckedCreateInputSchema ]),
}).strict() ;

export const ApiKeyUpsertArgsSchema: z.ZodType<Prisma.ApiKeyUpsertArgs> = z.object({
  select: ApiKeySelectSchema.optional(),
  where: ApiKeyWhereUniqueInputSchema,
  create: z.union([ ApiKeyCreateInputSchema,ApiKeyUncheckedCreateInputSchema ]),
  update: z.union([ ApiKeyUpdateInputSchema,ApiKeyUncheckedUpdateInputSchema ]),
}).strict() ;

export const ApiKeyCreateManyArgsSchema: z.ZodType<Prisma.ApiKeyCreateManyArgs> = z.object({
  data: z.union([ ApiKeyCreateManyInputSchema,ApiKeyCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ApiKeyCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ApiKeyCreateManyAndReturnArgs> = z.object({
  data: z.union([ ApiKeyCreateManyInputSchema,ApiKeyCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ApiKeyDeleteArgsSchema: z.ZodType<Prisma.ApiKeyDeleteArgs> = z.object({
  select: ApiKeySelectSchema.optional(),
  where: ApiKeyWhereUniqueInputSchema,
}).strict() ;

export const ApiKeyUpdateArgsSchema: z.ZodType<Prisma.ApiKeyUpdateArgs> = z.object({
  select: ApiKeySelectSchema.optional(),
  data: z.union([ ApiKeyUpdateInputSchema,ApiKeyUncheckedUpdateInputSchema ]),
  where: ApiKeyWhereUniqueInputSchema,
}).strict() ;

export const ApiKeyUpdateManyArgsSchema: z.ZodType<Prisma.ApiKeyUpdateManyArgs> = z.object({
  data: z.union([ ApiKeyUpdateManyMutationInputSchema,ApiKeyUncheckedUpdateManyInputSchema ]),
  where: ApiKeyWhereInputSchema.optional(),
}).strict() ;

export const ApiKeyDeleteManyArgsSchema: z.ZodType<Prisma.ApiKeyDeleteManyArgs> = z.object({
  where: ApiKeyWhereInputSchema.optional(),
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

export const CallRecordingCreateArgsSchema: z.ZodType<Prisma.CallRecordingCreateArgs> = z.object({
  select: CallRecordingSelectSchema.optional(),
  data: z.union([ CallRecordingCreateInputSchema,CallRecordingUncheckedCreateInputSchema ]),
}).strict() ;

export const CallRecordingUpsertArgsSchema: z.ZodType<Prisma.CallRecordingUpsertArgs> = z.object({
  select: CallRecordingSelectSchema.optional(),
  where: CallRecordingWhereUniqueInputSchema,
  create: z.union([ CallRecordingCreateInputSchema,CallRecordingUncheckedCreateInputSchema ]),
  update: z.union([ CallRecordingUpdateInputSchema,CallRecordingUncheckedUpdateInputSchema ]),
}).strict() ;

export const CallRecordingCreateManyArgsSchema: z.ZodType<Prisma.CallRecordingCreateManyArgs> = z.object({
  data: z.union([ CallRecordingCreateManyInputSchema,CallRecordingCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CallRecordingCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CallRecordingCreateManyAndReturnArgs> = z.object({
  data: z.union([ CallRecordingCreateManyInputSchema,CallRecordingCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CallRecordingDeleteArgsSchema: z.ZodType<Prisma.CallRecordingDeleteArgs> = z.object({
  select: CallRecordingSelectSchema.optional(),
  where: CallRecordingWhereUniqueInputSchema,
}).strict() ;

export const CallRecordingUpdateArgsSchema: z.ZodType<Prisma.CallRecordingUpdateArgs> = z.object({
  select: CallRecordingSelectSchema.optional(),
  data: z.union([ CallRecordingUpdateInputSchema,CallRecordingUncheckedUpdateInputSchema ]),
  where: CallRecordingWhereUniqueInputSchema,
}).strict() ;

export const CallRecordingUpdateManyArgsSchema: z.ZodType<Prisma.CallRecordingUpdateManyArgs> = z.object({
  data: z.union([ CallRecordingUpdateManyMutationInputSchema,CallRecordingUncheckedUpdateManyInputSchema ]),
  where: CallRecordingWhereInputSchema.optional(),
}).strict() ;

export const CallRecordingDeleteManyArgsSchema: z.ZodType<Prisma.CallRecordingDeleteManyArgs> = z.object({
  where: CallRecordingWhereInputSchema.optional(),
}).strict() ;

export const ScenarioCreateArgsSchema: z.ZodType<Prisma.ScenarioCreateArgs> = z.object({
  select: ScenarioSelectSchema.optional(),
  include: ScenarioIncludeSchema.optional(),
  data: z.union([ ScenarioCreateInputSchema,ScenarioUncheckedCreateInputSchema ]),
}).strict() ;

export const ScenarioUpsertArgsSchema: z.ZodType<Prisma.ScenarioUpsertArgs> = z.object({
  select: ScenarioSelectSchema.optional(),
  include: ScenarioIncludeSchema.optional(),
  where: ScenarioWhereUniqueInputSchema,
  create: z.union([ ScenarioCreateInputSchema,ScenarioUncheckedCreateInputSchema ]),
  update: z.union([ ScenarioUpdateInputSchema,ScenarioUncheckedUpdateInputSchema ]),
}).strict() ;

export const ScenarioCreateManyArgsSchema: z.ZodType<Prisma.ScenarioCreateManyArgs> = z.object({
  data: z.union([ ScenarioCreateManyInputSchema,ScenarioCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ScenarioCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ScenarioCreateManyAndReturnArgs> = z.object({
  data: z.union([ ScenarioCreateManyInputSchema,ScenarioCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ScenarioDeleteArgsSchema: z.ZodType<Prisma.ScenarioDeleteArgs> = z.object({
  select: ScenarioSelectSchema.optional(),
  include: ScenarioIncludeSchema.optional(),
  where: ScenarioWhereUniqueInputSchema,
}).strict() ;

export const ScenarioUpdateArgsSchema: z.ZodType<Prisma.ScenarioUpdateArgs> = z.object({
  select: ScenarioSelectSchema.optional(),
  include: ScenarioIncludeSchema.optional(),
  data: z.union([ ScenarioUpdateInputSchema,ScenarioUncheckedUpdateInputSchema ]),
  where: ScenarioWhereUniqueInputSchema,
}).strict() ;

export const ScenarioUpdateManyArgsSchema: z.ZodType<Prisma.ScenarioUpdateManyArgs> = z.object({
  data: z.union([ ScenarioUpdateManyMutationInputSchema,ScenarioUncheckedUpdateManyInputSchema ]),
  where: ScenarioWhereInputSchema.optional(),
}).strict() ;

export const ScenarioDeleteManyArgsSchema: z.ZodType<Prisma.ScenarioDeleteManyArgs> = z.object({
  where: ScenarioWhereInputSchema.optional(),
}).strict() ;

export const EvaluationTemplateCreateArgsSchema: z.ZodType<Prisma.EvaluationTemplateCreateArgs> = z.object({
  select: EvaluationTemplateSelectSchema.optional(),
  include: EvaluationTemplateIncludeSchema.optional(),
  data: z.union([ EvaluationTemplateCreateInputSchema,EvaluationTemplateUncheckedCreateInputSchema ]),
}).strict() ;

export const EvaluationTemplateUpsertArgsSchema: z.ZodType<Prisma.EvaluationTemplateUpsertArgs> = z.object({
  select: EvaluationTemplateSelectSchema.optional(),
  include: EvaluationTemplateIncludeSchema.optional(),
  where: EvaluationTemplateWhereUniqueInputSchema,
  create: z.union([ EvaluationTemplateCreateInputSchema,EvaluationTemplateUncheckedCreateInputSchema ]),
  update: z.union([ EvaluationTemplateUpdateInputSchema,EvaluationTemplateUncheckedUpdateInputSchema ]),
}).strict() ;

export const EvaluationTemplateCreateManyArgsSchema: z.ZodType<Prisma.EvaluationTemplateCreateManyArgs> = z.object({
  data: z.union([ EvaluationTemplateCreateManyInputSchema,EvaluationTemplateCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const EvaluationTemplateCreateManyAndReturnArgsSchema: z.ZodType<Prisma.EvaluationTemplateCreateManyAndReturnArgs> = z.object({
  data: z.union([ EvaluationTemplateCreateManyInputSchema,EvaluationTemplateCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const EvaluationTemplateDeleteArgsSchema: z.ZodType<Prisma.EvaluationTemplateDeleteArgs> = z.object({
  select: EvaluationTemplateSelectSchema.optional(),
  include: EvaluationTemplateIncludeSchema.optional(),
  where: EvaluationTemplateWhereUniqueInputSchema,
}).strict() ;

export const EvaluationTemplateUpdateArgsSchema: z.ZodType<Prisma.EvaluationTemplateUpdateArgs> = z.object({
  select: EvaluationTemplateSelectSchema.optional(),
  include: EvaluationTemplateIncludeSchema.optional(),
  data: z.union([ EvaluationTemplateUpdateInputSchema,EvaluationTemplateUncheckedUpdateInputSchema ]),
  where: EvaluationTemplateWhereUniqueInputSchema,
}).strict() ;

export const EvaluationTemplateUpdateManyArgsSchema: z.ZodType<Prisma.EvaluationTemplateUpdateManyArgs> = z.object({
  data: z.union([ EvaluationTemplateUpdateManyMutationInputSchema,EvaluationTemplateUncheckedUpdateManyInputSchema ]),
  where: EvaluationTemplateWhereInputSchema.optional(),
}).strict() ;

export const EvaluationTemplateDeleteManyArgsSchema: z.ZodType<Prisma.EvaluationTemplateDeleteManyArgs> = z.object({
  where: EvaluationTemplateWhereInputSchema.optional(),
}).strict() ;

export const GeneralEvaluationCreateArgsSchema: z.ZodType<Prisma.GeneralEvaluationCreateArgs> = z.object({
  select: GeneralEvaluationSelectSchema.optional(),
  include: GeneralEvaluationIncludeSchema.optional(),
  data: z.union([ GeneralEvaluationCreateInputSchema,GeneralEvaluationUncheckedCreateInputSchema ]),
}).strict() ;

export const GeneralEvaluationUpsertArgsSchema: z.ZodType<Prisma.GeneralEvaluationUpsertArgs> = z.object({
  select: GeneralEvaluationSelectSchema.optional(),
  include: GeneralEvaluationIncludeSchema.optional(),
  where: GeneralEvaluationWhereUniqueInputSchema,
  create: z.union([ GeneralEvaluationCreateInputSchema,GeneralEvaluationUncheckedCreateInputSchema ]),
  update: z.union([ GeneralEvaluationUpdateInputSchema,GeneralEvaluationUncheckedUpdateInputSchema ]),
}).strict() ;

export const GeneralEvaluationCreateManyArgsSchema: z.ZodType<Prisma.GeneralEvaluationCreateManyArgs> = z.object({
  data: z.union([ GeneralEvaluationCreateManyInputSchema,GeneralEvaluationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const GeneralEvaluationCreateManyAndReturnArgsSchema: z.ZodType<Prisma.GeneralEvaluationCreateManyAndReturnArgs> = z.object({
  data: z.union([ GeneralEvaluationCreateManyInputSchema,GeneralEvaluationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const GeneralEvaluationDeleteArgsSchema: z.ZodType<Prisma.GeneralEvaluationDeleteArgs> = z.object({
  select: GeneralEvaluationSelectSchema.optional(),
  include: GeneralEvaluationIncludeSchema.optional(),
  where: GeneralEvaluationWhereUniqueInputSchema,
}).strict() ;

export const GeneralEvaluationUpdateArgsSchema: z.ZodType<Prisma.GeneralEvaluationUpdateArgs> = z.object({
  select: GeneralEvaluationSelectSchema.optional(),
  include: GeneralEvaluationIncludeSchema.optional(),
  data: z.union([ GeneralEvaluationUpdateInputSchema,GeneralEvaluationUncheckedUpdateInputSchema ]),
  where: GeneralEvaluationWhereUniqueInputSchema,
}).strict() ;

export const GeneralEvaluationUpdateManyArgsSchema: z.ZodType<Prisma.GeneralEvaluationUpdateManyArgs> = z.object({
  data: z.union([ GeneralEvaluationUpdateManyMutationInputSchema,GeneralEvaluationUncheckedUpdateManyInputSchema ]),
  where: GeneralEvaluationWhereInputSchema.optional(),
}).strict() ;

export const GeneralEvaluationDeleteManyArgsSchema: z.ZodType<Prisma.GeneralEvaluationDeleteManyArgs> = z.object({
  where: GeneralEvaluationWhereInputSchema.optional(),
}).strict() ;

export const EvaluationCreateArgsSchema: z.ZodType<Prisma.EvaluationCreateArgs> = z.object({
  select: EvaluationSelectSchema.optional(),
  include: EvaluationIncludeSchema.optional(),
  data: z.union([ EvaluationCreateInputSchema,EvaluationUncheckedCreateInputSchema ]),
}).strict() ;

export const EvaluationUpsertArgsSchema: z.ZodType<Prisma.EvaluationUpsertArgs> = z.object({
  select: EvaluationSelectSchema.optional(),
  include: EvaluationIncludeSchema.optional(),
  where: EvaluationWhereUniqueInputSchema,
  create: z.union([ EvaluationCreateInputSchema,EvaluationUncheckedCreateInputSchema ]),
  update: z.union([ EvaluationUpdateInputSchema,EvaluationUncheckedUpdateInputSchema ]),
}).strict() ;

export const EvaluationCreateManyArgsSchema: z.ZodType<Prisma.EvaluationCreateManyArgs> = z.object({
  data: z.union([ EvaluationCreateManyInputSchema,EvaluationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const EvaluationCreateManyAndReturnArgsSchema: z.ZodType<Prisma.EvaluationCreateManyAndReturnArgs> = z.object({
  data: z.union([ EvaluationCreateManyInputSchema,EvaluationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const EvaluationDeleteArgsSchema: z.ZodType<Prisma.EvaluationDeleteArgs> = z.object({
  select: EvaluationSelectSchema.optional(),
  include: EvaluationIncludeSchema.optional(),
  where: EvaluationWhereUniqueInputSchema,
}).strict() ;

export const EvaluationUpdateArgsSchema: z.ZodType<Prisma.EvaluationUpdateArgs> = z.object({
  select: EvaluationSelectSchema.optional(),
  include: EvaluationIncludeSchema.optional(),
  data: z.union([ EvaluationUpdateInputSchema,EvaluationUncheckedUpdateInputSchema ]),
  where: EvaluationWhereUniqueInputSchema,
}).strict() ;

export const EvaluationUpdateManyArgsSchema: z.ZodType<Prisma.EvaluationUpdateManyArgs> = z.object({
  data: z.union([ EvaluationUpdateManyMutationInputSchema,EvaluationUncheckedUpdateManyInputSchema ]),
  where: EvaluationWhereInputSchema.optional(),
}).strict() ;

export const EvaluationDeleteManyArgsSchema: z.ZodType<Prisma.EvaluationDeleteManyArgs> = z.object({
  where: EvaluationWhereInputSchema.optional(),
}).strict() ;

export const EvaluationResultCreateArgsSchema: z.ZodType<Prisma.EvaluationResultCreateArgs> = z.object({
  select: EvaluationResultSelectSchema.optional(),
  include: EvaluationResultIncludeSchema.optional(),
  data: z.union([ EvaluationResultCreateInputSchema,EvaluationResultUncheckedCreateInputSchema ]),
}).strict() ;

export const EvaluationResultUpsertArgsSchema: z.ZodType<Prisma.EvaluationResultUpsertArgs> = z.object({
  select: EvaluationResultSelectSchema.optional(),
  include: EvaluationResultIncludeSchema.optional(),
  where: EvaluationResultWhereUniqueInputSchema,
  create: z.union([ EvaluationResultCreateInputSchema,EvaluationResultUncheckedCreateInputSchema ]),
  update: z.union([ EvaluationResultUpdateInputSchema,EvaluationResultUncheckedUpdateInputSchema ]),
}).strict() ;

export const EvaluationResultCreateManyArgsSchema: z.ZodType<Prisma.EvaluationResultCreateManyArgs> = z.object({
  data: z.union([ EvaluationResultCreateManyInputSchema,EvaluationResultCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const EvaluationResultCreateManyAndReturnArgsSchema: z.ZodType<Prisma.EvaluationResultCreateManyAndReturnArgs> = z.object({
  data: z.union([ EvaluationResultCreateManyInputSchema,EvaluationResultCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const EvaluationResultDeleteArgsSchema: z.ZodType<Prisma.EvaluationResultDeleteArgs> = z.object({
  select: EvaluationResultSelectSchema.optional(),
  include: EvaluationResultIncludeSchema.optional(),
  where: EvaluationResultWhereUniqueInputSchema,
}).strict() ;

export const EvaluationResultUpdateArgsSchema: z.ZodType<Prisma.EvaluationResultUpdateArgs> = z.object({
  select: EvaluationResultSelectSchema.optional(),
  include: EvaluationResultIncludeSchema.optional(),
  data: z.union([ EvaluationResultUpdateInputSchema,EvaluationResultUncheckedUpdateInputSchema ]),
  where: EvaluationResultWhereUniqueInputSchema,
}).strict() ;

export const EvaluationResultUpdateManyArgsSchema: z.ZodType<Prisma.EvaluationResultUpdateManyArgs> = z.object({
  data: z.union([ EvaluationResultUpdateManyMutationInputSchema,EvaluationResultUncheckedUpdateManyInputSchema ]),
  where: EvaluationResultWhereInputSchema.optional(),
}).strict() ;

export const EvaluationResultDeleteManyArgsSchema: z.ZodType<Prisma.EvaluationResultDeleteManyArgs> = z.object({
  where: EvaluationResultWhereInputSchema.optional(),
}).strict() ;

export const LatencyBlockCreateArgsSchema: z.ZodType<Prisma.LatencyBlockCreateArgs> = z.object({
  select: LatencyBlockSelectSchema.optional(),
  include: LatencyBlockIncludeSchema.optional(),
  data: z.union([ LatencyBlockCreateInputSchema,LatencyBlockUncheckedCreateInputSchema ]),
}).strict() ;

export const LatencyBlockUpsertArgsSchema: z.ZodType<Prisma.LatencyBlockUpsertArgs> = z.object({
  select: LatencyBlockSelectSchema.optional(),
  include: LatencyBlockIncludeSchema.optional(),
  where: LatencyBlockWhereUniqueInputSchema,
  create: z.union([ LatencyBlockCreateInputSchema,LatencyBlockUncheckedCreateInputSchema ]),
  update: z.union([ LatencyBlockUpdateInputSchema,LatencyBlockUncheckedUpdateInputSchema ]),
}).strict() ;

export const LatencyBlockCreateManyArgsSchema: z.ZodType<Prisma.LatencyBlockCreateManyArgs> = z.object({
  data: z.union([ LatencyBlockCreateManyInputSchema,LatencyBlockCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const LatencyBlockCreateManyAndReturnArgsSchema: z.ZodType<Prisma.LatencyBlockCreateManyAndReturnArgs> = z.object({
  data: z.union([ LatencyBlockCreateManyInputSchema,LatencyBlockCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const LatencyBlockDeleteArgsSchema: z.ZodType<Prisma.LatencyBlockDeleteArgs> = z.object({
  select: LatencyBlockSelectSchema.optional(),
  include: LatencyBlockIncludeSchema.optional(),
  where: LatencyBlockWhereUniqueInputSchema,
}).strict() ;

export const LatencyBlockUpdateArgsSchema: z.ZodType<Prisma.LatencyBlockUpdateArgs> = z.object({
  select: LatencyBlockSelectSchema.optional(),
  include: LatencyBlockIncludeSchema.optional(),
  data: z.union([ LatencyBlockUpdateInputSchema,LatencyBlockUncheckedUpdateInputSchema ]),
  where: LatencyBlockWhereUniqueInputSchema,
}).strict() ;

export const LatencyBlockUpdateManyArgsSchema: z.ZodType<Prisma.LatencyBlockUpdateManyArgs> = z.object({
  data: z.union([ LatencyBlockUpdateManyMutationInputSchema,LatencyBlockUncheckedUpdateManyInputSchema ]),
  where: LatencyBlockWhereInputSchema.optional(),
}).strict() ;

export const LatencyBlockDeleteManyArgsSchema: z.ZodType<Prisma.LatencyBlockDeleteManyArgs> = z.object({
  where: LatencyBlockWhereInputSchema.optional(),
}).strict() ;

export const InterruptionCreateArgsSchema: z.ZodType<Prisma.InterruptionCreateArgs> = z.object({
  select: InterruptionSelectSchema.optional(),
  include: InterruptionIncludeSchema.optional(),
  data: z.union([ InterruptionCreateInputSchema,InterruptionUncheckedCreateInputSchema ]),
}).strict() ;

export const InterruptionUpsertArgsSchema: z.ZodType<Prisma.InterruptionUpsertArgs> = z.object({
  select: InterruptionSelectSchema.optional(),
  include: InterruptionIncludeSchema.optional(),
  where: InterruptionWhereUniqueInputSchema,
  create: z.union([ InterruptionCreateInputSchema,InterruptionUncheckedCreateInputSchema ]),
  update: z.union([ InterruptionUpdateInputSchema,InterruptionUncheckedUpdateInputSchema ]),
}).strict() ;

export const InterruptionCreateManyArgsSchema: z.ZodType<Prisma.InterruptionCreateManyArgs> = z.object({
  data: z.union([ InterruptionCreateManyInputSchema,InterruptionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const InterruptionCreateManyAndReturnArgsSchema: z.ZodType<Prisma.InterruptionCreateManyAndReturnArgs> = z.object({
  data: z.union([ InterruptionCreateManyInputSchema,InterruptionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const InterruptionDeleteArgsSchema: z.ZodType<Prisma.InterruptionDeleteArgs> = z.object({
  select: InterruptionSelectSchema.optional(),
  include: InterruptionIncludeSchema.optional(),
  where: InterruptionWhereUniqueInputSchema,
}).strict() ;

export const InterruptionUpdateArgsSchema: z.ZodType<Prisma.InterruptionUpdateArgs> = z.object({
  select: InterruptionSelectSchema.optional(),
  include: InterruptionIncludeSchema.optional(),
  data: z.union([ InterruptionUpdateInputSchema,InterruptionUncheckedUpdateInputSchema ]),
  where: InterruptionWhereUniqueInputSchema,
}).strict() ;

export const InterruptionUpdateManyArgsSchema: z.ZodType<Prisma.InterruptionUpdateManyArgs> = z.object({
  data: z.union([ InterruptionUpdateManyMutationInputSchema,InterruptionUncheckedUpdateManyInputSchema ]),
  where: InterruptionWhereInputSchema.optional(),
}).strict() ;

export const InterruptionDeleteManyArgsSchema: z.ZodType<Prisma.InterruptionDeleteManyArgs> = z.object({
  where: InterruptionWhereInputSchema.optional(),
}).strict() ;

export const EvaluationGroupCreateArgsSchema: z.ZodType<Prisma.EvaluationGroupCreateArgs> = z.object({
  select: EvaluationGroupSelectSchema.optional(),
  include: EvaluationGroupIncludeSchema.optional(),
  data: z.union([ EvaluationGroupCreateInputSchema,EvaluationGroupUncheckedCreateInputSchema ]),
}).strict() ;

export const EvaluationGroupUpsertArgsSchema: z.ZodType<Prisma.EvaluationGroupUpsertArgs> = z.object({
  select: EvaluationGroupSelectSchema.optional(),
  include: EvaluationGroupIncludeSchema.optional(),
  where: EvaluationGroupWhereUniqueInputSchema,
  create: z.union([ EvaluationGroupCreateInputSchema,EvaluationGroupUncheckedCreateInputSchema ]),
  update: z.union([ EvaluationGroupUpdateInputSchema,EvaluationGroupUncheckedUpdateInputSchema ]),
}).strict() ;

export const EvaluationGroupCreateManyArgsSchema: z.ZodType<Prisma.EvaluationGroupCreateManyArgs> = z.object({
  data: z.union([ EvaluationGroupCreateManyInputSchema,EvaluationGroupCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const EvaluationGroupCreateManyAndReturnArgsSchema: z.ZodType<Prisma.EvaluationGroupCreateManyAndReturnArgs> = z.object({
  data: z.union([ EvaluationGroupCreateManyInputSchema,EvaluationGroupCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const EvaluationGroupDeleteArgsSchema: z.ZodType<Prisma.EvaluationGroupDeleteArgs> = z.object({
  select: EvaluationGroupSelectSchema.optional(),
  include: EvaluationGroupIncludeSchema.optional(),
  where: EvaluationGroupWhereUniqueInputSchema,
}).strict() ;

export const EvaluationGroupUpdateArgsSchema: z.ZodType<Prisma.EvaluationGroupUpdateArgs> = z.object({
  select: EvaluationGroupSelectSchema.optional(),
  include: EvaluationGroupIncludeSchema.optional(),
  data: z.union([ EvaluationGroupUpdateInputSchema,EvaluationGroupUncheckedUpdateInputSchema ]),
  where: EvaluationGroupWhereUniqueInputSchema,
}).strict() ;

export const EvaluationGroupUpdateManyArgsSchema: z.ZodType<Prisma.EvaluationGroupUpdateManyArgs> = z.object({
  data: z.union([ EvaluationGroupUpdateManyMutationInputSchema,EvaluationGroupUncheckedUpdateManyInputSchema ]),
  where: EvaluationGroupWhereInputSchema.optional(),
}).strict() ;

export const EvaluationGroupDeleteManyArgsSchema: z.ZodType<Prisma.EvaluationGroupDeleteManyArgs> = z.object({
  where: EvaluationGroupWhereInputSchema.optional(),
}).strict() ;

export const SavedSearchCreateArgsSchema: z.ZodType<Prisma.SavedSearchCreateArgs> = z.object({
  select: SavedSearchSelectSchema.optional(),
  include: SavedSearchIncludeSchema.optional(),
  data: z.union([ SavedSearchCreateInputSchema,SavedSearchUncheckedCreateInputSchema ]),
}).strict() ;

export const SavedSearchUpsertArgsSchema: z.ZodType<Prisma.SavedSearchUpsertArgs> = z.object({
  select: SavedSearchSelectSchema.optional(),
  include: SavedSearchIncludeSchema.optional(),
  where: SavedSearchWhereUniqueInputSchema,
  create: z.union([ SavedSearchCreateInputSchema,SavedSearchUncheckedCreateInputSchema ]),
  update: z.union([ SavedSearchUpdateInputSchema,SavedSearchUncheckedUpdateInputSchema ]),
}).strict() ;

export const SavedSearchCreateManyArgsSchema: z.ZodType<Prisma.SavedSearchCreateManyArgs> = z.object({
  data: z.union([ SavedSearchCreateManyInputSchema,SavedSearchCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const SavedSearchCreateManyAndReturnArgsSchema: z.ZodType<Prisma.SavedSearchCreateManyAndReturnArgs> = z.object({
  data: z.union([ SavedSearchCreateManyInputSchema,SavedSearchCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const SavedSearchDeleteArgsSchema: z.ZodType<Prisma.SavedSearchDeleteArgs> = z.object({
  select: SavedSearchSelectSchema.optional(),
  include: SavedSearchIncludeSchema.optional(),
  where: SavedSearchWhereUniqueInputSchema,
}).strict() ;

export const SavedSearchUpdateArgsSchema: z.ZodType<Prisma.SavedSearchUpdateArgs> = z.object({
  select: SavedSearchSelectSchema.optional(),
  include: SavedSearchIncludeSchema.optional(),
  data: z.union([ SavedSearchUpdateInputSchema,SavedSearchUncheckedUpdateInputSchema ]),
  where: SavedSearchWhereUniqueInputSchema,
}).strict() ;

export const SavedSearchUpdateManyArgsSchema: z.ZodType<Prisma.SavedSearchUpdateManyArgs> = z.object({
  data: z.union([ SavedSearchUpdateManyMutationInputSchema,SavedSearchUncheckedUpdateManyInputSchema ]),
  where: SavedSearchWhereInputSchema.optional(),
}).strict() ;

export const SavedSearchDeleteManyArgsSchema: z.ZodType<Prisma.SavedSearchDeleteManyArgs> = z.object({
  where: SavedSearchWhereInputSchema.optional(),
}).strict() ;

export const AlertCreateArgsSchema: z.ZodType<Prisma.AlertCreateArgs> = z.object({
  select: AlertSelectSchema.optional(),
  include: AlertIncludeSchema.optional(),
  data: z.union([ AlertCreateInputSchema,AlertUncheckedCreateInputSchema ]),
}).strict() ;

export const AlertUpsertArgsSchema: z.ZodType<Prisma.AlertUpsertArgs> = z.object({
  select: AlertSelectSchema.optional(),
  include: AlertIncludeSchema.optional(),
  where: AlertWhereUniqueInputSchema,
  create: z.union([ AlertCreateInputSchema,AlertUncheckedCreateInputSchema ]),
  update: z.union([ AlertUpdateInputSchema,AlertUncheckedUpdateInputSchema ]),
}).strict() ;

export const AlertCreateManyArgsSchema: z.ZodType<Prisma.AlertCreateManyArgs> = z.object({
  data: z.union([ AlertCreateManyInputSchema,AlertCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AlertCreateManyAndReturnArgsSchema: z.ZodType<Prisma.AlertCreateManyAndReturnArgs> = z.object({
  data: z.union([ AlertCreateManyInputSchema,AlertCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AlertDeleteArgsSchema: z.ZodType<Prisma.AlertDeleteArgs> = z.object({
  select: AlertSelectSchema.optional(),
  include: AlertIncludeSchema.optional(),
  where: AlertWhereUniqueInputSchema,
}).strict() ;

export const AlertUpdateArgsSchema: z.ZodType<Prisma.AlertUpdateArgs> = z.object({
  select: AlertSelectSchema.optional(),
  include: AlertIncludeSchema.optional(),
  data: z.union([ AlertUpdateInputSchema,AlertUncheckedUpdateInputSchema ]),
  where: AlertWhereUniqueInputSchema,
}).strict() ;

export const AlertUpdateManyArgsSchema: z.ZodType<Prisma.AlertUpdateManyArgs> = z.object({
  data: z.union([ AlertUpdateManyMutationInputSchema,AlertUncheckedUpdateManyInputSchema ]),
  where: AlertWhereInputSchema.optional(),
}).strict() ;

export const AlertDeleteManyArgsSchema: z.ZodType<Prisma.AlertDeleteManyArgs> = z.object({
  where: AlertWhereInputSchema.optional(),
}).strict() ;