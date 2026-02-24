"use client";

import { useState, useMemo } from "react";
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
import { menuData } from "@/data/menuData";
import { Menu, MenuFormData } from "@/types/menu";
import { MenuCard } from "./MenuCard";
import { MenuModal } from "./MenuModal";
import { MenuExportModal } from "./MenuExportModal";
import { MenuGridSkeleton } from "@/components/Skeleton/MenuSkeleton";

export default function MenuManagementClient() {
  const [menus, setMenus] = useState<Menu[]>(menuData);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 8;

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

  // Filtered data
  const filteredMenus = useMemo(() => {
    return menus.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [menus, searchQuery]);

  // Paginated data
  const paginatedMenus = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMenus.slice(start, start + itemsPerPage);
  }, [filteredMenus, currentPage]);

  const totalPages = Math.ceil(filteredMenus.length / itemsPerPage);

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

  const handleConfirmModal = (formData: MenuFormData) => {
    if (modalMode === "add") {
      const newMenu: Menu = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        type: formData.type,
        cost: formData.cost,
        dishes: formData.dishes,
        itemsCount: formData.dishes.length,
        status: "Pending",
        image: formData.image ? URL.createObjectURL(formData.image) : undefined,
      };
      setMenus([newMenu, ...menus]);
      toast.success("Menu added successfully");
    } else if (selectedMenu) {
      setMenus(
        menus.map((m) =>
          m.id === selectedMenu.id
            ? {
                ...m,
                name: formData.name,
                type: formData.type,
                cost: formData.cost,
                dishes: formData.dishes,
                itemsCount: formData.dishes.length,
                image: formData.image
                  ? URL.createObjectURL(formData.image)
                  : m.image,
              }
            : m,
        ),
      );
      toast.success("Menu updated successfully");
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedMenu) {
      setMenus(menus.filter((m) => m.id !== selectedMenu.id));
      toast.success("Menu deleted successfully");
    }
    setIsDeleteModalOpen(false);
  };

  const handleConfirmExport = (data: Menu | Menu[]) => {
    const count = Array.isArray(data) ? data.length : 1;
    toast.success(`Exported ${count} menu(s) to Excel`);
    setIsExportModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-10">
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
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-gray-500 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Download className="w-5 h-5" />
            Export All
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Menus"
            value={6}
            icon={Utensils}
            iconColor="#EF4444"
            iconBgColor="#FEE2E2"
          />
          <StatsCard
            title="Total Menus Items"
            value={60}
            icon={LayoutGrid}
            iconColor="#3B82F6"
            iconBgColor="#DBEAFE"
          />
          <StatsCard
            title="High Margin items"
            value={5}
            icon={TrendingUp}
            iconColor="#10B981"
            iconBgColor="#D1FAE5"
          />
          <StatsCard
            title="Pending Approval"
            value={2}
            icon={Clock}
            iconColor="#F59E0B"
            iconBgColor="#FEF3C7"
          />
        </div>

        {/* Search & Grid */}
        <div className="space-y-6">
          <SearchBar
            placeholder="Search Menus"
            className="max-w-2xl bg-white border border-gray-100 shadow-xs"
            onSearch={(val) => {
              setLoading(true);
              setSearchQuery(val);
              setTimeout(() => setLoading(false), 500);
            }}
          />

          {loading ? (
            <MenuGridSkeleton />
          ) : filteredMenus.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 2xl:gap-6">
                {paginatedMenus.map((menu) => (
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
                  totalItems={filteredMenus.length}
                  itemsPerPage={itemsPerPage}
                  currentItemsCount={paginatedMenus.length}
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Search className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No menus found
              </h3>
              <p className="text-gray-500">
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
