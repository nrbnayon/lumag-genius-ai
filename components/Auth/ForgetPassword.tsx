"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/floating-input";
import { toast } from "sonner";
import { emailValidationSchema } from "@/lib/formDataValidation";
import { useForgotPasswordMutation } from "@/redux/services/authApi";
import { setCookie } from "@/redux/features/apiSlice";

type FormValues = z.infer<typeof emailValidationSchema>;

const ForgetPassword = () => {
  const router = useRouter();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(emailValidationSchema),
    defaultValues: { email_address: "" },
  });

  const handleTrimChange =
    (field: "email_address") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(field, e.target.value.trim(), { shouldValidate: true });
    };

  const onSubmit = async (data: FormValues) => {
    try {
      const result = await forgotPassword({
        email_address: data.email_address.trim(),
      }).unwrap();

      // Store user_id in a short-lived cookie so the next steps can use it
      // (better than passing it in the URL)
      setCookie("reset_userId", result.user_id, undefined); // session cookie

      toast.success(
        result.message ||
          "A password reset verification code has been sent to your email address."
      );

      router.push(
        `/verify-otp?flow=reset&email=${encodeURIComponent(data.email_address.trim())}`
      );
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
              src="/auth/forget-password.png"
              alt="Security Illustration"
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
              Forgot Password
            </h1>
            <p className="text-base sm:text-lg text-secondary">
              Enter your email address to receive a reset code.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white text-lg font-semibold rounded-full shadow-md transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  Sending…
                </>
              ) : (
                "Send Reset Code"
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgetPassword;
