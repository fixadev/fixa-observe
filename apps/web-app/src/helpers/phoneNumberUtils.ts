export const formatPhoneNumber = (phoneNumber: string) => {
  const cleaned = phoneNumber.replace(/\D/g, "");
  const truncated = cleaned.slice(0, 11);
  if (!truncated.startsWith("1")) {
    return "+1" + truncated;
  }
  return "+" + truncated;
};

export const displayPhoneNumberNicely = (phoneNumber: string) => {
  const formatted = formatPhoneNumber(phoneNumber);
  const numbers = formatted.slice(2); // Remove +1
  if (numbers.length === 0) return "+1";
  if (numbers.length <= 3) return `+1 (${numbers}`;
  if (numbers.length <= 6)
    return `+1 (${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
  return `+1 (${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6)}`;
};

export const checkForValidPhoneNumber = (phoneNumber: string) => {
  const formatted = formatPhoneNumber(phoneNumber);
  const numbers = formatted.slice(2); // Remove +1
  return numbers.length === 10;
};
