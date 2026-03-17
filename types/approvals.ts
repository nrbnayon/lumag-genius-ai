export type ApprovalStatus = "pending" | "approved" | "rejected" | "Pending" | "Approved" | "Rejected";

export type ApprovalType =
  | "ingredient"
  | "recipe"
  | "menu"
  | "supplier"
  | "staff"
  | "purchase";

export interface ApprovalSummary {
  pending: number;
  approved: number;
  rejected: number;
}

export interface ApprovalPagination {
  current_page: number;
  per_page: number;
  total_pages: number;
  total_items: number;
  has_next: boolean;
  has_previous: boolean;
}

// ─── Item Data Types ─────────────────────────────────────────────────────────

export interface StaffApprovalItem {
  id: string;
  type: "staff";
  name: string;
  created_by_id: string;
  created_by_name: string;
  created_by_role: string;
  approval_status: ApprovalStatus;
  created_at: string;
  email: string;
  phone_number: string | null;
  role: string;
  is_verified: boolean;
  is_active: boolean;
  staff_approval_status: string;
}

export interface SupplierApprovalItem {
  id: number | string;
  type: "supplier";
  name: string;
  created_by_id: string;
  created_by_name: string;
  created_by_role: string;
  approval_status: ApprovalStatus;
  created_at: string;
  phone: string;
  email: string;
  address: string;
  rating: string;
  is_active: boolean;
  outlet_type: string;
  contract_start_date: string;
  contract_end_date: string;
  notes: string;
}

export interface MenuApprovalItem {
  id: number | string;
  type: "menu";
  name: string;
  created_by_id: string;
  created_by_name: string;
  created_by_role: string;
  approval_status: ApprovalStatus;
  created_at: string;
  menu_type: string;
  outlet_type: string;
  total_cost: string;
}

export interface RecipeApprovalItem {
  id: number | string;
  type: "recipe";
  name: string;
  created_by_id: string;
  created_by_name: string;
  created_by_role: string;
  approval_status: ApprovalStatus;
  created_at: string;
  // Add other fields as they appear in real data
  [key: string]: any;
}

export interface IngredientApprovalItem {
  id: number | string;
  type: "ingredient";
  name: string;
  created_by_id: string;
  created_by_name: string;
  created_by_role: string;
  approval_status: ApprovalStatus;
  created_at: string;
  // Add other fields as they appear in real data
  [key: string]: any;
}

export interface PurchaseApprovalItem {
  id: number | string;
  type: "purchase";
  name: string;
  created_by_id: string;
  created_by_name: string;
  created_by_role: string;
  approval_status: ApprovalStatus;
  created_at: string;
  [key: string]: any;
}

export type ApprovalItem =
  | StaffApprovalItem
  | SupplierApprovalItem
  | MenuApprovalItem
  | RecipeApprovalItem
  | IngredientApprovalItem
  | PurchaseApprovalItem;

export interface ApprovalWorkflowResponse {
  summary: ApprovalSummary;
  items: ApprovalItem[];
  pagination: ApprovalPagination;
}

// ─── Legacy Support / Unified Interface ──────────────────────────────────────

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
  email_address: string;
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

export interface StaffRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  joined_date: string;
}

export interface ApprovalRequest {
  id: string;
  type: string;
  status: string;
  readStatus: "read" | "unread";
  addedBy: string;
  avatar?: string;
  timestamp: string;
  title: string;
  description: string;
  data: 
    | ApprovalItem
    | IngredientRequest
    | RecipeRequest
    | LeaveRequest
    | MenuRequest
    | SupplierRequest
    | ReportRequest
    | StaffRequest;
}

export interface ApprovalActionRequest {
  id: string | number;
  type: string;
  action: "approved" | "rejected";
}
