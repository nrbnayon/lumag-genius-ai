export interface DashboardStats {
  totalRevenue: {
    value: string;
    percentage: string;
    trend: 'up' | 'down';
  };
  foodCost: {
    value: string;
    percentage: string;
    trend: 'up' | 'down';
  };
  activeRecipes: {
    value: string;
    percentage: string;
    trend: 'up' | 'down';
  };
  staffOnDuty: {
    value: number;
    onLeave: number;
  };
}

export interface ChartDataPoint {
  month: string;
  revenue: number;
  cost: number;
}

export interface FoodCostDistribution {
  name: string;
  value: number;
  percentage: string;
  color: string;
}

export interface TopRecipe {
  id: number;
  name: string;
  amount: string;
}

export interface Alert {
  id: number;
  title: string;
  time: string;
  type: 'warning' | 'info' | 'error';
}
