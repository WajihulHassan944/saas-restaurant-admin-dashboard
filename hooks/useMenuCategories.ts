import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  bulkCreateMenuCategories,
  createMenuCategory,
  deleteMenuCategory,
  getMenuCategories,
  updateMenuCategory,
} from "@/services/categories";
import type {
  BulkMenuCategoriesValues,
  MenuCategoryValues,
  UpdateMenuCategoryValues,
} from "@/validations/categories";

/**
 * ==============================
 * MENU CATEGORIES HOOKS
 * ==============================
 */

export const useCreateMenuCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: MenuCategoryValues) => createMenuCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-categories"] });
      toast.success("Menu category created successfully!");
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || "Failed to create menu category"
      );
    },
  });
};

export const useGetMenuCategories = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  restaurantId?: string;
  parentCategoryId?: string;
  isActive?: boolean;
}) => {
  return useQuery({
    queryKey: [
      "menu-categories",
      params?.page,
      params?.limit,
      params?.search,
      params?.restaurantId,
      params?.parentCategoryId,
      params?.isActive,
    ],
    queryFn: () => getMenuCategories(params),
  });
};

export const useBulkCreateMenuCategories = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BulkMenuCategoriesValues) =>
      bulkCreateMenuCategories(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-categories"] });
      toast.success("Menu categories created successfully!");
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ||
          "Failed to bulk create menu categories"
      );
    },
  });
};

export const useUpdateMenuCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<UpdateMenuCategoryValues>;
    }) => updateMenuCategory(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["menu-categories"] });
      queryClient.invalidateQueries({
        queryKey: ["menu-category", variables.id],
      });
      toast.success("Menu category updated successfully!");
    },

    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || "Failed to update menu category"
      );
    },
  });
};

export const useDeleteMenuCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMenuCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-categories"] });
      toast.success("Menu category deleted successfully!");
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || "Failed to delete menu category"
      );
    },
  });
};