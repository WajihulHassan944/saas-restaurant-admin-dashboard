"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import useApi from "@/hooks/useApi";
import { useAuthContext } from "@/context/AuthContext";
import { useFileUpload } from "@/hooks/useFileUpload";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: any; // 👈 NEW
   onSuccess?: () => void;
};

export default function EmployeeInvitationModal({
  open,
  onOpenChange,
  initialData,
  onSuccess
}: Props) {
  const { token } = useAuthContext();
  const { post, patch, get } = useApi(token);

  const { uploadFile, uploading } = useFileUpload();

  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<any[]>([]);

  const isEdit = !!initialData;

  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    staffRoleId: "",
    phone: "",
    avatarUrl: "",
    bio: "",
    isActive: true,
  });

  /* ---------- Prefill (EDIT) ---------- */
  useEffect(() => {
    if (initialData && open) {
      setForm({
        email: initialData.email || "",
        password: "",
        firstName: initialData.profile?.firstName || "",
        lastName: initialData.profile?.lastName || "",
        staffRoleId: initialData.staffRoleId || "",
        phone: initialData.profile?.phone || "",
        avatarUrl: initialData.profile?.avatarUrl || "",
        bio: initialData.profile?.bio || "",
        isActive: initialData.isActive ?? true,
      });
    }
  }, [initialData, open]);

  /* ---------- Reset ---------- */
  useEffect(() => {
    if (!open) {
      setForm({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        staffRoleId: "",
        phone: "",
        avatarUrl: "",
        bio: "",
        isActive: true,
      });
    }
  }, [open]);

  /* ---------- Fetch Roles ---------- */
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await get(`/v1/staff-roles`);
        if (res?.data) setRoles(res.data);
      } catch {
        toast.error("Failed to fetch roles");
      }
    };

    if (open) fetchRoles();
  }, [open]);

  /* ---------- Change ---------- */
  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /* ---------- Upload ---------- */
  const handleFile = async (e: any) => {
    const url = await uploadFile(e);
    if (url) handleChange("avatarUrl", url);
  };

  /* ---------- Submit ---------- */
  const handleSubmit = async () => {
    try {
      if (!form.email || !form.firstName || !form.lastName || !form.staffRoleId) {
        return toast.error("Please fill required fields");
      }

      setLoading(true);

      let res;

      if (isEdit) {
        const { password, ...payload } = form;

  res = await patch(`/v1/staff-management/${initialData.id}`, payload);
      } else {
        // ✅ POST
        if (!form.password) {
          return toast.error("Password is required");
        }

        res = await post("/v1/staff-management", form);
      }

      if (!res || res.error) {
        toast.error(res?.error || "Failed");
        return;
      }

      toast.success(isEdit ? "Employee updated" : "Invitation sent");

      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[460px] rounded-[20px] p-6 max-h-[100vh] overflow-auto">

        {/* Header */}
        <DialogHeader className="text-center space-y-1">
          <DialogTitle className="text-xl font-semibold">
           {isEdit ? "Edit Employee" : "Employee Invitation"}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 text-center">
           {isEdit
              ? "Update employee details"
              : "Send invitation to employee"}
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <div className="mt-6 space-y-4">

          <FormField
            label="Email *"
            value={form.email}
            onChange={(v) => handleChange("email", v)}
          />

          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="First Name *"
              value={form.firstName}
              onChange={(v) => handleChange("firstName", v)}
            />
            <FormField
              label="Last Name *"
              value={form.lastName}
              onChange={(v) => handleChange("lastName", v)}
            />
          </div>

 <div className="grid grid-cols-2 gap-3">
          <FormField
            label="Phone"
            value={form.phone}
            onChange={(v) => handleChange("phone", v)}
          />
             {!isEdit && (
            <FormField
              label="Password *"
              value={form.password}
              onChange={(v) => handleChange("password", v)}
            /> )}
</div>
          {/* Role Dropdown */}
          <div>
            <label className="text-sm font-medium">Role *</label>
            <select
              value={form.staffRoleId}
              onChange={(e) =>
                handleChange("staffRoleId", e.target.value)
              }
              className="mt-1 h-[44px] w-full rounded-lg border border-gray-300 px-3 text-sm"
            >
              <option value="">Select Role</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Avatar Upload */}
          <div>
            <label className="text-sm font-medium">Avatar</label>
            <Input
              type="file"
              onChange={handleFile}
              className="mt-1 h-[44px] rounded-lg border border-gray-300"
            />
            {uploading && (
              <p className="text-xs text-gray-400 mt-1">
                Uploading...
              </p>
            )}
          </div>

          <FormField
            label="Bio"
            value={form.bio}
            onChange={(v) => handleChange("bio", v)}
          />
        </div>

        {/* CTA */}
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 w-full h-[46px] rounded-xl bg-red-500 text-white hover:bg-red-600"
        >
         {loading
            ? isEdit
              ? "Updating..."
              : "Sending..."
            : isEdit
            ? "Update Employee"
            : "Send Invitation"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Reusable Field ---------- */
function FormField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-[44px] rounded-lg border border-gray-300"
      />
    </div>
  );
}