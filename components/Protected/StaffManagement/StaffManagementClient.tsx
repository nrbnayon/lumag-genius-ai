"use client";

import { useState } from "react";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { StatsCard } from "@/components/Shared/StatsCard";
import { Users, UserCheck, UserMinus, Clock, Plus, Search } from "lucide-react";
import SearchBar from "@/components/Shared/SearchBar";
import { Pagination } from "@/components/Shared/Pagination";
import { StaffMember } from "@/types/staff";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";

// Components
import { StaffCard } from "./StaffCard";
import { StaffModal } from "./StaffModal";
import { StaffReportModal } from "./StaffReportModal";
import { EmployeeReportModal } from "./EmployeeReportModal";
import { StaffCVModal } from "./StaffCVModal";
import { HolidayCalendarModal } from "./HolidayCalendarModal";
import { HolidayNotifications } from "./HolidayNotifications";
import { ScheduleOverview } from "./ScheduleOverview";
import { DeleteConfirmationModal } from "@/components/Shared/DeleteConfirmationModal";
import { StaffGridSkeleton } from "@/components/Skeleton/StaffSkeleton";

import { exportToExcel } from "@/lib/excel";
import {
  useGetAllStaffQuery,
  useCreateStaffMutation,
  useUpdateStaffMutation,
  useGetPendingStaffRequestsQuery,
} from "@/redux/services/staffApi";

