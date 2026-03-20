"use client";

import { SquarePen, Eye, Trash2, FileText } from "lucide-react";
import { StaffMember } from "@/types/staff";
import Image from "next/image";

interface StaffCardProps {
  staff: StaffMember;
  onEdit: (staff: StaffMember) => void;
  onView: (staff: StaffMember) => void;
  onDelete: (staff: StaffMember) => void;
  onGenerateReport: (staff: StaffMember) => void;
}

export function StaffCard({
  staff,
  onEdit,
  onView,
  onDelete,
  onGenerateReport,
}: StaffCardProps) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-[0px_4px_16px_0px_#A9A9A940] border-none group hover:shadow-sm transition-all duration-300">
      <div className="flex items-start justify-between mb-6 gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-10 h-10 shrink-0 rounded-full overflow-hidden border border-gray-100">
            <Image
              src={
                staff?.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(staff.full_name)}&background=random`
              }
              alt={staff.full_name}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-foreground truncate">
              {staff.full_name}
            </h3>
            <p className="text-xs text-secondary font-medium uppercase tracking-wider truncate">
              {staff.role_display}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onView(staff)}
            className="p-2 bg-[#FEF3C7] text-[#F59E0B] rounded-lg hover:bg-yellow-100 transition-colors cursor-pointer"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={() => onEdit(staff)}
            className="p-2 bg-[#E0F2FE] text-[#0EA5E9] rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
          >
            <SquarePen className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(staff)}
            className="p-2 bg-[#FEF2F2] text-[#EF4444] rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center text-xs">
          <span className="text-secondary font-medium">Shift</span>
          <span className="text-foreground font-bold">
            {staff.shift_display.split(" (")[0]}
          </span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-secondary font-medium">Email</span>
          <span
            className="text-foreground font-bold truncate max-w-[140px]"
            title={staff.email}
          >
            {staff.email}
          </span>
        </div>
      </div>

      <button
        onClick={() => onGenerateReport(staff)}
        className="w-full py-2.5 bg-blue-50 text-primary rounded-full font-bold flex items-center justify-center gap-2 hover:bg-blue-100 transition-all text-xs cursor-pointer shadow-none"
      >
        <FileText className="w-4 h-4" />
        Generate Report
      </button>
    </div>
  );
}
