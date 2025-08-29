"use server";

import { DateBooking, CreateDateBookingRequest, CreateDateBookingResponse, DateAvailabilityResponse, MINIMUM_DAYS } from "@/types/booking";
import { createClient } from "@/lib/supabase/server";
import { differenceInDays, format } from "date-fns";

export async function createDateBooking(request: CreateDateBookingRequest): Promise<CreateDateBookingResponse> {
  try {
    // Validate the request
    if (!request.selectedRange.startDate || !request.selectedRange.endDate) {
      return {
        success: false,
        error: "Bitte wähle einen gültigen Zeitraum aus"
      };
    }

    const startDate = request.selectedRange.startDate;
    const endDate = request.selectedRange.endDate;
    
    // Calculate total days and validate minimum
    const totalDays = differenceInDays(endDate, startDate) + 1;
    
    if (totalDays < MINIMUM_DAYS) {
      return {
        success: false,
        error: `Mindestbuchung: ${MINIMUM_DAYS} Tage (2 Wochen)`
      };
    }

    // Calculate total cost (in euros, as per updated schema)
    const totalCost = totalDays * 50; // 50€ per day

    const supabase = await createClient();

    // Check for overlapping bookings using the database function
    const { data: hasOverlap, error: overlapError } = await supabase
      .rpc('check_date_booking_overlap', {
        check_start_date: format(startDate, 'yyyy-MM-dd'),
        check_end_date: format(endDate, 'yyyy-MM-dd')
      });

    if (overlapError) {
      console.error('Error checking for overlaps:', overlapError);
      return {
        success: false,
        error: "Fehler beim Prüfen der Verfügbarkeit"
      };
    }

    if (hasOverlap) {
      return {
        success: false,
        error: "Dieser Zeitraum ist bereits belegt oder überschneidet sich mit einer bestehenden Buchung"
      };
    }

    // Insert the new booking
    const { data: insertedBooking, error: insertError } = await supabase
      .from('date_bookings')
      .insert({
        user_id: request.userId,
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd'),
        total_days: totalDays,
        total_cost: totalCost,
        status: 'pending',
        participant_name: request.userName,
        participant_email: request.userEmail,
        notes: request.notes
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating date booking:', insertError);
      return {
        success: false,
        error: "Fehler beim Erstellen der Buchung"
      };
    }

    // Transform the inserted data back to DateBooking format
    const booking: DateBooking = {
      id: insertedBooking.id,
      userId: insertedBooking.user_id,
      startDate: new Date(insertedBooking.start_date),
      endDate: new Date(insertedBooking.end_date),
      totalDays: insertedBooking.total_days,
      totalCost: insertedBooking.total_cost, // Already in euros as per schema
      status: insertedBooking.status,
      participantName: insertedBooking.participant_name,
      participantEmail: insertedBooking.participant_email,
      participantPhone: insertedBooking.participant_phone,
      notes: insertedBooking.notes,
      createdAt: insertedBooking.created_at,
      updatedAt: insertedBooking.updated_at
    };

    console.log("Created date booking:", booking);

    return {
      success: true,
      booking
    };

  } catch (error: unknown) {
    console.error("Error creating date booking:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Fehler beim Erstellen der Buchung"
    };
  }
}

export async function getDateAvailability(): Promise<DateAvailabilityResponse> {
  try {
    const supabase = await createClient();

    // Fetch all confirmed and pending bookings
    const { data: bookings, error } = await supabase
      .from('date_bookings')
      .select('start_date, end_date, status, participant_name, notes')
      .in('status', ['pending', 'confirmed'])
      .order('start_date', { ascending: true });

    if (error) {
      console.error('Error fetching date availability:', error);
      return {
        availableDates: [],
        blockedRanges: []
      };
    }

    // Convert to blocked ranges
    const blockedRanges = (bookings || []).map(booking => ({
      startDate: new Date(booking.start_date),
      endDate: new Date(booking.end_date),
      reason: booking.notes || `Belegt von ${booking.participant_name}`
    }));

    return {
      availableDates: [], // We'll calculate this on the frontend based on blocked ranges
      blockedRanges
    };

  } catch (error: unknown) {
    console.error("Error getting date availability:", error);
    return {
      availableDates: [],
      blockedRanges: []
    };
  }
}

export async function getUserDateBookings(userId: string): Promise<DateBooking[]> {
  try {
    const supabase = await createClient();

    const { data: bookings, error } = await supabase
      .from('date_bookings')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: true });

    if (error) {
      console.error('Error fetching user date bookings:', error);
      return [];
    }

    return (bookings || []).map(booking => ({
      id: booking.id,
      userId: booking.user_id,
      startDate: new Date(booking.start_date),
      endDate: new Date(booking.end_date),
      totalDays: booking.total_days,
      totalCost: booking.total_cost, // Already in euros as per schema
      status: booking.status,
      participantName: booking.participant_name,
      participantEmail: booking.participant_email,
      participantPhone: booking.participant_phone,
      notes: booking.notes,
      createdAt: booking.created_at,
      updatedAt: booking.updated_at
    }));

  } catch (error: unknown) {
    console.error("Error fetching user date bookings:", error);
    return [];
  }
}

export async function cancelDateBooking(bookingId: string, userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('date_bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId)
      .eq('user_id', userId); // Ensure user can only cancel their own bookings

    if (error) {
      console.error('Error cancelling date booking:', error);
      return {
        success: false,
        error: "Fehler beim Stornieren der Buchung"
      };
    }

    return { success: true };

  } catch (error: unknown) {
    console.error("Error cancelling date booking:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Fehler beim Stornieren der Buchung"
    };
  }
}