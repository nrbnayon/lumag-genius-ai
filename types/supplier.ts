// ── Supplier ──────────────────────────────────────────────────────────────────

export interface SupplierDetail {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  contract_start_date: string | null;
  contract_end_date: string | null;
  notes: string | null;
  rating: string;
  is_active: boolean;
  outlet_type: "bar" | "restaurant";
  approval_status: "pending" | "approved" | "rejected";
  approved_by: string | null;
  approved_by_name: string | null;
  approved_at: string | null;
  rejected_by: string | null;
  rejected_by_name: string | null;
  rejected_at: string | null;
  rejection_reason: string | null;
  created_by: string;
  created_by_name: string;
  updated_by: string;
  updated_by_name: string;
  created_at: string;
  updated_at: string;
}

export interface SupplierListResponse {
  message: string;
  count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  data: SupplierDetail[];
}

export interface MySupplierRequestsResponse {
  message: string;
  summary: {
    approved: number;
    pending: number;
    rejected: number;
  };
  count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  data: SupplierDetail[];
}

export interface SupplierOverviewResponse {
  message: string;
  summary: {
    active_suppliers: number;
    price_alerts: number;
  };
  count: number;
  data: SupplierDetail[];
}

export interface SupplierQueryParams {
  page?: number;
  page_size?: number;
  search_term?: string;
  approval_status?: "pending" | "approved" | "rejected";
  outlet_type?: "bar" | "restaurant";
}

export interface SupplierPayload {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  contract_start_date?: string;
  contract_end_date?: string;
  notes?: string;
  rating?: number;
  is_active?: boolean;
  outlet_type?: "bar" | "restaurant";
}

// ── Purchase ──────────────────────────────────────────────────────────────────

export interface PurchaseItem {
  id: number;
  supplier_id: number;
  supplier_name: string;
  product_name: string;
  category_name: string;
  unit: string;
  price: string;
  quantity: string;
  purchase_date: string;
  is_special: boolean;
  approval_status: "pending" | "approved" | "rejected";
  approved_by: string | null;
  approved_by_name: string | null;
  approved_at: string | null;
  rejected_by: string | null;
  rejected_by_name: string | null;
  rejected_at: string | null;
  rejection_reason: string | null;
  product_file: string | null;
  report_file: string | null;
  remarks: string;
  outlet_type: "bar" | "restaurant";
  created_by: string;
  created_by_name: string;
  updated_by: string;
  updated_by_name: string;
  created_at: string;
  updated_at: string;
}

export interface PurchaseListResponse {
  message: string;
  count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  data: PurchaseItem[];
}

export interface MyPurchaseRequestsResponse {
  message: string;
  summary: {
    approved: number;
    pending: number;
    rejected: number;
  };
  count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  data: PurchaseItem[];
}

export interface PurchaseQueryParams {
  page?: number;
  page_size?: number;
  search_term?: string;
  approval_status?: "pending" | "approved" | "rejected";
  supplier_id?: number;
  is_special?: boolean;
  outlet_type?: "bar" | "restaurant";
}

export interface CreatePurchasePayload {
  supplier_name: string;
  product_name: string;
  category_name: string;
  unit: string;
  price: number;
  quantity: number;
  purchase_date: string;
  is_special: boolean;
  remarks?: string;
  outlet_type: "bar" | "restaurant";
}

// ── Price Comparison ──────────────────────────────────────────────────────────

export interface PriceComparisonSupplier {
  supplier_id: number;
  supplier_name: string;
  category_name: string;
  latest_price: string;
  previous_price: string | null;
  trend: "increasing" | "decreasing" | "no_change";
  unit: string;
  purchase_date: string;
  is_best_price: boolean;
}

export interface PriceComparisonProduct {
  product_name: string;
  supplier_name: string;
  best_price: string;
  suppliers: PriceComparisonSupplier[];
}

export interface PriceComparisonResponse {
  message: string;
  count: number;
  data: PriceComparisonProduct[];
}

// ── Price History ─────────────────────────────────────────────────────────────

export interface PriceHistorySupplier {
  supplier_id: number;
  supplier_name: string;
  unit: string;
  latest_price: string;
  previous_price: string;
  change_amount: string;
  change_percentage: number;
  trend: "increase" | "decrease" | "stable";
  prices: string[];
}

export interface PriceHistoryResponse {
  message: string;
  product_name: string;
  start_date: string;
  end_date: string;
  labels: string[];
  count: number;
  data: PriceHistorySupplier[];
}

// ── Price Alerts ──────────────────────────────────────────────────────────────

export interface PriceAlertItem {
  purchase_id: number;
  supplier_id: number;
  supplier_name: string;
  product_name: string;
  category_name: string;
  previous_price: string;
  current_price: string;
  change_amount: string;
  change_percentage: string;
  alert_type: "increase" | "decrease";
  purchase_date: string;
  unit: string;
}

export interface PriceAlertActionPayload {
  purchase_id: number;
  action_type: "accept" | "negotiate";
  proposed_price?: number;
  message?: string;
}

export interface PriceAlertsResponse {
  message: string;
  count: number;
  data: PriceAlertItem[];
}

// ── Shopping List ─────────────────────────────────────────────────────────────

export interface ShoppingListResponse {
  message: string;
  grouped_data: {
    regular_items: string[];
    special_items: string[];
    missing_items: string[];
  };
}

export interface ShoppingListActionPayload {
  product_name: string;
  is_special?: boolean;
  is_missing?: boolean;
  outlet_type?: "bar" | "restaurant";
}

// ── Pending Staff (re-exported for supplier area) ─────────────────────────────

export interface PendingStaffMember {
  id: string;
  full_name: string;
  email_address: string;
  phone_number: string | null;
  role: string;
  is_verified: boolean;
  is_active: boolean;
  joined_date: string;
}

export interface PendingStaffListResponse {
  message: string;
  count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  data: PendingStaffMember[];
}

// ── Legacy UI types (kept for component compatibility) ────────────────────────

export type PurchaseCategory =
  | "Vegetable"
  | "Fruit"
  | "Meat"
  | "Seafood"
  | "Dairy"
  | "Bakery"
  | "Beverage"
  | "Spice"
  | "Other";
