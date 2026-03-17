"use client";

import { useState, useEffect } from "react";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Plus, Edit, Trash2, Loader2, Tag } from "lucide-react";
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
import { TableSkeleton } from "@/components/Skeleton/TableSkeleton";

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
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
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
          <Button
            onClick={openCreateDialog}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add Category</span>
          </Button>
        </div>

        {/* Categories Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {isFetching ? (
            <TableSkeleton rowCount={8} />
          ) : isError ? (
            <div className="p-12 text-center text-red-500">
              <p>Failed to load categories. Please refresh the page.</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <div className="bg-gray-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Tag size={24} className="text-gray-400" />
              </div>
              <p className="text-lg font-medium text-gray-800 mb-1">
                No categories found
              </p>
              <p className="text-sm">Get started by creating a new category.</p>
              <Button
                onClick={openCreateDialog}
                variant="outline"
                className="mt-4"
              >
                Add your first category
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <Table className="min-w-[500px]">
                <TableHeader className="bg-primary/30">
                  <TableRow>
                    {/* <TableHead className="w-20 text-center">ID</TableHead> */}
                    <TableHead className="w-20 text-center pl-10 font-bold py-4">
                      Category Name
                    </TableHead>
                    <TableHead className="text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category: Category) => (
                    <TableRow
                      key={category.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      {/* <TableCell className="text-center font-medium text-gray-600">
                        {category.id}
                      </TableCell> */}
                      <TableCell className="font-semibold text-gray-800 pl-10">
                        {category.name}
                      </TableCell>
                      <TableCell className="text-right pr-6 space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(category)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 w-8"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(category)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
