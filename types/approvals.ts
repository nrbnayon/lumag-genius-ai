export type ApprovalStatus = "Pending" | "Approved" | "Rejected";
export type ApprovalType =
  | "Ingredient"
  | "Recipe"
  | "Leave"
  | "Menu"
  | "Supplier"
  | "Report";

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

export interface SupplierRequest {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  contractStart: string;
  contractEnd: string;
  notes: string;
}

export interface ReportRequest {
  id: string;
  productName: string;
  price: string;
  quantity: number;
  unit: string;
  supplierName: string;
  reportImage?: string;
  purchaseDate: string;
}

export interface ApprovalRequest {
  id: string;
  type: ApprovalType;
  status: ApprovalStatus;
  readStatus: "read" | "unread";
  addedBy: string;
  avatar?: string;
  timestamp: string;
  title: string;
  description: string;
  data:
    | IngredientRequest
    | RecipeRequest
    | LeaveRequest
    | MenuRequest
    | SupplierRequest
    | ReportRequest;
}
