"use client";

import { useState, useMemo } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HolidayCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock holiday data with real dates
const HOLIDAYS = [
  {
    id: "1",
    employeeName: "John Smith",
    date: "2026-02-20",
    type: "Annual",
    color: "bg-blue-500",
  },
  {
    id: "2",
    employeeName: "David Wilson",
    date: "2026-02-20",
    type: "Annual",
    color: "bg-blue-500",
  },
  {
    id: "3",
    employeeName: "Maria Garcia",
    date: "2026-02-21",
    type: "Sick",
    color: "bg-red-500",
  },
  {
    id: "4",
    employeeName: "Maria Garcia",
    date: "2026-02-22",
    type: "Sick",
    color: "bg-red-500",
  },
  {
    id: "5",
    employeeName: "Maria Garcia",
    date: "2026-02-23",
    type: "Sick",
    color: "bg-red-500",
  },
  {
    id: "6",
    employeeName: "David Wilson",
    date: "2026-02-28",
    type: "Personal",
    color: "bg-purple-500",
  },
  {
    id: "7",
    employeeName: "Sarah Connor",
    date: "2026-03-05",
    type: "Annual",
    color: "bg-blue-500",
  },
  {
    id: "8",
    employeeName: "John Doe",
    date: "2026-03-05",
    type: "Others",
    color: "bg-emerald-500",
  },
];

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function HolidayCalendarModal({
  isOpen,
  onClose,
}: HolidayCalendarModalProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1)); // Default to Feb 2026 as per design

  const viewMonth = currentDate.getMonth();
  const viewYear = currentDate.getFullYear();

  // Calendar Logic
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
    const lastDayOfMonth = new Date(viewYear, viewMonth + 1, 0);

    // JS: 0=Sun, 1=Mon... -> Adjust to: 0=Mon, 6=Sun
    const startDay = (firstDayOfMonth.getDay() + 6) % 7;
    const daysInMonth = lastDayOfMonth.getDate();

    const days: ({
      date: number;
      fullDate: string;
      isToday: boolean;
    } | null)[] = [];

    // Empty slots for start of month
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(viewYear, viewMonth, d);
      const fullDate = dateObj.toISOString().split("T")[0];
      days.push({
        date: d,
        fullDate,
        isToday: fullDate === todayStr,
      });
    }

    return days;
  }, [viewMonth, viewYear]);

  const monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
    currentDate,
  );

  const prevMonth = () => {
    setCurrentDate(new Date(viewYear, viewMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(viewYear, viewMonth + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Stats
  const currentMonthHolidays = HOLIDAYS.filter((h) => {
    const d = new Date(h.date);
    return d.getMonth() === viewMonth && d.getFullYear() === viewYear;
  });

  const uniqueEmployees = new Set(
    currentMonthHolidays.map((h) => h.employeeName),
  ).size;

  if (!isOpen) return null;

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

        <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
          {/* Navigation */}

          <div className="flex items-center justify-between gap-4 mb-5">
              <button
                onClick={prevMonth}
                className="p-3 hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors cursor-pointer shadow-sm active:scale-95 text-secondary"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-4 bg-gray-50/50 px-6 py-2 rounded-2xl border border-gray-100">
                <h3 className="text-2xl font-black text-foreground">
                  {monthName} {viewYear}
                </h3>
                <button
                  onClick={goToToday}
                  className="px-4 py-1.5 bg-emerald-500 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-md hover:bg-emerald-600 transition-all active:scale-95 cursor-pointer"
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
          <div className="mb-8 p-4 bg-gray-50/30 rounded-2xl border border-gray-100/50 flex flex-wrap gap-8 items-center">
            <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">
              Holiday Types:
            </span>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm" />
              <span className="text-xs font-bold text-foreground">
                Annual Leave
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm" />
              <span className="text-xs font-bold text-foreground">
                Sick Leave
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500 shadow-sm" />
              <span className="text-xs font-bold text-foreground">
                Personal Day
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" />
              <span className="text-xs font-bold text-foreground">Others</span>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="bg-white p-4 text-center text-[10px] font-black text-secondary uppercase tracking-widest border-b border-gray-50"
              >
                {day}
              </div>
            ))}
            {calendarDays.map((target, idx) => (
              <div
                key={idx}
                className={cn(
                  "bg-white min-h-[110px] p-3 relative group transition-colors",
                  target && "hover:bg-blue-50/10",
                )}
              >
                {target ? (
                  <>
                    <div
                      className={cn(
                        "text-xs font-black mb-2",
                        target.isToday
                          ? "w-7 h-7 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-md animate-pulse"
                          : "text-foreground group-hover:text-primary transition-colors",
                      )}
                    >
                      {target.date}
                    </div>

                    <div className="space-y-1 max-h-[70px] overflow-y-auto no-scrollbar">
                      {HOLIDAYS.filter((h) => h.date === target.fullDate).map(
                        (holiday) => (
                          <div
                            key={holiday.id}
                            className={cn(
                              "text-[10px] font-bold text-white px-2.5 py-1.5 rounded-lg truncate shadow-sm hover:scale-[1.02] transition-transform",
                              holiday.color,
                            )}
                            title={`${holiday.employeeName} - ${holiday.type}`}
                          >
                            {holiday.employeeName}
                          </div>
                        ),
                      )}
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gray-50/50" />
                )}
              </div>
            ))}
          </div>

          {/* Footer Stats */}
          <div className="mt-8 flex gap-12 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div>
              <p className="text-[10px] font-black text-secondary uppercase tracking-wider mb-2">
                Total Holidays This Month
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-foreground leading-none">
                  {currentMonthHolidays.length}
                </span>
                <span className="text-sm font-bold text-secondary">
                  Days booked
                </span>
              </div>
            </div>
            <div className="w-px bg-gray-100" />
            <div>
              <p className="text-[10px] font-black text-secondary uppercase tracking-wider mb-2">
                Employees Affected
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-emerald-500 leading-none">
                  {uniqueEmployees}
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
