import { apiSlice } from "../features/apiSlice";
import type {
  StaffListResponse,
  StaffQueryParams,
  CreateStaffPayload,
  StaffMember,
  PendingStaffListResponse,
  LeaveRequestsResponse,
  LeaveQueryParams,
  HolidayCalendarResponse,
  HolidayCalendarParams,
} from "@/types/staff";

export const staffApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // ── 0. TEAM HOLIDAY CALENDAR ───────────────────────────────────────────
    getTeamHolidayCalendar: builder.query<HolidayCalendarResponse, HolidayCalendarParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.year) queryParams.append("year", params.year.toString());
        if (params.month) queryParams.append("month", params.month.toString());
        
        return `/api/staff/team-holiday-calendar?${queryParams.toString()}`;
      },
      providesTags: ["HolidayCalendar"],
    }),
    // ── 1. GET ALL STAFF ───────────────────────────────────────────────────
    getAllStaff: builder.query<StaffListResponse, StaffQueryParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.page_size) queryParams.append("page_size", params.page_size.toString());
        if (params.search_term) queryParams.append("search_term", params.search_term);
        if (params.shift && params.shift !== "All") queryParams.append("shift", params.shift);
        if (params.role && params.role !== "All") queryParams.append("role", params.role);
        
        return `/api/staff?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Staff" as const, id })),
              { type: "Staff", id: "LIST" },
            ]
          : [{ type: "Staff", id: "LIST" }],
    }),

    // ── 2. CREATE STAFF ────────────────────────────────────────────────────
    createStaff: builder.mutation<{ message: string; data: StaffMember }, CreateStaffPayload>({
      query: (body) => ({
        url: "/api/staff",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Staff", id: "LIST" }],
    }),

    // ── 3. UPDATE STAFF ────────────────────────────────────────────────────
    updateStaff: builder.mutation<{ message: string; data: StaffMember }, { id: string; payload: CreateStaffPayload }>({
      query: ({ id, payload }) => ({
        url: `/api/staff/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Staff", id },
        { type: "Staff", id: "LIST" },
      ],
    }),

    // ── 4. PENDING STAFF CALLS ─────────────────────────────────────────────
    getPendingStaffRequests: builder.query<PendingStaffListResponse, void>({
      query: () => "/api/staff/admin/pending-requests",
      providesTags: ["PendingStaff"],
    }),

    // ── 5. APPROVE/REJECT PENDING STAFF ────────────────────────────────────
    approvePendingStaff: builder.mutation<{ message: string; data: any }, { id: string; action: "approved" | "rejected" }>({
      query: ({ id, action }) => ({
        url: `/api/staff/admin/approval/${id}`,
        method: "POST",
        body: { action },
      }),
      invalidatesTags: ["PendingStaff", { type: "Staff", id: "LIST" }], 
    }),

    // ── 6. LEAVE REQUESTS ──────────────────────────────────────────────────
    getLeaveRequests: builder.query<LeaveRequestsResponse, LeaveQueryParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.page_size) queryParams.append("page_size", params.page_size.toString());
        if (params.search_term) queryParams.append("search_term", params.search_term);
        if (params.status && params.status !== "All") queryParams.append("status", params.status);
        if (params.leave_type && params.leave_type !== "All") queryParams.append("leave_type", params.leave_type);
        
        return `/api/staff/admin/leave-requests?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Leave" as const, id: id.toString() })),
              { type: "Leave", id: "LIST" },
            ]
          : [{ type: "Leave", id: "LIST" }],
    }),

    // ── 7. APPROVE/REJECT LEAVE REQUEST ────────────────────────────────────
    approveLeaveRequest: builder.mutation<{ message: string; data?: any }, { id: number; status: "APPROVED" | "REJECTED" }>({
      query: ({ id, status }) => ({
        url: `/api/staff/admin/leave-requests/approval/${id}`,
        method: "POST",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Leave", id: id.toString() },
        { type: "Leave", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetTeamHolidayCalendarQuery,
  useGetAllStaffQuery,
  useCreateStaffMutation,
  useUpdateStaffMutation,
  useGetPendingStaffRequestsQuery,
  useApprovePendingStaffMutation,
  useGetLeaveRequestsQuery,
  useApproveLeaveRequestMutation,
} = staffApi;
