import api from "@/lib/axios";

/**
 * ==============================
 * TYPES
 * ==============================
 */

export type BaseReportParams = {
  restaurantId?: string;
  branchId?: string;
};

export type OrdersReportParams = BaseReportParams & {
  fromDate?: string;
  toDate?: string;
  status?: string;
  orderType?: string;
  paymentStatus?: string;
  kind?: string;
};

export type FinancialReportParams = BaseReportParams & {
  fromDate?: string;
  toDate?: string;
};

export type ExportReportParams = BaseReportParams & {
  fromDate?: string;
  toDate?: string;
  status?: string;
  orderType?: string;
  paymentStatus?: string;
  kind?: string;
  search?: string;
};

/**
 * ==============================
 * REPORT SUMMARY APIS
 * ==============================
 */

export const getOrdersReport = async (params?: OrdersReportParams) => {
  const { data } = await api.get("/admin/reports/orders", { params });
  return data;
};

export const getFinancialReport = async (params?: FinancialReportParams) => {
  const { data } = await api.get("/admin/reports/financial", { params });
  return data;
};

/**
 * ==============================
 * EXPORT APIS
 * ==============================
 */

export const exportMenuReport = async (params?: ExportReportParams) => {
  const response = await api.get("/admin/reports/menu/export", {
    params,
    responseType: "blob",
  });
  return response.data;
};

export const exportOrdersReport = async (params?: ExportReportParams) => {
  const response = await api.get("/admin/reports/orders/export", {
    params,
    responseType: "blob",
  });
  return response.data;
};

export const exportCustomersReport = async (params?: ExportReportParams) => {
  const response = await api.get("/admin/reports/customers/export", {
    params,
    responseType: "blob",
  });
  return response.data;
};