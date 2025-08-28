"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMonthAvailability, type BookingData } from "@/app/actions/availability";
import { BookingStatus, DateRange } from "@/types/booking";

export default function AvailabilityCalendar() {
  // Start with January 2026 for investment model
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0, 1));
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange>({ startDate: null, endDate: null });

  const months = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
  ];

  const weekDays = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

  const fetchMonthAvailability = useCallback(async () => {
    setLoading(true);
    try {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      const response = await getMonthAvailability(year, month);
      setBookings(response.bookings);
    } catch (error) {
      console.error("Failed to fetch availability:", error);
    } finally {
      setLoading(false);
    }
  }, [currentMonth]);

  useEffect(() => {
    fetchMonthAvailability();
  }, [fetchMonthAvailability]);

  const getDayStatus = (date: Date): BookingStatus => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) {
      return 'past';
    }

    
    for (const booking of bookings) {
      const startDate = new Date(booking.startDate);
      const endDate = new Date(booking.endDate);
      
      if (date >= startDate && date <= endDate) {
        return booking.status === 'confirmed' ? 'booked' : 'pending';
      }
    }
    
    return 'available';
  };

  const getStatusColor = (status: BookingStatus): string => {
    switch (status) {
      case 'available':
        return 'bg-gradient-to-br from-[#D4A574]/20 to-[#D4A574]/10 hover:from-[#D4A574]/30 hover:to-[#D4A574]/20 text-[#D4A574] border-[#D4A574]/30 backdrop-blur-sm';
      case 'booked':
        return 'bg-gradient-to-br from-red-500/20 to-red-600/10 text-red-300 border-red-400/30 cursor-not-allowed backdrop-blur-sm';
      case 'pending':
        return 'bg-gradient-to-br from-amber-500/20 to-amber-600/10 text-amber-300 border-amber-400/30 cursor-not-allowed backdrop-blur-sm';
      case 'past':
        return 'bg-gradient-to-br from-gray-600/10 to-gray-700/5 text-gray-500 border-gray-500/20 cursor-not-allowed backdrop-blur-sm';
      default:
        return 'bg-gradient-to-br from-gray-800/40 to-gray-900/20 hover:from-gray-700/50 hover:to-gray-800/30 text-gray-200 border-gray-600/30 backdrop-blur-sm';
    }
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: Date[] = [];
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      days.push(new Date(date));
    }
    
    return days;
  };

  const handleDateClick = (date: Date) => {
    const status = getDayStatus(date);
    if (status !== 'available') return;
    
    // For investment model, only allow full month selections
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    if (!selectedRange.startDate || (selectedRange.startDate && selectedRange.endDate)) {
      // Start new selection with full month
      setSelectedRange({ startDate: firstDayOfMonth, endDate: lastDayOfMonth });
    } else if (selectedRange.startDate && !selectedRange.endDate) {
      // Complete the range with full months
      if (date >= selectedRange.startDate) {
        setSelectedRange({ ...selectedRange, endDate: lastDayOfMonth });
      } else {
        setSelectedRange({ startDate: firstDayOfMonth, endDate: lastDayOfMonth });
      }
    }
  };

  const isDateInSelectedRange = (date: Date): boolean => {
    if (!selectedRange.startDate) return false;
    if (!selectedRange.endDate) return date.getTime() === selectedRange.startDate.getTime();
    return date >= selectedRange.startDate && date <= selectedRange.endDate;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      const newMonthValue = prev.getMonth() + (direction === 'next' ? 1 : -1);
      
      // Restrict navigation to 2026 only
      if (newMonthValue < 0) {
        return new Date(2026, 11, 1); // December 2026
      } else if (newMonthValue > 11) {
        return new Date(2026, 0, 1); // January 2026
      } else {
        newMonth.setMonth(newMonthValue);
        newMonth.setFullYear(2026); // Force year to 2026
        return newMonth;
      }
    });
  };

  const calculateMonthsSelected = (): number => {
    if (!selectedRange.startDate || !selectedRange.endDate) return 0;
    const startMonth = selectedRange.startDate.getMonth();
    const endMonth = selectedRange.endDate.getMonth();
    const startYear = selectedRange.startDate.getFullYear();
    const endYear = selectedRange.endDate.getFullYear();
    return (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
  };

  const calculateContributionAmount = (): number => {
    const months = calculateMonthsSelected();
    return months * 1000; // €1000 per month
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateMonth('prev')}
          className="p-2"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <h3 className="text-xl font-semibold text-white">
          {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateMonth('next')}
          className="p-2"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-white rounded-full" role="status" aria-label="loading">
            <span className="sr-only">Laden...</span>
          </div>
        </div>
      )}

      {/* Calendar Grid */}
      <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-gray-700/30">
        {/* Week Days */}
        <div className="grid grid-cols-7 gap-1 mb-3">
          {weekDays.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, index) => {
            const status = getDayStatus(date);
            const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
            const isSelected = isDateInSelectedRange(date);
            
            return (
              <button
                key={index}
                onClick={() => handleDateClick(date)}
                disabled={status !== 'available'}
                className={`
                  relative aspect-square text-sm font-medium rounded-xl border transition-all duration-200
                  ${getStatusColor(status)}
                  ${!isCurrentMonth ? 'opacity-30' : ''}
                  ${isSelected ? 'ring-2 ring-[#D4A574] ring-offset-2 ring-offset-gray-900/20' : ''}
                  min-h-[36px] md:min-h-[40px]
                `}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-gray-600/30">
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-br from-[#D4A574]/40 to-[#D4A574]/20 border border-[#D4A574]/40 rounded-md"></div>
              <span className="text-gray-300">Verfügbar</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-br from-red-500/40 to-red-600/20 border border-red-400/40 rounded-md"></div>
              <span className="text-gray-300">Gebucht</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-br from-amber-500/40 to-amber-600/20 border border-amber-400/40 rounded-md"></div>
              <span className="text-gray-300">Ausstehend</span>
            </div>
          </div>
        </div>

        {/* Selected Range Display */}
        {selectedRange.startDate && (
          <div className="mt-6 pt-4 border-t border-gray-600/30">
            <p className="text-sm text-gray-300">
              <span className="text-[#D4A574] font-medium">Gewählt:</span> {selectedRange.startDate.toLocaleDateString('de-DE')}
              {selectedRange.endDate && ` - ${selectedRange.endDate.toLocaleDateString('de-DE')}`}
            </p>
            {selectedRange.startDate && selectedRange.endDate && (
              <div className="mt-2 space-y-1">
                <p className="text-sm text-[#D4A574] font-medium">
                  {calculateMonthsSelected()} {calculateMonthsSelected() === 1 ? 'Monat' : 'Monate'} • €{calculateContributionAmount().toLocaleString()} Teilnahme
                </p>
                <p className="text-xs text-gray-400">
                  €1.000 pro Monat Campervan-Nutzung ab Sommer 2026
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}