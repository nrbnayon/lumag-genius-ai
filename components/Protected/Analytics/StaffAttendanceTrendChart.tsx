"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { staffAttendanceTrendData } from "@/data/analyticsData";

export function StaffAttendanceTrendChart() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0px_4px_16px_0px_rgba(169,169,169,0.25)]">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-foreground">
          Staffs Weekly Attendance Trends
        </h3>
        <p className="text-sm text-secondary">Weekly performance overview</p>
      </div>
      <div className="h-[280px] w-full">
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={staffAttendanceTrendData}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="0"
                vertical={false}
                stroke="#EAECF0"
              />
              <XAxis
                dataKey="week"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#98A2B3", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#98A2B3", fontSize: 12 }}
                domain={[0, 35]}
                ticks={[0, 10, 20, 30]}
                width={35}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow:
                    "0px 4px 6px -2px rgba(0,0,0,0.05), 0px 10px 15px -3px rgba(0,0,0,0.1)",
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ paddingTop: "20px", fontSize: "12px" }}
              />
              <Line
                type="monotone"
                dataKey="present"
                name="Present"
                stroke="#22C55E"
                strokeWidth={2}
                dot={{ fill: "#22C55E", r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="absent"
                name="Absent"
                stroke="#F87171"
                strokeWidth={2}
                dot={{ fill: "#F87171", r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full bg-slate-50 animate-pulse rounded-lg" />
        )}
      </div>
    </div>
  );
}
