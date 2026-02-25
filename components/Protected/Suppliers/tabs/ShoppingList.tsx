"use client";

import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { initialShoppingList, ShoppingListItem } from "@/data/shoppingListData";
import { toast } from "sonner";

export function ShoppingList() {
  const [items, setItems] = useState<ShoppingListItem[]>(initialShoppingList);
  const [otherItems, setOtherItems] = useState<ShoppingListItem[]>([]);

  const toggleMissing = (id: string, isOther: boolean = false) => {
    if (isOther) {
      setOtherItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isMissing: !item.isMissing } : item,
        ),
      );
    } else {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isMissing: !item.isMissing } : item,
        ),
      );
    }
  };

  const addOther = () => {
    const newItem: ShoppingListItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: "",
      isMissing: false,
      isOther: true,
      otherValue: "",
    };
    setOtherItems((prev) => [...prev, newItem]);
  };

  const removeOther = (id: string) => {
    setOtherItems((prev) => prev.filter((item) => item.id !== id));
    toast.success("Item removed from special list");
  };

  const updateOtherValue = (id: string, value: string) => {
    setOtherItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, otherValue: value, name: value } : item,
      ),
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-8 shadow-[0px_4px_16px_0px_#A9A9A940] border border-gray-100">
        <h2 className="text-xl font-bold text-foreground mb-6">
          Shopping List
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between group cursor-pointer py-1"
              onClick={() => toggleMissing(item.id)}
            >
              <span
                className={cn(
                  "text-base transition-colors",
                  item.isMissing
                    ? "text-red-500 font-semibold"
                    : "text-secondary",
                )}
              >
                {item.name}
              </span>

              <div
                className={cn(
                  "w-5 h-5 rounded border flex items-center justify-center transition-all shrink-0",
                  item.isMissing
                    ? "bg-white border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.2)]"
                    : "bg-white border-gray-200 group-hover:border-primary",
                )}
              >
                {item.isMissing && (
                  <span className="text-red-500 text-md font-black">✕</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h3 className="text-lg font-bold text-foreground">
              Other / Special Ingredients
            </h3>
            <button
              onClick={addOther}
              className="flex items-center gap-2 text-primary font-bold hover:scale-105 transition-transform cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              Add Special
            </button>
          </div>

          <div className="space-y-4 pt-2">
            {otherItems.length === 0 ? (
              <p className="text-secondary text-sm italic">
                No special ingredients added for events yet.
              </p>
            ) : (
              otherItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100 group"
                >
                  <div className="flex-1 w-full">
                    <input
                      type="text"
                      placeholder="Enter special ingredient and event details..."
                      value={item.otherValue}
                      onChange={(e) =>
                        updateOtherValue(item.id, e.target.value)
                      }
                      className="w-full bg-transparent border-none focus:ring-0 text-foreground font-medium placeholder:text-gray-400 placeholder:italic"
                    />
                  </div>

                  <div className="flex items-center gap-6 shrink-0 w-full sm:w-auto justify-end sm:justify-start">
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => toggleMissing(item.id, true)}
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
                          <span className="text-red-500 text-[12px] font-black">
                            ✕
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => removeOther(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
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
            Use the "Other" section for one-time event requirements.
          </p>
        </div>
      </div>
    </div>
  );
}
