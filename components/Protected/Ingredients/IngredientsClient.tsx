"use client";

import { useState, useMemo } from "react";
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
  Pencil,
  Trash2,
  FileDown,
  SquarePen,
} from "lucide-react";
import SearchBar from "@/components/Shared/SearchBar";
import { cn } from "@/lib/utils";
import { ingredientsData } from "@/data/ingredientsData";
import {
  Ingredient,
  IngredientFormData,
  IngredientStatus,
} from "@/types/ingredient";
import { DynamicTable } from "@/components/Shared/DynamicTable";
import { IngredientModal } from "./IngredientModal";
import { DeleteConfirmationModal } from "@/components/Shared/DeleteConfirmationModal";
import { ExportModal } from "./ExportModal";
import { toast } from "sonner";

export default function IngredientsClient() {
  const [ingredients, setIngredients] = useState<Ingredient[]>(ingredientsData);
  const [activeTab, setActiveTab] = useState<IngredientStatus | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedIngredient, setSelectedIngredient] =
    useState<Ingredient | null>(null);

  // Filtered data
  const filteredIngredients = useMemo(() => {
    return ingredients.filter((item) => {
      const matchesTab = activeTab === "All" || item.status === activeTab;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [ingredients, activeTab, searchQuery]);

  // Stats
  const stats = useMemo(
    () => ({
      total: ingredients.length,
      lowStock: ingredients.filter((i) => i.currentStock <= i.minimumStock)
        .length,
      purchaseRequest: 22, // Dummy value as seen in image
      pending: ingredients.filter((i) => i.status === "Pending").length,
    }),
    [ingredients],
  );

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
      setSelectedIngredient(null); // Means export all
    }
    setIsExportModalOpen(true);
  };

  const handleConfirmModal = (formData: IngredientFormData) => {
    if (modalMode === "add") {
      const newIngredient: Ingredient = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        price: Number(formData.price),
        unit: formData.unit,
        category: formData.category,
        currentStock: Number(formData.currentStock),
        minimumStock: Number(formData.minimumStock),
        status: "Approved",
        image: formData.image ? URL.createObjectURL(formData.image) : undefined,
      };
      setIngredients([newIngredient, ...ingredients]);
      toast.success("Ingredient added successfully");
    } else if (selectedIngredient) {
      setIngredients(
        ingredients.map((i) =>
          i.id === selectedIngredient.id
            ? {
                ...i,
                ...formData,
                price: Number(formData.price),
                currentStock: Number(formData.currentStock),
                minimumStock: Number(formData.minimumStock),
                image: formData.image
                  ? URL.createObjectURL(formData.image)
                  : i.image,
              }
            : i,
        ),
      );
      toast.success("Ingredient updated successfully");
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedIngredient) {
      setIngredients(ingredients.filter((i) => i.id !== selectedIngredient.id));
      toast.success("Ingredient deleted successfully");
    }
    setIsDeleteModalOpen(false);
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
        key: "name",
        header: "Name",
        render: (_: any, item: Ingredient) => (
          <div className="flex items-center gap-2">
            {item.hasWarning && (
              <AlertTriangle className="w-4 h-4 text-red-500" />
            )}
            <span className="font-bold text-gray-900">{item.name}</span>
          </div>
        ),
      },
      {
        key: "price",
        header: "Price",
        render: (price: number) => `$${price}`,
      },
      {
        key: "unit",
        header: "Unit",
      },
      {
        key: "category",
        header: "Category",
      },
      {
        key: "currentStock",
        header: "Current Stock",
        render: (stock: number, item: Ingredient) =>
          `${stock}${item.unit.toLowerCase()}`,
      },
      {
        key: "minimumStock",
        header: "Minimum Stock",
        render: (stock: number, item: Ingredient) =>
          `${stock}${item.unit.toLowerCase()}`,
      },
      {
        key: "status",
        header: "Status",
        render: (status: string) => (
          <span
            className={cn(
              "px-6 py-1.5 rounded-full text-xs font-bold",
              status === "Approved"
                ? "bg-[#ECFDF5] text-[#10B981]"
                : "bg-[#FEF2F2] text-[#EF4444]",
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
        variant: "warning",
        tooltip: "Edit",
      },
      {
        icon: <Download className="w-4 h-4" />,
        onClick: (item: Ingredient) => handleExportClick(item),
        variant: "primary",
        tooltip: "Export",
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
    <div className="min-h-screen bg-[#F9FAFB] pb-10">
      <DashboardHeader
        title="Ingredients Management"
        description="Manage ingredient inventory, pricing, and purchase requests"
      />

      <main className="p-4 md:p-8 space-y-8">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <SearchBar
              placeholder="Search Ingredients"
              className="max-w-2xl bg-white border border-gray-100 shadow-xs"
              onSearch={setSearchQuery}
            />
          </div>

          <div className="border-b border-gray-200">
            <nav className="flex gap-8">
              {["All", "Approved", "Pending"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={cn(
                    "py-4 px-2 text-sm font-bold transition-all relative cursor-pointer",
                    activeTab === tab
                      ? "text-[#0EA5E9]"
                      : "text-gray-500 hover:text-foreground",
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

          <DynamicTable
            data={filteredIngredients}
            config={tableConfig as any}
            pagination={{ enabled: true, pageSize: 10 }}
            className="overflow-hidden border-none shadow-[0px_4px_16px_0px_#A9A9A940]"
            headerClassName="bg-[#E6F4FF] text-[#505050]"
          />
        </div>
      </main>

      {/* Modals */}
      <IngredientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmModal}
        ingredient={selectedIngredient}
        mode={modalMode}
      />

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
