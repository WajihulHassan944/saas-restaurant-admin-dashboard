import api from "@/lib/axios";
import {
  BulkMenuCategoriesValues,
  MenuCategoryValues,
  UpdateMenuCategoryValues,
} from "@/validations/categories";

/**
 * ==============================
 * MENU CATEGORIES APIS
 * ==============================
 */

export const createMenuCategory = async (payload: MenuCategoryValues) => {
  const { data } = await api.post("/menu/categories", payload);
  return data;
};

export const getMenuCategories = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  restaurantId?: string;
  parentCategoryId?: string;
  isActive?: boolean;
}) => {
  const { data } = await api.get("/menu/categories", { params });
  return data;
};

export const bulkCreateMenuCategories = async (
  payload: BulkMenuCategoriesValues
) => {
  const { data } = await api.post("/menu/categories/bulk", payload);
  return data;
};

export const updateMenuCategory = async (
  id: string,
  payload: Partial<UpdateMenuCategoryValues>
) => {
  const { data } = await api.patch(`/menu/categories/${id}`, payload);
  return data;
};

export const deleteMenuCategory = async (id: string) => {
  const { data } = await api.delete(`/menu/categories/${id}`);
  return data;
};