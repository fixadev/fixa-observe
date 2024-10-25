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

export const UserScalarFieldEnumSchema = z.enum(['id','email','firstName','lastName','emailSubscriptionId','emailSubscriptionExpiresAt']);

export const ProjectScalarFieldEnumSchema = z.enum(['id','ownerId','name','createdAt','updatedAt']);

export const SurveyScalarFieldEnumSchema = z.enum(['id','ownerId','createdAt','updatedAt','name','projectId']);

export const AttributeScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','label','type','ownerId','defaultIndex']);

export const AttributesOnSurveysScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','attributeId','attributeIndex','surveyId']);

export const PropertyScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','ownerId','photoUrl','attributes','displayIndex','surveyId']);

export const BrochureScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','url','exportedUrl','thumbnailUrl','title','approved','propertyId','inpaintedRectangles','textToRemove','pathsToRemove','undoStack','deletedPages']);

export const EmailScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','senderName','senderEmail','recipientName','recipientEmail','subject','body','webLink','isDraft','emailThreadId']);

export const AttachmentScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','name','contentType','size','infoMessageDismissed','brochureReplaced','emailId']);

export const EmailThreadScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','propertyId','unread','parsedAttributes']);

export const ContactScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','firstName','lastName','email','phone','propertyId']);

export const EmailTemplateScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','userId','subject','body']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const NullableJsonNullValueInputSchema = z.enum(['DbNull','JsonNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.DbNull : value);

export const JsonNullValueInputSchema = z.enum(['JsonNull',]).transform((value) => (value === 'JsonNull' ? Prisma.JsonNull : value));

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
  email: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  emailSubscriptionId: z.string().nullable(),
  emailSubscriptionExpiresAt: z.coerce.date().nullable(),
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
// ATTRIBUTE SCHEMA
/////////////////////////////////////////

export const AttributeSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  label: z.string(),
  type: z.string(),
  ownerId: z.string().nullable(),
  defaultIndex: z.number().int(),
})

export type Attribute = z.infer<typeof AttributeSchema>

/////////////////////////////////////////
// ATTRIBUTES ON SURVEYS SCHEMA
/////////////////////////////////////////

export const AttributesOnSurveysSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  attributeId: z.string(),
  attributeIndex: z.number().int(),
  surveyId: z.string(),
})

export type AttributesOnSurveys = z.infer<typeof AttributesOnSurveysSchema>

/////////////////////////////////////////
// PROPERTY SCHEMA
/////////////////////////////////////////

export const PropertySchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  ownerId: z.string(),
  photoUrl: z.string().nullable(),
  attributes: JsonValueSchema.nullable(),
  displayIndex: z.number().int(),
  surveyId: z.string(),
})

export type Property = z.infer<typeof PropertySchema>

/////////////////////////////////////////
// BROCHURE SCHEMA
/////////////////////////////////////////

export const BrochureSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  url: z.string(),
  exportedUrl: z.string().nullable(),
  thumbnailUrl: z.string().nullable(),
  title: z.string(),
  approved: z.boolean(),
  propertyId: z.string(),
  inpaintedRectangles: JsonValueSchema.nullable(),
  textToRemove: JsonValueSchema.nullable(),
  pathsToRemove: JsonValueSchema.nullable(),
  undoStack: z.string().array(),
  deletedPages: z.number().int().array(),
})

export type Brochure = z.infer<typeof BrochureSchema>

/////////////////////////////////////////
// EMAIL SCHEMA
/////////////////////////////////////////

export const EmailSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  senderName: z.string(),
  senderEmail: z.string(),
  recipientName: z.string(),
  recipientEmail: z.string(),
  subject: z.string(),
  body: z.string(),
  webLink: z.string(),
  isDraft: z.boolean(),
  emailThreadId: z.string(),
})

export type Email = z.infer<typeof EmailSchema>

/////////////////////////////////////////
// ATTACHMENT SCHEMA
/////////////////////////////////////////

export const AttachmentSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  name: z.string(),
  contentType: z.string(),
  size: z.number().int(),
  infoMessageDismissed: z.boolean(),
  brochureReplaced: z.boolean(),
  emailId: z.string(),
})

export type Attachment = z.infer<typeof AttachmentSchema>

/////////////////////////////////////////
// EMAIL THREAD SCHEMA
/////////////////////////////////////////

export const EmailThreadSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  propertyId: z.string(),
  unread: z.boolean(),
  parsedAttributes: JsonValueSchema,
})

export type EmailThread = z.infer<typeof EmailThreadSchema>

/////////////////////////////////////////
// CONTACT SCHEMA
/////////////////////////////////////////

export const ContactSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  propertyId: z.string(),
})

export type Contact = z.infer<typeof ContactSchema>

/////////////////////////////////////////
// EMAIL TEMPLATE SCHEMA
/////////////////////////////////////////

export const EmailTemplateSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  userId: z.string(),
  subject: z.string(),
  body: z.string(),
})

export type EmailTemplate = z.infer<typeof EmailTemplateSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  projects: z.union([z.boolean(),z.lazy(() => ProjectFindManyArgsSchema)]).optional(),
  properties: z.union([z.boolean(),z.lazy(() => PropertyFindManyArgsSchema)]).optional(),
  attributes: z.union([z.boolean(),z.lazy(() => AttributeFindManyArgsSchema)]).optional(),
  emailTemplate: z.union([z.boolean(),z.lazy(() => EmailTemplateArgsSchema)]).optional(),
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
  email: z.boolean().optional(),
  firstName: z.boolean().optional(),
  lastName: z.boolean().optional(),
  emailSubscriptionId: z.boolean().optional(),
  emailSubscriptionExpiresAt: z.boolean().optional(),
  projects: z.union([z.boolean(),z.lazy(() => ProjectFindManyArgsSchema)]).optional(),
  properties: z.union([z.boolean(),z.lazy(() => PropertyFindManyArgsSchema)]).optional(),
  attributes: z.union([z.boolean(),z.lazy(() => AttributeFindManyArgsSchema)]).optional(),
  emailTemplate: z.union([z.boolean(),z.lazy(() => EmailTemplateArgsSchema)]).optional(),
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
  attributes: z.union([z.boolean(),z.lazy(() => AttributesOnSurveysFindManyArgsSchema)]).optional(),
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
  attributes: z.boolean().optional(),
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
  attributes: z.union([z.boolean(),z.lazy(() => AttributesOnSurveysFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => SurveyCountOutputTypeArgsSchema)]).optional(),
}).strict()

// ATTRIBUTE
//------------------------------------------------------

export const AttributeIncludeSchema: z.ZodType<Prisma.AttributeInclude> = z.object({
  owner: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  surveys: z.union([z.boolean(),z.lazy(() => AttributesOnSurveysFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => AttributeCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const AttributeArgsSchema: z.ZodType<Prisma.AttributeDefaultArgs> = z.object({
  select: z.lazy(() => AttributeSelectSchema).optional(),
  include: z.lazy(() => AttributeIncludeSchema).optional(),
}).strict();

export const AttributeCountOutputTypeArgsSchema: z.ZodType<Prisma.AttributeCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => AttributeCountOutputTypeSelectSchema).nullish(),
}).strict();

export const AttributeCountOutputTypeSelectSchema: z.ZodType<Prisma.AttributeCountOutputTypeSelect> = z.object({
  surveys: z.boolean().optional(),
}).strict();

export const AttributeSelectSchema: z.ZodType<Prisma.AttributeSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  label: z.boolean().optional(),
  type: z.boolean().optional(),
  ownerId: z.boolean().optional(),
  defaultIndex: z.boolean().optional(),
  owner: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  surveys: z.union([z.boolean(),z.lazy(() => AttributesOnSurveysFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => AttributeCountOutputTypeArgsSchema)]).optional(),
}).strict()

// ATTRIBUTES ON SURVEYS
//------------------------------------------------------

export const AttributesOnSurveysIncludeSchema: z.ZodType<Prisma.AttributesOnSurveysInclude> = z.object({
  attribute: z.union([z.boolean(),z.lazy(() => AttributeArgsSchema)]).optional(),
  survey: z.union([z.boolean(),z.lazy(() => SurveyArgsSchema)]).optional(),
}).strict()

export const AttributesOnSurveysArgsSchema: z.ZodType<Prisma.AttributesOnSurveysDefaultArgs> = z.object({
  select: z.lazy(() => AttributesOnSurveysSelectSchema).optional(),
  include: z.lazy(() => AttributesOnSurveysIncludeSchema).optional(),
}).strict();

export const AttributesOnSurveysSelectSchema: z.ZodType<Prisma.AttributesOnSurveysSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  attributeId: z.boolean().optional(),
  attributeIndex: z.boolean().optional(),
  surveyId: z.boolean().optional(),
  attribute: z.union([z.boolean(),z.lazy(() => AttributeArgsSchema)]).optional(),
  survey: z.union([z.boolean(),z.lazy(() => SurveyArgsSchema)]).optional(),
}).strict()

// PROPERTY
//------------------------------------------------------

export const PropertyIncludeSchema: z.ZodType<Prisma.PropertyInclude> = z.object({
  owner: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  brochures: z.union([z.boolean(),z.lazy(() => BrochureFindManyArgsSchema)]).optional(),
  survey: z.union([z.boolean(),z.lazy(() => SurveyArgsSchema)]).optional(),
  contacts: z.union([z.boolean(),z.lazy(() => ContactFindManyArgsSchema)]).optional(),
  emailThreads: z.union([z.boolean(),z.lazy(() => EmailThreadFindManyArgsSchema)]).optional(),
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
  contacts: z.boolean().optional(),
  emailThreads: z.boolean().optional(),
}).strict();

export const PropertySelectSchema: z.ZodType<Prisma.PropertySelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  ownerId: z.boolean().optional(),
  photoUrl: z.boolean().optional(),
  attributes: z.boolean().optional(),
  displayIndex: z.boolean().optional(),
  surveyId: z.boolean().optional(),
  owner: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  brochures: z.union([z.boolean(),z.lazy(() => BrochureFindManyArgsSchema)]).optional(),
  survey: z.union([z.boolean(),z.lazy(() => SurveyArgsSchema)]).optional(),
  contacts: z.union([z.boolean(),z.lazy(() => ContactFindManyArgsSchema)]).optional(),
  emailThreads: z.union([z.boolean(),z.lazy(() => EmailThreadFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => PropertyCountOutputTypeArgsSchema)]).optional(),
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
  exportedUrl: z.boolean().optional(),
  thumbnailUrl: z.boolean().optional(),
  title: z.boolean().optional(),
  approved: z.boolean().optional(),
  propertyId: z.boolean().optional(),
  inpaintedRectangles: z.boolean().optional(),
  textToRemove: z.boolean().optional(),
  pathsToRemove: z.boolean().optional(),
  undoStack: z.boolean().optional(),
  deletedPages: z.boolean().optional(),
  property: z.union([z.boolean(),z.lazy(() => PropertyArgsSchema)]).optional(),
}).strict()

// EMAIL
//------------------------------------------------------

export const EmailIncludeSchema: z.ZodType<Prisma.EmailInclude> = z.object({
  attachments: z.union([z.boolean(),z.lazy(() => AttachmentFindManyArgsSchema)]).optional(),
  emailThread: z.union([z.boolean(),z.lazy(() => EmailThreadArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => EmailCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const EmailArgsSchema: z.ZodType<Prisma.EmailDefaultArgs> = z.object({
  select: z.lazy(() => EmailSelectSchema).optional(),
  include: z.lazy(() => EmailIncludeSchema).optional(),
}).strict();

export const EmailCountOutputTypeArgsSchema: z.ZodType<Prisma.EmailCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => EmailCountOutputTypeSelectSchema).nullish(),
}).strict();

export const EmailCountOutputTypeSelectSchema: z.ZodType<Prisma.EmailCountOutputTypeSelect> = z.object({
  attachments: z.boolean().optional(),
}).strict();

export const EmailSelectSchema: z.ZodType<Prisma.EmailSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  senderName: z.boolean().optional(),
  senderEmail: z.boolean().optional(),
  recipientName: z.boolean().optional(),
  recipientEmail: z.boolean().optional(),
  subject: z.boolean().optional(),
  body: z.boolean().optional(),
  webLink: z.boolean().optional(),
  isDraft: z.boolean().optional(),
  emailThreadId: z.boolean().optional(),
  attachments: z.union([z.boolean(),z.lazy(() => AttachmentFindManyArgsSchema)]).optional(),
  emailThread: z.union([z.boolean(),z.lazy(() => EmailThreadArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => EmailCountOutputTypeArgsSchema)]).optional(),
}).strict()

// ATTACHMENT
//------------------------------------------------------

export const AttachmentIncludeSchema: z.ZodType<Prisma.AttachmentInclude> = z.object({
  email: z.union([z.boolean(),z.lazy(() => EmailArgsSchema)]).optional(),
}).strict()

export const AttachmentArgsSchema: z.ZodType<Prisma.AttachmentDefaultArgs> = z.object({
  select: z.lazy(() => AttachmentSelectSchema).optional(),
  include: z.lazy(() => AttachmentIncludeSchema).optional(),
}).strict();

export const AttachmentSelectSchema: z.ZodType<Prisma.AttachmentSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  name: z.boolean().optional(),
  contentType: z.boolean().optional(),
  size: z.boolean().optional(),
  infoMessageDismissed: z.boolean().optional(),
  brochureReplaced: z.boolean().optional(),
  emailId: z.boolean().optional(),
  email: z.union([z.boolean(),z.lazy(() => EmailArgsSchema)]).optional(),
}).strict()

// EMAIL THREAD
//------------------------------------------------------

export const EmailThreadIncludeSchema: z.ZodType<Prisma.EmailThreadInclude> = z.object({
  emails: z.union([z.boolean(),z.lazy(() => EmailFindManyArgsSchema)]).optional(),
  property: z.union([z.boolean(),z.lazy(() => PropertyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => EmailThreadCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const EmailThreadArgsSchema: z.ZodType<Prisma.EmailThreadDefaultArgs> = z.object({
  select: z.lazy(() => EmailThreadSelectSchema).optional(),
  include: z.lazy(() => EmailThreadIncludeSchema).optional(),
}).strict();

export const EmailThreadCountOutputTypeArgsSchema: z.ZodType<Prisma.EmailThreadCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => EmailThreadCountOutputTypeSelectSchema).nullish(),
}).strict();

export const EmailThreadCountOutputTypeSelectSchema: z.ZodType<Prisma.EmailThreadCountOutputTypeSelect> = z.object({
  emails: z.boolean().optional(),
}).strict();

export const EmailThreadSelectSchema: z.ZodType<Prisma.EmailThreadSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  propertyId: z.boolean().optional(),
  unread: z.boolean().optional(),
  parsedAttributes: z.boolean().optional(),
  emails: z.union([z.boolean(),z.lazy(() => EmailFindManyArgsSchema)]).optional(),
  property: z.union([z.boolean(),z.lazy(() => PropertyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => EmailThreadCountOutputTypeArgsSchema)]).optional(),
}).strict()

// CONTACT
//------------------------------------------------------

export const ContactIncludeSchema: z.ZodType<Prisma.ContactInclude> = z.object({
  property: z.union([z.boolean(),z.lazy(() => PropertyArgsSchema)]).optional(),
}).strict()

export const ContactArgsSchema: z.ZodType<Prisma.ContactDefaultArgs> = z.object({
  select: z.lazy(() => ContactSelectSchema).optional(),
  include: z.lazy(() => ContactIncludeSchema).optional(),
}).strict();

export const ContactSelectSchema: z.ZodType<Prisma.ContactSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  firstName: z.boolean().optional(),
  lastName: z.boolean().optional(),
  email: z.boolean().optional(),
  phone: z.boolean().optional(),
  propertyId: z.boolean().optional(),
  property: z.union([z.boolean(),z.lazy(() => PropertyArgsSchema)]).optional(),
}).strict()

// EMAIL TEMPLATE
//------------------------------------------------------

export const EmailTemplateIncludeSchema: z.ZodType<Prisma.EmailTemplateInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const EmailTemplateArgsSchema: z.ZodType<Prisma.EmailTemplateDefaultArgs> = z.object({
  select: z.lazy(() => EmailTemplateSelectSchema).optional(),
  include: z.lazy(() => EmailTemplateIncludeSchema).optional(),
}).strict();

export const EmailTemplateSelectSchema: z.ZodType<Prisma.EmailTemplateSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  userId: z.boolean().optional(),
  subject: z.boolean().optional(),
  body: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  firstName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  lastName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  emailSubscriptionId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  emailSubscriptionExpiresAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  projects: z.lazy(() => ProjectListRelationFilterSchema).optional(),
  properties: z.lazy(() => PropertyListRelationFilterSchema).optional(),
  attributes: z.lazy(() => AttributeListRelationFilterSchema).optional(),
  emailTemplate: z.union([ z.lazy(() => EmailTemplateNullableRelationFilterSchema),z.lazy(() => EmailTemplateWhereInputSchema) ]).optional().nullable(),
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  lastName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  emailSubscriptionId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  emailSubscriptionExpiresAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  projects: z.lazy(() => ProjectOrderByRelationAggregateInputSchema).optional(),
  properties: z.lazy(() => PropertyOrderByRelationAggregateInputSchema).optional(),
  attributes: z.lazy(() => AttributeOrderByRelationAggregateInputSchema).optional(),
  emailTemplate: z.lazy(() => EmailTemplateOrderByWithRelationInputSchema).optional()
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
  firstName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  lastName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  emailSubscriptionId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  emailSubscriptionExpiresAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  projects: z.lazy(() => ProjectListRelationFilterSchema).optional(),
  properties: z.lazy(() => PropertyListRelationFilterSchema).optional(),
  attributes: z.lazy(() => AttributeListRelationFilterSchema).optional(),
  emailTemplate: z.union([ z.lazy(() => EmailTemplateNullableRelationFilterSchema),z.lazy(() => EmailTemplateWhereInputSchema) ]).optional().nullable(),
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  lastName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  emailSubscriptionId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  emailSubscriptionExpiresAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional()
}).strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  firstName: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  lastName: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  emailSubscriptionId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  emailSubscriptionExpiresAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
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
  attributes: z.lazy(() => AttributesOnSurveysListRelationFilterSchema).optional()
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
  attributes: z.lazy(() => AttributesOnSurveysOrderByRelationAggregateInputSchema).optional()
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
  attributes: z.lazy(() => AttributesOnSurveysListRelationFilterSchema).optional()
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
  defaultIndex: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  owner: z.union([ z.lazy(() => UserNullableRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
  surveys: z.lazy(() => AttributesOnSurveysListRelationFilterSchema).optional()
}).strict();

export const AttributeOrderByWithRelationInputSchema: z.ZodType<Prisma.AttributeOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  label: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  defaultIndex: z.lazy(() => SortOrderSchema).optional(),
  owner: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  surveys: z.lazy(() => AttributesOnSurveysOrderByRelationAggregateInputSchema).optional()
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
  defaultIndex: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  owner: z.union([ z.lazy(() => UserNullableRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
  surveys: z.lazy(() => AttributesOnSurveysListRelationFilterSchema).optional()
}).strict());

export const AttributeOrderByWithAggregationInputSchema: z.ZodType<Prisma.AttributeOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  label: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  defaultIndex: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => AttributeCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => AttributeAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AttributeMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AttributeMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => AttributeSumOrderByAggregateInputSchema).optional()
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
  defaultIndex: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const AttributesOnSurveysWhereInputSchema: z.ZodType<Prisma.AttributesOnSurveysWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AttributesOnSurveysWhereInputSchema),z.lazy(() => AttributesOnSurveysWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AttributesOnSurveysWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AttributesOnSurveysWhereInputSchema),z.lazy(() => AttributesOnSurveysWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  attributeId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  attributeIndex: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  surveyId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  attribute: z.union([ z.lazy(() => AttributeRelationFilterSchema),z.lazy(() => AttributeWhereInputSchema) ]).optional(),
  survey: z.union([ z.lazy(() => SurveyRelationFilterSchema),z.lazy(() => SurveyWhereInputSchema) ]).optional(),
}).strict();

export const AttributesOnSurveysOrderByWithRelationInputSchema: z.ZodType<Prisma.AttributesOnSurveysOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  attributeId: z.lazy(() => SortOrderSchema).optional(),
  attributeIndex: z.lazy(() => SortOrderSchema).optional(),
  surveyId: z.lazy(() => SortOrderSchema).optional(),
  attribute: z.lazy(() => AttributeOrderByWithRelationInputSchema).optional(),
  survey: z.lazy(() => SurveyOrderByWithRelationInputSchema).optional()
}).strict();

export const AttributesOnSurveysWhereUniqueInputSchema: z.ZodType<Prisma.AttributesOnSurveysWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => AttributesOnSurveysWhereInputSchema),z.lazy(() => AttributesOnSurveysWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AttributesOnSurveysWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AttributesOnSurveysWhereInputSchema),z.lazy(() => AttributesOnSurveysWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  attributeId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  attributeIndex: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  surveyId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  attribute: z.union([ z.lazy(() => AttributeRelationFilterSchema),z.lazy(() => AttributeWhereInputSchema) ]).optional(),
  survey: z.union([ z.lazy(() => SurveyRelationFilterSchema),z.lazy(() => SurveyWhereInputSchema) ]).optional(),
}).strict());

export const AttributesOnSurveysOrderByWithAggregationInputSchema: z.ZodType<Prisma.AttributesOnSurveysOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  attributeId: z.lazy(() => SortOrderSchema).optional(),
  attributeIndex: z.lazy(() => SortOrderSchema).optional(),
  surveyId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => AttributesOnSurveysCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => AttributesOnSurveysAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AttributesOnSurveysMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AttributesOnSurveysMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => AttributesOnSurveysSumOrderByAggregateInputSchema).optional()
}).strict();

export const AttributesOnSurveysScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AttributesOnSurveysScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => AttributesOnSurveysScalarWhereWithAggregatesInputSchema),z.lazy(() => AttributesOnSurveysScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AttributesOnSurveysScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AttributesOnSurveysScalarWhereWithAggregatesInputSchema),z.lazy(() => AttributesOnSurveysScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  attributeId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  attributeIndex: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  surveyId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const PropertyWhereInputSchema: z.ZodType<Prisma.PropertyWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PropertyWhereInputSchema),z.lazy(() => PropertyWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PropertyWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PropertyWhereInputSchema),z.lazy(() => PropertyWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  photoUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  attributes: z.lazy(() => JsonNullableFilterSchema).optional(),
  displayIndex: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  surveyId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  owner: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  brochures: z.lazy(() => BrochureListRelationFilterSchema).optional(),
  survey: z.union([ z.lazy(() => SurveyRelationFilterSchema),z.lazy(() => SurveyWhereInputSchema) ]).optional(),
  contacts: z.lazy(() => ContactListRelationFilterSchema).optional(),
  emailThreads: z.lazy(() => EmailThreadListRelationFilterSchema).optional()
}).strict();

export const PropertyOrderByWithRelationInputSchema: z.ZodType<Prisma.PropertyOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  photoUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  attributes: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  displayIndex: z.lazy(() => SortOrderSchema).optional(),
  surveyId: z.lazy(() => SortOrderSchema).optional(),
  owner: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  brochures: z.lazy(() => BrochureOrderByRelationAggregateInputSchema).optional(),
  survey: z.lazy(() => SurveyOrderByWithRelationInputSchema).optional(),
  contacts: z.lazy(() => ContactOrderByRelationAggregateInputSchema).optional(),
  emailThreads: z.lazy(() => EmailThreadOrderByRelationAggregateInputSchema).optional()
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
  photoUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  attributes: z.lazy(() => JsonNullableFilterSchema).optional(),
  displayIndex: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  surveyId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  owner: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  brochures: z.lazy(() => BrochureListRelationFilterSchema).optional(),
  survey: z.union([ z.lazy(() => SurveyRelationFilterSchema),z.lazy(() => SurveyWhereInputSchema) ]).optional(),
  contacts: z.lazy(() => ContactListRelationFilterSchema).optional(),
  emailThreads: z.lazy(() => EmailThreadListRelationFilterSchema).optional()
}).strict());

export const PropertyOrderByWithAggregationInputSchema: z.ZodType<Prisma.PropertyOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  photoUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  attributes: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  displayIndex: z.lazy(() => SortOrderSchema).optional(),
  surveyId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PropertyCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => PropertyAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PropertyMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PropertyMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => PropertySumOrderByAggregateInputSchema).optional()
}).strict();

export const PropertyScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PropertyScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PropertyScalarWhereWithAggregatesInputSchema),z.lazy(() => PropertyScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PropertyScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PropertyScalarWhereWithAggregatesInputSchema),z.lazy(() => PropertyScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  photoUrl: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  attributes: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  displayIndex: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  surveyId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const BrochureWhereInputSchema: z.ZodType<Prisma.BrochureWhereInput> = z.object({
  AND: z.union([ z.lazy(() => BrochureWhereInputSchema),z.lazy(() => BrochureWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BrochureWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BrochureWhereInputSchema),z.lazy(() => BrochureWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  url: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  exportedUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  thumbnailUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  approved: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  propertyId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  inpaintedRectangles: z.lazy(() => JsonNullableFilterSchema).optional(),
  textToRemove: z.lazy(() => JsonNullableFilterSchema).optional(),
  pathsToRemove: z.lazy(() => JsonNullableFilterSchema).optional(),
  undoStack: z.lazy(() => StringNullableListFilterSchema).optional(),
  deletedPages: z.lazy(() => IntNullableListFilterSchema).optional(),
  property: z.union([ z.lazy(() => PropertyRelationFilterSchema),z.lazy(() => PropertyWhereInputSchema) ]).optional(),
}).strict();

export const BrochureOrderByWithRelationInputSchema: z.ZodType<Prisma.BrochureOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  exportedUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  thumbnailUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  approved: z.lazy(() => SortOrderSchema).optional(),
  propertyId: z.lazy(() => SortOrderSchema).optional(),
  inpaintedRectangles: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  textToRemove: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  pathsToRemove: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  undoStack: z.lazy(() => SortOrderSchema).optional(),
  deletedPages: z.lazy(() => SortOrderSchema).optional(),
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
  exportedUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  thumbnailUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  approved: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  propertyId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  inpaintedRectangles: z.lazy(() => JsonNullableFilterSchema).optional(),
  textToRemove: z.lazy(() => JsonNullableFilterSchema).optional(),
  pathsToRemove: z.lazy(() => JsonNullableFilterSchema).optional(),
  undoStack: z.lazy(() => StringNullableListFilterSchema).optional(),
  deletedPages: z.lazy(() => IntNullableListFilterSchema).optional(),
  property: z.union([ z.lazy(() => PropertyRelationFilterSchema),z.lazy(() => PropertyWhereInputSchema) ]).optional(),
}).strict());

export const BrochureOrderByWithAggregationInputSchema: z.ZodType<Prisma.BrochureOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  exportedUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  thumbnailUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  approved: z.lazy(() => SortOrderSchema).optional(),
  propertyId: z.lazy(() => SortOrderSchema).optional(),
  inpaintedRectangles: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  textToRemove: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  pathsToRemove: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  undoStack: z.lazy(() => SortOrderSchema).optional(),
  deletedPages: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => BrochureCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => BrochureAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => BrochureMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => BrochureMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => BrochureSumOrderByAggregateInputSchema).optional()
}).strict();

