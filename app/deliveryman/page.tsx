"use client";

import { useState } from "react";
import Container from "@/components/container";
import StatsSection from "@/components/deliveryman/stats-section";
import Table from "@/components/deliveryman/table";
import Header from "@/components/deliveryman/header";
import BranchFilters from "@/components/branches/BranchFilters";
import { useAuth } from "@/hooks/useAuth";
import { useDeliverymen } from "@/hooks/useDeliverymen";
import { useGetDeliverymenStats } from "@/hooks/useDashboard";

const Deliveryman = () => {
  const { restaurantId, loading } = useAuth();

  const [filters, setFilters] = useState({
    search: "",
    page: 1,
    limit: 10,
  });

  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useDeliverymen({
    search: filters.search,
    page: filters.page,
    branchId: undefined,
    status: undefined,
    restaurantId: restaurantId ?? undefined,
  } as any);

  const {
    data: deliverymanStatsResponse,
    isLoading: isStatsLoading,
    isFetching: isStatsFetching,
    refetch: refetchDeliverymanStats,
  } = useGetDeliverymenStats(
    restaurantId
      ? {
          restaurantId,
        }
      : undefined
  );

  const deliverymanStats = deliverymanStatsResponse?.data;

  const deliverymen = data?.data || [];
  const meta = data?.meta || null;

  const handleFilterChange = (newFilters: any) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1,
    }));
  };

  const handleRefresh = () => {
    refetch();
    refetchDeliverymanStats();
  };

  const isTableLoading = isLoading || isFetching || loading;
  const isCardLoading = isStatsLoading || isStatsFetching || loading;

  return (
    <Container>
      <Header
        title="Delivery Man List"
        description="View and manage all Delivery Man from here"
      />

      <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm space-y-6">
        <StatsSection
          stats={deliverymanStats}
          loading={isCardLoading}
        />

        <BranchFilters
          branches={deliverymen}
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        <Table
          data={deliverymen}
          meta={meta}
          loading={isTableLoading}
          onPageChange={(page: number) =>
            setFilters((prev) => ({ ...prev, page }))
          }
          refresh={handleRefresh}
        />
      </div>
    </Container>
  );
};

export default Deliveryman;