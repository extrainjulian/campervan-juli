"use server";

export type BookingData = {
  id: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  guestName: string;
  status: 'confirmed' | 'pending';
};

export type AvailabilityResponse = {
  bookings: BookingData[];
  month: number;
  year: number;
};

export async function getMonthAvailability(year: number, month: number): Promise<AvailabilityResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Dummy booking data - hardcoded for testing
  const dummyBookings: BookingData[] = [
    {
      id: "1",
      startDate: "2024-04-05",
      endDate: "2024-04-12",
      guestName: "Max Mustermann",
      status: "confirmed"
    },
    {
      id: "2", 
      startDate: "2024-04-18",
      endDate: "2024-04-25",
      guestName: "Anna Schmidt",
      status: "confirmed"
    },
    {
      id: "3",
      startDate: "2024-05-02",
      endDate: "2024-05-09", 
      guestName: "Peter Weber",
      status: "confirmed"
    },
    {
      id: "4",
      startDate: "2024-05-15",
      endDate: "2024-05-22",
      guestName: "Lisa Mueller",
      status: "pending"
    },
    {
      id: "5",
      startDate: "2024-03-25",
      endDate: "2024-04-03", // Overlaps into April
      guestName: "Tom Fischer",
      status: "confirmed"
    }
  ];
  
  // Filter bookings that overlap with the requested month
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0);
  
  const relevantBookings = dummyBookings.filter(booking => {
    const bookingStart = new Date(booking.startDate);
    const bookingEnd = new Date(booking.endDate);
    
    // Check if booking overlaps with the month
    return bookingStart <= endOfMonth && bookingEnd >= startOfMonth;
  });
  
  return {
    bookings: relevantBookings,
    month,
    year
  };
}