export const BrochureScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.BrochureScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => BrochureScalarWhereWithAggregatesInputSchema),z.lazy(() => BrochureScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => BrochureScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BrochureScalarWhereWithAggregatesInputSchema),z.lazy(() => BrochureScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  url: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  exportedUrl: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  thumbnailUrl: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  title: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  approved: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  propertyId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  inpaintedRectangles: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  textToRemove: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  pathsToRemove: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  undoStack: z.lazy(() => StringNullableListFilterSchema).optional(),
  deletedPages: z.lazy(() => IntNullableListFilterSchema).optional()
}).strict();

export const EmailWhereInputSchema: z.ZodType<Prisma.EmailWhereInput> = z.object({
  AND: z.union([ z.lazy(() => EmailWhereInputSchema),z.lazy(() => EmailWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EmailWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EmailWhereInputSchema),z.lazy(() => EmailWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  senderName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  senderEmail: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  recipientName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  recipientEmail: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  subject: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  body: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  webLink: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  isDraft: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  emailThreadId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  attachments: z.lazy(() => AttachmentListRelationFilterSchema).optional(),
  emailThread: z.union([ z.lazy(() => EmailThreadRelationFilterSchema),z.lazy(() => EmailThreadWhereInputSchema) ]).optional(),
}).strict();

export const EmailOrderByWithRelationInputSchema: z.ZodType<Prisma.EmailOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  senderName: z.lazy(() => SortOrderSchema).optional(),
  senderEmail: z.lazy(() => SortOrderSchema).optional(),
  recipientName: z.lazy(() => SortOrderSchema).optional(),
  recipientEmail: z.lazy(() => SortOrderSchema).optional(),
  subject: z.lazy(() => SortOrderSchema).optional(),
  body: z.lazy(() => SortOrderSchema).optional(),
  webLink: z.lazy(() => SortOrderSchema).optional(),
  isDraft: z.lazy(() => SortOrderSchema).optional(),
  emailThreadId: z.lazy(() => SortOrderSchema).optional(),
  attachments: z.lazy(() => AttachmentOrderByRelationAggregateInputSchema).optional(),
  emailThread: z.lazy(() => EmailThreadOrderByWithRelationInputSchema).optional()
}).strict();

export const EmailWhereUniqueInputSchema: z.ZodType<Prisma.EmailWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => EmailWhereInputSchema),z.lazy(() => EmailWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EmailWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EmailWhereInputSchema),z.lazy(() => EmailWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  senderName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  senderEmail: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  recipientName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  recipientEmail: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  subject: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  body: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  webLink: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  isDraft: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  emailThreadId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  attachments: z.lazy(() => AttachmentListRelationFilterSchema).optional(),
  emailThread: z.union([ z.lazy(() => EmailThreadRelationFilterSchema),z.lazy(() => EmailThreadWhereInputSchema) ]).optional(),
}).strict());

export const EmailOrderByWithAggregationInputSchema: z.ZodType<Prisma.EmailOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  senderName: z.lazy(() => SortOrderSchema).optional(),
  senderEmail: z.lazy(() => SortOrderSchema).optional(),
  recipientName: z.lazy(() => SortOrderSchema).optional(),
  recipientEmail: z.lazy(() => SortOrderSchema).optional(),
  subject: z.lazy(() => SortOrderSchema).optional(),
  body: z.lazy(() => SortOrderSchema).optional(),
  webLink: z.lazy(() => SortOrderSchema).optional(),
  isDraft: z.lazy(() => SortOrderSchema).optional(),
  emailThreadId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => EmailCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => EmailMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => EmailMinOrderByAggregateInputSchema).optional()
}).strict();

export const EmailScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.EmailScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => EmailScalarWhereWithAggregatesInputSchema),z.lazy(() => EmailScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => EmailScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EmailScalarWhereWithAggregatesInputSchema),z.lazy(() => EmailScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  senderName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  senderEmail: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  recipientName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  recipientEmail: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  subject: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  body: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  webLink: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  isDraft: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  emailThreadId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const AttachmentWhereInputSchema: z.ZodType<Prisma.AttachmentWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AttachmentWhereInputSchema),z.lazy(() => AttachmentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AttachmentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AttachmentWhereInputSchema),z.lazy(() => AttachmentWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  contentType: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  size: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  infoMessageDismissed: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  brochureReplaced: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  emailId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => EmailRelationFilterSchema),z.lazy(() => EmailWhereInputSchema) ]).optional(),
}).strict();

export const AttachmentOrderByWithRelationInputSchema: z.ZodType<Prisma.AttachmentOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  contentType: z.lazy(() => SortOrderSchema).optional(),
  size: z.lazy(() => SortOrderSchema).optional(),
  infoMessageDismissed: z.lazy(() => SortOrderSchema).optional(),
  brochureReplaced: z.lazy(() => SortOrderSchema).optional(),
  emailId: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => EmailOrderByWithRelationInputSchema).optional()
}).strict();

export const AttachmentWhereUniqueInputSchema: z.ZodType<Prisma.AttachmentWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => AttachmentWhereInputSchema),z.lazy(() => AttachmentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AttachmentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AttachmentWhereInputSchema),z.lazy(() => AttachmentWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  contentType: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  size: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  infoMessageDismissed: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  brochureReplaced: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  emailId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => EmailRelationFilterSchema),z.lazy(() => EmailWhereInputSchema) ]).optional(),
}).strict());

export const AttachmentOrderByWithAggregationInputSchema: z.ZodType<Prisma.AttachmentOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  contentType: z.lazy(() => SortOrderSchema).optional(),
  size: z.lazy(() => SortOrderSchema).optional(),
  infoMessageDismissed: z.lazy(() => SortOrderSchema).optional(),
  brochureReplaced: z.lazy(() => SortOrderSchema).optional(),
  emailId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => AttachmentCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => AttachmentAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AttachmentMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AttachmentMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => AttachmentSumOrderByAggregateInputSchema).optional()
}).strict();

export const AttachmentScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AttachmentScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => AttachmentScalarWhereWithAggregatesInputSchema),z.lazy(() => AttachmentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AttachmentScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AttachmentScalarWhereWithAggregatesInputSchema),z.lazy(() => AttachmentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  contentType: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  size: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  infoMessageDismissed: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  brochureReplaced: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  emailId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const EmailThreadWhereInputSchema: z.ZodType<Prisma.EmailThreadWhereInput> = z.object({
  AND: z.union([ z.lazy(() => EmailThreadWhereInputSchema),z.lazy(() => EmailThreadWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EmailThreadWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EmailThreadWhereInputSchema),z.lazy(() => EmailThreadWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  propertyId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  unread: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  parsedAttributes: z.lazy(() => JsonFilterSchema).optional(),
  emails: z.lazy(() => EmailListRelationFilterSchema).optional(),
  property: z.union([ z.lazy(() => PropertyRelationFilterSchema),z.lazy(() => PropertyWhereInputSchema) ]).optional(),
}).strict();

export const EmailThreadOrderByWithRelationInputSchema: z.ZodType<Prisma.EmailThreadOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  propertyId: z.lazy(() => SortOrderSchema).optional(),
  unread: z.lazy(() => SortOrderSchema).optional(),
  parsedAttributes: z.lazy(() => SortOrderSchema).optional(),
  emails: z.lazy(() => EmailOrderByRelationAggregateInputSchema).optional(),
  property: z.lazy(() => PropertyOrderByWithRelationInputSchema).optional()
}).strict();

export const EmailThreadWhereUniqueInputSchema: z.ZodType<Prisma.EmailThreadWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => EmailThreadWhereInputSchema),z.lazy(() => EmailThreadWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EmailThreadWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EmailThreadWhereInputSchema),z.lazy(() => EmailThreadWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  propertyId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  unread: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  parsedAttributes: z.lazy(() => JsonFilterSchema).optional(),
  emails: z.lazy(() => EmailListRelationFilterSchema).optional(),
  property: z.union([ z.lazy(() => PropertyRelationFilterSchema),z.lazy(() => PropertyWhereInputSchema) ]).optional(),
}).strict());

export const EmailThreadOrderByWithAggregationInputSchema: z.ZodType<Prisma.EmailThreadOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  propertyId: z.lazy(() => SortOrderSchema).optional(),
  unread: z.lazy(() => SortOrderSchema).optional(),
  parsedAttributes: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => EmailThreadCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => EmailThreadMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => EmailThreadMinOrderByAggregateInputSchema).optional()
}).strict();

export const EmailThreadScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.EmailThreadScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => EmailThreadScalarWhereWithAggregatesInputSchema),z.lazy(() => EmailThreadScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => EmailThreadScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EmailThreadScalarWhereWithAggregatesInputSchema),z.lazy(() => EmailThreadScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  propertyId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  unread: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  parsedAttributes: z.lazy(() => JsonWithAggregatesFilterSchema).optional()
}).strict();

export const ContactWhereInputSchema: z.ZodType<Prisma.ContactWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ContactWhereInputSchema),z.lazy(() => ContactWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContactWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContactWhereInputSchema),z.lazy(() => ContactWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  firstName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lastName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  phone: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  propertyId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  property: z.union([ z.lazy(() => PropertyRelationFilterSchema),z.lazy(() => PropertyWhereInputSchema) ]).optional(),
}).strict();

export const ContactOrderByWithRelationInputSchema: z.ZodType<Prisma.ContactOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  propertyId: z.lazy(() => SortOrderSchema).optional(),
  property: z.lazy(() => PropertyOrderByWithRelationInputSchema).optional()
}).strict();

export const ContactWhereUniqueInputSchema: z.ZodType<Prisma.ContactWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => ContactWhereInputSchema),z.lazy(() => ContactWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContactWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContactWhereInputSchema),z.lazy(() => ContactWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  firstName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lastName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  phone: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  propertyId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  property: z.union([ z.lazy(() => PropertyRelationFilterSchema),z.lazy(() => PropertyWhereInputSchema) ]).optional(),
}).strict());

export const ContactOrderByWithAggregationInputSchema: z.ZodType<Prisma.ContactOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  propertyId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ContactCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ContactMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ContactMinOrderByAggregateInputSchema).optional()
}).strict();

export const ContactScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ContactScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ContactScalarWhereWithAggregatesInputSchema),z.lazy(() => ContactScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContactScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContactScalarWhereWithAggregatesInputSchema),z.lazy(() => ContactScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  firstName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  lastName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  phone: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  propertyId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const EmailTemplateWhereInputSchema: z.ZodType<Prisma.EmailTemplateWhereInput> = z.object({
  AND: z.union([ z.lazy(() => EmailTemplateWhereInputSchema),z.lazy(() => EmailTemplateWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EmailTemplateWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EmailTemplateWhereInputSchema),z.lazy(() => EmailTemplateWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  subject: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  body: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const EmailTemplateOrderByWithRelationInputSchema: z.ZodType<Prisma.EmailTemplateOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  subject: z.lazy(() => SortOrderSchema).optional(),
  body: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const EmailTemplateWhereUniqueInputSchema: z.ZodType<Prisma.EmailTemplateWhereUniqueInput> = z.union([
  z.object({
    id: z.string(),
    userId: z.string()
  }),
  z.object({
    id: z.string(),
  }),
  z.object({
    userId: z.string(),
  }),
])
.and(z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
  AND: z.union([ z.lazy(() => EmailTemplateWhereInputSchema),z.lazy(() => EmailTemplateWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EmailTemplateWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EmailTemplateWhereInputSchema),z.lazy(() => EmailTemplateWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  subject: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  body: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const EmailTemplateOrderByWithAggregationInputSchema: z.ZodType<Prisma.EmailTemplateOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  subject: z.lazy(() => SortOrderSchema).optional(),
  body: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => EmailTemplateCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => EmailTemplateMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => EmailTemplateMinOrderByAggregateInputSchema).optional()
}).strict();

export const EmailTemplateScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.EmailTemplateScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => EmailTemplateScalarWhereWithAggregatesInputSchema),z.lazy(() => EmailTemplateScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => EmailTemplateScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EmailTemplateScalarWhereWithAggregatesInputSchema),z.lazy(() => EmailTemplateScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  subject: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  body: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  emailSubscriptionId: z.string().optional().nullable(),
  emailSubscriptionExpiresAt: z.coerce.date().optional().nullable(),
  projects: z.lazy(() => ProjectCreateNestedManyWithoutOwnerInputSchema).optional(),
  properties: z.lazy(() => PropertyCreateNestedManyWithoutOwnerInputSchema).optional(),
  attributes: z.lazy(() => AttributeCreateNestedManyWithoutOwnerInputSchema).optional(),
  emailTemplate: z.lazy(() => EmailTemplateCreateNestedOneWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  emailSubscriptionId: z.string().optional().nullable(),
  emailSubscriptionExpiresAt: z.coerce.date().optional().nullable(),
  projects: z.lazy(() => ProjectUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  properties: z.lazy(() => PropertyUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  attributes: z.lazy(() => AttributeUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  emailTemplate: z.lazy(() => EmailTemplateUncheckedCreateNestedOneWithoutUserInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailSubscriptionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailSubscriptionExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  projects: z.lazy(() => ProjectUpdateManyWithoutOwnerNestedInputSchema).optional(),
  properties: z.lazy(() => PropertyUpdateManyWithoutOwnerNestedInputSchema).optional(),
  attributes: z.lazy(() => AttributeUpdateManyWithoutOwnerNestedInputSchema).optional(),
  emailTemplate: z.lazy(() => EmailTemplateUpdateOneWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailSubscriptionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailSubscriptionExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  projects: z.lazy(() => ProjectUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  properties: z.lazy(() => PropertyUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  attributes: z.lazy(() => AttributeUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  emailTemplate: z.lazy(() => EmailTemplateUncheckedUpdateOneWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  emailSubscriptionId: z.string().optional().nullable(),
  emailSubscriptionExpiresAt: z.coerce.date().optional().nullable()
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailSubscriptionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailSubscriptionExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailSubscriptionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailSubscriptionExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
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
  attributes: z.lazy(() => AttributesOnSurveysCreateNestedManyWithoutSurveyInputSchema).optional()
}).strict();

export const SurveyUncheckedCreateInputSchema: z.ZodType<Prisma.SurveyUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  ownerId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  projectId: z.string(),
  properties: z.lazy(() => PropertyUncheckedCreateNestedManyWithoutSurveyInputSchema).optional(),
  attributes: z.lazy(() => AttributesOnSurveysUncheckedCreateNestedManyWithoutSurveyInputSchema).optional()
}).strict();

export const SurveyUpdateInputSchema: z.ZodType<Prisma.SurveyUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  project: z.lazy(() => ProjectUpdateOneRequiredWithoutSurveysNestedInputSchema).optional(),
  properties: z.lazy(() => PropertyUpdateManyWithoutSurveyNestedInputSchema).optional(),
  attributes: z.lazy(() => AttributesOnSurveysUpdateManyWithoutSurveyNestedInputSchema).optional()
}).strict();

export const SurveyUncheckedUpdateInputSchema: z.ZodType<Prisma.SurveyUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  properties: z.lazy(() => PropertyUncheckedUpdateManyWithoutSurveyNestedInputSchema).optional(),
  attributes: z.lazy(() => AttributesOnSurveysUncheckedUpdateManyWithoutSurveyNestedInputSchema).optional()
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

export const AttributeCreateInputSchema: z.ZodType<Prisma.AttributeCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  label: z.string(),
  type: z.string(),
  defaultIndex: z.number().int().optional(),
  owner: z.lazy(() => UserCreateNestedOneWithoutAttributesInputSchema).optional(),
  surveys: z.lazy(() => AttributesOnSurveysCreateNestedManyWithoutAttributeInputSchema).optional()
}).strict();

export const AttributeUncheckedCreateInputSchema: z.ZodType<Prisma.AttributeUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  label: z.string(),
  type: z.string(),
  ownerId: z.string().optional().nullable(),
  defaultIndex: z.number().int().optional(),
  surveys: z.lazy(() => AttributesOnSurveysUncheckedCreateNestedManyWithoutAttributeInputSchema).optional()
}).strict();

export const AttributeUpdateInputSchema: z.ZodType<Prisma.AttributeUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  defaultIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneWithoutAttributesNestedInputSchema).optional(),
  surveys: z.lazy(() => AttributesOnSurveysUpdateManyWithoutAttributeNestedInputSchema).optional()
}).strict();

export const AttributeUncheckedUpdateInputSchema: z.ZodType<Prisma.AttributeUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  defaultIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  surveys: z.lazy(() => AttributesOnSurveysUncheckedUpdateManyWithoutAttributeNestedInputSchema).optional()
}).strict();

export const AttributeCreateManyInputSchema: z.ZodType<Prisma.AttributeCreateManyInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  label: z.string(),
  type: z.string(),
  ownerId: z.string().optional().nullable(),
  defaultIndex: z.number().int().optional()
}).strict();

export const AttributeUpdateManyMutationInputSchema: z.ZodType<Prisma.AttributeUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  defaultIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AttributeUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AttributeUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  defaultIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AttributesOnSurveysCreateInputSchema: z.ZodType<Prisma.AttributesOnSurveysCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  attributeIndex: z.number().int(),
  attribute: z.lazy(() => AttributeCreateNestedOneWithoutSurveysInputSchema),
  survey: z.lazy(() => SurveyCreateNestedOneWithoutAttributesInputSchema)
}).strict();

export const AttributesOnSurveysUncheckedCreateInputSchema: z.ZodType<Prisma.AttributesOnSurveysUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  attributeId: z.string(),
  attributeIndex: z.number().int(),
  surveyId: z.string()
}).strict();

export const AttributesOnSurveysUpdateInputSchema: z.ZodType<Prisma.AttributesOnSurveysUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  attributeIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  attribute: z.lazy(() => AttributeUpdateOneRequiredWithoutSurveysNestedInputSchema).optional(),
  survey: z.lazy(() => SurveyUpdateOneRequiredWithoutAttributesNestedInputSchema).optional()
}).strict();

export const AttributesOnSurveysUncheckedUpdateInputSchema: z.ZodType<Prisma.AttributesOnSurveysUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  attributeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  attributeIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  surveyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AttributesOnSurveysCreateManyInputSchema: z.ZodType<Prisma.AttributesOnSurveysCreateManyInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  attributeId: z.string(),
  attributeIndex: z.number().int(),
  surveyId: z.string()
}).strict();

export const AttributesOnSurveysUpdateManyMutationInputSchema: z.ZodType<Prisma.AttributesOnSurveysUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  attributeIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AttributesOnSurveysUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AttributesOnSurveysUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  attributeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  attributeIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  surveyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PropertyCreateInputSchema: z.ZodType<Prisma.PropertyCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  photoUrl: z.string().optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  displayIndex: z.number().int(),
  owner: z.lazy(() => UserCreateNestedOneWithoutPropertiesInputSchema),
  brochures: z.lazy(() => BrochureCreateNestedManyWithoutPropertyInputSchema).optional(),
  survey: z.lazy(() => SurveyCreateNestedOneWithoutPropertiesInputSchema),
  contacts: z.lazy(() => ContactCreateNestedManyWithoutPropertyInputSchema).optional(),
  emailThreads: z.lazy(() => EmailThreadCreateNestedManyWithoutPropertyInputSchema).optional()
}).strict();

export const PropertyUncheckedCreateInputSchema: z.ZodType<Prisma.PropertyUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  ownerId: z.string(),
  photoUrl: z.string().optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  displayIndex: z.number().int(),
  surveyId: z.string(),
  brochures: z.lazy(() => BrochureUncheckedCreateNestedManyWithoutPropertyInputSchema).optional(),
  contacts: z.lazy(() => ContactUncheckedCreateNestedManyWithoutPropertyInputSchema).optional(),
  emailThreads: z.lazy(() => EmailThreadUncheckedCreateNestedManyWithoutPropertyInputSchema).optional()
}).strict();

export const PropertyUpdateInputSchema: z.ZodType<Prisma.PropertyUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  photoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  displayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutPropertiesNestedInputSchema).optional(),
  brochures: z.lazy(() => BrochureUpdateManyWithoutPropertyNestedInputSchema).optional(),
  survey: z.lazy(() => SurveyUpdateOneRequiredWithoutPropertiesNestedInputSchema).optional(),
  contacts: z.lazy(() => ContactUpdateManyWithoutPropertyNestedInputSchema).optional(),
  emailThreads: z.lazy(() => EmailThreadUpdateManyWithoutPropertyNestedInputSchema).optional()
}).strict();

export const PropertyUncheckedUpdateInputSchema: z.ZodType<Prisma.PropertyUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  photoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  displayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  surveyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  brochures: z.lazy(() => BrochureUncheckedUpdateManyWithoutPropertyNestedInputSchema).optional(),
  contacts: z.lazy(() => ContactUncheckedUpdateManyWithoutPropertyNestedInputSchema).optional(),
  emailThreads: z.lazy(() => EmailThreadUncheckedUpdateManyWithoutPropertyNestedInputSchema).optional()
}).strict();

export const PropertyCreateManyInputSchema: z.ZodType<Prisma.PropertyCreateManyInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  ownerId: z.string(),
  photoUrl: z.string().optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  displayIndex: z.number().int(),
  surveyId: z.string()
}).strict();

export const PropertyUpdateManyMutationInputSchema: z.ZodType<Prisma.PropertyUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  photoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  displayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PropertyUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PropertyUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  photoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  displayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  surveyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BrochureCreateInputSchema: z.ZodType<Prisma.BrochureCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  url: z.string(),
  exportedUrl: z.string().optional().nullable(),
  thumbnailUrl: z.string().optional().nullable(),
  title: z.string(),
  approved: z.boolean().optional(),
  inpaintedRectangles: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  textToRemove: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pathsToRemove: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  undoStack: z.union([ z.lazy(() => BrochureCreateundoStackInputSchema),z.string().array() ]).optional(),
  deletedPages: z.union([ z.lazy(() => BrochureCreatedeletedPagesInputSchema),z.number().int().array() ]).optional(),
  property: z.lazy(() => PropertyCreateNestedOneWithoutBrochuresInputSchema)
}).strict();

export const BrochureUncheckedCreateInputSchema: z.ZodType<Prisma.BrochureUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  url: z.string(),
  exportedUrl: z.string().optional().nullable(),
  thumbnailUrl: z.string().optional().nullable(),
  title: z.string(),
  approved: z.boolean().optional(),
  propertyId: z.string(),
  inpaintedRectangles: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  textToRemove: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pathsToRemove: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  undoStack: z.union([ z.lazy(() => BrochureCreateundoStackInputSchema),z.string().array() ]).optional(),
  deletedPages: z.union([ z.lazy(() => BrochureCreatedeletedPagesInputSchema),z.number().int().array() ]).optional(),
}).strict();

export const BrochureUpdateInputSchema: z.ZodType<Prisma.BrochureUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exportedUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  thumbnailUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  approved: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  inpaintedRectangles: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  textToRemove: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pathsToRemove: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  undoStack: z.union([ z.lazy(() => BrochureUpdateundoStackInputSchema),z.string().array() ]).optional(),
  deletedPages: z.union([ z.lazy(() => BrochureUpdatedeletedPagesInputSchema),z.number().int().array() ]).optional(),
  property: z.lazy(() => PropertyUpdateOneRequiredWithoutBrochuresNestedInputSchema).optional()
}).strict();

export const BrochureUncheckedUpdateInputSchema: z.ZodType<Prisma.BrochureUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exportedUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  thumbnailUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  approved: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  propertyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inpaintedRectangles: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  textToRemove: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pathsToRemove: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  undoStack: z.union([ z.lazy(() => BrochureUpdateundoStackInputSchema),z.string().array() ]).optional(),
  deletedPages: z.union([ z.lazy(() => BrochureUpdatedeletedPagesInputSchema),z.number().int().array() ]).optional(),
}).strict();

export const BrochureCreateManyInputSchema: z.ZodType<Prisma.BrochureCreateManyInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  url: z.string(),
  exportedUrl: z.string().optional().nullable(),
  thumbnailUrl: z.string().optional().nullable(),
  title: z.string(),
  approved: z.boolean().optional(),
  propertyId: z.string(),
  inpaintedRectangles: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  textToRemove: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pathsToRemove: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  undoStack: z.union([ z.lazy(() => BrochureCreateundoStackInputSchema),z.string().array() ]).optional(),
  deletedPages: z.union([ z.lazy(() => BrochureCreatedeletedPagesInputSchema),z.number().int().array() ]).optional(),
}).strict();

export const BrochureUpdateManyMutationInputSchema: z.ZodType<Prisma.BrochureUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exportedUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  thumbnailUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  approved: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  inpaintedRectangles: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  textToRemove: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pathsToRemove: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  undoStack: z.union([ z.lazy(() => BrochureUpdateundoStackInputSchema),z.string().array() ]).optional(),
  deletedPages: z.union([ z.lazy(() => BrochureUpdatedeletedPagesInputSchema),z.number().int().array() ]).optional(),
}).strict();

export const BrochureUncheckedUpdateManyInputSchema: z.ZodType<Prisma.BrochureUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exportedUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  thumbnailUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  approved: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  propertyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inpaintedRectangles: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  textToRemove: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pathsToRemove: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  undoStack: z.union([ z.lazy(() => BrochureUpdateundoStackInputSchema),z.string().array() ]).optional(),
  deletedPages: z.union([ z.lazy(() => BrochureUpdatedeletedPagesInputSchema),z.number().int().array() ]).optional(),
}).strict();

export const EmailCreateInputSchema: z.ZodType<Prisma.EmailCreateInput> = z.object({
  id: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  senderName: z.string(),
  senderEmail: z.string(),
  recipientName: z.string(),
  recipientEmail: z.string(),
  subject: z.string().optional(),
  body: z.string(),
  webLink: z.string(),
  isDraft: z.boolean().optional(),
  attachments: z.lazy(() => AttachmentCreateNestedManyWithoutEmailInputSchema).optional(),
  emailThread: z.lazy(() => EmailThreadCreateNestedOneWithoutEmailsInputSchema)
}).strict();

export const EmailUncheckedCreateInputSchema: z.ZodType<Prisma.EmailUncheckedCreateInput> = z.object({
  id: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  senderName: z.string(),
  senderEmail: z.string(),
  recipientName: z.string(),
  recipientEmail: z.string(),
  subject: z.string().optional(),
  body: z.string(),
  webLink: z.string(),
  isDraft: z.boolean().optional(),
  emailThreadId: z.string(),
  attachments: z.lazy(() => AttachmentUncheckedCreateNestedManyWithoutEmailInputSchema).optional()
}).strict();

export const EmailUpdateInputSchema: z.ZodType<Prisma.EmailUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  senderName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  senderEmail: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  recipientName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  recipientEmail: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subject: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  body: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  webLink: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDraft: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  attachments: z.lazy(() => AttachmentUpdateManyWithoutEmailNestedInputSchema).optional(),
  emailThread: z.lazy(() => EmailThreadUpdateOneRequiredWithoutEmailsNestedInputSchema).optional()
}).strict();

export const EmailUncheckedUpdateInputSchema: z.ZodType<Prisma.EmailUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  senderName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  senderEmail: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  recipientName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  recipientEmail: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subject: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  body: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  webLink: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDraft: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  emailThreadId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  attachments: z.lazy(() => AttachmentUncheckedUpdateManyWithoutEmailNestedInputSchema).optional()
}).strict();

