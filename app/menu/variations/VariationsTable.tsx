"use client";

import { useEffect, useMemo, useState } from "react";
import { FaPen, FaTrash } from "react-icons/fa";
import { PlusCircle, RefreshCcw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import PaginationSection from "@/components/shared/pagination";
import DeleteDialog from "@/components/dialogs/delete-dialog";

import {
  useDeleteMenuVariation,
  useGetMenuVariations,
} from "@/hooks/useMenus";

import VariationModal from "@/components/menu/listing/VariationModal";
import { useAuth } from "@/hooks/useAuth";

type SortOrder = "ASC" | "DESC";
type SortBy = "createdAt" | "name" | "price" | "sortOrder";

export default function VariationsTable() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { restaurantId } = useAuth();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [sortBy, setSortBy] = useState<SortBy>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("DESC");

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 450);

    return () => clearTimeout(timer);
  }, [search]);

  const queryParams = useMemo(
    () => ({
      page,
      limit,
      restaurantId: restaurantId || undefined,
      search: debouncedSearch || undefined,
      sortBy,
      sortOrder,
    }),
    [page, limit, restaurantId, debouncedSearch, sortBy, sortOrder]
  );

  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetMenuVariations(queryParams);

  const { mutate: deleteVariation, isPending: isDeleting } =
    useDeleteMenuVariation();

  const items = useMemo(() => {
    if (!response) return [];

    const raw =
      response?.data?.items ||
      response?.data?.variations ||
      response?.data?.data ||
      response?.items ||
      response?.variations ||
      response?.data ||
      [];

    return Array.isArray(raw) ? raw : [];
  }, [response]);

  const pagination = useMemo(() => {
    const source =
      response?.data?.pagination ||
      response?.data?.meta ||
      response?.pagination ||
      response?.meta ||
      {};

    const total = Number(source?.total ?? items.length ?? 0);
    const currentPage = Number(source?.page ?? page);
    const pageSize = Number(source?.limit ?? limit);

    const totalPages = Number(
      source?.totalPages ??
        source?.pages ??
        (pageSize > 0 ? Math.ceil(total / pageSize) : 1)
    );

    return {
      page: currentPage,
      totalPages: totalPages || 1,
      total,
      limit: pageSize || limit,
      hasNext: source?.hasNext ?? currentPage < (totalPages || 1),
      hasPrevious:
        source?.hasPrevious ?? source?.hasPrev ?? currentPage > 1,
    };
  }, [response, items.length, page, limit]);

  const isTableLoading = isLoading || isFetching;

  const handleDelete = () => {
    if (!deleteId) return;

    deleteVariation(deleteId, {
      onSuccess: () => {
        setDeleteId(null);
        refetch();
      },
    });
  };

  const openCreateModal = () => {
    setSelected(null);
    setOpen(true);
  };

  const openEditModal = (variation: any) => {
    setSelected(variation);
    setOpen(true);
  };

  const formatPrice = (value: any) => {
    const numeric = Number(value ?? 0);

    if (Number.isNaN(numeric)) return "0.00";

    return numeric.toFixed(2);
  };

  const getPriorityLabel = (value: any) => {
    const sortOrderValue = Number(value ?? 0);

    if (sortOrderValue === 0) return "Top";
    if (sortOrderValue === 10) return "High";
    if (sortOrderValue === 50) return "Medium";
    if (sortOrderValue === 100) return "Low";

    return String(sortOrderValue);
  };

  const SkeletonRow = () => (
    <tr>
      <td colSpan={7} className="px-4 py-5">
        <div className="flex animate-pulse items-center gap-4">
          <div className="h-4 w-[160px] rounded bg-gray-200" />
          <div className="h-4 w-[220px] rounded bg-gray-200" />
          <div className="h-4 w-[80px] rounded bg-gray-200" />
          <div className="h-4 w-[70px] rounded bg-gray-200" />
          <div className="h-4 w-[70px] rounded bg-gray-200" />
        </div>
      </td>
    </tr>
  );

  const SkeletonCard = () => (
    <div className="animate-pulse rounded-[18px] border border-gray-100 bg-white p-4 shadow-sm">
      <div className="space-y-3">
        <div className="h-4 w-[160px] rounded bg-gray-200" />
        <div className="h-3 w-full rounded bg-gray-200" />
        <div className="h-3 w-[120px] rounded bg-gray-200" />
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-[20px] font-semibold text-gray-900">
            Menu Variations
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Create and manage variations that can be reused across menu setup.
          </p>
        </div>

        <Button
          type="button"
          onClick={openCreateModal}
          className="h-[42px] rounded-[12px] bg-primary px-4 text-white hover:bg-primary/90"
        >
          <PlusCircle size={18} />
          Add Variation
        </Button>
      </div>

      <div className="mb-6 rounded-[18px] border border-gray-100 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_180px_150px_auto] md:items-center">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search variations by name..."
              className="h-[44px] w-full rounded-[14px] border border-gray-200 bg-[#FAFAFA] pl-11 pr-4 text-sm text-gray-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as SortBy);
              setPage(1);
            }}
            className="h-[44px] rounded-[14px] border border-gray-200 bg-[#FAFAFA] px-4 text-sm text-gray-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
          >
            <option value="createdAt">Sort: Latest</option>
            <option value="name">Sort: Name</option>
            <option value="price">Sort: Price</option>
            <option value="sortOrder">Sort: Priority</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value as SortOrder);
              setPage(1);
            }}
            className="h-[44px] rounded-[14px] border border-gray-200 bg-[#FAFAFA] px-4 text-sm text-gray-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
          >
            <option value="DESC">DESC</option>
            <option value="ASC">ASC</option>
          </select>

          <Button
            type="button"
            variant="outline"
            onClick={() => refetch()}
            className="h-[44px] rounded-[14px] border-gray-200 px-4"
          >
            <RefreshCcw
              size={16}
              className={isFetching ? "animate-spin" : ""}
            />
            Refresh
          </Button>
        </div>
      </div>

      <div className="hidden overflow-hidden rounded-[18px] border border-gray-100 bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-[#FAFAFA] text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-4 py-4">Name</th>
                <th className="px-4 py-4">Description</th>
                <th className="px-4 py-4 text-center">Price</th>
                <th className="px-4 py-4 text-center">Priority</th>
                <th className="px-4 py-4 text-center">Default</th>
                <th className="px-4 py-4 text-center">Status</th>
                <th className="px-4 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {isTableLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonRow key={index} />
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <div className="mx-auto max-w-[320px]">
                      <p className="text-base font-semibold text-gray-900">
                        No variations found
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Add your first variation like Small, Medium, Large,
                        Regular, or Family.
                      </p>

                      <Button
                        type="button"
                        onClick={openCreateModal}
                        className="mt-4 rounded-[12px] bg-primary text-white hover:bg-primary/90"
                      >
                        <PlusCircle size={18} />
                        Add Variation
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((item: any) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 transition hover:bg-[#FAFAFA]"
                  >
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">
                          {item?.name || "-"}
                        </span>

                        <span className="mt-0.5 text-xs text-gray-400">
                          ID: {item?.id || "-"}
                        </span>
                      </div>
                    </td>

                    <td className="max-w-[320px] px-4 py-4">
                      <p className="line-clamp-2 text-gray-600">
                        {item?.description || "No description"}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-center font-semibold text-gray-900">
                      ${formatPrice(item?.price)}
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                        {getPriorityLabel(item?.sortOrder)}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          item?.isDefault
                            ? "bg-primary/10 text-primary"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {item?.isDefault ? "Default" : "No"}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          item?.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item?.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="text-gray-500 transition hover:text-primary"
                          aria-label="Edit variation"
                        >
                          <FaPen size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteId(item.id)}
                          className="text-gray-500 transition hover:text-red-500"
                          aria-label="Delete variation"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-100 px-4 py-4">
          <PaginationSection {...pagination} onPageChange={setPage} />
        </div>
      </div>

      <div className="space-y-4 md:hidden">
        {isTableLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        ) : items.length === 0 ? (
          <div className="rounded-[18px] border border-dashed border-gray-200 bg-white p-6 text-center">
            <p className="text-base font-semibold text-gray-900">
              No variations found
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Add variations to reuse them during menu setup.
            </p>

            <Button
              type="button"
              onClick={openCreateModal}
              className="mt-4 rounded-[12px] bg-primary text-white hover:bg-primary/90"
            >
              <PlusCircle size={18} />
              Add Variation
            </Button>
          </div>
        ) : (
          items.map((item: any) => (
            <div
              key={item.id}
              className="rounded-[18px] border border-gray-100 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-[16px] font-semibold text-gray-900">
                    {item?.name || "-"}
                  </h3>

                  <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                    {item?.description || "No description"}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${
                    item?.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {item?.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-[12px] bg-[#FAFAFA] p-3">
                  <p className="text-xs text-gray-400">Price</p>
                  <p className="text-sm font-semibold text-gray-900">
                    ${formatPrice(item?.price)}
                  </p>
                </div>

                <div className="rounded-[12px] bg-[#FAFAFA] p-3">
                  <p className="text-xs text-gray-400">Priority</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {getPriorityLabel(item?.sortOrder)}
                  </p>
                </div>

                <div className="rounded-[12px] bg-[#FAFAFA] p-3">
                  <p className="text-xs text-gray-400">Default</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {item?.isDefault ? "Yes" : "No"}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => openEditModal(item)}
                  className="inline-flex items-center gap-2 rounded-[10px] border border-gray-200 px-3 py-2 text-sm text-gray-700 transition hover:border-primary hover:text-primary"
                >
                  <FaPen size={13} />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteId(item.id)}
                  className="inline-flex items-center gap-2 rounded-[10px] border border-gray-200 px-3 py-2 text-sm text-gray-700 transition hover:border-red-300 hover:text-red-500"
                >
                  <FaTrash size={13} />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}

        <PaginationSection {...pagination} onPageChange={setPage} />
      </div>

      <VariationModal
        open={open}
        onOpenChange={(value) => {
          setOpen(value);

          if (!value) {
            setSelected(null);
          }
        }}
        initialData={selected}
        onSuccess={() => refetch()}
      />

      <DeleteDialog
        open={!!deleteId}
        onOpenChange={(value) => {
          if (!value) {
            setDeleteId(null);
          }
        }}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Variation"
        description="Are you sure you want to delete this variation? This action cannot be undone."
      />
    </div>
  );
}