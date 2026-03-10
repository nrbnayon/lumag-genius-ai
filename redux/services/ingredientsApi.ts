import { apiSlice } from "../features/apiSlice";
import type {
  PaginatedIngredientsResponse,
  IngredientsApiResponse,
  SingleIngredientApiResponse,
  CreateIngredientPayload,
  UpdateIngredientPayload,
  ApproveRejectIngredientPayload,
  Ingredient,
} from "@/types/ingredients.types";

interface GetIngredientsParams {
  page?: number;
  page_size?: number;
  search_term?: string;
  outlet_type?: string; 
  approval_status?: string; 
}

export const ingredientsApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // ── 1. GET ALL INGREDIENTS (Paginated / Searched) ──────────────────────────
    getAllIngredients: builder.query<PaginatedIngredientsResponse, GetIngredientsParams>({
      query: (params) => {
        // Construct query string cleanly
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.page_size) queryParams.append("page_size", params.page_size.toString());
        if (params.search_term) queryParams.append("search_term", params.search_term);
        if (params.outlet_type && params.outlet_type !== "All") queryParams.append("outlet_type", params.outlet_type.toLowerCase());
        if (params.approval_status) queryParams.append("approval_status", params.approval_status.toLowerCase());
        
        return `/api/ingredients?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Ingredients" as const, id })),
              { type: "Ingredients", id: "LIST" },
            ]
          : [{ type: "Ingredients", id: "LIST" }],
    }),

    // ── 2. CREATE INGREDIENTS ──────────────────────────────────────────────────
    // API expects an array of create definitions
    createIngredients: builder.mutation<IngredientsApiResponse, CreateIngredientPayload[]>({
      query: (body) => ({
        url: "/api/ingredients",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Ingredients", id: "LIST" }],
    }),

    // ── 3. BULK UPDATE INGREDIENTS ─────────────────────────────────────────────
    // Bulk updating ingredients via an array
    updateIngredientsBulk: builder.mutation<IngredientsApiResponse, UpdateIngredientPayload[]>({
      query: (body) => ({
        url: "/api/ingredients/bulk-update",
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, args) => [
        ...args.map(({ id }) => ({ type: "Ingredients" as const, id })),
        { type: "Ingredients", id: "LIST" },
      ],
    }),

    // ── 4. APPROVE OR REJECT INGREDIENT ────────────────────────────────────────
    approveRejectIngredient: builder.mutation<SingleIngredientApiResponse, { id: number; data: ApproveRejectIngredientPayload }>({
      query: ({ id, data }) => ({
        url: `/api/ingredients/approval/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Ingredients", id },
        { type: "Ingredients", id: "LIST" },
      ],
    }),

    // ── 5. DELETE INGREDIENT ───────────────────────────────────────────────────
    deleteIngredient: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/api/ingredients/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Ingredients", id },
        { type: "Ingredients", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllIngredientsQuery,
  useCreateIngredientsMutation,
  useUpdateIngredientsBulkMutation,
  useApproveRejectIngredientMutation,
  useDeleteIngredientMutation,
} = ingredientsApi;
