"use client";

import { useState } from "react";
import StatsSection from "@/components/shared/stats-section";
import { financialStatsData, statsData } from "@/constants/analytics";
import Container from "@/components/container";
import Table from "@/components/reports/table";
import Header from "@/components/header";
import RevenueAnalytics from "@/components/dashboard/revenue-trend-section";
import AnalyticsFilter from "@/components/reports/AnalyticsFilter";
import TabButton from "@/components/ui/TabButton"; 

type reportTab = "financial" | "order";

export default function Orders() {
  const [activeTab, setActiveTab] = useState<reportTab>("financial");

  const getHeaderContent = (tab: reportTab) => {
    switch (tab) {
      case "financial":
        return {
          title: "Financial Report",
          description: "Manage and view all financial data in one place",
        };
      case "order":
        return {
          title: "Order Report",
          description: "Manage and view all orders in one place",
        };
    }
  };

  const { title, description } = getHeaderContent(activeTab);

  return (
    <Container>
      <Header title={title} description={description} />

      <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm space-y-6">
        <div className="flex items-center gap-6">
          <TabButton
            active={activeTab === "financial"}
            onClick={() => setActiveTab("financial")}
          >
            Financial Report
          </TabButton>

          <TabButton
            active={activeTab === "order"}
            onClick={() => setActiveTab("order")}
          >
            Orders Report
          </TabButton>
        </div>

        {/* Show the financial stats if "financial" tab is active */}
        {activeTab === "financial" ? (
          <>
            <StatsSection stats={financialStatsData} className="xl:grid-cols-4" />
            <AnalyticsFilter />
            <RevenueAnalytics />
          </>
        ) : (
          <>
            <StatsSection stats={statsData} className="xl:grid-cols-4" />
            <Table />
          </>
        )}
      </div>
    </Container>
  );
}
