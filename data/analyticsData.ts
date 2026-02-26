import type {
  AnalyticsStats,
  RevenueCostTrendPoint,
  StaffAttendanceTrendPoint,
  TopBudgetRecipe,
  TopBudgetMenu,
  MonthlyFinancialSummary,
  StaffPerformance,
} from "@/types/analytics";

export const analyticsStats: AnalyticsStats = {
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
  profit: {
    value: "22",
    percentage: "8.5%",
    trend: "up",
  },
};

export const revenueCostTrendData: RevenueCostTrendPoint[] = [
  { month: "Jan", revenue: 98000, cost: 26000, profit: 72000 },
  { month: "Feb", revenue: 106000, cost: 28000, profit: 78000 },
  { month: "Mar", revenue: 114000, cost: 29000, profit: 85000 },
  { month: "Apr", revenue: 121000, cost: 31000, profit: 90000 },
  { month: "May", revenue: 128000, cost: 33000, profit: 95000 },
];

export const staffAttendanceTrendData: StaffAttendanceTrendPoint[] = [
  { week: "Week 1", absent: 3, present: 30 },
  { week: "Week 2", absent: 5, present: 28 },
  { week: "Week 3", absent: 2, present: 31 },
  { week: "Week 4", absent: 4, present: 27 },
  { week: "Week 5", absent: 6, present: 26 },
];

export const topBudgetRecipes: TopBudgetRecipe[] = [
  { id: 1, name: "Grilled Salmon Fillet", amount: "$6,125" },
  { id: 2, name: "Pasta Carbonara", amount: "$6,125" },
  { id: 3, name: "Chicken Parmesan", amount: "$6,125" },
  { id: 4, name: "Caesar Salad", amount: "$6,125" },
  { id: 5, name: "Caesar Salad", amount: "$6,125" },
  { id: 6, name: "Caesar Salad", amount: "$6,125" },
];

export const topBudgetMenus: TopBudgetMenu[] = [
  { id: 1, name: "Grilled Salmon Fillet", amount: "$6,125", change: "+12%" },
  { id: 2, name: "Truffle Mushroom Risotto", amount: "$5,420", change: "+12%" },
  { id: 3, name: "Wagyu Beef Burger", amount: "$4,850", change: "-8%" },
  { id: 4, name: "Seafood Paella", amount: "$3,920", change: "+5%" },
  { id: 5, name: "Vegetable Stir Fry", amount: "$2,750", change: "-3%" },
];

export const monthlyFinancialSummary: MonthlyFinancialSummary[] = [
  {
    month: "Jan",
    revenue: "$20",
    foodCost: "$20",
    profit: "$20",
    profitMargin: "20%",
  },
  {
    month: "Feb",
    revenue: "$30",
    foodCost: "$20",
    profit: "$30",
    profitMargin: "20%",
  },
  {
    month: "Mar",
    revenue: "$30",
    foodCost: "$20",
    profit: "$30",
    profitMargin: "20%",
  },
  {
    month: "Apr",
    revenue: "$30",
    foodCost: "$20",
    profit: "$30",
    profitMargin: "20%",
  },
  {
    month: "May",
    revenue: "$30",
    foodCost: "$20",
    profit: "$30",
    profitMargin: "20%",
  },
];

export const staffPerformanceData: StaffPerformance[] = [
  {
    id: "1",
    name: "Mark Ethan",
    role: "Bar Chef",
    attendance: "90%",
    leaveDays: 2,
  },
  {
    id: "2",
    name: "John Smith",
    role: "Restaurant Chef",
    attendance: "90%",
    leaveDays: 2,
  },
  {
    id: "3",
    name: "Sarah Chen",
    role: "Bar Chef",
    attendance: "90%",
    leaveDays: 2,
  },
  {
    id: "4",
    name: "David Miller",
    role: "Bar Chef",
    attendance: "90%",
    leaveDays: 2,
  },
  {
    id: "5",
    name: "Emma Wilson",
    role: "Bar Chef",
    attendance: "90%",
    leaveDays: 2,
  },
];
