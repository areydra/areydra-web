const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export function formatCount(value: number | null | undefined, suffix = "") {
  const normalized = Math.max(0, value ?? 0);
  return `${normalized}${suffix}`;
}

export function formatWorkPeriod(
  startMonth: number,
  startYear: number,
  endMonth: number | null,
  endYear: number | null,
) {
  const start = formatMonthYear(startMonth, startYear);
  const end = endYear ? formatMonthYear(endMonth, endYear) : "Present";
  return `${start} - ${end}`;
}

export function formatPostDate(value: string | null) {
  if (!value) return "Draft";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Draft";
  return date.toLocaleDateString("en", { month: "short", year: "numeric" });
}

/** Month + year for a project's completion date; malformed values pass through. */
export function formatProjectDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en", { month: "short", year: "numeric" });
}

export function initials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function formatMonthYear(month: number | null, year: number) {
  if (!month || month < 1 || month > 12) return String(year);
  return `${MONTH_NAMES[month - 1]} ${year}`;
}
