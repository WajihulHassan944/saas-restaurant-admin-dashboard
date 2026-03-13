"use client";

import { useState, useCallback, useEffect } from "react";
import Container from "@/components/container";
import Header from "@/components/branches/header";
import BranchesClient from "@/components/branches/BranchesClient";
import { API_BASE_URL } from "@/lib/constants";

export default function BranchesPage() {
  const [branches, setBranches] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchBranches = useCallback(async (filters: any = {}) => {
    setLoading(true);

    try {
      const authRaw = localStorage.getItem("auth");
      if (!authRaw) return;

      const auth = JSON.parse(authRaw);

      const token = auth?.accessToken;
      const restaurantId = auth?.user?.restaurantId;

      if (!token || !restaurantId) return;

      const params = new URLSearchParams({
        restaurantId,
        search: filters.search || "",
        sortOrder: filters.sortOrder || "ASC",
        includeInactive: String(filters.includeInactive || false),
        withDeleted: String(filters.withDeleted || false),
        page: String(filters.page || 1),
      });

      const res = await fetch(
        `${API_BASE_URL}/v1/branches?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setBranches(data?.data || []);
        setMeta(data?.meta || null);
      }
    } catch (error) {
      console.error("Failed to fetch branches:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  return (
    <Container>
      <Header
        title="Branch List"
        description="View and manage all branches from here"
        onBranchCreated={() => fetchBranches()}
      />

      <div className="space-y-[32px] bg-white lg:p-[30px] rounded-[14px] shadow-sm">
        <BranchesClient
          branches={branches}
          meta={meta}
          loading={loading}
          fetchBranches={fetchBranches}
        />
      </div>
    </Container>
  );
}