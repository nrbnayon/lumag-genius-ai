"use client";

import { useState } from "react";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { StatsCard } from "@/components/Shared/StatsCard";
import { Truck, AlertTriangle, Plus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SupplierModal } from "./SupplierModal";
import { SupplierDetailsModal } from "./SupplierDetailsModal";
import { DeleteConfirmationModal } from "@/components/Shared/DeleteConfirmationModal";
import {
  useGetSupplierOverviewQuery,
  useGetPriceAlertsQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
} from "@/redux/services/suppliersApi";
import type { SupplierDetail, SupplierPayload } from "@/types/supplier";

// Sub-components
import { SupplierOverview } from "./tabs/SupplierOverview";
import { PriceComparison } from "./tabs/PriceComparison";
import { PriceHistory } from "./tabs/PriceHistory";
import { PriceAlerts } from "./tabs/PriceAlerts";
import { ShoppingList } from "./tabs/ShoppingList";
import Link from "next/link";

type SupplierTab =
  | "Overview"
  | "Comparison"
  | "History"
  | "Alerts"
  | "ShoppingList";

export default function SuppliersClient() {
  const [activeTab, setActiveTab] = useState<SupplierTab>("Overview");

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierDetail | null>(null);

  // API data
  const { data: overviewData, isLoading: overviewLoading } = useGetSupplierOverviewQuery();
  const { data: alertsData } = useGetPriceAlertsQuery();

  const [createSupplier, { isLoading: isCreating }] = useCreateSupplierMutation();
  const [updateSupplier, { isLoading: isUpdating }] = useUpdateSupplierMutation();

  const activeSuppliers = overviewData?.summary?.active_suppliers ?? 0;
  const priceAlerts = overviewData?.summary?.price_alerts ?? alertsData?.count ?? 0;

  // Handlers
  const handleAddClick = () => {
    setModalMode("add");
    setSelectedSupplier(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (supplier: SupplierDetail) => {
    setModalMode("edit");
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
    setIsDetailsModalOpen(false);
  };

  const handleViewDetails = (supplier: SupplierDetail) => {
    setSelectedSupplier(supplier);
    setIsDetailsModalOpen(true);
  };

  const handleRemoveClick = (supplier: SupplierDetail) => {
    setSelectedSupplier(supplier);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    // No delete endpoint provided — close modal
    toast.info("Supplier removal is managed by admin approval.");
    setIsDeleteModalOpen(false);
    setIsDetailsModalOpen(false);
  };

  const handleConfirmModal = async (formData: Partial<SupplierPayload>) => {
    try {
      if (modalMode === "add") {
        await createSupplier(formData as SupplierPayload).unwrap();
        toast.success("Supplier added successfully");
      } else if (selectedSupplier) {
        await updateSupplier({
          id: selectedSupplier.id,
          payload: formData,
        }).unwrap();
        toast.success("Supplier updated successfully");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Operation failed. Please try again.");
    }
  };

  const tabs = [
    { id: "Overview", label: "Supplier Overview" },
    { id: "Comparison", label: "Price Comparison" },
    { id: "History", label: "Price History (30 Days)" },
    { id: "Alerts", label: "Price Alerts" },
    { id: "ShoppingList", label: "Shopping List" },
  ];

  return (
    <div className="pb-10">
      <DashboardHeader
        title="Purchasing & Suppliers"
        description="Manage suppliers and track price changes"
      />

      <main className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
        {/* Navigation Breadcrumb (Sub-actions) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-foreground font-bold">Suppliers</span>
            <span className="text-secondary">/</span>
            <span className="text-secondary font-medium">
              Purchased Product
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/suppliers/all-purchase"
              className="border border-border px-4 py-2 rounded-lg hover:bg-gray-100 transition-all cursor-pointer hover:border-primary"
            >
              All Purchases
            </Link>
            <button
              onClick={handleAddClick}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-bold hover:bg-blue-600 transition-all cursor-pointer text-sm shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Add Supplier
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Active Suppliers"
            value={overviewLoading ? "—" : activeSuppliers}
            icon={Truck}
            iconColor="#10B981"
            iconBgColor="#D1FAE5"
          />
          <StatsCard
            title="Price Alerts"
            value={overviewLoading ? "—" : priceAlerts}
            icon={AlertTriangle}
            iconColor="#EF4444"
            iconBgColor="#FEE2E2"
          />
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-100 mt-4 overflow-x-auto no-scrollbar">
          <div className="flex gap-8 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SupplierTab)}
                className={cn(
                  "pb-4 text-sm font-bold transition-all border-b-2 relative whitespace-nowrap cursor-pointer",
                  activeTab === tab.id
                    ? "text-primary border-primary"
                    : "text-secondary border-transparent hover:text-secondary",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modular Content Based on Tab */}
        <div>
          {activeTab === "Overview" && (
            <SupplierOverview
              onViewDetails={handleViewDetails}
            />
          )}

          {activeTab === "Comparison" && <PriceComparison />}

          {activeTab === "History" && <PriceHistory />}

          {activeTab === "Alerts" && <PriceAlerts />}

          {activeTab === "ShoppingList" && <ShoppingList />}
        </div>
      </main>

      {/* Modal Components */}
      <SupplierModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmModal}
        supplier={selectedSupplier}
        mode={modalMode}
        isLoading={isCreating || isUpdating}
      />

      <SupplierDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        supplier={selectedSupplier}
        onEdit={handleEditClick}
        onRemove={handleRemoveClick}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Remove Supplier"
        description={`Are you sure you want to remove "${selectedSupplier?.name}" from your supplier list? This action cannot be undone.`}
      />
    </div>
  );
}