export const EmailCreateManyInputSchema: z.ZodType<Prisma.EmailCreateManyInput> = z.object({
  id: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  senderName: z.string(),
  senderEmail: z.string(),
  recipientName: z.string(),
  recipientEmail: z.string(),
  subject: z.string().optional(),
  body: z.string(),
  webLink: z.string(),
  isDraft: z.boolean().optional(),
  emailThreadId: z.string()
}).strict();

export const EmailUpdateManyMutationInputSchema: z.ZodType<Prisma.EmailUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  senderName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  senderEmail: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  recipientName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  recipientEmail: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subject: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  body: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  webLink: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDraft: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EmailUncheckedUpdateManyInputSchema: z.ZodType<Prisma.EmailUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  senderName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  senderEmail: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  recipientName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  recipientEmail: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subject: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  body: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  webLink: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDraft: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  emailThreadId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AttachmentCreateInputSchema: z.ZodType<Prisma.AttachmentCreateInput> = z.object({
  id: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  contentType: z.string(),
  size: z.number().int(),
  infoMessageDismissed: z.boolean().optional(),
  brochureReplaced: z.boolean().optional(),
  email: z.lazy(() => EmailCreateNestedOneWithoutAttachmentsInputSchema)
}).strict();

export const AttachmentUncheckedCreateInputSchema: z.ZodType<Prisma.AttachmentUncheckedCreateInput> = z.object({
  id: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  contentType: z.string(),
  size: z.number().int(),
  infoMessageDismissed: z.boolean().optional(),
  brochureReplaced: z.boolean().optional(),
  emailId: z.string()
}).strict();

export const AttachmentUpdateInputSchema: z.ZodType<Prisma.AttachmentUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contentType: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  size: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  infoMessageDismissed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  brochureReplaced: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.lazy(() => EmailUpdateOneRequiredWithoutAttachmentsNestedInputSchema).optional()
}).strict();

export const AttachmentUncheckedUpdateInputSchema: z.ZodType<Prisma.AttachmentUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contentType: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  size: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  infoMessageDismissed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  brochureReplaced: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  emailId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AttachmentCreateManyInputSchema: z.ZodType<Prisma.AttachmentCreateManyInput> = z.object({
  id: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  contentType: z.string(),
  size: z.number().int(),
  infoMessageDismissed: z.boolean().optional(),
  brochureReplaced: z.boolean().optional(),
  emailId: z.string()
}).strict();

export const AttachmentUpdateManyMutationInputSchema: z.ZodType<Prisma.AttachmentUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contentType: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  size: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  infoMessageDismissed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  brochureReplaced: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AttachmentUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AttachmentUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contentType: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  size: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  infoMessageDismissed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  brochureReplaced: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  emailId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EmailThreadCreateInputSchema: z.ZodType<Prisma.EmailThreadCreateInput> = z.object({
  id: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  unread: z.boolean().optional(),
  parsedAttributes: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  emails: z.lazy(() => EmailCreateNestedManyWithoutEmailThreadInputSchema).optional(),
  property: z.lazy(() => PropertyCreateNestedOneWithoutEmailThreadsInputSchema)
}).strict();

export const EmailThreadUncheckedCreateInputSchema: z.ZodType<Prisma.EmailThreadUncheckedCreateInput> = z.object({
  id: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  propertyId: z.string(),
  unread: z.boolean().optional(),
  parsedAttributes: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  emails: z.lazy(() => EmailUncheckedCreateNestedManyWithoutEmailThreadInputSchema).optional()
}).strict();

export const EmailThreadUpdateInputSchema: z.ZodType<Prisma.EmailThreadUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  unread: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  parsedAttributes: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  emails: z.lazy(() => EmailUpdateManyWithoutEmailThreadNestedInputSchema).optional(),
  property: z.lazy(() => PropertyUpdateOneRequiredWithoutEmailThreadsNestedInputSchema).optional()
}).strict();

export const EmailThreadUncheckedUpdateInputSchema: z.ZodType<Prisma.EmailThreadUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  propertyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  unread: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  parsedAttributes: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  emails: z.lazy(() => EmailUncheckedUpdateManyWithoutEmailThreadNestedInputSchema).optional()
}).strict();

export const EmailThreadCreateManyInputSchema: z.ZodType<Prisma.EmailThreadCreateManyInput> = z.object({
  id: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  propertyId: z.string(),
  unread: z.boolean().optional(),
  parsedAttributes: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const EmailThreadUpdateManyMutationInputSchema: z.ZodType<Prisma.EmailThreadUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  unread: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  parsedAttributes: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const EmailThreadUncheckedUpdateManyInputSchema: z.ZodType<Prisma.EmailThreadUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  propertyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  unread: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  parsedAttributes: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const ContactCreateInputSchema: z.ZodType<Prisma.ContactCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string().optional().nullable(),
  property: z.lazy(() => PropertyCreateNestedOneWithoutContactsInputSchema)
}).strict();

export const ContactUncheckedCreateInputSchema: z.ZodType<Prisma.ContactUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string().optional().nullable(),
  propertyId: z.string()
}).strict();

export const ContactUpdateInputSchema: z.ZodType<Prisma.ContactUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  property: z.lazy(() => PropertyUpdateOneRequiredWithoutContactsNestedInputSchema).optional()
}).strict();

export const ContactUncheckedUpdateInputSchema: z.ZodType<Prisma.ContactUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  propertyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContactCreateManyInputSchema: z.ZodType<Prisma.ContactCreateManyInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string().optional().nullable(),
  propertyId: z.string()
}).strict();

export const ContactUpdateManyMutationInputSchema: z.ZodType<Prisma.ContactUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ContactUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ContactUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  propertyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EmailTemplateCreateInputSchema: z.ZodType<Prisma.EmailTemplateCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  subject: z.string(),
  body: z.string(),
  user: z.lazy(() => UserCreateNestedOneWithoutEmailTemplateInputSchema)
}).strict();

export const EmailTemplateUncheckedCreateInputSchema: z.ZodType<Prisma.EmailTemplateUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  userId: z.string(),
  subject: z.string(),
  body: z.string()
}).strict();

export const EmailTemplateUpdateInputSchema: z.ZodType<Prisma.EmailTemplateUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  subject: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  body: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutEmailTemplateNestedInputSchema).optional()
}).strict();

export const EmailTemplateUncheckedUpdateInputSchema: z.ZodType<Prisma.EmailTemplateUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subject: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  body: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EmailTemplateCreateManyInputSchema: z.ZodType<Prisma.EmailTemplateCreateManyInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  userId: z.string(),
  subject: z.string(),
  body: z.string()
}).strict();

export const EmailTemplateUpdateManyMutationInputSchema: z.ZodType<Prisma.EmailTemplateUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  subject: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  body: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EmailTemplateUncheckedUpdateManyInputSchema: z.ZodType<Prisma.EmailTemplateUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subject: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  body: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
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

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
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

export const EmailTemplateNullableRelationFilterSchema: z.ZodType<Prisma.EmailTemplateNullableRelationFilter> = z.object({
  is: z.lazy(() => EmailTemplateWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => EmailTemplateWhereInputSchema).optional().nullable()
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
  email: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  emailSubscriptionId: z.lazy(() => SortOrderSchema).optional(),
  emailSubscriptionExpiresAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  emailSubscriptionId: z.lazy(() => SortOrderSchema).optional(),
  emailSubscriptionExpiresAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  emailSubscriptionId: z.lazy(() => SortOrderSchema).optional(),
  emailSubscriptionExpiresAt: z.lazy(() => SortOrderSchema).optional()
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

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
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

export const AttributesOnSurveysListRelationFilterSchema: z.ZodType<Prisma.AttributesOnSurveysListRelationFilter> = z.object({
  every: z.lazy(() => AttributesOnSurveysWhereInputSchema).optional(),
  some: z.lazy(() => AttributesOnSurveysWhereInputSchema).optional(),
  none: z.lazy(() => AttributesOnSurveysWhereInputSchema).optional()
}).strict();

export const AttributesOnSurveysOrderByRelationAggregateInputSchema: z.ZodType<Prisma.AttributesOnSurveysOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
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

export const UserNullableRelationFilterSchema: z.ZodType<Prisma.UserNullableRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => UserWhereInputSchema).optional().nullable()
}).strict();

