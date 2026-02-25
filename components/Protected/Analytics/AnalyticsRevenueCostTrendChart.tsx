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
import { revenueCostTrendData } from "@/data/analyticsData";

export function AnalyticsRevenueCostTrendChart() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0px_4px_16px_0px_rgba(169,169,169,0.25)]">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-foreground">
          Revenue &amp; Cost Trend
        </h3>
        <p className="text-sm text-secondary">Monthly performance overview</p>
      </div>
      <div className="h-[400px] w-full">
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={revenueCostTrendData}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="0"
                vertical={false}
                stroke="#EAECF0"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#98A2B3", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#98A2B3", fontSize: 11 }}
                domain={[0, 140000]}
                ticks={[0, 35000, 70000, 105000, 140000]}
                tickFormatter={(v) => (v === 0 ? "0" : `${v / 1000}k`)}
                width={45}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow:
                    "0px 4px 6px -2px rgba(0,0,0,0.05), 0px 10px 15px -3px rgba(0,0,0,0.1)",
                }}
                formatter={(value: number | string | undefined) => [
                  `$${Number(value ?? 0).toLocaleString()}`,
                ]}
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
                dataKey="cost"
                name="Food Cost"
                stroke="#F87171"
                strokeWidth={2}
                dot={{ fill: "#F87171", r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="profit"
                name="Profit"
                stroke="#22C55E"
                strokeWidth={2}
                dot={{ fill: "#22C55E", r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: "#3B82F6", r: 4, strokeWidth: 0 }}
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
