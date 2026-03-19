"use client";

import { X, Edit, Trash2, Utensils, DollarSign, Layers } from "lucide-react";
import { Menu } from "@/types/menu";

interface MenuDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  menu: Menu | null;
  onEdit: (menu: Menu) => void;
  onDelete: (menu: Menu) => void;
}

export function MenuDetailsModal({ isOpen, onClose, menu, onEdit, onDelete }: MenuDetailsModalProps) {
  if (!isOpen || !menu) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        <div className="flex flex-col p-6 space-y-6 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{menu.name}</h2>
              <p className="text-sm font-bold text-secondary uppercase mt-1">{menu.outlet_type}</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3 border border-gray-100">
              <div className="p-2 bg-white rounded-xl shadow-sm"><Layers className="w-5 h-5 text-blue-500" /></div>
              <div>
                <p className="text-[10px] text-secondary font-bold uppercase">Items</p>
                <p className="font-bold">{menu.dishes.length}</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3 border border-gray-100">
              <div className="p-2 bg-white rounded-xl shadow-sm"><DollarSign className="w-5 h-5 text-emerald-500" /></div>
              <div>
                <p className="text-[10px] text-secondary font-bold uppercase">Total Cost</p>
                <p className="font-bold">${menu.total_cost}</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3 col-span-2 border border-gray-100">
              <div className="p-2 bg-white rounded-xl shadow-sm"><Utensils className="w-5 h-5 text-amber-500" /></div>
              <div>
                <p className="text-[10px] text-secondary font-bold uppercase">Menu Type</p>
                <p className="font-bold capitalize">{menu.menu_type.toLowerCase()}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-foreground">Dishes Included</h3>
            <div className="flex flex-wrap gap-2">
              {menu.dishes.map((dish: any) => (
                <span key={dish.id} className="px-3 py-1.5 bg-blue-50 text-primary text-xs font-bold rounded-xl border border-blue-100">
                  {dish.name}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => {
                onClose();
                onDelete(menu);
              }}
              className="px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2 cursor-pointer flex-1"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(menu);
              }}
              className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 cursor-pointer flex-1"
            >
              <Edit className="w-4 h-4" /> Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
