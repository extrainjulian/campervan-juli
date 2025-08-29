// Types for date-based booking and availability system

export type DateBookingStatus = 'pending' | 'confirmed' | 'cancelled';

// ========================================
// NEW DATE-BASED BOOKING TYPES
// ========================================

// Date-based booking entity (2-week minimum system)
export type DateBooking = {
  id: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  totalCost: number; // in euros (50€/day)
  status: DateBookingStatus;
  participantName: string;
  participantEmail: string;
  participantPhone?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

// Date range for the new system
export type DateRangeSelection = {
  startDate: Date | null;
  endDate: Date | null;
};

// Form data for creating date bookings
export type DateBookingFormData = {
  startDate: Date;
  endDate: Date;
  participantName: string;
  participantEmail: string;
  participantPhone?: string;
  notes?: string;
};

// API response types
export type CreateDateBookingRequest = {
  userId: string;
  userEmail: string;
  userName: string;
  selectedRange: DateRangeSelection;
  notes?: string;
};

export type CreateDateBookingResponse = {
  success: boolean;
  booking?: DateBooking;
  error?: string;
};

// Availability checking
export type DateAvailability = {
  date: Date;
  isAvailable: boolean;
  isBlocked: boolean;
  bookingId?: string;
};

export type DateAvailabilityResponse = {
  availableDates: Date[];
  blockedRanges: Array<{
    startDate: Date;
    endDate: Date;
    reason?: string;
  }>;
};

// Utility types for validation
export type BookingValidationResult = {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
};

// Cost calculation helpers
export const DAILY_RATE = 50; // 50€ per day
export const MINIMUM_DAYS = 14; // 2 weeks minimum
export const MINIMUM_COST = DAILY_RATE * MINIMUM_DAYS; // 700€