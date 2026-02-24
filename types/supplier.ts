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
