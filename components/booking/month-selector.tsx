"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getYearlyMonthAvailability } from "@/app/actions/month-availability";
import { calculateMonthsBetween, formatMonthYear } from "@/lib/month-utils";
import { MonthStatus, MonthRange, BookingStatus } from "@/types/booking";

interface MonthSelectorProps {
  onSelectionChange?: (range: MonthRange) => void;
  initialSelection?: MonthRange;
}

export default function MonthSelector({ onSelectionChange, initialSelection }: MonthSelectorProps) {
  const [currentYear, setCurrentYear] = useState(2026);
  const [monthStatuses, setMonthStatuses] = useState<MonthStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRange, setSelectedRange] = useState<MonthRange>(
    initialSelection || {
      startMonth: null,
      startYear: null,
      endMonth: null,
      endYear: null
    }
  );

  const months = [
    "Jan", "Feb", "Mär", "Apr", "Mai", "Jun",
    "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"
  ];

  const fetchYearAvailability = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getYearlyMonthAvailability(currentYear);
      setMonthStatuses(response.monthStatuses);
    } catch (error) {
      console.error("Failed to fetch year availability:", error);
    } finally {
      setLoading(false);
    }
  }, [currentYear]);

  useEffect(() => {
    fetchYearAvailability();
  }, [fetchYearAvailability]);

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedRange);
    }
  }, [selectedRange, onSelectionChange]);

  const getMonthStatus = (month: number): BookingStatus => {
    const monthStatus = monthStatuses.find(ms => ms.month === month);
    return monthStatus?.status || 'available';
  };

  const getStatusColor = (status: BookingStatus): string => {
    switch (status) {
      case 'available':
        return 'bg-gradient-to-br from-[#D4A574]/20 to-[#D4A574]/10 hover:from-[#D4A574]/30 hover:to-[#D4A574]/20 text-[#D4A574] border-[#D4A574]/30 backdrop-blur-sm cursor-pointer';
      case 'booked':
        return 'bg-gradient-to-br from-red-500/20 to-red-600/10 text-red-300 border-red-400/30 cursor-not-allowed backdrop-blur-sm';
      case 'pending':
        return 'bg-gradient-to-br from-amber-500/20 to-amber-600/10 text-amber-300 border-amber-400/30 cursor-not-allowed backdrop-blur-sm';
      case 'past':
        return 'bg-gradient-to-br from-gray-600/10 to-gray-700/5 text-gray-500 border-gray-500/20 cursor-not-allowed backdrop-blur-sm';
      default:
        return 'bg-gradient-to-br from-gray-800/40 to-gray-900/20 hover:from-gray-700/50 hover:to-gray-800/30 text-gray-200 border-gray-600/30 backdrop-blur-sm cursor-pointer';
    }
  };

  const handleMonthClick = (month: number) => {
    const status = getMonthStatus(month);
    if (status !== 'available') return;

    // If clicking the same month that's already selected, reset
    if (selectedRange.startMonth === month && selectedRange.startYear === currentYear && !selectedRange.endMonth) {
      setSelectedRange({
        startMonth: null,
        startYear: null,
        endMonth: null,
        endYear: null
      });
      return;
    }

    if (!selectedRange.startMonth || (selectedRange.startMonth && selectedRange.endMonth)) {
      // Start new selection (single month)
      setSelectedRange({
        startMonth: month,
        startYear: currentYear,
        endMonth: null,
        endYear: null
      });
    } else if (selectedRange.startMonth && !selectedRange.endMonth) {
      // Second click - complete the range or reset if same month
      const startValue = selectedRange.startYear! * 12 + selectedRange.startMonth;
      const endValue = currentYear * 12 + month;
      
      if (endValue >= startValue) {
        setSelectedRange({
          ...selectedRange,
          endMonth: month,
          endYear: currentYear
        });
      } else {
        // If clicked month is before start, make it the new start (single month)
        setSelectedRange({
          startMonth: month,
          startYear: currentYear,
          endMonth: null,
          endYear: null
        });
      }
    }
  };

  const isMonthInSelectedRange = (month: number): boolean => {
    if (!selectedRange.startMonth || !selectedRange.startYear) return false;
    
    const monthValue = currentYear * 12 + month;
    const startValue = selectedRange.startYear * 12 + selectedRange.startMonth;
    
    if (!selectedRange.endMonth || !selectedRange.endYear) {
      return monthValue === startValue;
    }
    
    const endValue = selectedRange.endYear * 12 + selectedRange.endMonth;
    return monthValue >= startValue && monthValue <= endValue;
  };

  const navigateYear = (direction: 'prev' | 'next') => {
    const newYear = currentYear + (direction === 'next' ? 1 : -1);
    // Restrict to 2026-2027 range
    if (newYear >= 2026 && newYear <= 2027) {
      setCurrentYear(newYear);
    }
  };

  const calculateSelectedMonths = (): number => {
    if (!selectedRange.startMonth || !selectedRange.startYear || !selectedRange.endMonth || !selectedRange.endYear) {
      return 0;
    }
    return calculateMonthsBetween(
      selectedRange.startMonth,
      selectedRange.startYear,
      selectedRange.endMonth,
      selectedRange.endYear
    );
  };

  const calculateContributionAmount = (): number => {
    return calculateSelectedMonths() * 1000;
  };


  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateYear('prev')}
          disabled={currentYear <= 2026}
          className="p-2"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <h3 className="text-xl font-semibold text-white">
          {currentYear}
        </h3>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateYear('next')}
          disabled={currentYear >= 2027}
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

      {/* Month Grid */}
      <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-gray-700/30">
        <div className="grid grid-cols-3 gap-4">
          {months.map((monthName, index) => {
            const month = index + 1;
            const status = getMonthStatus(month);
            const isSelected = isMonthInSelectedRange(month);
            
            return (
              <button
                key={month}
                onClick={() => handleMonthClick(month)}
                disabled={status !== 'available'}
                className={`
                  relative p-4 text-sm font-medium rounded-xl border transition-all duration-200
                  ${getStatusColor(status)}
                  ${isSelected ? 'ring-2 ring-[#D4A574] ring-offset-2 ring-offset-gray-900/20 scale-105' : ''}
                  min-h-[60px] flex items-center justify-center
                `}
              >
                <div className="text-center">
                  <div className="font-semibold">{monthName}</div>
                  <div className="text-xs opacity-70">{currentYear}</div>
                </div>
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
              <span className="text-gray-300">Belegt</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-br from-amber-500/40 to-amber-600/20 border border-amber-400/40 rounded-md"></div>
              <span className="text-gray-300">Ausstehend</span>
            </div>
          </div>
        </div>

        {/* Selected Range Display */}
        {selectedRange.startMonth && selectedRange.startYear && (
          <div className="mt-6 pt-4 border-t border-gray-600/30">
            <p className="text-sm text-gray-300">
              <span className="text-[#D4A574] font-medium">Gewählt:</span>{' '}
              {formatMonthYear(selectedRange.startMonth, selectedRange.startYear)}
              {selectedRange.endMonth && selectedRange.endYear && 
                ` - ${formatMonthYear(selectedRange.endMonth, selectedRange.endYear)}`
              }
            </p>
            <div className="mt-2 space-y-1">
              <p className="text-sm text-[#D4A574] font-medium">
                {selectedRange.endMonth && selectedRange.endYear ? (
                  <>
                    {calculateSelectedMonths()} {calculateSelectedMonths() === 1 ? 'Monat' : 'Monate'} • €{calculateContributionAmount().toLocaleString()} Teilnahme
                  </>
                ) : (
                  <>
                    1 Monat • €1.000 Teilnahme
                  </>
                )}
              </p>
              <p className="text-xs text-gray-400">
                €1.000 pro Monat Campervan-Nutzung
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}