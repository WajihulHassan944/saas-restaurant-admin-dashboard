"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import FormInput from "../register/form/FormInput";

const Login = () => {
  
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
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
        <div className="w-full max-w-[420px]">
          {/* Heading */}
          <h1 className="text-[26px] font-semibold text-center">
            Try{" "}<br />
            <span className="text-primary">SaaS Based Food Delivery</span>
            <br />
            to build your business
          </h1>

          <p className="text-center text-sm text-gray-400 mt-3">
            Digitalize your business and empowering growth
          </p>

          {/* Form */}
          <div className="mt-10 space-y-6">
            <FormInput
              label="Email"
              placeholder="Your business name"
            />

           <FormInput
  label="Password"
  placeholder="Enter your password"
  showPasswordToggle
/>


            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-gray-500">
                <Checkbox checked />
                Remember me
              </label>

              <button className="text-primary hover:underline">
                Forgot Password?
              </button>
            </div>

            {/* Sign In */}
            <Button className="w-full h-[48px] rounded-[12px] text-base">
              Sign in
            </Button>

            {/* OR */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-900">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Google */}
            <button className="w-full h-[48px] border rounded-[12px] flex items-center justify-center gap-3 text-sm font-medium hover:bg-gray-50 transition border-[#BBBBBB]">
              <Image
                src="/google_icon.png"
                alt="Google"
                width={18}
                height={18}
              />
              Sign in / Sign up With Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
