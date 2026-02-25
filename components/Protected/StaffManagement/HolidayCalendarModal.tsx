"use client";

import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface HolidayCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const CALENDAR_DAYS = [
  null,
  null,
  null,
  null,
  null,
  null,
  { day: 1, type: "none" },
  { day: 2, type: "none" },
  { day: 3, type: "none" },
  { day: 4, type: "none" },
  { day: 5, type: "none" },
  { day: 6, type: "none" },
  { day: 7, type: "none" },
  { day: 8, type: "none" },
  { day: 9, type: "none" },
  { day: 10, type: "none" },
  { day: 11, type: "none" },
  { day: 12, type: "none" },
  { day: 13, type: "none" },
  { day: 14, type: "today" },
  { day: 15, type: "none" },
  { day: 16, type: "none" },
  { day: 17, type: "none" },
  { day: 18, type: "none" },
  { day: 19, type: "none" },
  { day: 20, type: "leave", names: ["John", "David"], color: "bg-blue-500" },
  { day: 21, type: "leave", names: ["Maria"], color: "bg-blue-500" },
  { day: 22, type: "leave", names: ["Maria"], color: "bg-blue-500" },
  { day: 23, type: "leave", names: ["Maria"], color: "bg-blue-500" },
  { day: 24, type: "none" },
  { day: 25, type: "none" },
  { day: 26, type: "none" },
  { day: 27, type: "none" },
  { day: 28, type: "leave", names: ["David"], color: "bg-blue-500" },
];

export function HolidayCalendarModal({
  isOpen,
  onClose,
}: HolidayCalendarModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-primary p-6 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold">Team Holiday Calendar</h2>
              <p className="text-xs text-white/70">
                View all employee holidays and plan staffing
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

        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <button className="p-2 hover:bg-gray-50 rounded-lg border border-gray-100 transition-colors cursor-pointer">
              <ChevronLeft className="w-5 h-5 text-secondary" />
            </button>
            <div className="flex items-center gap-4">
              <h3 className="text-2xl font-black text-foreground">
                February 2026
              </h3>
              <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-lg uppercase tracking-wider">
                Today
              </span>
            </div>
            <button className="p-2 hover:bg-gray-50 rounded-lg border border-gray-100 transition-colors cursor-pointer">
              <ChevronRight className="w-5 h-5 text-secondary" />
            </button>
          </div>

          <div className="mb-8 flex flex-wrap gap-6 items-center">
            <span className="text-sm font-bold text-secondary uppercase tracking-tight">
              Holiday Types:
            </span>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500" />
              <span className="text-xs font-bold text-foreground">
                Annual Leave
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-500" />
              <span className="text-xs font-bold text-foreground">
                Sick Leave
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-purple-500" />
              <span className="text-xs font-bold text-foreground">
                Personal Day
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-500" />
              <span className="text-xs font-bold text-foreground">Others</span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-xl overflow-hidden border border-gray-100">
            {DAYS.map((day) => (
              <div
                key={day}
                className="bg-gray-50 p-4 text-center text-xs font-bold text-secondary uppercase tracking-wider"
              >
                {day}
              </div>
            ))}
            {CALENDAR_DAYS.map((item, idx) => (
              <div key={idx} className="bg-white min-h-[100px] p-2 relative">
                {item ? (
                  <>
                    <div
                      className={cn(
                        "text-sm font-bold",
                        item.type === "today"
                          ? "text-emerald-500 flex items-center justify-between"
                          : "text-foreground",
                      )}
                    >
                      {item.day}
                      {item.type === "today" && (
                        <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded">
                          Today
                        </span>
                      )}
                    </div>
                    {item.type === "leave" && item.names && (
                      <div className="mt-2 space-y-1">
                        {item.names.map((name, nIdx) => (
                          <div
                            key={nIdx}
                            className={cn(
                              "text-[10px] font-bold text-white px-2 py-1 rounded truncate",
                              item.color,
                            )}
                          >
                            {name}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : null}
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-12">
            <div>
              <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-1">
                Total Holidays This Month
              </p>
              <p className="text-3xl font-black text-foreground">3</p>
            </div>
            <div>
              <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-1">
                Employees Affected
              </p>
              <p className="text-3xl font-black text-emerald-500">3</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
