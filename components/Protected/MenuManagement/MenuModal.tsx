"use client";

import { useEffect, useState, useRef } from "react";
import {
  X,
  Check,
  ChevronDown,
  Utensils,
  DollarSign,
  FileSpreadsheet,
  Layers,
  ChefHat,
  GlassWater,
} from "lucide-react";
import { Menu, MenuFormData, MenuType } from "@/types/menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { readExcel, exportToExcel } from "@/lib/excel";
import { useGetDishesQuery } from "@/redux/services/menusApi";
import Image from "next/image";

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: MenuFormData | MenuFormData[]) => void;
  menu?: Menu | null;
  mode: "add" | "edit";
}

const MENU_TYPES: MenuType[] = [
  "BREAKFAST",
  "LUNCH",
  "DINNER",
  // "SEASONAL",
  // "SPECIAL",
];

export function MenuModal({
  isOpen,
  onClose,
  onConfirm,
  menu,
  mode,
}: MenuModalProps) {
  const { data: dishesData } = useGetDishesQuery(undefined, {
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
        dishes: menu.dishes.map((d) => d.id),
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

  const handleDownloadTemplate = async () => {
    const templateData = [
      {
        "Menu Name": "Example Lunch Menu",
        "Menu Type": "LUNCH",
        "Outlet Type": "restaurant",
        "Total Cost": "45.00",
        Dishes: "Grilled Salmon, Steamed Broccoli, Quinoa Salad",
      },
      {
        "Menu Name": "Sunset Dinner Special",
        "Menu Type": "DINNER",
        "Outlet Type": "bar",
        "Total Cost": "60.00",
        Dishes: "Ribeye Steak, Mashed Potatoes, Red Wine",
      },
    ];

    try {
      await exportToExcel(templateData, "menu_upload_template.xlsx", "Menus");
      toast.success("Template downloaded! Fill it and upload back.");
    } catch (error) {
      console.error("Template Download Error:", error);
      toast.error("Failed to download template.");
    }
  };

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

          if (processedData.length > 0) {
            setFormData(processedData[0]);
            setMultiData(processedData);
          }
          toast.success(
            `Extracted ${processedData.length} menu(s) successfully!`,
          );
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
        return {
          ...prev,
          dishes: dishes.filter((d) => d !== dish) as string[] | number[],
        };
      }
      return { ...prev, dishes: [...dishes, dish] as string[] | number[] };
    });
  };

  const addCustomDish = () => {
    const trimmedDish = dishSearch.trim();
    if (
      trimmedDish &&
      !(formData.dishes as (string | number)[]).includes(trimmedDish)
    ) {
      setFormData((prev) => ({
        ...prev,
        dishes: [...(prev.dishes as (string | number)[]), trimmedDish] as
          | string[]
          | number[],
      }));
      setDishSearch("");
    }
  };

  const handleDishKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustomDish();
    } else if (
      e.key === "Backspace" &&
      !dishSearch &&
      formData.dishes.length > 0
    ) {
      setFormData((prev) => ({
        ...prev,
        dishes: (prev.dishes as (string | number)[]).slice(0, -1) as
          | string[]
          | number[],
      }));
    }
  };

  const filteredDishes = availableDishes.filter((dish) =>
    dish.name.toLowerCase().includes(dishSearch.toLowerCase()),
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
      <div className="relative w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[95vh] flex flex-col border-none">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-foreground leading-none">
              {mode === "add" ? "Create New Menu" : "Update Menu Settings"}
            </h2>
            <p className="text-xs text-secondary mt-2 font-medium">
              Complete the information below or upload a file
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all cursor-pointer group"
          >
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
            <div className="space-y-4">
              {/* Menu Name */}
              <div className="bg-gray-50/50 p-5 rounded-3xl space-y-4 border border-gray-100">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-foreground mb-2">
                    <Utensils className="w-4 h-4 text-primary" />
                    Menu Name <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={cn(
                      "w-full px-5 py-3 bg-white border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold placeholder:text-gray-300 shadow-sm",
                      errors.name ? "border-red-500" : "border-gray-200",
                    )}
                    placeholder="e.g. Summer Special"
                  />
                </div>
              </div>

              {/* Types & Cost */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 p-5 rounded-3xl border border-gray-100">
                <div className="relative">
                  <label className="flex items-center gap-2 text-sm font-bold text-foreground mb-2">
                    <Layers className="w-4 h-4 text-blue-500" />
                    Menu Category <span className="text-red-500 ml-1">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsTypeOpen(!isTypeOpen)}
                    className="w-full px-5 py-3 border border-gray-200 rounded-2xl flex items-center justify-between hover:border-primary transition-all text-sm font-bold bg-white shadow-sm"
                  >
                    <span className="capitalize">
                      {formData.menu_type.toLowerCase()}
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform text-secondary",
                        isTypeOpen && "rotate-180",
                      )}
                    />
                  </button>
                  {isTypeOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 overflow-hidden py-1 animate-in slide-in-from-top-2 duration-200">
                      {MENU_TYPES.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              menu_type: type as MenuType,
                            });
                            setIsTypeOpen(false);
                          }}
                          className="w-full px-5 py-3 text-left text-sm hover:bg-blue-50 transition-colors font-bold capitalize flex items-center justify-between"
                        >
                          {type.toLowerCase()}
                          {formData.menu_type === type && (
                            <Check className="w-4 h-4 text-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-foreground mb-2">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    Initial Cost <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative group">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                      $
                    </span>
                    <input
                      type="text"
                      value={formData.total_cost}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          total_cost: e.target.value.replace(/[^0-9.]/g, ""),
                        })
                      }
                      className={cn(
                        "w-full pl-9 pr-5 py-3 bg-white border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold placeholder:text-gray-300 shadow-sm",
                        errors.total_cost
                          ? "border-red-500"
                          : "border-gray-200",
                      )}
                      placeholder="25.00"
                    />
                  </div>
                </div>
              </div>

              {/* Outlet Destination */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-gray-50/50 p-5 rounded-3xl border border-gray-100 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-bold text-foreground">
                    Outlet Destination
                  </label>
                  <p className="text-[10px] text-secondary font-medium">
                    Where will this menu be used?
                  </p>
                </div>
                <div className="flex gap-2 p-1.5 bg-white border border-gray-200 rounded-2xl shadow-sm w-full md:w-auto">
                  {[
                    { id: "restaurant", label: "Restaurant", icon: Utensils },
                    { id: "bar", label: "The Bar", icon: GlassWater },
                  ].map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, outlet_type: type.id })
                      }
                      className={cn(
                        "flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-none",
                        formData.outlet_type === type.id
                          ? "bg-primary text-white shadow-md shadow-primary/20"
                          : "text-secondary hover:bg-gray-50 hover:text-primary",
                      )}
                    >
                      <type.icon className="w-3.5 h-3.5" />
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dishes Selection */}
              <div className="relative bg-gray-50/50 p-5 rounded-3xl border border-gray-100">
                <label className="flex items-center gap-2 text-sm font-bold text-foreground mb-4">
                  <ChefHat className="w-4 h-4 text-amber-500" />
                  Select & Create Dishes{" "}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div
                  className={cn(
                    "min-h-[60px] px-4 py-3 bg-white border-2 border-dashed border-gray-200 rounded-2xl flex flex-wrap gap-2 hover:border-primary/50 transition-all cursor-text",
                    errors.dishes && "border-red-500",
                    isDishesOpen &&
                      "border-solid border-primary ring-4 ring-primary/5",
                  )}
                  onClick={() => {
                    setIsDishesOpen(true);
                    dishInputRef.current?.focus();
                  }}
                >
                  {formData.dishes.map((dish: string | number) => {
                    const dishName =
                      typeof dish === "number"
                        ? availableDishes.find((d) => d.id === dish)?.name ||
                          dish
                        : dish;
                    return (
                      <span
                        key={dish}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-primary text-[11px] font-bold rounded-xl border border-blue-100 group animate-in zoom-in-95 duration-200"
                      >
                        {dishName}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDish(dish);
                          }}
                          className="p-0.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer group-hover:scale-110"
                        >
                          <X className="w-3.5 h-3.5 text-red-400 hover:text-red-600" />
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
                    className="flex-1 min-w-[200px] outline-none text-sm font-bold placeholder:text-gray-300 bg-transparent"
                    placeholder={
                      formData.dishes.length === 0
                        ? "Type to search or add custom dish..."
                        : "Add more..."
                    }
                  />
                </div>

                {isDishesOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsDishesOpen(false)}
                    />
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 overflow-hidden py-1 max-h-48 overflow-y-auto custom-scrollbar">
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
                            className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 transition-colors flex items-center justify-between font-bold"
                          >
                            <span>{dish.name}</span>
                            {(formData.dishes as (string | number)[]).includes(
                              dish.id,
                            ) && <Check className="w-4 h-4 text-primary" />}
                          </button>
                        ))
                      ) : dishSearch ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            addCustomDish();
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 transition-colors flex items-center gap-2 font-bold text-primary"
                        >
                          <Check className="w-4 h-4" />
                          <span>Add "{dishSearch}"</span>
                        </button>
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-400 font-bold">
                          No dishes found
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Import Section */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-[10px] font-black text-gray-400 uppercase tracking-[.3em]">
                  <span className="bg-white px-6 rounded-full border border-gray-100 py-1">
                    Direct Import
                  </span>
                </div>
              </div>

              {/* Excel Upload Area */}
              <div className="space-y-4 bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                    Excel Data Mapping
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleDownloadTemplate}
                      className="text-[10px] font-bold text-primary bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 uppercase tracking-wider hover:bg-blue-100 transition-colors"
                    >
                      Download Template
                    </button>
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "border-2 border-dashed rounded-[2rem] p-8 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer group relative overflow-hidden shadow-inner",
                    excelFileName
                      ? "bg-emerald-50/30 border-emerald-400 animate-in fade-in duration-500"
                      : "bg-emerald-50/10 border-emerald-200 hover:bg-emerald-50/30 hover:border-emerald-400",
                  )}
                >
                  <div
                    className={cn(
                      "p-4 rounded-2xl shadow-sm border transition-all relative z-10",
                      excelFileName
                        ? "text-white border-emerald-400 scale-110"
                        : "bg-white text-emerald-500 border-emerald-100 group-hover:scale-110 group-hover:bg-primary/10",
                    )}
                  >
                    {excelFileName ? (
                      <div className="relative">
                        <Image
                          src="/icons/excel.png"
                          alt="Excel/CSV"
                          width={32}
                          height={32}
                          onError={(e) => {
                            (e.target as any).src =
                              "https://cdn-icons-png.flaticon.com/512/732/732220.png";
                          }}
                        />
                        <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                      </div>
                    ) : (
                      <Image
                        src="/icons/excel.png"
                        alt="Excel/CSV"
                        width={32}
                        height={32}
                        onError={(e) => {
                          (e.target as any).src =
                            "https://cdn-icons-png.flaticon.com/512/732/732220.png";
                        }}
                      />
                    )}
                  </div>
                  <div className="text-center relative z-10">
                    <p
                      className={cn(
                        "text-base font-black transition-colors",
                        excelFileName ? "text-emerald-700" : "text-foreground",
                      )}
                    >
                      {excelFileName
                        ? `Selected: ${excelFileName}`
                        : "Drop your Excel catalog here"}
                    </p>
                    {excelFileName ? (
                      <div className="flex flex-col items-center gap-2 mt-2">
                        <p className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-tight">
                          Click to change file
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs font-bold text-secondary mt-2 opacity-60">
                        Supports .XLSX, .XLS and .CSV formats
                      </p>
                    )}
                  </div>
                  <div className="absolute bottom-[-10px] right-[-10px] opacity-10 rotate-12 group-hover:rotate-0 transition-transform">
                    <FileSpreadsheet className="w-24 h-24" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Footer - Sticky */}
          <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-4 mt-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-8 py-4 border-2 border-gray-200 rounded-2xl text-secondary font-black hover:bg-white hover:border-gray-300 transition-all cursor-pointer text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[2] px-8 py-4 bg-primary text-white rounded-2xl font-black hover:bg-blue-600 shadow-xl hover:shadow-primary/30 transition-all cursor-pointer transform active:scale-95 text-sm flex items-center justify-center gap-3"
            >
              {mode === "add" ? (
                <>
                  <Check className="w-5 h-5" />
                  {multiData.length > 1
                    ? `Create ${multiData.length} Menus`
                    : "Create New Menu"}
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
