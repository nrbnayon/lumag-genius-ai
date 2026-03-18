"use client";

import { useEffect, useRef, useState } from "react";
import { X, ChevronDown, ImageUp, Trash2, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { PurchaseItem, CreatePurchasePayload } from "@/types/supplier";
import { readExcel } from "@/lib/excel";
import { useGetAllSuppliersQuery, useCreatePurchasesMutation } from "@/redux/services/suppliersApi";

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: Partial<CreatePurchasePayload>) => void;
  purchase?: PurchaseItem | null;
  mode: "add" | "edit";
  /** "purchase" = regular (is_special=false); "other" = special (is_special=true) */
  type?: "purchase" | "other";
  isLoading?: boolean;
}

const PURCHASE_CATEGORIES = [
  "Vegetable",
  "Fruit",
  "Meat",
  "Seafood",
  "Dairy",
  "Bakery",
  "Beverage",
  "Spice",
  "Other",
] as const;

const OUTLET_TYPES = ["restaurant", "bar"] as const;

const emptyForm: Partial<CreatePurchasePayload> = {
  product_name: "",
  price: 0,
  quantity: 0,
  unit: "",
  supplier_name: "",
  category_name: "Vegetable",
  purchase_date: "",
  remarks: "",
  outlet_type: "restaurant",
};

