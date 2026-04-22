"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import useApi from "@/hooks/useApi";
import { toast } from "sonner";
import AsyncMultiSelect from "@/components/ui/AsyncMultiSelect";
import {
  useCreateModifier,
  useUpdateModifier,
} from "@/hooks/useMenus";

interface ModifierForm {
  modifierGroupIds: string[];
  name: string;
  priceDelta: number;
  sortOrder: number;
}

export default function ModifierModal({
  open,
  onOpenChange,
  initialData,
  refresh,
}: any) {
  const { user, token } = useAuth();
  const api = useApi(token);

  const { mutateAsync: createModifier, isPending: isCreating } =
    useCreateModifier();
  const { mutateAsync: updateModifier, isPending: isUpdating } =
    useUpdateModifier();

  const [selectedGroups, setSelectedGroups] = useState<any[]>([]);
  const [form, setForm] = useState<ModifierForm>({
    modifierGroupIds: [],
    name: "",
    priceDelta: 0,
    sortOrder: 0,
  });

  const isSubmitting = isCreating || isUpdating;

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      const resolvedGroups = Array.isArray(initialData?.modifierGroups)
        ? initialData.modifierGroups
        : initialData?.modifierGroup
        ? [initialData.modifierGroup]
        : Array.isArray(initialData?.modifierGroupIds)
        ? initialData.modifierGroupIds.map((id: string) => ({
            id,
            name: "Selected Group",
          }))
        : initialData?.modifierGroupId
        ? [
            {
              id: initialData.modifierGroupId,
              name: initialData.modifierGroupName || "Selected Group",
            },
          ]
        : [];

      setForm({
        modifierGroupIds: resolvedGroups.map((group: any) => String(group?.id || "")),
        name: initialData.name || "",
        priceDelta: Number(initialData.priceDelta || 0),
        sortOrder: Number(initialData.sortOrder || 0),
      });

      setSelectedGroups(
        resolvedGroups.map((group: any) => ({
          id: String(group?.id || ""),
          name: group?.name || "Selected Group",
        }))
      );
    } else {
      setForm({
        modifierGroupIds: [],
        name: "",
        priceDelta: 0,
        sortOrder: 0,
      });
      setSelectedGroups([]);
    }
  }, [initialData, open]);

  const fetchModifierGroups = async ({
    search = "",
    page = 1,
  }: {
    search: string;
    page: number;
  }) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: "10",
    });

    if (search?.trim()) {
      params.set("search", search.trim());
    }

    if (user?.restaurantId) {
      params.set("restaurantId", String(user.restaurantId));
    }

    const res = await api.get(`/v1/menu/modifier-groups?${params.toString()}`);

    const normalizedData = Array.isArray(res?.data)
      ? res.data
      : Array.isArray(res?.data?.data)
      ? res.data.data
      : Array.isArray(res?.data?.items)
      ? res.data.items
      : Array.isArray(res?.data?.modifierGroups)
      ? res.data.modifierGroups
      : [];

    return {
      data: normalizedData,
      meta: res?.meta || res?.data?.meta || res?.data?.pagination || {},
    };
  };

  const handleChange = (key: keyof ModifierForm, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const canSubmit = useMemo(() => {
    return !!form.name?.trim() && form.modifierGroupIds.length > 0;
  }, [form.name, form.modifierGroupIds]);

  const handleSubmit = async () => {
    if (!canSubmit) {
      toast.error("Required fields missing");
      return;
    }

    try {
      if (initialData?.id) {
        const payload = {
          name: form.name.trim(),
          priceDelta: Number(form.priceDelta),
          sortOrder: Number(form.sortOrder),
          modifierGroupIds: form.modifierGroupIds,
        };

        await updateModifier({
          id: initialData.id,
          data: payload,
        });

        toast.success("Updated");
      } else {
        const payload = {
          name: form.name.trim(),
          priceDelta: Number(form.priceDelta),
          sortOrder: Number(form.sortOrder),
          modifierGroupIds: form.modifierGroupIds,
        };

        await createModifier(payload);
        toast.success("Created");
      }

      refresh?.();
      onOpenChange(false);
    } catch (error) {
      // mutation hooks already handle error toast
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!isSubmitting) onOpenChange(value);
      }}
    >
      <DialogContent className="max-w-[420px] rounded-[20px] bg-[#F5F5F5] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {initialData ? "Edit" : "Add"} Modifier
          </DialogTitle>

          <p className="text-sm text-gray-500">
            Configure this modifier details
          </p>
        </DialogHeader>

        <div className="mt-5 space-y-4 rounded-[16px] bg-white p-5">
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Modifier Groups</p>

            <AsyncMultiSelect
              value={selectedGroups}
              onChange={(groups) => {
                setSelectedGroups(groups);
                handleChange(
                  "modifierGroupIds",
                  groups.map((group: any) => String(group?.id || ""))
                );
              }}
              placeholder="Select Groups"
              fetchOptions={fetchModifierGroups}
              labelKey="name"
              valueKey="id"
            />
          </div>

          <InputField
            label="Modifier Name"
            value={form.name}
            onChange={(v: string) => handleChange("name", v)}
          />

          <InputField
            label="Price Delta"
            type="number"
            value={form.priceDelta}
            onChange={(v: string) => handleChange("priceDelta", Number(v))}
          />

          <InputField
            label="Sort Order"
            type="number"
            value={form.sortOrder}
            onChange={(v: string) => handleChange("sortOrder", Number(v))}
          />

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="mt-2 w-full rounded-[10px] bg-primary py-4"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                Saving...
              </span>
            ) : initialData ? (
              "Update Modifier"
            ) : (
              "Create Modifier"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface InputFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
}: InputFieldProps) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-gray-600">{label}</p>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-[40px] w-full rounded-[10px] border border-gray-300 px-3 outline-none focus:border-gray-400"
      />
    </div>
  );
}