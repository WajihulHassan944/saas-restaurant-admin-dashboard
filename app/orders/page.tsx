"use client";

import { useEffect, useState, useMemo } from "react";
import StatsSection from "@/components/shared/stats-section";
import Header from "@/components/orders/header";
import { statsData } from "@/constants/orders";
import Container from "@/components/container";
import Table from "@/components/orders/table";
import { Button } from "@/components/ui/button";
import OrdersFilters from "@/components/orders/OrdersFilters";
import useApi from "@/hooks/useApi";
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "sonner";

type OrderTab = "delivery" | "pickup" | "reservations";

interface Order {
  id: string;
  orderType?: string;
  status?: string;
  totalAmount?: number;
  createdAt?: string;
}

export default function Orders() {
  const [activeTab, setActiveTab] = useState<OrderTab>("delivery");
  const [orders, setOrders] = useState<Order[]>([]);

  // ✅ FILTER STATES
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [status, setStatus] = useState("ALL");

  const { user, token } = useAuthContext();
  const restaurantId = user?.restaurantId;

  const { get, loading } = useApi(token);

  // ✅ FETCH WITH ALL FILTERS
  useEffect(() => {
    if (!restaurantId) return;

    const fetchOrders = async () => {
      const query = new URLSearchParams({
        restaurantId,
        ...(search && { search }),
        ...(status !== "ALL" && { status }),
        sortOrder,
      }).toString();

      const res = await get(`/v1/orders?${query}`);

      if (res?.error) {
        toast.error(res.error);
        return;
      }

      setOrders(res?.data || []);
    };

    fetchOrders();
  }, [restaurantId, search, sortOrder, status]);

  // ✅ TAB FILTER
  const filteredOrders = useMemo(() => {
    if (!orders) return [];

    if (activeTab === "delivery") {
      return orders.filter((o) => o.orderType === "DELIVERY");
    }

    if (activeTab === "pickup") {
      return orders.filter((o) => o.orderType === "TAKEAWAY");
    }

    return orders;
  }, [orders, activeTab]);

  const getHeaderContent = (tab: OrderTab) => {
    switch (tab) {
      case "delivery":
        return {
          title: "Delivery Orders",
          description: "View all delivery orders here",
        };
      case "pickup":
        return {
          title: "Pick Up Orders",
          description: "View all pick up orders here",
        };
      case "reservations":
        return {
          title: "Reservations",
          description: "View all reservations here",
        };
      default:
        return {
          title: "Order List",
          description: "View orders here",
        };
    }
  };

  const { title, description } = getHeaderContent(activeTab);

  return (
    <Container>
      <Header title={title} description={description} orders={filteredOrders} />

      <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm space-y-6">
        <StatsSection stats={statsData} className="xl:grid-cols-4" />

        {/* Tabs */}
        <div className="flex items-center gap-0 flex-wrap text-sm lg:text-base">
          <TabButton active={activeTab === "delivery"} onClick={() => setActiveTab("delivery")}>
            Delivery Orders
          </TabButton>

          <TabButton active={activeTab === "pickup"} onClick={() => setActiveTab("pickup")}>
            Pick up Orders
          </TabButton>

          <TabButton active={activeTab === "reservations"} onClick={() => setActiveTab("reservations")}>
            Reservations
          </TabButton>
        </div>

        {/* ✅ FILTERS */}
        <OrdersFilters
          onSearch={setSearch}
          onSortChange={setSortOrder}
          onStatusChange={setStatus}
        />

        {/* TABLE */}
        <Table orders={filteredOrders} loading={loading} />
      </div>
    </Container>
  );
}

/* ---------- Tab Button ---------- */
function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      variant={active ? "default" : "ghost"}
      className={
        active
          ? "rounded-[14px] px-3 sm:px-6 py-2.5 bg-primary text-white"
          : "rounded-full px-3 sm:px-6 py-2 text-gray-500 hover:text-black"
      }
    >
      {children}
    </Button>
  );
}