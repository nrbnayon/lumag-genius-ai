"use client";

import DashboardHeader from "@/components/Shared/DashboardHeader";
import { DashboardStatsCard } from "./DashboardStatsCard";
import { 
  BarChart3, 
  CookingPot, 
  ChefHat, 
  Users 
} from "lucide-react";
import { RevenueCostTrendChart } from "./RevenueCostTrendChart";
import { FoodCostDistributionChart } from "./FoodCostDistributionChart";
import { TopBudgetRecipes } from "./TopBudgetRecipes";
import { RecentAlerts } from "./RecentAlerts";
import { dashboardStats } from "@/data/dashboardData";

export default function DashboardClient() {
  return (
    <div className="pb-10">
      <DashboardHeader 
        title="Dashboard Overview" 
        description="Monitor your F&B operations and financial performance in real-time" 
      />

      <main className="p-4 md:p-8 space-y-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardStatsCard
            title="Total Revenue"
            value={dashboardStats.totalRevenue.value}
            icon={BarChart3}
            iconColor="#22C55E"
            iconBgColor="#DCFCE7"
            percentage={dashboardStats.totalRevenue.percentage}
            subtitleText="Up from last month"
          />
          <DashboardStatsCard
            title="Food cost"
            value={dashboardStats.foodCost.value}
            icon={CookingPot}
            iconColor="#3B82F6"
            iconBgColor="#DBEAFE"
            percentage={dashboardStats.foodCost.percentage}
            subtitleText="Up from last month"
          />
          <DashboardStatsCard
            title="Active Recipes"
            value={dashboardStats.activeRecipes.value}
            icon={ChefHat}
            iconColor="#EF4444"
            iconBgColor="#FEE2E2"
            percentage={dashboardStats.activeRecipes.percentage}
            subtitleText="Up from last month"
          />
          <DashboardStatsCard
            title="Staff On duty"
            value={dashboardStats.staffOnDuty.value}
            icon={Users}
            iconColor="#F59E0B"
            iconBgColor="#FEF3C7"
            subtitleText={`${dashboardStats.staffOnDuty.onLeave} Staff on leave`}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueCostTrendChart />
          <FoodCostDistributionChart />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopBudgetRecipes />
          <RecentAlerts />
        </div>
      </main>
    </div>
  );
}