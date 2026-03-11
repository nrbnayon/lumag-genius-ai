import { apiSlice } from "../features/apiSlice";
import type {
  PaginatedRecipesResponse,
  RecipesApiResponse,
  SingleRecipeApiResponse,
  CreateRecipePayload,
  UpdateRecipePayload,
  ApproveRejectRecipePayload,
  Recipe,
} from "@/types/recipes.types";

interface GetRecipesParams {
  page?: number;
  page_size?: number;
  search_term?: string;
  outlet_type?: string; 
  approval_status?: string; 
}

export const recipesApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // ── 1. GET ALL RECIPES (Paginated / Searched) ──────────────────────────
    getAllRecipes: builder.query<PaginatedRecipesResponse, GetRecipesParams>({
      query: (params) => {
        // Construct query string cleanly
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.page_size) queryParams.append("page_size", params.page_size.toString());
        if (params.search_term) queryParams.append("search_term", params.search_term);
        if (params.outlet_type && params.outlet_type !== "All") queryParams.append("outlet_type", params.outlet_type.toLowerCase());
        if (params.approval_status) queryParams.append("approval_status", params.approval_status.toLowerCase());
        
        return `/api/recipes?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Recipes" as const, id })),
              { type: "Recipes", id: "LIST" },
            ]
          : [{ type: "Recipes", id: "LIST" }],
    }),

    // ── 2. CREATE RECIPES ──────────────────────────────────────────────────
    // API expects an array of create definitions
    createRecipes: builder.mutation<RecipesApiResponse, CreateRecipePayload[]>({
      query: (body) => ({
        url: "/api/recipes",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Recipes", id: "LIST" }],
    }),

    // ── 3. BULK UPDATE RECIPES ─────────────────────────────────────────────
    // Bulk updating recipes via an array
    updateRecipesBulk: builder.mutation<RecipesApiResponse, UpdateRecipePayload[]>({
      query: (body) => ({
        url: "/api/recipes",
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, args) => [
        ...args.map(({ id }) => ({ type: "Recipes" as const, id })),
        { type: "Recipes", id: "LIST" },
      ],
    }),

    // ── 4. DELETE RECIPE ───────────────────────────────────────────────────
    deleteRecipe: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/api/recipes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Recipes", id },
        { type: "Recipes", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllRecipesQuery,
  useCreateRecipesMutation,
  useUpdateRecipesBulkMutation,
  useDeleteRecipeMutation,
} = recipesApi;
