"use server";

import { MonthBooking, MonthStatus, BookingStatus } from "@/types/booking";
import { createClient } from "@/lib/supabase/server";

export type YearlyAvailabilityResponse = {
  monthStatuses: MonthStatus[];
  bookings: MonthBooking[];
  year: number;
};

// Dummy data for testing - simulates some bookings across 2025-2027
const dummyMonthBookings: MonthBooking[] = [
  {
    id: "1",
    startMonth: 12,
    startYear: 2024,
    endMonth: 2,
    endYear: 2025,
    totalMonths: 3,
    status: "booked",
    participantName: "Max Mustermann",
    participantEmail: "max@example.com",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "2",
    startMonth: 6,
    startYear: 2025,
    endMonth: 8,
    endYear: 2025,
    totalMonths: 3,
    status: "booked",
    participantName: "Anna Schmidt",
    participantEmail: "anna@example.com",
    createdAt: "2024-02-20T14:30:00Z",
    updatedAt: "2024-02-20T14:30:00Z"
  },
  {
    id: "3",
    startMonth: 1,
    startYear: 2026,
    endMonth: 1,
    endYear: 2026,
    totalMonths: 1,
    status: "booked",
    participantName: "Peter Weber",
    participantEmail: "peter@example.com",
    createdAt: "2024-03-10T09:15:00Z",
    updatedAt: "2024-03-10T09:15:00Z"
  },
  {
    id: "4",
    startMonth: 4,
    startYear: 2026,
    endMonth: 6,
    endYear: 2026,
    totalMonths: 3,
    status: "pending",
    participantName: "Lisa Mueller",
    participantEmail: "lisa@example.com",
    createdAt: "2024-03-25T16:45:00Z",
    updatedAt: "2024-03-25T16:45:00Z"
  },
  {
    id: "5",
    startMonth: 9,
    startYear: 2026,
    endMonth: 11,
    endYear: 2026,
    totalMonths: 3,
    status: "booked",
    participantName: "Tom Fischer",
    participantEmail: "tom@example.com",
    createdAt: "2024-04-05T11:20:00Z",
    updatedAt: "2024-04-05T11:20:00Z"
  }
];

export async function getYearlyMonthAvailability(year: number): Promise<YearlyAvailabilityResponse> {
  try {
    const supabase = await createClient();
    
    // Fetch all bookings that overlap with the requested year
    const { data: bookingsData, error } = await supabase
      .from('month_bookings')
      .select('*')
      .or(`and(start_year.lte.${year},end_year.gte.${year}),start_year.eq.${year},end_year.eq.${year}`)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching bookings:', error);
      // Fall back to dummy data on error
      return getFallbackYearlyAvailability(year);
    }

    // Transform Supabase data to MonthBooking format
    const relevantBookings: MonthBooking[] = (bookingsData || []).map(booking => ({
      id: booking.id,
      startMonth: booking.start_month,
      startYear: booking.start_year,
      endMonth: booking.end_month,
      endYear: booking.end_year,
      totalMonths: booking.total_months,
      status: booking.status as BookingStatus,
      participantName: booking.participant_name,
      participantEmail: booking.participant_email,
      participantPhone: booking.participant_phone,
      createdAt: booking.created_at,
      updatedAt: booking.updated_at
    }));
    
    // Generate month statuses for the entire year
    const monthStatuses: MonthStatus[] = [];
    
    for (let month = 1; month <= 12; month++) {
      const status = getMonthStatus(year, month, relevantBookings);
      monthStatuses.push({
        year,
        month,
        status: status.status,
        bookingId: status.bookingId
      });
    }
    
    return {
      monthStatuses,
      bookings: relevantBookings,
      year
    };
  } catch (error) {
    console.error('Error in getYearlyMonthAvailability:', error);
    // Fall back to dummy data on error
    return getFallbackYearlyAvailability(year);
  }
}

// Fallback function using dummy data
function getFallbackYearlyAvailability(year: number): YearlyAvailabilityResponse {
  // Filter bookings that overlap with the requested year
  const relevantBookings = dummyMonthBookings.filter(booking => {
    // Check if booking overlaps with the year
    return (booking.startYear <= year && booking.endYear >= year) ||
           (booking.startYear === year) ||
           (booking.endYear === year);
  });
  
  // Generate month statuses for the entire year
  const monthStatuses: MonthStatus[] = [];
  
  for (let month = 1; month <= 12; month++) {
    const status = getMonthStatus(year, month, relevantBookings);
    monthStatuses.push({
      year,
      month,
      status: status.status,
      bookingId: status.bookingId
    });
  }
  
  return {
    monthStatuses,
    bookings: relevantBookings,
    year
  };
}

function getMonthStatus(year: number, month: number, bookings: MonthBooking[]): { status: BookingStatus; bookingId?: string } {
  // Check if this month is in the past (before October 2024)
  const currentDate = new Date();
  const monthDate = new Date(year, month - 1, 1);
  const projectStart = new Date(2024, 9, 1); // October 2024
  
  if (monthDate < projectStart) {
    return { status: 'past' };
  }
  
  if (monthDate < currentDate && year < currentDate.getFullYear()) {
    return { status: 'past' };
  }
  
  // Check if month is booked
  for (const booking of bookings) {
    if (isMonthInBooking(year, month, booking)) {
      return { 
        status: booking.status, 
        bookingId: booking.id 
      };
    }
  }
  
  return { status: 'available' };
}

function isMonthInBooking(year: number, month: number, booking: MonthBooking): boolean {
  // Convert booking range to comparable format
  const bookingStartValue = booking.startYear * 12 + booking.startMonth;
  const bookingEndValue = booking.endYear * 12 + booking.endMonth;
  const monthValue = year * 12 + month;
  
  return monthValue >= bookingStartValue && monthValue <= bookingEndValue;
}

