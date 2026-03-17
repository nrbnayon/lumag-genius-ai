"use client";

import { SquarePen, Download, Trash2, Utensils, DollarSign, Layers, Store } from "lucide-react";
import { Menu } from "@/types/menu";
import { cn } from "@/lib/utils";

interface MenuCardProps {
  menu: Menu;
  onEdit: (menu: Menu) => void;
  onDelete: (menu: Menu) => void;
  onExport: (menu: Menu) => void;
}

export function MenuCard({ menu, onEdit, onDelete, onExport }: MenuCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0px_4px_16px_0px_#A9A9A940] border-none flex flex-col gap-4 relative group hover:shadow-md transition-shadow">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <span
            className={cn(
              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
              menu.approval_status === "approved"
                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                : "bg-amber-50 text-amber-600 border border-amber-100",
            )}
          >
            {menu.approval_status}
          </span>
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100">
            {menu.outlet_type}
          </span>
        </div>
        <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(menu)}
            className="p-2 bg-[#FEF3C7] text-[#F59E0B] rounded-lg hover:bg-yellow-100 transition-colors cursor-pointer"
          >
            <SquarePen className="w-4 h-4" />
          </button>
          <button
            onClick={() => onExport(menu)}
            className="p-2 bg-[#E0F2FE] text-[#0EA5E9] rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(menu)}
            className="p-2 bg-[#FEF2F2] text-[#EF4444] rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-foreground leading-tight">
          {menu.name}
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50/50">
            <div className="p-1.5 bg-white rounded-lg shadow-sm">
              <Layers className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-secondary font-bold uppercase">
                Items
              </span>
              <span className="text-sm font-bold text-foreground">
                {menu?.dishes.length}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50/50">
            <div className="p-1.5 bg-white rounded-lg shadow-sm">
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-secondary font-bold uppercase">
                Cost
              </span>
              <span className="text-sm font-bold text-foreground">
                ${menu?.total_cost}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50/50 col-span-2">
            <div className="p-1.5 bg-white rounded-lg shadow-sm">
              <Utensils className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-secondary font-bold uppercase">
                Menu Type
              </span>
              <span className="text-sm font-bold text-foreground capitalize">
                {menu?.menu_type.toLowerCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
