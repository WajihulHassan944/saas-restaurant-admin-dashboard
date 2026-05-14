"use client";

import { useMemo, useState } from "react";
import { Download, ReceiptText } from "lucide-react";
import { toast } from "sonner";

import StatsSection from "@/components/shared/stats-section";
import Container from "@/components/container";
import Header from "@/components/header";
import RevenueAnalytics from "@/components/dashboard/revenue-trend-section";
import TabButton from "@/components/ui/TabButton";
import OrdersGraph from "@/components/graphs/orders-graph";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  useGetFinancialReport,
  useGetOrdersReport,
} from "@/hooks/useReports";
import { StatItem } from "@/types/stats";
import RestaurantInvoicesModal from "@/components/reports/RestaurantInvoicesModal";
import { downloadRestaurantDashboardReportPdf } from "@/components/reports/restaurant-report-pdf";

type ReportTab = "financial" | "order";

const getReportCurrency = (financialData: any, ordersData: any) => {
  return (
    financialData?.currency ||
    ordersData?.currency ||
    financialData?.transactions?.[0]?.currency ||
    ordersData?.transactions?.[0]?.currency ||
    "EUR"
  );
};

const formatCurrency = (value: number, currency = "EUR") => {
  const numericValue = Number(value || 0);

  try {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(numericValue);
  } catch {
    return `${currency} ${numericValue.toFixed(2)}`;
  }
};

const getCountByKey = (
  list: { key: string; count: number }[] | undefined,
  keys: string[]
) => {
  const normalizedKeys = keys.map((key) => key.toUpperCase());

  return (
    list
      ?.filter((item) => normalizedKeys.includes(item.key?.toUpperCase()))
      .reduce((total, item) => total + Number(item.count || 0), 0) || 0
  );
};

