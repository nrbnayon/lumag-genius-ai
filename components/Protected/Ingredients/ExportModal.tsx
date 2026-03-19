"use client";

import { X, Download } from "lucide-react";
import { Ingredient } from "@/types/ingredients.types";
import { exportToExcel } from "@/lib/excel";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (data: Ingredient | Ingredient[]) => void;
  data: Ingredient | Ingredient[];
}

export function ExportModal({
  isOpen,
  onClose,
  onExport,
  data,
}: ExportModalProps) {
  if (!isOpen) return null;

  const handleExport = async () => {
    const exportData = Array.isArray(data) ? data : [data];

    // Transform data for Excel
    const worksheetData = exportData.map((item) => ({
      ID: item.id, // ID is crucial for bulk updates
      "Ingredient Name": item.name,
      Price: item.price_per_unit,
      Unit: item.unit.toUpperCase(),
      Category: item.category_name || String(item.category || ""),
      "Outlet Type": item.outlet_type,
      "Current Stock": item.current_stock,
      "Minimum Stock": item.minimum_stock,
      Status: item.status,
      "Approval Status": item.approval_status,
      IsFeatured: item.is_special ? "Yes" : "No",
    }));

    // Generate file name
    const fileName = Array.isArray(data)
      ? "all_ingredients.xlsx"
      : `${data.name.toLowerCase().replace(/\s+/g, "_")}_details.xlsx`;

    await exportToExcel(worksheetData, fileName, "Ingredients");
    onExport(data);
  };

  const sample = Array.isArray(data) ? data[0] : data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-gray-400 hover:text-secondary transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">Prepare Export</h2>
            <div className="px-4 py-1.5 bg-gray-50 rounded-full border border-gray-100 flex items-center gap-2">
               <span className="w-2 h-2 bg-green-500 rounded-full pulse"></span>
               <span className="text-sm font-bold text-secondary">
                 {Array.isArray(data) ? data.length : 1} Items Staged
               </span>
            </div>
          </div>

          <div className="mb-6 bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg text-[#0EA5E9]">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Exporting for Bulk Updates?</p>
              <p className="text-xs text-secondary mt-1">
                The exported file will include unique **IDs**. Keep these IDs intact if you plan to re-upload this file to update existing ingredients.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-0 border border-gray-100 rounded-lg overflow-hidden text-center text-sm font-medium mb-8">
            <div className="bg-gray-50/50 p-2 border-r border-gray-100">
              <p className="text-primary mb-2 font-semibold p-2 border-b border-gray-100">ID</p>
              <p className="text-foreground">{sample?.id || "---"}</p>
            </div>
            <div className="bg-gray-50/50 p-2 border-r border-gray-100">
              <p className="text-primary mb-2 font-semibold p-2 border-b border-gray-100">Ingredient name</p>
              <p className="text-foreground">{sample?.name || "Chicken"}</p>
            </div>
            <div className="bg-gray-50/50 p-2 border-r border-gray-100">
              <p className="text-primary mb-2 font-semibold p-2 border-b border-gray-100">Unit</p>
              <p className="text-foreground uppercase">{sample?.unit || "Kg"}</p>
            </div>
            <div className="bg-gray-50/50 p-2 border-r border-gray-100">
              <p className="text-primary mb-2 font-semibold p-2 border-b border-gray-100">Price</p>
              <p className="text-foreground">${sample?.price_per_unit || "20"}</p>
            </div>
            <div className="bg-gray-50/50 p-2 border-r border-gray-100">
              <p className="text-primary mb-2 font-semibold p-2 border-b border-gray-100">Current Stock</p>
              <p className="text-foreground">{sample?.current_stock ?? "20"}</p>
            </div>
            <div className="bg-gray-50/50 p-2 border-r border-gray-100">
              <p className="text-primary mb-2 font-semibold p-2 border-b border-gray-100">Minimum Stock</p>
              <p className="text-foreground">{sample?.minimum_stock ?? "12"}</p>
            </div>
            <div className="bg-gray-50/50 p-2">
              <p className="text-primary mb-2 font-semibold p-2 border-b border-gray-100">Category</p>
              <p className="text-foreground">{sample?.category_name || String(sample?.category || "Others")}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-200 rounded-xl text-foreground font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              className="flex-1 px-6 py-3 bg-[#0EA5E9] text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
