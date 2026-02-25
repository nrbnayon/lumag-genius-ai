"use client";

import { SquarePen, Eye, Trash2, FileText } from "lucide-react";
import { Staff } from "@/types/staff";
import Image from "next/image";

interface StaffCardProps {
  staff: Staff;
  onEdit: (staff: Staff) => void;
  onView: (staff: Staff) => void;
  onDelete: (staff: Staff) => void;
  onGenerateReport: (staff: Staff) => void;
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-100">
            <Image
              src={staff.avatar || "https://i.pravatar.cc/150"}
              alt={staff.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">{staff.name}</h3>
            <p className="text-xs text-secondary font-medium uppercase tracking-wider">
              {staff.position}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onView(staff)}
            className="p-1.5 text-secondary hover:text-blue-500 transition-colors cursor-pointer"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={() => onEdit(staff)}
            className="p-1.5 text-secondary hover:text-primary transition-colors cursor-pointer"
          >
            <SquarePen className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(staff)}
            className="p-1.5 text-red-400 hover:text-red-500 transition-colors cursor-pointer"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center text-xs">
          <span className="text-secondary font-medium">Shift</span>
          <span className="text-foreground font-bold">
            {staff.shift.split(" (")[0]}
          </span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-secondary font-medium">Email</span>
          <span className="text-foreground font-bold truncate max-w-[140px]">
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
