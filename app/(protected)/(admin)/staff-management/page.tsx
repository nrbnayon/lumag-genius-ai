import StaffManagementClient from "@/components/Protected/StaffManagement/StaffManagementClient";

export const metadata = {
  title: "Staff Management | LumaG Admin",
  description: "Manage your restaurant team and schedules.",
};

export default function StaffManagementPage() {
  return <StaffManagementClient />;
}
