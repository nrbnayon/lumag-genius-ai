"use client";

import { Bell, Calendar, Info, PlaneIcon } from "lucide-react";
import { holidayNotifications } from "@/data/staffData";
import { cn } from "@/lib/utils";

interface HolidayNotificationsProps {
  onViewCalendar: () => void;
}

export function HolidayNotifications({
  onViewCalendar,
}: HolidayNotificationsProps) {
  const getNoticeStyles = (type: string) => {
    switch (type) {
      case "1 Week Notice":
        return "bg-[#FFE2E2] text-[#C10007] border-[#FFC9C9]";
      case "2 Week Notice":
        return "bg-[#F0B10033] text-[#CC6D00] border-[#FFD6A8]";
      case "3 Week Notice":
        return "bg-[#F47DFF33] text-[#8200DB] border-[#ECA3FE]";
      case "1 Month Notice":
        return "bg-[#B0DDFF] text-[#155DFC] border-[#77A1FF]";
      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  const getCardBg = (type: string) => {
    switch (type) {
      case "1 Week Notice":
        return "bg-[#FEF2F2]";
      case "2 Week Notice":
        return "bg-[#FFF7ED]";
      case "3 Week Notice":
        return "bg-[#FBEDFF]";
      case "1 Month Notice":
        return "bg-[#E6F4FF]";
      default:
        return "bg-white";
    }
  };

  return (
    <div className="space-y-4 shadow-[0px_4px_16px_0px_#A9A9A940] md:p-6 p-3 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF8904] to-[#FB2C36] flex items-center justify-center text-white shadow-sm border border-orange-100/50">
            <Bell className="w-5 h-5" />
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
          className="flex items-center gap-2 px-4 py-3 bg-white border border-border rounded-sm text-primary text-xs font-bold hover:bg-blue-50 transition-all cursor-pointer shadow-none active:scale-95"
        >
          <Calendar className="w-4 h-4" />
          View Full Calender
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {holidayNotifications.map((item) => (
          <div
            key={item.id}
            className={cn(
              "flex items-center justify-between p-5 rounded-lg border transition-all group",
              getCardBg(item.noticeType),
              item.noticeType === "1 Week Notice"
                ? "border-red-100"
                : item.noticeType === "2 Week Notice"
                  ? "border-amber-100"
                  : item.noticeType === "3 Week Notice"
                    ? "border-purple-100"
                    : "border-blue-100",
            )}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-red-500 shadow-none">
                <PlaneIcon className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-foreground">
                  {item.name}
                </h4>
                <p className="text-xs text-secondary font-medium lowercase tracking-wide">
                  {item.position}
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-400 font-bold">
                  <Calendar className="w-3 h-3" />
                  {item.date}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-bold shadow-none border-none",
                  getNoticeStyles(item.noticeType),
                )}
              >
                {item.noticeType}
              </div>
              <div className="w-5 h-5 rounded-full border border-gray-100 flex items-center justify-center shadow-xs">
                <Info className="w-3.5 h-3.5 text-red-500" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
