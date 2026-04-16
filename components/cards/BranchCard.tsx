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
import { useAuth } from "@/hooks/useAuth";
import useApi from "@/hooks/useApi";
import { toast } from "sonner";
import DeleteDialog from "../dialogs/delete-dialog";
import BranchCoverModal from "../branches/BranchCoverModal";

export default function BranchCard({
  id,
  name,
  isDefault,
  itemsCount,
  isActive,
  openDialog,
  openMenuDetails,
  editMenu,
  loading,
   coverImage,
  logoUrl,
}: BranchProps & { loading?: boolean }) {
  const [openingHoursOpen, setOpeningHoursOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [coverModalOpen, setCoverModalOpen] = useState(false);
const [isDeleting, setIsDeleting] = useState(false);
  const deleteMutation = useDeleteBranch();
  const activateMutation = useActivateBranch();
  const suspendMutation = useSuspendBranch();

const { token } = useAuth();
const { del } = useApi(token);
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
    setIsDeleting(true);

    if (openDialog) {
      // Branch delete
      await deleteMutation.mutateAsync(id);
    } else {
      // Menu delete
      const res = await del(`/v1/menus/${id}`);

      if (res?.error) return;

      toast.success(res?.message || "Menu deleted successfully");
      window.location.reload();
    }

    setDeleteDialogOpen(false);
  } catch (err: any) {
    console.error(err);
    toast.error(err.message || "Failed to delete");
  } finally {
    setIsDeleting(false);
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
      bg-white rounded-[14px] border border-gray-200
      p-4 transition
      ${typeof isActive === "boolean" && !isActive ? "opacity-60" : ""}
    `}
  >
    {/* MOBILE CARD LAYOUT */}
    <div className="flex flex-col gap-3 lg:hidden">

      {/* TOP */}
      <div className="flex items-center gap-3">
        <Checkbox
          defaultChecked
          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />

        <div className="size-10 rounded-lg bg-[#F4F6FA] flex items-center justify-center shrink-0">
          <Icon size={20} className="text-gray-500" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-semibold truncate">{name}</h4>

            {isDefault && (
              <span className="text-[11px] font-medium text-green-600 bg-green-50 px-2 py-[2px] rounded-full">
                main
              </span>
            )}
          </div>

          <p className="text-xs text-gray-400 mt-1">
            ID: #{id} • {itemsCount} Items
          </p>
        </div>
      </div>

      {/* ACTION ROW */}
      <div className="flex items-center justify-between pt-3 border-t">

        <div className="flex items-center gap-2">
          {(openDialog || openMenuDetails) && (
            <ActionButton
              onClick={() =>
                openDialog ? openDialog(id) : openMenuDetails?.(id)
              }
            >
              <Eye size={18} />
            </ActionButton>
          )}

          {openDialog && (
            <ActionButton onClick={() => setCoverModalOpen(true)}>
              <ImageIcon size={18} />
            </ActionButton>
          )}
        </div>

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
          onClick: !isActive ? handleActivate : undefined,
          className: isActive ? "opacity-50 pointer-events-none" : "",
          icon: <Power size={16} />,
        },
        {
          label: "Suspend",
          onClick: isActive ? handleSuspend : undefined,
          className: !isActive ? "opacity-50 pointer-events-none" : "",
          icon: <PauseCircle size={16} />,
        },
      ]
    : []),

  {
    label: "Delete",
    onClick: () => setDeleteDialogOpen(true),
    icon: <Trash size={16} className="text-red-500" />,
  },
]}
        />
      </div>
    </div>

    {/* DESKTOP (UNCHANGED ORIGINAL STRUCTURE) */}
    <div className="hidden lg:flex items-center justify-between gap-4">
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
          <div className="flex items-center gap-2">
            <h4 className="text-base font-semibold truncate">{name}</h4>

            {isDefault && (
              <div className="flex items-center">
                <span className="size-2 rounded-full bg-green-500" />
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-[2px] rounded-full whitespace-nowrap">
                  main
                </span>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-400">
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

        {openDialog && (
          <>
            <ActionButton onClick={() => setCoverModalOpen(true)}>
              <ImageIcon size={18} />
            </ActionButton>
            <Divider />
          </>
        )}

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
          onClick: !isActive ? handleActivate : undefined,
          className: isActive ? "opacity-50 pointer-events-none" : "",
          icon: <Power size={16} />,
        },
        {
          label: "Suspend",
          onClick: isActive ? handleSuspend : undefined,
          className: !isActive ? "opacity-50 pointer-events-none" : "",
          icon: <PauseCircle size={16} />,
        },
      ]
    : []),

  {
    label: "Delete",
    onClick: () => setDeleteDialogOpen(true),
    icon: <Trash size={16} className="text-red-500" />,
  },
]}
        />
      </div>
    </div>

    {/* MODALS */}
    <OpeningHoursModal
      open={openingHoursOpen}
      onOpenChange={handleOpenChange}
      branchId={id}
      branchName={name}
    />

    <DeleteDialog
      open={deleteDialogOpen}
      onOpenChange={setDeleteDialogOpen}
      onConfirm={handleDelete}
      isLoading={isDeleting || deleteMutation.isPending}
      title={openDialog ? "Delete Branch" : "Delete Menu"}
      description={`Are you sure you want to delete "${name}"? This action cannot be undone.`}
    />

    <BranchCoverModal
      open={coverModalOpen}
      onOpenChange={setCoverModalOpen}
      branchId={id}
      branchName={name}
       coverImage={coverImage}   // ✅ add this
  logoUrl={logoUrl}
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