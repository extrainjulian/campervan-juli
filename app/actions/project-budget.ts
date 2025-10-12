"use server";

import { createClient } from "@/lib/supabase/server";

export type ProjectBudgetData = {
  currentBudget: number;
  totalBudget: number;
  progressPercentage: number;
  totalDaysBooked: number;
  targetDaysFor10k: number;
  bookingProgressPercentage: number;
  confirmedRevenue: number;
  pendingRevenue: number;
  personalInvestment: number;
};

export type ProjectBudgetResponse = {
  success: boolean;
  data?: ProjectBudgetData;
  error?: string;
};

export async function getProjectBudget(): Promise<ProjectBudgetResponse> {
  try {
    const supabase = await createClient();
    
    // Fetch all date bookings to calculate budget
    const { data: bookings, error } = await supabase
      .from('date_bookings')
      .select('*')
      .neq('status', 'cancelled');

    if (error) {
      console.error('Error fetching bookings for budget:', error);
      return {
        success: false,
        error: "Fehler beim Abrufen der Projektdaten"
      };
    }

    // Budget calculations
    const totalBudget = 20000; // Total budget needed for full conversion
    const personalInvestment = 15000; // Julian's personal investment (10k Julian + 5k Mum)
    // const targetCrowdfunding = 5000; // Target crowdfunding amount (for reference)
    const targetDaysFor10k = 100; // 100 days needed to achieve 5k€ (100 * 50€ = 5k€)
    
    // Calculate revenue from bookings
    const confirmedBookings = (bookings || []).filter(b => b.status === 'confirmed');
    const pendingBookings = (bookings || []).filter(b => b.status === 'pending');
    
    const confirmedRevenue = confirmedBookings.reduce((sum, booking) => sum + booking.total_cost, 0);
    const pendingRevenue = pendingBookings.reduce((sum, booking) => sum + booking.total_cost, 0);
    
    // Total current budget (personal investment + confirmed + pending revenue)
    const currentBudget = personalInvestment + confirmedRevenue + pendingRevenue;
    const progressPercentage = Math.min((currentBudget / totalBudget) * 100, 100);
    
    // Calculate total days booked
    const totalDaysBooked = (bookings || []).reduce((sum, booking) => sum + booking.total_days, 0);
    
    // Calculate booking progress towards 10k target
    const bookingProgressPercentage = Math.min((totalDaysBooked / targetDaysFor10k) * 100, 100);

    const budgetData: ProjectBudgetData = {
      currentBudget,
      totalBudget,
      progressPercentage,
      totalDaysBooked,
      targetDaysFor10k,
      bookingProgressPercentage,
      confirmedRevenue,
      pendingRevenue,
      personalInvestment
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