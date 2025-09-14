export const DateUtils = {
  getCurrentDate,
  formatDate,
  formatDateTime,
  parseDate,
  isValidDateString,
  getRelativeDate,
  addDays,
  subtractDays,
  isDateInRange,
  getDateDifference
};

export function getCurrentDate(): string {
  const now = new Date();
  return formatDate(now);
}

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

export function formatDateTime(date: Date): string {
  const dateStr = formatDate(date);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${dateStr} ${hours}:${minutes}:${seconds}`;
}

export function parseDate(dateString: string): Date | null {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}

export function isValidDateString(dateString: string): boolean {
  return parseDate(dateString) !== null;
}

export function getRelativeDate(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return 'Today';
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

export function addYears(date: Date, years: number): Date {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
}

export function getStartOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function getEndOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

export function getStartOfWeek(date: Date): Date {
  const result = new Date(date);
  const day = result.getDay();
  const diff = result.getDate() - day;
  result.setDate(diff);
  return getStartOfDay(result);
}

export function getEndOfWeek(date: Date): Date {
  const result = new Date(date);
  const day = result.getDay();
  const diff = result.getDate() - day + 6;
  result.setDate(diff);
  return getEndOfDay(result);
}

export function getStartOfMonth(date: Date): Date {
  const result = new Date(date);
  result.setDate(1);
  return getStartOfDay(result);
}

export function getEndOfMonth(date: Date): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + 1, 0);
  return getEndOfDay(result);
}

export function getStartOfYear(date: Date): Date {
  const result = new Date(date);
  result.setMonth(0, 1);
  return getStartOfDay(result);
}

export function getEndOfYear(date: Date): Date {
  const result = new Date(date);
  result.setMonth(11, 31);
  return getEndOfDay(result);
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

export function isYesterday(date: Date): boolean {
  const yesterday = addDays(new Date(), -1);
  return date.toDateString() === yesterday.toDateString();
}

export function isThisWeek(date: Date): boolean {
  const startOfWeek = getStartOfWeek(new Date());
  const endOfWeek = getEndOfWeek(new Date());
  return date >= startOfWeek && date <= endOfWeek;
}

export function isThisMonth(date: Date): boolean {
  const startOfMonth = getStartOfMonth(new Date());
  const endOfMonth = getEndOfMonth(new Date());
  return date >= startOfMonth && date <= endOfMonth;
}

export function isThisYear(date: Date): boolean {
  const startOfYear = getStartOfYear(new Date());
  const endOfYear = getEndOfYear(new Date());
  return date >= startOfYear && date <= endOfYear;
}

export function getDaysBetween(date1: Date, date2: Date): number {
  const diffInMs = Math.abs(date2.getTime() - date1.getTime());
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
}

export function getMonthsBetween(date1: Date, date2: Date): number {
  const yearDiff = date2.getFullYear() - date1.getFullYear();
  const monthDiff = date2.getMonth() - date1.getMonth();
  return yearDiff * 12 + monthDiff;
}

export function getYearsBetween(date1: Date, date2: Date): number {
  const yearDiff = date2.getFullYear() - date1.getFullYear();
  const monthDiff = date2.getMonth() - date1.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && date2.getDate() < date1.getDate())) {
    return yearDiff - 1;
  }
  
  return yearDiff;
}

export function formatDateRange(startDate: Date, endDate: Date): string {
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  
  if (start === end) {
    return start;
  }
  
  return `${start} - ${end}`;
}

export function getDateFromInput(inputValue: string): Date | null {
  if (!inputValue) {
    return null;
  }
  
  // Handle different input formats
  const date = new Date(inputValue);
  
  if (isNaN(date.getTime())) {
    return null;
  }
  
  return date;
}

export function setDateToInput(date: Date): string {
  return formatDate(date);
}

export function getCurrentTimestamp(): number {
  return Date.now();
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return formatDateTime(date);
}

export function getTimestampFromDate(date: Date): number {
  return date.getTime();
}

export function getDateFromTimestamp(timestamp: number): Date {
  return new Date(timestamp);
}

export function subtractDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

export function isDateInRange(date: Date, startDate: Date, endDate: Date): boolean {
  return date >= startDate && date <= endDate;
}

export function getDateDifference(date1: Date, date2: Date): number {
  return Math.abs(date1.getTime() - date2.getTime());
}