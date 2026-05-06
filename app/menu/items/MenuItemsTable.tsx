"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaPen, FaTrash } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import {
  useDeleteMenuItem,
  useGetMenuItems,
  useReorderMenuItems,
} from "@/hooks/useMenus";
import DeleteDialog from "@/components/dialogs/delete-dialog";
import { GripVertical, Loader2, Search } from "lucide-react";
import CreateMenuItemModal from "@/components/menu/CreateMenuItemModal/CreateMenuItemModal";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import InfiniteScrollFooter from "@/components/shared/infinite-scroll-footer";

const PAGE_LIMIT = 10;

const extractResponseItems = (response: any) => {
  if (!response) return null;

  const candidates = [
    response?.data,
    response?.data?.items,
    response?.data?.data,
    response?.data?.data?.items,
    response?.items,
    response,
  ];

  const raw = candidates.find((candidate) => Array.isArray(candidate));

  return Array.isArray(raw) ? raw : [];
};

const extractResponseMeta = (response: any) => {
  return (
    response?.data?.pagination ||
    response?.data?.meta ||
    response?.data?.data?.pagination ||
    response?.data?.data?.meta ||
    response?.pagination ||
    response?.meta ||
    {}
  );
};

const mergeUniqueById = (prev: any[], next: any[]) => {
  const map = new Map<string, any>();

  [...prev, ...next].forEach((item) => {
    const id = String(item?.id || "");
    if (!id) return;
    map.set(id, item);
  });

  return Array.from(map.values());
};

