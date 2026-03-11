"use client";

import { useEffect, useState, useRef } from "react";
import { X, Trash2, Check, ChevronDown } from "lucide-react";
import { Menu, MenuFormData, MenuType } from "@/types/menu";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";
import { readExcel } from "@/lib/excel";

import { useGetDishesQuery } from "@/redux/services/menusApi";

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: MenuFormData | MenuFormData[]) => void; // Support multi-data
  menu?: Menu | null;
  mode: "add" | "edit";
}

const MENU_TYPES: MenuType[] = [
  "BREAKFAST",
  "LUNCH",
  "DINNER",
  "SEASONAL",
  "SPECIAL",
];

export function MenuModal({
  isOpen,
  onClose,
  onConfirm,
  menu,
  mode,
}: MenuModalProps) {
  const { data: dishesData, isLoading: isLoadingDishes } = useGetDishesQuery(undefined, {
    skip: !isOpen,
  });

  const availableDishes = dishesData?.data || [];

  const [formData, setFormData] = useState<MenuFormData>({
    name: "",
    menu_type: "LUNCH",
    outlet_type: "restaurant",
    dishes: [],
    total_cost: "",
  });

  const [multiData, setMultiData] = useState<MenuFormData[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [excelFileName, setExcelFileName] = useState<string>("");
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isDishesOpen, setIsDishesOpen] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof MenuFormData, string>>
  >({});
  const [dishSearch, setDishSearch] = useState("");
  const dishInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (menu) {
      setFormData({
        id: menu.id,
        name: menu.name,
        menu_type: menu.menu_type,
        outlet_type: menu.outlet_type || "restaurant",
        dishes: menu.dishes.map(d => d.id), // Use IDs for update
        total_cost: menu.total_cost,
      });
      setMultiData([]);
    } else {
      setFormData({
        name: "",
        menu_type: "LUNCH",
        outlet_type: "restaurant",
        dishes: [],
        total_cost: "",
      });
      setExcelFileName("");
      setMultiData([]);
    }
    setErrors({});
  }, [menu, isOpen]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setExcelFileName(file.name);
      toast.info(`Extracting data from ${file.name}...`);

      try {
        const data = await readExcel(file);

        if (data && data.length > 0) {
          const processedData: MenuFormData[] = data.map((row: any) => {
            const find = (...keys: string[]) => {
              const k = Object.keys(row).find((k) =>
                keys.some((pk) => k.toLowerCase().includes(pk.toLowerCase())),
              );
              return k ? String(row[k]) : "";
            };

            const dishesStr = find("dishes", "items", "food");
            const extractedDishes = dishesStr
              ? dishesStr.split(",").map((d) => d.trim())
              : [];

            let rawType = find("type", "category", "menu_type").toUpperCase();
            if (!MENU_TYPES.includes(rawType as MenuType)) rawType = "LUNCH";

            return {
              name: find("name", "menu", "title"),
              menu_type: rawType as MenuType,
              outlet_type: find("outlet", "outlet_type") || "restaurant",
              total_cost: find("cost", "price", "total", "total_cost"),
              dishes: extractedDishes,
            };
          });

          // Show first item in form
          if (processedData.length > 0) {
            setFormData(processedData[0]);
            setMultiData(processedData);
          }

          toast.success(`Extracted ${processedData.length} menu(s) successfully!`);
        } else {
          toast.error("No data found in the file.");
        }
      } catch (error) {
        console.error("Excel Read Error:", error);
        toast.error("Failed to process file.");
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    }
  };

  const toggleDish = (dish: string | number) => {
    setFormData((prev) => {
      const dishes = (prev.dishes || []) as (string | number)[];
      const exists = dishes.includes(dish);
      if (exists) {
        return { ...prev, dishes: dishes.filter((d) => d !== dish) as string[] | number[] };
      }
      return { ...prev, dishes: [...dishes, dish] as string[] | number[] };
    });
  };

  const addCustomDish = () => {
    const trimmedDish = dishSearch.trim();
    if (trimmedDish && !(formData.dishes as (string | number)[]).includes(trimmedDish)) {
      setFormData((prev) => ({
        ...prev,
        dishes: [...(prev.dishes as (string | number)[]), trimmedDish] as string[] | number[],
      }));
      setDishSearch("");
    }
  };

  const handleDishKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustomDish();
    } else if (e.key === "Backspace" && !dishSearch && formData.dishes.length > 0) {
      // Remove last dish if backspace is pressed on empty input
      setFormData((prev) => ({
        ...prev,
        dishes: (prev.dishes as (string | number)[]).slice(0, -1) as string[] | number[],
      }));
    }
  };

  const filteredDishes = availableDishes.filter((dish) =>
    dish.name.toLowerCase().includes(dishSearch.toLowerCase())
  );

  const validate = () => {
    const newErrors: any = {};
    if (!formData.name) newErrors.name = "Required";
    if (!formData.total_cost) newErrors.total_cost = "Required";
    if (formData.dishes.length === 0)
      newErrors.dishes = "Select at least one dish";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      if (multiData.length > 1) {
        // If we have multi-data but only edited the first one, update the first one in the list
        const updatedMultiData = [...multiData];
        updatedMultiData[0] = { ...formData };
        onConfirm(updatedMultiData);
      } else {
        onConfirm(formData);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[95vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-foreground">
            {mode === "add" ? "Add Menu" : "Edit Menu"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            {/* Menu Name */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-1.5">
                Menu Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={cn(
                  "w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium placeholder:text-gray-300",
                  errors.name ? "border-red-500" : "border-gray-200",
                )}
                placeholder="Enter menu name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Types Dropdown */}
              <div className="relative">
                <label className="block text-sm font-bold text-foreground mb-1.5">
                  Types <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsTypeOpen(!isTypeOpen)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl flex items-center justify-between hover:border-primary transition-all text-sm font-medium bg-white"
                >
                  <span className="capitalize">{formData.menu_type.toLowerCase()}</span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform text-secondary",
                      isTypeOpen && "rotate-180",
                    )}
                  />
                </button>
                {isTypeOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden py-1">
                    {MENU_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, menu_type: type as MenuType });
                          setIsTypeOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 transition-colors font-medium capitalize"
                      >
                        {type.toLowerCase()}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Total Cost */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-1.5">
                  Total Cost <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.total_cost}
                  onChange={(e) =>
                    setFormData({ ...formData, total_cost: e.target.value })
                  }
                  className={cn(
                    "w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium placeholder:text-gray-300",
                    errors.total_cost ? "border-red-500" : "border-gray-200",
                  )}
                  placeholder="e.g. $20"
                />
              </div>
            </div>

            {/* Outlet Type Selection */}
            <div className="flex items-center gap-4">
               <label className="text-sm font-bold text-foreground">Outlet Type:</label>
               <div className="flex gap-2">
                 {["restaurant", "bar"].map((type) => (
                   <button
                     key={type}
                     type="button"
                     onClick={() => setFormData({ ...formData, outlet_type: type })}
                     className={cn(
                       "px-4 py-1.5 rounded-full text-xs font-bold border transition-all capitalize",
                       formData.outlet_type === type
                         ? "bg-primary text-white border-primary"
                         : "bg-white text-secondary border-gray-200 hover:border-primary"
                     )}
                   >
                     {type}
                   </button>
                 ))}
               </div>
            </div>

            {/* Select Dishes Multi-select */}
            <div className="relative">
              <label className="block text-sm font-bold text-foreground mb-1.5">
                Select Dishes <span className="text-red-500">*</span>
              </label>
              <div
                className={cn(
                  "min-h-[42px] px-3 py-1.5 border border-gray-200 rounded-xl flex flex-wrap gap-2 hover:border-primary transition-all bg-white cursor-text",
                  errors.dishes && "border-red-500",
                  isDishesOpen && "ring-2 ring-primary/20 border-primary",
                )}
                onClick={() => {
                  setIsDishesOpen(true);
                  dishInputRef.current?.focus();
                }}
              >
                {formData.dishes.map((dish: string|number) => {
                  const dishName = typeof dish === 'number' 
                    ? availableDishes.find(d => d.id === dish)?.name || dish
                    : dish;
                  return (
                    <span
                      key={dish}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-primary text-xs font-bold rounded-lg border border-blue-100"
                    >
                      {dishName}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDish(dish);
                        }}
                        className="p-0.5 hover:bg-blue-200 rounded-full transition-colors cursor-pointer"
                      >
                        <X className="w-3 h-3 text-red-500" />
                      </button>
                    </span>
                  );
                })}
                <input
                  ref={dishInputRef}
                  type="text"
                  value={dishSearch}
                  onChange={(e) => {
                    setDishSearch(e.target.value);
                    setIsDishesOpen(true);
                  }}
                  onKeyDown={handleDishKeyDown}
                  onFocus={() => setIsDishesOpen(true)}
                  className="flex-1 min-w-[120px] outline-none text-sm font-medium placeholder:text-gray-300"
                  placeholder={formData.dishes.length === 0 ? "Type or select dishes..." : ""}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDishesOpen(!isDishesOpen);
                  }}
                  className="p-1"
                >
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform text-secondary",
                      isDishesOpen && "rotate-180",
                    )}
                  />
                </button>
              </div>

              {isDishesOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsDishesOpen(false)}
                  />
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden py-1 max-h-48 overflow-y-auto custom-scrollbar">
                    {filteredDishes.length > 0 ? (
                      filteredDishes.map((dish) => (
                        <button
                          key={dish.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDish(dish.id);
                            setDishSearch("");
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 transition-colors flex items-center justify-between font-medium"
                        >
                          <span>{dish.name}</span>
                          {(formData.dishes as (string|number)[]).includes(dish.id) && (
                            <Check className="w-4 h-4 text-primary" />
                          )}
                        </button>
                      ))
                    ) : dishSearch ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addCustomDish();
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 transition-colors flex items-center gap-2 font-medium text-primary"
                      >
                        <Check className="w-4 h-4" />
                        <span>Add "{dishSearch}"</span>
                      </button>
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-400 font-medium">
                        No dishes found
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                <span className="bg-white px-4">Or</span>
              </div>
            </div>

            {/* Excel Upload Area */}
            <div className="space-y-4">
              <label className="block text-sm font-bold text-foreground">
                Upload Menu <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-blue-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-blue-50/10 hover:bg-blue-50/30 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-transparent flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Image
                    src="/icons/excel.png"
                    alt="Excel/CSV"
                    width={40}
                    height={40}
                    onError={(e) => {
                      (e.target as any).src =
                        "https://cdn-icons-png.flaticon.com/512/732/732220.png";
                    }}
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-foreground">
                    {excelFileName || "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs font-medium text-secondary mt-1 uppercase tracking-wider">
                    Supports: XLSX, XLS, CSV (Max. 50MB)
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 sticky bottom-0 bg-white pt-2 pb-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2.5 border border-gray-200 rounded-full text-foreground font-bold hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-2.5 bg-primary text-white rounded-full font-bold hover:bg-blue-600 transition-colors shadow-sm cursor-pointer"
            >
              {mode === "add" ? "+ Add" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
