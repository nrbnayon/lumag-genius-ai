"use client";

import { X, Download, FileSpreadsheet, Eye, Info } from "lucide-react";
import { Menu } from "@/types/menu";
import { exportToExcel } from "@/lib/excel";

interface MenuExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (data: Menu | Menu[]) => void;
  data: Menu | Menu[];
}

export function MenuExportModal({
  isOpen,
  onClose,
  onExport,
  data,
}: MenuExportModalProps) {
  if (!isOpen) return null;

  const handleExport = async () => {
    const exportData = Array.isArray(data) ? data : [data];

    // Transform data for Excel
    const worksheetData = exportData.map((menu) => ({
      "Menu Name": menu.name,
      Type: menu.menu_type,
      "Select Dishes": menu.dishes.map(d => d.name).join(", "),
      "Total Cost": menu.total_cost,
      Status: menu.approval_status,
    }));

    const fileName = Array.isArray(data)
      ? "all_menus.xlsx"
      : `${data.name.toLowerCase().replace(/\s+/g, "_")}_details.xlsx`;

    await exportToExcel(worksheetData, fileName, "Menus");
    onExport(data);
  };

  const sample = Array.isArray(data) ? data[0] : data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 rounded-xl">
              <FileSpreadsheet className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground leading-none">Export Preview</h2>
              <p className="text-xs text-secondary mt-1 font-medium">Review your data before generating Excel file</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          <div className="flex items-center gap-2 mb-4 text-primary bg-blue-50/50 p-3 rounded-xl border border-blue-100">
            <Info className="w-4 h-4" />
            <p className="text-xs font-bold uppercase tracking-wider">
              {Array.isArray(data) ? `Exporting all ${data.length} menus` : "Exporting selected menu details"}
            </p>
          </div>

          <div className="border border-gray-100 rounded-2xl overflow-hidden mb-8 shadow-sm">
            <div className="max-h-[40vh] overflow-y-auto custom-scrollbar">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-gray-50/80 text-secondary font-bold sticky top-0 backdrop-blur-sm">
                  <tr>
                    <th className="p-4 border-b border-gray-100">Menu name</th>
                    <th className="p-4 border-b border-gray-100 text-center">Type</th>
                    <th className="p-4 border-b border-gray-100">Select Dishes</th>
                    <th className="p-4 border-b border-gray-100 text-right">Total Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(Array.isArray(data) ? data.slice(0, 5) : [data]).map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 font-bold text-foreground">
                        {item.name}
                      </td>
                      <td className="p-4 text-center">
                        <span className="px-2.5 py-1 bg-gray-100 rounded-lg text-[10px] font-bold uppercase text-secondary tracking-wider">
                          {item.menu_type.toLowerCase()}
                        </span>
                      </td>
                      <td className="p-4 text-secondary font-medium">
                        <div className="max-w-[250px] truncate" title={item.dishes.map(d => d.name).join(", ")}>
                          {item.dishes.map(d => d.name).join(", ")}
                        </div>
                      </td>
                      <td className="p-4 text-right font-bold text-foreground">
                        ${item.total_cost}
                      </td>
                    </tr>
                  ))}
                  {Array.isArray(data) && data.length > 5 && (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-gray-400 bg-gray-50/30">
                        <p className="text-xs font-medium italic">And {data.length - 5} more items...</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-200 rounded-2xl text-secondary font-bold hover:bg-gray-50 transition-all flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              className="px-8 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-blue-600 shadow-lg hover:shadow-primary/30 transition-all flex-[2] flex items-center justify-center gap-2 group transform active:scale-95"
            >
              <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
              <span>Generate Excel File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
