"use client";

import { useState } from "react";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { StatsCard } from "@/components/Shared/StatsCard";
import {
  Utensils,
  LayoutGrid,
  TrendingUp,
  Clock,
  Plus,
  Download,
  Search,
} from "lucide-react";
import SearchBar from "@/components/Shared/SearchBar";
import { Pagination } from "@/components/Shared/Pagination";
import { DeleteConfirmationModal } from "@/components/Shared/DeleteConfirmationModal";
import { toast } from "sonner";
import { Menu, MenuFormData } from "@/types/menu";
import { MenuCard } from "./MenuCard";
import { MenuModal } from "./MenuModal";
import { MenuExportModal } from "./MenuExportModal";
import { MenuGridSkeleton } from "@/components/Skeleton/MenuSkeleton";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useGetAllMenusQuery,
  useCreateMenusMutation,
  useUpdateMenusMutation,
  useUpdateMenuMutation,
  useDeleteMenuMutation,
} from "@/redux/services/menusApi";

export default function MenuManagementClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

  // API Hooks
  const { data, isLoading, isFetching } = useGetAllMenusQuery({
    page: currentPage,
    page_size: itemsPerPage,
    search_term: debouncedSearch,
  });

  const [createMenus, { isLoading: isCreating }] = useCreateMenusMutation();
  const [updateMenus, { isLoading: isUpdatingBulk }] = useUpdateMenusMutation();
  const [updateMenu, { isLoading: isUpdatingSingle }] = useUpdateMenuMutation();
  const [deleteMenu, { isLoading: isDeleting }] = useDeleteMenuMutation();

  const menus = data?.data || [];
  const totalItems = data?.count || 0;
  const totalPages = data?.total_pages || 1;

  // Handlers
  const handleAddClick = () => {
    setModalMode("add");
    setSelectedMenu(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (menu: Menu) => {
    setModalMode("edit");
    setSelectedMenu(menu);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (menu: Menu) => {
    setSelectedMenu(menu);
    setIsDeleteModalOpen(true);
  };

  const handleExportClick = (menu?: Menu) => {
    if (menu) {
      setSelectedMenu(menu);
    } else {
      setSelectedMenu(null);
    }
    setIsExportModalOpen(true);
  };

  const handleConfirmModal = async (
    formData: MenuFormData | MenuFormData[],
  ) => {
    try {
      if (modalMode === "add") {
        const payload = Array.isArray(formData) ? formData : [formData];
        await createMenus(payload).unwrap();
        toast.success(
          Array.isArray(formData)
            ? `Successfully added ${formData.length} menus`
            : "Menu added successfully",
        );
      } else if (selectedMenu) {
        if (Array.isArray(formData)) {
          await updateMenus(formData).unwrap();
          toast.success(`Updated ${formData.length} menus`);
        } else {
          await updateMenu({ id: selectedMenu.id, data: formData }).unwrap();
          toast.success("Menu updated successfully");
        }
      }
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save menu");
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedMenu) {
      try {
        await deleteMenu(selectedMenu.id).unwrap();
        toast.success("Menu deleted successfully");
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete menu");
      }
    }
    setIsDeleteModalOpen(false);
  };

  const handleConfirmExport = (data: Menu | Menu[]) => {
    const count = Array.isArray(data) ? data.length : 1;
    toast.success(`Exported ${count} menu(s) to Excel`);
    setIsExportModalOpen(false);
  };

  return (
    <div className="pb-10">
      <DashboardHeader
        title="Menu Management"
        description="Manage menu with AI-generated technical sheets and cost analysis"
      />

      <main className="p-4 md:p-8 space-y-8">
        {/* Top Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-4">
          <button
            onClick={handleAddClick}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-bold hover:bg-blue-600 transition-colors cursor-pointer"
          >
            <Plus className="w-5 h-5 font-bold" />
            Add Menu
          </button>
          <button
            onClick={() => handleExportClick()}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-secondary border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Download className="w-5 h-5" />
            Export All
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Menus"
            value={totalItems}
            items-
            icon={Utensils}
            iconColor="#3B82F6"
            iconBgColor="#DBEAFE"
          />
          <StatsCard
            title="Approved"
            value={
              menus.filter((m: Menu) => m.approval_status === "approved").length
            }
            icon={LayoutGrid}
            iconColor="#10B981"
            iconBgColor="#D1FAE5"
          />
          <StatsCard
            title="Pending Approval"
            value={
              menus.filter((m: Menu) => m.approval_status === "pending").length
            }
            icon={Clock}
            iconColor="#F59E0B"
            iconBgColor="#FEF3C7"
          />
          <StatsCard
            title="High Margin items"
            value={5}
            icon={TrendingUp}
            iconColor="#8B5CF6"
            iconBgColor="#EDE9FE"
          />
        </div>

        {/* Search & Grid */}
        <div className="space-y-6">
          <SearchBar
            placeholder="Search Menus"
            className="max-w-2xl bg-white border border-gray-100 shadow-xs"
            onSearch={(val) => {
              setSearchQuery(val);
              setCurrentPage(1);
            }}
          />

          {isLoading || isFetching ? (
            <MenuGridSkeleton />
          ) : menus.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 2xl:gap-6">
                {menus.map((menu) => (
                  <MenuCard
                    key={menu.id}
                    menu={menu}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    onExport={handleExportClick}
                  />
                ))}
              </div>

              <div className="flex justify-center pt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  currentItemsCount={menus.length}
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Search className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                No menus found
              </h3>
              <p className="text-secondary">
                Try adjusting your search to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <MenuModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmModal}
        menu={selectedMenu}
        mode={modalMode}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Menu"
        description={`Are you sure you want to delete "${selectedMenu?.name}"? This action cannot be undone.`}
      />

      <MenuExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleConfirmExport}
        data={selectedMenu || menus}
      />
    </div>
  );
}