export default function StaffManagementClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchTerm = useDebounce(searchQuery, 300);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals state
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [staffModalMode, setStaffModalMode] = useState<"add" | "edit">("add");
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isEmployeeReportOpen, setIsEmployeeReportOpen] = useState(false);
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Queries
  const { data: staffData, isLoading, isError } = useGetAllStaffQuery({
    page: currentPage,
    page_size: itemsPerPage,
    search_term: debouncedSearchTerm,
  });

  const { data: pendingData } = useGetPendingStaffRequestsQuery();
  
  const [createStaff, { isLoading: isCreating }] = useCreateStaffMutation();
  const [updateStaff, { isLoading: isUpdating }] = useUpdateStaffMutation();

  const handleSearch = (term: string) => {
    setSearchQuery(term);
    setCurrentPage(1); // Reset page on search
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handlers
  const handleAddStaff = () => {
    setStaffModalMode("add");
    setSelectedStaff(null);
    setIsStaffModalOpen(true);
  };

  const handleEditStaff = (staff: StaffMember) => {
    setStaffModalMode("edit");
    setSelectedStaff(staff);
    setIsStaffModalOpen(true);
  };

  const handleViewStaff = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setIsReportModalOpen(true);
  };

  const handleGenerateReport = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setIsEmployeeReportOpen(true);
  };

  const handleDeleteStaff = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedStaff) {
      toast.info("Delete staff feature currently mocked as it's missing from generic endpoint mappings.");
      // Would normally be e.g. await deleteStaff(selectedStaff.id) here
      setIsDeleteModalOpen(false);
    }
  };

  const handleModalConfirm = async (data: Partial<StaffMember>) => {
    try {
      const payload = {
        full_name: data.full_name!,
        email: data.email!,
        phone_number: data.phone_number!,
        position: data.role!, // We fallback UI `role` dropdown value to API `position` requirement
        shift: data.shift!,
      };

      if (staffModalMode === "add") {
        await createStaff(payload).unwrap();
        toast.success("Staff member created successfully. Login credentials sent to email.");
      } else if (selectedStaff) {
        await updateStaff({ id: selectedStaff.id, payload }).unwrap();
        toast.success("Staff member updated successfully.");
      }
      setIsStaffModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save staff data");
      console.error(error);
    }
  };

  const handleExportReport = async () => {
    if (!staffData?.data) return;
    toast.info("Preparing Full Staff Report...");

    const exportData = staffData.data.map((item) => ({
      "Full Name": item.full_name,
      Position: item.role_display,
      Shift: item.shift_display.split(" (")[0],
      email_address: item.email,
      Phone: item.phone_number,
      "Present Days": 0, // Mocked properties placeholder
      "Off Days": 0,
    }));

    await exportToExcel(
      exportData,
      "Staff_Management_Report.xlsx",
      "Staff Members",
    );
    toast.success("Full Staff Report exported to Excel!");
  };

  const handleDownloadReport = async (staff: StaffMember) => {
    toast.info(`Generating Excel report for ${staff.full_name}...`);

    const exportData = [
      {
        "Full Name": staff.full_name,
        Position: staff.role_display,
        Shift: staff.shift_display.split(" (")[0],
        email_address: staff.email,
        Phone: staff.phone_number,
        "Present Days": 0,
        "Off Days": 0,
      },
    ];

    await exportToExcel(
      exportData,
      `${staff.full_name.replace(/\s+/g, "_")}_Report.xlsx`,
      "Employee Report",
    );
    toast.success(`Excel report for ${staff.full_name} downloaded!`);
    setIsEmployeeReportOpen(false);
  };

  const handleViewCV = () => {
    setIsCVModalOpen(true);
  };

  return (
    <div className="pb-10 bg-[#F9FAFB] min-h-screen">
      <DashboardHeader
        title="Staff Management"
        description="Manage team schedules, shifts, and leave requests"
      />

      <main className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Staff"
            value={staffData?.statistics?.total_staff || 0}
            icon={Users}
            iconColor="#3B82F6"
            iconBgColor="#DBEAFE"
          />
          <StatsCard
            title="On Duty Today"
            value={staffData?.statistics?.on_duty_today || 0}
            icon={UserCheck}
            iconColor="#10B981"
            iconBgColor="#D1FAE5"
          />
          <StatsCard
            title="On Leave"
            value={staffData?.statistics?.on_leave_today || 0}
            icon={UserMinus}
            iconColor="#EF4444"
            iconBgColor="#FEE2E2"
          />
          <StatsCard
            title="Pending Approval"
            value={staffData?.statistics?.pending_approval || 0}
            icon={Clock}
            iconColor="#F59E0B"
            iconBgColor="#FEF3C7"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <SearchBar
            placeholder="Search Staff"
            className="max-w-xl bg-white border border-gray-100 shadow-sm"
            onSearch={handleSearch}
          />
          <button
            onClick={handleAddStaff}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xs font-bold hover:bg-blue-600 transition-all cursor-pointer text-sm shadow-sm active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Staff
          </button>
        </div>

        <div className="space-y-6">
          {isLoading ? (
            <StaffGridSkeleton />
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-red-100 shadow-sm">
              <p className="text-secondary">Error loading staff data. Please try again.</p>
            </div>
          ) : staffData?.data && staffData.data.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-4 xl:gap-6">
                {staffData.data.map((staff) => (
                  <StaffCard
                    key={staff.id}
                    staff={staff}
                    onEdit={handleEditStaff}
                    onView={handleViewStaff}
                    onDelete={handleDeleteStaff}
                    onGenerateReport={handleGenerateReport}
                  />
                ))}
              </div>
              <div className="flex justify-center pt-3">
                <Pagination
                  currentPage={staffData.current_page}
                  totalPages={staffData.total_pages}
                  onPageChange={handlePageChange}
                  totalItems={staffData.count}
                  itemsPerPage={staffData.page_size}
                  currentItemsCount={staffData.data.length}
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <Search className="w-12 h-12 text-gray-200 mb-4" />
              <h3 className="text-xl font-bold text-foreground">
                No staff found
              </h3>
              <p className="text-secondary">Try adjusting your search query</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          <HolidayNotifications
            onViewCalendar={() => setIsCalendarOpen(true)}
          />
          <ScheduleOverview />
        </div>
      </main>

      {/* Modals */}
      <StaffModal
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
        onConfirm={handleModalConfirm}
        staff={selectedStaff}
        mode={staffModalMode}
        isSubmitting={isCreating || isUpdating}
      />

      <StaffReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        staff={selectedStaff}
        onViewCV={handleViewCV}
        onExport={handleExportReport}
      />

      <EmployeeReportModal
        isOpen={isEmployeeReportOpen}
        onClose={() => setIsEmployeeReportOpen(false)}
        staff={selectedStaff}
        onDownload={handleDownloadReport}
      />

      <StaffCVModal
        isOpen={isCVModalOpen}
        onClose={() => setIsCVModalOpen(false)}
        cvUrl={"https://drive.google.com/file/d/1-EDqp7nAMLGNI8IwAIpdFVpyS39C-Kyz/view?usp=drive_link"}
        staffName={selectedStaff?.full_name}
      />

      <HolidayCalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Remove Staff Member"
        description={`Are you sure you want to remove ${selectedStaff?.full_name} from the team? This action cannot be undone.`}
      />
    </div>
  );
}
