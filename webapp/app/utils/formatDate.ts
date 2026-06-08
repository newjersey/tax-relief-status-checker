/** Formats an ISO date string (e.g. 2026-03-19T00:00:00.000Z) as MM/DD/YYYY. */
export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const year = String(date.getUTCFullYear());
  return `${month}/${day}/${year}`;
};
