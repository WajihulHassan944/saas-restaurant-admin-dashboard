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
import PaginationSection from "@/components/shared/pagination";
import { sortData } from "@/utils/sort-data";

type OrderTab = "delivery" | "pickup" | "reservations" | "group";

interface Order {
  id: string;
  orderType?: string;
  status?: string;
  totalAmount?: number;
  createdAt?: string;
  isReservation?: boolean;

  // reservation fields
  guestCount?: number;
  reservationDate?: string;
  customerName?: string;
}

export default function Orders() {
  const [activeTab, setActiveTab] = useState<OrderTab>("delivery");
  const [orders, setOrders] = useState<Order[]>([]);

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [status, setStatus] = useState("ALL");

  const [sortKey, setSortKey] = useState<any>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  const { user, token } = useAuthContext();
  const restaurantId = user?.restaurantId;

  const { get, loading } = useApi(token);

  // ✅ FETCH DATA
  useEffect(() => {
    if (!restaurantId) return;

    const fetchData = async () => {
      try {
        // ✅ RESERVATIONS API
        if (activeTab === "reservations") {
          const res = await get(
            `/v1/customer-app/admin/table-reservations?restaurantId=${restaurantId}&page=${page}&limit=${limit}`
          );

          if (res?.error) {
            toast.error(res.error);
            return;
          }

          const mapped = (res?.data || []).map((r: any) => ({
            id: r.id,
            status: r.status,
            createdAt: r.createdAt,
            reservationDate: r.reservationDate,
            guestCount: r.guestCount,
            isReservation: true,
            customerName: `${r.customer?.firstName || ""} ${r.customer?.lastName || ""}`,
          }));

          setOrders(mapped);

          setTotalPages(res?.meta?.totalPages || 1);
          setTotal(res?.meta?.total || 0);
          setHasNext(res?.meta?.hasNext || false);
          setHasPrevious(res?.meta?.hasPrevious || false);

          return;
        }

        // ✅ ORDERS API
        const queryParams: Record<string, string> = {
          restaurantId,
          ...(search && { search }),
          ...(status !== "ALL" && { status }),
          sortOrder,
          page: String(page),
          limit: String(limit),
        };

        // 🔥 backend filtering
        if (activeTab === "delivery") queryParams.orderType = "DELIVERY";
        if (activeTab === "pickup") queryParams.orderType = "TAKEAWAY";

        queryParams.kind =
          activeTab === "group" ? "group-orders" : "order";

        const query = new URLSearchParams(queryParams).toString();

        const res = await get(`/v1/orders?${query}`);

        if (res?.error) {
          toast.error(res.error);
          return;
        }

        setOrders(res?.data || []);

        setTotalPages(res?.meta?.totalPages || 1);
        setTotal(res?.meta?.total || 0);
        setHasNext(res?.meta?.hasNext || false);
        setHasPrevious(res?.meta?.hasPrevious || false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [restaurantId, search, sortOrder, status, page, activeTab]);

  useEffect(() => {
    setPage(1);
  }, [search, sortOrder, status, activeTab]);

  // ✅ SORT
  const handleSort = (key: any) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortedOrders = sortKey
    ? sortData(orders, sortKey, sortDir)
    : orders;

  const getHeaderContent = (tab: OrderTab) => {
    switch (tab) {
      case "delivery":
        return { title: "Delivery Orders", description: "View all delivery orders here" };
      case "pickup":
        return { title: "Pick Up Orders", description: "View all pick up orders here" };
      case "reservations":
        return { title: "Reservations", description: "View all reservations here" };
      case "group":
        return { title: "Group Order Summary", description: "View all group orders here" };
      default:
        return { title: "Order List", description: "View orders here" };
    }
  };

  const { title, description } = getHeaderContent(activeTab);

  return (
    <Container>
      <Header title={title} description={description} orders={sortedOrders} />

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

          <TabButton active={activeTab === "group"} onClick={() => setActiveTab("group")}>
            Group Orders
          </TabButton>
        </div>

        <OrdersFilters
          onSearch={setSearch}
          onSortChange={setSortOrder}
          onStatusChange={setStatus}
        />

        <Table
          orders={sortedOrders}
          loading={loading}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          activeTab={activeTab} // ✅ NEW
        />

        <PaginationSection
          page={page}
          totalPages={totalPages}
          total={total}
          limit={limit}
          hasNext={hasNext}
          hasPrevious={hasPrevious}
          onPageChange={(newPage: number) => setPage(newPage)}
        />
      </div>
    </Container>
  );
}

function TabButton({ active, children, onClick }: any) {
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