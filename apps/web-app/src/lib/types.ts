import type { Email, EmailThread, Property } from "prisma/generated/zod";

// export type Email = {
//   id: string;
//   createdAt: Date;
//   sender: {
//     name: string;
//     photoUrl: string;
//     email: string;
//   };
//   content: string;
// };

// export type EmailThread = {
//   id: string;
//   emails: Email[];
//   subject: string;
//   property: Property;
//   draft?: boolean;
//   unread?: boolean;
//   completed?: boolean;
//   moreInfoNeeded?: boolean;
//   parsedAttributes?: Record<string, string>;
// };

export type EmailThreadWithEmailsAndProperty = EmailThread & {
  emails: Email[];
  property: Property;
};
