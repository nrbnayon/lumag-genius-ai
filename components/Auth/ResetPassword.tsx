"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/floating-input";
import { toast } from "sonner";

import { useResetPasswordMutation } from "@/redux/services/authApi";
import { getCookie, deleteCookie } from "@/redux/features/apiSlice";

// Password must meet: ≥8 chars, uppercase, lowercase, digit
const resetPasswordSchema = z
  .object({
    new_password: z
      .string()
      .min(1, "New password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and a number"
      )
      .refine((v) => !/\s/.test(v), { message: "Password cannot contain spaces" }),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.new_password === d.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

type FormValues = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  // Read session cookies set by previous steps
  const userId = getCookie("reset_userId") || "";
  const secretKey = getCookie("reset_secretKey") || "";

  // Guard: if cookies are missing, redirect back to the start
  useEffect(() => {
    if (isSuccess) return; // Don't trigger guard if we just succeeded

    const isVerified = getCookie("reset_verified");
    if (!isVerified || !userId || !secretKey) {
      toast.error("Session expired. Please start the reset process again.");
      router.replace("/forgot-password");
    }
  }, [router, userId, secretKey, isSuccess]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { new_password: "", confirm_password: "" },
  });

  const handleTrimChange =
    (field: keyof FormValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(field, e.target.value.trim(), { shouldValidate: true });
    };

  const onSubmit = async (data: FormValues) => {
    if (!userId || !secretKey) {
      toast.error("Session expired. Please restart the password reset flow.");
      router.replace("/forgot-password");
      return;
    }

    try {
      const result = await resetPassword({
        user_id: userId,
        secret_key: secretKey,
        new_password: data.new_password,
        confirm_password: data.confirm_password,
      }).unwrap();

      toast.success(
        result.message || "Your password has been reset successfully."
      );

      setIsSuccess(true); // Disable the missing-cookie guard

      // Clear all reset-related session cookies
      deleteCookie("reset_userId");
      deleteCookie("reset_secretKey");
      deleteCookie("reset_verified");

      router.replace("/signin");
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div className="relative h-screen w-full flex flex-col lg:flex-row">
      {/* Left – Illustration */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:block lg:flex-1 h-screen bg-[#E6F4FF]"
      >
        <div className="w-full h-full flex items-center justify-center p-20">
          <div className="relative w-full h-full max-w-2xl transition-transform duration-700 hover:scale-105">
            <Image
              src="/auth/reset-password.png"
              alt="Reset Password Illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </motion.div>

      {/* Right – Form */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-20 bg-white"
      >
        <div className="w-full max-w-md lg:max-w-lg space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
              Set New Password
            </h1>
            <p className="text-base sm:text-lg text-secondary">
              Choose a strong new password for your account.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* New Password */}
            <FloatingInput
              label="New Password"
              type={showPassword ? "text" : "password"}
              error={errors.new_password?.message}
              labelClassName="text-secondary"
              className="h-14 rounded-full border-2 focus:border-primary focus:ring-0 px-6 pr-14 text-base"
              {...register("new_password")}
              onChange={handleTrimChange("new_password")}
            >
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <Eye className="h-5 w-5" />
                ) : (
                  <EyeOff className="h-5 w-5" />
                )}
              </button>
            </FloatingInput>

            {/* Confirm Password */}
            <FloatingInput
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              error={errors.confirm_password?.message}
              labelClassName="text-secondary"
              className="h-14 rounded-full border-2 focus:border-primary focus:ring-0 px-6 pr-14 text-base"
              {...register("confirm_password")}
              onChange={handleTrimChange("confirm_password")}
            >
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors p-1"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <Eye className="h-5 w-5" />
                ) : (
                  <EyeOff className="h-5 w-5" />
                )}
              </button>
            </FloatingInput>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white text-lg font-semibold rounded-full shadow-md transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  Resetting…
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
