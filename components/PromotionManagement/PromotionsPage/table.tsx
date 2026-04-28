"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import SortableHeader from "@/components/shared/sortable-head";
import EmptyState from "@/components/shared/EmptyState";
import PromotionCreateLink from "../PromotionOverview/PromotionCreateLink";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import PaginationSection from "@/components/shared/pagination";
import { toast } from "sonner";
import { useDeleteAdminPromotionCampaign } from "@/hooks/usePromotions";
import { useAuth } from "@/hooks/useAuth";

type Promotion = {
  id: string;
  code?: string;
  title?: string;
  description?: string;
  kind?: string;
  status?: string;
  discountType?: string;
  discountValue?: number;
  maxDiscountAmount?: number;
  minOrderAmount?: number;
  maxUses?: number;
  maxUsesPerCustomer?: number;
  usedCount?: number;
  startsAt?: string;
  expiresAt?: string;
  isActive?: boolean;
  branch?: {
    id?: string;
    name?: string;
  } | null;
  restaurant?: {
    id?: string;
    name?: string;
  };
  scopeMenuItem?: {
    id?: string;
    name?: string;
  } | null;
  scopeCategory?: {
    id?: string;
    name?: string;
  } | null;
};

type Props = {
  promotions: Promotion[];
  loading?: boolean;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  onPageChange: (page: number) => void;
};

const formatDiscount = (promo: Promotion) => {
  const value = Number(promo.discountValue ?? 0);

  if (promo.discountType === "PERCENTAGE") return `${value}%`;
  if (promo.discountType === "FLAT") return `${value}`;

  return value;
};

const formatDate = (value?: string) => {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const getScopeText = (promo: Promotion) => {
  if (promo.scopeMenuItem?.name) return `Item: ${promo.scopeMenuItem.name}`;
  if (promo.scopeCategory?.name) return `Category: ${promo.scopeCategory.name}`;

  return "All Items";
};

const getStatusClass = (status?: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-50 text-green-700";
    case "SCHEDULED":
      return "bg-yellow-50 text-yellow-700";
    case "EXPIRED":
      return "bg-red-50 text-red-700";
    default:
      return "bg-gray-50 text-gray-600";
  }
};

