"use client";

import DashboardHeader from "@/components/Shared/DashboardHeader";
import { DashboardStatsCard } from "./DashboardStatsCard";
import {
  BarChart3,
  ChefHat,
  Users,
  Salad,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { RevenueCostTrendChart } from "./RevenueCostTrendChart";
import { FoodCostDistributionChart } from "./FoodCostDistributionChart";
import { TopBudgetRecipes } from "./TopBudgetRecipes";
import { RecentAlerts } from "./RecentAlerts";
import { DashboardSkeleton } from "@/components/Skeleton/DashboardSkeleton";
import { useGetDashboardOverviewQuery } from "@/redux/services/dashboardApi";

export default function DashboardClient() {
  const { data: response, isLoading, isError } = useGetDashboardOverviewQuery();

  if (isLoading) return <DashboardSkeleton />;

  if (isError || !response?.data) {
    return (
      <div className="pb-10">
        <DashboardHeader
          title="Dashboard Overview"
          description="Monitor your F&B operations and financial performance in real-time"
        />
        <div className="flex items-center justify-center h-64">
          <p className="text-secondary text-sm">
            Failed to load dashboard data. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  const { summary_cards, revenue_cost_trend, food_cost_distribution, top_budget_recipes, recent_alerts } =
    response.data;

  const { total_revenue, food_cost, profit, active_recipes, staff_on_duty } = summary_cards;

  return (
    <div className="pb-10">
      <DashboardHeader
        title="Dashboard Overview"
        description="Monitor your F&B operations and financial performance in real-time"
      />

      <main className="p-4 md:p-8 space-y-8">
        {/* ── Stats Cards ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Revenue */}
          <DashboardStatsCard
            title={total_revenue.title}
            value={`$${total_revenue.value.toLocaleString()}`}
            icon={BarChart3}
            iconColor="#22C55E"
            iconBgColor="#DCFCE7"
            percentage={`${total_revenue.change_percent}%`}
            trend={total_revenue.trend === "increase" ? "up" : "down"}
            subtitleText={total_revenue.compare_text}
          />

          {/* Food Cost */}
          <DashboardStatsCard
            title={food_cost.title}
            value={`$${food_cost.value.toLocaleString()}`}
            icon={Salad}
            iconColor="#3B82F6"
            iconBgColor="#DBEAFE"
            percentage={`${food_cost.change_percent}%`}
            trend={food_cost.trend === "increase" ? "up" : "down"}
            subtitleText={food_cost.compare_text}
          />

          {/* Profit */}
          <DashboardStatsCard
            title={profit.title}
            value={`$${profit.value.toLocaleString()}`}
            icon={profit.trend === "increase" ? TrendingUp : TrendingDown}
            iconColor={profit.value >= 0 ? "#22C55E" : "#EF4444"}
            iconBgColor={profit.value >= 0 ? "#DCFCE7" : "#FEE2E2"}
            percentage={`${profit.change_percent}%`}
            trend={profit.trend === "increase" ? "up" : "down"}
            subtitleText={profit.compare_text}
          />

          {/* Active Recipes */}
          <DashboardStatsCard
            title={active_recipes.title}
            value={active_recipes.value}
            icon={ChefHat}
            iconColor="#EF4444"
            iconBgColor="#FEE2E2"
            percentage={`${active_recipes.change_percent}%`}
            trend={active_recipes.trend === "increase" ? "up" : "down"}
            subtitleText={active_recipes.compare_text}
          />

          {/* Staff On Duty */}
          <DashboardStatsCard
            title={staff_on_duty.title}
            value={staff_on_duty.value}
            icon={Users}
            iconColor="#F59E0B"
            iconBgColor="#FEF3C7"
            subtitleText={staff_on_duty.sub_text}
          />
        </div>

        {/* ── Charts ───────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueCostTrendChart data={revenue_cost_trend} />
          <FoodCostDistributionChart data={food_cost_distribution} />
        </div>

        {/* ── Bottom Section ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopBudgetRecipes data={top_budget_recipes} />
          <RecentAlerts data={recent_alerts} />
        </div>
      </main>
    </div>
  );
}