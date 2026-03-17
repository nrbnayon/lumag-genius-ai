// ─── Summary Cards ────────────────────────────────────────────────────────────

export interface SummaryCardBase {
  title: string;
  value: number;
  change_percent: number;
  trend: "increase" | "decrease";
  compare_text: string;
}

export interface StaffOnDutyCard {
  title: string;
  value: number;
  staff_on_leave: number;
  sub_text: string;
}

export interface SummaryCards {
  total_revenue: SummaryCardBase;
  food_cost: SummaryCardBase;
  profit: SummaryCardBase;
  active_recipes: SummaryCardBase;
  staff_on_duty: StaffOnDutyCard;
}

// ─── Revenue Cost Trend ───────────────────────────────────────────────────────

export interface RevenueCostTrendPoint {
  month: string;
  revenue: number;
  cost?: number;
  food_cost?: number;
  profit: number;
}

// ─── Food Cost Distribution ───────────────────────────────────────────────────

export interface FoodCostDistributionPoint {
  month: string;
  food_cost: number;
  growth_percent: number;
}

// ─── Top Budget Recipes ───────────────────────────────────────────────────────

export interface TopBudgetRecipe {
  rank: number;
  id: number;
  name: string;
  total_cost: number;
  selling_cost: number;
  profit: number;
  outlet_type: string;
}

// ─── Recent Alerts ────────────────────────────────────────────────────────────

export interface RecentAlert {
  type: string;
  reference_id: number;
  message: string;
  severity: "success" | "warning" | "error" | "info";
  status: string;
  time: string;
}

// ─── Full Dashboard Overview ──────────────────────────────────────────────────

export interface DashboardOverviewData {
  year: number;
  month: number;
  summary_cards: SummaryCards;
  revenue_cost_trend: RevenueCostTrendPoint[];
  food_cost_distribution: FoodCostDistributionPoint[];
  top_budget_recipes: TopBudgetRecipe[];
  recent_alerts: RecentAlert[];
}

export interface DashboardOverviewResponse {
  message: string;
  data: DashboardOverviewData;
}
