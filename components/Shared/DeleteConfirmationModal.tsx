// components\Shared\DeleteConfirmationModal.tsx
"use client";
import { X, AlertCircle, CheckCircle2 } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import TranslatedText from "./TranslatedText";
import { ReactNode } from "react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  variant?: "danger" | "success" | "warning";
  icon?: ReactNode;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title = "Delete User",
  description = "Are you sure you want to delete this user? This action cannot be undone.",
  confirmText = "Delete",
  variant = "danger",
  icon,
}: DeleteConfirmationModalProps & { isLoading?: boolean }) {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4  transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in zoom-in duration-300"
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Modal Container */}
      <div
        className={`relative w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl transform transition-all animate-in fade-in zoom-in duration-300 ${
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-4 top-4 p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <div className="mb-6 flex flex-col items-center text-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                variant === "danger"
                  ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                  : variant === "success"
                    ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                    : "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
              }`}
            >
              {icon ? (
                icon
              ) : variant === "danger" ? (
                <HugeiconsIcon
                  icon={Delete02Icon}
                  size={24}
                  className="text-red"
                  strokeWidth={1.5}
                />
              ) : variant === "success" ? (
                <CheckCircle2 size={24} />
              ) : (
                <AlertCircle size={24} />
              )}
            </div>

            <h3 className="text-xl font-bold text-primary ">
              <TranslatedText text={title} />
            </h3>
            <p className="mt-2 text-sm text-secondary  ">
              <TranslatedText text={description} />
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-gray-100 text-foreground dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-secondary font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <TranslatedText text="Cancel" />
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 flex items-center justify-center px-4 py-2.5 rounded-lg font-semibold shadow-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                variant === "danger"
                  ? "bg-red-500 hover:bg-red-700 text-white"
                  : variant === "success"
                    ? "bg-green-500 hover:bg-green-700 text-white"
                    : "bg-amber-500 hover:bg-amber-700 text-white"
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <TranslatedText text={confirmText} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
