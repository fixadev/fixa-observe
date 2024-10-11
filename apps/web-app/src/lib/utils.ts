import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { EmailThreadWithEmailsAndProperty } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function removeTrailingSlash(path: string) {
  return path.replace(/\/+$/, "");
}

export function replaceTemplateVariables(
  template: string,
  variables: Record<string, string>,
) {
  return template.replace(/\{\{([^}]+)\}\}/g, (match: string, p1: string) => {
    return variables[p1] ?? match;
  });
}

export function isParsedAttributesComplete(
  parsedAttributes: Record<string, string | null>,
) {
  return Object.values(parsedAttributes).every((value) => value !== null);
}

export function isPropertyNotAvailable(
  parsedAttributes: Record<string, string | null>,
) {
  return parsedAttributes.available === "No";
}

export function getInitials(fullName: string) {
  return fullName
    .split(" ")
    .map((name) => name[0])
    .join("");
}

export function emailIsDraft(emailThread: EmailThreadWithEmailsAndProperty) {
  return emailThread.emails.length > 0 && emailThread.emails[0]!.isDraft;
}

export function emailIsIncomplete(
  emailThread: EmailThreadWithEmailsAndProperty,
) {
  return (
    emailThread.parsedAttributes &&
    !isParsedAttributesComplete(
      emailThread.parsedAttributes as Record<string, string | null>,
    )
  );
}

export function emailIsComplete(emailThread: EmailThreadWithEmailsAndProperty) {
  return (
    emailThread.parsedAttributes &&
    isParsedAttributesComplete(
      emailThread.parsedAttributes as Record<string, string | null>,
    )
  );
}

export function propertyNotAvailable(
  emailThread: EmailThreadWithEmailsAndProperty,
) {
  return (
    emailThread.parsedAttributes &&
    isPropertyNotAvailable(
      emailThread.parsedAttributes as Record<string, string | null>,
    )
  );
}

export function emailIsOld(emailThread: EmailThreadWithEmailsAndProperty) {
  return (
    // Email is older than 1 day
    emailThread.emails[emailThread.emails.length - 1]!.createdAt.getTime() <
    new Date().getTime() - 1000 * 60 * 60 * 24 * 1
  );
}
