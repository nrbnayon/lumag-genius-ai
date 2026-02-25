"use client";

import { SquarePen, Eye, Trash2 } from "lucide-react";
import { Staff } from "@/types/staff";
import Image from "next/image";

interface StaffCardProps {
  staff: Staff;
  onEdit: (staff: Staff) => void;
  onView: (staff: Staff) => void;
  onDelete: (staff: Staff) => void;
}

export function StaffCard({ staff, onEdit, onView, onDelete }: StaffCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0px_4px_16px_0px_#A9A9A940] border-none group hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-gray-50">
            <Image
              src={staff.avatar || "https://i.pravatar.cc/150"}
              alt={staff.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground truncate max-w-[120px]">
              {staff.name}
            </h3>
            <p className="text-xs text-secondary font-medium">
              {staff.position}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(staff)}
            className="p-1.5 text-gray-400 hover:text-primary transition-colors cursor-pointer"
          >
            <SquarePen className="w-4 h-4" />
          </button>
          <button
            onClick={() => onView(staff)}
            className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(staff)}
            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-secondary font-medium">Shift</span>
          <span className="text-foreground font-bold">
            {staff.shift.split(" ")[0]}
          </span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-secondary font-medium">Email</span>
          <span className="text-foreground font-bold truncate max-w-[150px]">
            {staff.email}
          </span>
        </div>
      </div>
    </div>
  );
}
