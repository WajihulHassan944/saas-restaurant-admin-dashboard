"use client";

import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaPen, FaTrash } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import {
  useDeleteMenuItem,
  useGetMenuItems,
} from "@/hooks/useMenus";
import PaginationSection from "@/components/shared/pagination";
import DeleteDialog from "@/components/dialogs/delete-dialog";
import {
  Search,
  MoreHorizontal,
  PlusCircle,
  Eye,
} from "lucide-react";
import CreateMenuItemModal from "@/components/menu/CreateMenuItemModal/CreateMenuItemModal";
import VariationModal from "@/components/menu/listing/VariationModal";
import AddModifierToItem from "@/components/forms/AddModifierToItem";

export default function MenuItemsTable({ refetchKey }: any) {
  const { user } = useAuth();
  const restaurantId = user?.restaurantId;

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [selected, setSelected] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [actionItem, setActionItem] = useState<any>(null);
  const [openVariation, setOpenVariation] = useState(false);
  const [openModifier, setOpenModifier] = useState(false);
  const [openViewVariations, setOpenViewVariations] = useState(false);
  const [openViewModifiers, setOpenViewModifiers] = useState(false);

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
  } = useGetMenuItems(
    {
      page,
      limit,
      search: debouncedSearch,
      ...(restaurantId ? { restaurantId } : {}),
    } as any
  );

  /* 🔥 proper refetch */
  useEffect(() => {
    if (refetchKey) refetch();
  }, [refetchKey, refetch]);

  const { mutate: deleteMenuItem, isPending: isDeleting } =
    useDeleteMenuItem();

  const items = useMemo(() => {
    if (!response) return [];
    return (
      response?.data?.items ||
      response?.data?.data ||
      response?.items ||
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
      hasNext:
        source?.hasNext ?? currentPage < (totalPages || 1),
      hasPrevious:
        source?.hasPrevious ?? currentPage > 1,
    };
  }, [response, items.length, page, limit]);

  /* ================= DELETE ================= */
  const handleDelete = () => {
    if (!deleteId) return;

    deleteMenuItem(deleteId, {
      onSuccess: () => {
        setDeleteId(null);
        refetch();
      },
    });
  };

  /* ================= ACTION HELPERS ================= */
  const handleAction = (
    type:
      | "add-variation"
      | "view-variations"
      | "add-modifier"
      | "view-modifiers",
    item: any
  ) => {
    setActionItem(item);

    if (type === "add-variation") {
      setOpenVariation(true);
      return;
    }

    if (type === "view-variations") {
      setOpenViewVariations(true);
      return;
    }

    if (type === "add-modifier") {
      setOpenModifier(true);
      return;
    }

    if (type === "view-modifiers") {
      setOpenViewModifiers(true);
    }
  };

  const handleVariationModalChange = (value: boolean) => {
    setOpenVariation(value);

    if (!value) {
      setActionItem(null);
      refetch();
    }
  };

  const handleModifierModalChange = (value: boolean) => {
    setOpenModifier(value);

    if (!value) {
      setActionItem(null);
      refetch();
    }
  };

  const handleViewVariationsChange = (value: boolean) => {
    setOpenViewVariations(value);
    if (!value) setActionItem(null);
  };

  const handleViewModifiersChange = (value: boolean) => {
    setOpenViewModifiers(value);
    if (!value) setActionItem(null);
  };

  const renderActionMenu = (item: any) => {
    const variationCount = getVariationCount(item);
    const modifierCount = getModifierGroupCount(item);

    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            title="More actions"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-all duration-200 hover:-translate-y-[1px] hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
          >
            <MoreHorizontal size={16} />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-[250px] rounded-2xl border border-gray-200 bg-white p-2 shadow-2xl"
        >
          <DropdownMenuLabel className="px-2 pb-2 pt-1">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                Quick actions
              </p>
              <p className="truncate text-sm font-semibold text-gray-900">
                {item?.name}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => handleAction("add-modifier", item)}
            className="cursor-pointer rounded-xl px-3 py-3 focus:bg-gray-50"
          >
            <div className="flex w-full items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <PlusCircle size={16} className="text-primary" />
                <span className="font-medium text-gray-800">
                  Add Modifiers
                </span>
              </div>

              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                Attach
              </span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleAction("view-modifiers", item)}
            className="cursor-pointer rounded-xl px-3 py-3 focus:bg-gray-50"
          >
            <div className="flex w-full items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Eye size={16} className="text-gray-500" />
                <span className="font-medium text-gray-800">
                  View Modifiers
                </span>
              </div>

              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                {modifierCount}
              </span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => handleAction("add-variation", item)}
            className="cursor-pointer rounded-xl px-3 py-3 focus:bg-gray-50"
          >
            <div className="flex w-full items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <PlusCircle size={16} className="text-primary" />
                <span className="font-medium text-gray-800">
                  Add Variations
                </span>
              </div>

              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                Create
              </span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleAction("view-variations", item)}
            className="cursor-pointer rounded-xl px-3 py-3 focus:bg-gray-50"
          >
            <div className="flex w-full items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Eye size={16} className="text-gray-500" />
                <span className="font-medium text-gray-800">
                  View Variations
                </span>
              </div>

              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                {variationCount}
              </span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  /* ================= SKELETON ================= */
  const SkeletonRow = () => (
    <tr>
      <td colSpan={6} className="py-6">
        <div className="flex animate-pulse items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-gray-200" />
          <div className="h-4 w-[120px] rounded bg-gray-200" />
        </div>
      </td>
    </tr>
  );

  const SkeletonCard = () => (
    <div className="animate-pulse rounded-[18px] border bg-white p-4 shadow-sm">
      <div className="flex gap-4">
        <div className="h-20 w-20 rounded-[14px] bg-gray-200" />
        <div className="flex-1 space-y-3">
          <div className="h-4 w-[140px] rounded bg-gray-200" />
          <div className="h-3 w-[100px] rounded bg-gray-200" />
          <div className="h-3 w-[80px] rounded bg-gray-200" />
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
            placeholder="Search menu items..."
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
      <div className="hidden overflow-x-auto rounded-[16px] bg-white md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="py-3 px-2">Item</th>
              <th className="px-2">Category</th>
              <th className="px-2 text-center">Price</th>
              <th className="px-2 text-center">Prep</th>
              <th className="px-2 text-center">Status</th>
              <th className="px-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading || isFetching ? (
              Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-400">
                  No menu items found
                </td>
              </tr>
            ) : (
              items.map((item: any) => {
                const variationCount = getVariationCount(item);
                const modifierCount = getModifierGroupCount(item);

                return (
                  <tr
                    key={item.id}
                    className="border-b transition-colors hover:bg-gray-50"
                  >
                    <td className="px-2 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrl || "https://via.placeholder.com/40"}
                          alt={item.name}
                          className="h-10 w-10 rounded-[10px] border object-cover"
                          loading="lazy"
                        />

                        <div className="min-w-0">
                          <p className="truncate font-medium text-gray-900">
                            {item.name}
                          </p>

                          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-gray-400">
                            <span>{variationCount} variations</span>
                            <span>•</span>
                            <span>{modifierCount} modifiers</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-2">
                      {item.category?.name || item.categoryName || "-"}
                    </td>

                    <td className="px-2 text-center font-medium">
                      {formatCurrency(item.price ?? item.basePrice ?? 0)}
                    </td>

                    <td className="px-2 text-center">
                      {item.prepTimeMinutes ?? "-"} min
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
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          title="Edit"
                          onClick={() => {
                            setSelected(item);
                            setOpen(true);
                          }}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-all duration-200 hover:-translate-y-[1px] hover:border-primary/20 hover:text-primary"
                        >
                          <FaPen size={13} />
                        </button>

                        <button
                          type="button"
                          title="Delete"
                          onClick={() => setDeleteId(item.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-all duration-200 hover:-translate-y-[1px] hover:border-red-200 hover:text-red-500"
                        >
                          <FaTrash size={13} />
                        </button>

                        {renderActionMenu(item)}
                      </div>
                    </td>
                  </tr>
                );
              })
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
          Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))
        ) : items.length === 0 ? (
          <div className="py-10 text-center text-gray-400">
            No menu items found
          </div>
        ) : (
          items.map((item: any) => {
            const variationCount = getVariationCount(item);
            const modifierCount = getModifierGroupCount(item);

            return (
              <div
                key={item.id}
                className="rounded-[18px] border bg-white p-4 shadow-sm"
              >
                <div className="flex gap-4">
                  <img
                    src={item.imageUrl || "https://via.placeholder.com/80"}
                    alt={item.name}
                    className="h-20 w-20 rounded-[14px] object-cover"
                    loading="lazy"
                  />

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="text-[16px] font-semibold text-gray-900">
                        {item.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {item.category?.name || item.categoryName || "-"}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-gray-400">
                        <span>{variationCount} variations</span>
                        <span>•</span>
                        <span>{modifierCount} modifiers</span>
                      </div>
                    </div>

                    <div className="mt-2 flex justify-between">
                      <span className="font-semibold text-primary">
                        {formatCurrency(item.price ?? item.basePrice ?? 0)}
                      </span>

                      <span className="text-xs text-gray-400">
                        {item.prepTimeMinutes ?? "-"} min
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          item.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          title="Edit"
                          onClick={() => {
                            setSelected(item);
                            setOpen(true);
                          }}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-all duration-200 hover:border-primary/20 hover:text-primary"
                        >
                          <FaPen size={13} />
                        </button>

                        <button
                          type="button"
                          title="Delete"
                          onClick={() => setDeleteId(item.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-all duration-200 hover:border-red-200 hover:text-red-500"
                        >
                          <FaTrash size={13} />
                        </button>

                        {renderActionMenu(item)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        <PaginationSection {...pagination} onPageChange={setPage} />
      </div>

      {/* 🔥 EDIT MODAL */}
      <CreateMenuItemModal
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
          if (!val) setSelected(null);
        }}
        initialData={selected}
        onSuccess={() => refetch()}
      />

      {/* REUSE EXISTING CREATE POPUPS */}
      <VariationModal
        open={openVariation}
        onOpenChange={handleVariationModalChange}
        item={actionItem}
      />

      <AddModifierToItem
        open={openModifier}
        onOpenChange={handleModifierModalChange}
        item={actionItem}
      />

      {/* VIEW DIALOGS */}
      <ViewVariationsDialog
        open={openViewVariations}
        onOpenChange={handleViewVariationsChange}
        item={actionItem}
      />

      <ViewModifiersDialog
        open={openViewModifiers}
        onOpenChange={handleViewModifiersChange}
        item={actionItem}
      />

      {/* DELETE */}
      <DeleteDialog
        open={!!deleteId}
        onOpenChange={(value) => {
          if (!value) setDeleteId(null);
        }}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Menu Item"
        description="Are you sure you want to delete this menu item? This action cannot be undone."
      />
    </div>
  );
}

/* ================= HELPERS ================= */

function normalizeVariations(item: any) {
  const source =
    item?.variations ||
    item?.menuVariations ||
    item?.sizes ||
    [];

  return Array.isArray(source) ? source : [];
}

function normalizeModifierGroups(item: any) {
  if (Array.isArray(item?.modifierLinks)) {
    return item.modifierLinks
      .map((link: any) => {
        const group = link?.modifierGroup;
        if (!group) return null;

        return {
          ...group,
          linkId: link?.id,
          modifierGroupId: link?.modifierGroupId || group?.id,
          attachSortOrder: link?.sortOrder ?? 0,
          modifiers: Array.isArray(group?.modifiers)
            ? group.modifiers
            : [],
        };
      })
      .filter(Boolean);
  }

  const source =
    item?.modifierGroups ||
    item?.attachedModifierGroups ||
    item?.modifier_groups ||
    item?.addons ||
    [];

  return Array.isArray(source) ? source : [];
}

function getVariationCount(item: any) {
  return Number(
    item?._count?.variations ??
      normalizeVariations(item)?.length ??
      0
  );
}

function getModifierGroupCount(item: any) {
  return Number(
    item?._count?.modifierLinks ??
      item?._count?.modifierGroups ??
      normalizeModifierGroups(item)?.length ??
      0
  );
}

function formatCurrency(value: any) {
  return `Rs. ${Number(value ?? 0)}`;
}

function MiniItemPreview({ item }: { item: any }) {
  if (!item) return null;

  return (
    <div className="rounded-[20px] border border-white/60 bg-white/90 p-4 shadow-sm backdrop-blur">
      <div className="flex items-center gap-4">
        <img
          src={item?.imageUrl || "https://via.placeholder.com/80"}
          alt={item?.name}
          className="h-16 w-16 rounded-2xl border object-cover"
        />

        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-semibold text-gray-900">
            {item?.name || "-"}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            {item?.category?.name || item?.categoryName || "-"}
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              {formatCurrency(item?.price ?? item?.basePrice ?? 0)}
            </span>

            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
              {item?.prepTimeMinutes ?? "-"} min
            </span>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                item?.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {item?.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[22px] border border-dashed border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
        <Eye className="h-6 w-6 text-gray-400" />
      </div>

      <h4 className="text-base font-semibold text-gray-900">{title}</h4>
      <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
        {description}
      </p>
    </div>
  );
}

function ViewVariationsDialog({
  open,
  onOpenChange,
  item,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  item: any;
}) {
  const variations = useMemo(() => normalizeVariations(item), [item]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-hidden rounded-[28px] border-0 bg-[#F5F5F5] p-0 sm:max-w-[880px]">
        <div className="border-b bg-gradient-to-r from-white via-white to-[#F8F8F8] px-6 py-6">
          <DialogHeader className="space-y-3 text-left">
            <div className="flex items-center justify-between gap-4">
              <div>
                <DialogTitle className="text-[26px] font-semibold text-gray-900">
                  View Variations
                </DialogTitle>
                <DialogDescription className="mt-1 text-sm text-gray-500">
                  Review all pricing variations configured for this menu item.
                </DialogDescription>
              </div>

              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                {variations.length} total
              </span>
            </div>

            <MiniItemPreview item={item} />
          </DialogHeader>
        </div>

        <div className="max-h-[68vh] overflow-auto p-6">
          {variations.length === 0 ? (
            <EmptyState
              title="No variations added yet"
              description="This item does not have any pricing variations right now."
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {variations.map((variation: any, index: number) => (
                <div
                  key={variation?.id || `${variation?.name}-${index}`}
                  className="rounded-[22px] border bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h4 className="truncate text-[17px] font-semibold text-gray-900">
                        {variation?.name || "-"}
                      </h4>

                      <p className="mt-1 text-sm text-gray-500">
                        SKU: {variation?.sku || "—"}
                      </p>
                    </div>

                    <span className="whitespace-nowrap rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                      {formatCurrency(variation?.price ?? 0)}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                      Sort: {variation?.sortOrder ?? 0}
                    </span>

                    {variation?.isDefault ? (
                      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                        Default
                      </span>
                    ) : null}

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        variation?.isActive === false
                          ? "bg-gray-100 text-gray-600"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {variation?.isActive === false ? "Inactive" : "Active"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ViewModifiersDialog({
  open,
  onOpenChange,
  item,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  item: any;
}) {
  const modifierGroups = useMemo(
    () => normalizeModifierGroups(item),
    [item]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-hidden rounded-[28px] border-0 bg-[#F5F5F5] p-0 sm:max-w-[980px]">
        <div className="border-b bg-gradient-to-r from-white via-white to-[#F8F8F8] px-6 py-6">
          <DialogHeader className="space-y-3 text-left">
            <div className="flex items-center justify-between gap-4">
              <div>
                <DialogTitle className="text-[26px] font-semibold text-gray-900">
                  View Modifiers
                </DialogTitle>
                <DialogDescription className="mt-1 text-sm text-gray-500">
                  Review attached modifier groups and their options for this item.
                </DialogDescription>
              </div>

              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                {modifierGroups.length} groups
              </span>
            </div>

            <MiniItemPreview item={item} />
          </DialogHeader>
        </div>

        <div className="max-h-[68vh] overflow-auto p-6">
          {modifierGroups.length === 0 ? (
            <EmptyState
              title="No modifier groups attached yet"
              description="This item does not have any modifier groups configured right now."
            />
          ) : (
            <div className="space-y-4">
              {modifierGroups.map((group: any, index: number) => {
                const modifiers = Array.isArray(group?.modifiers)
                  ? group.modifiers
                  : [];

                return (
                  <div
                    key={
                      group?.linkId ||
                      group?.id ||
                      group?.modifierGroupId ||
                      index
                    }
                    className="rounded-[24px] border bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0">
                        <h4 className="truncate text-[18px] font-semibold text-gray-900">
                          {group?.name || "-"}
                        </h4>

                        <p className="mt-1 text-sm text-gray-500">
                          {group?.description || "No description provided"}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                          Min: {group?.minSelect ?? 0}
                        </span>

                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                          Max: {group?.maxSelect ?? 0}
                        </span>

                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                          Attach Sort: {group?.attachSortOrder ?? 0}
                        </span>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            group?.isRequired
                              ? "bg-amber-100 text-amber-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {group?.isRequired ? "Required" : "Optional"}
                        </span>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            group?.isActive === false
                              ? "bg-gray-100 text-gray-600"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {group?.isActive === false ? "Inactive" : "Active"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-800">
                          Options
                        </p>

                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                          {modifiers.length} items
                        </span>
                      </div>

                      {modifiers.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-sm text-gray-500">
                          No modifiers found inside this group.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          {modifiers.map((modifier: any, mIndex: number) => (
                            <div
                              key={modifier?.id || `${modifier?.name}-${mIndex}`}
                              className="rounded-[18px] border border-gray-100 bg-[#FCFCFC] p-4"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="truncate font-medium text-gray-900">
                                    {modifier?.name || "-"}
                                  </p>

                                  <div className="mt-2 flex flex-wrap gap-2">
                                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
                                      Sort: {modifier?.sortOrder ?? 0}
                                    </span>

                                    <span
                                      className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                                        modifier?.isActive === false
                                          ? "bg-gray-100 text-gray-600"
                                          : "bg-green-100 text-green-700"
                                      }`}
                                    >
                                      {modifier?.isActive === false
                                        ? "Inactive"
                                        : "Active"}
                                    </span>
                                  </div>
                                </div>

                                <span className="whitespace-nowrap rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                                  +{formatCurrency(modifier?.priceDelta ?? 0)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}