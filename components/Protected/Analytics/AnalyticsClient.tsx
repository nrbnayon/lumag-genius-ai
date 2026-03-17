"use client";

import DashboardHeader from "@/components/Shared/DashboardHeader";
import { DashboardStatsCard } from "@/components/Protected/Dashboard/DashboardStatsCard";
import { BarChart3, Salad, TrendingUp, TrendingDown } from "lucide-react";
import { AnalyticsRevenueCostTrendChart } from "./AnalyticsRevenueCostTrendChart";
import { StaffAttendanceTrendChart } from "./StaffAttendanceTrendChart";
import { TopBudgetRecipesPanel } from "./TopBudgetRecipesPanel";
import { TopBudgetMenusPanel } from "./TopBudgetMenusPanel";
import { MonthlyFinancialSummaryTable } from "./MonthlyFinancialSummaryTable";
import { StaffPerformanceTable } from "./StaffPerformanceTable";
import { AnalyticsSkeleton } from "@/components/Skeleton/AnalyticsSkeleton";
import { useGetAnalyticsOverviewQuery } from "@/redux/services/analyticsApi";

export default function AnalyticsClient() {
  const { data: response, isLoading, isError } = useGetAnalyticsOverviewQuery();

  if (isLoading) return <AnalyticsSkeleton />;

  if (isError || !response?.data) {
    return (
      <div className="pb-10">
        <DashboardHeader
          title="Analytics"
          description="Financial and operational insights for data-driven decisions"
        />
        <div className="flex items-center justify-center h-64">
          <p className="text-secondary text-sm">
            Failed to load analytics data. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  const {
    summary_cards,
    revenue_cost_trend,
    top_budget_recipes,
    weekly_attendance_trends,
    top_budget_menus,
    monthly_financial_summary,
    individual_staff_performance,
  } = response.data;

  const { total_revenue, food_cost, profit } = summary_cards;

  return (
    <div className="pb-10">
      <DashboardHeader
        title="Analytics"
        description="Financial and operational insights for data-driven decisions"
      />

      <main className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
        {/* Stats Cards — 3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <DashboardStatsCard
            title={total_revenue.title || "Total Revenue"}
            value={`$${total_revenue.value.toLocaleString()}`}
            icon={BarChart3}
            iconColor="#22C55E"
            iconBgColor="#DCFCE7"
            percentage={`${total_revenue.change_percent}%`}
            trend={total_revenue.trend === "increase" ? "up" : "down"}
            subtitleText={total_revenue.compare_text}
          />
          <DashboardStatsCard
            title={food_cost.title || "Food cost"}
            value={`$${food_cost.value.toLocaleString()}`}
            icon={Salad}
            iconColor="#3B82F6"
            iconBgColor="#DBEAFE"
            percentage={`${food_cost.change_percent}%`}
            trend={food_cost.trend === "increase" ? "up" : "down"}
            subtitleText={food_cost.compare_text}
          />
          <DashboardStatsCard
            title={profit.title || "Profit"}
            value={`$${profit.value.toLocaleString()}`}
            icon={profit.trend === "increase" ? TrendingUp : TrendingDown}
            iconColor={profit.value >= 0 ? "#22C55E" : "#EF4444"}
            iconBgColor={profit.value >= 0 ? "#DCFCE7" : "#FEE2E2"}
            percentage={`${profit.change_percent}%`}
            trend={profit.trend === "increase" ? "up" : "down"}
            subtitleText={profit.compare_text}
          />
        </div>

        {/* Revenue & Cost Trend  +  Top Budget Recipes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnalyticsRevenueCostTrendChart data={revenue_cost_trend} />
          <TopBudgetRecipesPanel data={top_budget_recipes} />
        </div>

        {/* Staff Attendance Trend  +  Top Budget Menus */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StaffAttendanceTrendChart data={weekly_attendance_trends} />
          <TopBudgetMenusPanel data={top_budget_menus} />
        </div>

        {/* Monthly Financial Summary */}
        <MonthlyFinancialSummaryTable data={monthly_financial_summary} />

        {/* Individual Staff Performance */}
        <StaffPerformanceTable data={individual_staff_performance} />
      </main>
    </div>
  );
}