export default function Orders() {
  const { restaurantId, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<ReportTab>("financial");
  const [invoicesOpen, setInvoicesOpen] = useState(false);

  const {
    data: financialReportResponse,
    isLoading: financialLoading,
    isFetching: financialFetching,
  } = useGetFinancialReport(
    restaurantId
      ? {
          restaurantId,
        }
      : undefined
  );

  const {
    data: ordersReportResponse,
    isLoading: ordersLoading,
    isFetching: ordersFetching,
  } = useGetOrdersReport(
    restaurantId
      ? {
          restaurantId,
        }
      : undefined
  );

  const financialData = financialReportResponse?.data;
  const ordersData = ordersReportResponse?.data;
  const reportCurrency = getReportCurrency(financialData, ordersData);

  const financialStats = useMemo<StatItem[]>(() => {
    return [
      {
        _id: "financial-total-orders",
        title: "Total Orders",
        value: String(financialData?.totalOrders ?? 0),
        icon: "orders",
      },
      {
        _id: "financial-gross-revenue",
        title: "Gross Revenue",
        value: formatCurrency(financialData?.grossRevenue ?? 0, reportCurrency),
        icon: "revenue",
      },
      {
        _id: "financial-paid-revenue",
        title: "Paid Revenue",
        value: formatCurrency(financialData?.paidRevenue ?? 0, reportCurrency),
        icon: "completed",
      },
      {
        _id: "financial-net-revenue",
        title: "Net Revenue",
        value: formatCurrency(financialData?.netRevenue ?? 0, reportCurrency),
        icon: "store",
      },
      {
        _id: "financial-average-order-value",
        title: "Average Order Value",
        value: formatCurrency(
          financialData?.averageOrderValue ?? 0,
          reportCurrency
        ),
        icon: "users",
      },
      {
        _id: "financial-tax",
        title: "Total Tax",
        value: formatCurrency(financialData?.totalTax ?? 0, reportCurrency),
        icon: "revenue",
      },
      {
        _id: "financial-delivery-fee",
        title: "Delivery Fee",
        value: formatCurrency(
          financialData?.totalDeliveryFee ?? 0,
          reportCurrency
        ),
        icon: "orders",
      },
      {
        _id: "financial-refunded",
        title: "Refunded Amount",
        value: formatCurrency(
          financialData?.refundedAmount ?? 0,
          reportCurrency
        ),
        icon: "cancelled",
        iconStyle: "danger",
      },
    ];
  }, [financialData, reportCurrency]);

  const orderStats = useMemo<StatItem[]>(() => {
    const placedOrders = getCountByKey(ordersData?.statusBreakdown, ["PLACED"]);

    const ongoingOrders = getCountByKey(ordersData?.statusBreakdown, [
      "CONFIRMED",
      "PREPARING",
      "READY_FOR_PICKUP",
      "PICKED_UP",
      "READY_TO_SERVE",
      "OUT_FOR_DELIVERY",
    ]);

    const completedOrders = getCountByKey(ordersData?.statusBreakdown, [
      "DELIVERED",
      "SERVED",
      "COMPLETED",
    ]);

    const cancelledOrders = getCountByKey(ordersData?.statusBreakdown, [
      "CANCELLED",
      "REJECTED",
    ]);

    const paidOrders = getCountByKey(ordersData?.paymentStatusBreakdown, [
      "PAID",
    ]);

    const pendingPayments = getCountByKey(ordersData?.paymentStatusBreakdown, [
      "PENDING",
    ]);

    return [
      {
        _id: "orders-total",
        title: "Total Orders",
        value: String(ordersData?.totalOrders ?? 0),
        icon: "orders",
      },
      {
        _id: "orders-placed",
        title: "Placed Orders",
        value: String(placedOrders),
        icon: "ongoing",
      },
      {
        _id: "orders-ongoing",
        title: "Ongoing",
        value: String(ongoingOrders),
        icon: "ongoing",
      },
      {
        _id: "orders-completed",
        title: "Completed",
        value: String(completedOrders),
        icon: "completed",
      },
      {
        _id: "orders-cancelled",
        title: "Cancelled",
        value: String(cancelledOrders),
        icon: "cancelled",
        iconStyle: "danger",
      },
      {
        _id: "orders-total-revenue",
        title: "Total Revenue",
        value: formatCurrency(ordersData?.totalRevenue ?? 0, reportCurrency),
        icon: "revenue",
      },
      {
        _id: "orders-paid",
        title: "Paid Orders",
        value: String(paidOrders),
        icon: "completed",
      },
      {
        _id: "orders-pending-payment",
        title: "Pending Payments",
        value: String(pendingPayments),
        icon: "users",
      },
    ];
  }, [ordersData, reportCurrency]);

  const getHeaderContent = (tab: ReportTab) => {
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

  const activeStats = activeTab === "financial" ? financialStats : orderStats;

  const activeReportData =
    activeTab === "financial" ? financialData : ordersData;

  const activeLoading =
    authLoading ||
    (activeTab === "financial"
      ? financialLoading || financialFetching
      : ordersLoading || ordersFetching);

  const handleDownloadActiveReportPdf = () => {
    if (!restaurantId) {
      toast.error("Restaurant is not available");
      return;
    }

    downloadRestaurantDashboardReportPdf({
      reportType: activeTab,
      title,
      description,
      restaurantId,
      currency: reportCurrency,
      stats: activeStats.map((stat) => ({
        title: stat.title,
        value: String(stat.value ?? "-"),
        description: stat.description,
      })),
      data: activeReportData,
    });

    toast.success(`${title} PDF downloaded successfully`);
  };

  return (
    <Container>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <Header title={title} description={description} />

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            disabled={activeLoading || !restaurantId}
            onClick={handleDownloadActiveReportPdf}
            className="h-[44px] rounded-[12px] border-gray-200 px-5 text-gray-700"
          >
            <Download size={17} className="mr-2" />
            Download PDF
          </Button>

          <Button
            type="button"
            disabled={!restaurantId}
            onClick={() => setInvoicesOpen(true)}
            className="h-[44px] rounded-[12px] px-5"
          >
            <ReceiptText size={17} className="mr-2" />
            Restaurant Invoices
          </Button>
        </div>
      </div>

      <div className="space-y-6 rounded-lg bg-white p-4 shadow-sm lg:p-6">
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

        {activeTab === "financial" ? (
          <>
            <StatsSection
              stats={activeStats}
              loading={activeLoading}
              className="xl:grid-cols-4"
            />

            <RevenueAnalytics />
          </>
        ) : (
          <>
            <StatsSection
              stats={activeStats}
              loading={activeLoading}
              className="xl:grid-cols-4"
            />

            <OrdersGraph />
          </>
        )}
      </div>

      <RestaurantInvoicesModal
        open={invoicesOpen}
        onOpenChange={setInvoicesOpen}
        restaurantId={restaurantId}
      />
    </Container>
  );
}