const TableSkeleton = () => {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <TableRow key={index} className="border-none h-[72px]">
          {Array.from({ length: 8 }).map((__, cellIndex) => (
            <TableCell key={cellIndex} className="px-4">
              <div className="h-4 w-full max-w-[120px] rounded bg-gray-200 animate-pulse" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

const PromotionsTable = ({
  promotions,
  loading = false,
  meta,
  onPageChange,
}: Props) => {
  const router = useRouter();
  const { user, restaurantId } = useAuth();

  const branchId = user?.branchId ?? null;

  const deleteMutation = useDeleteAdminPromotionCampaign();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const hasData = promotions && promotions.length > 0;

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync({
        id,
        restaurantId,
        branchId,
      });

      toast.success("Promotion deleted successfully.");
      setOpenMenuId(null);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete promotion."
      );
    }
  };

  if (!loading && !hasData) {
    return (
      <>
        <EmptyState
          title="Looks like there are no Promotions yet!"
          description="You haven’t added any Promotions yet. Start by creating a new"
        />
        <PromotionCreateLink
          label="Create New Promotion"
          href="/promotion-management/promotions/add"
        />
      </>
    );
  }

  return (
    <>
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="border-none">
              <SortableHeader label="SL" />
              <SortableHeader label="Name & Code" />
              <SortableHeader label="Discount" />
              <SortableHeader label="Scope" />
              <SortableHeader label="Branch" />
              <SortableHeader label="Usage" />
              <SortableHeader label="Status" />
              <TableHead className="text-center font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableSkeleton />
            ) : (
              promotions.map((promo, index) => (
                <TableRow key={promo.id} className="border-none h-[72px]">
                  <TableCell className="px-4">
                    {(meta.page - 1) * meta.limit + index + 1}
                  </TableCell>

                  <TableCell className="px-4">
                    <p className="font-medium text-sm">{promo.title}</p>
                    <p className="text-gray-500 text-sm">Code: {promo.code}</p>
                    <p className="text-gray-400 text-xs">
                      {formatDate(promo.startsAt)} -{" "}
                      {formatDate(promo.expiresAt)}
                    </p>
                  </TableCell>

                  <TableCell className="px-4">
                    <p className="text-sm font-medium">
                      {formatDiscount(promo)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Type: {promo.discountType ?? "N/A"}
                    </p>
                  </TableCell>

                  <TableCell className="px-4 text-sm text-gray-500">
                    {getScopeText(promo)}
                  </TableCell>

                  <TableCell className="px-4 text-sm text-gray-500">
                    {promo.branch?.name ?? "All Branches"}
                  </TableCell>

                  <TableCell className="px-4 text-sm text-gray-500">
                    {promo.usedCount ?? 0} / {promo.maxUses ?? "Unlimited"}
                  </TableCell>

                  <TableCell className="px-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                        promo.status
                      )}`}
                    >
                      {promo.status ?? "N/A"}
                    </span>
                  </TableCell>

                  <TableCell className="relative">
                    <div className="flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenuId((prev) =>
                            prev === promo.id ? null : promo.id
                          )
                        }
                        className="p-2 text-gray-400 hover:text-black"
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {openMenuId === promo.id && (
                        <div className="absolute right-4 top-12 z-30 w-[150px] rounded-xl border bg-white p-2 shadow-lg">
                          <button
                            type="button"
                            onClick={() =>
                              router.push(
                                `/promotion-management/promotions/add?id=${promo.id}`
                              )
                            }
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
                          >
                            <Edit size={15} />
                            Edit
                          </button>

                          <button
                            type="button"
                            disabled={deleteMutation.isPending}
                            onClick={() => handleDelete(promo.id)}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
                          >
                            <Trash2 size={15} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden flex flex-col gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-[14px] p-4 border border-[#EDEFF2] space-y-3"
              >
                <div className="h-5 w-40 rounded bg-gray-200 animate-pulse" />
                <div className="h-4 w-28 rounded bg-gray-200 animate-pulse" />
                <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
              </div>
            ))
          : promotions.map((promo) => (
              <div
                key={promo.id}
                className="bg-white rounded-[14px] shadow-sm p-4 border border-[#EDEFF2] flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-900">{promo.title}</p>
                  <Checkbox />
                </div>

                <p className="text-gray-500 text-sm">Code: {promo.code}</p>

                <div className="text-gray-600 text-sm space-y-1">
                  <p>Discount: {formatDiscount(promo)}</p>
                  <p>Scope: {getScopeText(promo)}</p>
                  <p>Branch: {promo.branch?.name ?? "All Branches"}</p>
                  <p>
                    Usage: {promo.usedCount ?? 0} /{" "}
                    {promo.maxUses ?? "Unlimited"}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                      promo.status
                    )}`}
                  >
                    {promo.status ?? "N/A"}
                  </span>

                  <div className="flex items-center gap-2">
                    <Switch checked={Boolean(promo.isActive)} disabled />

                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `/promotion-management/promotions/add?id=${promo.id}`
                        )
                      }
                      className="p-2 hover:text-black"
                    >
                      <Edit size={17} />
                    </button>

                    <button
                      type="button"
                      disabled={deleteMutation.isPending}
                      onClick={() => handleDelete(promo.id)}
                      className="p-2 text-red-500 hover:text-red-700 disabled:opacity-60"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
      </div>

      <div className="mt-6">
        <PaginationSection
          page={meta.page}
          totalPages={meta.totalPages}
          total={meta.total}
          limit={meta.limit}
          hasNext={meta.hasNext}
          hasPrevious={meta.hasPrevious}
          onPageChange={onPageChange}
        />
      </div>
    </>
  );
};

export default PromotionsTable;