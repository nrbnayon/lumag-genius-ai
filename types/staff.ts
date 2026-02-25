export type StaffPosition =
  | "Bar Chef"
  | "Restaurant Chef"
  | "Junior Chef"
  | "Head Chef";
export type StaffShift =
  | "7.00AM-3.00PM (Morning)"
  | "3.00PM-11.00PM (Evening)"
  | "11.00PM-7.00AM (Night)";

export interface Staff {
  id: string;
  name: string;
  position: StaffPosition;
  shift: StaffShift;
  email: string;
  phone: string;
  avatar?: string;
}

export interface HolidayNotification {
  id: string;
  name: string;
  position: string;
  date: string;
  noticeType:
    | "1 Week Notice"
    | "2 Week Notice"
    | "3 Week Notice"
    | "1 Month Notice";
  color: string;
}

export interface DailySchedule {
  day: string;
  date: string;
  morning: number;
  evening: number;
  night: number;
}
