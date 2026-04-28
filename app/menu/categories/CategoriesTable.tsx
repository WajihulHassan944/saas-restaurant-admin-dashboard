"use client";

import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FaPen, FaTrash } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import {
  useDeleteMenuCategory,
  useGetMenuCategories,
} from "@/hooks/useMenuCategories";
import PaginationSection from "@/components/shared/pagination";
import DeleteDialog from "@/components/dialogs/delete-dialog";
import { Eye, Search } from "lucide-react";
import CreateCategoryModalParent from "@/components/menu/listing/CreateCategoryModalParent";
import VariationModal from "@/components/menu/listing/VariationModal";
import { useRouter } from "next/navigation";

export default function CategoriesTable({ refetchKey }: any) {
  const { user } = useAuth();
  const restaurantId = user?.restaurantId;
const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [selected, setSelected] = useState<any>(null);
  const [open, setOpen] = useState(false);
const [variationOpen, setVariationOpen] = useState(false);
const [selectedCategoryForVariation, setSelectedCategoryForVariation] =
  useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  /* ================= DEBOUNCE ================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  /* ================= FETCH ================= */
  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetMenuCategories({
    page,
    limit,
    search: debouncedSearch,
    ...(restaurantId ? { restaurantId } : {}),
  });

  /* 🔥 proper refetch */
  useEffect(() => {
    if (refetchKey) refetch();
  }, [refetchKey, refetch]);

  const { mutate: deleteMenuCategory, isPending: isDeleting } =
    useDeleteMenuCategory();

  const items = useMemo(() => {
    if (!response) return [];
    return (
      response?.data?.items ||
      response?.data?.categories ||
      response?.data?.data ||
      response?.items ||
      response?.categories ||
      response?.data ||
      []
    );
  }, [response]);

  /* ================= PAGINATION ================= */
  const pagination = useMemo(() => {
    const source =
      response?.data?.pagination ||
      response?.pagination ||
      response?.meta ||
      {};

    const total = Number(source?.total ?? items.length ?? 0);
    const currentPage = Number(source?.page ?? page);
    const pageSize = Number(source?.limit ?? limit);
    const totalPages = Number(
      source?.totalPages ??
        (pageSize > 0 ? Math.ceil(total / pageSize) : 1) ??
        1
    );

    return {
      page: currentPage,
      totalPages: totalPages || 1,
      total,
      limit: pageSize || limit,
      hasNext: source?.hasNext ?? currentPage < (totalPages || 1),
      hasPrevious: source?.hasPrevious ?? currentPage > 1,
    };
  }, [response, items.length, page, limit]);

  /* ================= DELETE ================= */
  const handleDelete = () => {
    if (!deleteId) return;

    deleteMenuCategory(deleteId, {
      onSuccess: () => {
        setDeleteId(null);
        refetch();
      },
    });
  };

  /* ================= SKELETON ================= */
  const SkeletonRow = () => (
    <tr>
      <td colSpan={6} className="py-6">
        <div className="animate-pulse flex gap-3 items-center">
          <div className="h-10 w-10 bg-gray-200 rounded-md" />
          <div className="h-4 w-[120px] bg-gray-200 rounded" />
        </div>
      </td>
    </tr>
  );

  const SkeletonCard = () => (
    <div className="animate-pulse rounded-[18px] bg-white p-4 shadow-sm border">
      <div className="flex gap-4">
        <div className="h-20 w-20 bg-gray-200 rounded-[14px]" />
        <div className="flex-1 space-y-3">
          <div className="h-4 w-[140px] bg-gray-200 rounded" />
          <div className="h-3 w-[100px] bg-gray-200 rounded" />
          <div className="h-3 w-[80px] bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {/* 🔥 PREMIUM SEARCH */}
      <div className="mb-6 flex items-center gap-3">
        <div className="relative w-full max-w-[420px]">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-[44px] w-full rounded-[14px] border border-gray-200 bg-[#FAFAFA] pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <Button
          onClick={() => refetch()}
          className="h-[44px] rounded-[14px] bg-primary px-5 text-white shadow-sm"
        >
          Search
        </Button>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto rounded-[16px] bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="py-3 px-2">Category</th>
            <th className="px-2">Description</th>
<th className="px-2 text-center">Slug</th>
              <th className="px-2 text-center">Status</th>
              <th className="px-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading || isFetching ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-400">
                  No categories found
                </td>
              </tr>
            ) : (
              items.map((item: any) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-2 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.imageUrl || "https://via.placeholder.com/40"}
                        alt={item.name}
                        className="h-10 w-10 rounded-[10px] object-cover border"
                      />
                      <div>
                        <span className="font-medium block">{item.name}</span>
                        {item.description ? (
                          <span className="text-xs text-gray-400 line-clamp-1">
                            {item.description}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </td>

              <td className="px-2 max-w-[220px]">
  {item.description ? (
    <span className="text-sm text-gray-600 truncate block">
      {item.description.length > 40
        ? item.description.slice(0, 40) + "..."
        : item.description}
    </span>
  ) : (
    "-"
  )}
</td>

<td className="px-2 text-center text-gray-500 text-sm">
  {item.slug || "-"}
</td>

                  <td className="px-2 text-center">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        item.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-2 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => {
                          setSelected(item);
                          setOpen(true);
                        }}
                        className="text-gray-500 hover:text-primary"
                      >
                        <FaPen size={14} />
                      </button>
                      <button
  onClick={() => router.push(`/menu/categories/${item.id}`)}
  className="text-gray-500 hover:text-primary"
  title="View Details"
>
  <Eye size={16} />
</button>
<button
  onClick={() => {
    setSelectedCategoryForVariation(item);
    setVariationOpen(true);
  }}
  className="text-gray-500 hover:text-primary text-xs font-medium"
>
  Variation
</button>
                      <button
                        onClick={() => setDeleteId(item.id)}
                        className="text-gray-500 hover:text-red-500"
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

        <div className="mt-4 px-2 pb-2">
          <PaginationSection {...pagination} onPageChange={setPage} />
        </div>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="space-y-4 md:hidden">
        {isLoading || isFetching ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : items.length === 0 ? (
          <div className="py-10 text-center text-gray-400">
            No categories found
          </div>
        ) : (
          items.map((item: any) => (
            <div
              key={item.id}
              className="rounded-[18px] bg-white p-4 shadow-sm border"
            >
              <div className="flex gap-4">
                <img
                  src={item.imageUrl || "https://via.placeholder.com/80"}
                  alt={item.name}
                  className="h-20 w-20 rounded-[14px] object-cover"
                />

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="text-[16px] font-semibold text-gray-900">
                      {item.name}
                    </h3>

                  <p className="text-sm text-gray-500">
  {item.description
    ? item.description.length > 50
      ? item.description.slice(0, 50) + "..."
      : item.description
    : "No description"}
</p>
                  </div>

               <span className="font-semibold text-primary text-sm">
  {item.slug || "-"}
</span>

                  <div className="mt-2 flex justify-between items-center">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        item.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </span>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setSelected(item);
                          setOpen(true);
                        }}
                        className="text-gray-500 hover:text-primary"
                      >
                        <FaPen size={14} />
                      </button>
                      <button
  onClick={() => router.push(`/menu/categories/${item.id}`)}
  className="text-gray-500 hover:text-primary"
  title="View Details"
>
  <Eye size={16} />
</button>
<button
  onClick={() => {
    setSelectedCategoryForVariation(item);
    setVariationOpen(true);
  }}
  className="text-gray-500 hover:text-primary text-xs font-medium"
>
  Variation
</button>
                      <button
                        onClick={() => setDeleteId(item.id)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        <PaginationSection {...pagination} onPageChange={setPage} />
      </div>

      {/* 🔥 EDIT MODAL */}
      <CreateCategoryModalParent
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
          if (!val) setSelected(null);
        }}
        initialData={selected}
        onSuccess={() => refetch()}
      />

      {/* DELETE */}
      <DeleteDialog
        open={!!deleteId}
        onOpenChange={(value) => {
          if (!value) setDeleteId(null);
        }}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
      />


      <VariationModal
  open={variationOpen}
  onOpenChange={(val) => {
    setVariationOpen(val);
    if (!val) setSelectedCategoryForVariation(null);
  }}
  item={selectedCategoryForVariation}
  mode="create"
  onSuccess={() => {
    refetch();
  }}
/>

    </div>
  );
}