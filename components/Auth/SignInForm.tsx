"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2, ShieldAlert } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FloatingInput } from "@/components/ui/floating-input";
import { Label } from "@/components/ui/label";

import { useAppDispatch } from "@/redux/hooks";
import { setCredentials } from "@/redux/features/authSlice";
import { setCookie } from "@/redux/features/apiSlice";
import { useLoginMutation } from "@/redux/services/authApi";
import { toast } from "sonner";
import { loginValidationSchema } from "@/lib/formDataValidation";

type FormValues = z.infer<typeof loginValidationSchema>;

export const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(loginValidationSchema),
    defaultValues: {
      email_address: "",
      password: "",
      rememberMe: false,
    },
  });

  // Real-time trim for email & password fields
  const handleTrimChange =
    (field: "email_address" | "password") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(field, e.target.value.trim(), { shouldValidate: true });
    };

  const onSubmit = async (data: FormValues) => {
    try {
      const result = await login({
        email_address: data.email_address.trim(),
        password: data.password.trim(),
      }).unwrap();

      // The API returns { success, status, message, data: { user, tokens } }
      const { user, tokens } = result.data!;

      // ── Admin-only guard ──────────────────────────────────────────────────
      if (user.role !== "admin") {
        toast.error("Access denied. This panel is restricted to admins only.", {
          icon: <ShieldAlert className="h-5 w-5 text-red-500" />,
          duration: 5000,
        });
        return;
      }

      // ── Persist to Redux ──────────────────────────────────────────────────
      dispatch(
        setCredentials({
          user: {
            id: user.id,
            email_address: user.email_address,
            full_name: user.full_name,
            role: user.role,
          },
          token: tokens.access_token,
          refreshToken: tokens.refresh_token,
          tokenExpiresAt: tokens.expires_at,
        })
      );

      // ── Persist to browser cookies ────────────────────────────────────────
      // Calculate cookie lifetime from the API's expires_in (ms)
      const daysFromMs = tokens.expires_in / (1000 * 60 * 60 * 24);
      const cookieDays = data.rememberMe ? daysFromMs : undefined; // undefined = session cookie

      setCookie("accessToken", tokens.access_token, cookieDays);
      setCookie("refreshToken", tokens.refresh_token, cookieDays);
      setCookie("userRole", user.role, cookieDays);
      setCookie("userId", user.id, cookieDays);
      setCookie(
        "userEmail",
        encodeURIComponent(user.email_address),
        cookieDays
      );
      setCookie(
        "userName",
        encodeURIComponent(user.full_name),
        cookieDays
      );
      if (data.rememberMe) {
        setCookie("rememberMe", "true", cookieDays);
      }

      toast.success(`Welcome back, ${user.full_name}! 🎉`);
      
      // Honour the ?redirect= param set by the middleware, fall back to "/dashboard"
      const redirectTo = searchParams.get("redirect") ?? "/dashboard";
      
      // Use a hard navigation so the browser re-sends all cookies on the next request.
      window.location.replace(redirectTo);
    } catch (error: any) {
      // Handle structured API errors
      const message =
        error?.data?.message ||
        error?.message ||
        "Login failed. Please check your credentials.";
      toast.error(message);
    }
  };

  return (
    <div className="relative h-screen w-full flex flex-col lg:flex-row">
      {/* Left – Brand Panel */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:block lg:flex-1 h-screen overflow-hidden bg-[#E6F4FF]"
      >
        <div className="w-full h-full flex items-center justify-center">
          <Image
            src="/auth/logo.png"
            alt="LumaG Genius AI"
            width={200}
            height={200}
            className="object-contain"
            priority
          />
        </div>
      </motion.div>

      {/* Right – Sign-In Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-white lg:min-h-screen"
      >
        <div className="w-full max-w-md lg:max-w-lg space-y-8">
          {/* Title */}
          <div className="text-center space-y-3">
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
              Admin Sign In
            </h1>
            <p className="text-lg sm:text-xl text-secondary">
              Please login to continue to your account.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <FloatingInput
              label="Email"
              type="email"
              autoComplete="email"
              error={errors.email_address?.message}
              labelClassName="text-secondary"
              className="h-14 rounded-full border-2 focus:border-primary focus:ring-0 px-6 text-base"
              {...register("email_address")}
              onChange={handleTrimChange("email_address")}
            />

            {/* Password */}
            <FloatingInput
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              error={errors.password?.message}
              labelClassName="text-secondary"
              className="h-14 rounded-full border-2 focus:border-primary focus:ring-0 px-6 pr-14 text-base"
              {...register("password")}
              onChange={handleTrimChange("password")}
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

            {/* Remember Me */}
            <Controller
              name="rememberMe"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="rememberMe"
                    className="h-5 w-5 border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <Label
                    htmlFor="rememberMe"
                    className="text-sm sm:text-base text-secondary cursor-pointer font-normal select-none"
                  >
                    Keep me logged in
                  </Label>
                </div>
              )}
            />

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white text-lg font-semibold rounded-full shadow-md transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Forgot Password */}
            <div className="text-center text-sm sm:text-base">
              <span className="text-secondary">Forgot Password? </span>
              <Link
                href="/forgot-password"
                className="text-primary font-semibold hover:text-primary/80 hover:underline transition-colors"
              >
                Reset
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
