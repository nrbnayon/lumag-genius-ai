"use client";

import { useState, useEffect } from "react";
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
import { RightSideImage } from "./RightSideImage";

type FormValues = z.infer<typeof emailValidationSchema>;

const ForgetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(41);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(emailValidationSchema),
    defaultValues: {
      email: "",
    },
  });

  // Simple countdown effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleTrimChange =
    (field: "email") => (e: React.ChangeEvent<HTMLInputElement>) => {
      const trimmed = e.target.value.trim();
      setValue(field, trimmed, { shouldValidate: true });
    };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      // Simulation
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Email for reset:", data.email);

      toast.success("OTP sent to your email.");
      router.push(
        `/verify-otp?flow=reset&email=${encodeURIComponent(data.email)}`,
      );
    } catch (error) {
      console.error("Failed to send OTP:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative h-screen w-full flex flex-col lg:flex-row">

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

      {/* Right - Form */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-20 bg-white"
      >
        <div className="w-full max-w-md lg:max-w-lg space-y-8">
          {/* Logo + Title */}
          <div className="text-center space-y-3">
            {/* <div className="flex justify-center mb-6 md:mb-8">
              <Image
                src="/icons/logo.png"
                alt="Xandra Logo"
                width={140}
                height={140}
                className="w-28 sm:w-36 h-auto"
                priority
              />
            </div> */}
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
              Reset password
            </h1>
            <p className="text-base sm:text-lg text-secondary">
              To reset password enter your email
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FloatingInput
              label="Email"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              labelClassName="text-secondary"
              className="h-14 rounded-full border-2 focus:border-primary focus:ring-0 px-6 text-base"
              {...register("email")}
              onChange={handleTrimChange("email")}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white text-lg font-semibold rounded-full shadow-md transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  Sending...
                </>
              ) : (
                "Continue"
              )}
            </Button>

            {/* Resend Link */}
            <div className="text-center text-sm sm:text-base">
              <span className="text-secondary">
                Didn&apos;t get the email?{" "}
              </span>
              <button
                type="button"
                onClick={() => setCountdown(60)}
                disabled={countdown > 0}
                className="text-primary font-semibold hover:text-primary/80 hover:underline transition-colors disabled:opacity-70 disabled:no-underline cursor-pointer"
              >
                {countdown > 0
                  ? `Resent in ${formatTime(countdown)}`
                  : "Resend"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>

    </div>
  );
};

export default ForgetPassword;
