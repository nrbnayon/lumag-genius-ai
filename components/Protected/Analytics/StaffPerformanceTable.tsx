import { staffPerformanceData } from "@/data/analyticsData";
import type { StaffPerformance } from "@/types/analytics";

const HEADER_COLS = ["Staff Name", "Role", "Attendance", "Leave days"];

export function StaffPerformanceTable() {
  return (
    <div className="bg-white rounded-2xl shadow-[0px_4px_16px_0px_rgba(169,169,169,0.25)] overflow-hidden">
      <div className="p-6 pb-4">
        <h3 className="text-lg font-bold text-foreground">
          Individual Staff Performance
        </h3>
        <p className="text-sm text-secondary">View the summary</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#EBF5FF]">
              {HEADER_COLS.map((col) => (
                <th
                  key={col}
                  className="px-6 py-4 text-left text-sm font-semibold text-[#3B82F6] whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {staffPerformanceData.map((staff: StaffPerformance) => (
              <tr
                key={staff.id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-foreground">
                  {staff.name}
                </td>
                <td className="px-6 py-4 text-secondary">{staff.role}</td>
                <td className="px-6 py-4 text-secondary">{staff.attendance}</td>
                <td className="px-6 py-4 text-secondary">{staff.leaveDays}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
