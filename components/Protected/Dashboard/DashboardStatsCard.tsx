"use client";

import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp } from "lucide-react";
import React from "react";

interface DashboardStatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon | React.ElementType;
  iconColor: string;
  iconBgColor: string;
  percentage?: string;
  trend?: "up" | "down";
  subtitleText?: string;
  subtitleColor?: string;
}

export function DashboardStatsCard({
  title,
  value,
  icon: Icon,
  iconColor,
  iconBgColor,
  percentage,
  trend,
  subtitleText,
  subtitleColor = "text-[#22C55E]",
}: DashboardStatsCardProps) {
  return (
    <div className="bg-white px-5 py-5 rounded-xl flex items-start justify-between h-full border-none cursor-pointer transition-all hover:bg-gray-50 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] hover:shadow-lg">
      <div className="flex flex-col gap-1">
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        <div className="flex items-center gap-1 mt-2">
          {percentage && (
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-[#22C55E]" />
              <span className="text-[#22C55E] text-sm font-bold">{percentage}</span>
            </div>
          )}
          {subtitleText && (
            <span className={cn("text-sm text-foreground!", subtitleColor)}>
              {subtitleText}
            </span>
          )}
        </div>
      </div>
      <div 
        className="p-3 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: iconBgColor }}
      >
        <Icon className="w-8 h-8" style={{ color: iconColor }} />
      </div>
    </div>
  );
}
