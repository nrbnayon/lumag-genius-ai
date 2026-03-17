import { SummaryCardBase, RevenueCostTrendPoint, TopBudgetRecipe } from "./dashboard";

export interface StaffAttendanceTrendPoint {
  week: string;
  start_date: string;
  end_date: string;
  present: number;
  absent: number;
}

export interface TopBudgetMenu {
  rank: number;
  id: number;
  name: string;
  menu_type: string;
  total_cost: number;
  change_percent: number;
  trend: "increase" | "decrease";
  outlet_type: string;
}

export interface MonthlyFinancialSummary {
  month: string;
  revenue: number;
  food_cost: number;
  profit: number;
  profit_margin: number;
}

export interface StaffPerformance {
  staff_id: string;
  staff_name: string;
  role: string;
  attendance_percent: number;
  leave_days: number;
  email: string;
}

export interface AnalyticsSummaryCards {
  total_revenue: SummaryCardBase;
  food_cost: SummaryCardBase;
  profit: SummaryCardBase;
}

export interface AnalyticsData {
  year: number;
  month: number;
  summary_cards: AnalyticsSummaryCards;
  revenue_cost_trend: RevenueCostTrendPoint[];
  top_budget_recipes: TopBudgetRecipe[];
  weekly_attendance_trends: StaffAttendanceTrendPoint[];
  top_budget_menus: TopBudgetMenu[];
  monthly_financial_summary: MonthlyFinancialSummary[];
  individual_staff_performance: StaffPerformance[];
}

export interface AnalyticsResponse {
  message: string;
  data: AnalyticsData;
}
