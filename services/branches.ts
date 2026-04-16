import api from "@/lib/axios";
import {
  BranchValues,
  BulkBranchValues,
  OpeningHoursValues,
} from "@/validations/branches";

/**
 * ==============================
 * BRANCH APIS
 * ==============================
 */

export const createBranch = async (payload: BranchValues) => {
  const { data } = await api.post("/branches", payload);
  return data;
};

export const getBranches = async (params?: {
  search?: string;
  sortOrder?: "ASC" | "DESC";
  withDeleted?: boolean;
  includeInactive?: boolean;
  restaurantId?: string;
  lat?: string;
  lng?: string;
}) => {
  const { data } = await api.get("/branches", { params });
  return data;
};

export const getBranch = async (id: string) => {
  const { data } = await api.get(`/branches/${id}`);
  return data.data;
};

export const updateBranch = async (
  id: string,
  payload: Partial<BranchValues>
) => {
  const { data } = await api.patch(`/branches/${id}`, payload);
  return data;
};

export const deleteBranch = async (id: string) => {
  const { data } = await api.delete(`/branches/${id}`);
  return data;
};

/**
 * ==============================
 * BULK CREATE
 * ==============================
 */

export const createBranchesBulk = async (payload: BulkBranchValues) => {
  const { data } = await api.post("/branches/bulk", payload);
  return data;
};

/**
 * ==============================
 * OPENING HOURS
 * ==============================
 */

export const getOpeningHours = async (branchId: string) => {
  const { data } = await api.get(`/branches/${branchId}/opening-hours`);
  return data;
};

export const updateOpeningHours = async (
  branchId: string,
  payload: OpeningHoursValues
) => {
  const { data } = await api.put(
    `/branches/${branchId}/opening-hours`,
    payload
  );
  return data;
};

/**
 * ==============================
 * STATUS CONTROL
 * ==============================
 */

export const suspendBranch = async (id: string) => {
  const { data } = await api.patch(`/branches/${id}/suspend`);
  return data;
};

export const activateBranch = async (id: string) => {
  const { data } = await api.patch(`/branches/${id}/activate`);
  return data;
};

/**
 * ==============================
 * IMAGES
 * ==============================
 */
export const updateBranchImages = async (
  id: string,
  payload: {
    logoUrl?: string;
    coverImage?: string;
  } | FormData
) => {
  const isFormData = payload instanceof FormData;

  const { data } = await api.patch(
    `/branches/${id}/images`,
    payload,
    {
      headers: isFormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" },
    }
  );

  return data;
};
/**
 * ==============================
 * FORCE DELETE
 * ==============================
 */

export const forceDeleteBranch = async (id: string) => {
  const { data } = await api.delete(`/branches/${id}/force`);
  return data;
};