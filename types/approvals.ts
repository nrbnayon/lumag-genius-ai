export type ApprovalStatus = "Pending" | "Approved" | "Rejected";
export type ApprovalType = "Ingredient" | "Recipe" | "Leave" | "Menu";

export interface IngredientRequest {
  id: string;
  name: string;
  unit: string;
  price: string;
  currentStock: number;
  minimumStock: number;
  category: string;
  quantityNeeded?: number;
}

export interface RecipeRequest {
  id: string;
  name: string;
  avgTime: string;
  sellingPrice: string;
  instruction: string;
  ingredients: {
    name: string;
    quantity: number;
    unit: string;
    cost: string;
  }[];
}

export interface LeaveRequest {
  id: string;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface MenuRequest {
  id: string;
  title: string;
  description: string;
}

export interface ApprovalRequest {
  id: string;
  type: ApprovalType;
  status: ApprovalStatus;
  addedBy: string;
  timestamp: string;
  data: IngredientRequest | RecipeRequest | LeaveRequest | MenuRequest;
}