export default function MenuItemsTable({ refetchKey }: any) {
  const { user, restaurantId: authRestaurantId } = useAuth();

  const restaurantId =
    authRestaurantId ?? user?.restaurantId ?? user?.tenantId ?? "";

  const reorderTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(PAGE_LIMIT);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [allItems, setAllItems] = useState<any[]>([]);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const [selected, setSelected] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const canFetchItems = Boolean(restaurantId);

  /**
   * Important:
   * Do not clear allItems inside debounce.
   * On initial mount, the empty search debounce can fire after the first
   * successful API response and wipe the list.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      const nextSearch = search.trim();

      setPage(1);
      setDebouncedSearch(nextSearch);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetMenuItems({
    page,
    limit,
    search: debouncedSearch || undefined,
    restaurantId: restaurantId || undefined,
  } as any);

  const { mutate: deleteMenuItem, isPending: isDeleting } =
    useDeleteMenuItem();

  const { mutate: reorderItems, isPending: isReordering } =
    useReorderMenuItems();

  const fetchedItems = useMemo<any[] | null>(() => {
    return extractResponseItems(response);
  }, [response]);

  const meta = useMemo(() => {
    return extractResponseMeta(response);
  }, [response]);

  const pagination = useMemo(() => {
    const currentPage = Number(meta?.page ?? page);
    const pageSize = Number(meta?.limit ?? limit);
    const total = Number(meta?.total ?? 0);

    const totalPages = Number(
      meta?.totalPages ??
        meta?.pages ??
        (total > 0 && pageSize > 0 ? Math.ceil(total / pageSize) : 0)
    );

    return {
      page: currentPage,
      limit: pageSize || limit,
      total,
      totalPages,
      hasNext:
        typeof meta?.hasNext === "boolean"
          ? meta.hasNext
          : typeof meta?.hasMore === "boolean"
          ? meta.hasMore
          : total > 0
          ? allItems.length < total
          : Boolean(fetchedItems && fetchedItems.length >= pageSize),
      hasPrevious:
        typeof meta?.hasPrevious === "boolean"
          ? meta.hasPrevious
          : currentPage > 1,
    };
  }, [meta, page, limit, allItems.length, fetchedItems]);

  const hasMore = useMemo(() => {
    if (!canFetchItems || !hasLoadedOnce) return false;

    if (pagination.total > 0) {
      return allItems.length < pagination.total;
    }

    return Boolean(pagination.hasNext);
  }, [
    canFetchItems,
    hasLoadedOnce,
    pagination.total,
    pagination.hasNext,
    allItems.length,
  ]);

  const shouldShowInitialLoader =
    !canFetchItems ||
    (!hasLoadedOnce && allItems.length === 0) ||
    ((isLoading || isFetching) && page === 1 && allItems.length === 0);

  const shouldShowEmpty =
    canFetchItems &&
    hasLoadedOnce &&
    !isLoading &&
    !isFetching &&
    allItems.length === 0;

  useEffect(() => {
    if (!canFetchItems || fetchedItems === null) return;

    setHasLoadedOnce(true);

    setAllItems((prev) => {
      if (page === 1) {
        return fetchedItems;
      }

      return mergeUniqueById(prev, fetchedItems);
    });
  }, [fetchedItems, page, canFetchItems]);

  const resetAndFetchFirstPage = useCallback(() => {
    setAllItems([]);
    setHasLoadedOnce(false);

    setPage((prev) => {
      if (prev === 1) {
        refetch();
      }

      return 1;
    });
  }, [refetch]);

  useEffect(() => {
    if (!restaurantId) return;

    resetAndFetchFirstPage();
  }, [restaurantId, resetAndFetchFirstPage]);

  useEffect(() => {
    if (!refetchKey) return;

    resetAndFetchFirstPage();
  }, [refetchKey, resetAndFetchFirstPage]);

  const handleLoadMore = useCallback(() => {
    if (!hasMore || isFetching || isLoading) return;

    setPage((prev) => {
      if (pagination.totalPages > 0 && prev >= pagination.totalPages) {
        return prev;
      }

      return prev + 1;
    });
  }, [hasMore, isFetching, isLoading, pagination.totalPages]);

  const desktopLoadMoreRef = useInfiniteScroll<HTMLDivElement>({
    enabled: canFetchItems && hasMore && !isFetching && !isLoading,
    onLoadMore: handleLoadMore,
  });

  const mobileLoadMoreRef = useInfiniteScroll<HTMLDivElement>({
    enabled: canFetchItems && hasMore && !isFetching && !isLoading,
    onLoadMore: handleLoadMore,
  });

  const handleDelete = () => {
    if (!deleteId) return;

    deleteMenuItem(deleteId, {
      onSuccess: () => {
        setAllItems((prev) =>
          prev.filter((item) => String(item.id) !== String(deleteId))
        );

        setDeleteId(null);
        refetch();
      },
    });
  };

  const buildReorderPayload = (items: any[]) => ({
    items: items.map((item, index) => ({
      id: String(item.id),
      sortOrder: index + 1,
    })),
  });

  const persistReorder = (items: any[]) => {
    if (reorderTimerRef.current) {
      clearTimeout(reorderTimerRef.current);
    }

    reorderTimerRef.current = setTimeout(() => {
      reorderItems(buildReorderPayload(items), {
        onError: () => {
          refetch();
        },
      });
    }, 500);
  };

  const moveItem = (fromId: string, toId: string) => {
    if (fromId === toId) return;

    setAllItems((prev) => {
      const fromIndex = prev.findIndex(
        (item) => String(item.id) === String(fromId)
      );

      const toIndex = prev.findIndex(
        (item) => String(item.id) === String(toId)
      );

      if (fromIndex === -1 || toIndex === -1) {
        return prev;
      }

      const updated = [...prev];
      const [movedItem] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, movedItem);

      const normalized = updated.map((item, index) => ({
        ...item,
        sortOrder: index + 1,
      }));

      persistReorder(normalized);

      return normalized;
    });
  };

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDrop = (targetId: string) => {
    if (!draggedId) return;

    moveItem(draggedId, targetId);
    setDraggedId(null);
  };

  const softRefresh = () => {
    resetAndFetchFirstPage();
  };

  const handleManualSearch = () => {
    if (!canFetchItems) return;

    const nextSearch = search.trim();

    setPage(1);
    setDebouncedSearch(nextSearch);

    if (page === 1 && debouncedSearch === nextSearch) {
      refetch();
    }
  };

  const SkeletonRow = () => (
    <tr>
      <td colSpan={7} className="py-6">
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

  const EmptyTableState = () => (
    <div className="py-10 text-center text-gray-400">No menu items found</div>
  );

  return (
    <div className="w-full">
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
          disabled={!canFetchItems}
          onClick={handleManualSearch}
          className="h-[44px] rounded-[14px] bg-primary px-5 text-white shadow-sm"
        >
          Search
        </Button>
      </div>

      {isReordering ? (
        <div className="mb-3 flex items-center gap-2 text-xs text-gray-500">
          <Loader2 size={14} className="animate-spin" />
          Saving item order...
        </div>
      ) : null}

      <div className="hidden overflow-x-auto rounded-[16px] bg-white md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="w-[48px] px-2 py-3"></th>
              <th className="px-2 py-3">Item</th>
              <th className="px-2">Category</th>
              <th className="px-2 text-center">Price</th>
              <th className="px-2 text-center">Prep</th>
              <th className="px-2 text-center">Status</th>
              <th className="px-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {shouldShowInitialLoader ? (
              Array.from({ length: 5 }).map((_, index) => (
                <SkeletonRow key={index} />
              ))
            ) : shouldShowEmpty ? (
              <tr>
                <td colSpan={7}>
                  <EmptyTableState />
                </td>
              </tr>
            ) : (
              allItems.map((item: any) => (
                <tr
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(item.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(item.id)}
                  onDragEnd={() => setDraggedId(null)}
                  className={`border-b transition-colors hover:bg-gray-50 ${
                    draggedId === item.id ? "bg-primary/5 opacity-60" : ""
                  }`}
                >
                  <td className="px-2 py-4">
                    <div className="flex cursor-grab justify-center text-gray-400 active:cursor-grabbing">
                      <GripVertical size={18} />
                    </div>
                  </td>

                  <td className="px-2 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.imageUrl || "https://via.placeholder.com/40"}
                        alt={item.name || "Menu item"}
                        className="h-10 w-10 rounded-[10px] border object-cover"
                        loading="lazy"
                      />

                      <div className="min-w-0">
                        <p className="truncate font-medium text-gray-900">
                          {item.name}
                        </p>

                        {item.description ? (
                          <p className="mt-1 max-w-[220px] truncate text-[11px] text-gray-400">
                            {item.description}
                          </p>
                        ) : null}
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
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {!shouldShowInitialLoader && !shouldShowEmpty && allItems.length > 0 ? (
          <InfiniteScrollFooter
            loadMoreRef={desktopLoadMoreRef}
            isFetching={isFetching && page > 1}
            hasMore={hasMore}
            total={pagination.total}
            shown={allItems.length}
            label="menu items"
          />
        ) : null}
      </div>

      <div className="space-y-4 md:hidden">
        {shouldShowInitialLoader ? (
          Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        ) : shouldShowEmpty ? (
          <div className="py-10 text-center text-gray-400">
            No menu items found
          </div>
        ) : (
          allItems.map((item: any) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(item.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(item.id)}
              onDragEnd={() => setDraggedId(null)}
              className={`rounded-[18px] border bg-white p-4 shadow-sm transition ${
                draggedId === item.id ? "bg-primary/5 opacity-60" : ""
              }`}
            >
              <div className="mb-3 flex justify-end">
                <div className="flex cursor-grab items-center gap-1 text-xs text-gray-400 active:cursor-grabbing">
                  <GripVertical size={16} />
                  Drag
                </div>
              </div>

              <div className="flex gap-4">
                <img
                  src={item.imageUrl || "https://via.placeholder.com/80"}
                  alt={item.name || "Menu item"}
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

                    {item.description ? (
                      <p className="mt-1 line-clamp-2 text-xs text-gray-400">
                        {item.description}
                      </p>
                    ) : null}
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {!shouldShowInitialLoader && !shouldShowEmpty && allItems.length > 0 ? (
          <InfiniteScrollFooter
            loadMoreRef={mobileLoadMoreRef}
            isFetching={isFetching && page > 1}
            hasMore={hasMore}
            total={pagination.total}
            shown={allItems.length}
            label="menu items"
          />
        ) : null}
      </div>

      <CreateMenuItemModal
        open={open}
        onOpenChange={(value) => {
          setOpen(value);

          if (!value) {
            setSelected(null);
          }
        }}
        initialData={selected}
        onSuccess={softRefresh}
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
        title="Delete Menu Item"
        description="Are you sure you want to delete this menu item? This action cannot be undone."
      />
    </div>
  );
}

function formatCurrency(value: any) {
  const numeric = Number(value ?? 0);

  if (Number.isNaN(numeric)) {
    return "$0.00";
  }

  return `$${numeric.toFixed(2)}`;
}