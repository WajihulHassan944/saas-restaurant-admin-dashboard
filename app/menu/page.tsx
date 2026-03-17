"use client";

import { useEffect, useState } from "react";
import Container from "@/components/container";
import Header from "@/components/menu/header";
import Table from "@/components/menu/list";
import BranchFilters from "@/components/branches/BranchFilters";
import BranchesPagination from "@/components/branches/BranchesPagination";
import { API_BASE_URL } from "@/lib/constants";
import { toast } from "sonner";

interface Menu {
  id: string;
  name: string;
  isDefault?: boolean;
  _count?: {
    items: number;
  };
}

export default function MenusPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [filteredMenus, setFilteredMenus] = useState<Menu[]>([]);
  const [filters, setFilters] = useState({ search: "" });

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
      setFilteredMenus(data.data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load menus");
    }
  };

  useEffect(() => {
    if (token && restaurantId) {
      fetchMenus();
    }
  }, [token, restaurantId]);

  /* ================= FILTER HANDLER ================= */

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);

    const search = newFilters.search?.toLowerCase() || "";

    const filtered = menus.filter((menu) =>
      menu.name?.toLowerCase().includes(search)
    );

    setFilteredMenus(filtered);
  };

  return (
    <Container>
      <Header
        title="Menu List"
        description="View and manage all Menu from here"
      />

      <div className="space-y-[32px] bg-white lg:p-[30px] rounded-[14px] shadow-sm">
        <BranchFilters
          branches={menus}
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        <div className="px-2 lg:px-0">
          <Table menus={filteredMenus} />
          <BranchesPagination />
        </div>
      </div>
    </Container>
  );
}