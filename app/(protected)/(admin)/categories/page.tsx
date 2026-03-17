"use client";

import { useState, useEffect } from "react";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Loader2, Tag, Search, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/redux/services/categoriesApi";
import type { Category } from "@/types/categories.types";

const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(50, "Name must be less than 50 characters"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function CategoriesPage() {
  // Query & Mutations
  const { data: categoriesResponse, isLoading: isFetching, isError } = useGetAllCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const categories = categoriesResponse?.data || [];

  // Dialog & Modal State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = categories.filter((category: Category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "" },
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (isDialogOpen) {
      if (selectedCategory) {
        setValue("name", selectedCategory.name);
      } else {
        reset({ name: "" });
      }
    }
  }, [isDialogOpen, selectedCategory, reset, setValue]);

  const openCreateDialog = () => {
    setSelectedCategory(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      if (selectedCategory) {
        // Edit
        await updateCategory({
          id: selectedCategory.id,
          name: data.name.trim(),
        }).unwrap();
        toast.success("Category updated successfully.");
      } else {
        // Create
        await createCategory({
          name: data.name.trim(),
        }).unwrap();
        toast.success("Category created successfully.");
      }
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save category. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;
    try {
      await deleteCategory(selectedCategory.id).unwrap();
      toast.success("Category deleted successfully.");
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete category.");
    }
  };

  return (
    <>
      <DashboardHeader
        title="Ingredient Categories"
        description="Manage your custom ingredient categories."
      />

      <div className="p-4 md:p-8 w-full mx-auto space-y-6 flex-1">
        {/* Top actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Tag size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                All Categories
              </h2>
              <p className="text-sm text-gray-500">
                {categories.length} item{categories.length !== 1 && "s"} total
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 h-10 rounded-lg border-gray-200 focus:border-blue-400 focus:ring-blue-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <Button
              onClick={openCreateDialog}
              className="flex items-center gap-2 h-10 px-4 shrink-0"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Add Category</span>
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
          {isFetching ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-6">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-36 bg-gray-50/50 border border-gray-100 rounded-xl p-5 flex flex-col items-center space-y-3 animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div className="h-4 bg-gray-200 rounded w-24" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="p-12 text-center text-red-500">
              <p>Failed to load categories. Please refresh the page.</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <div className="bg-gray-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Tag size={24} className="text-gray-400" />
              </div>
              <p className="text-lg font-medium text-gray-800 mb-1">
                {searchQuery ? "No matching categories" : "No categories found"}
              </p>
              <p className="text-sm">
                {searchQuery 
                  ? "Try adjusting your search terms." 
                  : "Get started by creating a new category."}
              </p>
              {!searchQuery && (
                <Button
                  onClick={openCreateDialog}
                  variant="outline"
                  className="mt-4"
                >
                  Add your first category
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 p-6">
              {filteredCategories.map((category: Category) => (
                <div
                  key={category.id}
                  className="group relative bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-blue-200 transition-all duration-300 flex flex-col items-center text-center space-y-4"
                >
                  <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 ring-4 ring-transparent group-hover:ring-blue-100 group-hover:rotate-6">
                    <Tag size={24} />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-bold text-gray-800 text-base line-clamp-2 px-2">
                      {category.name}
                    </h3>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Category</p>
                  </div>

                  <div className="flex items-center gap-2 pt-1 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(category)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-9 w-9 rounded-xl border border-blue-50 bg-blue-50/30"
                      title="Edit"
                    >
                      <Edit size={15} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteDialog(category)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 h-9 w-9 rounded-xl border border-red-50 bg-red-50/30"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>

                  {/* Aesthetic dot */}
                  <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-blue-100 group-hover:bg-blue-400 transition-colors" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CREATE / EDIT DIALOG */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
            <DialogDescription>
              {selectedCategory
                ? "Update the name of your ingredient category below."
                : "Create a new category to group your ingredients."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="">
              <label
                htmlFor="name"
                className="text-sm font-medium text-foreground mb-2 block"
              >
                Category Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                placeholder="e.g. Vegetables, Meat, Dairy"
                {...register("name")}
                className={
                  errors.name
                    ? "border-red-500 focus-visible:ring-red-500"
                    : "rounded"
                }
                autoFocus
              />
              {errors.name && (
                <p className="text-sm text-red-500 font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>

            <DialogFooter className="pt-4 flex !justify-between sm:!justify-end items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isCreating || isUpdating}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
                className="w-full sm:w-auto"
              >
                {isCreating || isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Category"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION ALER-DIALOG */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              category
              <span className="font-bold text-gray-800">
                {" "}
                "{selectedCategory?.name}"
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="mt-2 sm:mt-0"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Category"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
