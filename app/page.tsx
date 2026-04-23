"use client";

import Container from "../components/container";
import AnalyticsGrid from "@/components/dashboard/order-trend-section";
import RevenueAnalytics from "@/components/dashboard/revenue-trend-section";
import StatsSection from "@/components/shared/stats-section";
import Header from "@/components/header";
import { managementData } from "@/constants/dashboard";
import ManagementSection from "@/components/dashboard/ManagementSection";
import { useAuth } from "@/hooks/useAuth";
import { useGetRestaurantDashboardOverview } from "@/hooks/useDashboard";

export default function Home() {
  const { restaurantId, loading: authLoading } = useAuth();

  const {
    data: dashboardOverviewResponse,
    isLoading,
    isFetching,
  } = useGetRestaurantDashboardOverview(
    restaurantId
      ? {
          restaurantId,
        }
      : undefined
  );

  const overview = dashboardOverviewResponse?.data;

  const statsData = [
    {
      _id: "total-orders",
      title: "Total Orders",
      value: overview?.totalOrders ?? 0,
      icon: "orders",
      iconStyle: "default",
      trend: {
        direction: "up",
        percentage: `${overview?.activeOrders ?? 0} Active`,
      },
    },
    {
      _id: "total-revenue",
      title: "Total Revenue",
      value: `${Number(overview?.totalRevenue ?? 0).toLocaleString()}`,
      icon: "revenue",
      iconStyle: "default",
      trend: {
        direction: "up",
        percentage: `Avg: ${Number(
          overview?.averageOrderValue ?? 0
        ).toLocaleString()}`,
      },
    },
    {
      _id: "total-customers",
      title: "Total Customers",
      value: overview?.totalCustomers ?? 0,
      icon: "users",
      iconStyle: "default",
      trend: {
        direction: "up",
        percentage: `${overview?.activeCustomers ?? 0} Active`,
      },
    },
    {
      _id: "deliverymen",
      title: "Available Deliverymen",
      value: overview?.availableDeliverymen ?? 0,
      icon: "ongoing",
      iconStyle: "default",
      trend: {
        direction: "up",
        percentage: `${overview?.totalDeliverymen ?? 0} Total`,
      },
    },
    {
      _id: "employees",
      title: "Active Employees",
      value: overview?.activeEmployees ?? 0,
      icon: "completed",
      iconStyle: "default",
      trend: {
        direction: "up",
        percentage: `${overview?.totalEmployees ?? 0} Total`,
      },
    },
  ] as any;

  const statsLoading = authLoading || isLoading || isFetching;

  return (
    <Container>
      <Header
        title="Dashboard Overview"
        description={
          <>
            Welcome back! Here's what's happening today. <br />
            Last updated: Just now{" "}
            <span className="text-xl align-middle">•</span>
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-green mx-2 align-middle" />
            Live sync active
          </>
        }
      />

      <StatsSection
        stats={statsData}
        loading={statsLoading}
        className="xl:grid-cols-5"
      />

      <ManagementSection items={managementData} />

      <AnalyticsGrid />

      <RevenueAnalytics />
    </Container>
  );
}