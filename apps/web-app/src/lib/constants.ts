export const REPLACEMENT_VARIABLES = {
  name: "name",
  address: "address",
};
export const DEFAULT_EMAIL_TEMPLATE_SUBJECT = `{{${REPLACEMENT_VARIABLES.address}}} inquiry`;
export const DEFAULT_EMAIL_TEMPLATE_BODY = (userName: string) =>
  `Hi {{${REPLACEMENT_VARIABLES.name}}},\n\nChecking in about what the NNN ask is at {{${REPLACEMENT_VARIABLES.address}}} and if the property is still available.\n\nBest,\n${userName}`;
