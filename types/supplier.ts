export interface Supplier {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  rating?: number;
  itemsCount?: number;
  contractStart?: string;
  contractEnd?: string;
  notes?: string;
}

export interface PriceComparisonItem {
  id: string;
  supplierName: string;
  price: number;
  isBestPrice: boolean;
  trend: "up" | "down" | "stable";
}

export interface ProductPriceComparison {
  productName: string;
  unit: string;
  comparisons: PriceComparisonItem[];
}

export interface PriceAlert {
  id: string;
  productName: string;
  type: "Increase" | "Decrease";
  supplierName: string;
  previousPrice: string;
  currentPrice: string;
  percentageChange: number;
  isSuddenChange: boolean;
}

export interface SupplierStats {
  activeSuppliers: number;
  priceAlerts: number;
}

export interface PriceHistoryPoint {
  date: string;
  [supplierName: string]: string | number;
}

export interface ProductHistory {
  productName: string;
  unit: string;
  historyData: PriceHistoryPoint[];
  suppliers: string[]; // List of supplier names for the legend/lines
}

// ── All Purchases ──────────────────────────────────────────────────────────

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

export interface Purchase {
  id: string;
  productName: string;
  price: string;
  unit: string;
  category: PurchaseCategory;
  quantity: number;
  supplierName: string;
  purchaseDate: string;
  isSelected?: boolean;
  /** true shows the red X icon in the list */
  hasProblem?: boolean;
  fileUrl?: string;
  reportUrl?: string;
}

export type OtherProduct = Purchase;
