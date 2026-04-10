"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Eye,
  Image as ImageIcon,
  Store,
  List,
  Trash,
  Loader2,
  Power,
  PauseCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BranchProps } from "@/types/branch";
import ActionDropdown from "../shared/ActionDropdown";
import { useState } from "react";
import OpeningHoursModal from "../branches/OpeningHoursModal";

import {
  useDeleteBranch,
  useActivateBranch,
  useSuspendBranch,
} from "@/hooks/useBranches";

export default function BranchCard({
  id,
  name,
  isDefault,
  itemsCount,
  isActive,
  openDialog,
  openMenuDetails,
  editMenu,
  loading, // ✅ NEW
}: BranchProps & { loading?: boolean }) {
  const [openingHoursOpen, setOpeningHoursOpen] = useState(false);
console.log("loading state", loading);
  const deleteMutation = useDeleteBranch();
  const activateMutation = useActivateBranch();
  const suspendMutation = useSuspendBranch();

  const handleOpenChange = (value: boolean) => {
    setOpeningHoursOpen(value);
  };

  const iconMap = [
    { key: "menu", icon: List },
    { key: "branch", icon: Store },
  ];

  const Icon =
    iconMap.find(({ key }) =>
      name?.toLowerCase().includes(key)
    )?.icon || Store;

  /**
   * ================= DELETE
   */
  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err: any) {
      console.error(err);
    }
  };

  /**
   * ================= ACTIVATE
   */
  const handleActivate = async () => {
    if (isActive) return;
    try {
      await activateMutation.mutateAsync(id);
    } catch (err: any) {
      console.error(err);
    }
  };

  /**
   * ================= SUSPEND
   */
  const handleSuspend = async () => {
    if (!isActive) return;
    try {
      await suspendMutation.mutateAsync(id);
    } catch (err: any) {
      console.error(err);
    }
  };

  /**
   * ================= SKELETON STATE
   */
  if (loading) {
    return (
      <div className="flex items-center justify-between bg-white rounded-[14px] border border-gray-200 px-4 py-4 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="size-4 bg-gray-200 rounded" />
          <div className="size-10 bg-gray-200 rounded-lg" />
          <div className="space-y-2">
            <div className="h-3 w-[120px] bg-gray-200 rounded" />
            <div className="h-2 w-[80px] bg-gray-200 rounded" />
          </div>
        </div>

        <div className="flex gap-2">
          <div className="h-8 w-8 bg-gray-200 rounded" />
          <div className="h-8 w-8 bg-gray-200 rounded" />
          <div className="h-8 w-8 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        flex flex-col gap-4 items-start
        bg-white rounded-[14px] border border-gray-200
        px-4 py-4 overflow-x-auto
        lg:flex-row lg:items-center lg:justify-between
        transition
        ${typeof isActive === "boolean" && !isActive ? "opacity-60" : ""}
      `}
    >
      {/* LEFT */}
      <div className="flex items-center gap-4 min-w-0">
        <Checkbox
          defaultChecked
          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />

        <div className="size-10 rounded-lg bg-[#F4F6FA] flex items-center justify-center">
          <Icon size={20} className="text-gray-500" />
        </div>

        <div className="space-y-1 min-w-0">
          <div className="flex flex-col items-start gap-2 lg:flex-row lg:items-center">
            <h4 className="text-base font-semibold text-dark truncate">
              {name}
            </h4>

            {isDefault && (
              <div className="flex items-center">
                <span className="size-2 rounded-full bg-green-500" />
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-[2px] rounded-full whitespace-nowrap">
                  main
                </span>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-400 truncate">
            ID: #{id} | {itemsCount} Items
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center border border-gray-200 rounded-[10px] overflow-hidden">

        {openDialog && (
          <>
            <ActionButton onClick={() => openDialog(id)}>
              <Eye size={18} />
            </ActionButton>
            <Divider />
          </>
        )}

        {openMenuDetails && (
          <>
            <ActionButton onClick={() => openMenuDetails(id)}>
              <Eye size={18} />
            </ActionButton>
            <Divider />
          </>
        )}

        <Divider />

        <ActionButton>
          <ImageIcon size={18} />
        </ActionButton>

        <Divider />

        <ActionDropdown
          items={[
            openDialog
              ? {
                  label: "Edit Branch",
                  href: `/branches/edit?branchId=${id}`,
                  icon: <Store size={16} />,
                }
              : {
                  label: "Edit Menu",
                  onClick: () => editMenu?.(id),
                  icon: <List size={16} />,
                },

            ...(openDialog
              ? [
                  {
                    label: "Opening Hours",
                    onClick: () => setOpeningHoursOpen(true),
                    icon: <Store size={16} />,
                  },
                  {
                    label: "Activate",
                    onClick: handleActivate,
                    icon: activateMutation.isPending ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Power size={16} />
                    ),
                    className: isActive ? "opacity-40 pointer-events-none" : "",
                  },
                  {
                    label: "Suspend",
                    onClick: handleSuspend,
                    icon: suspendMutation.isPending ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <PauseCircle size={16} />
                    ),
                    className: !isActive ? "opacity-40 pointer-events-none" : "",
                  },
                ]
              : []),

            {
              label: "Delete",
              onClick: handleDelete,
              icon: deleteMutation.isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Trash size={16} className="text-red-500" />
              ),
            },
          ]}
        />
      </div>

      {/* MODAL */}
      <OpeningHoursModal
        open={openingHoursOpen}
        onOpenChange={handleOpenChange}
        branchId={id}
        branchName={name}
      />
    </div>
  );
}

/**
 * UI
 */
function ActionButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Button
      variant="ghost"
      className="h-[40px] w-[44px] flex items-center justify-center text-gray-500 hover:bg-gray-50"
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function Divider() {
  return <div className="w-[1px] h-[38px] bg-gray-200" />;
}