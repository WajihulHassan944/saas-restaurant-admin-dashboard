"use client";

import { useEffect, useState } from "react";
import BranchCard from "../cards/BranchCard";
import EmptyState from "../shared/EmptyState";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/constants";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Menu {
  id: string;
  name: string;
  isDefault?: boolean;
}

export default function MenuList() {
  const router = useRouter();

  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);

  const [token, setToken] = useState("");
  const [restaurantId, setRestaurantId] = useState("");

  /* ================= LOAD AUTH ================= */

  useEffect(() => {
    const authRaw = localStorage.getItem("auth");

    if (!authRaw) return;

    try {
      const auth = JSON.parse(authRaw);

      setToken(auth?.accessToken || "");
      setRestaurantId(auth?.user?.restaurantId || "");
    } catch {
      console.error("Invalid auth");
    }
  }, []);

  /* ================= FETCH MENUS ================= */

  const fetchMenus = async () => {
    if (!restaurantId || !token) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE_URL}/v1/menus?restaurantId=${restaurantId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setMenus(data.data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load menus");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && restaurantId) {
      fetchMenus();
    }
  }, [token, restaurantId]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  }

  /* ================= EMPTY ================= */

  if (!menus || menus.length === 0) {
    return <EmptyState />;
  }

  /* ================= RENDER ================= */

  return (
    <div className="space-y-3 min-h-[40vh]">
      {menus.map((menu) => (
        <BranchCard
          key={menu.id}
          id={menu.id}
          name={menu.name}
          isDefault={menu.isDefault}
          openMenuDetails={() => router.push(`/menu/listing?id=${menu.id}`)}
        />
      ))}
    </div>
  );
}