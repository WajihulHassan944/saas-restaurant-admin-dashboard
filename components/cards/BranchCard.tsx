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
import { API_BASE_URL } from "@/lib/constants";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import OpeningHoursModal from "../branches/OpeningHoursModal";

export default function BranchCard({
  id,
  name,
  isDefault,
  itemsCount,
  isActive, // ✅ NEW PROP
  openDialog,
  openMenuDetails,
  editMenu,
}: BranchProps) {
  const [openingHoursOpen, setOpeningHoursOpen] = useState(false);
  const [token, setToken] = useState("");

  const [statusLoading, setStatusLoading] = useState<
    "activate" | "suspend" | null
  >(null);

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

  useEffect(() => {
    const authRaw = localStorage.getItem("auth");
    if (!authRaw) return;

    try {
      const auth = JSON.parse(authRaw);
      setToken(auth?.accessToken || "");
    } catch {
      console.error("Invalid auth");
    }
  }, []);

  // ================= DELETE =================
  const handleDelete = async () => {
    try {
      const endpoint = openDialog
        ? `${API_BASE_URL}/v1/branches/${id}`
        : `${API_BASE_URL}/v1/menus/${id}`;

      const res = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Deleted successfully");
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    }
  };

  // ================= STATUS HANDLERS =================
  const handleActivate = async () => {
    if (isActive) return;

    try {
      setStatusLoading("activate");

      const res = await fetch(
        `${API_BASE_URL}/v1/branches/${id}/activate`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Branch activated");
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || "Activation failed");
    } finally {
      setStatusLoading(null);
    }
  };

  const handleSuspend = async () => {
    if (!isActive) return;

    try {
      setStatusLoading("suspend");

      const res = await fetch(
        `${API_BASE_URL}/v1/branches/${id}/suspend`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Branch suspended");
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || "Suspend failed");
    } finally {
      setStatusLoading(null);
    }
  };

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
    // ✅ EDIT
    openDialog
      ? {
          label: "Edit Branch",
          href: `/branches/edit`,
          icon: <Store size={16} />,
        }
      : {
          label: "Edit Menu",
          onClick: () => editMenu?.(id),
          icon: <List size={16} />,
        },

    // ✅ ONLY FOR BRANCH
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
            icon:
              statusLoading === "activate" ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Power size={16} />
              ),
            className: isActive ? "opacity-40 pointer-events-none" : "",
          },
          {
            label: "Suspend",
            onClick: handleSuspend,
            icon:
              statusLoading === "suspend" ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <PauseCircle size={16} />
              ),
            className: !isActive ? "opacity-40 pointer-events-none" : "",
          },
        ]
      : []),

    // ✅ DELETE (COMMON)
    {
      label: "Delete",
      onClick: handleDelete,
      icon: <Trash size={16} className="text-red-500" />,
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

// ================= UI =================

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