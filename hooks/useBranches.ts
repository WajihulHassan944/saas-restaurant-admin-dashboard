import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createBranch,
  getBranches,
  getBranch,
  updateBranch,
  deleteBranch,
  createBranchesBulk,
  getOpeningHours,
  updateOpeningHours,
  suspendBranch,
  activateBranch,
  updateBranchImages,
  forceDeleteBranch,
} from "@/services/branches";
import { useRouter } from "next/navigation";

/**
 * ==============================
 * BRANCH HOOKS
 * ==============================
 */

/**
 * Create Branch
 */
export const useCreateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBranch,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      toast.success("Branch created successfully!");
    },

    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to create branch");
    },
  });
};

/**
 * Get Branches List
 */
export const useGetBranches = (params?: {
  search?: string;
  sortOrder?: "ASC" | "DESC";
  withDeleted?: boolean;
  includeInactive?: boolean;
  restaurantId?: string;
  lat?: string;
  lng?: string;
}) => {
  return useQuery({
    queryKey: [
      "branches",
      params?.search,
      params?.sortOrder,
      params?.withDeleted,
      params?.includeInactive,
      params?.restaurantId,
      params?.lat,
      params?.lng,
    ],
    queryFn: () => getBranches(params),
  });
};

/**
 * Get Single Branch
 */
export const useGetBranch = (id: string) => {
  return useQuery({
    queryKey: ["branches", id],
    queryFn: () => getBranch(id),
    enabled: !!id,
  });
};

/**
 * Update Branch
 */
export const useUpdateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateBranch(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      queryClient.invalidateQueries({
        queryKey: ["branches", variables.id],
      });
      toast.success("Branch updated successfully!");
    },

    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update branch");
    },
  });
};

/**
 * Delete Branch (Soft)
 */
export const useDeleteBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBranch,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      toast.success("Branch deleted successfully!");
    },

    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete branch");
    },
  });
};

/**
 * Force Delete Branch
 */
export const useForceDeleteBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: forceDeleteBranch,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      toast.success("Branch permanently deleted!");
    },

    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || "Failed to force delete branch"
      );
    },
  });
};

/**
 * Bulk Create Branches
 */
export const useCreateBranchesBulk = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBranchesBulk,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      toast.success("Branches created successfully!");
    },

    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || "Failed to create branches"
      );
    },
  });
};

/**
 * ==============================
 * OPENING HOURS
 * ==============================
 */

export const useGetOpeningHours = (branchId: string) => {
  return useQuery({
    queryKey: ["branch-opening-hours", branchId],
    queryFn: () => getOpeningHours(branchId),
    enabled: !!branchId,
  });
};

export const useUpdateOpeningHours = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      branchId,
      data,
    }: {
      branchId: string;
      data: any;
    }) => updateOpeningHours(branchId, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["branch-opening-hours", variables.branchId],
      });
      toast.success("Opening hours updated successfully!");
    },

    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ||
          "Failed to update opening hours"
      );
    },
  });
};

/**
 * ==============================
 * STATUS MANAGEMENT
 * ==============================
 */

export const useSuspendBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: suspendBranch,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      toast.success("Branch suspended successfully!");
    },

    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || "Failed to suspend branch"
      );
    },
  });
};

export const useActivateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activateBranch,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      toast.success("Branch activated successfully!");
    },

    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || "Failed to activate branch"
      );
    },
  });
};

/**
 * ==============================
 * IMAGES
 * ==============================
 */

export const useUpdateBranchImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: FormData;
    }) => updateBranchImages(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      toast.success("Branch images updated!");
    },

    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || "Failed to update images"
      );
    },
  });
};