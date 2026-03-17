"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";

import {
  useVerifyResetCodeMutation,
  useResendVerificationCodeMutation,
} from "@/redux/services/authApi";
import { getCookie, setCookie } from "@/redux/features/apiSlice";

// The API uses a 6-digit code
const otpSchema = z.object({
  otp: z.string().length(6, { message: "Enter the 6-digit code." }),
});

type FormValues = z.infer<typeof otpSchema>;

const VerifyOtp = () => {
  const [countdown, setCountdown] = useState(60);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  // Read user_id from cookie set by ForgetPassword step
  const userId = getCookie("reset_userId") || "";

  const [verifyResetCode, { isLoading: isVerifying }] =
    useVerifyResetCodeMutation();
  const [resendCode, { isLoading: isResending }] =
    useResendVerificationCodeMutation();

  const isLoading = isVerifying || isResending;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Handle Resend
  const handleResend = async () => {
    if (!userId) {
      toast.error("Session expired. Please start the forgot-password flow again.");
      router.replace("/forgot-password");
      return;
    }
    try {
      const result = await resendCode({ user_id: userId }).unwrap();
      toast.success(result.message || "A new verification code has been sent.");
      setCountdown(60);
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message ||
        "Failed to resend code. Please try again.";
      // If account is already verified, redirect to login
      if (message.toLowerCase().includes("already verified")) {
        toast.info(message);
        router.replace("/signin");
      } else {
        toast.error(message);
      }
    }
  };

  // Handle OTP submission
  const onSubmit = async (data: FormValues) => {
    if (!userId) {
      toast.error("Session expired. Please start the forgot-password flow again.");
      router.replace("/forgot-password");
      return;
    }

    try {
      const result = await verifyResetCode({
        user_id: userId,
        verification_code: data.otp,
      }).unwrap();

      // Store secret_key in a session cookie for the next (reset-password) step
      setCookie("reset_secretKey", result.secret_key);
      // Mark OTP as verified
      setCookie("reset_verified", "true");

      toast.success(result.message || "Verification successful!");
      router.push("/reset-password");
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message ||
        "Invalid code. Please try again.";
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
              src="/auth/verify-otp.png"
              alt="Verify OTP Illustration"
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
              Verify Code
            </h1>
            <p className="text-base sm:text-lg text-secondary">
              Enter the 6-digit code sent to{" "}
              <span className="font-medium text-foreground">
                {email || "your email"}
              </span>
              .
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 flex flex-col items-center"
          >
            <div className="w-full flex justify-center">
              <Controller
                control={control}
                name="otp"
                render={({ field }) => (
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup className="gap-2 sm:gap-3">
                      {[...Array(6)].map((_, index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          className="w-11 h-14 sm:w-14 sm:h-16 border-2 border-input focus:border-primary focus:ring-4 focus:ring-primary/10 text-xl font-semibold"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                )}
              />
            </div>
            {errors.otp && (
              <p className="text-sm text-destructive">{errors.otp.message}</p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white text-lg font-semibold rounded-full shadow-md transition-all duration-200"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  Verifying…
                </>
              ) : (
                "Verify Code"
              )}
            </Button>

            {/* Resend */}
            <div className="text-center text-sm sm:text-base">
              <span className="text-secondary">Didn&apos;t receive the code? </span>
              <button
                type="button"
                onClick={handleResend}
                disabled={countdown > 0 || isLoading}
                className="text-primary font-semibold hover:text-primary/80 hover:underline transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {countdown > 0 ? `Resend in ${formatTime(countdown)}` : "Resend"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOtp;
