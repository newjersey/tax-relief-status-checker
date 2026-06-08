/** Masks the SSN for display — shows only the last four digits. */
export const maskSsn = (ssn: string): string => {
  const digits = ssn.replace(/-/g, "");
  return `***-**-${digits.slice(5)}`;
};