export const AttributeCountOrderByAggregateInputSchema: z.ZodType<Prisma.AttributeCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  label: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  defaultIndex: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AttributeAvgOrderByAggregateInputSchema: z.ZodType<Prisma.AttributeAvgOrderByAggregateInput> = z.object({
  defaultIndex: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AttributeMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AttributeMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  label: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  defaultIndex: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AttributeMinOrderByAggregateInputSchema: z.ZodType<Prisma.AttributeMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  label: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  defaultIndex: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AttributeSumOrderByAggregateInputSchema: z.ZodType<Prisma.AttributeSumOrderByAggregateInput> = z.object({
  defaultIndex: z.lazy(() => SortOrderSchema).optional()
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

export const AttributeRelationFilterSchema: z.ZodType<Prisma.AttributeRelationFilter> = z.object({
  is: z.lazy(() => AttributeWhereInputSchema).optional(),
  isNot: z.lazy(() => AttributeWhereInputSchema).optional()
}).strict();

export const SurveyRelationFilterSchema: z.ZodType<Prisma.SurveyRelationFilter> = z.object({
  is: z.lazy(() => SurveyWhereInputSchema).optional(),
  isNot: z.lazy(() => SurveyWhereInputSchema).optional()
}).strict();

export const AttributesOnSurveysCountOrderByAggregateInputSchema: z.ZodType<Prisma.AttributesOnSurveysCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  attributeId: z.lazy(() => SortOrderSchema).optional(),
  attributeIndex: z.lazy(() => SortOrderSchema).optional(),
  surveyId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AttributesOnSurveysAvgOrderByAggregateInputSchema: z.ZodType<Prisma.AttributesOnSurveysAvgOrderByAggregateInput> = z.object({
  attributeIndex: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AttributesOnSurveysMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AttributesOnSurveysMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  attributeId: z.lazy(() => SortOrderSchema).optional(),
  attributeIndex: z.lazy(() => SortOrderSchema).optional(),
  surveyId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AttributesOnSurveysMinOrderByAggregateInputSchema: z.ZodType<Prisma.AttributesOnSurveysMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  attributeId: z.lazy(() => SortOrderSchema).optional(),
  attributeIndex: z.lazy(() => SortOrderSchema).optional(),
  surveyId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AttributesOnSurveysSumOrderByAggregateInputSchema: z.ZodType<Prisma.AttributesOnSurveysSumOrderByAggregateInput> = z.object({
  attributeIndex: z.lazy(() => SortOrderSchema).optional()
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

export const ContactListRelationFilterSchema: z.ZodType<Prisma.ContactListRelationFilter> = z.object({
  every: z.lazy(() => ContactWhereInputSchema).optional(),
  some: z.lazy(() => ContactWhereInputSchema).optional(),
  none: z.lazy(() => ContactWhereInputSchema).optional()
}).strict();

export const EmailThreadListRelationFilterSchema: z.ZodType<Prisma.EmailThreadListRelationFilter> = z.object({
  every: z.lazy(() => EmailThreadWhereInputSchema).optional(),
  some: z.lazy(() => EmailThreadWhereInputSchema).optional(),
  none: z.lazy(() => EmailThreadWhereInputSchema).optional()
}).strict();

export const BrochureOrderByRelationAggregateInputSchema: z.ZodType<Prisma.BrochureOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContactOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ContactOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EmailThreadOrderByRelationAggregateInputSchema: z.ZodType<Prisma.EmailThreadOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PropertyCountOrderByAggregateInputSchema: z.ZodType<Prisma.PropertyCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  photoUrl: z.lazy(() => SortOrderSchema).optional(),
  attributes: z.lazy(() => SortOrderSchema).optional(),
  displayIndex: z.lazy(() => SortOrderSchema).optional(),
  surveyId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PropertyAvgOrderByAggregateInputSchema: z.ZodType<Prisma.PropertyAvgOrderByAggregateInput> = z.object({
  displayIndex: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PropertyMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PropertyMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  photoUrl: z.lazy(() => SortOrderSchema).optional(),
  displayIndex: z.lazy(() => SortOrderSchema).optional(),
  surveyId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PropertyMinOrderByAggregateInputSchema: z.ZodType<Prisma.PropertyMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  photoUrl: z.lazy(() => SortOrderSchema).optional(),
  displayIndex: z.lazy(() => SortOrderSchema).optional(),
  surveyId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PropertySumOrderByAggregateInputSchema: z.ZodType<Prisma.PropertySumOrderByAggregateInput> = z.object({
  displayIndex: z.lazy(() => SortOrderSchema).optional()
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

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const StringNullableListFilterSchema: z.ZodType<Prisma.StringNullableListFilter> = z.object({
  equals: z.string().array().optional().nullable(),
  has: z.string().optional().nullable(),
  hasEvery: z.string().array().optional(),
  hasSome: z.string().array().optional(),
  isEmpty: z.boolean().optional()
}).strict();

export const IntNullableListFilterSchema: z.ZodType<Prisma.IntNullableListFilter> = z.object({
  equals: z.number().array().optional().nullable(),
  has: z.number().optional().nullable(),
  hasEvery: z.number().array().optional(),
  hasSome: z.number().array().optional(),
  isEmpty: z.boolean().optional()
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
  exportedUrl: z.lazy(() => SortOrderSchema).optional(),
  thumbnailUrl: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  approved: z.lazy(() => SortOrderSchema).optional(),
  propertyId: z.lazy(() => SortOrderSchema).optional(),
  inpaintedRectangles: z.lazy(() => SortOrderSchema).optional(),
  textToRemove: z.lazy(() => SortOrderSchema).optional(),
  pathsToRemove: z.lazy(() => SortOrderSchema).optional(),
  undoStack: z.lazy(() => SortOrderSchema).optional(),
  deletedPages: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BrochureAvgOrderByAggregateInputSchema: z.ZodType<Prisma.BrochureAvgOrderByAggregateInput> = z.object({
  deletedPages: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BrochureMaxOrderByAggregateInputSchema: z.ZodType<Prisma.BrochureMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  exportedUrl: z.lazy(() => SortOrderSchema).optional(),
  thumbnailUrl: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  approved: z.lazy(() => SortOrderSchema).optional(),
  propertyId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BrochureMinOrderByAggregateInputSchema: z.ZodType<Prisma.BrochureMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  exportedUrl: z.lazy(() => SortOrderSchema).optional(),
  thumbnailUrl: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  approved: z.lazy(() => SortOrderSchema).optional(),
  propertyId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BrochureSumOrderByAggregateInputSchema: z.ZodType<Prisma.BrochureSumOrderByAggregateInput> = z.object({
  deletedPages: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const AttachmentListRelationFilterSchema: z.ZodType<Prisma.AttachmentListRelationFilter> = z.object({
  every: z.lazy(() => AttachmentWhereInputSchema).optional(),
  some: z.lazy(() => AttachmentWhereInputSchema).optional(),
  none: z.lazy(() => AttachmentWhereInputSchema).optional()
}).strict();

export const EmailThreadRelationFilterSchema: z.ZodType<Prisma.EmailThreadRelationFilter> = z.object({
  is: z.lazy(() => EmailThreadWhereInputSchema).optional(),
  isNot: z.lazy(() => EmailThreadWhereInputSchema).optional()
}).strict();

export const AttachmentOrderByRelationAggregateInputSchema: z.ZodType<Prisma.AttachmentOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EmailCountOrderByAggregateInputSchema: z.ZodType<Prisma.EmailCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  senderName: z.lazy(() => SortOrderSchema).optional(),
  senderEmail: z.lazy(() => SortOrderSchema).optional(),
  recipientName: z.lazy(() => SortOrderSchema).optional(),
  recipientEmail: z.lazy(() => SortOrderSchema).optional(),
  subject: z.lazy(() => SortOrderSchema).optional(),
  body: z.lazy(() => SortOrderSchema).optional(),
  webLink: z.lazy(() => SortOrderSchema).optional(),
  isDraft: z.lazy(() => SortOrderSchema).optional(),
  emailThreadId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EmailMaxOrderByAggregateInputSchema: z.ZodType<Prisma.EmailMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  senderName: z.lazy(() => SortOrderSchema).optional(),
  senderEmail: z.lazy(() => SortOrderSchema).optional(),
  recipientName: z.lazy(() => SortOrderSchema).optional(),
  recipientEmail: z.lazy(() => SortOrderSchema).optional(),
  subject: z.lazy(() => SortOrderSchema).optional(),
  body: z.lazy(() => SortOrderSchema).optional(),
  webLink: z.lazy(() => SortOrderSchema).optional(),
  isDraft: z.lazy(() => SortOrderSchema).optional(),
  emailThreadId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EmailMinOrderByAggregateInputSchema: z.ZodType<Prisma.EmailMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  senderName: z.lazy(() => SortOrderSchema).optional(),
  senderEmail: z.lazy(() => SortOrderSchema).optional(),
  recipientName: z.lazy(() => SortOrderSchema).optional(),
  recipientEmail: z.lazy(() => SortOrderSchema).optional(),
  subject: z.lazy(() => SortOrderSchema).optional(),
  body: z.lazy(() => SortOrderSchema).optional(),
  webLink: z.lazy(() => SortOrderSchema).optional(),
  isDraft: z.lazy(() => SortOrderSchema).optional(),
  emailThreadId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EmailRelationFilterSchema: z.ZodType<Prisma.EmailRelationFilter> = z.object({
  is: z.lazy(() => EmailWhereInputSchema).optional(),
  isNot: z.lazy(() => EmailWhereInputSchema).optional()
}).strict();

export const AttachmentCountOrderByAggregateInputSchema: z.ZodType<Prisma.AttachmentCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  contentType: z.lazy(() => SortOrderSchema).optional(),
  size: z.lazy(() => SortOrderSchema).optional(),
  infoMessageDismissed: z.lazy(() => SortOrderSchema).optional(),
  brochureReplaced: z.lazy(() => SortOrderSchema).optional(),
  emailId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AttachmentAvgOrderByAggregateInputSchema: z.ZodType<Prisma.AttachmentAvgOrderByAggregateInput> = z.object({
  size: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AttachmentMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AttachmentMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  contentType: z.lazy(() => SortOrderSchema).optional(),
  size: z.lazy(() => SortOrderSchema).optional(),
  infoMessageDismissed: z.lazy(() => SortOrderSchema).optional(),
  brochureReplaced: z.lazy(() => SortOrderSchema).optional(),
  emailId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AttachmentMinOrderByAggregateInputSchema: z.ZodType<Prisma.AttachmentMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  contentType: z.lazy(() => SortOrderSchema).optional(),
  size: z.lazy(() => SortOrderSchema).optional(),
  infoMessageDismissed: z.lazy(() => SortOrderSchema).optional(),
  brochureReplaced: z.lazy(() => SortOrderSchema).optional(),
  emailId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AttachmentSumOrderByAggregateInputSchema: z.ZodType<Prisma.AttachmentSumOrderByAggregateInput> = z.object({
  size: z.lazy(() => SortOrderSchema).optional()
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

export const EmailListRelationFilterSchema: z.ZodType<Prisma.EmailListRelationFilter> = z.object({
  every: z.lazy(() => EmailWhereInputSchema).optional(),
  some: z.lazy(() => EmailWhereInputSchema).optional(),
  none: z.lazy(() => EmailWhereInputSchema).optional()
}).strict();

export const EmailOrderByRelationAggregateInputSchema: z.ZodType<Prisma.EmailOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EmailThreadCountOrderByAggregateInputSchema: z.ZodType<Prisma.EmailThreadCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  propertyId: z.lazy(() => SortOrderSchema).optional(),
  unread: z.lazy(() => SortOrderSchema).optional(),
  parsedAttributes: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EmailThreadMaxOrderByAggregateInputSchema: z.ZodType<Prisma.EmailThreadMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  propertyId: z.lazy(() => SortOrderSchema).optional(),
  unread: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EmailThreadMinOrderByAggregateInputSchema: z.ZodType<Prisma.EmailThreadMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  propertyId: z.lazy(() => SortOrderSchema).optional(),
  unread: z.lazy(() => SortOrderSchema).optional()
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

export const ContactCountOrderByAggregateInputSchema: z.ZodType<Prisma.ContactCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  propertyId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContactMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ContactMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  propertyId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContactMinOrderByAggregateInputSchema: z.ZodType<Prisma.ContactMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  propertyId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EmailTemplateCountOrderByAggregateInputSchema: z.ZodType<Prisma.EmailTemplateCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  subject: z.lazy(() => SortOrderSchema).optional(),
  body: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EmailTemplateMaxOrderByAggregateInputSchema: z.ZodType<Prisma.EmailTemplateMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  subject: z.lazy(() => SortOrderSchema).optional(),
  body: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EmailTemplateMinOrderByAggregateInputSchema: z.ZodType<Prisma.EmailTemplateMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  subject: z.lazy(() => SortOrderSchema).optional(),
  body: z.lazy(() => SortOrderSchema).optional()
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

export const EmailTemplateCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.EmailTemplateCreateNestedOneWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => EmailTemplateCreateWithoutUserInputSchema),z.lazy(() => EmailTemplateUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EmailTemplateCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => EmailTemplateWhereUniqueInputSchema).optional()
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

export const EmailTemplateUncheckedCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.EmailTemplateUncheckedCreateNestedOneWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => EmailTemplateCreateWithoutUserInputSchema),z.lazy(() => EmailTemplateUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EmailTemplateCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => EmailTemplateWhereUniqueInputSchema).optional()
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional().nullable()
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

export const EmailTemplateUpdateOneWithoutUserNestedInputSchema: z.ZodType<Prisma.EmailTemplateUpdateOneWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => EmailTemplateCreateWithoutUserInputSchema),z.lazy(() => EmailTemplateUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EmailTemplateCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => EmailTemplateUpsertWithoutUserInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => EmailTemplateWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => EmailTemplateWhereInputSchema) ]).optional(),
  connect: z.lazy(() => EmailTemplateWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => EmailTemplateUpdateToOneWithWhereWithoutUserInputSchema),z.lazy(() => EmailTemplateUpdateWithoutUserInputSchema),z.lazy(() => EmailTemplateUncheckedUpdateWithoutUserInputSchema) ]).optional(),
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

export const EmailTemplateUncheckedUpdateOneWithoutUserNestedInputSchema: z.ZodType<Prisma.EmailTemplateUncheckedUpdateOneWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => EmailTemplateCreateWithoutUserInputSchema),z.lazy(() => EmailTemplateUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EmailTemplateCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => EmailTemplateUpsertWithoutUserInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => EmailTemplateWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => EmailTemplateWhereInputSchema) ]).optional(),
  connect: z.lazy(() => EmailTemplateWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => EmailTemplateUpdateToOneWithWhereWithoutUserInputSchema),z.lazy(() => EmailTemplateUpdateWithoutUserInputSchema),z.lazy(() => EmailTemplateUncheckedUpdateWithoutUserInputSchema) ]).optional(),
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

export const AttributesOnSurveysCreateNestedManyWithoutSurveyInputSchema: z.ZodType<Prisma.AttributesOnSurveysCreateNestedManyWithoutSurveyInput> = z.object({
  create: z.union([ z.lazy(() => AttributesOnSurveysCreateWithoutSurveyInputSchema),z.lazy(() => AttributesOnSurveysCreateWithoutSurveyInputSchema).array(),z.lazy(() => AttributesOnSurveysUncheckedCreateWithoutSurveyInputSchema),z.lazy(() => AttributesOnSurveysUncheckedCreateWithoutSurveyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AttributesOnSurveysCreateOrConnectWithoutSurveyInputSchema),z.lazy(() => AttributesOnSurveysCreateOrConnectWithoutSurveyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AttributesOnSurveysCreateManySurveyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema),z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PropertyUncheckedCreateNestedManyWithoutSurveyInputSchema: z.ZodType<Prisma.PropertyUncheckedCreateNestedManyWithoutSurveyInput> = z.object({
  create: z.union([ z.lazy(() => PropertyCreateWithoutSurveyInputSchema),z.lazy(() => PropertyCreateWithoutSurveyInputSchema).array(),z.lazy(() => PropertyUncheckedCreateWithoutSurveyInputSchema),z.lazy(() => PropertyUncheckedCreateWithoutSurveyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PropertyCreateOrConnectWithoutSurveyInputSchema),z.lazy(() => PropertyCreateOrConnectWithoutSurveyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PropertyCreateManySurveyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PropertyWhereUniqueInputSchema),z.lazy(() => PropertyWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AttributesOnSurveysUncheckedCreateNestedManyWithoutSurveyInputSchema: z.ZodType<Prisma.AttributesOnSurveysUncheckedCreateNestedManyWithoutSurveyInput> = z.object({
  create: z.union([ z.lazy(() => AttributesOnSurveysCreateWithoutSurveyInputSchema),z.lazy(() => AttributesOnSurveysCreateWithoutSurveyInputSchema).array(),z.lazy(() => AttributesOnSurveysUncheckedCreateWithoutSurveyInputSchema),z.lazy(() => AttributesOnSurveysUncheckedCreateWithoutSurveyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AttributesOnSurveysCreateOrConnectWithoutSurveyInputSchema),z.lazy(() => AttributesOnSurveysCreateOrConnectWithoutSurveyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AttributesOnSurveysCreateManySurveyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema),z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema).array() ]).optional(),
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

export const AttributesOnSurveysUpdateManyWithoutSurveyNestedInputSchema: z.ZodType<Prisma.AttributesOnSurveysUpdateManyWithoutSurveyNestedInput> = z.object({
  create: z.union([ z.lazy(() => AttributesOnSurveysCreateWithoutSurveyInputSchema),z.lazy(() => AttributesOnSurveysCreateWithoutSurveyInputSchema).array(),z.lazy(() => AttributesOnSurveysUncheckedCreateWithoutSurveyInputSchema),z.lazy(() => AttributesOnSurveysUncheckedCreateWithoutSurveyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AttributesOnSurveysCreateOrConnectWithoutSurveyInputSchema),z.lazy(() => AttributesOnSurveysCreateOrConnectWithoutSurveyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AttributesOnSurveysUpsertWithWhereUniqueWithoutSurveyInputSchema),z.lazy(() => AttributesOnSurveysUpsertWithWhereUniqueWithoutSurveyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AttributesOnSurveysCreateManySurveyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema),z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema),z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema),z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema),z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AttributesOnSurveysUpdateWithWhereUniqueWithoutSurveyInputSchema),z.lazy(() => AttributesOnSurveysUpdateWithWhereUniqueWithoutSurveyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AttributesOnSurveysUpdateManyWithWhereWithoutSurveyInputSchema),z.lazy(() => AttributesOnSurveysUpdateManyWithWhereWithoutSurveyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AttributesOnSurveysScalarWhereInputSchema),z.lazy(() => AttributesOnSurveysScalarWhereInputSchema).array() ]).optional(),
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

export const AttributesOnSurveysUncheckedUpdateManyWithoutSurveyNestedInputSchema: z.ZodType<Prisma.AttributesOnSurveysUncheckedUpdateManyWithoutSurveyNestedInput> = z.object({
  create: z.union([ z.lazy(() => AttributesOnSurveysCreateWithoutSurveyInputSchema),z.lazy(() => AttributesOnSurveysCreateWithoutSurveyInputSchema).array(),z.lazy(() => AttributesOnSurveysUncheckedCreateWithoutSurveyInputSchema),z.lazy(() => AttributesOnSurveysUncheckedCreateWithoutSurveyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AttributesOnSurveysCreateOrConnectWithoutSurveyInputSchema),z.lazy(() => AttributesOnSurveysCreateOrConnectWithoutSurveyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AttributesOnSurveysUpsertWithWhereUniqueWithoutSurveyInputSchema),z.lazy(() => AttributesOnSurveysUpsertWithWhereUniqueWithoutSurveyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AttributesOnSurveysCreateManySurveyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema),z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema),z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema),z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema),z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AttributesOnSurveysUpdateWithWhereUniqueWithoutSurveyInputSchema),z.lazy(() => AttributesOnSurveysUpdateWithWhereUniqueWithoutSurveyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AttributesOnSurveysUpdateManyWithWhereWithoutSurveyInputSchema),z.lazy(() => AttributesOnSurveysUpdateManyWithWhereWithoutSurveyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AttributesOnSurveysScalarWhereInputSchema),z.lazy(() => AttributesOnSurveysScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutAttributesInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutAttributesInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutAttributesInputSchema),z.lazy(() => UserUncheckedCreateWithoutAttributesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAttributesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const AttributesOnSurveysCreateNestedManyWithoutAttributeInputSchema: z.ZodType<Prisma.AttributesOnSurveysCreateNestedManyWithoutAttributeInput> = z.object({
  create: z.union([ z.lazy(() => AttributesOnSurveysCreateWithoutAttributeInputSchema),z.lazy(() => AttributesOnSurveysCreateWithoutAttributeInputSchema).array(),z.lazy(() => AttributesOnSurveysUncheckedCreateWithoutAttributeInputSchema),z.lazy(() => AttributesOnSurveysUncheckedCreateWithoutAttributeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AttributesOnSurveysCreateOrConnectWithoutAttributeInputSchema),z.lazy(() => AttributesOnSurveysCreateOrConnectWithoutAttributeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AttributesOnSurveysCreateManyAttributeInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema),z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AttributesOnSurveysUncheckedCreateNestedManyWithoutAttributeInputSchema: z.ZodType<Prisma.AttributesOnSurveysUncheckedCreateNestedManyWithoutAttributeInput> = z.object({
  create: z.union([ z.lazy(() => AttributesOnSurveysCreateWithoutAttributeInputSchema),z.lazy(() => AttributesOnSurveysCreateWithoutAttributeInputSchema).array(),z.lazy(() => AttributesOnSurveysUncheckedCreateWithoutAttributeInputSchema),z.lazy(() => AttributesOnSurveysUncheckedCreateWithoutAttributeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AttributesOnSurveysCreateOrConnectWithoutAttributeInputSchema),z.lazy(() => AttributesOnSurveysCreateOrConnectWithoutAttributeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AttributesOnSurveysCreateManyAttributeInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema),z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
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

export const AttributesOnSurveysUpdateManyWithoutAttributeNestedInputSchema: z.ZodType<Prisma.AttributesOnSurveysUpdateManyWithoutAttributeNestedInput> = z.object({
  create: z.union([ z.lazy(() => AttributesOnSurveysCreateWithoutAttributeInputSchema),z.lazy(() => AttributesOnSurveysCreateWithoutAttributeInputSchema).array(),z.lazy(() => AttributesOnSurveysUncheckedCreateWithoutAttributeInputSchema),z.lazy(() => AttributesOnSurveysUncheckedCreateWithoutAttributeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AttributesOnSurveysCreateOrConnectWithoutAttributeInputSchema),z.lazy(() => AttributesOnSurveysCreateOrConnectWithoutAttributeInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AttributesOnSurveysUpsertWithWhereUniqueWithoutAttributeInputSchema),z.lazy(() => AttributesOnSurveysUpsertWithWhereUniqueWithoutAttributeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AttributesOnSurveysCreateManyAttributeInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema),z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema),z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema),z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema),z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AttributesOnSurveysUpdateWithWhereUniqueWithoutAttributeInputSchema),z.lazy(() => AttributesOnSurveysUpdateWithWhereUniqueWithoutAttributeInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AttributesOnSurveysUpdateManyWithWhereWithoutAttributeInputSchema),z.lazy(() => AttributesOnSurveysUpdateManyWithWhereWithoutAttributeInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AttributesOnSurveysScalarWhereInputSchema),z.lazy(() => AttributesOnSurveysScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AttributesOnSurveysUncheckedUpdateManyWithoutAttributeNestedInputSchema: z.ZodType<Prisma.AttributesOnSurveysUncheckedUpdateManyWithoutAttributeNestedInput> = z.object({
  create: z.union([ z.lazy(() => AttributesOnSurveysCreateWithoutAttributeInputSchema),z.lazy(() => AttributesOnSurveysCreateWithoutAttributeInputSchema).array(),z.lazy(() => AttributesOnSurveysUncheckedCreateWithoutAttributeInputSchema),z.lazy(() => AttributesOnSurveysUncheckedCreateWithoutAttributeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AttributesOnSurveysCreateOrConnectWithoutAttributeInputSchema),z.lazy(() => AttributesOnSurveysCreateOrConnectWithoutAttributeInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AttributesOnSurveysUpsertWithWhereUniqueWithoutAttributeInputSchema),z.lazy(() => AttributesOnSurveysUpsertWithWhereUniqueWithoutAttributeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AttributesOnSurveysCreateManyAttributeInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema),z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema),z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema),z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema),z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AttributesOnSurveysUpdateWithWhereUniqueWithoutAttributeInputSchema),z.lazy(() => AttributesOnSurveysUpdateWithWhereUniqueWithoutAttributeInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AttributesOnSurveysUpdateManyWithWhereWithoutAttributeInputSchema),z.lazy(() => AttributesOnSurveysUpdateManyWithWhereWithoutAttributeInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AttributesOnSurveysScalarWhereInputSchema),z.lazy(() => AttributesOnSurveysScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AttributeCreateNestedOneWithoutSurveysInputSchema: z.ZodType<Prisma.AttributeCreateNestedOneWithoutSurveysInput> = z.object({
  create: z.union([ z.lazy(() => AttributeCreateWithoutSurveysInputSchema),z.lazy(() => AttributeUncheckedCreateWithoutSurveysInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AttributeCreateOrConnectWithoutSurveysInputSchema).optional(),
  connect: z.lazy(() => AttributeWhereUniqueInputSchema).optional()
}).strict();

export const SurveyCreateNestedOneWithoutAttributesInputSchema: z.ZodType<Prisma.SurveyCreateNestedOneWithoutAttributesInput> = z.object({
  create: z.union([ z.lazy(() => SurveyCreateWithoutAttributesInputSchema),z.lazy(() => SurveyUncheckedCreateWithoutAttributesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SurveyCreateOrConnectWithoutAttributesInputSchema).optional(),
  connect: z.lazy(() => SurveyWhereUniqueInputSchema).optional()
}).strict();

export const AttributeUpdateOneRequiredWithoutSurveysNestedInputSchema: z.ZodType<Prisma.AttributeUpdateOneRequiredWithoutSurveysNestedInput> = z.object({
  create: z.union([ z.lazy(() => AttributeCreateWithoutSurveysInputSchema),z.lazy(() => AttributeUncheckedCreateWithoutSurveysInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AttributeCreateOrConnectWithoutSurveysInputSchema).optional(),
  upsert: z.lazy(() => AttributeUpsertWithoutSurveysInputSchema).optional(),
  connect: z.lazy(() => AttributeWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => AttributeUpdateToOneWithWhereWithoutSurveysInputSchema),z.lazy(() => AttributeUpdateWithoutSurveysInputSchema),z.lazy(() => AttributeUncheckedUpdateWithoutSurveysInputSchema) ]).optional(),
}).strict();

export const SurveyUpdateOneRequiredWithoutAttributesNestedInputSchema: z.ZodType<Prisma.SurveyUpdateOneRequiredWithoutAttributesNestedInput> = z.object({
  create: z.union([ z.lazy(() => SurveyCreateWithoutAttributesInputSchema),z.lazy(() => SurveyUncheckedCreateWithoutAttributesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SurveyCreateOrConnectWithoutAttributesInputSchema).optional(),
  upsert: z.lazy(() => SurveyUpsertWithoutAttributesInputSchema).optional(),
  connect: z.lazy(() => SurveyWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => SurveyUpdateToOneWithWhereWithoutAttributesInputSchema),z.lazy(() => SurveyUpdateWithoutAttributesInputSchema),z.lazy(() => SurveyUncheckedUpdateWithoutAttributesInputSchema) ]).optional(),
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

export const ContactCreateNestedManyWithoutPropertyInputSchema: z.ZodType<Prisma.ContactCreateNestedManyWithoutPropertyInput> = z.object({
  create: z.union([ z.lazy(() => ContactCreateWithoutPropertyInputSchema),z.lazy(() => ContactCreateWithoutPropertyInputSchema).array(),z.lazy(() => ContactUncheckedCreateWithoutPropertyInputSchema),z.lazy(() => ContactUncheckedCreateWithoutPropertyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContactCreateOrConnectWithoutPropertyInputSchema),z.lazy(() => ContactCreateOrConnectWithoutPropertyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContactCreateManyPropertyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ContactWhereUniqueInputSchema),z.lazy(() => ContactWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EmailThreadCreateNestedManyWithoutPropertyInputSchema: z.ZodType<Prisma.EmailThreadCreateNestedManyWithoutPropertyInput> = z.object({
  create: z.union([ z.lazy(() => EmailThreadCreateWithoutPropertyInputSchema),z.lazy(() => EmailThreadCreateWithoutPropertyInputSchema).array(),z.lazy(() => EmailThreadUncheckedCreateWithoutPropertyInputSchema),z.lazy(() => EmailThreadUncheckedCreateWithoutPropertyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EmailThreadCreateOrConnectWithoutPropertyInputSchema),z.lazy(() => EmailThreadCreateOrConnectWithoutPropertyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EmailThreadCreateManyPropertyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => EmailThreadWhereUniqueInputSchema),z.lazy(() => EmailThreadWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BrochureUncheckedCreateNestedManyWithoutPropertyInputSchema: z.ZodType<Prisma.BrochureUncheckedCreateNestedManyWithoutPropertyInput> = z.object({
  create: z.union([ z.lazy(() => BrochureCreateWithoutPropertyInputSchema),z.lazy(() => BrochureCreateWithoutPropertyInputSchema).array(),z.lazy(() => BrochureUncheckedCreateWithoutPropertyInputSchema),z.lazy(() => BrochureUncheckedCreateWithoutPropertyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BrochureCreateOrConnectWithoutPropertyInputSchema),z.lazy(() => BrochureCreateOrConnectWithoutPropertyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BrochureCreateManyPropertyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => BrochureWhereUniqueInputSchema),z.lazy(() => BrochureWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ContactUncheckedCreateNestedManyWithoutPropertyInputSchema: z.ZodType<Prisma.ContactUncheckedCreateNestedManyWithoutPropertyInput> = z.object({
  create: z.union([ z.lazy(() => ContactCreateWithoutPropertyInputSchema),z.lazy(() => ContactCreateWithoutPropertyInputSchema).array(),z.lazy(() => ContactUncheckedCreateWithoutPropertyInputSchema),z.lazy(() => ContactUncheckedCreateWithoutPropertyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContactCreateOrConnectWithoutPropertyInputSchema),z.lazy(() => ContactCreateOrConnectWithoutPropertyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContactCreateManyPropertyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ContactWhereUniqueInputSchema),z.lazy(() => ContactWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EmailThreadUncheckedCreateNestedManyWithoutPropertyInputSchema: z.ZodType<Prisma.EmailThreadUncheckedCreateNestedManyWithoutPropertyInput> = z.object({
  create: z.union([ z.lazy(() => EmailThreadCreateWithoutPropertyInputSchema),z.lazy(() => EmailThreadCreateWithoutPropertyInputSchema).array(),z.lazy(() => EmailThreadUncheckedCreateWithoutPropertyInputSchema),z.lazy(() => EmailThreadUncheckedCreateWithoutPropertyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EmailThreadCreateOrConnectWithoutPropertyInputSchema),z.lazy(() => EmailThreadCreateOrConnectWithoutPropertyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EmailThreadCreateManyPropertyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => EmailThreadWhereUniqueInputSchema),z.lazy(() => EmailThreadWhereUniqueInputSchema).array() ]).optional(),
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

export const ContactUpdateManyWithoutPropertyNestedInputSchema: z.ZodType<Prisma.ContactUpdateManyWithoutPropertyNestedInput> = z.object({
  create: z.union([ z.lazy(() => ContactCreateWithoutPropertyInputSchema),z.lazy(() => ContactCreateWithoutPropertyInputSchema).array(),z.lazy(() => ContactUncheckedCreateWithoutPropertyInputSchema),z.lazy(() => ContactUncheckedCreateWithoutPropertyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContactCreateOrConnectWithoutPropertyInputSchema),z.lazy(() => ContactCreateOrConnectWithoutPropertyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ContactUpsertWithWhereUniqueWithoutPropertyInputSchema),z.lazy(() => ContactUpsertWithWhereUniqueWithoutPropertyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContactCreateManyPropertyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ContactWhereUniqueInputSchema),z.lazy(() => ContactWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ContactWhereUniqueInputSchema),z.lazy(() => ContactWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ContactWhereUniqueInputSchema),z.lazy(() => ContactWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ContactWhereUniqueInputSchema),z.lazy(() => ContactWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ContactUpdateWithWhereUniqueWithoutPropertyInputSchema),z.lazy(() => ContactUpdateWithWhereUniqueWithoutPropertyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ContactUpdateManyWithWhereWithoutPropertyInputSchema),z.lazy(() => ContactUpdateManyWithWhereWithoutPropertyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ContactScalarWhereInputSchema),z.lazy(() => ContactScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const EmailThreadUpdateManyWithoutPropertyNestedInputSchema: z.ZodType<Prisma.EmailThreadUpdateManyWithoutPropertyNestedInput> = z.object({
  create: z.union([ z.lazy(() => EmailThreadCreateWithoutPropertyInputSchema),z.lazy(() => EmailThreadCreateWithoutPropertyInputSchema).array(),z.lazy(() => EmailThreadUncheckedCreateWithoutPropertyInputSchema),z.lazy(() => EmailThreadUncheckedCreateWithoutPropertyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EmailThreadCreateOrConnectWithoutPropertyInputSchema),z.lazy(() => EmailThreadCreateOrConnectWithoutPropertyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => EmailThreadUpsertWithWhereUniqueWithoutPropertyInputSchema),z.lazy(() => EmailThreadUpsertWithWhereUniqueWithoutPropertyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EmailThreadCreateManyPropertyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => EmailThreadWhereUniqueInputSchema),z.lazy(() => EmailThreadWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => EmailThreadWhereUniqueInputSchema),z.lazy(() => EmailThreadWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => EmailThreadWhereUniqueInputSchema),z.lazy(() => EmailThreadWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => EmailThreadWhereUniqueInputSchema),z.lazy(() => EmailThreadWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => EmailThreadUpdateWithWhereUniqueWithoutPropertyInputSchema),z.lazy(() => EmailThreadUpdateWithWhereUniqueWithoutPropertyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => EmailThreadUpdateManyWithWhereWithoutPropertyInputSchema),z.lazy(() => EmailThreadUpdateManyWithWhereWithoutPropertyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => EmailThreadScalarWhereInputSchema),z.lazy(() => EmailThreadScalarWhereInputSchema).array() ]).optional(),
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

export const ContactUncheckedUpdateManyWithoutPropertyNestedInputSchema: z.ZodType<Prisma.ContactUncheckedUpdateManyWithoutPropertyNestedInput> = z.object({
  create: z.union([ z.lazy(() => ContactCreateWithoutPropertyInputSchema),z.lazy(() => ContactCreateWithoutPropertyInputSchema).array(),z.lazy(() => ContactUncheckedCreateWithoutPropertyInputSchema),z.lazy(() => ContactUncheckedCreateWithoutPropertyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContactCreateOrConnectWithoutPropertyInputSchema),z.lazy(() => ContactCreateOrConnectWithoutPropertyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ContactUpsertWithWhereUniqueWithoutPropertyInputSchema),z.lazy(() => ContactUpsertWithWhereUniqueWithoutPropertyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContactCreateManyPropertyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ContactWhereUniqueInputSchema),z.lazy(() => ContactWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ContactWhereUniqueInputSchema),z.lazy(() => ContactWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ContactWhereUniqueInputSchema),z.lazy(() => ContactWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ContactWhereUniqueInputSchema),z.lazy(() => ContactWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ContactUpdateWithWhereUniqueWithoutPropertyInputSchema),z.lazy(() => ContactUpdateWithWhereUniqueWithoutPropertyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ContactUpdateManyWithWhereWithoutPropertyInputSchema),z.lazy(() => ContactUpdateManyWithWhereWithoutPropertyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ContactScalarWhereInputSchema),z.lazy(() => ContactScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const EmailThreadUncheckedUpdateManyWithoutPropertyNestedInputSchema: z.ZodType<Prisma.EmailThreadUncheckedUpdateManyWithoutPropertyNestedInput> = z.object({
  create: z.union([ z.lazy(() => EmailThreadCreateWithoutPropertyInputSchema),z.lazy(() => EmailThreadCreateWithoutPropertyInputSchema).array(),z.lazy(() => EmailThreadUncheckedCreateWithoutPropertyInputSchema),z.lazy(() => EmailThreadUncheckedCreateWithoutPropertyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EmailThreadCreateOrConnectWithoutPropertyInputSchema),z.lazy(() => EmailThreadCreateOrConnectWithoutPropertyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => EmailThreadUpsertWithWhereUniqueWithoutPropertyInputSchema),z.lazy(() => EmailThreadUpsertWithWhereUniqueWithoutPropertyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EmailThreadCreateManyPropertyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => EmailThreadWhereUniqueInputSchema),z.lazy(() => EmailThreadWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => EmailThreadWhereUniqueInputSchema),z.lazy(() => EmailThreadWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => EmailThreadWhereUniqueInputSchema),z.lazy(() => EmailThreadWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => EmailThreadWhereUniqueInputSchema),z.lazy(() => EmailThreadWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => EmailThreadUpdateWithWhereUniqueWithoutPropertyInputSchema),z.lazy(() => EmailThreadUpdateWithWhereUniqueWithoutPropertyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => EmailThreadUpdateManyWithWhereWithoutPropertyInputSchema),z.lazy(() => EmailThreadUpdateManyWithWhereWithoutPropertyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => EmailThreadScalarWhereInputSchema),z.lazy(() => EmailThreadScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const BrochureCreateundoStackInputSchema: z.ZodType<Prisma.BrochureCreateundoStackInput> = z.object({
  set: z.string().array()
}).strict();

export const BrochureCreatedeletedPagesInputSchema: z.ZodType<Prisma.BrochureCreatedeletedPagesInput> = z.object({
  set: z.number().array()
}).strict();

export const PropertyCreateNestedOneWithoutBrochuresInputSchema: z.ZodType<Prisma.PropertyCreateNestedOneWithoutBrochuresInput> = z.object({
  create: z.union([ z.lazy(() => PropertyCreateWithoutBrochuresInputSchema),z.lazy(() => PropertyUncheckedCreateWithoutBrochuresInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PropertyCreateOrConnectWithoutBrochuresInputSchema).optional(),
  connect: z.lazy(() => PropertyWhereUniqueInputSchema).optional()
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict();

export const BrochureUpdateundoStackInputSchema: z.ZodType<Prisma.BrochureUpdateundoStackInput> = z.object({
  set: z.string().array().optional(),
  push: z.union([ z.string(),z.string().array() ]).optional(),
}).strict();

export const BrochureUpdatedeletedPagesInputSchema: z.ZodType<Prisma.BrochureUpdatedeletedPagesInput> = z.object({
  set: z.number().array().optional(),
  push: z.union([ z.number(),z.number().array() ]).optional(),
}).strict();

export const PropertyUpdateOneRequiredWithoutBrochuresNestedInputSchema: z.ZodType<Prisma.PropertyUpdateOneRequiredWithoutBrochuresNestedInput> = z.object({
  create: z.union([ z.lazy(() => PropertyCreateWithoutBrochuresInputSchema),z.lazy(() => PropertyUncheckedCreateWithoutBrochuresInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PropertyCreateOrConnectWithoutBrochuresInputSchema).optional(),
  upsert: z.lazy(() => PropertyUpsertWithoutBrochuresInputSchema).optional(),
  connect: z.lazy(() => PropertyWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PropertyUpdateToOneWithWhereWithoutBrochuresInputSchema),z.lazy(() => PropertyUpdateWithoutBrochuresInputSchema),z.lazy(() => PropertyUncheckedUpdateWithoutBrochuresInputSchema) ]).optional(),
}).strict();

export const AttachmentCreateNestedManyWithoutEmailInputSchema: z.ZodType<Prisma.AttachmentCreateNestedManyWithoutEmailInput> = z.object({
  create: z.union([ z.lazy(() => AttachmentCreateWithoutEmailInputSchema),z.lazy(() => AttachmentCreateWithoutEmailInputSchema).array(),z.lazy(() => AttachmentUncheckedCreateWithoutEmailInputSchema),z.lazy(() => AttachmentUncheckedCreateWithoutEmailInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AttachmentCreateOrConnectWithoutEmailInputSchema),z.lazy(() => AttachmentCreateOrConnectWithoutEmailInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AttachmentCreateManyEmailInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AttachmentWhereUniqueInputSchema),z.lazy(() => AttachmentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EmailThreadCreateNestedOneWithoutEmailsInputSchema: z.ZodType<Prisma.EmailThreadCreateNestedOneWithoutEmailsInput> = z.object({
  create: z.union([ z.lazy(() => EmailThreadCreateWithoutEmailsInputSchema),z.lazy(() => EmailThreadUncheckedCreateWithoutEmailsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EmailThreadCreateOrConnectWithoutEmailsInputSchema).optional(),
  connect: z.lazy(() => EmailThreadWhereUniqueInputSchema).optional()
}).strict();

export const AttachmentUncheckedCreateNestedManyWithoutEmailInputSchema: z.ZodType<Prisma.AttachmentUncheckedCreateNestedManyWithoutEmailInput> = z.object({
  create: z.union([ z.lazy(() => AttachmentCreateWithoutEmailInputSchema),z.lazy(() => AttachmentCreateWithoutEmailInputSchema).array(),z.lazy(() => AttachmentUncheckedCreateWithoutEmailInputSchema),z.lazy(() => AttachmentUncheckedCreateWithoutEmailInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AttachmentCreateOrConnectWithoutEmailInputSchema),z.lazy(() => AttachmentCreateOrConnectWithoutEmailInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AttachmentCreateManyEmailInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AttachmentWhereUniqueInputSchema),z.lazy(() => AttachmentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AttachmentUpdateManyWithoutEmailNestedInputSchema: z.ZodType<Prisma.AttachmentUpdateManyWithoutEmailNestedInput> = z.object({
  create: z.union([ z.lazy(() => AttachmentCreateWithoutEmailInputSchema),z.lazy(() => AttachmentCreateWithoutEmailInputSchema).array(),z.lazy(() => AttachmentUncheckedCreateWithoutEmailInputSchema),z.lazy(() => AttachmentUncheckedCreateWithoutEmailInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AttachmentCreateOrConnectWithoutEmailInputSchema),z.lazy(() => AttachmentCreateOrConnectWithoutEmailInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AttachmentUpsertWithWhereUniqueWithoutEmailInputSchema),z.lazy(() => AttachmentUpsertWithWhereUniqueWithoutEmailInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AttachmentCreateManyEmailInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AttachmentWhereUniqueInputSchema),z.lazy(() => AttachmentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AttachmentWhereUniqueInputSchema),z.lazy(() => AttachmentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AttachmentWhereUniqueInputSchema),z.lazy(() => AttachmentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AttachmentWhereUniqueInputSchema),z.lazy(() => AttachmentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AttachmentUpdateWithWhereUniqueWithoutEmailInputSchema),z.lazy(() => AttachmentUpdateWithWhereUniqueWithoutEmailInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AttachmentUpdateManyWithWhereWithoutEmailInputSchema),z.lazy(() => AttachmentUpdateManyWithWhereWithoutEmailInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AttachmentScalarWhereInputSchema),z.lazy(() => AttachmentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const EmailThreadUpdateOneRequiredWithoutEmailsNestedInputSchema: z.ZodType<Prisma.EmailThreadUpdateOneRequiredWithoutEmailsNestedInput> = z.object({
  create: z.union([ z.lazy(() => EmailThreadCreateWithoutEmailsInputSchema),z.lazy(() => EmailThreadUncheckedCreateWithoutEmailsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EmailThreadCreateOrConnectWithoutEmailsInputSchema).optional(),
  upsert: z.lazy(() => EmailThreadUpsertWithoutEmailsInputSchema).optional(),
  connect: z.lazy(() => EmailThreadWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => EmailThreadUpdateToOneWithWhereWithoutEmailsInputSchema),z.lazy(() => EmailThreadUpdateWithoutEmailsInputSchema),z.lazy(() => EmailThreadUncheckedUpdateWithoutEmailsInputSchema) ]).optional(),
}).strict();

export const AttachmentUncheckedUpdateManyWithoutEmailNestedInputSchema: z.ZodType<Prisma.AttachmentUncheckedUpdateManyWithoutEmailNestedInput> = z.object({
  create: z.union([ z.lazy(() => AttachmentCreateWithoutEmailInputSchema),z.lazy(() => AttachmentCreateWithoutEmailInputSchema).array(),z.lazy(() => AttachmentUncheckedCreateWithoutEmailInputSchema),z.lazy(() => AttachmentUncheckedCreateWithoutEmailInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AttachmentCreateOrConnectWithoutEmailInputSchema),z.lazy(() => AttachmentCreateOrConnectWithoutEmailInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AttachmentUpsertWithWhereUniqueWithoutEmailInputSchema),z.lazy(() => AttachmentUpsertWithWhereUniqueWithoutEmailInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AttachmentCreateManyEmailInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AttachmentWhereUniqueInputSchema),z.lazy(() => AttachmentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AttachmentWhereUniqueInputSchema),z.lazy(() => AttachmentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AttachmentWhereUniqueInputSchema),z.lazy(() => AttachmentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AttachmentWhereUniqueInputSchema),z.lazy(() => AttachmentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AttachmentUpdateWithWhereUniqueWithoutEmailInputSchema),z.lazy(() => AttachmentUpdateWithWhereUniqueWithoutEmailInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AttachmentUpdateManyWithWhereWithoutEmailInputSchema),z.lazy(() => AttachmentUpdateManyWithWhereWithoutEmailInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AttachmentScalarWhereInputSchema),z.lazy(() => AttachmentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const EmailCreateNestedOneWithoutAttachmentsInputSchema: z.ZodType<Prisma.EmailCreateNestedOneWithoutAttachmentsInput> = z.object({
  create: z.union([ z.lazy(() => EmailCreateWithoutAttachmentsInputSchema),z.lazy(() => EmailUncheckedCreateWithoutAttachmentsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EmailCreateOrConnectWithoutAttachmentsInputSchema).optional(),
  connect: z.lazy(() => EmailWhereUniqueInputSchema).optional()
}).strict();

export const EmailUpdateOneRequiredWithoutAttachmentsNestedInputSchema: z.ZodType<Prisma.EmailUpdateOneRequiredWithoutAttachmentsNestedInput> = z.object({
  create: z.union([ z.lazy(() => EmailCreateWithoutAttachmentsInputSchema),z.lazy(() => EmailUncheckedCreateWithoutAttachmentsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EmailCreateOrConnectWithoutAttachmentsInputSchema).optional(),
  upsert: z.lazy(() => EmailUpsertWithoutAttachmentsInputSchema).optional(),
  connect: z.lazy(() => EmailWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => EmailUpdateToOneWithWhereWithoutAttachmentsInputSchema),z.lazy(() => EmailUpdateWithoutAttachmentsInputSchema),z.lazy(() => EmailUncheckedUpdateWithoutAttachmentsInputSchema) ]).optional(),
}).strict();

export const EmailCreateNestedManyWithoutEmailThreadInputSchema: z.ZodType<Prisma.EmailCreateNestedManyWithoutEmailThreadInput> = z.object({
  create: z.union([ z.lazy(() => EmailCreateWithoutEmailThreadInputSchema),z.lazy(() => EmailCreateWithoutEmailThreadInputSchema).array(),z.lazy(() => EmailUncheckedCreateWithoutEmailThreadInputSchema),z.lazy(() => EmailUncheckedCreateWithoutEmailThreadInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EmailCreateOrConnectWithoutEmailThreadInputSchema),z.lazy(() => EmailCreateOrConnectWithoutEmailThreadInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EmailCreateManyEmailThreadInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => EmailWhereUniqueInputSchema),z.lazy(() => EmailWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PropertyCreateNestedOneWithoutEmailThreadsInputSchema: z.ZodType<Prisma.PropertyCreateNestedOneWithoutEmailThreadsInput> = z.object({
  create: z.union([ z.lazy(() => PropertyCreateWithoutEmailThreadsInputSchema),z.lazy(() => PropertyUncheckedCreateWithoutEmailThreadsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PropertyCreateOrConnectWithoutEmailThreadsInputSchema).optional(),
  connect: z.lazy(() => PropertyWhereUniqueInputSchema).optional()
}).strict();

export const EmailUncheckedCreateNestedManyWithoutEmailThreadInputSchema: z.ZodType<Prisma.EmailUncheckedCreateNestedManyWithoutEmailThreadInput> = z.object({
  create: z.union([ z.lazy(() => EmailCreateWithoutEmailThreadInputSchema),z.lazy(() => EmailCreateWithoutEmailThreadInputSchema).array(),z.lazy(() => EmailUncheckedCreateWithoutEmailThreadInputSchema),z.lazy(() => EmailUncheckedCreateWithoutEmailThreadInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EmailCreateOrConnectWithoutEmailThreadInputSchema),z.lazy(() => EmailCreateOrConnectWithoutEmailThreadInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EmailCreateManyEmailThreadInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => EmailWhereUniqueInputSchema),z.lazy(() => EmailWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EmailUpdateManyWithoutEmailThreadNestedInputSchema: z.ZodType<Prisma.EmailUpdateManyWithoutEmailThreadNestedInput> = z.object({
  create: z.union([ z.lazy(() => EmailCreateWithoutEmailThreadInputSchema),z.lazy(() => EmailCreateWithoutEmailThreadInputSchema).array(),z.lazy(() => EmailUncheckedCreateWithoutEmailThreadInputSchema),z.lazy(() => EmailUncheckedCreateWithoutEmailThreadInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EmailCreateOrConnectWithoutEmailThreadInputSchema),z.lazy(() => EmailCreateOrConnectWithoutEmailThreadInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => EmailUpsertWithWhereUniqueWithoutEmailThreadInputSchema),z.lazy(() => EmailUpsertWithWhereUniqueWithoutEmailThreadInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EmailCreateManyEmailThreadInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => EmailWhereUniqueInputSchema),z.lazy(() => EmailWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => EmailWhereUniqueInputSchema),z.lazy(() => EmailWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => EmailWhereUniqueInputSchema),z.lazy(() => EmailWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => EmailWhereUniqueInputSchema),z.lazy(() => EmailWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => EmailUpdateWithWhereUniqueWithoutEmailThreadInputSchema),z.lazy(() => EmailUpdateWithWhereUniqueWithoutEmailThreadInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => EmailUpdateManyWithWhereWithoutEmailThreadInputSchema),z.lazy(() => EmailUpdateManyWithWhereWithoutEmailThreadInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => EmailScalarWhereInputSchema),z.lazy(() => EmailScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PropertyUpdateOneRequiredWithoutEmailThreadsNestedInputSchema: z.ZodType<Prisma.PropertyUpdateOneRequiredWithoutEmailThreadsNestedInput> = z.object({
  create: z.union([ z.lazy(() => PropertyCreateWithoutEmailThreadsInputSchema),z.lazy(() => PropertyUncheckedCreateWithoutEmailThreadsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PropertyCreateOrConnectWithoutEmailThreadsInputSchema).optional(),
  upsert: z.lazy(() => PropertyUpsertWithoutEmailThreadsInputSchema).optional(),
  connect: z.lazy(() => PropertyWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PropertyUpdateToOneWithWhereWithoutEmailThreadsInputSchema),z.lazy(() => PropertyUpdateWithoutEmailThreadsInputSchema),z.lazy(() => PropertyUncheckedUpdateWithoutEmailThreadsInputSchema) ]).optional(),
}).strict();

export const EmailUncheckedUpdateManyWithoutEmailThreadNestedInputSchema: z.ZodType<Prisma.EmailUncheckedUpdateManyWithoutEmailThreadNestedInput> = z.object({
  create: z.union([ z.lazy(() => EmailCreateWithoutEmailThreadInputSchema),z.lazy(() => EmailCreateWithoutEmailThreadInputSchema).array(),z.lazy(() => EmailUncheckedCreateWithoutEmailThreadInputSchema),z.lazy(() => EmailUncheckedCreateWithoutEmailThreadInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EmailCreateOrConnectWithoutEmailThreadInputSchema),z.lazy(() => EmailCreateOrConnectWithoutEmailThreadInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => EmailUpsertWithWhereUniqueWithoutEmailThreadInputSchema),z.lazy(() => EmailUpsertWithWhereUniqueWithoutEmailThreadInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EmailCreateManyEmailThreadInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => EmailWhereUniqueInputSchema),z.lazy(() => EmailWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => EmailWhereUniqueInputSchema),z.lazy(() => EmailWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => EmailWhereUniqueInputSchema),z.lazy(() => EmailWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => EmailWhereUniqueInputSchema),z.lazy(() => EmailWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => EmailUpdateWithWhereUniqueWithoutEmailThreadInputSchema),z.lazy(() => EmailUpdateWithWhereUniqueWithoutEmailThreadInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => EmailUpdateManyWithWhereWithoutEmailThreadInputSchema),z.lazy(() => EmailUpdateManyWithWhereWithoutEmailThreadInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => EmailScalarWhereInputSchema),z.lazy(() => EmailScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PropertyCreateNestedOneWithoutContactsInputSchema: z.ZodType<Prisma.PropertyCreateNestedOneWithoutContactsInput> = z.object({
  create: z.union([ z.lazy(() => PropertyCreateWithoutContactsInputSchema),z.lazy(() => PropertyUncheckedCreateWithoutContactsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PropertyCreateOrConnectWithoutContactsInputSchema).optional(),
  connect: z.lazy(() => PropertyWhereUniqueInputSchema).optional()
}).strict();

export const PropertyUpdateOneRequiredWithoutContactsNestedInputSchema: z.ZodType<Prisma.PropertyUpdateOneRequiredWithoutContactsNestedInput> = z.object({
  create: z.union([ z.lazy(() => PropertyCreateWithoutContactsInputSchema),z.lazy(() => PropertyUncheckedCreateWithoutContactsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PropertyCreateOrConnectWithoutContactsInputSchema).optional(),
  upsert: z.lazy(() => PropertyUpsertWithoutContactsInputSchema).optional(),
  connect: z.lazy(() => PropertyWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PropertyUpdateToOneWithWhereWithoutContactsInputSchema),z.lazy(() => PropertyUpdateWithoutContactsInputSchema),z.lazy(() => PropertyUncheckedUpdateWithoutContactsInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutEmailTemplateInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutEmailTemplateInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutEmailTemplateInputSchema),z.lazy(() => UserUncheckedCreateWithoutEmailTemplateInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutEmailTemplateInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutEmailTemplateNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutEmailTemplateNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutEmailTemplateInputSchema),z.lazy(() => UserUncheckedCreateWithoutEmailTemplateInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutEmailTemplateInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutEmailTemplateInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutEmailTemplateInputSchema),z.lazy(() => UserUpdateWithoutEmailTemplateInputSchema),z.lazy(() => UserUncheckedUpdateWithoutEmailTemplateInputSchema) ]).optional(),
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

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
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

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
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
  photoUrl: z.string().optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  displayIndex: z.number().int(),
  brochures: z.lazy(() => BrochureCreateNestedManyWithoutPropertyInputSchema).optional(),
  survey: z.lazy(() => SurveyCreateNestedOneWithoutPropertiesInputSchema),
  contacts: z.lazy(() => ContactCreateNestedManyWithoutPropertyInputSchema).optional(),
  emailThreads: z.lazy(() => EmailThreadCreateNestedManyWithoutPropertyInputSchema).optional()
}).strict();

export const PropertyUncheckedCreateWithoutOwnerInputSchema: z.ZodType<Prisma.PropertyUncheckedCreateWithoutOwnerInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  photoUrl: z.string().optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  displayIndex: z.number().int(),
  surveyId: z.string(),
  brochures: z.lazy(() => BrochureUncheckedCreateNestedManyWithoutPropertyInputSchema).optional(),
  contacts: z.lazy(() => ContactUncheckedCreateNestedManyWithoutPropertyInputSchema).optional(),
  emailThreads: z.lazy(() => EmailThreadUncheckedCreateNestedManyWithoutPropertyInputSchema).optional()
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
  defaultIndex: z.number().int().optional(),
  surveys: z.lazy(() => AttributesOnSurveysCreateNestedManyWithoutAttributeInputSchema).optional()
}).strict();

export const AttributeUncheckedCreateWithoutOwnerInputSchema: z.ZodType<Prisma.AttributeUncheckedCreateWithoutOwnerInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  label: z.string(),
  type: z.string(),
  defaultIndex: z.number().int().optional(),
  surveys: z.lazy(() => AttributesOnSurveysUncheckedCreateNestedManyWithoutAttributeInputSchema).optional()
}).strict();

export const AttributeCreateOrConnectWithoutOwnerInputSchema: z.ZodType<Prisma.AttributeCreateOrConnectWithoutOwnerInput> = z.object({
  where: z.lazy(() => AttributeWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AttributeCreateWithoutOwnerInputSchema),z.lazy(() => AttributeUncheckedCreateWithoutOwnerInputSchema) ]),
}).strict();

export const AttributeCreateManyOwnerInputEnvelopeSchema: z.ZodType<Prisma.AttributeCreateManyOwnerInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => AttributeCreateManyOwnerInputSchema),z.lazy(() => AttributeCreateManyOwnerInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const EmailTemplateCreateWithoutUserInputSchema: z.ZodType<Prisma.EmailTemplateCreateWithoutUserInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  subject: z.string(),
  body: z.string()
}).strict();

export const EmailTemplateUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.EmailTemplateUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  subject: z.string(),
  body: z.string()
}).strict();

export const EmailTemplateCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.EmailTemplateCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => EmailTemplateWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => EmailTemplateCreateWithoutUserInputSchema),z.lazy(() => EmailTemplateUncheckedCreateWithoutUserInputSchema) ]),
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
  photoUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  attributes: z.lazy(() => JsonNullableFilterSchema).optional(),
  displayIndex: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
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
  defaultIndex: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict();

export const EmailTemplateUpsertWithoutUserInputSchema: z.ZodType<Prisma.EmailTemplateUpsertWithoutUserInput> = z.object({
  update: z.union([ z.lazy(() => EmailTemplateUpdateWithoutUserInputSchema),z.lazy(() => EmailTemplateUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => EmailTemplateCreateWithoutUserInputSchema),z.lazy(() => EmailTemplateUncheckedCreateWithoutUserInputSchema) ]),
  where: z.lazy(() => EmailTemplateWhereInputSchema).optional()
}).strict();

export const EmailTemplateUpdateToOneWithWhereWithoutUserInputSchema: z.ZodType<Prisma.EmailTemplateUpdateToOneWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => EmailTemplateWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => EmailTemplateUpdateWithoutUserInputSchema),z.lazy(() => EmailTemplateUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const EmailTemplateUpdateWithoutUserInputSchema: z.ZodType<Prisma.EmailTemplateUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  subject: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  body: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EmailTemplateUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.EmailTemplateUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  subject: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  body: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserCreateWithoutProjectsInputSchema: z.ZodType<Prisma.UserCreateWithoutProjectsInput> = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  emailSubscriptionId: z.string().optional().nullable(),
  emailSubscriptionExpiresAt: z.coerce.date().optional().nullable(),
  properties: z.lazy(() => PropertyCreateNestedManyWithoutOwnerInputSchema).optional(),
  attributes: z.lazy(() => AttributeCreateNestedManyWithoutOwnerInputSchema).optional(),
  emailTemplate: z.lazy(() => EmailTemplateCreateNestedOneWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutProjectsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutProjectsInput> = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  emailSubscriptionId: z.string().optional().nullable(),
  emailSubscriptionExpiresAt: z.coerce.date().optional().nullable(),
  properties: z.lazy(() => PropertyUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  attributes: z.lazy(() => AttributeUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  emailTemplate: z.lazy(() => EmailTemplateUncheckedCreateNestedOneWithoutUserInputSchema).optional()
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
  attributes: z.lazy(() => AttributesOnSurveysCreateNestedManyWithoutSurveyInputSchema).optional()
}).strict();

export const SurveyUncheckedCreateWithoutProjectInputSchema: z.ZodType<Prisma.SurveyUncheckedCreateWithoutProjectInput> = z.object({
  id: z.string().optional(),
  ownerId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  properties: z.lazy(() => PropertyUncheckedCreateNestedManyWithoutSurveyInputSchema).optional(),
  attributes: z.lazy(() => AttributesOnSurveysUncheckedCreateNestedManyWithoutSurveyInputSchema).optional()
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
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailSubscriptionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailSubscriptionExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  properties: z.lazy(() => PropertyUpdateManyWithoutOwnerNestedInputSchema).optional(),
  attributes: z.lazy(() => AttributeUpdateManyWithoutOwnerNestedInputSchema).optional(),
  emailTemplate: z.lazy(() => EmailTemplateUpdateOneWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutProjectsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutProjectsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailSubscriptionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailSubscriptionExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  properties: z.lazy(() => PropertyUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  attributes: z.lazy(() => AttributeUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  emailTemplate: z.lazy(() => EmailTemplateUncheckedUpdateOneWithoutUserNestedInputSchema).optional()
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
  photoUrl: z.string().optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  displayIndex: z.number().int(),
  owner: z.lazy(() => UserCreateNestedOneWithoutPropertiesInputSchema),
  brochures: z.lazy(() => BrochureCreateNestedManyWithoutPropertyInputSchema).optional(),
  contacts: z.lazy(() => ContactCreateNestedManyWithoutPropertyInputSchema).optional(),
  emailThreads: z.lazy(() => EmailThreadCreateNestedManyWithoutPropertyInputSchema).optional()
}).strict();

export const PropertyUncheckedCreateWithoutSurveyInputSchema: z.ZodType<Prisma.PropertyUncheckedCreateWithoutSurveyInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  ownerId: z.string(),
  photoUrl: z.string().optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  displayIndex: z.number().int(),
  brochures: z.lazy(() => BrochureUncheckedCreateNestedManyWithoutPropertyInputSchema).optional(),
  contacts: z.lazy(() => ContactUncheckedCreateNestedManyWithoutPropertyInputSchema).optional(),
  emailThreads: z.lazy(() => EmailThreadUncheckedCreateNestedManyWithoutPropertyInputSchema).optional()
}).strict();

export const PropertyCreateOrConnectWithoutSurveyInputSchema: z.ZodType<Prisma.PropertyCreateOrConnectWithoutSurveyInput> = z.object({
  where: z.lazy(() => PropertyWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PropertyCreateWithoutSurveyInputSchema),z.lazy(() => PropertyUncheckedCreateWithoutSurveyInputSchema) ]),
}).strict();

export const PropertyCreateManySurveyInputEnvelopeSchema: z.ZodType<Prisma.PropertyCreateManySurveyInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PropertyCreateManySurveyInputSchema),z.lazy(() => PropertyCreateManySurveyInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const AttributesOnSurveysCreateWithoutSurveyInputSchema: z.ZodType<Prisma.AttributesOnSurveysCreateWithoutSurveyInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  attributeIndex: z.number().int(),
  attribute: z.lazy(() => AttributeCreateNestedOneWithoutSurveysInputSchema)
}).strict();

export const AttributesOnSurveysUncheckedCreateWithoutSurveyInputSchema: z.ZodType<Prisma.AttributesOnSurveysUncheckedCreateWithoutSurveyInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  attributeId: z.string(),
  attributeIndex: z.number().int()
}).strict();

export const AttributesOnSurveysCreateOrConnectWithoutSurveyInputSchema: z.ZodType<Prisma.AttributesOnSurveysCreateOrConnectWithoutSurveyInput> = z.object({
  where: z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AttributesOnSurveysCreateWithoutSurveyInputSchema),z.lazy(() => AttributesOnSurveysUncheckedCreateWithoutSurveyInputSchema) ]),
}).strict();

export const AttributesOnSurveysCreateManySurveyInputEnvelopeSchema: z.ZodType<Prisma.AttributesOnSurveysCreateManySurveyInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => AttributesOnSurveysCreateManySurveyInputSchema),z.lazy(() => AttributesOnSurveysCreateManySurveyInputSchema).array() ]),
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

export const AttributesOnSurveysUpsertWithWhereUniqueWithoutSurveyInputSchema: z.ZodType<Prisma.AttributesOnSurveysUpsertWithWhereUniqueWithoutSurveyInput> = z.object({
  where: z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => AttributesOnSurveysUpdateWithoutSurveyInputSchema),z.lazy(() => AttributesOnSurveysUncheckedUpdateWithoutSurveyInputSchema) ]),
  create: z.union([ z.lazy(() => AttributesOnSurveysCreateWithoutSurveyInputSchema),z.lazy(() => AttributesOnSurveysUncheckedCreateWithoutSurveyInputSchema) ]),
}).strict();

export const AttributesOnSurveysUpdateWithWhereUniqueWithoutSurveyInputSchema: z.ZodType<Prisma.AttributesOnSurveysUpdateWithWhereUniqueWithoutSurveyInput> = z.object({
  where: z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => AttributesOnSurveysUpdateWithoutSurveyInputSchema),z.lazy(() => AttributesOnSurveysUncheckedUpdateWithoutSurveyInputSchema) ]),
}).strict();

export const AttributesOnSurveysUpdateManyWithWhereWithoutSurveyInputSchema: z.ZodType<Prisma.AttributesOnSurveysUpdateManyWithWhereWithoutSurveyInput> = z.object({
  where: z.lazy(() => AttributesOnSurveysScalarWhereInputSchema),
  data: z.union([ z.lazy(() => AttributesOnSurveysUpdateManyMutationInputSchema),z.lazy(() => AttributesOnSurveysUncheckedUpdateManyWithoutSurveyInputSchema) ]),
}).strict();

export const AttributesOnSurveysScalarWhereInputSchema: z.ZodType<Prisma.AttributesOnSurveysScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AttributesOnSurveysScalarWhereInputSchema),z.lazy(() => AttributesOnSurveysScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AttributesOnSurveysScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AttributesOnSurveysScalarWhereInputSchema),z.lazy(() => AttributesOnSurveysScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  attributeId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  attributeIndex: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  surveyId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const UserCreateWithoutAttributesInputSchema: z.ZodType<Prisma.UserCreateWithoutAttributesInput> = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  emailSubscriptionId: z.string().optional().nullable(),
  emailSubscriptionExpiresAt: z.coerce.date().optional().nullable(),
  projects: z.lazy(() => ProjectCreateNestedManyWithoutOwnerInputSchema).optional(),
  properties: z.lazy(() => PropertyCreateNestedManyWithoutOwnerInputSchema).optional(),
  emailTemplate: z.lazy(() => EmailTemplateCreateNestedOneWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutAttributesInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutAttributesInput> = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  emailSubscriptionId: z.string().optional().nullable(),
  emailSubscriptionExpiresAt: z.coerce.date().optional().nullable(),
  projects: z.lazy(() => ProjectUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  properties: z.lazy(() => PropertyUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  emailTemplate: z.lazy(() => EmailTemplateUncheckedCreateNestedOneWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutAttributesInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutAttributesInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutAttributesInputSchema),z.lazy(() => UserUncheckedCreateWithoutAttributesInputSchema) ]),
}).strict();

export const AttributesOnSurveysCreateWithoutAttributeInputSchema: z.ZodType<Prisma.AttributesOnSurveysCreateWithoutAttributeInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  attributeIndex: z.number().int(),
  survey: z.lazy(() => SurveyCreateNestedOneWithoutAttributesInputSchema)
}).strict();

export const AttributesOnSurveysUncheckedCreateWithoutAttributeInputSchema: z.ZodType<Prisma.AttributesOnSurveysUncheckedCreateWithoutAttributeInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  attributeIndex: z.number().int(),
  surveyId: z.string()
}).strict();

export const AttributesOnSurveysCreateOrConnectWithoutAttributeInputSchema: z.ZodType<Prisma.AttributesOnSurveysCreateOrConnectWithoutAttributeInput> = z.object({
  where: z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AttributesOnSurveysCreateWithoutAttributeInputSchema),z.lazy(() => AttributesOnSurveysUncheckedCreateWithoutAttributeInputSchema) ]),
}).strict();

export const AttributesOnSurveysCreateManyAttributeInputEnvelopeSchema: z.ZodType<Prisma.AttributesOnSurveysCreateManyAttributeInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => AttributesOnSurveysCreateManyAttributeInputSchema),z.lazy(() => AttributesOnSurveysCreateManyAttributeInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
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
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailSubscriptionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailSubscriptionExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  projects: z.lazy(() => ProjectUpdateManyWithoutOwnerNestedInputSchema).optional(),
  properties: z.lazy(() => PropertyUpdateManyWithoutOwnerNestedInputSchema).optional(),
  emailTemplate: z.lazy(() => EmailTemplateUpdateOneWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutAttributesInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutAttributesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailSubscriptionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailSubscriptionExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  projects: z.lazy(() => ProjectUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  properties: z.lazy(() => PropertyUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  emailTemplate: z.lazy(() => EmailTemplateUncheckedUpdateOneWithoutUserNestedInputSchema).optional()
}).strict();

export const AttributesOnSurveysUpsertWithWhereUniqueWithoutAttributeInputSchema: z.ZodType<Prisma.AttributesOnSurveysUpsertWithWhereUniqueWithoutAttributeInput> = z.object({
  where: z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => AttributesOnSurveysUpdateWithoutAttributeInputSchema),z.lazy(() => AttributesOnSurveysUncheckedUpdateWithoutAttributeInputSchema) ]),
  create: z.union([ z.lazy(() => AttributesOnSurveysCreateWithoutAttributeInputSchema),z.lazy(() => AttributesOnSurveysUncheckedCreateWithoutAttributeInputSchema) ]),
}).strict();

export const AttributesOnSurveysUpdateWithWhereUniqueWithoutAttributeInputSchema: z.ZodType<Prisma.AttributesOnSurveysUpdateWithWhereUniqueWithoutAttributeInput> = z.object({
  where: z.lazy(() => AttributesOnSurveysWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => AttributesOnSurveysUpdateWithoutAttributeInputSchema),z.lazy(() => AttributesOnSurveysUncheckedUpdateWithoutAttributeInputSchema) ]),
}).strict();

export const AttributesOnSurveysUpdateManyWithWhereWithoutAttributeInputSchema: z.ZodType<Prisma.AttributesOnSurveysUpdateManyWithWhereWithoutAttributeInput> = z.object({
  where: z.lazy(() => AttributesOnSurveysScalarWhereInputSchema),
  data: z.union([ z.lazy(() => AttributesOnSurveysUpdateManyMutationInputSchema),z.lazy(() => AttributesOnSurveysUncheckedUpdateManyWithoutAttributeInputSchema) ]),
}).strict();

export const AttributeCreateWithoutSurveysInputSchema: z.ZodType<Prisma.AttributeCreateWithoutSurveysInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  label: z.string(),
  type: z.string(),
  defaultIndex: z.number().int().optional(),
  owner: z.lazy(() => UserCreateNestedOneWithoutAttributesInputSchema).optional()
}).strict();

export const AttributeUncheckedCreateWithoutSurveysInputSchema: z.ZodType<Prisma.AttributeUncheckedCreateWithoutSurveysInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  label: z.string(),
  type: z.string(),
  ownerId: z.string().optional().nullable(),
  defaultIndex: z.number().int().optional()
}).strict();

export const AttributeCreateOrConnectWithoutSurveysInputSchema: z.ZodType<Prisma.AttributeCreateOrConnectWithoutSurveysInput> = z.object({
  where: z.lazy(() => AttributeWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AttributeCreateWithoutSurveysInputSchema),z.lazy(() => AttributeUncheckedCreateWithoutSurveysInputSchema) ]),
}).strict();

export const SurveyCreateWithoutAttributesInputSchema: z.ZodType<Prisma.SurveyCreateWithoutAttributesInput> = z.object({
  id: z.string().optional(),
  ownerId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  project: z.lazy(() => ProjectCreateNestedOneWithoutSurveysInputSchema),
  properties: z.lazy(() => PropertyCreateNestedManyWithoutSurveyInputSchema).optional()
}).strict();

export const SurveyUncheckedCreateWithoutAttributesInputSchema: z.ZodType<Prisma.SurveyUncheckedCreateWithoutAttributesInput> = z.object({
  id: z.string().optional(),
  ownerId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  projectId: z.string(),
  properties: z.lazy(() => PropertyUncheckedCreateNestedManyWithoutSurveyInputSchema).optional()
}).strict();

export const SurveyCreateOrConnectWithoutAttributesInputSchema: z.ZodType<Prisma.SurveyCreateOrConnectWithoutAttributesInput> = z.object({
  where: z.lazy(() => SurveyWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SurveyCreateWithoutAttributesInputSchema),z.lazy(() => SurveyUncheckedCreateWithoutAttributesInputSchema) ]),
}).strict();

export const AttributeUpsertWithoutSurveysInputSchema: z.ZodType<Prisma.AttributeUpsertWithoutSurveysInput> = z.object({
  update: z.union([ z.lazy(() => AttributeUpdateWithoutSurveysInputSchema),z.lazy(() => AttributeUncheckedUpdateWithoutSurveysInputSchema) ]),
  create: z.union([ z.lazy(() => AttributeCreateWithoutSurveysInputSchema),z.lazy(() => AttributeUncheckedCreateWithoutSurveysInputSchema) ]),
  where: z.lazy(() => AttributeWhereInputSchema).optional()
}).strict();

export const AttributeUpdateToOneWithWhereWithoutSurveysInputSchema: z.ZodType<Prisma.AttributeUpdateToOneWithWhereWithoutSurveysInput> = z.object({
  where: z.lazy(() => AttributeWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => AttributeUpdateWithoutSurveysInputSchema),z.lazy(() => AttributeUncheckedUpdateWithoutSurveysInputSchema) ]),
}).strict();

export const AttributeUpdateWithoutSurveysInputSchema: z.ZodType<Prisma.AttributeUpdateWithoutSurveysInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  defaultIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneWithoutAttributesNestedInputSchema).optional()
}).strict();

export const AttributeUncheckedUpdateWithoutSurveysInputSchema: z.ZodType<Prisma.AttributeUncheckedUpdateWithoutSurveysInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  defaultIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SurveyUpsertWithoutAttributesInputSchema: z.ZodType<Prisma.SurveyUpsertWithoutAttributesInput> = z.object({
  update: z.union([ z.lazy(() => SurveyUpdateWithoutAttributesInputSchema),z.lazy(() => SurveyUncheckedUpdateWithoutAttributesInputSchema) ]),
  create: z.union([ z.lazy(() => SurveyCreateWithoutAttributesInputSchema),z.lazy(() => SurveyUncheckedCreateWithoutAttributesInputSchema) ]),
  where: z.lazy(() => SurveyWhereInputSchema).optional()
}).strict();

export const SurveyUpdateToOneWithWhereWithoutAttributesInputSchema: z.ZodType<Prisma.SurveyUpdateToOneWithWhereWithoutAttributesInput> = z.object({
  where: z.lazy(() => SurveyWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => SurveyUpdateWithoutAttributesInputSchema),z.lazy(() => SurveyUncheckedUpdateWithoutAttributesInputSchema) ]),
}).strict();

export const SurveyUpdateWithoutAttributesInputSchema: z.ZodType<Prisma.SurveyUpdateWithoutAttributesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  project: z.lazy(() => ProjectUpdateOneRequiredWithoutSurveysNestedInputSchema).optional(),
  properties: z.lazy(() => PropertyUpdateManyWithoutSurveyNestedInputSchema).optional()
}).strict();

export const SurveyUncheckedUpdateWithoutAttributesInputSchema: z.ZodType<Prisma.SurveyUncheckedUpdateWithoutAttributesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  properties: z.lazy(() => PropertyUncheckedUpdateManyWithoutSurveyNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutPropertiesInputSchema: z.ZodType<Prisma.UserCreateWithoutPropertiesInput> = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  emailSubscriptionId: z.string().optional().nullable(),
  emailSubscriptionExpiresAt: z.coerce.date().optional().nullable(),
  projects: z.lazy(() => ProjectCreateNestedManyWithoutOwnerInputSchema).optional(),
  attributes: z.lazy(() => AttributeCreateNestedManyWithoutOwnerInputSchema).optional(),
  emailTemplate: z.lazy(() => EmailTemplateCreateNestedOneWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutPropertiesInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutPropertiesInput> = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  emailSubscriptionId: z.string().optional().nullable(),
  emailSubscriptionExpiresAt: z.coerce.date().optional().nullable(),
  projects: z.lazy(() => ProjectUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  attributes: z.lazy(() => AttributeUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  emailTemplate: z.lazy(() => EmailTemplateUncheckedCreateNestedOneWithoutUserInputSchema).optional()
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
  exportedUrl: z.string().optional().nullable(),
  thumbnailUrl: z.string().optional().nullable(),
  title: z.string(),
  approved: z.boolean().optional(),
  inpaintedRectangles: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  textToRemove: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pathsToRemove: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  undoStack: z.union([ z.lazy(() => BrochureCreateundoStackInputSchema),z.string().array() ]).optional(),
  deletedPages: z.union([ z.lazy(() => BrochureCreatedeletedPagesInputSchema),z.number().int().array() ]).optional(),
}).strict();

export const BrochureUncheckedCreateWithoutPropertyInputSchema: z.ZodType<Prisma.BrochureUncheckedCreateWithoutPropertyInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  url: z.string(),
  exportedUrl: z.string().optional().nullable(),
  thumbnailUrl: z.string().optional().nullable(),
  title: z.string(),
  approved: z.boolean().optional(),
  inpaintedRectangles: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  textToRemove: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pathsToRemove: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  undoStack: z.union([ z.lazy(() => BrochureCreateundoStackInputSchema),z.string().array() ]).optional(),
  deletedPages: z.union([ z.lazy(() => BrochureCreatedeletedPagesInputSchema),z.number().int().array() ]).optional(),
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
  attributes: z.lazy(() => AttributesOnSurveysCreateNestedManyWithoutSurveyInputSchema).optional()
}).strict();

export const SurveyUncheckedCreateWithoutPropertiesInputSchema: z.ZodType<Prisma.SurveyUncheckedCreateWithoutPropertiesInput> = z.object({
  id: z.string().optional(),
  ownerId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  projectId: z.string(),
  attributes: z.lazy(() => AttributesOnSurveysUncheckedCreateNestedManyWithoutSurveyInputSchema).optional()
}).strict();

export const SurveyCreateOrConnectWithoutPropertiesInputSchema: z.ZodType<Prisma.SurveyCreateOrConnectWithoutPropertiesInput> = z.object({
  where: z.lazy(() => SurveyWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SurveyCreateWithoutPropertiesInputSchema),z.lazy(() => SurveyUncheckedCreateWithoutPropertiesInputSchema) ]),
}).strict();

export const ContactCreateWithoutPropertyInputSchema: z.ZodType<Prisma.ContactCreateWithoutPropertyInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string().optional().nullable()
}).strict();

export const ContactUncheckedCreateWithoutPropertyInputSchema: z.ZodType<Prisma.ContactUncheckedCreateWithoutPropertyInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string().optional().nullable()
}).strict();

export const ContactCreateOrConnectWithoutPropertyInputSchema: z.ZodType<Prisma.ContactCreateOrConnectWithoutPropertyInput> = z.object({
  where: z.lazy(() => ContactWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ContactCreateWithoutPropertyInputSchema),z.lazy(() => ContactUncheckedCreateWithoutPropertyInputSchema) ]),
}).strict();

export const ContactCreateManyPropertyInputEnvelopeSchema: z.ZodType<Prisma.ContactCreateManyPropertyInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ContactCreateManyPropertyInputSchema),z.lazy(() => ContactCreateManyPropertyInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const EmailThreadCreateWithoutPropertyInputSchema: z.ZodType<Prisma.EmailThreadCreateWithoutPropertyInput> = z.object({
  id: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  unread: z.boolean().optional(),
  parsedAttributes: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  emails: z.lazy(() => EmailCreateNestedManyWithoutEmailThreadInputSchema).optional()
}).strict();

export const EmailThreadUncheckedCreateWithoutPropertyInputSchema: z.ZodType<Prisma.EmailThreadUncheckedCreateWithoutPropertyInput> = z.object({
  id: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  unread: z.boolean().optional(),
  parsedAttributes: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  emails: z.lazy(() => EmailUncheckedCreateNestedManyWithoutEmailThreadInputSchema).optional()
}).strict();

export const EmailThreadCreateOrConnectWithoutPropertyInputSchema: z.ZodType<Prisma.EmailThreadCreateOrConnectWithoutPropertyInput> = z.object({
  where: z.lazy(() => EmailThreadWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => EmailThreadCreateWithoutPropertyInputSchema),z.lazy(() => EmailThreadUncheckedCreateWithoutPropertyInputSchema) ]),
}).strict();

export const EmailThreadCreateManyPropertyInputEnvelopeSchema: z.ZodType<Prisma.EmailThreadCreateManyPropertyInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => EmailThreadCreateManyPropertyInputSchema),z.lazy(() => EmailThreadCreateManyPropertyInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
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
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailSubscriptionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailSubscriptionExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  projects: z.lazy(() => ProjectUpdateManyWithoutOwnerNestedInputSchema).optional(),
  attributes: z.lazy(() => AttributeUpdateManyWithoutOwnerNestedInputSchema).optional(),
  emailTemplate: z.lazy(() => EmailTemplateUpdateOneWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutPropertiesInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutPropertiesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailSubscriptionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailSubscriptionExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  projects: z.lazy(() => ProjectUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  attributes: z.lazy(() => AttributeUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  emailTemplate: z.lazy(() => EmailTemplateUncheckedUpdateOneWithoutUserNestedInputSchema).optional()
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
  exportedUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  thumbnailUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  approved: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  propertyId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  inpaintedRectangles: z.lazy(() => JsonNullableFilterSchema).optional(),
  textToRemove: z.lazy(() => JsonNullableFilterSchema).optional(),
  pathsToRemove: z.lazy(() => JsonNullableFilterSchema).optional(),
  undoStack: z.lazy(() => StringNullableListFilterSchema).optional(),
  deletedPages: z.lazy(() => IntNullableListFilterSchema).optional()
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
  attributes: z.lazy(() => AttributesOnSurveysUpdateManyWithoutSurveyNestedInputSchema).optional()
}).strict();

export const SurveyUncheckedUpdateWithoutPropertiesInputSchema: z.ZodType<Prisma.SurveyUncheckedUpdateWithoutPropertiesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  attributes: z.lazy(() => AttributesOnSurveysUncheckedUpdateManyWithoutSurveyNestedInputSchema).optional()
}).strict();

export const ContactUpsertWithWhereUniqueWithoutPropertyInputSchema: z.ZodType<Prisma.ContactUpsertWithWhereUniqueWithoutPropertyInput> = z.object({
  where: z.lazy(() => ContactWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ContactUpdateWithoutPropertyInputSchema),z.lazy(() => ContactUncheckedUpdateWithoutPropertyInputSchema) ]),
  create: z.union([ z.lazy(() => ContactCreateWithoutPropertyInputSchema),z.lazy(() => ContactUncheckedCreateWithoutPropertyInputSchema) ]),
}).strict();

export const ContactUpdateWithWhereUniqueWithoutPropertyInputSchema: z.ZodType<Prisma.ContactUpdateWithWhereUniqueWithoutPropertyInput> = z.object({
  where: z.lazy(() => ContactWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ContactUpdateWithoutPropertyInputSchema),z.lazy(() => ContactUncheckedUpdateWithoutPropertyInputSchema) ]),
}).strict();

export const ContactUpdateManyWithWhereWithoutPropertyInputSchema: z.ZodType<Prisma.ContactUpdateManyWithWhereWithoutPropertyInput> = z.object({
  where: z.lazy(() => ContactScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ContactUpdateManyMutationInputSchema),z.lazy(() => ContactUncheckedUpdateManyWithoutPropertyInputSchema) ]),
}).strict();

export const ContactScalarWhereInputSchema: z.ZodType<Prisma.ContactScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ContactScalarWhereInputSchema),z.lazy(() => ContactScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContactScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContactScalarWhereInputSchema),z.lazy(() => ContactScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  firstName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lastName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  phone: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  propertyId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const EmailThreadUpsertWithWhereUniqueWithoutPropertyInputSchema: z.ZodType<Prisma.EmailThreadUpsertWithWhereUniqueWithoutPropertyInput> = z.object({
  where: z.lazy(() => EmailThreadWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => EmailThreadUpdateWithoutPropertyInputSchema),z.lazy(() => EmailThreadUncheckedUpdateWithoutPropertyInputSchema) ]),
  create: z.union([ z.lazy(() => EmailThreadCreateWithoutPropertyInputSchema),z.lazy(() => EmailThreadUncheckedCreateWithoutPropertyInputSchema) ]),
}).strict();

export const EmailThreadUpdateWithWhereUniqueWithoutPropertyInputSchema: z.ZodType<Prisma.EmailThreadUpdateWithWhereUniqueWithoutPropertyInput> = z.object({
  where: z.lazy(() => EmailThreadWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => EmailThreadUpdateWithoutPropertyInputSchema),z.lazy(() => EmailThreadUncheckedUpdateWithoutPropertyInputSchema) ]),
}).strict();

export const EmailThreadUpdateManyWithWhereWithoutPropertyInputSchema: z.ZodType<Prisma.EmailThreadUpdateManyWithWhereWithoutPropertyInput> = z.object({
  where: z.lazy(() => EmailThreadScalarWhereInputSchema),
  data: z.union([ z.lazy(() => EmailThreadUpdateManyMutationInputSchema),z.lazy(() => EmailThreadUncheckedUpdateManyWithoutPropertyInputSchema) ]),
}).strict();

export const EmailThreadScalarWhereInputSchema: z.ZodType<Prisma.EmailThreadScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => EmailThreadScalarWhereInputSchema),z.lazy(() => EmailThreadScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EmailThreadScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EmailThreadScalarWhereInputSchema),z.lazy(() => EmailThreadScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  propertyId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  unread: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  parsedAttributes: z.lazy(() => JsonFilterSchema).optional()
}).strict();

export const PropertyCreateWithoutBrochuresInputSchema: z.ZodType<Prisma.PropertyCreateWithoutBrochuresInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  photoUrl: z.string().optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  displayIndex: z.number().int(),
  owner: z.lazy(() => UserCreateNestedOneWithoutPropertiesInputSchema),
  survey: z.lazy(() => SurveyCreateNestedOneWithoutPropertiesInputSchema),
  contacts: z.lazy(() => ContactCreateNestedManyWithoutPropertyInputSchema).optional(),
  emailThreads: z.lazy(() => EmailThreadCreateNestedManyWithoutPropertyInputSchema).optional()
}).strict();

export const PropertyUncheckedCreateWithoutBrochuresInputSchema: z.ZodType<Prisma.PropertyUncheckedCreateWithoutBrochuresInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  ownerId: z.string(),
  photoUrl: z.string().optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  displayIndex: z.number().int(),
  surveyId: z.string(),
  contacts: z.lazy(() => ContactUncheckedCreateNestedManyWithoutPropertyInputSchema).optional(),
  emailThreads: z.lazy(() => EmailThreadUncheckedCreateNestedManyWithoutPropertyInputSchema).optional()
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
  photoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  displayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutPropertiesNestedInputSchema).optional(),
  survey: z.lazy(() => SurveyUpdateOneRequiredWithoutPropertiesNestedInputSchema).optional(),
  contacts: z.lazy(() => ContactUpdateManyWithoutPropertyNestedInputSchema).optional(),
  emailThreads: z.lazy(() => EmailThreadUpdateManyWithoutPropertyNestedInputSchema).optional()
}).strict();

export const PropertyUncheckedUpdateWithoutBrochuresInputSchema: z.ZodType<Prisma.PropertyUncheckedUpdateWithoutBrochuresInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  photoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  displayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  surveyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contacts: z.lazy(() => ContactUncheckedUpdateManyWithoutPropertyNestedInputSchema).optional(),
  emailThreads: z.lazy(() => EmailThreadUncheckedUpdateManyWithoutPropertyNestedInputSchema).optional()
}).strict();

export const AttachmentCreateWithoutEmailInputSchema: z.ZodType<Prisma.AttachmentCreateWithoutEmailInput> = z.object({
  id: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  contentType: z.string(),
  size: z.number().int(),
  infoMessageDismissed: z.boolean().optional(),
  brochureReplaced: z.boolean().optional()
}).strict();

export const AttachmentUncheckedCreateWithoutEmailInputSchema: z.ZodType<Prisma.AttachmentUncheckedCreateWithoutEmailInput> = z.object({
  id: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  contentType: z.string(),
  size: z.number().int(),
  infoMessageDismissed: z.boolean().optional(),
  brochureReplaced: z.boolean().optional()
}).strict();

export const AttachmentCreateOrConnectWithoutEmailInputSchema: z.ZodType<Prisma.AttachmentCreateOrConnectWithoutEmailInput> = z.object({
  where: z.lazy(() => AttachmentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AttachmentCreateWithoutEmailInputSchema),z.lazy(() => AttachmentUncheckedCreateWithoutEmailInputSchema) ]),
}).strict();

export const AttachmentCreateManyEmailInputEnvelopeSchema: z.ZodType<Prisma.AttachmentCreateManyEmailInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => AttachmentCreateManyEmailInputSchema),z.lazy(() => AttachmentCreateManyEmailInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const EmailThreadCreateWithoutEmailsInputSchema: z.ZodType<Prisma.EmailThreadCreateWithoutEmailsInput> = z.object({
  id: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  unread: z.boolean().optional(),
  parsedAttributes: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  property: z.lazy(() => PropertyCreateNestedOneWithoutEmailThreadsInputSchema)
}).strict();

export const EmailThreadUncheckedCreateWithoutEmailsInputSchema: z.ZodType<Prisma.EmailThreadUncheckedCreateWithoutEmailsInput> = z.object({
  id: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  propertyId: z.string(),
  unread: z.boolean().optional(),
  parsedAttributes: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const EmailThreadCreateOrConnectWithoutEmailsInputSchema: z.ZodType<Prisma.EmailThreadCreateOrConnectWithoutEmailsInput> = z.object({
  where: z.lazy(() => EmailThreadWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => EmailThreadCreateWithoutEmailsInputSchema),z.lazy(() => EmailThreadUncheckedCreateWithoutEmailsInputSchema) ]),
}).strict();

export const AttachmentUpsertWithWhereUniqueWithoutEmailInputSchema: z.ZodType<Prisma.AttachmentUpsertWithWhereUniqueWithoutEmailInput> = z.object({
  where: z.lazy(() => AttachmentWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => AttachmentUpdateWithoutEmailInputSchema),z.lazy(() => AttachmentUncheckedUpdateWithoutEmailInputSchema) ]),
  create: z.union([ z.lazy(() => AttachmentCreateWithoutEmailInputSchema),z.lazy(() => AttachmentUncheckedCreateWithoutEmailInputSchema) ]),
}).strict();

export const AttachmentUpdateWithWhereUniqueWithoutEmailInputSchema: z.ZodType<Prisma.AttachmentUpdateWithWhereUniqueWithoutEmailInput> = z.object({
  where: z.lazy(() => AttachmentWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => AttachmentUpdateWithoutEmailInputSchema),z.lazy(() => AttachmentUncheckedUpdateWithoutEmailInputSchema) ]),
}).strict();

export const AttachmentUpdateManyWithWhereWithoutEmailInputSchema: z.ZodType<Prisma.AttachmentUpdateManyWithWhereWithoutEmailInput> = z.object({
  where: z.lazy(() => AttachmentScalarWhereInputSchema),
  data: z.union([ z.lazy(() => AttachmentUpdateManyMutationInputSchema),z.lazy(() => AttachmentUncheckedUpdateManyWithoutEmailInputSchema) ]),
}).strict();

export const AttachmentScalarWhereInputSchema: z.ZodType<Prisma.AttachmentScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AttachmentScalarWhereInputSchema),z.lazy(() => AttachmentScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AttachmentScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AttachmentScalarWhereInputSchema),z.lazy(() => AttachmentScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  contentType: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  size: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  infoMessageDismissed: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  brochureReplaced: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  emailId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const EmailThreadUpsertWithoutEmailsInputSchema: z.ZodType<Prisma.EmailThreadUpsertWithoutEmailsInput> = z.object({
  update: z.union([ z.lazy(() => EmailThreadUpdateWithoutEmailsInputSchema),z.lazy(() => EmailThreadUncheckedUpdateWithoutEmailsInputSchema) ]),
  create: z.union([ z.lazy(() => EmailThreadCreateWithoutEmailsInputSchema),z.lazy(() => EmailThreadUncheckedCreateWithoutEmailsInputSchema) ]),
  where: z.lazy(() => EmailThreadWhereInputSchema).optional()
}).strict();

export const EmailThreadUpdateToOneWithWhereWithoutEmailsInputSchema: z.ZodType<Prisma.EmailThreadUpdateToOneWithWhereWithoutEmailsInput> = z.object({
  where: z.lazy(() => EmailThreadWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => EmailThreadUpdateWithoutEmailsInputSchema),z.lazy(() => EmailThreadUncheckedUpdateWithoutEmailsInputSchema) ]),
}).strict();

export const EmailThreadUpdateWithoutEmailsInputSchema: z.ZodType<Prisma.EmailThreadUpdateWithoutEmailsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  unread: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  parsedAttributes: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  property: z.lazy(() => PropertyUpdateOneRequiredWithoutEmailThreadsNestedInputSchema).optional()
}).strict();

export const EmailThreadUncheckedUpdateWithoutEmailsInputSchema: z.ZodType<Prisma.EmailThreadUncheckedUpdateWithoutEmailsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  propertyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  unread: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  parsedAttributes: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const EmailCreateWithoutAttachmentsInputSchema: z.ZodType<Prisma.EmailCreateWithoutAttachmentsInput> = z.object({
  id: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  senderName: z.string(),
  senderEmail: z.string(),
  recipientName: z.string(),
  recipientEmail: z.string(),
  subject: z.string().optional(),
  body: z.string(),
  webLink: z.string(),
  isDraft: z.boolean().optional(),
  emailThread: z.lazy(() => EmailThreadCreateNestedOneWithoutEmailsInputSchema)
}).strict();

export const EmailUncheckedCreateWithoutAttachmentsInputSchema: z.ZodType<Prisma.EmailUncheckedCreateWithoutAttachmentsInput> = z.object({
  id: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  senderName: z.string(),
  senderEmail: z.string(),
  recipientName: z.string(),
  recipientEmail: z.string(),
  subject: z.string().optional(),
  body: z.string(),
  webLink: z.string(),
  isDraft: z.boolean().optional(),
  emailThreadId: z.string()
}).strict();

export const EmailCreateOrConnectWithoutAttachmentsInputSchema: z.ZodType<Prisma.EmailCreateOrConnectWithoutAttachmentsInput> = z.object({
  where: z.lazy(() => EmailWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => EmailCreateWithoutAttachmentsInputSchema),z.lazy(() => EmailUncheckedCreateWithoutAttachmentsInputSchema) ]),
}).strict();

export const EmailUpsertWithoutAttachmentsInputSchema: z.ZodType<Prisma.EmailUpsertWithoutAttachmentsInput> = z.object({
  update: z.union([ z.lazy(() => EmailUpdateWithoutAttachmentsInputSchema),z.lazy(() => EmailUncheckedUpdateWithoutAttachmentsInputSchema) ]),
  create: z.union([ z.lazy(() => EmailCreateWithoutAttachmentsInputSchema),z.lazy(() => EmailUncheckedCreateWithoutAttachmentsInputSchema) ]),
  where: z.lazy(() => EmailWhereInputSchema).optional()
}).strict();

export const EmailUpdateToOneWithWhereWithoutAttachmentsInputSchema: z.ZodType<Prisma.EmailUpdateToOneWithWhereWithoutAttachmentsInput> = z.object({
  where: z.lazy(() => EmailWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => EmailUpdateWithoutAttachmentsInputSchema),z.lazy(() => EmailUncheckedUpdateWithoutAttachmentsInputSchema) ]),
}).strict();

export const EmailUpdateWithoutAttachmentsInputSchema: z.ZodType<Prisma.EmailUpdateWithoutAttachmentsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  senderName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  senderEmail: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  recipientName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  recipientEmail: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subject: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  body: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  webLink: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDraft: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  emailThread: z.lazy(() => EmailThreadUpdateOneRequiredWithoutEmailsNestedInputSchema).optional()
}).strict();

export const EmailUncheckedUpdateWithoutAttachmentsInputSchema: z.ZodType<Prisma.EmailUncheckedUpdateWithoutAttachmentsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  senderName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  senderEmail: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  recipientName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  recipientEmail: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subject: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  body: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  webLink: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDraft: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  emailThreadId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EmailCreateWithoutEmailThreadInputSchema: z.ZodType<Prisma.EmailCreateWithoutEmailThreadInput> = z.object({
  id: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  senderName: z.string(),
  senderEmail: z.string(),
  recipientName: z.string(),
  recipientEmail: z.string(),
  subject: z.string().optional(),
  body: z.string(),
  webLink: z.string(),
  isDraft: z.boolean().optional(),
  attachments: z.lazy(() => AttachmentCreateNestedManyWithoutEmailInputSchema).optional()
}).strict();

export const EmailUncheckedCreateWithoutEmailThreadInputSchema: z.ZodType<Prisma.EmailUncheckedCreateWithoutEmailThreadInput> = z.object({
  id: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  senderName: z.string(),
  senderEmail: z.string(),
  recipientName: z.string(),
  recipientEmail: z.string(),
  subject: z.string().optional(),
  body: z.string(),
  webLink: z.string(),
  isDraft: z.boolean().optional(),
  attachments: z.lazy(() => AttachmentUncheckedCreateNestedManyWithoutEmailInputSchema).optional()
}).strict();

export const EmailCreateOrConnectWithoutEmailThreadInputSchema: z.ZodType<Prisma.EmailCreateOrConnectWithoutEmailThreadInput> = z.object({
  where: z.lazy(() => EmailWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => EmailCreateWithoutEmailThreadInputSchema),z.lazy(() => EmailUncheckedCreateWithoutEmailThreadInputSchema) ]),
}).strict();

export const EmailCreateManyEmailThreadInputEnvelopeSchema: z.ZodType<Prisma.EmailCreateManyEmailThreadInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => EmailCreateManyEmailThreadInputSchema),z.lazy(() => EmailCreateManyEmailThreadInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const PropertyCreateWithoutEmailThreadsInputSchema: z.ZodType<Prisma.PropertyCreateWithoutEmailThreadsInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  photoUrl: z.string().optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  displayIndex: z.number().int(),
  owner: z.lazy(() => UserCreateNestedOneWithoutPropertiesInputSchema),
  brochures: z.lazy(() => BrochureCreateNestedManyWithoutPropertyInputSchema).optional(),
  survey: z.lazy(() => SurveyCreateNestedOneWithoutPropertiesInputSchema),
  contacts: z.lazy(() => ContactCreateNestedManyWithoutPropertyInputSchema).optional()
}).strict();

export const PropertyUncheckedCreateWithoutEmailThreadsInputSchema: z.ZodType<Prisma.PropertyUncheckedCreateWithoutEmailThreadsInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  ownerId: z.string(),
  photoUrl: z.string().optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  displayIndex: z.number().int(),
  surveyId: z.string(),
  brochures: z.lazy(() => BrochureUncheckedCreateNestedManyWithoutPropertyInputSchema).optional(),
  contacts: z.lazy(() => ContactUncheckedCreateNestedManyWithoutPropertyInputSchema).optional()
}).strict();

export const PropertyCreateOrConnectWithoutEmailThreadsInputSchema: z.ZodType<Prisma.PropertyCreateOrConnectWithoutEmailThreadsInput> = z.object({
  where: z.lazy(() => PropertyWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PropertyCreateWithoutEmailThreadsInputSchema),z.lazy(() => PropertyUncheckedCreateWithoutEmailThreadsInputSchema) ]),
}).strict();

export const EmailUpsertWithWhereUniqueWithoutEmailThreadInputSchema: z.ZodType<Prisma.EmailUpsertWithWhereUniqueWithoutEmailThreadInput> = z.object({
  where: z.lazy(() => EmailWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => EmailUpdateWithoutEmailThreadInputSchema),z.lazy(() => EmailUncheckedUpdateWithoutEmailThreadInputSchema) ]),
  create: z.union([ z.lazy(() => EmailCreateWithoutEmailThreadInputSchema),z.lazy(() => EmailUncheckedCreateWithoutEmailThreadInputSchema) ]),
}).strict();

export const EmailUpdateWithWhereUniqueWithoutEmailThreadInputSchema: z.ZodType<Prisma.EmailUpdateWithWhereUniqueWithoutEmailThreadInput> = z.object({
  where: z.lazy(() => EmailWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => EmailUpdateWithoutEmailThreadInputSchema),z.lazy(() => EmailUncheckedUpdateWithoutEmailThreadInputSchema) ]),
}).strict();

export const EmailUpdateManyWithWhereWithoutEmailThreadInputSchema: z.ZodType<Prisma.EmailUpdateManyWithWhereWithoutEmailThreadInput> = z.object({
  where: z.lazy(() => EmailScalarWhereInputSchema),
  data: z.union([ z.lazy(() => EmailUpdateManyMutationInputSchema),z.lazy(() => EmailUncheckedUpdateManyWithoutEmailThreadInputSchema) ]),
}).strict();

export const EmailScalarWhereInputSchema: z.ZodType<Prisma.EmailScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => EmailScalarWhereInputSchema),z.lazy(() => EmailScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EmailScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EmailScalarWhereInputSchema),z.lazy(() => EmailScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  senderName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  senderEmail: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  recipientName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  recipientEmail: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  subject: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  body: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  webLink: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  isDraft: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  emailThreadId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const PropertyUpsertWithoutEmailThreadsInputSchema: z.ZodType<Prisma.PropertyUpsertWithoutEmailThreadsInput> = z.object({
  update: z.union([ z.lazy(() => PropertyUpdateWithoutEmailThreadsInputSchema),z.lazy(() => PropertyUncheckedUpdateWithoutEmailThreadsInputSchema) ]),
  create: z.union([ z.lazy(() => PropertyCreateWithoutEmailThreadsInputSchema),z.lazy(() => PropertyUncheckedCreateWithoutEmailThreadsInputSchema) ]),
  where: z.lazy(() => PropertyWhereInputSchema).optional()
}).strict();

export const PropertyUpdateToOneWithWhereWithoutEmailThreadsInputSchema: z.ZodType<Prisma.PropertyUpdateToOneWithWhereWithoutEmailThreadsInput> = z.object({
  where: z.lazy(() => PropertyWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PropertyUpdateWithoutEmailThreadsInputSchema),z.lazy(() => PropertyUncheckedUpdateWithoutEmailThreadsInputSchema) ]),
}).strict();

export const PropertyUpdateWithoutEmailThreadsInputSchema: z.ZodType<Prisma.PropertyUpdateWithoutEmailThreadsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  photoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  displayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutPropertiesNestedInputSchema).optional(),
  brochures: z.lazy(() => BrochureUpdateManyWithoutPropertyNestedInputSchema).optional(),
  survey: z.lazy(() => SurveyUpdateOneRequiredWithoutPropertiesNestedInputSchema).optional(),
  contacts: z.lazy(() => ContactUpdateManyWithoutPropertyNestedInputSchema).optional()
}).strict();

export const PropertyUncheckedUpdateWithoutEmailThreadsInputSchema: z.ZodType<Prisma.PropertyUncheckedUpdateWithoutEmailThreadsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  photoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  displayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  surveyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  brochures: z.lazy(() => BrochureUncheckedUpdateManyWithoutPropertyNestedInputSchema).optional(),
  contacts: z.lazy(() => ContactUncheckedUpdateManyWithoutPropertyNestedInputSchema).optional()
}).strict();

export const PropertyCreateWithoutContactsInputSchema: z.ZodType<Prisma.PropertyCreateWithoutContactsInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  photoUrl: z.string().optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  displayIndex: z.number().int(),
  owner: z.lazy(() => UserCreateNestedOneWithoutPropertiesInputSchema),
  brochures: z.lazy(() => BrochureCreateNestedManyWithoutPropertyInputSchema).optional(),
  survey: z.lazy(() => SurveyCreateNestedOneWithoutPropertiesInputSchema),
  emailThreads: z.lazy(() => EmailThreadCreateNestedManyWithoutPropertyInputSchema).optional()
}).strict();

export const PropertyUncheckedCreateWithoutContactsInputSchema: z.ZodType<Prisma.PropertyUncheckedCreateWithoutContactsInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  ownerId: z.string(),
  photoUrl: z.string().optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  displayIndex: z.number().int(),
  surveyId: z.string(),
  brochures: z.lazy(() => BrochureUncheckedCreateNestedManyWithoutPropertyInputSchema).optional(),
  emailThreads: z.lazy(() => EmailThreadUncheckedCreateNestedManyWithoutPropertyInputSchema).optional()
}).strict();

