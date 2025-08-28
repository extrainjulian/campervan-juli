// Types for month-based booking and availability system

export type BookingStatus = 'available' | 'booked' | 'pending' | 'blocked' | 'past';

// Month-based booking entity
export type MonthBooking = {
  id: string;
  startMonth: number; // 1-12
  startYear: number;
  endMonth: number; // 1-12
  endYear: number;
  totalMonths: number;
  status: BookingStatus;
  participantName?: string;
  participantEmail?: string;
  participantPhone?: string;
  createdAt: string;
  updatedAt: string;
};

export type MonthStatus = {
  year: number;
  month: number; // 1-12
  status: BookingStatus;
  bookingId?: string;
};

export type MonthRange = {
  startMonth: number | null; // 1-12
  startYear: number | null;
  endMonth: number | null; // 1-12
  endYear: number | null;
};

export type ParticipationFormData = {
  startMonth: number;
  startYear: number;
  endMonth: number;
  endYear: number;
  participantName: string;
  participantEmail: string;
  participantPhone?: string;
};

// Legacy types for compatibility (can be removed later)
export type DateRange = {
  startDate: Date | null;
  endDate: Date | null;
};

// Utility type for month formatting
export type MonthString = string; // YYYY-MM format