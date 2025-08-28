// Utility functions for month calculations

// Helper function to calculate total months between two month/year pairs
export function calculateMonthsBetween(
  startMonth: number, 
  startYear: number, 
  endMonth: number, 
  endYear: number
): number {
  return (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
}

// Check if a given month/year is within a booking range
export function isMonthInRange(
  targetMonth: number,
  targetYear: number,
  startMonth: number,
  startYear: number,
  endMonth: number,
  endYear: number
): boolean {
  const targetValue = targetYear * 12 + targetMonth;
  const startValue = startYear * 12 + startMonth;
  const endValue = endYear * 12 + endMonth;
  
  return targetValue >= startValue && targetValue <= endValue;
}

// Format month and year for display
export function formatMonthYear(month: number, year: number, monthNames?: string[]): string {
  const defaultMonthNames = [
    "Jan", "Feb", "Mär", "Apr", "Mai", "Jun",
    "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"
  ];
  const names = monthNames || defaultMonthNames;
  return `${names[month - 1]} ${year}`;
}