export const PropertyCreateOrConnectWithoutContactsInputSchema: z.ZodType<Prisma.PropertyCreateOrConnectWithoutContactsInput> = z.object({
  where: z.lazy(() => PropertyWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PropertyCreateWithoutContactsInputSchema),z.lazy(() => PropertyUncheckedCreateWithoutContactsInputSchema) ]),
}).strict();

export const PropertyUpsertWithoutContactsInputSchema: z.ZodType<Prisma.PropertyUpsertWithoutContactsInput> = z.object({
  update: z.union([ z.lazy(() => PropertyUpdateWithoutContactsInputSchema),z.lazy(() => PropertyUncheckedUpdateWithoutContactsInputSchema) ]),
  create: z.union([ z.lazy(() => PropertyCreateWithoutContactsInputSchema),z.lazy(() => PropertyUncheckedCreateWithoutContactsInputSchema) ]),
  where: z.lazy(() => PropertyWhereInputSchema).optional()
}).strict();

export const PropertyUpdateToOneWithWhereWithoutContactsInputSchema: z.ZodType<Prisma.PropertyUpdateToOneWithWhereWithoutContactsInput> = z.object({
  where: z.lazy(() => PropertyWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PropertyUpdateWithoutContactsInputSchema),z.lazy(() => PropertyUncheckedUpdateWithoutContactsInputSchema) ]),
}).strict();

