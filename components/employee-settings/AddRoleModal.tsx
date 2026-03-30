"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useApi from "@/hooks/useApi";
import { useAuthContext } from "@/context/AuthContext";
import { X } from "lucide-react";

type Permission = {
  access: string;
  operations: string[];
};

type RoleModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: any;
  onSuccess?: () => void; // 👈 add this
};
const ACCESS_OPTIONS = [
  "Zone",
  "Orders",
  "Employees",
  "Menu",
  "Reports",
];

const OPERATIONS = ["Create", "Read", "Update", "Delete"];

export function AddRoleModal({
  open,
  onOpenChange,
  initialData, onSuccess
}: RoleModalProps) {
  const { token, user } = useAuthContext();
  const { post, patch } = useApi(token);

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [selectedAccess, setSelectedAccess] = useState("");
  const [selectedOps, setSelectedOps] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  const isEditMode = !!initialData;

  /* ---------- Prefill for Edit ---------- */
  useEffect(() => {
    if (initialData && open) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");

      // transform backend permissions
      const mappedPermissions =
        initialData.permissions?.map((p: any) => ({
          access: p.access,
          operations: p.operations,
        })) || [];

      setPermissions(mappedPermissions);
    }
  }, [initialData, open]);

  /* ---------- Reset on Close ---------- */
  useEffect(() => {
    if (!open) {
      setName("");
      setDescription("");
      setPermissions([]);
      setSelectedAccess("");
      setSelectedOps([]);
    }
  }, [open]);

  /* ---------- Toggle Operation ---------- */
  const toggleOperation = (op: string) => {
    setSelectedOps((prev) =>
      prev.includes(op)
        ? prev.filter((o) => o !== op)
        : [...prev, op]
    );
  };

  /* ---------- Add Permission ---------- */
  const handleAddPermission = () => {
    if (!selectedAccess || selectedOps.length === 0) return;

    setPermissions((prev) => [
      ...prev,
      { access: selectedAccess, operations: selectedOps },
    ]);

    setSelectedAccess("");
    setSelectedOps([]);
  };

  /* ---------- Remove Permission ---------- */
  const removePermission = (index: number) => {
    setPermissions((prev) => prev.filter((_, i) => i !== index));
  };

  /* ---------- Submit ---------- */
  const handleSubmit = async () => {
    try {
      if (!name || permissions.length === 0) {
        return toast.error("Role name and permissions are required");
      }

      setLoading(true);

const basePayload = {
  name,
  permissions,
  description,
};

const payload = isEditMode
  ? basePayload
  : {
      ...basePayload,
      // restaurantId: user?.restaurantId,
      // branchId: user?.branchId,
    };

      let res;

      if (isEditMode) {
        // ✅ PATCH
        res = await patch(`/v1/staff-roles/${initialData.id}`, payload);
      } else {
        // ✅ POST
        res = await post("/v1/staff-roles", payload);
      }

      if (!res || res.error) {
        toast.error(res?.error || "Failed to save role");
        return;
      }

      toast.success(
        isEditMode ? "Role updated successfully" : "Role created successfully"
      );

      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const isAddDisabled = !selectedAccess || selectedOps.length === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[520px] rounded-[20px] p-6">
        
        {/* Header */}
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {isEditMode ? "Edit Role-Permission" : "Add Role-Permission"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-4">

          {/* Role Name */}
          <div>
            <label className="text-sm font-medium">Role Name</label>
            <Input
              placeholder="Enter Role Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 h-[44px] rounded-lg border border-gray-300"
            />
          </div>

          {/* Permission Builder */}
          <div className="border rounded-xl p-4 space-y-4">
            <p className="text-sm font-medium">Add Permission</p>

            <div className="flex gap-2">
              <select
                value={selectedAccess}
                onChange={(e) => {
                  setSelectedAccess(e.target.value);
                  setSelectedOps([]);
                }}
                className="flex-1 h-[42px] rounded-lg border border-gray-300 px-3 text-sm"
              >
                <option value="">Select Access</option>
                {ACCESS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>

              <Button
                onClick={handleAddPermission}
                disabled={isAddDisabled}
                className="bg-red-500 text-white hover:bg-red-600 px-5 disabled:opacity-50"
              >
                Add
              </Button>
            </div>

            {selectedAccess && (
              <div className="flex flex-wrap gap-4">
                {OPERATIONS.map((op) => (
                  <label key={op} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedOps.includes(op)}
                      onChange={() => toggleOperation(op)}
                      className="accent-red-500"
                    />
                    {op}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Permissions List */}
          <div>
            <p className="text-sm font-medium mb-2">Permissions</p>

            <div className="space-y-2">
              {permissions.map((perm, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border rounded-lg px-3 py-2"
                >
                  <div className="flex items-center gap-3 text-sm">
                    <span className="font-medium">{perm.access}</span>

                    <div className="flex gap-1 flex-wrap">
                      {perm.operations.map((op) => (
                        <span
                          key={op}
                          className="text-xs bg-gray-100 px-2 py-0.5 rounded"
                        >
                          {op}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => removePermission(index)}
                    className="bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium">Description</label>
            <Input
              placeholder="Short description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 h-[44px] rounded-lg border border-gray-300"
            />
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full h-[46px] rounded-xl bg-red-500 text-white hover:bg-red-600"
          >
            {loading
              ? isEditMode
                ? "Updating..."
                : "Saving..."
              : isEditMode
              ? "Update Role"
              : "Save Role"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}