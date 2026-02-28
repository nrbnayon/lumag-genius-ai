"use client";

import { useState } from "react";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { StatsCard } from "@/components/Shared/StatsCard";
import { Users, UserCheck, UserMinus, Clock, Plus, Search } from "lucide-react";
import SearchBar from "@/components/Shared/SearchBar";
import { Pagination } from "@/components/Shared/Pagination";
import { staffData } from "@/data/staffData";
import { Staff } from "@/types/staff";
import { toast } from "sonner";

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

import { exportToExcel } from "@/lib/excel";
import { useEffect } from "react";
import { StaffGridSkeleton } from "@/components/Skeleton/StaffSkeleton";

export default function StaffManagementClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [staffList, setStaffList] = useState<Staff[]>(staffData);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Modal states
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [staffModalMode, setStaffModalMode] = useState<"add" | "edit">("add");
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isEmployeeReportOpen, setIsEmployeeReportOpen] = useState(false);
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Filters
  const filteredStaff = staffList.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const paginatedStaff = filteredStaff.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);

  // Handlers
  const handleAddStaff = () => {
    setStaffModalMode("add");
    setSelectedStaff(null);
    setIsStaffModalOpen(true);
  };

  const handleEditStaff = (staff: Staff) => {
    setStaffModalMode("edit");
    setSelectedStaff(staff);
    setIsStaffModalOpen(true);
  };

  const handleViewStaff = (staff: Staff) => {
    setSelectedStaff(staff);
    setIsReportModalOpen(true);
  };

  const handleGenerateReport = (staff: Staff) => {
    setSelectedStaff(staff);
    setIsEmployeeReportOpen(true);
  };

  const handleDeleteStaff = (staff: Staff) => {
    setSelectedStaff(staff);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedStaff) {
      setStaffList(staffList.filter((s) => s.id !== selectedStaff.id));
      toast.success(
        `Staff member "${selectedStaff.name}" removed successfully`,
      );
      setIsDeleteModalOpen(false);
    }
  };

  const handleModalConfirm = (data: Partial<Staff>) => {
    if (staffModalMode === "add") {
      const newStaff: Staff = {
        id: Math.random().toString(36).substr(2, 9),
        name: data.name!,
        position: data.position!,
        shift: data.shift!,
        email: data.email!,
        phone: data.phone!,
        avatar: `https://i.pravatar.cc/150?u=${Math.random()}`,
        cvUrl:
          "https://drive.google.com/file/d/1-EDqp7nAMLGNI8IwAIpdFVpyS39C-Kyz/view?usp=drive_link",
        presentDays: 28,
        offDays: 2,
      };
      setStaffList([newStaff, ...staffList]);
      toast.success("Staff member added successfully");
    } else if (selectedStaff) {
      setStaffList(
        staffList.map((s) =>
          s.id === selectedStaff.id ? { ...s, ...data } : s,
        ),
      );
      toast.success("Staff member updated successfully");
    }
    setIsStaffModalOpen(false);
  };

  const handleExportReport = async () => {
    toast.info("Preparing Full Staff Report...");

    // Prepare data for export
    const exportData = staffList.map((item) => ({
      "Full Name": item.name,
      Position: item.position,
      Shift: item.shift,
      Email: item.email,
      Phone: item.phone,
      "Present Days": item.presentDays || 0,
      "Off Days": item.offDays || 0,
    }));

    await exportToExcel(
      exportData,
      "Staff_Management_Report.xlsx",
      "Staff Members",
    );
    toast.success("Full Staff Report exported to Excel!");
  };

  const handleDownloadReport = async (staff: Staff) => {
    toast.info(`Generating Excel report for ${staff.name}...`);

    // Prepare single staff data
    const exportData = [
      {
        "Full Name": staff.name,
        Position: staff.position,
        Shift: staff.shift,
        Email: staff.email,
        Phone: staff.phone,
        "Present Days": staff.presentDays || 0,
        "Off Days": staff.offDays || 0,
      },
    ];

    await exportToExcel(
      exportData,
      `${staff.name.replace(/\s+/g, "_")}_Report.xlsx`,
      "Employee Report",
    );
    toast.success(`Excel report for ${staff.name} downloaded!`);
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
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Staff"
            value={staffList.length}
            icon={Users}
            iconColor="#3B82F6"
            iconBgColor="#DBEAFE"
          />
          <StatsCard
            title="On Duty Today"
            value={12}
            icon={UserCheck}
            iconColor="#10B981"
            iconBgColor="#D1FAE5"
          />
          <StatsCard
            title="On Leave"
            value={5}
            icon={UserMinus}
            iconColor="#EF4444"
            iconBgColor="#FEE2E2"
          />
          <StatsCard
            title="Pending Approval"
            value={2}
            icon={Clock}
            iconColor="#F59E0B"
            iconBgColor="#FEF3C7"
          />
        </div>

        {/* Search and Add */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <SearchBar
            placeholder="Search Staff"
            className="max-w-xl bg-white border border-gray-100 shadow-sm"
            onSearch={setSearchQuery}
          />
          <button
            onClick={handleAddStaff}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xs font-bold hover:bg-blue-600 transition-all cursor-pointer text-sm shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Staff
          </button>
        </div>

        {/* Staff Grid */}
        <div className="space-y-6">
          {isLoading ? (
            <StaffGridSkeleton />
          ) : paginatedStaff.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 2xl:gap-6">
                {paginatedStaff.map((staff) => (
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
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={filteredStaff.length}
                  itemsPerPage={itemsPerPage}
                  currentItemsCount={paginatedStaff.length}
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

        {/* Holiday Notifications and Schedule Overview */}
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
        cvUrl={
          selectedStaff?.cvUrl ||
          "https://drive.google.com/file/d/1-EDqp7nAMLGNI8IwAIpdFVpyS39C-Kyz/view?usp=drive_link"
        }
        staffName={selectedStaff?.name}
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
        description={`Are you sure you want to remove ${selectedStaff?.name} from the team? This action cannot be undone.`}
      />
    </div>
  );
}
