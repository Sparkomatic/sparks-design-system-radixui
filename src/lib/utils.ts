import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges Tailwind class names, resolving conflicts correctly.
 * Use this everywhere classes are conditionally combined.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
