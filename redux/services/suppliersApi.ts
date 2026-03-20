import { apiSlice } from "../features/apiSlice";
import type {
  SupplierListResponse,
  SupplierQueryParams,
  SupplierPayload,
  SupplierDetail,
  SupplierOverviewResponse,
  MySupplierRequestsResponse,
  PurchaseListResponse,
  PurchaseQueryParams,
  CreatePurchasePayload,
  PurchaseItem,
  MyPurchaseRequestsResponse,
  PriceComparisonResponse,
  PriceHistoryResponse,
  PriceAlertsResponse,
  PriceAlertActionPayload,
  ShoppingListResponse,
  ShoppingListActionPayload,
  PendingStaffListResponse,
} from "@/types/supplier";

export const suppliersApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // ── 1. GET ALL SUPPLIERS ───────────────────────────────────────────────
    getAllSuppliers: builder.query<SupplierListResponse, SupplierQueryParams>({
      query: (params = {}) => {
        const q = new URLSearchParams();
        if (params.page) q.append("page", params.page.toString());
        if (params.page_size) q.append("page_size", params.page_size.toString());
        if (params.search_term) q.append("search_term", params.search_term);
        if (params.approval_status) q.append("approval_status", params.approval_status);
        if (params.outlet_type) q.append("outlet_type", params.outlet_type);
        return `/api/suppliers?${q.toString()}`;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Suppliers" as const, id })),
              { type: "Suppliers", id: "LIST" },
            ]
          : [{ type: "Suppliers", id: "LIST" }],
    }),

    // ── 2. GET MY SUPPLIER REQUESTS ────────────────────────────────────────
    getMySupplierRequests: builder.query<MySupplierRequestsResponse, void>({
      query: () => "/api/suppliers/my-requests",
      providesTags: [{ type: "Suppliers", id: "MY_REQUESTS" }],
    }),

    // ── 3. CREATE SUPPLIER ─────────────────────────────────────────────────
    createSupplier: builder.mutation<{ message: string; data: SupplierDetail }, SupplierPayload>({
      query: (body) => ({
        url: "/api/suppliers",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Suppliers", id: "LIST" },
        { type: "Suppliers", id: "OVERVIEW" },
      ],
    }),

    // ── 4. UPDATE SUPPLIER ─────────────────────────────────────────────────
    updateSupplier: builder.mutation<{ message: string; data: SupplierDetail }, { id: number; payload: Partial<SupplierPayload> }>({
      query: ({ id, payload }) => ({
        url: `/api/suppliers/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Suppliers", id },
        { type: "Suppliers", id: "LIST" },
        { type: "Suppliers", id: "OVERVIEW" },
      ],
    }),

    // ── 5. GET SUPPLIER OVERVIEW ───────────────────────────────────────────
    getSupplierOverview: builder.query<SupplierOverviewResponse, void>({
      query: () => "/api/suppliers/overview",
      providesTags: [{ type: "Suppliers", id: "OVERVIEW" }],
    }),

    // ── 6. GET ALL PURCHASES ───────────────────────────────────────────────
    getAllPurchases: builder.query<PurchaseListResponse, PurchaseQueryParams>({
      query: (params = {}) => {
        const q = new URLSearchParams();
        if (params.page) q.append("page", params.page.toString());
        if (params.page_size) q.append("page_size", params.page_size.toString());
        if (params.search_term) q.append("search_term", params.search_term);
        if (params.approval_status) q.append("approval_status", params.approval_status);
        if (params.supplier_id) q.append("supplier_id", params.supplier_id.toString());
        if (params.is_special !== undefined) q.append("is_special", params.is_special.toString());
        if (params.outlet_type) q.append("outlet_type", params.outlet_type);
        return `/api/suppliers/purchases?${q.toString()}`;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Suppliers" as const, id: `PURCHASE_${id}` })),
              { type: "Suppliers", id: "PURCHASES" },
            ]
          : [{ type: "Suppliers", id: "PURCHASES" }],
    }),

    // ── 7. GET MY PURCHASE REQUESTS ────────────────────────────────────────
    getMyPurchaseRequests: builder.query<MyPurchaseRequestsResponse, void>({
      query: () => "/api/suppliers/purchases/my-requests",
      providesTags: [{ type: "Suppliers", id: "MY_PURCHASES" }],
    }),

    // ── 8. CREATE PURCHASES (bulk array) ──────────────────────────────────
    createPurchases: builder.mutation<{ message: string; data: PurchaseItem[] }, CreatePurchasePayload[]>({
      query: (body) => ({
        url: "/api/suppliers/purchases",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Suppliers", id: "PURCHASES" },
        { type: "Suppliers", id: "MY_PURCHASES" },
      ],
    }),

    // ── 9. UPDATE PURCHASE ─────────────────────────────────────────────────
    updatePurchase: builder.mutation<{ message: string; data: PurchaseItem }, { id: number; payload: Partial<CreatePurchasePayload> }>({
      query: ({ id, payload }) => ({
        url: `/api/suppliers/purchases/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Suppliers", id: `PURCHASE_${id}` },
        { type: "Suppliers", id: "PURCHASES" },
        { type: "Suppliers", id: "MY_PURCHASES" },
      ],
    }),

    // ── 10. GET PRICE COMPARISON ───────────────────────────────────────────
    getPriceComparison: builder.query<PriceComparisonResponse, { product_name?: string }>({
      query: ({ product_name } = {}) => {
        const q = new URLSearchParams();
        if (product_name) q.append("product_name", product_name);
        return `/api/suppliers/price-comparison?${q.toString()}`;
      },
      providesTags: [{ type: "Suppliers", id: "PRICE_COMPARISON" }],
    }),

    // ── 11. GET PRICE HISTORY ──────────────────────────────────────────────
    getPriceHistory: builder.query<PriceHistoryResponse, { product_name?: string }>({
      query: ({ product_name } = {}) => {
        const q = new URLSearchParams();
        if (product_name) q.append("product_name", product_name);
        return `/api/suppliers/price-history?${q.toString()}`;
      },
      providesTags: [{ type: "Suppliers", id: "PRICE_HISTORY" }],
    }),

    // ── 12. GET PRICE ALERTS ───────────────────────────────────────────────
    getPriceAlerts: builder.query<PriceAlertsResponse, void>({
      query: () => "/api/suppliers/price-alerts",
      providesTags: [{ type: "Suppliers", id: "PRICE_ALERTS" }],
    }),

    // ── 13. GET SHOPPING LIST ──────────────────────────────────────────────
    getShoppingList: builder.query<ShoppingListResponse, void>({
      query: () => "/api/suppliers/shopping-list",
      providesTags: [{ type: "Suppliers", id: "SHOPPING_LIST" }],
    }),
    
    updateShoppingList: builder.mutation<{ message: string }, ShoppingListActionPayload>({
      query: (body) => ({
        url: "/api/suppliers/shopping-list",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Suppliers", id: "SHOPPING_LIST" }],
    }),

    removeShoppingListItem: builder.mutation<{ message: string }, { product_name: string; outlet_type?: string }>({
      query: (body) => ({
        url: "/api/suppliers/shopping-list",
        method: "DELETE",
        body,
      }),
      invalidatesTags: [{ type: "Suppliers", id: "SHOPPING_LIST" }],
    }),

    handlePriceAlertAction: builder.mutation<{ message: string }, PriceAlertActionPayload>({
      query: (body) => ({
        url: "/api/suppliers/price-alerts/action",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Suppliers", id: "PRICE_ALERTS" },
        { type: "Suppliers", id: "OVERVIEW" },
      ],
    }),

    // ── 14. PENDING STAFF REQUESTS (reused in supplier area) ──────────────
    getPendingStaffForSuppliers: builder.query<PendingStaffListResponse, void>({
      query: () => "/api/staff/admin/pending-requests",
      providesTags: ["PendingStaff"],
    }),
  }),
});

export const {
  useGetAllSuppliersQuery,
  useGetMySupplierRequestsQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useGetSupplierOverviewQuery,
  useGetAllPurchasesQuery,
  useGetMyPurchaseRequestsQuery,
  useCreatePurchasesMutation,
  useUpdatePurchaseMutation,
  useGetPriceComparisonQuery,
  useGetPriceHistoryQuery,
  useGetPriceAlertsQuery,
  useHandlePriceAlertActionMutation,
  useGetShoppingListQuery,
  useUpdateShoppingListMutation,
  useRemoveShoppingListItemMutation,
  useGetPendingStaffForSuppliersQuery,
} = suppliersApi;
