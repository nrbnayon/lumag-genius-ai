"use client";

import { Calendar, Info } from "lucide-react";
import { holidayNotifications } from "@/data/staffData";
import { cn } from "@/lib/utils";

interface HolidayNotificationsProps {
  onViewCalendar: () => void;
}

export function HolidayNotifications({
  onViewCalendar,
}: HolidayNotificationsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
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
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              Holiday Notifications
            </h3>
            <p className="text-xs text-secondary font-medium">
              Upcoming holidays to prepare for
            </p>
          </div>
        </div>
        <button
          onClick={onViewCalendar}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-100 rounded-lg text-primary text-xs font-bold hover:bg-blue-50 transition-all cursor-pointer shadow-sm"
        >
          <Calendar className="w-4 h-4" />
          View Full Calender
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {holidayNotifications.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-600">
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
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-foreground">
                  {item.name}
                </h4>
                <p className="text-xs text-secondary font-medium">
                  {item.position}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-secondary font-bold">
                  <Calendar className="w-3 h-3" />
                  {item.date}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-bold shadow-sm",
                  item.color,
                )}
              >
                {item.noticeType}
              </div>
              <Info className="w-4 h-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
