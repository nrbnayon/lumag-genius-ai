// Analytics Types

export interface AnalyticsStats {
  totalRevenue: {
    value: string;
    percentage: string;
    trend: "up" | "down";
  };
  foodCost: {
    value: string;
    percentage: string;
    trend: "up" | "down";
  };
  profit: {
    value: string;
    percentage: string;
    trend: "up" | "down";
  };
}

export interface RevenueCostTrendPoint {
  month: string;
  revenue: number;
  cost: number;
  profit: number;
}

export interface StaffAttendanceTrendPoint {
  week: string;
  absent: number;
  present: number;
}

export interface TopBudgetRecipe {
  id: number;
  name: string;
  amount: string;
}

export interface TopBudgetMenu {
  id: number;
  name: string;
  amount: string;
  change: string;
}

export interface MonthlyFinancialSummary {
  month: string;
  revenue: string;
  foodCost: string;
  profit: string;
  profitMargin: string;
}

export interface StaffPerformance {
  id: string;
  name: string;
  role: string;
  attendance: string;
  leaveDays: number;
}
