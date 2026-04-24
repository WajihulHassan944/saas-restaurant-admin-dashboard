import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  exportCustomersReport,
  exportMenuReport,
  exportOrdersReport,
  FinancialReportParams,
  getFinancialReport,
  getOrdersReport,
  OrdersReportParams,
  ExportReportParams,
} from "@/services/reports";

/**
 * ==============================
 * HELPERS
 * ==============================
 */

const downloadBlobFile = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

/**
 * ==============================
 * REPORT SUMMARY HOOKS
 * ==============================
 */

export const useGetOrdersReport = (params?: OrdersReportParams) => {
  return useQuery({
    queryKey: [
      "reports",
      "orders",
      params?.restaurantId,
      params?.branchId,
      params?.fromDate,
      params?.toDate,
      params?.status,
      params?.orderType,
      params?.paymentStatus,
      params?.kind,
    ],
    queryFn: () => getOrdersReport(params),
  });
};

export const useGetFinancialReport = (params?: FinancialReportParams) => {
  return useQuery({
    queryKey: [
      "reports",
      "financial",
      params?.restaurantId,
      params?.branchId,
      params?.fromDate,
      params?.toDate,
    ],
    queryFn: () => getFinancialReport(params),
  });
};

/**
 * ==============================
 * EXPORT HOOKS
 * ==============================
 */

export const useExportMenuReport = () => {
  return useMutation({
    mutationFn: (params?: ExportReportParams) => exportMenuReport(params),
    onSuccess: (blob) => {
      downloadBlobFile(blob, "menu-report.csv");
      toast.success("Menu report exported successfully");
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || "Failed to export menu report"
      );
    },
  });
};

export const useExportOrdersReport = () => {
  return useMutation({
    mutationFn: (params?: ExportReportParams) => exportOrdersReport(params),
    onSuccess: (blob) => {
      downloadBlobFile(blob, "orders-report.csv");
      toast.success("Orders report exported successfully");
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || "Failed to export orders report"
      );
    },
  });
};

export const useExportCustomersReport = () => {
  return useMutation({
    mutationFn: (params?: ExportReportParams) => exportCustomersReport(params),
    onSuccess: (blob) => {
      downloadBlobFile(blob, "customers-report.csv");
      toast.success("Customers report exported successfully");
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || "Failed to export customers report"
      );
    },
  });
};