export const PropertyUpdateWithoutContactsInputSchema: z.ZodType<Prisma.PropertyUpdateWithoutContactsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  photoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  displayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutPropertiesNestedInputSchema).optional(),
  brochures: z.lazy(() => BrochureUpdateManyWithoutPropertyNestedInputSchema).optional(),
  survey: z.lazy(() => SurveyUpdateOneRequiredWithoutPropertiesNestedInputSchema).optional(),
  emailThreads: z.lazy(() => EmailThreadUpdateManyWithoutPropertyNestedInputSchema).optional()
}).strict();

export const PropertyUncheckedUpdateWithoutContactsInputSchema: z.ZodType<Prisma.PropertyUncheckedUpdateWithoutContactsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  photoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  displayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  surveyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  brochures: z.lazy(() => BrochureUncheckedUpdateManyWithoutPropertyNestedInputSchema).optional(),
  emailThreads: z.lazy(() => EmailThreadUncheckedUpdateManyWithoutPropertyNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutEmailTemplateInputSchema: z.ZodType<Prisma.UserCreateWithoutEmailTemplateInput> = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  emailSubscriptionId: z.string().optional().nullable(),
  emailSubscriptionExpiresAt: z.coerce.date().optional().nullable(),
  projects: z.lazy(() => ProjectCreateNestedManyWithoutOwnerInputSchema).optional(),
  properties: z.lazy(() => PropertyCreateNestedManyWithoutOwnerInputSchema).optional(),
  attributes: z.lazy(() => AttributeCreateNestedManyWithoutOwnerInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutEmailTemplateInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutEmailTemplateInput> = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  emailSubscriptionId: z.string().optional().nullable(),
  emailSubscriptionExpiresAt: z.coerce.date().optional().nullable(),
  projects: z.lazy(() => ProjectUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  properties: z.lazy(() => PropertyUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  attributes: z.lazy(() => AttributeUncheckedCreateNestedManyWithoutOwnerInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutEmailTemplateInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutEmailTemplateInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutEmailTemplateInputSchema),z.lazy(() => UserUncheckedCreateWithoutEmailTemplateInputSchema) ]),
}).strict();

