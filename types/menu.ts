export type MenuStatus = "Approved" | "Pending";
export type MenuType =
  | "Breakfast"
  | "Lunch"
  | "Dinner"
  | "Seasonal"
  | "Special";

export interface Menu {
  id: string;
  name: string;
  itemsCount: number;
  cost: string;
  type: MenuType;
  status: MenuStatus;
  dishes: string[];
  image?: string;
}

export interface MenuFormData {
  name: string;
  type: MenuType;
  dishes: string[];
  cost: string;
  image: File | null;
}

export interface MenuStats {
  totalMenus: number;
  totalMenuItems: number;
  highMarginItems: number;
  pendingApproval: number;
}
