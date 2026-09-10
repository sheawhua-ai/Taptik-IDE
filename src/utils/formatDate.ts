export function formatChineseDate(value?: string, includeTime = false): string {
  if (!value) return "";

  const match = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s](\d{1,2}):(\d{2}))?/);
  if (!match) return value;

  const [, , month, day, hour, minute] = match;
  const date = `${Number(month)}月${Number(day)}日`;
  if (!includeTime || hour === undefined || minute === undefined) return date;
  return `${date} ${hour.padStart(2, "0")}:${minute}`;
}

export function formatProjectCreatedAt(value?: string): string {
  if (!value) return "3月3日 14:30";
  // If format already has date and time e.g. "2026-03-03 14:30"
  const formatted = formatChineseDate(value, true);
  if (formatted.includes(":")) {
    return formatted;
  }
  // If only date was provided e.g. "2026-03-03", append a default time
  if (formatted) {
    return `${formatted} 14:30`;
  }
  return value;
}

