import { DashboardStats, ChartDataPoint, FoodCostDistribution, TopRecipe, Alert } from "@/types/dashboard";

export const dashboardStats: DashboardStats = {
  totalRevenue: {
    value: "85",
    percentage: "8.5%",
    trend: "up",
  },
  foodCost: {
    value: "22",
    percentage: "8.5%",
    trend: "up",
  },
  activeRecipes: {
    value: "22",
    percentage: "8.5%",
    trend: "up",
  },
  staffOnDuty: {
    onLeave: 3,
    value: 2,
  },
};

export const trendData: ChartDataPoint[] = [
  { month: "Jan", revenue: 98000, cost: 26000 },
  { month: "Feb", revenue: 106000, cost: 28000 },
  { month: "Mar", revenue: 114000, cost: 29000 },
  { month: "Apr", revenue: 121000, cost: 31000 },
  { month: "May", revenue: 128000, cost: 33000 },
];

export const foodCostDistribution: FoodCostDistribution[] = [
  { name: "Jan", value: 35, percentage: "0.35%", color: "#D12121" },
  { name: "Feb", value: 125, percentage: "1.25%", color: "#F05252" },
  { name: "Mar", value: 215, percentage: "2.15%", color: "#F87171" },
  { name: "Apr", value: 312, percentage: "3.12%", color: "#FCA5A5" },
  { name: "May", value: 413, percentage: "4.13%", color: "#FEE2E2" },
];

export const topRecipes: TopRecipe[] = [
  { id: 1, name: "Grilled Salmon Fillet", amount: "$6,125" },
  { id: 2, name: "Pasta Carbonara", amount: "$6,125" },
  { id: 3, name: "Chicken Parmesan", amount: "$6,125" },
  { id: 4, name: "Caesar Salad", amount: "$6,125" },
];

export const recentAlerts: Alert[] = [
  { id: 1, title: "Tomato stock below minimum threshold", time: "2 hours ago", type: "warning" },
  { id: 2, title: "5 recipes pending approval", time: "2 hours ago", type: "warning" },
  { id: 3, title: "Samira want to add new recipe", time: "2 hours ago", type: "warning" },
  { id: 4, title: "New ingredient list need approval", time: "2 hours ago", type: "warning" },
  { id: 5, title: "Olive oil stock below minimum threshold", time: "2 hours ago", type: "warning" },
  { id: 6, title: "John need leave for a day", time: "2 hours ago", type: "warning" },
];
