"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/constants";

interface User {
  id: string;
  email: string;
  role: string;
  tenantId: string;
  restaurantId: string;
  branchId: string;
  profile: {
    firstName: string;
    lastName: string;
    avatarUrl: string;
    phone?: string | null;
    bio?: string;
  };
}

export const useAuth = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const publicRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const getStoredAuth = () => {
    const stored = localStorage.getItem("auth");
    if (!stored) return null;
    return JSON.parse(stored);
  };

  const saveAuth = (data: any) => {
    localStorage.setItem("auth", JSON.stringify(data));
  };

  const clearAuth = () => {
    localStorage.removeItem("auth");
  };

  const refreshToken = async () => {
    const stored = getStoredAuth();
    if (!stored?.refreshToken) return false;

    try {
      const res = await fetch(`${API_BASE_URL}/v1/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: stored.refreshToken,
        }),
      });

      if (!res.ok) return false;

      const data = await res.json();
      saveAuth(data.data);

      return data.data.accessToken;
    } catch (err) {
      console.error("Refresh token failed", err);
      return false;
    }
  };

  const fetchMe = async (token: string) => {
    const res = await fetch(`${API_BASE_URL}/v1/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Unauthorized");

    const data = await res.json();
    return data.data;
  };

  const checkAuth = async () => {
    // ✅ Skip auth for public routes
    if (isPublicRoute) {
      setLoading(false);
      return;
    }

    try {
      const stored = getStoredAuth();

      if (!stored?.accessToken) {
        router.push("/login");
        return;
      }

      try {
        const me = await fetchMe(stored.accessToken);
        setUser(me);
      } catch {
        const newAccessToken = await refreshToken();

        if (!newAccessToken) {
          clearAuth();
          router.push("/login");
          return;
        }

        const me = await fetchMe(newAccessToken);
        setUser(me);
      }
    } catch (err) {
      console.error("Auth check failed", err);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  return {
    user,
    loading,
  };
};