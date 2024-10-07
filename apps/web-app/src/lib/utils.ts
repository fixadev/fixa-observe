import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
