"use client";

import { Bell, Calendar, Info, PlaneIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetHolidayNotificationsQuery } from "@/redux/services/staffApi";

interface HolidayNotificationsProps {
  onViewCalendar: () => void;
}

export function HolidayNotifications({
  onViewCalendar,
}: HolidayNotificationsProps) {
  const { data, isLoading } = useGetHolidayNotificationsQuery();

  const getNoticeStyles = (theme: string) => {
    switch (theme) {
      case "red":
        return "bg-[#FFE2E2] text-[#C10007] border-[#FFC9C9]";
      case "amber":
      case "orange":
        return "bg-[#F0B10033] text-[#CC6D00] border-[#FFD6A8]";
      case "purple":
        return "bg-[#F47DFF33] text-[#8200DB] border-[#ECA3FE]";
      case "blue":
        return "bg-[#B0DDFF] text-[#155DFC] border-[#77A1FF]";
      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  const getCardBg = (theme: string) => {
    switch (theme) {
      case "red":
        return "bg-[#FEF2F2] border-red-100";
      case "amber":
      case "orange":
        return "bg-[#FFF7ED] border-amber-100";
      case "purple":
        return "bg-[#FBEDFF] border-purple-100";
      case "blue":
        return "bg-[#E6F4FF] border-blue-100";
      default:
        return "bg-white border-gray-100";
    }
  };

  const notifications = data?.data?.notifications || [];

  return (
    <div className="space-y-4 shadow-[0px_4px_16px_0px_#A9A9A940] md:p-6 p-3 rounded-lg relative min-h-[200px]">
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

      {isLoading ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-sm">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="p-8 text-center border border-dashed rounded-lg border-gray-200">
          <p className="text-sm text-secondary">No upcoming holidays scheduled.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {notifications.map((item) => (
            <div
              key={item.leave_request_id}
              className={cn(
                "flex items-center justify-between p-5 rounded-lg border transition-all group",
                getCardBg(item.theme)
              )}
            >
              <div className="flex items-start gap-4 max-w-[60%]">
                <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-red-500 shadow-none shrink-0">
                  <PlaneIcon className="w-4 h-4" />
                </div>
                <div className="space-y-1 overflow-hidden">
                  <h4 className="text-sm font-bold text-foreground truncate">
                    {item.employee_name}
                  </h4>
                  <p className="text-xs text-secondary font-medium capitalize tracking-wide truncate">
                    {item.employee_role}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-400 font-bold truncate">
                    <Calendar className="w-3 h-3 shrink-0" />
                    <span className="truncate">{item.date_display}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-bold shadow-none border-none whitespace-nowrap hidden sm:block",
                    getNoticeStyles(item.theme)
                  )}
                >
                  {item.notice_label}
                </div>
                <div className="w-5 h-5 rounded-full border border-gray-100 flex items-center justify-center shadow-xs bg-white shrink-0" title={item.reason}>
                  <Info className="w-3.5 h-3.5 text-red-500" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
