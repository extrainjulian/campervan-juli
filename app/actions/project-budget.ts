"use server";

import { createClient } from "@/lib/supabase/server";

export type ProjectBudgetData = {
  currentBudget: number;
  totalBudget: number;
  progressPercentage: number;
  currentParticipants: number;
  totalParticipants: number;
  totalMonthsBooked: number;
  pendingRevenue: number;
  confirmedRevenue: number;
};

export type ProjectBudgetResponse = {
  success: boolean;
  data?: ProjectBudgetData;
  error?: string;
};

export async function getProjectBudget(): Promise<ProjectBudgetResponse> {
  try {
    const supabase = await createClient();
    
    // Fetch all bookings to calculate budget
    const { data: bookings, error } = await supabase
      .from('month_bookings')
      .select('*')
      .neq('status', 'cancelled');

    if (error) {
      console.error('Error fetching bookings for budget:', error);
      return {
        success: false,
        error: "Fehler beim Abrufen der Projektdaten"
      };
    }

    // Calculate budget metrics
    const totalBudget = 25000; // Fixed total budget needed
    const revenuePerMonth = 1000; // €1000 per month
    const personalInvestment = 10000; // Julian's initial investment
    
    // Calculate confirmed and pending revenue
    const confirmedBookings = (bookings || []).filter(b => b.status === 'booked');
    const pendingBookings = (bookings || []).filter(b => b.status === 'pending');
    
    const confirmedRevenue = confirmedBookings.reduce((sum, booking) => sum + (booking.total_months * revenuePerMonth), 0);
    const pendingRevenue = pendingBookings.reduce((sum, booking) => sum + (booking.total_months * revenuePerMonth), 0);
    
    const currentBudget = personalInvestment + confirmedRevenue + pendingRevenue;
    const progressPercentage = Math.min((currentBudget / totalBudget) * 100, 100);
    
    // Calculate participants (unique users)
    const uniqueParticipants = new Set((bookings || []).map(b => b.user_id)).size;
    const totalParticipants = 15; // Max participants
    
    // Calculate total months booked
    const totalMonthsBooked = (bookings || []).reduce((sum, booking) => sum + booking.total_months, 0);

    const budgetData: ProjectBudgetData = {
      currentBudget,
      totalBudget,
      progressPercentage,
      currentParticipants: uniqueParticipants,
      totalParticipants,
      totalMonthsBooked,
      pendingRevenue,
      confirmedRevenue
    };

    return {
      success: true,
      data: budgetData
    };

  } catch (error: unknown) {
    console.error('Error in getProjectBudget:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Fehler beim Berechnen des Projektbudgets"
    };
  }
}