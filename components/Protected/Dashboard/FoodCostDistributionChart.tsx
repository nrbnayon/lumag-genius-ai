"use client";

import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { foodCostDistribution } from "@/data/dashboardData";

export function FoodCostDistributionChart() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0px_4px_16px_0px_rgba(169,169,169,0.25)] border-none">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground">Food Cost Distribution</h3>
        <p className="text-sm text-secondary">Per month Increasing rate</p>
      </div>
      <div className="h-[350px] w-full relative">
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={foodCostDistribution}
                cx="50%"
                cy="50%"
                innerRadius={0}
                outerRadius={120}
                paddingAngle={0}
                dataKey="value"
                stroke="white"
                strokeWidth={2}
                label={({ name, percentage, cx, cy, midAngle, innerRadius, outerRadius }: any) => {
                  const RADIAN = Math.PI / 180;
                  const radius = outerRadius + 30;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  return (
                    <text 
                      x={x} 
                      y={y} 
                      fill="#64748b" 
                      textAnchor={x > cx ? 'start' : 'end'} 
                      dominantBaseline="central"
                      fontSize={12}
                    >
                      {percentage}
                    </text>
                  );
                }}
              >
                {foodCostDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full bg-slate-50 animate-pulse rounded-lg" />
        )}
        
        {/* Custom Labels for center of segments */}
        {isMounted && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Pie chart labels are handled by the label prop in Pie component */}
          </div>
        )}
      </div>
    </div>
  );
}
