"use client";

import { useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetTeamHolidayCalendarQuery } from "@/redux/services/staffApi";

interface HolidayCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function HolidayCalendarModal({
  isOpen,
  onClose,
}: HolidayCalendarModalProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const viewMonthStr = String(currentDate.getMonth() + 1).padStart(2, "0"); // 1-12
  const viewYearStr = String(currentDate.getFullYear()); // 2026

  const { data, isLoading } = useGetTeamHolidayCalendarQuery(
    {
      year: parseInt(viewYearStr),
      month: parseInt(viewMonthStr),
    },
    { skip: !isOpen }
  );

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  if (!isOpen) return null;

  const calendarData = data?.data;
  const monthName = calendarData?.month_name || currentDate.toLocaleString('default', { month: 'long' });
  const viewYear = calendarData?.year || currentDate.getFullYear();
  const days = calendarData?.days || [];
  const holidayTypes = calendarData?.holiday_types || [];
  const summary = calendarData?.summary;

  // Add empty slots for the beginning of the month
  const firstDayObj = days.length > 0 ? new Date(days[0].date) : new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const startDay = (firstDayObj.getDay() + 6) % 7; // Convert to Mon(0)-Sun(6)
  const emptyDays = Array.from({ length: startDay }, () => null);

  const getCssColor = (color: string) => {
    const colorMap: Record<string, string> = {
      purple: "bg-purple-500",
      red: "bg-red-500",
      blue: "bg-blue-500",
      pink: "bg-pink-500",
      cyan: "bg-cyan-500",
      gray: "bg-gray-500",
      orange: "bg-orange-500",
      emerald: "bg-emerald-500",
      green: "bg-green-500",
    };
    return colorMap[color] || "bg-gray-500";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col">
        {/* Header */}
        <div className="bg-primary p-5 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Team Holiday Calendar</h2>
              <p className="text-xs text-white/90">
                View employee holidays and plan staffing dynamics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto custom-scrollbar flex-1 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center backdrop-blur-sm">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4 mb-5">
            <button
              onClick={prevMonth}
              className="p-3 hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors cursor-pointer shadow-sm active:scale-95 text-secondary"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4 bg-gray-50/50 px-6 py-2 rounded-2xl border border-gray-100">
              <h3 className="text-2xl font-black text-foreground w-[200px] text-center">
                {monthName} {viewYear}
              </h3>
              <button
                onClick={goToToday}
                className="px-4 py-1.5 bg-emerald-500 text-white text-xs font-black rounded-full uppercase tracking-widest shadow-md hover:bg-emerald-600 transition-all active:scale-95 cursor-pointer"
              >
                Today
              </button>
            </div>
            <button
              onClick={nextMonth}
              className="p-3 hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors cursor-pointer shadow-sm active:scale-95 text-secondary"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Legend */}
          <div className="mb-8 p-4 bg-gray-50/30 rounded-2xl border border-gray-100/50 flex flex-wrap gap-6 items-center">
            <span className="text-xs font-black text-secondary uppercase tracking-[0.2em]">
              Holiday Types:
            </span>
            {holidayTypes.map((type) => (
              <div key={type.key} className="flex items-center gap-2">
                <div
                  className={cn("w-3 h-3 rounded-full shadow-sm", getCssColor(type.color))}
                />
                <span className="text-xs font-bold text-foreground">
                  {type.label}
                </span>
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="bg-white p-4 text-center text-xs font-black text-secondary uppercase tracking-widest border-b border-gray-50"
              >
                {day}
              </div>
            ))}
            
            {emptyDays.map((_, idx) => (
              <div key={`empty-${idx}`} className="bg-white min-h-[110px] p-3 relative group transition-colors">
                <div className="absolute inset-0 bg-gray-50/50" />
              </div>
            ))}

            {days.map((target) => (
              <div
                key={target.date}
                className={cn(
                  "bg-white min-h-[110px] p-3 relative group transition-colors",
                  "hover:bg-blue-50/10"
                )}
              >
                <div
                  className={cn(
                    "text-xs font-black mb-2",
                    target.is_today
                      ? "w-7 h-7 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-md animate-pulse"
                      : "text-foreground group-hover:text-primary transition-colors",
                  )}
                >
                  {target.day}
                </div>

                <div className="space-y-1 max-h-[70px] overflow-y-auto no-scrollbar">
                  {target.events.map((holiday) => (
                    <div
                      key={holiday.leave_request_id}
                      className={cn(
                        "text-xs font-bold text-white px-2.5 py-1.5 rounded-lg truncate shadow-sm hover:scale-[1.02] transition-transform",
                        getCssColor(holiday.color)
                      )}
                      title={`${holiday.employee_name} - ${holiday.leave_type_label}`}
                    >
                      {holiday.employee_name}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Stats */}
          <div className="mt-8 flex gap-12 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div>
              <p className="text-xs font-black text-secondary uppercase tracking-wider mb-2">
                Total Holidays This Month
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-foreground leading-none">
                  {summary?.total_holidays_this_month || 0}
                </span>
                <span className="text-sm font-bold text-secondary">
                  Days booked
                </span>
              </div>
            </div>
            <div className="w-px bg-gray-100" />
            <div>
              <p className="text-xs font-black text-secondary uppercase tracking-wider mb-2">
                Employees Affected
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-emerald-500 leading-none">
                  {summary?.employees_affected || 0}
                </span>
                <span className="text-sm font-bold text-secondary">
                  Personnel
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
