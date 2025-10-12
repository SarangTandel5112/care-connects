/**
 * Utility to format error messages with human-readable dates
 * Converts ISO date strings in error messages to local timezone format
 */

/**
 * Format a date object to readable local time
 * @param date - Date object to format
 * @returns Formatted string like "Sep 30, 2025 at 6:31 PM"
 */
const formatDateToLocal = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };
  return date.toLocaleString('en-US', options);
};

/**
 * Format error messages by converting ISO date strings to local timezone
 * Example: "Doctor has another appointment from 2025-09-30T18:31:00.000Z to 2025-09-30T23:30:00.000Z"
 * Becomes: "Doctor has another appointment from Sep 30, 2025 at 6:31 PM to Sep 30, 2025 at 11:30 PM"
 *
 * @param message - Error message that may contain ISO date strings
 * @returns Formatted message with local dates
 */
export const formatErrorMessage = (message: string): string => {
  if (!message) return message;

  // Regex to match ISO 8601 date strings (e.g., 2025-09-30T18:31:00.000Z)
  const isoDateRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z/g;

  // Replace all ISO date strings with formatted local dates
  return message.replace(isoDateRegex, (isoString) => {
    try {
      const date = new Date(isoString);
      return formatDateToLocal(date);
    } catch {
      // If parsing fails, return original string
      return isoString;
    }
  });
};