export const UserUpsertWithoutEmailTemplateInputSchema: z.ZodType<Prisma.UserUpsertWithoutEmailTemplateInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutEmailTemplateInputSchema),z.lazy(() => UserUncheckedUpdateWithoutEmailTemplateInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutEmailTemplateInputSchema),z.lazy(() => UserUncheckedCreateWithoutEmailTemplateInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutEmailTemplateInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutEmailTemplateInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutEmailTemplateInputSchema),z.lazy(() => UserUncheckedUpdateWithoutEmailTemplateInputSchema) ]),
}).strict();

export const UserUpdateWithoutEmailTemplateInputSchema: z.ZodType<Prisma.UserUpdateWithoutEmailTemplateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailSubscriptionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailSubscriptionExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  projects: z.lazy(() => ProjectUpdateManyWithoutOwnerNestedInputSchema).optional(),
  properties: z.lazy(() => PropertyUpdateManyWithoutOwnerNestedInputSchema).optional(),
  attributes: z.lazy(() => AttributeUpdateManyWithoutOwnerNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutEmailTemplateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutEmailTemplateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailSubscriptionId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailSubscriptionExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  projects: z.lazy(() => ProjectUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  properties: z.lazy(() => PropertyUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  attributes: z.lazy(() => AttributeUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional()
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
  photoUrl: z.string().optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  displayIndex: z.number().int(),
  surveyId: z.string()
}).strict();

export const AttributeCreateManyOwnerInputSchema: z.ZodType<Prisma.AttributeCreateManyOwnerInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  label: z.string(),
  type: z.string(),
  defaultIndex: z.number().int().optional()
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
  photoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  displayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  brochures: z.lazy(() => BrochureUpdateManyWithoutPropertyNestedInputSchema).optional(),
  survey: z.lazy(() => SurveyUpdateOneRequiredWithoutPropertiesNestedInputSchema).optional(),
  contacts: z.lazy(() => ContactUpdateManyWithoutPropertyNestedInputSchema).optional(),
  emailThreads: z.lazy(() => EmailThreadUpdateManyWithoutPropertyNestedInputSchema).optional()
}).strict();

export const PropertyUncheckedUpdateWithoutOwnerInputSchema: z.ZodType<Prisma.PropertyUncheckedUpdateWithoutOwnerInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  photoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  displayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  surveyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  brochures: z.lazy(() => BrochureUncheckedUpdateManyWithoutPropertyNestedInputSchema).optional(),
  contacts: z.lazy(() => ContactUncheckedUpdateManyWithoutPropertyNestedInputSchema).optional(),
  emailThreads: z.lazy(() => EmailThreadUncheckedUpdateManyWithoutPropertyNestedInputSchema).optional()
}).strict();

export const PropertyUncheckedUpdateManyWithoutOwnerInputSchema: z.ZodType<Prisma.PropertyUncheckedUpdateManyWithoutOwnerInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  photoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  displayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  surveyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AttributeUpdateWithoutOwnerInputSchema: z.ZodType<Prisma.AttributeUpdateWithoutOwnerInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  defaultIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  surveys: z.lazy(() => AttributesOnSurveysUpdateManyWithoutAttributeNestedInputSchema).optional()
}).strict();

export const AttributeUncheckedUpdateWithoutOwnerInputSchema: z.ZodType<Prisma.AttributeUncheckedUpdateWithoutOwnerInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  defaultIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  surveys: z.lazy(() => AttributesOnSurveysUncheckedUpdateManyWithoutAttributeNestedInputSchema).optional()
}).strict();

export const AttributeUncheckedUpdateManyWithoutOwnerInputSchema: z.ZodType<Prisma.AttributeUncheckedUpdateManyWithoutOwnerInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  defaultIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
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
  attributes: z.lazy(() => AttributesOnSurveysUpdateManyWithoutSurveyNestedInputSchema).optional()
}).strict();

export const SurveyUncheckedUpdateWithoutProjectInputSchema: z.ZodType<Prisma.SurveyUncheckedUpdateWithoutProjectInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  properties: z.lazy(() => PropertyUncheckedUpdateManyWithoutSurveyNestedInputSchema).optional(),
  attributes: z.lazy(() => AttributesOnSurveysUncheckedUpdateManyWithoutSurveyNestedInputSchema).optional()
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
  photoUrl: z.string().optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  displayIndex: z.number().int()
}).strict();

export const AttributesOnSurveysCreateManySurveyInputSchema: z.ZodType<Prisma.AttributesOnSurveysCreateManySurveyInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  attributeId: z.string(),
  attributeIndex: z.number().int()
}).strict();

export const PropertyUpdateWithoutSurveyInputSchema: z.ZodType<Prisma.PropertyUpdateWithoutSurveyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  photoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  displayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutPropertiesNestedInputSchema).optional(),
  brochures: z.lazy(() => BrochureUpdateManyWithoutPropertyNestedInputSchema).optional(),
  contacts: z.lazy(() => ContactUpdateManyWithoutPropertyNestedInputSchema).optional(),
  emailThreads: z.lazy(() => EmailThreadUpdateManyWithoutPropertyNestedInputSchema).optional()
}).strict();

export const PropertyUncheckedUpdateWithoutSurveyInputSchema: z.ZodType<Prisma.PropertyUncheckedUpdateWithoutSurveyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  photoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  displayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  brochures: z.lazy(() => BrochureUncheckedUpdateManyWithoutPropertyNestedInputSchema).optional(),
  contacts: z.lazy(() => ContactUncheckedUpdateManyWithoutPropertyNestedInputSchema).optional(),
  emailThreads: z.lazy(() => EmailThreadUncheckedUpdateManyWithoutPropertyNestedInputSchema).optional()
}).strict();

export const PropertyUncheckedUpdateManyWithoutSurveyInputSchema: z.ZodType<Prisma.PropertyUncheckedUpdateManyWithoutSurveyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  photoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  displayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AttributesOnSurveysUpdateWithoutSurveyInputSchema: z.ZodType<Prisma.AttributesOnSurveysUpdateWithoutSurveyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  attributeIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  attribute: z.lazy(() => AttributeUpdateOneRequiredWithoutSurveysNestedInputSchema).optional()
}).strict();

export const AttributesOnSurveysUncheckedUpdateWithoutSurveyInputSchema: z.ZodType<Prisma.AttributesOnSurveysUncheckedUpdateWithoutSurveyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  attributeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  attributeIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AttributesOnSurveysUncheckedUpdateManyWithoutSurveyInputSchema: z.ZodType<Prisma.AttributesOnSurveysUncheckedUpdateManyWithoutSurveyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  attributeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  attributeIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AttributesOnSurveysCreateManyAttributeInputSchema: z.ZodType<Prisma.AttributesOnSurveysCreateManyAttributeInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  attributeIndex: z.number().int(),
  surveyId: z.string()
}).strict();

export const AttributesOnSurveysUpdateWithoutAttributeInputSchema: z.ZodType<Prisma.AttributesOnSurveysUpdateWithoutAttributeInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  attributeIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  survey: z.lazy(() => SurveyUpdateOneRequiredWithoutAttributesNestedInputSchema).optional()
}).strict();

export const AttributesOnSurveysUncheckedUpdateWithoutAttributeInputSchema: z.ZodType<Prisma.AttributesOnSurveysUncheckedUpdateWithoutAttributeInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  attributeIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  surveyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AttributesOnSurveysUncheckedUpdateManyWithoutAttributeInputSchema: z.ZodType<Prisma.AttributesOnSurveysUncheckedUpdateManyWithoutAttributeInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  attributeIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  surveyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BrochureCreateManyPropertyInputSchema: z.ZodType<Prisma.BrochureCreateManyPropertyInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  url: z.string(),
  exportedUrl: z.string().optional().nullable(),
  thumbnailUrl: z.string().optional().nullable(),
  title: z.string(),
  approved: z.boolean().optional(),
  inpaintedRectangles: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  textToRemove: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pathsToRemove: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  undoStack: z.union([ z.lazy(() => BrochureCreateundoStackInputSchema),z.string().array() ]).optional(),
  deletedPages: z.union([ z.lazy(() => BrochureCreatedeletedPagesInputSchema),z.number().int().array() ]).optional(),
}).strict();

export const ContactCreateManyPropertyInputSchema: z.ZodType<Prisma.ContactCreateManyPropertyInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string().optional().nullable()
}).strict();

export const EmailThreadCreateManyPropertyInputSchema: z.ZodType<Prisma.EmailThreadCreateManyPropertyInput> = z.object({
  id: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  unread: z.boolean().optional(),
  parsedAttributes: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const BrochureUpdateWithoutPropertyInputSchema: z.ZodType<Prisma.BrochureUpdateWithoutPropertyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exportedUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  thumbnailUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  approved: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  inpaintedRectangles: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  textToRemove: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pathsToRemove: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  undoStack: z.union([ z.lazy(() => BrochureUpdateundoStackInputSchema),z.string().array() ]).optional(),
  deletedPages: z.union([ z.lazy(() => BrochureUpdatedeletedPagesInputSchema),z.number().int().array() ]).optional(),
}).strict();

export const BrochureUncheckedUpdateWithoutPropertyInputSchema: z.ZodType<Prisma.BrochureUncheckedUpdateWithoutPropertyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exportedUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  thumbnailUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  approved: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  inpaintedRectangles: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  textToRemove: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pathsToRemove: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  undoStack: z.union([ z.lazy(() => BrochureUpdateundoStackInputSchema),z.string().array() ]).optional(),
  deletedPages: z.union([ z.lazy(() => BrochureUpdatedeletedPagesInputSchema),z.number().int().array() ]).optional(),
}).strict();

export const BrochureUncheckedUpdateManyWithoutPropertyInputSchema: z.ZodType<Prisma.BrochureUncheckedUpdateManyWithoutPropertyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exportedUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  thumbnailUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  approved: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  inpaintedRectangles: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  textToRemove: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pathsToRemove: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  undoStack: z.union([ z.lazy(() => BrochureUpdateundoStackInputSchema),z.string().array() ]).optional(),
  deletedPages: z.union([ z.lazy(() => BrochureUpdatedeletedPagesInputSchema),z.number().int().array() ]).optional(),
}).strict();

export const ContactUpdateWithoutPropertyInputSchema: z.ZodType<Prisma.ContactUpdateWithoutPropertyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ContactUncheckedUpdateWithoutPropertyInputSchema: z.ZodType<Prisma.ContactUncheckedUpdateWithoutPropertyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ContactUncheckedUpdateManyWithoutPropertyInputSchema: z.ZodType<Prisma.ContactUncheckedUpdateManyWithoutPropertyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const EmailThreadUpdateWithoutPropertyInputSchema: z.ZodType<Prisma.EmailThreadUpdateWithoutPropertyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  unread: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  parsedAttributes: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  emails: z.lazy(() => EmailUpdateManyWithoutEmailThreadNestedInputSchema).optional()
}).strict();

export const EmailThreadUncheckedUpdateWithoutPropertyInputSchema: z.ZodType<Prisma.EmailThreadUncheckedUpdateWithoutPropertyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  unread: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  parsedAttributes: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  emails: z.lazy(() => EmailUncheckedUpdateManyWithoutEmailThreadNestedInputSchema).optional()
}).strict();

export const EmailThreadUncheckedUpdateManyWithoutPropertyInputSchema: z.ZodType<Prisma.EmailThreadUncheckedUpdateManyWithoutPropertyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  unread: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  parsedAttributes: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const AttachmentCreateManyEmailInputSchema: z.ZodType<Prisma.AttachmentCreateManyEmailInput> = z.object({
  id: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  contentType: z.string(),
  size: z.number().int(),
  infoMessageDismissed: z.boolean().optional(),
  brochureReplaced: z.boolean().optional()
}).strict();

export const AttachmentUpdateWithoutEmailInputSchema: z.ZodType<Prisma.AttachmentUpdateWithoutEmailInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contentType: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  size: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  infoMessageDismissed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  brochureReplaced: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AttachmentUncheckedUpdateWithoutEmailInputSchema: z.ZodType<Prisma.AttachmentUncheckedUpdateWithoutEmailInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contentType: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  size: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  infoMessageDismissed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  brochureReplaced: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AttachmentUncheckedUpdateManyWithoutEmailInputSchema: z.ZodType<Prisma.AttachmentUncheckedUpdateManyWithoutEmailInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contentType: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  size: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  infoMessageDismissed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  brochureReplaced: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EmailCreateManyEmailThreadInputSchema: z.ZodType<Prisma.EmailCreateManyEmailThreadInput> = z.object({
  id: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  senderName: z.string(),
  senderEmail: z.string(),
  recipientName: z.string(),
  recipientEmail: z.string(),
  subject: z.string().optional(),
  body: z.string(),
  webLink: z.string(),
  isDraft: z.boolean().optional()
}).strict();

export const EmailUpdateWithoutEmailThreadInputSchema: z.ZodType<Prisma.EmailUpdateWithoutEmailThreadInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  senderName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  senderEmail: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  recipientName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  recipientEmail: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subject: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  body: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  webLink: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDraft: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  attachments: z.lazy(() => AttachmentUpdateManyWithoutEmailNestedInputSchema).optional()
}).strict();

export const EmailUncheckedUpdateWithoutEmailThreadInputSchema: z.ZodType<Prisma.EmailUncheckedUpdateWithoutEmailThreadInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  senderName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  senderEmail: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  recipientName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  recipientEmail: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subject: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  body: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  webLink: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDraft: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  attachments: z.lazy(() => AttachmentUncheckedUpdateManyWithoutEmailNestedInputSchema).optional()
}).strict();

export const EmailUncheckedUpdateManyWithoutEmailThreadInputSchema: z.ZodType<Prisma.EmailUncheckedUpdateManyWithoutEmailThreadInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  senderName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  senderEmail: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  recipientName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  recipientEmail: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subject: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  body: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  webLink: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDraft: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
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

