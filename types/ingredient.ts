export type IngredientStatus = "Approved" | "Pending" | "Low Stock" | "Out of Stock" | "Rejected";

export interface Ingredient {
  id: string;
  outletType?: string; // "All" | "Restaurant" | "Bar"
  name: string;
  price: number;
  unit: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  status: IngredientStatus;
  hasWarning?: boolean; // Low Stock or Out of Stock
  image?: string;
}

export interface IngredientFormData {
  outletType?: string; // "All" | "Restaurant" | "Bar"
  name: string;
  price: string;
  unit: string;
  category: string;
  currentStock: string;
  minimumStock: string;
  image: File | null;
}

export interface IngredientStats {
  totalIngredients: number;
  lowStockItems: number;
  purchaseRequest: number;
  pendingApproval: number;
}
