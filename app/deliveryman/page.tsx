"use client";

import { useState } from "react";
import Container from "@/components/container";
import StatsSection from "@/components/deliveryman/stats-section";
import Table from "@/components/deliveryman/table";
import Header from "@/components/deliveryman/header";
import BranchFilters from "@/components/branches/BranchFilters";
import { useAuth } from "@/hooks/useAuth";
import { useDeliverymen } from "@/hooks/useDeliverymen";

const Deliveryman = () => {
  const { restaurantId, loading } = useAuth();

  /* ================= FILTERS ================= */
  const [filters, setFilters] = useState({
    search: "",
    page: 1,
    limit: 10,
  });

  /* ================= QUERY ================= */
  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useDeliverymen({
    search: filters.search,
    page: filters.page,
    // ✅ safe fallback
    branchId: undefined,
    status: undefined,
    // 👇 important
    restaurantId: restaurantId ?? undefined,
  } as any);

  /* ================= DATA NORMALIZATION ================= */
  const deliverymen = data?.data || [];
  const meta = data?.meta || null;

  /* ================= FILTER CHANGE ================= */
  const handleFilterChange = (newFilters: any) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, // ✅ reset pagination on filter change
    }));
  };

  /* ================= LOADING STATE ================= */
  const isTableLoading = isLoading || isFetching || loading;

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
          refresh={refetch} // ✅ React Query refetch
        />
      </div>
    </Container>
  );
};

export default Deliveryman;