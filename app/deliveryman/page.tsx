"use client";

import { useEffect, useState, useCallback } from "react";
import Container from "@/components/container";
import StatsSection from "@/components/deliveryman/stats-section";
import Table from "@/components/deliveryman/table";
import Header from "@/components/deliveryman/header";
import BranchFilters from "@/components/branches/BranchFilters";
import useApi from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";

const Deliveryman = () => {
  const { token } = useAuth();
  const { get } = useApi(token);

  const [deliverymen, setDeliverymen] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);

  const [filters, setFilters] = useState({
    search: "",
    page: 1,
    limit: 10,
  });

  /* ================= GET AUTH ================= */

  const getStoredAuth = () => {
    try {
      const stored = localStorage.getItem("auth");
      return stored ? JSON.parse(stored) : null;
    } catch (err) {
      console.error("Error parsing auth from localStorage:", err);
      return null;
    }
  };

  /* ================= FETCH DELIVERYMEN ================= */

  const fetchDeliverymen = useCallback(async () => {
    try {
      const stored = getStoredAuth();

      console.log("Stored auth:", stored);

      const restaurantId = stored?.user?.restaurantId;
      const branchId = stored?.user?.branchId;

      if (!restaurantId || !branchId) {
        console.warn("Missing restaurantId or branchId");
        return;
      }

      const url = `/v1/deliverymen?restaurantId=${restaurantId}&branchId=${branchId}&page=${filters.page}&limit=${filters.limit}`;

      console.log("API URL:", url);

      const res = await get(url);

      console.log("API RAW RESPONSE:", res);

      if (!res) {
        console.warn("No response from API");
        return;
      }

      /* ================= HANDLE RESPONSE ================= */

      let data = Array.isArray(res)
        ? res
        : res.data || [];

      console.log("Before filter:", data);

      /* ================= CLIENT SIDE SEARCH ================= */

      if (filters.search) {
        data = data.filter((d: any) =>
          `${d.firstName || ""} ${d.lastName || ""}`
            .toLowerCase()
            .includes(filters.search.toLowerCase())
        );
      }

      console.log("After filter:", data);

      setDeliverymen(data);
      setMeta(res.meta || null);

    } catch (error) {
      console.error("Error fetching deliverymen:", error);
    }
  }, [filters.page, filters.limit, filters.search, get, token]);

  /* ================= FILTER CHANGE ================= */

  const handleFilterChange = (newFilters: any) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  /* ================= EFFECT ================= */

useEffect(() => {
  if (!token) return; // ⛔ prevent early call
  fetchDeliverymen();
}, [token, filters.page, filters.limit, filters.search]);
  /* ================= STATE DEBUG ================= */

  useEffect(() => {
    console.log("Updated deliverymen state:", deliverymen);
  }, [deliverymen]);

  return (
    <Container>
      <Header
        title="Delivery Man List"
        description="View and manage all Delivery Man from here"
      />

      <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm space-y-6">
        <StatsSection />

        <BranchFilters
          branches={deliverymen}
          filters={filters}
          onFilterChange={handleFilterChange}
        />

      <Table
  data={deliverymen}
  meta={meta}
  onPageChange={(page: number) =>
    setFilters((prev) => ({ ...prev, page }))
  }
  refresh={fetchDeliverymen}
/>
      </div>
    </Container>
  );
};

export default Deliveryman;