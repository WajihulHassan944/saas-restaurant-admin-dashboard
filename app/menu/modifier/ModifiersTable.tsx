"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaPen, FaTrash } from "react-icons/fa";
import ModifierModal from "./ModifierModal";
import PaginationSection from "@/components/shared/pagination";
import { Search } from "lucide-react";
import { useGetModifiers, useDeleteModifier } from "@/hooks/useMenus";
import DeleteDialog from "@/components/dialogs/delete-dialog";
import { useAuth } from "@/hooks/useAuth";

export default function ModifiersTable() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
const { restaurantId } = useAuth();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);
const {
  data: response,
  isLoading,
  isFetching,
  refetch,
} = useGetModifiers({
  page,
  limit,
  search: debouncedSearch,
  ...(restaurantId ? { restaurantId } : {}),
});
  useEffect(() => {
    if (refreshKey) {
      refetch();
    }
  }, [refreshKey, refetch]);

  const { mutate: deleteModifier, isPending: isDeleting } = useDeleteModifier();

  const items = useMemo(() => {
    if (!response) return [];

    return (
      response?.data?.items ||
      response?.data?.modifiers ||
      response?.data?.data ||
      response?.items ||
      response?.modifiers ||
      response?.data ||
      []
    );
  }, [response]);

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

  const handleDelete = () => {
    if (!deleteId) return;

    deleteModifier(deleteId, {
      onSuccess: () => {
        setDeleteId(null);
        refetch();
      },
    });
  };

  const getModifierGroupNames = (item: any) => {
    const fromModifierGroups = Array.isArray(item?.modifierGroups)
      ? item.modifierGroups
      : [];

    const fromGroupLinks = Array.isArray(item?.groupLinks)
      ? item.groupLinks
          .map((link: any) => link?.modifierGroup)
          .filter(Boolean)
      : [];

    const rawGroups = [...fromModifierGroups, ...fromGroupLinks];

    const uniqueMap = new Map<string, any>();

    rawGroups.forEach((group: any) => {
      const id = String(group?.id || "");
      if (!id) return;
      if (!uniqueMap.has(id)) {
        uniqueMap.set(id, group);
      }
    });

    return Array.from(uniqueMap.values())
      .map((group: any) => group?.name)
      .filter(Boolean);
  };

  const getModifierGroupDisplay = (item: any) => {
    const groupNames = getModifierGroupNames(item);

    if (!groupNames.length) {
      return {
        primary: "No group",
        secondary: "",
        all: [],
      };
    }

    if (groupNames.length === 1) {
      return {
        primary: groupNames[0],
        secondary: "",
        all: groupNames,
      };
    }

    return {
      primary: groupNames[0],
      secondary: `+${groupNames.length - 1} more`,
      all: groupNames,
    };
  };

  const SkeletonRow = () => (
    <tr>
      <td colSpan={6} className="py-6">
        <div className="flex animate-pulse items-center gap-3">
          <div className="h-4 w-[140px] rounded bg-gray-200" />
          <div className="h-4 w-[100px] rounded bg-gray-200" />
          <div className="h-4 w-[70px] rounded bg-gray-200" />
          <div className="h-4 w-[50px] rounded bg-gray-200" />
        </div>
      </td>
    </tr>
  );

  const SkeletonCard = () => (
    <div className="animate-pulse rounded-[18px] border bg-white p-4 shadow-sm">
      <div className="space-y-3">
        <div className="h-4 w-[140px] rounded bg-gray-200" />
        <div className="h-3 w-[100px] rounded bg-gray-200" />
        <div className="h-3 w-[80px] rounded bg-gray-200" />
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[18px] font-semibold text-gray-900">Modifiers</h2>

        <Button
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
          className="h-[40px] rounded-[12px] bg-primary px-4 text-white"
        >
          + Add Modifier
        </Button>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <div className="relative w-full max-w-[420px]">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            placeholder="Search modifiers..."
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

      <div className="hidden overflow-x-auto rounded-[16px] bg-white md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="px-2 py-3">Name</th>
              <th className="px-2">Groups</th>
              <th className="px-2 text-center">Price</th>
              <th className="px-2 text-center">Sort</th>
              <th className="px-2 text-center">Status</th>
              <th className="px-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading || isFetching ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-400">
                  No modifiers found
                </td>
              </tr>
            ) : (
              items.map((item: any) => {
                const groupDisplay = getModifierGroupDisplay(item);

                return (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-2 py-4">
                      <div className="flex flex-col">
                        <span className="block font-medium">{item.name}</span>
                      </div>
                    </td>

                    <td className="px-2">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800">
                          {groupDisplay.primary}
                        </span>

                        {groupDisplay.secondary ? (
                          <span
                            className="text-xs text-gray-500"
                            title={groupDisplay.all.join(", ")}
                          >
                            {groupDisplay.secondary}
                          </span>
                        ) : null}
                      </div>
                    </td>

                    <td className="px-2 text-center">
                      Rs. {item.priceDelta ?? 0}
                    </td>

                    <td className="px-2 text-center">
                      {item.sortOrder ?? "-"}
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
                          onClick={() => setDeleteId(item.id)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <FaTrash size={14} />
                        </button>
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

      <div className="space-y-4 md:hidden">
        {isLoading || isFetching ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : items.length === 0 ? (
          <div className="py-10 text-center text-gray-400">
            No modifiers found
          </div>
        ) : (
          items.map((item: any) => {
            const groupDisplay = getModifierGroupDisplay(item);

            return (
              <div
                key={item.id}
                className="rounded-[18px] border bg-white p-4 shadow-sm"
              >
                <div className="flex flex-1 flex-col justify-between gap-3">
                  <div>
                    <h3 className="text-[16px] font-semibold text-gray-900">
                      {item.name}
                    </h3>

                    <p
                      className="text-sm text-gray-500"
                      title={groupDisplay.all.join(", ")}
                    >
                      {groupDisplay.primary}
                      {groupDisplay.secondary
                        ? ` (${groupDisplay.secondary})`
                        : ""}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary">
                      Rs. {item.priceDelta ?? 0}
                    </span>

                    <span className="text-xs text-gray-500">
                      Sort: {item.sortOrder ?? "-"}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
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
                        onClick={() => setDeleteId(item.id)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        <PaginationSection {...pagination} onPageChange={setPage} />
      </div>

      <ModifierModal
        open={open}
        onOpenChange={(val: boolean) => {
          setOpen(val);
          if (!val) setSelected(null);
        }}
        initialData={selected}
        refresh={() => refetch()}
      />

      <DeleteDialog
        open={!!deleteId}
        onOpenChange={(value) => {
          if (!value) setDeleteId(null);
        }}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Modifier"
        description="Are you sure you want to delete this modifier? This action cannot be undone."
      />
    </div>
  );
}