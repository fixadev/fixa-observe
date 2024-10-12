import type {
  Attachment,
  Email,
  EmailThread,
  Property,
} from "prisma/generated/zod";

export type EmailThreadWithEmailsAndProperty = EmailThread & {
  emails: (Email & { attachments: Attachment[] })[];
  property: Property;
};
