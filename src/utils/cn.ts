import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx, and merges Tailwind classes safely using twMerge.
 *
 * @param inputs - List of class values (strings, conditionals, etc.)
 * @returns A clean string of Tailwind-friendly class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}
