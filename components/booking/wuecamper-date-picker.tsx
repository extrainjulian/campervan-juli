"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format, addDays, differenceInDays, isAfter, isBefore, startOfDay } from "date-fns";
import { de } from "date-fns/locale";
import { type DateRange } from "react-day-picker";
import { DateRangeSelection, MINIMUM_DAYS } from "@/types/booking";

interface WuecamperDatePickerProps {
  onSelectionChange?: (range: DateRangeSelection) => void;
  initialSelection?: DateRangeSelection;
  blockedRanges?: Array<{ startDate: Date; endDate: Date; reason?: string }>;
  className?: string;
}

export default function WuecamperDatePicker({
  onSelectionChange,
  initialSelection,
  blockedRanges = [],
  className,
}: WuecamperDatePickerProps) {
  const [selectedRange, setSelectedRange] = useState<DateRangeSelection>(
    initialSelection || {
      startDate: null,
      endDate: null,
    }
  );
  const [calendarRange, setCalendarRange] = useState<DateRange | undefined>();

  // Convert our DateRangeSelection to react-day-picker DateRange
  useEffect(() => {
    if (selectedRange.startDate && selectedRange.endDate) {
      setCalendarRange({
        from: selectedRange.startDate,
        to: selectedRange.endDate,
      });
    } else if (selectedRange.startDate) {
      setCalendarRange({
        from: selectedRange.startDate,
        to: undefined,
      });
    } else {
      setCalendarRange(undefined);
    }
  }, [selectedRange]);

  // Notify parent component of changes
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedRange);
    }
  }, [selectedRange, onSelectionChange]);

  // Check if a date is blocked by existing bookings
  const isDateBlocked = useCallback(
    (date: Date) => {
      const checkDate = startOfDay(date);
      return blockedRanges.some(({ startDate, endDate }) => {
        const blockStart = startOfDay(startDate);
        const blockEnd = startOfDay(endDate);
        return checkDate >= blockStart && checkDate <= blockEnd;
      });
    },
    [blockedRanges]
  );

  // Check if a date range has any blocked dates
  const rangeHasBlockedDates = useCallback(
    (from: Date, to: Date) => {
      const start = startOfDay(from);
      const end = startOfDay(to);
      const days = differenceInDays(end, start) + 1;
      
      for (let i = 0; i < days; i++) {
        const checkDate = addDays(start, i);
        if (isDateBlocked(checkDate)) {
          return true;
        }
      }
      return false;
    },
    [isDateBlocked]
  );

  const handleCalendarSelect = (range: DateRange | undefined) => {
    if (!range) {
      setSelectedRange({ startDate: null, endDate: null });
      return;
    }

    if (range.from && range.to) {
      const totalDays = differenceInDays(range.to, range.from) + 1;
      
      // Check minimum days requirement
      if (totalDays < MINIMUM_DAYS) {
        // Auto-extend to minimum if possible
        const extendedEnd = addDays(range.from, MINIMUM_DAYS - 1);
        if (!rangeHasBlockedDates(range.from, extendedEnd)) {
          setSelectedRange({
            startDate: range.from,
            endDate: extendedEnd,
          });
          return;
        }
      }

      // Check for blocked dates in the range
      if (rangeHasBlockedDates(range.from, range.to)) {
        // Don't allow selection with blocked dates
        return;
      }

      setSelectedRange({
        startDate: range.from,
        endDate: range.to,
      });
    } else if (range.from) {
      setSelectedRange({
        startDate: range.from,
        endDate: null,
      });
    }
  };

  const calculateDays = (): number => {
    if (!selectedRange.startDate || !selectedRange.endDate) return 0;
    return differenceInDays(selectedRange.endDate, selectedRange.startDate) + 1;
  };

  const calculateCost = (): number => {
    const days = calculateDays();
    return days * 50; // 50€ per day
  };

  const isValidSelection = (): boolean => {
    const days = calculateDays();
    return days >= MINIMUM_DAYS && !rangeHasBlockedDates(selectedRange.startDate!, selectedRange.endDate!);
  };

  const formatDateRange = (): string => {
    if (!selectedRange.startDate) {
      return "Wähle deine 2+ Wochen";
    }
    if (!selectedRange.endDate) {
      return `${format(selectedRange.startDate, "dd. MMM yyyy", { locale: de })} - ?`;
    }
    return `${format(selectedRange.startDate, "dd. MMM", { locale: de })} - ${format(selectedRange.endDate, "dd. MMM yyyy", { locale: de })}`;
  };

  const getDateModifiers = () => {
    const blocked = blockedRanges.reduce((acc, { startDate, endDate }) => {
      const days = [];
      const start = startOfDay(startDate);
      const end = startOfDay(endDate);
      const totalDays = differenceInDays(end, start) + 1;
      
      for (let i = 0; i < totalDays; i++) {
        days.push(addDays(start, i));
      }
      return [...acc, ...days];
    }, [] as Date[]);

    return {
      blocked,
    };
  };

  const minDate = new Date(2026, 0, 1); // January 1, 2026
  const maxDate = new Date(2027, 11, 31); // December 31, 2027

  return (
    <div className={cn("w-full max-w-lg mx-auto", className)}>
      {/* Date Picker Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-xl border border-gray-700/30 hover:border-[#D4A574]/50 text-white",
              !selectedRange.startDate && "text-gray-400"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-[#D4A574]" />
            {formatDateRange()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-gray-900/95 backdrop-blur-xl border-gray-700/50" align="start">
          <Calendar
            mode="range"
            defaultMonth={selectedRange.startDate || minDate}
            selected={calendarRange}
            onSelect={handleCalendarSelect}
            numberOfMonths={2}
            disabled={(date) => 
              isBefore(date, minDate) || 
              isAfter(date, maxDate) || 
              isDateBlocked(date)
            }
            modifiers={getDateModifiers()}
            modifiersStyles={{
              blocked: { 
                backgroundColor: "rgba(239, 68, 68, 0.2)",
                color: "rgb(239, 68, 68)",
                textDecoration: "line-through"
              }
            }}
            className="text-white"
          />
        </PopoverContent>
      </Popover>

      {/* Selection Summary */}
      {selectedRange.startDate && (
        <div className="mt-6 p-6 bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-xl rounded-xl border border-gray-700/30">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">Deine Auswahl</h3>
              <p className="text-gray-300">
                {formatDateRange()}
              </p>
            </div>

            {selectedRange.endDate && (
              <>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Tage:</span>
                  <span className="text-white font-medium">{calculateDays()} Tage</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Kosten:</span>
                  <span className="text-[#D4A574] font-semibold">€{calculateCost()}</span>
                </div>

                <div className="text-xs text-gray-500 text-center">
                  50€ pro Tag × {calculateDays()} Tage
                </div>

                {/* Validation Messages */}
                {calculateDays() > 0 && calculateDays() < MINIMUM_DAYS && (
                  <div className="text-sm text-amber-400 text-center bg-amber-400/10 p-2 rounded">
                    Mindestbuchung: 14 Tage (2 Wochen)
                  </div>
                )}

                {calculateDays() >= MINIMUM_DAYS && !isValidSelection() && (
                  <div className="text-sm text-red-400 text-center bg-red-400/10 p-2 rounded">
                    Der gewählte Zeitraum enthält bereits belegte Tage
                  </div>
                )}

                {isValidSelection() && (
                  <div className="text-sm text-green-400 text-center bg-green-400/10 p-2 rounded">
                    ✓ Gültige Auswahl - bereit zum Buchen!
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 text-xs text-gray-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#D4A574]/40 rounded-sm"></div>
            <span>Verfügbar</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500/40 rounded-sm"></div>
            <span>Belegt</span>
          </div>
        </div>
      </div>
    </div>
  );
}