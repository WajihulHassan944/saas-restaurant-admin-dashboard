"use client";

import { useEffect, useState } from "react";
import Container from "@/components/container";
import StatsSection from "@/components/customer-settings/stats-section";
import Table from "@/components/customer-settings/table";
import Header from "@/components/customer-settings/header";
import BranchFilters from "@/components/branches/BranchFilters";
import useApi from "@/hooks/useApi";
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "sonner";

interface Customer {
  id: string;
  email?: string;
  isActive?: boolean;
  createdAt?: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
  _count?: {
    customerOrders?: number;
  };
}

export default function CustomerSettingsPage() {
  const { user, token } = useAuthContext();
  const restaurantId = user?.restaurantId;

  const { get, loading } = useApi(token);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [page, setPage] = useState(1);

const fetchCustomers = async (targetPage = page) => {
  if (!restaurantId) return;

  const res = await get(
    `/v1/admin/users/customers?restaurantId=${restaurantId}&page=${targetPage}`
  );

  if (res?.error) {
    toast.error(res.error);
    return;
  }

  setCustomers(res?.data || []);
  setMeta(res?.meta || null);
};

useEffect(() => {
  fetchCustomers(page);
}, [restaurantId, page]);

  return (
    <Container>
      <Header
        title="Customer List"
        description="View and manage all customers from here"
        onRefresh={() => fetchCustomers(page)}
      />

      <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm space-y-6">
        <StatsSection />

        <BranchFilters />

        {/* ✅ PASS DATA */}
      <Table
  customers={customers}
  loading={loading}
  meta={meta}
  onPageChange={setPage}
  onRefresh={() => fetchCustomers(page)}
/>
      </div>
    </Container>
  );
}