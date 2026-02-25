"use client";

import { weeklySchedule } from "@/data/staffData";

export function ScheduleOverview() {
  return (
    <div className="bg-white rounded-2xl shadow-[0px_4px_16px_0px_#A9A9A940] overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-xl font-bold text-foreground">
          Weekly Schedule Overview
        </h3>
      </div>
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full">
          <thead>
            <tr className="bg-blue-50/50">
              <th className="px-6 py-4 text-left text-xs font-bold text-secondary uppercase tracking-wider">
                Day
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-secondary uppercase tracking-wider">
                Morning Shift
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-secondary uppercase tracking-wider">
                Evening Shift
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-secondary uppercase tracking-wider">
                Night Shift
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-secondary uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {weeklySchedule.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-foreground">
                    {item.day}
                  </p>
                  <p className="text-xs font-medium text-secondary">
                    {item.date}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <span className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-sm font-bold text-primary">
                      {item.morning}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <span className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-sm font-bold text-primary">
                      {item.evening}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <span className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-sm font-bold text-primary">
                      {item.night}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center text-sm font-bold text-secondary">
                  24
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