export function PurchaseModal({
  isOpen,
  onClose,
  onConfirm,
  purchase,
  mode,
  type = "purchase",
  isLoading = false,
}: PurchaseModalProps) {
  const excelRef = useRef<HTMLInputElement>(null);
  const reportRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Partial<CreatePurchasePayload>>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof CreatePurchasePayload, string>>>({});
  const [excelFileName, setExcelFileName] = useState<string>("");
  const [reportPreview, setReportPreview] = useState<string>("");
  const [reportFileName, setReportFileName] = useState<string>("");

  const [pendingCreateData, setPendingCreateData] = useState<CreatePurchasePayload[]>([]);
  const [createPurchases, { isLoading: isCreatingBulk }] = useCreatePurchasesMutation();

  // Fetch real supplier names for the dropdown
  const { data: suppliersData } = useGetAllSuppliersQuery({ page_size: 100 });
  const supplierNames = suppliersData?.data?.map((s) => s.name) ?? [];

  useEffect(() => {
    if (purchase) {
      setForm({
        product_name: purchase.product_name,
        price: parseFloat(purchase.price),
        quantity: parseFloat(purchase.quantity),
        unit: purchase.unit,
        supplier_name: purchase.supplier_name,
        category_name: purchase.category_name,
        purchase_date: purchase.purchase_date,
        remarks: purchase.remarks,
        outlet_type: purchase.outlet_type,
        is_special: purchase.is_special,
      });
    } else {
      const today = new Date().toISOString().split("T")[0];
      setForm({ ...emptyForm, is_special: type === "other", purchase_date: today });
      setExcelFileName("");
      setReportFileName("");
      setReportPreview("");
      setPendingCreateData([]);
    }
    setErrors({});
  }, [purchase, isOpen, type]);

  const validate = () => {
    if (pendingCreateData.length > 0) return true;

    const e: Partial<Record<keyof CreatePurchasePayload, string>> = {};
    if (!form.product_name?.trim()) e.product_name = "Required";
    if (!form.price || form.price <= 0) e.price = "Must be > 0";
    if (!form.unit?.trim()) e.unit = "Required";
    if (!form.supplier_name?.trim()) e.supplier_name = "Required";
    if (!form.purchase_date) e.purchase_date = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const executeChunkedRequests = async (payloads: CreatePurchasePayload[]) => {
    const CHUNK_SIZE = 500;
    for (let i = 0; i < payloads.length; i += CHUNK_SIZE) {
      const chunk = payloads.slice(i, i + CHUNK_SIZE);
      await createPurchases(chunk).unwrap();
    }
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    
    if (pendingCreateData.length > 0) {
      try {
        await executeChunkedRequests(pendingCreateData);
        toast.success(`Excel Action: ${pendingCreateData.length} records created successfully!`);
        onClose();
        // Since we bypass the normal onConfirm, we need to refresh or just let RTK Query tags handle it.
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to import bulk purchases.");
      }
    } else {
      onConfirm(form);
    }
  };

  // Excel upload → bulk import handling
  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setExcelFileName(file.name);
    toast.info(`Reading ${file.name}…`);

    try {
      const data = await readExcel(file);
      if (!data.length) {
        toast.error("No data found.");
        return;
      }
      
      const createPayloads: CreatePurchasePayload[] = [];
      const isOtherMode = type === "other";

      for (const row of data) {
         const find = (...keys: string[]) => {
           const k = Object.keys(row).find((k) =>
             keys.some((pk) => k.toLowerCase().includes(pk.toLowerCase())),
           );
           return k ? String(row[k]) : "";
         };

         const rawOutlet = find("outlet", "place");
         const outletMatch = (rawOutlet || form.outlet_type || "restaurant").toLowerCase().includes("bar") ? "bar" : "restaurant";

         const parsedPrice = parseFloat(find("price", "cost")) || 0;
         const parsedQty = parseFloat(find("quantity", "qty")) || 0;
         let parsedDateStr = find("date", "purchase");
         let parsedDate = form.purchase_date || new Date().toISOString().split("T")[0];
         if (parsedDateStr) {
           // Handle common excel date formats cleanly or attempt standard Date parsing
           const d = new Date(parsedDateStr);
           if (!isNaN(d.getTime())) {
             parsedDate = d.toISOString().split("T")[0];
           }
         }

         createPayloads.push({
           product_name: find("product", "name", "item") || "Imported Product",
           price: parsedPrice,
           unit: find("unit") || "kg",
           quantity: parsedQty,
           supplier_name: find("supplier") || "Unknown Supplier",
           category_name: find("category") || "Vegetable",
           purchase_date: parsedDate,
           remarks: find("remark", "note") || "",
           outlet_type: outletMatch as "restaurant" | "bar",
           is_special: isOtherMode
         });
      }

      setPendingCreateData(createPayloads);
      
      if (createPayloads.length > 0) {
        const first = createPayloads[0];
        setForm({
          product_name: first.product_name,
          price: first.price,
          unit: first.unit,
          quantity: first.quantity,
          supplier_name: first.supplier_name,
          category_name: first.category_name,
          purchase_date: first.purchase_date,
          remarks: first.remarks,
          outlet_type: first.outlet_type,
          is_special: first.is_special
        });
        toast.success(`Loaded ${createPayloads.length} rows from file`);
      }
    } catch {
      toast.error("Failed to read file.");
    } finally {
      if (excelRef.current) excelRef.current.value = "";
    }
  };

  // Report image upload
  const handleReportUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    setReportFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      setReportPreview(evt.target?.result as string);
      toast.success(`Report "${file.name}" attached.`);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveReport = (e: React.MouseEvent) => {
    e.stopPropagation();
    setReportFileName("");
    setReportPreview("");
    if (reportRef.current) reportRef.current.value = "";
    toast.success("Report removed.");
  };

  if (!isOpen) return null;

  const isSubmitting = isLoading || isCreatingBulk;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={!isSubmitting ? onClose : undefined}
      />

      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl animate-in fade-in zoom-in duration-300 max-h-[95vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-foreground">
            {pendingCreateData.length > 0 ? "Bulk Import Purchases" :
              mode === "add"
                ? type === "other"
                  ? "Add Other Product"
                  : "Add Purchase"
                : "Edit Product"
            }
          </h2>
          <button
            onClick={!isSubmitting ? onClose : undefined}
            disabled={isSubmitting}
            className="p-2 text-red-500 hover:text-red-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className={cn("space-y-4", pendingCreateData.length > 0 && "opacity-60 pointer-events-none")}>
            {/* Product Name */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.product_name ?? ""}
                onChange={(e) => setForm({ ...form, product_name: e.target.value })}
                className={cn(
                  "w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm placeholder:text-gray-300",
                  errors.product_name && "border-red-400",
                )}
                placeholder="e.g. Tomatoes"
              />
              {errors.product_name && (
                <p className="text-xs text-red-500 mt-1">{errors.product_name}</p>
              )}
            </div>

            {/* Price / Quantity / Unit */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.price ?? ""}
                  onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
                  className={cn(
                    "w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm placeholder:text-gray-300",
                    errors.price && "border-red-400",
                  )}
                  placeholder="20"
                />
                {errors.price && (
                  <p className="text-xs text-red-500 mt-1">{errors.price}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Quantity
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.quantity ?? ""}
                  onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm placeholder:text-gray-300"
                  placeholder="23"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Unit <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.unit ?? ""}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  className={cn(
                    "w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm placeholder:text-gray-300",
                    errors.unit && "border-red-400",
                  )}
                  placeholder="kg"
                />
              </div>
            </div>

            {/* Supplier Name */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Supplier Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                {supplierNames.length > 0 ? (
                  <>
                    <select
                      value={form.supplier_name ?? ""}
                      onChange={(e) => setForm({ ...form, supplier_name: e.target.value })}
                      className={cn(
                        "w-full appearance-none px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm bg-white text-foreground",
                        errors.supplier_name && "border-red-400",
                      )}
                    >
                      <option value="">Select supplier…</option>
                      {Array.from(new Set(supplierNames)).map((s, idx) => (
                      <option key={`${s}-${idx}`} value={s}>
                        {s}
                      </option>
                    ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </>
                ) : (
                  <input
                    type="text"
                    value={form.supplier_name ?? ""}
                    onChange={(e) => setForm({ ...form, supplier_name: e.target.value })}
                    className={cn(
                      "w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm placeholder:text-gray-300",
                      errors.supplier_name && "border-red-400",
                    )}
                    placeholder="Ocean Fresh"
                  />
                )}
              </div>
              {errors.supplier_name && (
                <p className="text-xs text-red-500 mt-1">{errors.supplier_name}</p>
              )}
            </div>

            {/* Category & Outlet Type */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={form.category_name ?? "Vegetable"}
                    onChange={(e) => setForm({ ...form, category_name: e.target.value })}
                    className="w-full appearance-none px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm bg-white text-foreground"
                  >
                    {PURCHASE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Outlet Type
                </label>
                <div className="relative">
                  <select
                    value={form.outlet_type ?? "restaurant"}
                    onChange={(e) =>
                      setForm({ ...form, outlet_type: e.target.value as "bar" | "restaurant" })
                    }
                    className="w-full appearance-none px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm bg-white text-foreground"
                  >
                    {OUTLET_TYPES.map((t) => (
                      <option key={t} value={t} className="capitalize">
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Purchase Date */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Purchase Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.purchase_date ?? ""}
                onChange={(e) => setForm({ ...form, purchase_date: e.target.value })}
                className={cn(
                  "w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm",
                  errors.purchase_date && "border-red-400",
                )}
              />
              {errors.purchase_date && (
                <p className="text-xs text-red-500 mt-1">{errors.purchase_date}</p>
              )}
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Remarks
              </label>
              <input
                type="text"
                value={form.remarks ?? ""}
                onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm placeholder:text-gray-300"
                placeholder="e.g. Fresh stock for weekly menu"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 mt-4 border-t border-gray-100">
            {/* Divider "Or" */}
            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                <span className="bg-white px-4">Or bulk upload (Excel / CSV)</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="block text-sm font-bold text-foreground">
                Excel Sync
              </label>
              <button
                type="button"
                onClick={() => {
                  const templateData = [
                    {
                      "Product Name": "Sample Tomatoes",
                      Price: "10.00",
                      Quantity: "5",
                      Unit: "KG",
                      Supplier: "Ocean Fresh",
                      Category: "Vegetable",
                      "Purchase Date": new Date().toISOString().split("T")[0],
                      Remarks: "Bulk import sample",
                      Outlet: "Restaurant"
                    }
                  ];
                  import("@/lib/excel").then(m => m.exportToExcel(templateData, "purchase_template.xlsx", "Template"));
                }}
                className="text-[10px] text-primary font-bold bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
              >
                DOWNLOAD TEMPLATE
              </button>
            </div>

            {/* Excel Upload */}
            <div
              onClick={() => !isSubmitting && excelRef.current?.click()}
              className="border-2 border-dashed border-blue-200 bg-[#F0F8FF] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-blue-50/60 transition-all cursor-pointer group"
            >
              <input
                ref={excelRef}
                type="file"
                className="hidden"
                accept=".xlsx,.xls,.csv"
                onChange={handleExcelUpload}
                disabled={isSubmitting}
              />
              <div className="w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Image
                  src="/icons/excel.png"
                  alt="Excel"
                  width={40}
                  height={40}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://cdn-icons-png.flaticon.com/512/732/732220.png";
                  }}
                />
              </div>
              <p className="text-sm font-semibold text-foreground text-center">
                {excelFileName || "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-secondary">Max. File Size: 50MB</p>
            </div>

            {/* Report Upload */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Report{" "}
                <span className="text-secondary">
                  (If find any problem with the product)
                </span>
              </label>
              <div
                onClick={() => !isSubmitting && reportRef.current?.click()}
                className="border-2 border-dashed border-blue-200 bg-[#F0F8FF] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-blue-50/60 transition-all cursor-pointer group min-h-[160px] relative overflow-hidden"
              >
                <input
                  ref={reportRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleReportUpload}
                  disabled={isSubmitting}
                />
                {reportPreview ? (
                  <div className="absolute inset-0 w-full h-full group/preview">
                    <Image
                      src={reportPreview}
                      alt="Report Preview"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={handleRemoveReport}
                        className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all transform scale-90 group-hover/preview:scale-100"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform text-gray-400">
                      <ImageUp className="w-10 h-10" />
                    </div>
                    <p className="text-sm font-semibold text-foreground text-center">
                      {reportFileName || "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-secondary">Max. File Size: 50MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-4 pt-2 pb-4 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-2.5 border border-gray-200 rounded-full text-foreground font-bold hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full font-bold hover:bg-blue-600 transition-colors cursor-pointer disabled:opacity-70"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {pendingCreateData.length > 0
                ? `Import ${pendingCreateData.length} entries`
                : mode === "add" ? "+ Add" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
