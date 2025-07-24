import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "success":
      return "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300"
    case "completed":
      return "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300"
    case "partial":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300"
    case "failed":
      return "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-300"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300"
  }
}