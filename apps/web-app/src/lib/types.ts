import type {
  Attachment,
  Brochure,
  Contact,
  Email,
  EmailThread,
  Property,
} from "prisma/generated/zod";

export type EmailThreadWithEmailsAndProperty = EmailThread & {
  emails: (Email & { attachments: Attachment[] })[];
  property: Property & { brochures: Brochure[]; contacts: Contact[] };
};
