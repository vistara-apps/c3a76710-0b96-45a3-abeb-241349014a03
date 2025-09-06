import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, isToday, isThisWeek, startOfDay, endOfDay } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  if (isToday(date)) {
    return 'Today';
  }
  return format(date, 'MMM d');
}

export function isTaskDueToday(dueDate: Date): boolean {
  return isToday(dueDate);
}

export function isTaskDueThisWeek(dueDate: Date): boolean {
  return isThisWeek(dueDate);
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function calculateCompletionRate(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}
