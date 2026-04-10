"use client";

import { useState } from "react";
import Container from "@/components/container";
import Header from "@/components/branches/header";
import BranchesClient from "@/components/branches/BranchesClient";
import { useGetBranches } from "@/hooks/useBranches";
import { useAuth } from "@/hooks/useAuth"; // assuming you already have this

export default function BranchesPage() {
  /**
   * ==============================
   * LOCAL FILTER STATE
   * ==============================
   */
  const [filters, setFilters] = useState({
    search: "",
    sortOrder: "ASC" as "ASC" | "DESC",
    includeInactive: false,
    withDeleted: false,
    page: 1,
  });

  const { user } = useAuth(); // cleaner than localStorage
const restaurantId =
  user?.restaurantId ?? undefined;
  /**
   * ==============================
   * QUERY
   * ==============================
   */
  const { data, isLoading, refetch } = useGetBranches({
    ...filters,
    restaurantId,
  });

  const branches = data?.data || [];
  const meta = data?.meta || null;

  /**
   * ==============================
   * HANDLERS
   * ==============================
   */
  const handleFetchBranches = (newFilters?: Partial<typeof filters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  return (
    <Container>
      <Header
        title="Branch List"
        description="View and manage all branches from here"
        onBranchCreated={refetch} // ✅ clean refetch
      />

      <div className="space-y-[32px] bg-white lg:p-[30px] rounded-[14px] shadow-sm">
        <BranchesClient
          branches={branches}
          meta={meta}
          loading={isLoading}
          fetchBranches={handleFetchBranches} // ✅ controlled filter update
        />
      </div>
    </Container>
  );
}