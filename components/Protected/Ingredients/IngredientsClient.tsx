"use client";

import { useState, useMemo, useEffect } from "react";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { StatsCard } from "@/components/Shared/StatsCard";
import {
  Package,
  ShoppingCart,
  ArrowDownCircle,
  Clock,
  Plus,
  Download,
  AlertTriangle,
  Trash2,
  SquarePen,
} from "lucide-react";
import SearchBar from "@/components/Shared/SearchBar";
import { cn } from "@/lib/utils";
import {
  useGetAllIngredientsQuery,
  useDeleteIngredientMutation,
} from "@/redux/services/ingredientsApi";
import type {
  Ingredient,
} from "@/types/ingredients.types";
import { DynamicTable } from "@/components/Shared/DynamicTable";
import { TablePagination } from "@/components/Shared/TablePagination";
import { IngredientModal } from "./IngredientModal";
import { DeleteConfirmationModal } from "@/components/Shared/DeleteConfirmationModal";
import { ExportModal } from "./ExportModal";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/Skeleton/TableSkeleton";

export default function IngredientsClient() {
  // Query parameters state
  const [activeTab, setActiveTab] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Tab change resets page
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Fetch from API
  const {
    data: ingredientsResponse,
    isFetching,
    isError,
  } = useGetAllIngredientsQuery({
    page: currentPage,
    page_size: pageSize,
    search_term: debouncedSearch,
    outlet_type: activeTab !== "All" ? activeTab : undefined,
  });

  const [deleteIngredient] = useDeleteIngredientMutation();

  const ingredients = ingredientsResponse?.data || [];
  const totalItems = ingredientsResponse?.count || 0;
  const totalPages = ingredientsResponse?.total_pages || 0;
  const summary = ingredientsResponse?.summary;

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedIngredient, setSelectedIngredient] =
    useState<Ingredient | null>(null);

  // Stats calculation
  const stats = useMemo(() => {
    return {
      total: summary?.total_ingredients ?? totalItems,
      lowStock:
        summary?.low_stock_items ??
        ingredients.filter(
          (i) => i.status === "low" || i.current_stock <= i.minimum_stock,
        ).length,
      purchaseRequest: summary?.purchase_requests ?? 0,
      pending:
        summary?.pending_approval ??
        ingredients.filter((i) => i.approval_status === "pending").length,
    };
  }, [ingredients, summary, totalItems]);

  // Handlers
  const handleAddClick = () => {
    setModalMode("add");
    setSelectedIngredient(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (ingredient: Ingredient) => {
    setModalMode("edit");
    setSelectedIngredient(ingredient);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setIsDeleteModalOpen(true);
  };

  const handleExportClick = (ingredient?: Ingredient) => {
    if (ingredient) {
      setSelectedIngredient(ingredient);
    } else {
      setSelectedIngredient(null);
    }
    setIsExportModalOpen(true);
  };

  // Ingredient Create / Edit success callback from Modal
  const handleMutationSuccess = () => {
    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedIngredient) return;
    try {
      await deleteIngredient(selectedIngredient.id).unwrap();
      toast.success("Ingredient deleted successfully.");
      setIsDeleteModalOpen(false);

      // Auto-paginate back if we delete the last item on a page
      if (ingredients.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete ingredient.");
    }
  };



  const handleConfirmExport = (data: Ingredient | Ingredient[]) => {
    const count = Array.isArray(data) ? data.length : 1;
    toast.success(
      `Successfully exported ${count} ingredient${count > 1 ? "s" : ""} to Excel`,
    );
    setIsExportModalOpen(false);
  };

  // Table Configuration
  const tableConfig = {
    columns: [
      {
        key: "outlet_type",
        header: "Outlet Type",
        render: (outlet_type: string) => (
          <span className="capitalize">{outlet_type}</span>
        ),
      },
      {
        key: "name",
        header: "Name",
        render: (_: any, item: Ingredient) => {
          const isLowStock =
            item.status === "low" ||
            item.status === "non" ||
            item.current_stock <= item.minimum_stock;
          return (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                {isLowStock && (
                  <span
                    className="cursor-help"
                    title={
                      item.current_stock === 0 ? "Empty stock" : "Low stock"
                    }
                  >
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  </span>
                )}
                <span className="font-bold text-foreground">{item.name}</span>
                {item.is_special && (
                  <span className="px-2 py-0.5 bg-blue-100 text-[#0190fe] text-[10px] font-bold rounded uppercase">
                    Special
                  </span>
                )}
              </div>
            </div>
          );
        },
      },
      {
        key: "category",
        header: "Category",
        align: "center",
      },
      {
        key: "price_per_unit",
        header: "Price",
        render: (price_per_unit: string) => `$${price_per_unit}`,
      },
      {
        key: "current_stock",
        header: "Current Stock",
        align: "center",
        render: (stock: number, item: Ingredient) =>
          `${stock}${item.unit.toLowerCase()}`,
      },
      {
        key: "minimum_stock",
        header: "Minimum Stock",
        align: "center",
        render: (stock: number, item: Ingredient) =>
          `${stock}${item.unit.toLowerCase()}`,
      },
      {
        key: "unit",
        header: "Unit",
        render: (unit: string) => <span className="uppercase">{unit}</span>,
      },
      {
        key: "approval_status",
        header: "Approve Status",
        align: "center",
        render: (status: string) => (
          <span
            className={cn(
              "px-3 py-1 pb-[3px] rounded-full text-[11px] font-bold uppercase",
              status.toLowerCase() === "approved"
                ? "bg-[#ECFDF5] text-[#10B981]"
                : status.toLowerCase() === "rejected"
                  ? "bg-[#FEF2F2] text-[#EF4444]"
                  : "bg-orange-50 text-orange-500",
            )}
          >
            {status}
          </span>
        ),
      },
    ],
    showActions: true,
    actions: [
      {
        icon: <SquarePen className="w-4 h-4" />,
        onClick: (item: Ingredient) => handleEditClick(item),
        variant: "primary",
        tooltip: "Edit",
      },
      {
        icon: <Trash2 className="w-4 h-4" />,
        onClick: (item: Ingredient) => handleDeleteClick(item),
        variant: "danger",
        tooltip: "Delete",
      },
    ],
  };

  return (
    <div className="pb-10">
      <DashboardHeader
        title="Ingredients Management"
        description="Manage ingredient inventory, pricing, and purchase requests"
      />

      <main className="p-4 md:p-8 space-y-8 flex-1 w-full max-w-[1700px] mx-auto overflow-hidden">
        {/* Top Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-4">
          <button
            onClick={handleAddClick}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#E0F2FE] text-[#0EA5E9] rounded-lg font-bold hover:bg-blue-100 transition-colors cursor-pointer"
          >
            <Plus className="w-5 h-5 font-bold" />
            Add Ingredients
          </button>
          <button
            onClick={() => handleExportClick()}
            className="flex items-center justify-center gap-2 px-6 py-2.5 border border-[#0EA5E9] bg-white text-[#0EA5E9] rounded-lg font-bold hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Download className="w-5 h-5 text-[#0EA5E9]" />
            Export All
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatsCard
            title="Total Ingredients"
            value={stats.total}
            icon={Package}
            iconColor="#10B981"
            iconBgColor="#D1FAE5"
          />
          <StatsCard
            title="Low Stock Items"
            value={stats.lowStock}
            icon={ShoppingCart}
            iconColor="#EF4444"
            iconBgColor="#FEE2E2"
          />
          <StatsCard
            title="Purchase Request"
            value={stats.purchaseRequest}
            icon={ArrowDownCircle}
            iconColor="#3B82F6"
            iconBgColor="#DBEAFE"
          />
          <StatsCard
            title="Pending Approval"
            value={stats.pending}
            icon={Clock}
            iconColor="#F59E0B"
            iconBgColor="#FEF3C7"
          />
        </div>

        {/* Filters & Table */}
        <div className="space-y-6 w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <SearchBar
              placeholder="Search Ingredients"
              className="w-full max-w-2xl bg-white border border-gray-100 shadow-xs"
              onSearch={setSearchQuery}
            />
          </div>

          <div className="border-b border-gray-200">
            <nav className="flex gap-8">
              {["All", "Bar", "Restaurant"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={cn(
                    "py-4 px-2 text-sm font-bold transition-all relative cursor-pointer",
                    activeTab === tab
                      ? "text-[#0EA5E9]"
                      : "text-secondary hover:text-foreground",
                  )}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0EA5E9]" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="bg-white rounded-[24px] shadow-[0px_4px_16px_0px_#A9A9A940] overflow-hidden w-full overflow-x-auto min-h-[400px] flex flex-col">
            {isFetching && ingredients.length === 0 ? (
              <TableSkeleton rowCount={8} />
            ) : isError ? (
              <div className="p-12 text-center text-red-500 flex-1 flex flex-col items-center justify-center h-[300px]">
                <p>Failed to load ingredients. Please try again.</p>
              </div>
            ) : (
              <>
                <DynamicTable
                  data={ingredients}
                  config={tableConfig as any}
                  pagination={{ enabled: false }} // Rely on backend pagination below
                  className="rounded-t-[24px] shadow-none w-full"
                  headerClassName="bg-[#E6F4FF] text-[#505050]"
                  emptyMessage="No ingredients found matching your criteria."
                />

                {/* Native Server Side Pagination */}
                {totalItems > 0 && (
                  <div className="mt-auto border-t border-gray-100 bg-white rounded-b-[24px]">
                    <TablePagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={totalItems}
                      itemsPerPage={pageSize}
                      onPageChange={setCurrentPage}
                      onPageSizeChange={setPageSize}
                      pageSizeOptions={[5, 10, 20, 50, 100]}
                      showPageSize={true}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      {isModalOpen && (
        <IngredientModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleMutationSuccess}
          ingredient={selectedIngredient}
          mode={modalMode}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Ingredient"
        description={`Are you sure you want to delete "${selectedIngredient?.name}"? This action cannot be undone.`}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleConfirmExport}
        data={selectedIngredient || ingredients}
      />
    </div>
  );
}
