"use client";

import { useState } from "react";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { StatsCard } from "@/components/Shared/StatsCard";
import { Truck, AlertTriangle, Plus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  suppliersData,
  priceComparisonData,
  priceAlertsData,
  productHistoryData,
} from "@/data/supplierData";
import { Supplier } from "@/types/supplier";
import { SupplierModal } from "./SupplierModal";
import { SupplierDetailsModal } from "./SupplierDetailsModal";
import { DeleteConfirmationModal } from "@/components/Shared/DeleteConfirmationModal";

// Sub-components
import { SupplierOverview } from "./tabs/SupplierOverview";
import { PriceComparison } from "./tabs/PriceComparison";
import { PriceHistory } from "./tabs/PriceHistory";
import { PriceAlerts } from "./tabs/PriceAlerts";

type SupplierTab = "Overview" | "Comparison" | "History" | "Alerts";

export default function SuppliersClient() {
  const [activeTab, setActiveTab] = useState<SupplierTab>("Overview");
  const [suppliers, setSuppliers] = useState<Supplier[]>(suppliersData);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );

  // Handlers
  const handleAddClick = () => {
    setModalMode("add");
    setSelectedSupplier(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (supplier: Supplier) => {
    setModalMode("edit");
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
    setIsDetailsModalOpen(false);
  };

  const handleViewDetails = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsDetailsModalOpen(true);
  };

  const handleRemoveClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedSupplier) {
      setSuppliers(suppliers.filter((s) => s.id !== selectedSupplier.id));
      toast.success(`Supplier "${selectedSupplier.name}" removed successfully`);
      setIsDeleteModalOpen(false);
      setIsDetailsModalOpen(false);
    }
  };

  const handleConfirmModal = (formData: Partial<Supplier>) => {
    if (modalMode === "add") {
      const newSupplier: Supplier = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name!,
        phone: formData.phone!,
        email: formData.email!,
        address: formData.address!,
        rating: 4.5,
        itemsCount: 0,
        ...formData,
      };
      setSuppliers([newSupplier, ...suppliers]);
      toast.success("Supplier added successfully");
    } else if (selectedSupplier) {
      setSuppliers(
        suppliers.map((s) =>
          s.id === selectedSupplier.id ? { ...s, ...formData } : s,
        ),
      );
      toast.success("Supplier updated successfully");
    }
    setIsModalOpen(false);
  };

  const tabs = [
    { id: "Overview", label: "Supplier Overview" },
    { id: "Comparison", label: "Price Comparison" },
    { id: "History", label: "Price History (30 Days)" },
    { id: "Alerts", label: "Price Alerts" },
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
          <button
            onClick={handleAddClick}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-bold hover:bg-blue-600 transition-all cursor-pointer text-sm shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Supplier
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Active Suppliers"
            value={suppliers.length}
            icon={Truck}
            iconColor="#10B981"
            iconBgColor="#D1FAE5"
          />
          <StatsCard
            title="Price Alerts"
            value={priceAlertsData.length}
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
              suppliers={suppliers}
              onViewDetails={handleViewDetails}
            />
          )}

          {activeTab === "Comparison" && (
            <PriceComparison data={priceComparisonData} />
          )}

          {activeTab === "History" && (
            <PriceHistory data={productHistoryData} />
          )}

          {activeTab === "Alerts" && <PriceAlerts alerts={priceAlertsData} />}
        </div>
      </main>

      {/* Modal Components */}
      <SupplierModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmModal}
        supplier={selectedSupplier}
        mode={modalMode}
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
