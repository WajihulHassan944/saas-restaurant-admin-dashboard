"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import FormInput from "../register/form/FormInput";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/constants";

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    restaurantId: "",
  });

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= PREFILL FROM URL =================
  useEffect(() => {
    const email = searchParams.get("email");
    const restaurantId = searchParams.get("restaurantId");

    setFormData((prev) => ({
      ...prev,
      email: email || prev.email,
      restaurantId: restaurantId || prev.restaurantId,
    }));
  }, [searchParams]);

  const handleSubmit = async () => {
    if (!formData.email || !formData.password || !formData.restaurantId) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setIsLoading(true);

      const res = await fetch(`${API_BASE_URL}/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          restaurantId: formData.restaurantId,
        }),
      });

      const data = await res.json();
      console.log("data from backend stored in local storage", data);

      if (!res.ok) {
        throw new Error(data?.message || "Login failed");
      }

      localStorage.setItem("auth", JSON.stringify(data.data));

      toast.success("Login successful");

      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
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
        <div className="w-full max-w-[420px]">
          <h1 className="text-[26px] font-semibold text-center">
            Try <br />
            <span className="text-primary">SaaS Based Food Delivery</span>
            <br />
            to build your business
          </h1>

          <p className="text-center text-sm text-gray-400 mt-3">
            Digitalize your business and empowering growth
          </p>

          {/* FORM */}
          <div className="mt-10 space-y-6">
            <FormInput
              label="Email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(val) => handleChange("email", val)}
            />

            <FormInput
              label="Password"
              placeholder="Enter your password"
              showPasswordToggle
              value={formData.password}
              onChange={(val) => handleChange("password", val)}
            />

            <FormInput
              label="Restaurant ID"
              placeholder="Enter restaurant id"
              value={formData.restaurantId}
              onChange={(val) => handleChange("restaurantId", val)}
            />

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-gray-500">
                <Checkbox checked />
                Remember me
              </label>

              <Link
                href="/forgot-password"
                className="text-primary hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* SIGN IN */}
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full h-[48px] rounded-[12px] text-base"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>

            {/* OR */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-900">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* GOOGLE */}
            <button className="w-full h-[48px] border rounded-[12px] flex items-center justify-center gap-3 text-sm font-medium hover:bg-gray-50 transition border-[#BBBBBB]">
              <Image
                src="/google_icon.png"
                alt="Google"
                width={18}
                height={18}
              />
              Sign in With Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;