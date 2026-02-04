"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import FormInput from "../register/form/FormInput";
import { ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
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
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="text-white"
              >
                <path
                  d="M6 10V8a6 6 0 1112 0v2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <rect
                  x="5"
                  y="10"
                  width="14"
                  height="10"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
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
            />

            {/* Send Reset Link */}
            <Button className="w-full h-[52px] rounded-[14px] text-base bg-primary hover:bg-red-800">
              Send Reset Link
            </Button>

            {/* OR */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-sm text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Back to Login */}
            <button className="w-full h-[52px] border border-gray-300 rounded-[14px] flex items-center justify-center gap-2 text-sm font-medium text-blue-600 hover:bg-gray-50 transition">
              <ArrowLeft size={16} />
              Back to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
