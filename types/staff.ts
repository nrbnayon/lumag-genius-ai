export interface StaffQueryParams {
  page?: number;
  page_size?: number;
  search_term?: string;
  shift?: string;
  role?: string;
}

export interface StaffStatistics {
  total_staff: number;
  on_duty_today: number;
  on_leave_today: number;
  pending_approval: number;
  date: string;
}

export interface WeeklyScheduleOverview {
  morning: number;
  evening: number;
  night: number;
}

export interface StaffMember {
  id: string;
  full_name: string;
  email: string;
  phone_number: string | null;
  role: string;
  status: boolean;
  role_display: string;
  avatar?: string;
  shift: string;
  shift_display: string;
  weekly_schedule?: Record<string, string>;
  resume_cv_url?: string;
  created_at: string;
  position_display?: string; // used in fallback since post returns position
}

export interface StaffListResponse {
  message: string;
  statistics: StaffStatistics;
  weekly_schedule_overview: WeeklyScheduleOverview;
  count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  data: StaffMember[];
}

export interface CreateStaffPayload {
  full_name?: string;
  email?: string;
  phone_number?: string;
  position?: string; // The api demands position for POST/PATCH
  shift?: string;
  weekly_schedule?: Record<string, string>;
}

export interface PendingStaffRequest {
  id: string;
  full_name: string;
  email_address: string;
  phone_number: string | null;
  role: string;
  is_verified: boolean;
  is_active: boolean;
  joined_date: string;
}

export interface PendingStaffListResponse {
  message: string;
  count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  data: PendingStaffRequest[];
}

export interface LeaveRequest {
  id: number;
  user_id: string;
  full_name: string;
  email: string;
  phone_number: string;
  leave_type: string;
  leave_type_display: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  status_display: string;
  created_at: string;
}

export interface LeaveRequestsResponse {
  message: string;
  count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  data: LeaveRequest[];
}

export interface LeaveQueryParams {
  page?: number;
  page_size?: number;
  search_term?: string;
  status?: string;
  leave_type?: string;
}

/* -- Team Holiday Calendar -- */
export interface HolidayType {
  key: string;
  label: string;
  color: string;
}

export interface CalendarEvent {
  leave_request_id: number;
  user_id: string;
  employee_name: string;
  leave_type: string;
  leave_type_key: string;
  leave_type_label: string;
  color: string;
  start_date: string;
  end_date: string;
  reason: string;
  is_single_day: boolean;
}

export interface CalendarDay {
  date: string;
  day: number;
  week_day: string;
  is_today: boolean;
  events: CalendarEvent[];
}

export interface HolidayCalendarData {
  year: number;
  month: number;
  month_name: string;
  today: string;
  holiday_types: HolidayType[];
  summary: {
    total_holidays_this_month: number;
    employees_affected: number;
  };
  days: CalendarDay[];
}

export interface HolidayCalendarResponse {
  message: string;
  data: HolidayCalendarData;
}

export interface HolidayCalendarParams {
  year?: number;
  month?: number;
}

/* -- Legacy compatibility types if needed during transition -- */
export type StaffPosition =
  | "Bar Chef"
  | "Restaurant Chef"
  | "Junior Chef"
  | "Head Chef";
export type StaffShift = "Morning" | "Evening" | "Night";

/* -- Holiday Notifications -- */
export interface HolidayNotificationItem {
  leave_request_id: number;
  user_id: string;
  employee_name: string;
  employee_role: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  date_display: string;
  days_until_leave: number;
  notice_key: string;
  notice_label: string;
  theme: string;
  reason: string;
  is_single_day: boolean;
}

export interface HolidayNotificationsData {
  today: string;
  total_notifications: number;
  notifications: HolidayNotificationItem[];
}

export interface HolidayNotificationsResponse {
  message: string;
  data: HolidayNotificationsData;
}

export interface DailySchedule {
  day: string;
  date: string;
  morning: number;
  evening: number;
  night: number;
}
