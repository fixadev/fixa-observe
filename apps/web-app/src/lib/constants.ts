export const REPLACEMENT_VARIABLES = {
  name: "name",
  address: "address",
  fieldsToVerify: "fieldsToVerify",
};
export const DEFAULT_EMAIL_TEMPLATE_SUBJECT = `{{${REPLACEMENT_VARIABLES.address}}}`;
export const DEFAULT_EMAIL_TEMPLATE_BODY = (userName: string) =>
  `Hi {{${REPLACEMENT_VARIABLES.name}}},

Checking in to see if {{${REPLACEMENT_VARIABLES.address}}} is still available.

Also wanted to confirm the following information:
{{${REPLACEMENT_VARIABLES.fieldsToVerify}}}

Best,
${userName}`;
