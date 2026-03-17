"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { PurchaseTable } from "./PurchaseTable";
import { PurchaseModal } from "./PurchaseModal";
import { PurchaseSkeleton } from "@/components/Skeleton/PurchaseSkeleton";
import {
  useGetAllPurchasesQuery,
  useCreatePurchasesMutation,
} from "@/redux/services/suppliersApi";
import type { CreatePurchasePayload } from "@/types/supplier";
import { toast } from "sonner";

export default function AllPurchasesClient() {
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAddOtherOpen, setIsAddOtherOpen] = useState(false);

  // Fetch regular (non-special) purchases
  const regularQuery = useGetAllPurchasesQuery({ is_special: false });
  // Fetch special (other) purchases
  const specialQuery = useGetAllPurchasesQuery({ is_special: true });

  const [createPurchases, { isLoading: isCreating }] = useCreatePurchasesMutation();

  const handleAddPurchase = async (formData: Partial<CreatePurchasePayload>) => {
    try {
      await createPurchases([
        {
          supplier_name: formData.supplier_name ?? "",
          product_name: formData.product_name ?? "",
          category_name: formData.category_name ?? "",
          unit: formData.unit ?? "",
          price: formData.price ?? 0,
          quantity: formData.quantity ?? 0,
          purchase_date: formData.purchase_date ?? "",
          is_special: false,
          remarks: formData.remarks ?? "",
          outlet_type: formData.outlet_type ?? "restaurant",
        },
      ]).unwrap();
      setIsAddOpen(false);
      toast.success("Purchase added successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to add purchase.");
    }
  };

  const handleAddOther = async (formData: Partial<CreatePurchasePayload>) => {
    try {
      await createPurchases([
        {
          supplier_name: formData.supplier_name ?? "",
          product_name: formData.product_name ?? "",
          category_name: formData.category_name ?? "",
          unit: formData.unit ?? "",
          price: formData.price ?? 0,
          quantity: formData.quantity ?? 0,
          purchase_date: formData.purchase_date ?? "",
          is_special: true,
          remarks: formData.remarks ?? "",
          outlet_type: formData.outlet_type ?? "bar",
        },
      ]).unwrap();
      setIsAddOtherOpen(false);
      toast.success("Other product added successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to add other product.");
    }
  };

  const isLoading = regularQuery.isLoading && specialQuery.isLoading;

  if (isLoading) {
    return (
      <div className="pb-10">
        <DashboardHeader
          title="Purchasing & Suppliers"
          description="Manage suppliers and track price changes"
        />
        <PurchaseSkeleton />
      </div>
    );
  }

  return (
    <div className="pb-10">
      <DashboardHeader
        title="Purchasing & Suppliers"
        description="Manage suppliers and track price changes"
      />

      <main className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
        {/* Top bar: title + search + buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-foreground">
            All Purchased List
          </h2>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Products"
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-full text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Add Purchase */}
            <button
              onClick={() => setIsAddOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-bold hover:bg-blue-600 transition-all cursor-pointer text-sm shadow-sm active:scale-95 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Add Purchase
            </button>

            {/* Add Others */}
            <button
              onClick={() => setIsAddOtherOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-bold hover:bg-blue-600 transition-all cursor-pointer text-sm shadow-sm active:scale-95 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Add Others
            </button>
          </div>
        </div>

        {/* All Purchased List table (regular) */}
        <PurchaseTable
          title=""
          queryParams={{ is_special: false }}
          isSpecial={false}
          externalSearch={search}
        />

        {/* Other Product table (special) */}
        <PurchaseTable
          title="Other Product"
          subtitle="(These products are special and for special events)"
          queryParams={{ is_special: true }}
          isSpecial={true}
          externalSearch={search}
        />
      </main>

      {/* Global Add Purchase Modal */}
      <PurchaseModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onConfirm={handleAddPurchase}
        mode="add"
        type="purchase"
        isLoading={isCreating}
      />

      {/* Global Add Others Modal */}
      <PurchaseModal
        isOpen={isAddOtherOpen}
        onClose={() => setIsAddOtherOpen(false)}
        onConfirm={handleAddOther}
        mode="add"
        type="other"
        isLoading={isCreating}
      />
    </div>
  );
}
