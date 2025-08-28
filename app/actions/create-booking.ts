"use server";

import { MonthBooking, MonthRange } from "@/types/booking";
import { calculateMonthsBetween } from "@/lib/month-utils";
import { createClient } from "@/lib/supabase/server";

export type CreateBookingRequest = {
  userId: string;
  userEmail: string;
  userName: string;
  selectedRange: MonthRange;
};

export type CreateBookingResponse = {
  success: boolean;
  booking?: MonthBooking;
  error?: string;
};

export async function createMonthBooking(request: CreateBookingRequest): Promise<CreateBookingResponse> {
  try {
    // Validate the request
    if (!request.selectedRange.startMonth || !request.selectedRange.startYear) {
      return {
        success: false,
        error: "Ungültiger Zeitraum ausgewählt"
      };
    }

    // After validation, we know these values are not null
    const startMonth = request.selectedRange.startMonth!;
    const startYear = request.selectedRange.startYear!;

    // For single month selection, use startMonth as endMonth
    const endMonth = request.selectedRange.endMonth || startMonth;
    const endYear = request.selectedRange.endYear || startYear;

    // Calculate total months
    const totalMonths = calculateMonthsBetween(
      startMonth,
      startYear,
      endMonth,
      endYear
    );

    const supabase = await createClient();

    // Check for overlapping bookings using a simpler approach
    const { data: allBookings, error: checkError } = await supabase
      .from('month_bookings')
      .select('*')
      .neq('status', 'cancelled');

    if (checkError) {
      console.error('Error fetching bookings for overlap check:', checkError);
      return {
        success: false,
        error: "Fehler beim Prüfen der Verfügbarkeit"
      };
    }

    // Check for overlaps manually with clear logic
    const hasOverlap = (allBookings || []).some(booking => {
      // Convert to comparable values (year * 12 + month)
      const bookingStart = booking.start_year * 12 + booking.start_month;
      const bookingEnd = booking.end_year * 12 + booking.end_month;
      const newStart = startYear * 12 + startMonth;
      const newEnd = endYear * 12 + endMonth;
      
      // Check if ranges overlap
      return !(newEnd < bookingStart || newStart > bookingEnd);
    });

    if (hasOverlap) {
      return {
        success: false,
        error: "Dieser Zeitraum ist bereits belegt"
      };
    }

    // Insert the new booking
    const { data: insertedBooking, error: insertError } = await supabase
      .from('month_bookings')
      .insert({
        user_id: request.userId,
        start_month: startMonth,
        start_year: startYear,
        end_month: endMonth,
        end_year: endYear,
        total_months: totalMonths,
        status: 'pending',
        participant_name: request.userName,
        participant_email: request.userEmail
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating booking:', insertError);
      return {
        success: false,
        error: "Fehler beim Erstellen der Buchung"
      };
    }

    // Transform the inserted data back to MonthBooking format
    const booking: MonthBooking = {
      id: insertedBooking.id,
      startMonth: insertedBooking.start_month,
      startYear: insertedBooking.start_year,
      endMonth: insertedBooking.end_month,
      endYear: insertedBooking.end_year,
      totalMonths: insertedBooking.total_months,
      status: insertedBooking.status,
      participantName: insertedBooking.participant_name,
      participantEmail: insertedBooking.participant_email,
      participantPhone: insertedBooking.participant_phone,
      createdAt: insertedBooking.created_at,
      updatedAt: insertedBooking.updated_at
    };

    console.log("Created booking:", booking);

    return {
      success: true,
      booking
    };

  } catch (error: unknown) {
    console.error("Error creating booking:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Fehler beim Erstellen der Buchung"
    };
  }
}