"use client";

import { useState } from "react";
import StatsSection from "@/components/shared/stats-section";
import Header from "@/components/orders/header";
import { statsData } from "@/constants/orders";
import Container from "@/components/container";
import Table from "@/components/orders/table";
import { Button } from "@/components/ui/button";
import OrdersFilters from "@/components/orders/OrdersFilters";

type OrderTab = "delivery" | "pickup" | "reservations";

export default function Orders() {
  const [activeTab, setActiveTab] = useState<OrderTab>("delivery");

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
      <Header title={title} description={description} />

      <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm space-y-6">
        {/* Stats */}
        <StatsSection stats={statsData} className="xl:grid-cols-4" />

        {/* Tabs */}
        <div className="flex items-center gap-6">
          <TabButton
            active={activeTab === "delivery"}
            onClick={() => setActiveTab("delivery")}
          >
            Delivery Orders
          </TabButton>

          <TabButton
            active={activeTab === "pickup"}
            onClick={() => setActiveTab("pickup")}
          >
            Pick up Orders
          </TabButton>

          <TabButton
            active={activeTab === "reservations"}
            onClick={() => setActiveTab("reservations")}
          >
            Reservations
          </TabButton>
        </div>

        {/* Filters (can also be conditional if needed) */}
        <OrdersFilters />

        {/* Dynamic Content */}
        <Table  />
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
          ? "rounded-[14px] px-6 py-2.5 bg-primary hover:bg-primary text-white text-sm font-medium"
          : "rounded-full px-6 py-2 text-gray-500 text-sm font-medium hover:text-black hover:bg-transparent"
      }
    >
      {children}
    </Button>
  );
}
