// Types for booking and availability system

export type BookingStatus = 'available' | 'booked' | 'pending' | 'blocked' | 'past';

export type DayStatus = {
  date: string; // YYYY-MM-DD format
  status: BookingStatus;
  bookingId?: string;
  isStartDate?: boolean;
  isEndDate?: boolean;
};

export type CalendarMonth = {
  year: number;
  month: number; // 1-12
  days: DayStatus[];
};

export type DateRange = {
  startDate: Date | null;
  endDate: Date | null;
};

export type BookingFormData = {
  startDate: string;
  endDate: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
};

// Utility type for date formatting
export type DateString = string; // YYYY-MM-DD format