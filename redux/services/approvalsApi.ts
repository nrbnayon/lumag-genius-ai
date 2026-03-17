// redux/services/approvalsApi.ts
import { apiSlice } from "../features/apiSlice";
import { 
  ApprovalWorkflowResponse, 
  ApprovalActionRequest, 
  ApprovalType 
} from "@/types/approvals";
import { ApiResponse } from "@/types/auth.types";

export const approvalsApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Get all approvals with filters
    getApprovals: builder.query<
      ApiResponse<ApprovalWorkflowResponse>,
      { type?: string; status?: string; search?: string; page?: number; per_page?: number }
    >({
      query: (params) => ({
        url: "/api/dashboard/admin/approvals",
        params,
      }),
      providesTags: ["Approvals"],
    }),

    // Unified Action for approvals (handled individually per type in the query)
    approveAction: builder.mutation<ApiResponse<any>, ApprovalActionRequest>({
      query: ({ id, type, action }) => {
        let url = "";
        switch (type) {
          case "menu":
            url = `/api/menus/approval/${id}`;
            break;
          case "recipe":
            url = `/api/recipes/approval/${id}`;
            break;
          case "ingredient":
            url = `/api/ingredients/approval/${id}`;
            break;
          case "staff":
            url = `/api/staff/admin/approval/${id}`;
            break;
          case "supplier":
            url = `/api/suppliers/approval/${id}`;
            break;
          case "purchase":
            url = `/api/suppliers/purchases/approval/${id}`;
            break;
          default:
            throw new Error(`Unsupported approval type: ${type}`);
        }
        return {
          url,
          method: "POST",
          body: { action },
        };
      },
      invalidatesTags: ["Approvals", "Staff", "Inventory", "Suppliers"], // Invalidate relevant tags
    }),
  }),
});

export const {
  useGetApprovalsQuery,
  useApproveActionMutation,
} = approvalsApi;
