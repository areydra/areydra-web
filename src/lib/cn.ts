import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges conditional class lists and resolves conflicting Tailwind utilities
 * deterministically (last one wins by intent, not by stylesheet order).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
