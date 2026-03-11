export type MenuStatus = "approved" | "pending" | "rejected";
export type MenuType =
  | "BREAKFAST"
  | "LUNCH"
  | "DINNER"
  | "SEASONAL"
  | "SPECIAL";

export interface Dish {
  id: number;
  name: string;
  created_by?: string;
  updated_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Menu {
  id: number;
  name: string;
  menu_type: MenuType;
  outlet_type: string;
  total_cost: string;
  approval_status: MenuStatus;
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
  dishes: Dish[];
}

export interface MenuFormData {
  id?: number;
  name: string;
  menu_type: MenuType;
  outlet_type: string;
  total_cost: number | string;
  dishes: string[] | number[]; // Can be names during create, IDs during update
}

export interface PaginatedMenusResponse {
  message: string;
  count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  data: Menu[];
}

export interface DishesResponse {
  message: string;
  data: Dish[];
}

export interface DishResponse {
  message: string;
  data: Dish;
}

export interface MenusApiResponse {
  message: string;
  data: Menu[];
}

export interface MenuStats {
  totalMenus: number;
  totalMenuItems: number;
  highMarginItems: number;
  pendingApproval: number;
}
