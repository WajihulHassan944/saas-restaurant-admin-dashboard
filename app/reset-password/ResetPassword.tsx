"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/constants";
import FormInput from "@/components/register/form/FormInput";
import { useRouter, useSearchParams } from "next/navigation";

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [restaurantId, setRestaurantId] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);

  /* ================= GET EMAIL + RESTAURANT FROM URL ================= */

  useEffect(() => {
    const emailFromUrl = searchParams.get("email");
    const restaurantIdFromUrl = searchParams.get("restaurantId");

    if (emailFromUrl) setEmail(emailFromUrl);
    if (restaurantIdFromUrl) setRestaurantId(restaurantIdFromUrl);
  }, [searchParams]);

  /* ================= COUNTDOWN TIMER ================= */

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  /* ================= RESET PASSWORD ================= */

  const handleResetPassword = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    if (!restaurantId) {
      toast.error("Invalid restaurant ID");
      return;
    }

    if (!otp) {
      toast.error("Please enter the 5 digit OTP");
      return;
    }

    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }

    try {
      setIsLoading(true);

      const res = await fetch(`${API_BASE_URL}/v1/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
          newPassword,
          restaurantId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Password reset failed");
      }

      toast.success("Password reset successfully!");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= RESEND OTP ================= */

  const handleResendOtp = async () => {
    if (!email || !restaurantId) {
      toast.error("Missing email or restaurant id");
      return;
    }

    try {
      setIsResending(true);

      const res = await fetch(`${API_BASE_URL}/v1/auth/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          restaurantId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to resend OTP");
      }

      toast.success("OTP resent successfully");

      setCountdown(60);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      
      {/* LEFT IMAGE */}
      <div className="hidden lg:block relative">
        <Image
          src="/login_banner.jpg"
          alt="Login Banner"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-[480px] border border-gray-200 rounded-[24px] px-8 py-10">

          {/* ICON */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
                <path d="M12 1C9 1 7 3 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8H17V6C17 3 15 1 12 1Z" fill="#ECF0F4"/>
              </svg>
            </div>
          </div>

          {/* HEADING */}
          <h1 className="text-[26px] font-semibold text-center text-[#EC5834]">
            Reset your password
          </h1>

          <p className="text-center text-sm text-gray-500 mt-3 leading-relaxed">
            Enter the OTP sent to your email and choose a new password.
          </p>

          {/* FORM */}
          <div className="mt-8 space-y-6">

            <FormInput
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(val) => setEmail(val)}
            />

            <FormInput
              label="OTP"
              placeholder="Enter 5 digit OTP"
              value={otp}
              onChange={(val) => setOtp(val)}
            />

            {/* RESEND OTP */}
            <div className="flex justify-between items-center text-sm">
              {countdown > 0 ? (
                <span className="text-gray-500">
                  Resend OTP in {countdown}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className="text-blue-600 hover:underline"
                >
                  {isResending ? "Sending..." : "Resend OTP"}
                </button>
              )}
            </div>

            <FormInput
              label="New Password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(val) => setNewPassword(val)}
            />

            <FormInput
              label="Restaurant ID"
              placeholder="Enter Your restaurant id"
              value={restaurantId}
              onChange={(val) => setRestaurantId(val)}
            />

            <Button
              onClick={handleResetPassword}
              className="w-full h-[52px] rounded-[14px] text-base bg-primary hover:bg-red-800"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>

            {/* OR */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-sm text-gray-700">or</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            {/* BACK TO LOGIN */}
            <Link
              href="/login"
              className="w-full h-[52px] border border-gray-300 rounded-[14px] flex items-center justify-center gap-2 text-sm font-medium text-blue-600 hover:bg-gray-50 transition"
            >
              <ArrowLeft size={16} />
              Back to login
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;