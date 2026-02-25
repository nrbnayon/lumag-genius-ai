"use client";

import { X, Download } from "lucide-react";
import { Staff } from "@/types/staff";

interface EmployeeReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: Staff | null;
  onDownload: (staff: Staff) => void;
}

export function EmployeeReportModal({
  isOpen,
  onClose,
  staff,
  onDownload,
}: EmployeeReportModalProps) {
  if (!isOpen || !staff) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 flex items-center justify-between border-b border-gray-100">
          <h2 className="text-xl font-bold text-foreground">Employee Report</h2>
          <button
            onClick={onClose}
            className="p-2 text-red-500 hover:text-red-600 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8">
          <div className="overflow-x-auto no-scrollbar mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-4 py-4 text-center text-sm font-bold text-secondary uppercase tracking-tight">
                    Stuff Name
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-bold text-secondary uppercase tracking-tight border-l border-gray-100">
                    Position
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-bold text-secondary uppercase tracking-tight border-l border-gray-100">
                    Present
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-bold text-secondary uppercase tracking-tight border-l border-gray-100">
                    Day off
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-bold text-secondary uppercase tracking-tight border-l border-gray-100">
                    Shift
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-bold text-secondary uppercase tracking-tight border-l border-gray-100">
                    Phone
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-bold text-secondary uppercase tracking-tight border-l border-gray-100">
                    Email
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-6 text-center text-sm font-medium text-foreground">
                    {staff.name}
                  </td>
                  <td className="px-4 py-6 text-center text-sm font-medium text-foreground border-l border-gray-100">
                    {staff.position}
                  </td>
                  <td className="px-4 py-6 text-center text-sm font-medium text-foreground border-l border-gray-100">
                    {staff.presentDays || 0}
                  </td>
                  <td className="px-4 py-6 text-center text-sm font-medium text-foreground border-l border-gray-100">
                    {staff.offDays || 0}
                  </td>
                  <td className="px-4 py-6 text-center text-sm font-medium text-foreground border-l border-gray-100">
                    {staff.shift.split(" (Morning")[0]}
                  </td>
                  <td className="px-4 py-6 text-center text-sm font-medium text-foreground border-l border-gray-100">
                    {staff.phone}
                  </td>
                  <td className="px-4 py-6 text-center text-sm font-medium text-foreground border-l border-gray-100">
                    {staff.email}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <button
            onClick={() => onDownload(staff)}
            className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-[0px_8px_20px_-6px_rgba(59,130,246,0.5)] active:scale-[0.98] cursor-pointer group"
          >
            <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
            Download Excel Report
          </button>
        </div>
      </div>
    </div>
  );
}
