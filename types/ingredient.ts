export type IngredientStatus = "Approved" | "Pending";

export interface Ingredient {
  id: string;
  name: string;
  price: number;
  unit: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  status: IngredientStatus;
  hasWarning?: boolean;
}

export interface IngredientFormData {
  name: string;
  price: string;
  unit: string;
  category: string;
  currentStock: string;
  minimumStock: string;
}

export interface IngredientStats {
  totalIngredients: number;
  lowStockItems: number;
  purchaseRequest: number;
  pendingApproval: number;
}
