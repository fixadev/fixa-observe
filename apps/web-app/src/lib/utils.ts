import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { EmailThreadWithEmailsAndProperty } from "./types";
import { type User } from "@clerk/nextjs/server";
import {
  type Property,
  type Email,
  type EmailThread,
} from "prisma/generated/zod";

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

export function emailIsDraft(emailThread: EmailThread & { emails: Email[] }) {
  return emailThread.emails.length > 0 && emailThread.emails[0]!.isDraft;
}

export function emailIsIncomplete(
  emailThread: EmailThreadWithEmailsAndProperty,
  user?: User,
) {
  return (
    emailThread.emails.some(
      (email) => email.senderEmail !== user?.primaryEmailAddress?.emailAddress,
    ) &&
    emailThread.parsedAttributes &&
    !isParsedAttributesComplete(
      emailThread.parsedAttributes as Record<string, string | null>,
    )
  );
}

export function emailIsComplete(emailThread: EmailThread) {
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

export function base64ToArrayBuffer(base64: string) {
  const binaryString = window.atob(base64);
  const binaryLen = binaryString.length;
  const bytes = new Uint8Array(binaryLen);
  for (let i = 0; i < binaryLen; i++) {
    const ascii = binaryString.charCodeAt(i);
    bytes[i] = ascii;
  }
  return bytes;
}

export function saveByteArray(
  fileName: string,
  contentType: string,
  byteArray: Uint8Array,
) {
  const blob = new Blob([byteArray], { type: contentType });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}

export function downloadBase64File(
  filename: string,
  contentType: string,
  base64: string,
) {
  const arrayBuffer = base64ToArrayBuffer(base64);
  saveByteArray(filename, contentType, arrayBuffer);
}

export function splitAddress(address: string) {
  const [streetAddress, city] = address.split(",").map((line) => line.trim());
  return { streetAddress, city };
}

export function getBrochureFileName(property: Property) {
  const address = splitAddress(
    (property.attributes as { address?: string })?.address ?? "",
  );
  return `${address.streetAddress}_${property.id}.pdf`;
}
