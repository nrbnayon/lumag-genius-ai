"use client";

import { useState } from "react";
import { X, Plus, Trash2, ShoppingCart, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetShoppingListQuery } from "@/redux/services/suppliersApi";
import { toast } from "sonner";

interface LocalItem {
  id: string;
  name: string;
  isMissing: boolean;
  isSpecial: boolean;
  otherValue?: string;
}

export function ShoppingList() {
  const { data, isLoading } = useGetShoppingListQuery();

  // Local "extra" items added by the user in this session
  const [localExtras, setLocalExtras] = useState<LocalItem[]>([]);

  // Track missing status for API items
  const [missingRegular, setMissingRegular] = useState<Set<string>>(new Set());
  const [missingSpecial, setMissingSpecial] = useState<Set<string>>(new Set());

  const regularItems = data?.grouped_data?.regular_items ?? [];
  const specialItems = data?.grouped_data?.special_items ?? [];

  const addExtra = () => {
    const newItem: LocalItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: "",
      isMissing: false,
      isSpecial: true,
      otherValue: "",
    };
    setLocalExtras((prev) => [...prev, newItem]);
  };

  const removeExtra = (id: string) => {
    setLocalExtras((prev) => prev.filter((item) => item.id !== id));
    toast.success("Item removed from special list");
  };

  const updateExtraValue = (id: string, value: string) => {
    setLocalExtras((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, otherValue: value, name: value } : item,
      ),
    );
  };

  const toggleExtraMissing = (id: string) => {
    setLocalExtras((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isMissing: !item.isMissing } : item,
      ),
    );
  };

  const toggleRegularMissing = (name: string) => {
    setMissingRegular((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const toggleSpecialMissing = (name: string) => {
    setMissingSpecial((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-3xl p-8 shadow-[0px_4px_16px_0px_#A9A9A940] border border-gray-100 animate-pulse">
          <div className="h-7 w-36 bg-gray-100 rounded mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-1">
                <div className="h-4 w-32 bg-gray-100 rounded" />
                <div className="h-5 w-5 rounded border bg-gray-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-8 shadow-[0px_4px_16px_0px_#A9A9A940] border border-gray-100">
        {/* Regular Items */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
            <ShoppingCart className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Shopping List</h2>
          <span className="text-xs text-secondary bg-gray-100 px-2 py-0.5 rounded-full">
            {regularItems.length} regular items
          </span>
        </div>

        {regularItems.length === 0 ? (
          <p className="text-secondary text-sm italic mb-6">No regular items in shopping list.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 mb-8">
            {regularItems.map((name) => {
              const isMissing = missingRegular.has(name);
              return (
                <div
                  key={name}
                  className="flex items-center justify-start gap-2 group cursor-pointer py-1"
                  onClick={() => toggleRegularMissing(name)}
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded border flex items-center justify-center transition-all shrink-0",
                      isMissing
                        ? "bg-white border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.2)]"
                        : "bg-white border-gray-200 group-hover:border-primary",
                    )}
                  >
                    {isMissing && (
                      <span className="text-red-500 text-md font-black">✕</span>
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-base transition-colors",
                      isMissing ? "text-red-500 font-semibold" : "text-secondary",
                    )}
                  >
                    {name}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Special / Other Items */}
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              <h3 className="text-lg font-bold text-foreground">
                Other / Special Ingredients
              </h3>
              {specialItems.length > 0 && (
                <span className="text-xs text-secondary bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full border border-amber-100">
                  {specialItems.length} special items
                </span>
              )}
            </div>
            <button
              onClick={addExtra}
              className="flex items-center gap-2 text-primary font-bold hover:scale-105 transition-transform cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              Add Special
            </button>
          </div>

          {/* API special items */}
          {specialItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
              {specialItems.map((name) => {
                const isMissing = missingSpecial.has(name);
                return (
                  <div
                    key={name}
                    className="flex items-center justify-start gap-2 group cursor-pointer py-1"
                    onClick={() => toggleSpecialMissing(name)}
                  >
                    <div 
                      className={cn(
                        "w-5 h-5 rounded border flex items-center justify-center transition-all shrink-0",
                        isMissing
                          ? "bg-white border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.2)]"
                          : "bg-white border-gray-200 group-hover:border-primary",
                      )}
                    >
                      {isMissing && (
                        <span className="text-red-500 text-md font-black">✕</span>
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-base transition-colors",
                        isMissing ? "text-red-500 font-semibold" : "text-secondary",
                      )}
                    >
                      {name}
                    </span>
                    
                  </div>
                );
              })}
            </div>
          )}

          {/* User-added extra items */}
          <div className="space-y-4 pt-2">
            {localExtras.length === 0 && specialItems.length === 0 && (
              <p className="text-secondary text-sm italic">
                No special ingredients added for events yet.
              </p>
            )}
            {localExtras.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100 group"
              >
                <div className="flex-1 w-full">
                  <input
                    type="text"
                    placeholder="Enter special ingredient and event details..."
                    value={item.otherValue}
                    onChange={(e) => updateExtraValue(item.id, e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 text-foreground font-medium placeholder:text-gray-400 placeholder:italic"
                  />
                </div>

                <div className="flex items-center gap-6 shrink-0 w-full sm:w-auto justify-end sm:justify-start">
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => toggleExtraMissing(item.id)}
                  >
                    <span className="text-sm font-semibold text-secondary">
                      Missing?
                    </span>
                    <div
                      className={cn(
                        "w-5 h-5 rounded border flex items-center justify-center transition-all shrink-0",
                        item.isMissing
                          ? "bg-white border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.2)]"
                          : "bg-white border-gray-200",
                      )}
                    >
                      {item.isMissing && (
                        <span className="text-red-500 text-[12px] font-black">✕</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => removeExtra(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <Plus className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h4 className="font-bold text-foreground mb-1">Quick Tip</h4>
          <p className="text-sm text-secondary leading-relaxed">
            Mark items with an <span className="text-red-500 font-bold">X</span>{" "}
            to quickly identify what needs to be ordered from your suppliers.
            Use the "Special" section for one-time event requirements.
          </p>
        </div>
      </div>
    </div>
  );
}
