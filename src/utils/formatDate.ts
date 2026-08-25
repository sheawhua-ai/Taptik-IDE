export function formatChineseDate(value?: string, includeTime = false): string {
  if (!value) return "";

  const match = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s](\d{1,2}):(\d{2}))?/);
  if (!match) return value;

  const [, , month, day, hour, minute] = match;
  const date = `${Number(month)}月${Number(day)}日`;
  if (!includeTime || hour === undefined || minute === undefined) return date;
  return `${date} ${hour.padStart(2, "0")}:${minute}`;
}
