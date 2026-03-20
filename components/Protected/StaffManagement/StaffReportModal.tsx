"use client";

import { useState, useEffect } from "react";
import { X, FileText, Download } from "lucide-react";
import { StaffMember } from "@/types/staff";
import { cn } from "@/lib/utils";
import { useUpdateStaffMutation } from "@/redux/services/staffApi";
import { toast } from "sonner";
import Image from "next/image";

interface StaffReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffMember | null;
  onViewCV: () => void;
  onExport: () => void;
}

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const SHIFTS = [
  { label: "Morning (6:00 AM - 2:00 PM)", value: "MORNING", color: "bg-purple-50 text-purple-600" },
  { label: "Evening (2:00 PM - 10:00 PM)", value: "EVENING", color: "bg-orange-50 text-orange-600" },
  { label: "Night (10:00 PM - 6:00 AM)", value: "NIGHT", color: "bg-blue-50 text-blue-600" },
  { label: "Off Day", value: "OFF", color: "bg-gray-100 text-gray-600" },
];

export function StaffReportModal({
  isOpen,
  onClose,
  staff,
}: StaffReportModalProps) {
  const [updateStaff, { isLoading: isUpdating }] = useUpdateStaffMutation();
  const [schedule, setSchedule] = useState<Record<string, string>>({});
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    if (staff) {
      if (staff.weekly_schedule && Object.keys(staff.weekly_schedule).length > 0) {
        setSchedule(staff.weekly_schedule);
      } else {
        // Fallback to their main shift
        const fallbackSchedule: Record<string, string> = {};
        DAYS_OF_WEEK.forEach(day => fallbackSchedule[day] = staff.shift || "MORNING");
        setSchedule(fallbackSchedule);
      }
    }
  }, [staff]);

  if (!isOpen || !staff) return null;

  const handleScheduleChange = async (day: string, newShift: string) => {
    const updatedSchedule = { ...schedule, [day]: newShift };
    setSchedule(updatedSchedule); // Optimistic update
    
    try {
      await updateStaff({
        id: staff.id,
        payload: {
          weekly_schedule: updatedSchedule,
          position: staff.role
        }
      }).unwrap();
      toast.success(`${day} schedule updated successfully`);
    } catch (error) {
      toast.error("Failed to update schedule");
      // Revert on error
      setSchedule(schedule);
    }
  };

  const getShiftColor = (shiftValue: string) => {
    return SHIFTS.find(s => s.value === shiftValue)?.color || "bg-gray-100 text-gray-600";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 cursor-pointer z-10 bg-white rounded-full shadow-sm"
        >
          <X className="w-5 h-5 text-red-600" />
        </button>

        <div className="md:p-8 p-4 overflow-y-auto custom-scrollbar">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 shrink-0 rounded-full overflow-hidden border border-gray-100">
                <Image
                  src={
                    staff?.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      staff.full_name
                    )}&background=random&size=256`
                  }
                  alt={staff.full_name}
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                  priority
                  quality={100}
                />
              </div>
              <div>
                <h2 className="md:text-2xl text-xl font-bold text-foreground overflow-hidden text-ellipsis line-clamp-1">
                  {staff.full_name}'s Schedule
                </h2>
                <p className="md:text-sm text-xs font-medium text-secondary">
                  {staff.role_display}
                </p>
                <p className="md:text-sm text-xs font-medium text-secondary">
                  {staff.email}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
              {staff.resume_cv_url ? (
                <>
                  <button
                    onClick={() => setIsPreviewOpen(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 text-xs font-bold rounded-xl hover:bg-purple-100 transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    View CV
                  </button>
                  <a
                    href={staff.resume_cv_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 text-xs font-bold rounded-xl hover:bg-blue-100 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Download CV
                  </a>
                </>
              ) : (
                <button
                  disabled
                  title="No CV uploaded"
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 text-gray-400 text-xs font-bold rounded-xl cursor-not-allowed opacity-80"
                >
                  <FileText className="w-4 h-4" />
                  No CV Available
                </button>
              )}
            </div>
          </div>

          <div className="bg-blue-50/50 rounded-xl p-4 md:mb-8 mb-6 border border-[#B0DDFF]">
            <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">
              Primary Shift
            </p>
            <p className="text-base font-bold text-foreground">
              {staff.shift_display.split(" (")[0]} (
              {staff.shift_display.includes("Morning")
                ? "7:00 AM - 3:00 PM"
                : staff.shift_display.includes("Evening")
                  ? "3:00 PM - 11:00 PM"
                  : staff.shift_display.includes("Night") ? "11:00 PM - 7:00 AM" : "Off"}
              )
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-3 border-b border-red-100 pb-3">
              Weekly Schedule 
              {isUpdating && <span className="text-[10px] uppercase font-bold text-blue-600 animate-pulse bg-blue-100 px-3 py-1 rounded-full">Saving...</span>}
            </h3>
            <div className="space-y-3">
              {DAYS_OF_WEEK.map((day, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border-b border-gray-50 pb-3"
                >
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      {day}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 relative">
                    <select
                      value={schedule[day] || "OFF"}
                      onChange={(e) => handleScheduleChange(day, e.target.value)}
                      disabled={isUpdating}
                      className={cn(
                        "text-xs font-bold rounded-xl border border-transparent px-4 py-2.5 outline-none cursor-pointer appearance-none text-center pr-8 min-w-[140px] hover:border-gray-200 transition-colors focus:ring-2 focus:ring-primary/20",
                        getShiftColor(schedule[day] || "OFF"),
                        isUpdating && "opacity-50 cursor-wait pointer-events-none"
                      )}
                    >
                      {SHIFTS.map(shift => (
                        <option key={shift.value} value={shift.value} className="bg-white text-gray-800 text-left py-2">
                          {shift.label}
                        </option>
                      ))}
                    </select>
                    {/* Custom dropdown arrow */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-current opacity-60">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isPreviewOpen && staff?.resume_cv_url && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl h-[85vh] bg-white rounded-2xl flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="text-xl font-bold">CV Preview</h3>
                <p className="text-xs text-gray-500">{staff.full_name}</p>
              </div>
              <button 
                onClick={() => setIsPreviewOpen(false)}
                className="p-2 bg-gray-100 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-700 hover:text-red-500" />
              </button>
            </div>
            <div className="flex-1 w-full bg-gray-100 overflow-hidden rounded-b-2xl">
              <iframe 
                src={staff.resume_cv_url} 
                className="w-full h-full border-none" 
                title={`${staff.full_name} CV`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