export const AttributesOnSurveysFindFirstArgsSchema: z.ZodType<Prisma.AttributesOnSurveysFindFirstArgs> = z.object({
  select: AttributesOnSurveysSelectSchema.optional(),
  include: AttributesOnSurveysIncludeSchema.optional(),
  where: AttributesOnSurveysWhereInputSchema.optional(),
  orderBy: z.union([ AttributesOnSurveysOrderByWithRelationInputSchema.array(),AttributesOnSurveysOrderByWithRelationInputSchema ]).optional(),
  cursor: AttributesOnSurveysWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AttributesOnSurveysScalarFieldEnumSchema,AttributesOnSurveysScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AttributesOnSurveysFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AttributesOnSurveysFindFirstOrThrowArgs> = z.object({
  select: AttributesOnSurveysSelectSchema.optional(),
  include: AttributesOnSurveysIncludeSchema.optional(),
  where: AttributesOnSurveysWhereInputSchema.optional(),
  orderBy: z.union([ AttributesOnSurveysOrderByWithRelationInputSchema.array(),AttributesOnSurveysOrderByWithRelationInputSchema ]).optional(),
  cursor: AttributesOnSurveysWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AttributesOnSurveysScalarFieldEnumSchema,AttributesOnSurveysScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AttributesOnSurveysFindManyArgsSchema: z.ZodType<Prisma.AttributesOnSurveysFindManyArgs> = z.object({
  select: AttributesOnSurveysSelectSchema.optional(),
  include: AttributesOnSurveysIncludeSchema.optional(),
  where: AttributesOnSurveysWhereInputSchema.optional(),
  orderBy: z.union([ AttributesOnSurveysOrderByWithRelationInputSchema.array(),AttributesOnSurveysOrderByWithRelationInputSchema ]).optional(),
  cursor: AttributesOnSurveysWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AttributesOnSurveysScalarFieldEnumSchema,AttributesOnSurveysScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AttributesOnSurveysAggregateArgsSchema: z.ZodType<Prisma.AttributesOnSurveysAggregateArgs> = z.object({
  where: AttributesOnSurveysWhereInputSchema.optional(),
  orderBy: z.union([ AttributesOnSurveysOrderByWithRelationInputSchema.array(),AttributesOnSurveysOrderByWithRelationInputSchema ]).optional(),
  cursor: AttributesOnSurveysWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AttributesOnSurveysGroupByArgsSchema: z.ZodType<Prisma.AttributesOnSurveysGroupByArgs> = z.object({
  where: AttributesOnSurveysWhereInputSchema.optional(),
  orderBy: z.union([ AttributesOnSurveysOrderByWithAggregationInputSchema.array(),AttributesOnSurveysOrderByWithAggregationInputSchema ]).optional(),
  by: AttributesOnSurveysScalarFieldEnumSchema.array(),
  having: AttributesOnSurveysScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AttributesOnSurveysFindUniqueArgsSchema: z.ZodType<Prisma.AttributesOnSurveysFindUniqueArgs> = z.object({
  select: AttributesOnSurveysSelectSchema.optional(),
  include: AttributesOnSurveysIncludeSchema.optional(),
  where: AttributesOnSurveysWhereUniqueInputSchema,
}).strict() ;

export const AttributesOnSurveysFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AttributesOnSurveysFindUniqueOrThrowArgs> = z.object({
  select: AttributesOnSurveysSelectSchema.optional(),
  include: AttributesOnSurveysIncludeSchema.optional(),
  where: AttributesOnSurveysWhereUniqueInputSchema,
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

export const EmailFindFirstArgsSchema: z.ZodType<Prisma.EmailFindFirstArgs> = z.object({
  select: EmailSelectSchema.optional(),
  include: EmailIncludeSchema.optional(),
  where: EmailWhereInputSchema.optional(),
  orderBy: z.union([ EmailOrderByWithRelationInputSchema.array(),EmailOrderByWithRelationInputSchema ]).optional(),
  cursor: EmailWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EmailScalarFieldEnumSchema,EmailScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EmailFindFirstOrThrowArgsSchema: z.ZodType<Prisma.EmailFindFirstOrThrowArgs> = z.object({
  select: EmailSelectSchema.optional(),
  include: EmailIncludeSchema.optional(),
  where: EmailWhereInputSchema.optional(),
  orderBy: z.union([ EmailOrderByWithRelationInputSchema.array(),EmailOrderByWithRelationInputSchema ]).optional(),
  cursor: EmailWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EmailScalarFieldEnumSchema,EmailScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EmailFindManyArgsSchema: z.ZodType<Prisma.EmailFindManyArgs> = z.object({
  select: EmailSelectSchema.optional(),
  include: EmailIncludeSchema.optional(),
  where: EmailWhereInputSchema.optional(),
  orderBy: z.union([ EmailOrderByWithRelationInputSchema.array(),EmailOrderByWithRelationInputSchema ]).optional(),
  cursor: EmailWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EmailScalarFieldEnumSchema,EmailScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EmailAggregateArgsSchema: z.ZodType<Prisma.EmailAggregateArgs> = z.object({
  where: EmailWhereInputSchema.optional(),
  orderBy: z.union([ EmailOrderByWithRelationInputSchema.array(),EmailOrderByWithRelationInputSchema ]).optional(),
  cursor: EmailWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EmailGroupByArgsSchema: z.ZodType<Prisma.EmailGroupByArgs> = z.object({
  where: EmailWhereInputSchema.optional(),
  orderBy: z.union([ EmailOrderByWithAggregationInputSchema.array(),EmailOrderByWithAggregationInputSchema ]).optional(),
  by: EmailScalarFieldEnumSchema.array(),
  having: EmailScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EmailFindUniqueArgsSchema: z.ZodType<Prisma.EmailFindUniqueArgs> = z.object({
  select: EmailSelectSchema.optional(),
  include: EmailIncludeSchema.optional(),
  where: EmailWhereUniqueInputSchema,
}).strict() ;

export const EmailFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.EmailFindUniqueOrThrowArgs> = z.object({
  select: EmailSelectSchema.optional(),
  include: EmailIncludeSchema.optional(),
  where: EmailWhereUniqueInputSchema,
}).strict() ;

export const AttachmentFindFirstArgsSchema: z.ZodType<Prisma.AttachmentFindFirstArgs> = z.object({
  select: AttachmentSelectSchema.optional(),
  include: AttachmentIncludeSchema.optional(),
  where: AttachmentWhereInputSchema.optional(),
  orderBy: z.union([ AttachmentOrderByWithRelationInputSchema.array(),AttachmentOrderByWithRelationInputSchema ]).optional(),
  cursor: AttachmentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AttachmentScalarFieldEnumSchema,AttachmentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AttachmentFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AttachmentFindFirstOrThrowArgs> = z.object({
  select: AttachmentSelectSchema.optional(),
  include: AttachmentIncludeSchema.optional(),
  where: AttachmentWhereInputSchema.optional(),
  orderBy: z.union([ AttachmentOrderByWithRelationInputSchema.array(),AttachmentOrderByWithRelationInputSchema ]).optional(),
  cursor: AttachmentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AttachmentScalarFieldEnumSchema,AttachmentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AttachmentFindManyArgsSchema: z.ZodType<Prisma.AttachmentFindManyArgs> = z.object({
  select: AttachmentSelectSchema.optional(),
  include: AttachmentIncludeSchema.optional(),
  where: AttachmentWhereInputSchema.optional(),
  orderBy: z.union([ AttachmentOrderByWithRelationInputSchema.array(),AttachmentOrderByWithRelationInputSchema ]).optional(),
  cursor: AttachmentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AttachmentScalarFieldEnumSchema,AttachmentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AttachmentAggregateArgsSchema: z.ZodType<Prisma.AttachmentAggregateArgs> = z.object({
  where: AttachmentWhereInputSchema.optional(),
  orderBy: z.union([ AttachmentOrderByWithRelationInputSchema.array(),AttachmentOrderByWithRelationInputSchema ]).optional(),
  cursor: AttachmentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AttachmentGroupByArgsSchema: z.ZodType<Prisma.AttachmentGroupByArgs> = z.object({
  where: AttachmentWhereInputSchema.optional(),
  orderBy: z.union([ AttachmentOrderByWithAggregationInputSchema.array(),AttachmentOrderByWithAggregationInputSchema ]).optional(),
  by: AttachmentScalarFieldEnumSchema.array(),
  having: AttachmentScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AttachmentFindUniqueArgsSchema: z.ZodType<Prisma.AttachmentFindUniqueArgs> = z.object({
  select: AttachmentSelectSchema.optional(),
  include: AttachmentIncludeSchema.optional(),
  where: AttachmentWhereUniqueInputSchema,
}).strict() ;

export const AttachmentFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AttachmentFindUniqueOrThrowArgs> = z.object({
  select: AttachmentSelectSchema.optional(),
  include: AttachmentIncludeSchema.optional(),
  where: AttachmentWhereUniqueInputSchema,
}).strict() ;

export const EmailThreadFindFirstArgsSchema: z.ZodType<Prisma.EmailThreadFindFirstArgs> = z.object({
  select: EmailThreadSelectSchema.optional(),
  include: EmailThreadIncludeSchema.optional(),
  where: EmailThreadWhereInputSchema.optional(),
  orderBy: z.union([ EmailThreadOrderByWithRelationInputSchema.array(),EmailThreadOrderByWithRelationInputSchema ]).optional(),
  cursor: EmailThreadWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EmailThreadScalarFieldEnumSchema,EmailThreadScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EmailThreadFindFirstOrThrowArgsSchema: z.ZodType<Prisma.EmailThreadFindFirstOrThrowArgs> = z.object({
  select: EmailThreadSelectSchema.optional(),
  include: EmailThreadIncludeSchema.optional(),
  where: EmailThreadWhereInputSchema.optional(),
  orderBy: z.union([ EmailThreadOrderByWithRelationInputSchema.array(),EmailThreadOrderByWithRelationInputSchema ]).optional(),
  cursor: EmailThreadWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EmailThreadScalarFieldEnumSchema,EmailThreadScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EmailThreadFindManyArgsSchema: z.ZodType<Prisma.EmailThreadFindManyArgs> = z.object({
  select: EmailThreadSelectSchema.optional(),
  include: EmailThreadIncludeSchema.optional(),
  where: EmailThreadWhereInputSchema.optional(),
  orderBy: z.union([ EmailThreadOrderByWithRelationInputSchema.array(),EmailThreadOrderByWithRelationInputSchema ]).optional(),
  cursor: EmailThreadWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EmailThreadScalarFieldEnumSchema,EmailThreadScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EmailThreadAggregateArgsSchema: z.ZodType<Prisma.EmailThreadAggregateArgs> = z.object({
  where: EmailThreadWhereInputSchema.optional(),
  orderBy: z.union([ EmailThreadOrderByWithRelationInputSchema.array(),EmailThreadOrderByWithRelationInputSchema ]).optional(),
  cursor: EmailThreadWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EmailThreadGroupByArgsSchema: z.ZodType<Prisma.EmailThreadGroupByArgs> = z.object({
  where: EmailThreadWhereInputSchema.optional(),
  orderBy: z.union([ EmailThreadOrderByWithAggregationInputSchema.array(),EmailThreadOrderByWithAggregationInputSchema ]).optional(),
  by: EmailThreadScalarFieldEnumSchema.array(),
  having: EmailThreadScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EmailThreadFindUniqueArgsSchema: z.ZodType<Prisma.EmailThreadFindUniqueArgs> = z.object({
  select: EmailThreadSelectSchema.optional(),
  include: EmailThreadIncludeSchema.optional(),
  where: EmailThreadWhereUniqueInputSchema,
}).strict() ;

export const EmailThreadFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.EmailThreadFindUniqueOrThrowArgs> = z.object({
  select: EmailThreadSelectSchema.optional(),
  include: EmailThreadIncludeSchema.optional(),
  where: EmailThreadWhereUniqueInputSchema,
}).strict() ;

export const ContactFindFirstArgsSchema: z.ZodType<Prisma.ContactFindFirstArgs> = z.object({
  select: ContactSelectSchema.optional(),
  include: ContactIncludeSchema.optional(),
  where: ContactWhereInputSchema.optional(),
  orderBy: z.union([ ContactOrderByWithRelationInputSchema.array(),ContactOrderByWithRelationInputSchema ]).optional(),
  cursor: ContactWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ContactScalarFieldEnumSchema,ContactScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ContactFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ContactFindFirstOrThrowArgs> = z.object({
  select: ContactSelectSchema.optional(),
  include: ContactIncludeSchema.optional(),
  where: ContactWhereInputSchema.optional(),
  orderBy: z.union([ ContactOrderByWithRelationInputSchema.array(),ContactOrderByWithRelationInputSchema ]).optional(),
  cursor: ContactWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ContactScalarFieldEnumSchema,ContactScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ContactFindManyArgsSchema: z.ZodType<Prisma.ContactFindManyArgs> = z.object({
  select: ContactSelectSchema.optional(),
  include: ContactIncludeSchema.optional(),
  where: ContactWhereInputSchema.optional(),
  orderBy: z.union([ ContactOrderByWithRelationInputSchema.array(),ContactOrderByWithRelationInputSchema ]).optional(),
  cursor: ContactWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ContactScalarFieldEnumSchema,ContactScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ContactAggregateArgsSchema: z.ZodType<Prisma.ContactAggregateArgs> = z.object({
  where: ContactWhereInputSchema.optional(),
  orderBy: z.union([ ContactOrderByWithRelationInputSchema.array(),ContactOrderByWithRelationInputSchema ]).optional(),
  cursor: ContactWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ContactGroupByArgsSchema: z.ZodType<Prisma.ContactGroupByArgs> = z.object({
  where: ContactWhereInputSchema.optional(),
  orderBy: z.union([ ContactOrderByWithAggregationInputSchema.array(),ContactOrderByWithAggregationInputSchema ]).optional(),
  by: ContactScalarFieldEnumSchema.array(),
  having: ContactScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ContactFindUniqueArgsSchema: z.ZodType<Prisma.ContactFindUniqueArgs> = z.object({
  select: ContactSelectSchema.optional(),
  include: ContactIncludeSchema.optional(),
  where: ContactWhereUniqueInputSchema,
}).strict() ;

export const ContactFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ContactFindUniqueOrThrowArgs> = z.object({
  select: ContactSelectSchema.optional(),
  include: ContactIncludeSchema.optional(),
  where: ContactWhereUniqueInputSchema,
}).strict() ;

export const EmailTemplateFindFirstArgsSchema: z.ZodType<Prisma.EmailTemplateFindFirstArgs> = z.object({
  select: EmailTemplateSelectSchema.optional(),
  include: EmailTemplateIncludeSchema.optional(),
  where: EmailTemplateWhereInputSchema.optional(),
  orderBy: z.union([ EmailTemplateOrderByWithRelationInputSchema.array(),EmailTemplateOrderByWithRelationInputSchema ]).optional(),
  cursor: EmailTemplateWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EmailTemplateScalarFieldEnumSchema,EmailTemplateScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EmailTemplateFindFirstOrThrowArgsSchema: z.ZodType<Prisma.EmailTemplateFindFirstOrThrowArgs> = z.object({
  select: EmailTemplateSelectSchema.optional(),
  include: EmailTemplateIncludeSchema.optional(),
  where: EmailTemplateWhereInputSchema.optional(),
  orderBy: z.union([ EmailTemplateOrderByWithRelationInputSchema.array(),EmailTemplateOrderByWithRelationInputSchema ]).optional(),
  cursor: EmailTemplateWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EmailTemplateScalarFieldEnumSchema,EmailTemplateScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EmailTemplateFindManyArgsSchema: z.ZodType<Prisma.EmailTemplateFindManyArgs> = z.object({
  select: EmailTemplateSelectSchema.optional(),
  include: EmailTemplateIncludeSchema.optional(),
  where: EmailTemplateWhereInputSchema.optional(),
  orderBy: z.union([ EmailTemplateOrderByWithRelationInputSchema.array(),EmailTemplateOrderByWithRelationInputSchema ]).optional(),
  cursor: EmailTemplateWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EmailTemplateScalarFieldEnumSchema,EmailTemplateScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EmailTemplateAggregateArgsSchema: z.ZodType<Prisma.EmailTemplateAggregateArgs> = z.object({
  where: EmailTemplateWhereInputSchema.optional(),
  orderBy: z.union([ EmailTemplateOrderByWithRelationInputSchema.array(),EmailTemplateOrderByWithRelationInputSchema ]).optional(),
  cursor: EmailTemplateWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EmailTemplateGroupByArgsSchema: z.ZodType<Prisma.EmailTemplateGroupByArgs> = z.object({
  where: EmailTemplateWhereInputSchema.optional(),
  orderBy: z.union([ EmailTemplateOrderByWithAggregationInputSchema.array(),EmailTemplateOrderByWithAggregationInputSchema ]).optional(),
  by: EmailTemplateScalarFieldEnumSchema.array(),
  having: EmailTemplateScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EmailTemplateFindUniqueArgsSchema: z.ZodType<Prisma.EmailTemplateFindUniqueArgs> = z.object({
  select: EmailTemplateSelectSchema.optional(),
  include: EmailTemplateIncludeSchema.optional(),
  where: EmailTemplateWhereUniqueInputSchema,
}).strict() ;

export const EmailTemplateFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.EmailTemplateFindUniqueOrThrowArgs> = z.object({
  select: EmailTemplateSelectSchema.optional(),
  include: EmailTemplateIncludeSchema.optional(),
  where: EmailTemplateWhereUniqueInputSchema,
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

export const AttributesOnSurveysCreateArgsSchema: z.ZodType<Prisma.AttributesOnSurveysCreateArgs> = z.object({
  select: AttributesOnSurveysSelectSchema.optional(),
  include: AttributesOnSurveysIncludeSchema.optional(),
  data: z.union([ AttributesOnSurveysCreateInputSchema,AttributesOnSurveysUncheckedCreateInputSchema ]),
}).strict() ;

export const AttributesOnSurveysUpsertArgsSchema: z.ZodType<Prisma.AttributesOnSurveysUpsertArgs> = z.object({
  select: AttributesOnSurveysSelectSchema.optional(),
  include: AttributesOnSurveysIncludeSchema.optional(),
  where: AttributesOnSurveysWhereUniqueInputSchema,
  create: z.union([ AttributesOnSurveysCreateInputSchema,AttributesOnSurveysUncheckedCreateInputSchema ]),
  update: z.union([ AttributesOnSurveysUpdateInputSchema,AttributesOnSurveysUncheckedUpdateInputSchema ]),
}).strict() ;

export const AttributesOnSurveysCreateManyArgsSchema: z.ZodType<Prisma.AttributesOnSurveysCreateManyArgs> = z.object({
  data: z.union([ AttributesOnSurveysCreateManyInputSchema,AttributesOnSurveysCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AttributesOnSurveysCreateManyAndReturnArgsSchema: z.ZodType<Prisma.AttributesOnSurveysCreateManyAndReturnArgs> = z.object({
  data: z.union([ AttributesOnSurveysCreateManyInputSchema,AttributesOnSurveysCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AttributesOnSurveysDeleteArgsSchema: z.ZodType<Prisma.AttributesOnSurveysDeleteArgs> = z.object({
  select: AttributesOnSurveysSelectSchema.optional(),
  include: AttributesOnSurveysIncludeSchema.optional(),
  where: AttributesOnSurveysWhereUniqueInputSchema,
}).strict() ;

export const AttributesOnSurveysUpdateArgsSchema: z.ZodType<Prisma.AttributesOnSurveysUpdateArgs> = z.object({
  select: AttributesOnSurveysSelectSchema.optional(),
  include: AttributesOnSurveysIncludeSchema.optional(),
  data: z.union([ AttributesOnSurveysUpdateInputSchema,AttributesOnSurveysUncheckedUpdateInputSchema ]),
  where: AttributesOnSurveysWhereUniqueInputSchema,
}).strict() ;

export const AttributesOnSurveysUpdateManyArgsSchema: z.ZodType<Prisma.AttributesOnSurveysUpdateManyArgs> = z.object({
  data: z.union([ AttributesOnSurveysUpdateManyMutationInputSchema,AttributesOnSurveysUncheckedUpdateManyInputSchema ]),
  where: AttributesOnSurveysWhereInputSchema.optional(),
}).strict() ;

export const AttributesOnSurveysDeleteManyArgsSchema: z.ZodType<Prisma.AttributesOnSurveysDeleteManyArgs> = z.object({
  where: AttributesOnSurveysWhereInputSchema.optional(),
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

export const EmailCreateArgsSchema: z.ZodType<Prisma.EmailCreateArgs> = z.object({
  select: EmailSelectSchema.optional(),
  include: EmailIncludeSchema.optional(),
  data: z.union([ EmailCreateInputSchema,EmailUncheckedCreateInputSchema ]),
}).strict() ;

export const EmailUpsertArgsSchema: z.ZodType<Prisma.EmailUpsertArgs> = z.object({
  select: EmailSelectSchema.optional(),
  include: EmailIncludeSchema.optional(),
  where: EmailWhereUniqueInputSchema,
  create: z.union([ EmailCreateInputSchema,EmailUncheckedCreateInputSchema ]),
  update: z.union([ EmailUpdateInputSchema,EmailUncheckedUpdateInputSchema ]),
}).strict() ;

export const EmailCreateManyArgsSchema: z.ZodType<Prisma.EmailCreateManyArgs> = z.object({
  data: z.union([ EmailCreateManyInputSchema,EmailCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const EmailCreateManyAndReturnArgsSchema: z.ZodType<Prisma.EmailCreateManyAndReturnArgs> = z.object({
  data: z.union([ EmailCreateManyInputSchema,EmailCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const EmailDeleteArgsSchema: z.ZodType<Prisma.EmailDeleteArgs> = z.object({
  select: EmailSelectSchema.optional(),
  include: EmailIncludeSchema.optional(),
  where: EmailWhereUniqueInputSchema,
}).strict() ;

export const EmailUpdateArgsSchema: z.ZodType<Prisma.EmailUpdateArgs> = z.object({
  select: EmailSelectSchema.optional(),
  include: EmailIncludeSchema.optional(),
  data: z.union([ EmailUpdateInputSchema,EmailUncheckedUpdateInputSchema ]),
  where: EmailWhereUniqueInputSchema,
}).strict() ;

export const EmailUpdateManyArgsSchema: z.ZodType<Prisma.EmailUpdateManyArgs> = z.object({
  data: z.union([ EmailUpdateManyMutationInputSchema,EmailUncheckedUpdateManyInputSchema ]),
  where: EmailWhereInputSchema.optional(),
}).strict() ;

export const EmailDeleteManyArgsSchema: z.ZodType<Prisma.EmailDeleteManyArgs> = z.object({
  where: EmailWhereInputSchema.optional(),
}).strict() ;

export const AttachmentCreateArgsSchema: z.ZodType<Prisma.AttachmentCreateArgs> = z.object({
  select: AttachmentSelectSchema.optional(),
  include: AttachmentIncludeSchema.optional(),
  data: z.union([ AttachmentCreateInputSchema,AttachmentUncheckedCreateInputSchema ]),
}).strict() ;

export const AttachmentUpsertArgsSchema: z.ZodType<Prisma.AttachmentUpsertArgs> = z.object({
  select: AttachmentSelectSchema.optional(),
  include: AttachmentIncludeSchema.optional(),
  where: AttachmentWhereUniqueInputSchema,
  create: z.union([ AttachmentCreateInputSchema,AttachmentUncheckedCreateInputSchema ]),
  update: z.union([ AttachmentUpdateInputSchema,AttachmentUncheckedUpdateInputSchema ]),
}).strict() ;

export const AttachmentCreateManyArgsSchema: z.ZodType<Prisma.AttachmentCreateManyArgs> = z.object({
  data: z.union([ AttachmentCreateManyInputSchema,AttachmentCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AttachmentCreateManyAndReturnArgsSchema: z.ZodType<Prisma.AttachmentCreateManyAndReturnArgs> = z.object({
  data: z.union([ AttachmentCreateManyInputSchema,AttachmentCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AttachmentDeleteArgsSchema: z.ZodType<Prisma.AttachmentDeleteArgs> = z.object({
  select: AttachmentSelectSchema.optional(),
  include: AttachmentIncludeSchema.optional(),
  where: AttachmentWhereUniqueInputSchema,
}).strict() ;

export const AttachmentUpdateArgsSchema: z.ZodType<Prisma.AttachmentUpdateArgs> = z.object({
  select: AttachmentSelectSchema.optional(),
  include: AttachmentIncludeSchema.optional(),
  data: z.union([ AttachmentUpdateInputSchema,AttachmentUncheckedUpdateInputSchema ]),
  where: AttachmentWhereUniqueInputSchema,
}).strict() ;

export const AttachmentUpdateManyArgsSchema: z.ZodType<Prisma.AttachmentUpdateManyArgs> = z.object({
  data: z.union([ AttachmentUpdateManyMutationInputSchema,AttachmentUncheckedUpdateManyInputSchema ]),
  where: AttachmentWhereInputSchema.optional(),
}).strict() ;

export const AttachmentDeleteManyArgsSchema: z.ZodType<Prisma.AttachmentDeleteManyArgs> = z.object({
  where: AttachmentWhereInputSchema.optional(),
}).strict() ;

export const EmailThreadCreateArgsSchema: z.ZodType<Prisma.EmailThreadCreateArgs> = z.object({
  select: EmailThreadSelectSchema.optional(),
  include: EmailThreadIncludeSchema.optional(),
  data: z.union([ EmailThreadCreateInputSchema,EmailThreadUncheckedCreateInputSchema ]),
}).strict() ;

export const EmailThreadUpsertArgsSchema: z.ZodType<Prisma.EmailThreadUpsertArgs> = z.object({
  select: EmailThreadSelectSchema.optional(),
  include: EmailThreadIncludeSchema.optional(),
  where: EmailThreadWhereUniqueInputSchema,
  create: z.union([ EmailThreadCreateInputSchema,EmailThreadUncheckedCreateInputSchema ]),
  update: z.union([ EmailThreadUpdateInputSchema,EmailThreadUncheckedUpdateInputSchema ]),
}).strict() ;

export const EmailThreadCreateManyArgsSchema: z.ZodType<Prisma.EmailThreadCreateManyArgs> = z.object({
  data: z.union([ EmailThreadCreateManyInputSchema,EmailThreadCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const EmailThreadCreateManyAndReturnArgsSchema: z.ZodType<Prisma.EmailThreadCreateManyAndReturnArgs> = z.object({
  data: z.union([ EmailThreadCreateManyInputSchema,EmailThreadCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const EmailThreadDeleteArgsSchema: z.ZodType<Prisma.EmailThreadDeleteArgs> = z.object({
  select: EmailThreadSelectSchema.optional(),
  include: EmailThreadIncludeSchema.optional(),
  where: EmailThreadWhereUniqueInputSchema,
}).strict() ;

export const EmailThreadUpdateArgsSchema: z.ZodType<Prisma.EmailThreadUpdateArgs> = z.object({
  select: EmailThreadSelectSchema.optional(),
  include: EmailThreadIncludeSchema.optional(),
  data: z.union([ EmailThreadUpdateInputSchema,EmailThreadUncheckedUpdateInputSchema ]),
  where: EmailThreadWhereUniqueInputSchema,
}).strict() ;

export const EmailThreadUpdateManyArgsSchema: z.ZodType<Prisma.EmailThreadUpdateManyArgs> = z.object({
  data: z.union([ EmailThreadUpdateManyMutationInputSchema,EmailThreadUncheckedUpdateManyInputSchema ]),
  where: EmailThreadWhereInputSchema.optional(),
}).strict() ;

export const EmailThreadDeleteManyArgsSchema: z.ZodType<Prisma.EmailThreadDeleteManyArgs> = z.object({
  where: EmailThreadWhereInputSchema.optional(),
}).strict() ;

export const ContactCreateArgsSchema: z.ZodType<Prisma.ContactCreateArgs> = z.object({
  select: ContactSelectSchema.optional(),
  include: ContactIncludeSchema.optional(),
  data: z.union([ ContactCreateInputSchema,ContactUncheckedCreateInputSchema ]),
}).strict() ;

export const ContactUpsertArgsSchema: z.ZodType<Prisma.ContactUpsertArgs> = z.object({
  select: ContactSelectSchema.optional(),
  include: ContactIncludeSchema.optional(),
  where: ContactWhereUniqueInputSchema,
  create: z.union([ ContactCreateInputSchema,ContactUncheckedCreateInputSchema ]),
  update: z.union([ ContactUpdateInputSchema,ContactUncheckedUpdateInputSchema ]),
}).strict() ;

export const ContactCreateManyArgsSchema: z.ZodType<Prisma.ContactCreateManyArgs> = z.object({
  data: z.union([ ContactCreateManyInputSchema,ContactCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ContactCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ContactCreateManyAndReturnArgs> = z.object({
  data: z.union([ ContactCreateManyInputSchema,ContactCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ContactDeleteArgsSchema: z.ZodType<Prisma.ContactDeleteArgs> = z.object({
  select: ContactSelectSchema.optional(),
  include: ContactIncludeSchema.optional(),
  where: ContactWhereUniqueInputSchema,
}).strict() ;

export const ContactUpdateArgsSchema: z.ZodType<Prisma.ContactUpdateArgs> = z.object({
  select: ContactSelectSchema.optional(),
  include: ContactIncludeSchema.optional(),
  data: z.union([ ContactUpdateInputSchema,ContactUncheckedUpdateInputSchema ]),
  where: ContactWhereUniqueInputSchema,
}).strict() ;

export const ContactUpdateManyArgsSchema: z.ZodType<Prisma.ContactUpdateManyArgs> = z.object({
  data: z.union([ ContactUpdateManyMutationInputSchema,ContactUncheckedUpdateManyInputSchema ]),
  where: ContactWhereInputSchema.optional(),
}).strict() ;

export const ContactDeleteManyArgsSchema: z.ZodType<Prisma.ContactDeleteManyArgs> = z.object({
  where: ContactWhereInputSchema.optional(),
}).strict() ;

export const EmailTemplateCreateArgsSchema: z.ZodType<Prisma.EmailTemplateCreateArgs> = z.object({
  select: EmailTemplateSelectSchema.optional(),
  include: EmailTemplateIncludeSchema.optional(),
  data: z.union([ EmailTemplateCreateInputSchema,EmailTemplateUncheckedCreateInputSchema ]),
}).strict() ;

export const EmailTemplateUpsertArgsSchema: z.ZodType<Prisma.EmailTemplateUpsertArgs> = z.object({
  select: EmailTemplateSelectSchema.optional(),
  include: EmailTemplateIncludeSchema.optional(),
  where: EmailTemplateWhereUniqueInputSchema,
  create: z.union([ EmailTemplateCreateInputSchema,EmailTemplateUncheckedCreateInputSchema ]),
  update: z.union([ EmailTemplateUpdateInputSchema,EmailTemplateUncheckedUpdateInputSchema ]),
}).strict() ;

export const EmailTemplateCreateManyArgsSchema: z.ZodType<Prisma.EmailTemplateCreateManyArgs> = z.object({
  data: z.union([ EmailTemplateCreateManyInputSchema,EmailTemplateCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const EmailTemplateCreateManyAndReturnArgsSchema: z.ZodType<Prisma.EmailTemplateCreateManyAndReturnArgs> = z.object({
  data: z.union([ EmailTemplateCreateManyInputSchema,EmailTemplateCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const EmailTemplateDeleteArgsSchema: z.ZodType<Prisma.EmailTemplateDeleteArgs> = z.object({
  select: EmailTemplateSelectSchema.optional(),
  include: EmailTemplateIncludeSchema.optional(),
  where: EmailTemplateWhereUniqueInputSchema,
}).strict() ;

export const EmailTemplateUpdateArgsSchema: z.ZodType<Prisma.EmailTemplateUpdateArgs> = z.object({
  select: EmailTemplateSelectSchema.optional(),
  include: EmailTemplateIncludeSchema.optional(),
  data: z.union([ EmailTemplateUpdateInputSchema,EmailTemplateUncheckedUpdateInputSchema ]),
  where: EmailTemplateWhereUniqueInputSchema,
}).strict() ;

export const EmailTemplateUpdateManyArgsSchema: z.ZodType<Prisma.EmailTemplateUpdateManyArgs> = z.object({
  data: z.union([ EmailTemplateUpdateManyMutationInputSchema,EmailTemplateUncheckedUpdateManyInputSchema ]),
  where: EmailTemplateWhereInputSchema.optional(),
}).strict() ;

export const EmailTemplateDeleteManyArgsSchema: z.ZodType<Prisma.EmailTemplateDeleteManyArgs> = z.object({
  where: EmailTemplateWhereInputSchema.optional(),
}).strict() ;