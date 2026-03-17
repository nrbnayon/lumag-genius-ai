"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { FoodCostDistributionPoint } from "@/types/dashboard";

interface FoodCostDistributionChartProps {
  data: FoodCostDistributionPoint[];
}

// A curated reddish palette for bars
const BAR_COLORS = ["#D12121", "#F05252", "#F87171", "#FCA5A5", "#FEE2E2"];

export function FoodCostDistributionChart({ data }: FoodCostDistributionChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0px_4px_16px_0px_rgba(169,169,169,0.25)] border-none">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground">Food Cost Distribution</h3>
        <p className="text-sm text-secondary">Per month increasing rate</p>
      </div>
      <div className="h-[350px] w-full">
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              barSize={40}
            >
              <CartesianGrid strokeDasharray="0" vertical={false} stroke="#EAECF0" />
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
                tick={{ fill: "#98A2B3", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow:
                    "0px 4px 6px -2px rgba(0,0,0,0.05), 0px 10px 15px -3px rgba(0,0,0,0.1)",
                }}
                formatter={(value: any, name: any) => {
                  if (name === "food_cost") return [`$${Number(value).toLocaleString()}`, "Food Cost"];
                  if (name === "growth_percent") return [`${value}%`, "Growth"];
                  return [value, name];
                }}
              />
              <Bar dataKey="food_cost" name="Food Cost" radius={[6, 6, 0, 0]}>
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={BAR_COLORS[index % BAR_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full bg-slate-50 animate-pulse rounded-lg" />
        )}
      </div>

      {/* Growth % legend */}
      {isMounted && data.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {data.map((item, index) => (
            <div key={item.month} className="flex items-center gap-1.5 text-xs text-secondary">
              <span
                className="inline-block w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: BAR_COLORS[index % BAR_COLORS.length] }}
              />
              <span className="font-medium text-foreground">{item.month}</span>
              <span>+{item.growth_percent}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
