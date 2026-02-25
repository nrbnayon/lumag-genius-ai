"use client";

import { X, FileText, Download } from "lucide-react";
import { Staff } from "@/types/staff";
import { cn } from "@/lib/utils";

interface StaffReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: Staff | null;
  onViewCV: () => void;
  onExport: () => void;
}

const WEEKLY_SCHEDULE = [
  {
    day: "Monday",
    date: "May 27",
    shift: "Morning (6:00 AM - 2:00 PM)",
    color: "bg-purple-50 text-purple-600",
  },
  {
    day: "Tuesday",
    date: "May 28",
    shift: "Morning (6:00 AM - 2:00 PM)",
    color: "bg-purple-50 text-purple-600",
  },
  {
    day: "Monday",
    date: "May 27",
    shift: "Morning (6:00 AM - 2:00 PM)",
    color: "bg-purple-50 text-purple-600",
  },
  {
    day: "Monday",
    date: "May 27",
    shift: "Morning (6:00 AM - 2:00 PM)",
    color: "bg-purple-50 text-purple-600",
  },
  {
    day: "Monday",
    date: "May 27",
    shift: "Morning (6:00 AM - 2:00 PM)",
    color: "bg-purple-50 text-purple-600",
  },
  {
    day: "Monday",
    date: "May 27",
    shift: "Morning (6:00 AM - 2:00 PM)",
    color: "bg-purple-50 text-purple-600",
  },
  {
    day: "Monday",
    date: "May 27",
    shift: "Morning (6:00 AM - 2:00 PM)",
    color: "bg-purple-50 text-purple-600",
  },
];

export function StaffReportModal({
  isOpen,
  onClose,
  staff,
  onViewCV,
  onExport,
}: StaffReportModalProps) {
  if (!isOpen || !staff) return null;

  const initials = staff.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 cursor-pointer z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="md:p-8 p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xl font-bold">
                {initials}
              </div>
              <div>
                <h2 className="md:text-2xl text-xl font-bold text-foreground">
                  {staff.name}'s Schedule
                </h2>
                <p className="md:text-sm text-xs font-medium text-secondary">
                  {staff.position}
                </p>
                <p className="md:text-sm text-xs font-medium text-secondary">
                  {staff.email}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onViewCV}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-primary text-xs font-bold rounded-sm hover:bg-blue-100 transition-colors cursor-pointer"
              >
                View CV
              </button>
              <a
                href={staff.cvUrl?.replace("/view", "/download") || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-500 text-xs font-bold rounded-sm hover:bg-blue-100 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download CV
              </a>
            </div>
          </div>

          <div className="bg-blue-50/50 rounded-xl p-4 md:mb-8 mb-6 border border-[#B0DDFF]">
            <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">
              Current Shift
            </p>
            <p className="text-base font-bold text-foreground">
              {staff.shift.split(" (")[0]} (
              {staff.shift.includes("Morning")
                ? "6:00 AM - 2:00 PM"
                : staff.shift.includes("Evening")
                  ? "2:00 PM - 10:00 PM"
                  : "10:00 PM - 6:00 AM"}
              )
            </p>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            <h3 className="text-base font-bold text-foreground">
              Weekly Schedule
            </h3>
            <div className="space-y-3">
              {WEEKLY_SCHEDULE.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border-b border-gray-50 pb-3"
                >
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      {item.day}
                    </p>
                    <p className="text-xs font-medium text-secondary">
                      {item.date}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "px-4 py-1.5 rounded-full text-xs font-bold",
                      item.color,
                    )}
                  >
                    {item.shift}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
