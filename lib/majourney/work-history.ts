import type { WorkHistory, WorkStatus } from "@/lib/api-types";
import type { WorkHistoryInput } from "./inputs";

// The backend's schema enum for work_history.status (confirmed against the
// live AJV validation error — this isn't documented in the Postman
// collection or design doc, only these five values are accepted).
export const STATUS_OPTIONS: { value: WorkStatus; label: string }[] = [
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
  { value: "internship", label: "Internship" },
];

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const EMPTY_FORM: WorkHistoryInput = {
  company: "",
  role: "",
  status: "full_time",
  description: "",
  startMonth: 1,
  startYear: new Date().getFullYear(),
  endMonth: null,
  endYear: null,
  companyLogoUrl: null,
};

export function toForm(item: WorkHistory): WorkHistoryInput {
  return {
    company: item.company,
    role: item.role,
    status: item.status,
    description: item.description,
    startMonth: item.startMonth,
    startYear: item.startYear,
    endMonth: item.endMonth,
    endYear: item.endYear,
    companyLogoUrl: item.companyLogoUrl,
  };
}

export function statusLabel(status: WorkStatus) {
  return STATUS_OPTIONS.find((opt) => opt.value === status)?.label ?? status;
}

export function monthYearLabel(month: number, year: number) {
  return `${MONTH_NAMES[month - 1] ?? month} ${year}`;
}
