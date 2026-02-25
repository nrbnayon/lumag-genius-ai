"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { PurchaseTable } from "./PurchaseTable";
import { PurchaseModal } from "./PurchaseModal";
import { purchasesData, otherProductsData } from "@/data/purchaseData";
import type { Purchase } from "@/types/supplier";
import { toast } from "sonner";

export default function AllPurchasesClient() {
  const [search, setSearch] = useState("");

  // Global add-purchase modal (from header button)
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAddOtherOpen, setIsAddOtherOpen] = useState(false);

  // Local copies so tables can be seeded from the same state
  const [purchases, setPurchases] = useState<Purchase[]>(purchasesData);
  const [others, setOthers] = useState<Purchase[]>(otherProductsData);

  const handleAddPurchase = (data: Partial<Purchase>) => {
    const item: Purchase = {
      id: `p-${Date.now()}`,
      productName: data.productName ?? "",
      price: data.price ?? "$0",
      unit: data.unit ?? "",
      category: data.category ?? "Vegetable",
      quantity: data.quantity ?? 0,
      supplierName: data.supplierName ?? "",
      purchaseDate: data.purchaseDate ?? "",
    };
    setPurchases((prev) => [item, ...prev]);
    setIsAddOpen(false);
    toast.success("Purchase added!");
  };

  const handleAddOther = (data: Partial<Purchase>) => {
    const item: Purchase = {
      id: `op-${Date.now()}`,
      productName: data.productName ?? "",
      price: data.price ?? "$0",
      unit: data.unit ?? "",
      category: data.category ?? "Other",
      quantity: data.quantity ?? 0,
      supplierName: data.supplierName ?? "",
      purchaseDate: data.purchaseDate ?? "",
    };
    setOthers((prev) => [item, ...prev]);
    setIsAddOtherOpen(false);
    toast.success("Other product added!");
  };

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

        {/* All Purchased List table */}
        <PurchaseTable
          title=""
          initialData={purchases.filter((p) =>
            search
              ? p.productName.toLowerCase().includes(search.toLowerCase()) ||
                p.supplierName.toLowerCase().includes(search.toLowerCase())
              : true,
          )}
          modalType="purchase"
        />

        {/* Other Product table */}
        <PurchaseTable
          title="Other Product"
          subtitle="(These products are special and for special events)"
          initialData={others.filter((p) =>
            search
              ? p.productName.toLowerCase().includes(search.toLowerCase()) ||
                p.supplierName.toLowerCase().includes(search.toLowerCase())
              : true,
          )}
          modalType="other"
        />
      </main>

      {/* Global Add Purchase Modal */}
      <PurchaseModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onConfirm={handleAddPurchase}
        mode="add"
        type="purchase"
      />

      {/* Global Add Others Modal */}
      <PurchaseModal
        isOpen={isAddOtherOpen}
        onClose={() => setIsAddOtherOpen(false)}
        onConfirm={handleAddOther}
        mode="add"
        type="other"
      />
    </div>
  );
}
