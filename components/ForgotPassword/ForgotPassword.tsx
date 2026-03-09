"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import FormInput from "../register/form/FormInput";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/constants";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
const [isLoading, setIsLoading] = useState(false);

// ✅ Forgot Password Function
const handleForgotPassword = async () => {
  if (!email) {
    toast.error("Please enter your email");
    return;
  }

  try {
    setIsLoading(true);

    const res = await fetch(
      `${API_BASE_URL}/v1/auth/forgot-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Failed to send reset link");
    }

    toast.success("Reset link sent! Check your email.");
  } catch (error: any) {
    toast.error(error.message || "Something went wrong");
  } finally {
    setIsLoading(false);
  }
};
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* ================= LEFT IMAGE ================= */}
      <div className="hidden lg:block relative">
        <Image
          src="/login_banner.jpg"
          alt="Login Banner"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* ================= RIGHT CONTENT ================= */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-[480px] border border-gray-200 rounded-[24px] px-8 py-10">
          {/* Lock Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M12 1C10.6739 1 9.40215 1.52678 8.46447 2.46447C7.52678 3.40215 7 4.67392 7 6V8H6C5.46957 8 4.96086 8.21071 4.58579 8.58579C4.21071 8.96086 4 9.46957 4 10V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V10C20 9.46957 19.7893 8.96086 19.4142 8.58579C19.0391 8.21071 18.5304 8 18 8H17V6C17 5.34339 16.8707 4.69321 16.6194 4.08658C16.3681 3.47995 15.9998 2.92876 15.5355 2.46447C15.0712 2.00017 14.52 1.63188 13.9134 1.3806C13.3068 1.12933 12.6566 1 12 1ZM12 2.9C13.71 2.9 15.1 4.29 15.1 6V8H8.9V6C8.9 4.29 10.29 2.9 12 2.9ZM12.19 10.5C13.13 10.5 13.88 10.71 14.42 11.12C14.96 11.54 15.23 12.1 15.23 12.8C15.23 13.24 15.08 13.63 14.79 14C14.5 14.36 14.12 14.64 13.66 14.85C13.4 15 13.23 15.15 13.14 15.32C13.05 15.5 13 15.72 13 16H11C11 15.5 11.1 15.16 11.29 14.92C11.5 14.68 11.84 14.4 12.36 14.08C12.62 13.94 12.83 13.76 13 13.54C13.14 13.33 13.22 13.08 13.22 12.8C13.22 12.5 13.13 12.28 12.95 12.11C12.77 11.93 12.5 11.85 12.19 11.85C11.92 11.85 11.7 11.92 11.5 12.06C11.34 12.2 11.24 12.41 11.24 12.69H9.27C9.22 12 9.5 11.4 10.05 11.04C10.59 10.68 11.3 10.5 12.19 10.5ZM11 17H13V19H11V17Z" fill="#ECF0F4"/>
</svg>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-[26px] font-semibold text-center text-[#EC5834]">
            Forgot password?
          </h1>

          <p className="text-center text-sm text-gray-500 mt-3 leading-relaxed">
            Enter the email address associated with your account
            and we'll send you a link to reset your password.
          </p>

          {/* Form */}
          <div className="mt-8 space-y-6">
            <FormInput
              label="Email"
              placeholder="Enter Your Email"
               value={email}
  onChange={(val) => setEmail(val)}
            />

            {/* Send Reset Link */}
         <Button
  onClick={handleForgotPassword}
  className="w-full h-[52px] rounded-[14px] text-base bg-primary hover:bg-red-800"
  disabled={isLoading}
>
  {isLoading ? "Sending..." : "Send Reset Link"}
</Button>

            {/* OR */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-sm text-gray-700">or</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            {/* Back to Login */}
            <Link href="/login" className="w-full h-[52px] border border-gray-300 rounded-[14px] flex items-center justify-center gap-2 text-sm font-medium text-blue-600 hover:bg-gray-50 transition">
              <ArrowLeft size={16} />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
