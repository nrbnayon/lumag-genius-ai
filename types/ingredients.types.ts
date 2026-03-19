// types/ingredients.types.ts

export interface Ingredient {
  id: number;
  name: string;
  category: number | string;
  category_name?: string;
  outlet_type: string;
  unit: string;
  price_per_unit: string;
  current_stock: number;
  minimum_stock: number;
  is_special: boolean;
  review_ingredient?: unknown;
  status: string;
  approval_status: string;
  created_by: string;
  created_at: string;
  updated_by: string | null;
  updated_at: string;
}

export interface IngredientSummary {
  total_ingredients: number;
  low_stock_items: number;
  purchase_requests: number;
  pending_approval: number;
}

export interface PaginatedIngredientsResponse {
  message: string;
  count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  data: Ingredient[];
  summary?: IngredientSummary;
}

export interface IngredientsApiResponse {
  message: string;
  data: Ingredient[];
}

export interface SingleIngredientApiResponse {
  message: string;
  data: Ingredient;
}

export interface CreateIngredientPayload {
  name: string;
  category_id: number;
  unit: string;
  price_per_unit: string;
  current_stock: number;
  minimum_stock: number;
  outlet_type: string;
  is_special: boolean;
}

export interface UpdateIngredientPayload extends CreateIngredientPayload {
  id: number;
}

export interface ApproveRejectIngredientPayload {
  action: "approved" | "rejected";
}
