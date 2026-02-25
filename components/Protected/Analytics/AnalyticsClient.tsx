"use client";

import { useState, useEffect } from "react";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { DashboardStatsCard } from "@/components/Protected/Dashboard/DashboardStatsCard";
import { BarChart3, CookingPot, TrendingUp } from "lucide-react";
import { analyticsStats } from "@/data/analyticsData";
import { AnalyticsRevenueCostTrendChart } from "./AnalyticsRevenueCostTrendChart";
import { StaffAttendanceTrendChart } from "./StaffAttendanceTrendChart";
import { TopBudgetRecipesPanel } from "./TopBudgetRecipesPanel";
import { TopBudgetMenusPanel } from "./TopBudgetMenusPanel";
import { MonthlyFinancialSummaryTable } from "./MonthlyFinancialSummaryTable";
import { StaffPerformanceTable } from "./StaffPerformanceTable";
import { AnalyticsSkeleton } from "@/components/Skeleton/AnalyticsSkeleton";

export default function AnalyticsClient() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate async data fetch — swap this with a real fetch/SWR/ReactQuery call
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="pb-10">
      <DashboardHeader
        title="Analytics"
        description="Financial and operational insights for data-driven decisions"
      />

      {isLoading ? (
        <AnalyticsSkeleton />
      ) : (
        <main className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
          {/* Stats Cards — 3 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <DashboardStatsCard
              title="Total Revenue"
              value={analyticsStats.totalRevenue.value}
              icon={BarChart3}
              iconColor="#22C55E"
              iconBgColor="#DCFCE7"
              percentage={analyticsStats.totalRevenue.percentage}
              subtitleText="Up from last month"
            />
            <DashboardStatsCard
              title="Food cost"
              value={analyticsStats.foodCost.value}
              icon={CookingPot}
              iconColor="#3B82F6"
              iconBgColor="#DBEAFE"
              percentage={analyticsStats.foodCost.percentage}
              subtitleText="Up from last month"
            />
            <DashboardStatsCard
              title="Profit"
              value={analyticsStats.profit.value}
              icon={TrendingUp}
              iconColor="#22C55E"
              iconBgColor="#DCFCE7"
              percentage={analyticsStats.profit.percentage}
              subtitleText="Up from last month"
            />
          </div>

          {/* Revenue & Cost Trend  +  Top Budget Recipes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnalyticsRevenueCostTrendChart />
            <TopBudgetRecipesPanel />
          </div>

          {/* Staff Attendance Trend  +  Top Budget Menus */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StaffAttendanceTrendChart />
            <TopBudgetMenusPanel />
          </div>

          {/* Monthly Financial Summary */}
          <MonthlyFinancialSummaryTable />

          {/* Individual Staff Performance */}
          <StaffPerformanceTable />
        </main>
      )}
    </div>
  );
}
