import { Staff, HolidayNotification, DailySchedule } from "@/types/staff";

export const staffData: Staff[] = [
  {
    id: "1",
    name: "Mark Ethan",
    position: "Bar Chef",
    shift: "7.00AM-3.00PM (Morning)",
    email: "mark@gmail.com",
    phone: "+88017572",
    avatar: "https://i.pravatar.cc/150?u=1",
    cvUrl:
      "https://drive.google.com/file/d/1-EDqp7nAMLGNI8IwAIpdFVpyS39C-Kyz/view?usp=drive_link",
    presentDays: 28,
    offDays: 2,
  },
  {
    id: "2",
    name: "John Smith",
    position: "Restaurant Chef",
    shift: "3.00PM-11.00PM (Evening)",
    email: "john@gmail.com",
    phone: "+88017573",
    avatar: "https://i.pravatar.cc/150?u=2",
    cvUrl:
      "https://drive.google.com/file/d/1-EDqp7nAMLGNI8IwAIpdFVpyS39C-Kyz/view?usp=drive_link",
    presentDays: 26,
    offDays: 4,
  },
  {
    id: "3",
    name: "Sarah Chen",
    position: "Restaurant Chef",
    shift: "7.00AM-3.00PM (Morning)",
    email: "sara@gmail.com",
    phone: "+88017574",
    avatar: "https://i.pravatar.cc/150?u=3",
    cvUrl:
      "https://drive.google.com/file/d/1-EDqp7nAMLGNI8IwAIpdFVpyS39C-Kyz/view?usp=drive_link",
    presentDays: 27,
    offDays: 3,
  },
  {
    id: "4",
    name: "David Miller",
    position: "Junior Chef",
    shift: "11.00PM-7.00AM (Night)",
    email: "david@gmail.com",
    phone: "+88017575",
    avatar: "https://i.pravatar.cc/150?u=4",
    cvUrl:
      "https://drive.google.com/file/d/1-EDqp7nAMLGNI8IwAIpdFVpyS39C-Kyz/view?usp=drive_link",
    presentDays: 25,
    offDays: 5,
  },
  {
    id: "5",
    name: "Emma Wilson",
    position: "Bar Chef",
    shift: "3.00PM-11.00PM (Evening)",
    email: "emma@gmail.com",
    phone: "+88017576",
    avatar: "https://i.pravatar.cc/150?u=5",
    cvUrl:
      "https://drive.google.com/file/d/1-EDqp7nAMLGNI8IwAIpdFVpyS39C-Kyz/view?usp=drive_link",
    presentDays: 30,
    offDays: 0,
  },
  {
    id: "6",
    name: "Michael Brown",
    position: "Head Chef",
    shift: "7.00AM-3.00PM (Morning)",
    email: "michael@gmail.com",
    phone: "+88017577",
    avatar: "https://i.pravatar.cc/150?u=6",
    cvUrl:
      "https://drive.google.com/file/d/1-EDqp7nAMLGNI8IwAIpdFVpyS39C-Kyz/view?usp=drive_link",
    presentDays: 29,
    offDays: 1,
  },
  {
    id: "7",
    name: "Lisa Anderson",
    position: "Restaurant Chef",
    shift: "11.00PM-7.00AM (Night)",
    email: "lisa@gmail.com",
    phone: "+88017578",
    avatar: "https://i.pravatar.cc/150?u=7",
    cvUrl:
      "https://drive.google.com/file/d/1-EDqp7nAMLGNI8IwAIpdFVpyS39C-Kyz/view?usp=drive_link",
    presentDays: 24,
    offDays: 6,
  },
  {
    id: "8",
    name: "James Taylor",
    position: "Junior Chef",
    shift: "7.00AM-3.00PM (Morning)",
    email: "james@gmail.com",
    phone: "+88017579",
    avatar: "https://i.pravatar.cc/150?u=8",
    cvUrl:
      "https://drive.google.com/file/d/1-EDqp7nAMLGNI8IwAIpdFVpyS39C-Kyz/view?usp=drive_link",
    presentDays: 28,
    offDays: 2,
  },
];

export const holidayNotifications: HolidayNotification[] = [
  {
    id: "1",
    name: "John Smith",
    position: "Bar Chef",
    date: "Feb 20, 2026",
    noticeType: "1 Week Notice",
  },
  {
    id: "2",
    name: "John Smith",
    position: "Restaurant Chef",
    date: "Feb 21 - Feb 23, 2026",
    noticeType: "1 Week Notice",
  },
  {
    id: "3",
    name: "John Smith",
    position: "Restaurant Chef",
    date: "Feb 21 - Feb 23, 2026",
    noticeType: "2 Week Notice",
  },
  {
    id: "4",
    name: "John Smith",
    position: "Restaurant Chef",
    date: "Feb 21 - Feb 23, 2026",
    noticeType: "3 Week Notice",
  },
  {
    id: "5",
    name: "John Smith",
    position: "Restaurant Chef",
    date: "Feb 21 - Feb 23, 2026",
    noticeType: "1 Month Notice",
  },
];

export const weeklySchedule: DailySchedule[] = [
  { day: "Monday", date: "May 27", morning: 8, evening: 8, night: 8 },
  { day: "Tuesday", date: "May 28", morning: 8, evening: 8, night: 8 },
  { day: "Wednesday", date: "May 29", morning: 8, evening: 8, night: 8 },
  { day: "Thursday", date: "May 30", morning: 8, evening: 8, night: 8 },
  { day: "Friday", date: "May 31", morning: 8, evening: 8, night: 8 },
  { day: "Saturday", date: "June 01", morning: 8, evening: 8, night: 8 },
  { day: "Sunday", date: "June 02", morning: 8, evening: 8, night: 8 },
];
