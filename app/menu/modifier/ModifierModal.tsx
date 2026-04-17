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
import AsyncSelect from "@/components/ui/AsyncSelect";
import {
  useCreateModifier,
  useGetModifierGroups,
  useUpdateModifier,
} from "@/hooks/useMenus";

interface ModifierForm {
  modifierGroupId: string;
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

  const [selectedGroup, setSelectedGroup] = useState<any>(null);
const [groupSearch, setGroupSearch] = useState("");
const [debouncedGroupSearch, setDebouncedGroupSearch] = useState("");
const [groupPage, setGroupPage] = useState(1);
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedGroupSearch(groupSearch.trim());
    setGroupPage(1);
  }, 500);

  return () => clearTimeout(timer);
}, [groupSearch]);

  const [form, setForm] = useState<ModifierForm>({
    modifierGroupId: "",
    name: "",
    priceDelta: 0,
    sortOrder: 0,
  });

  const isSubmitting = isCreating || isUpdating;

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      setForm({
        modifierGroupId: String(initialData.modifierGroupId || ""),
        name: initialData.name || "",
        priceDelta: Number(initialData.priceDelta || 0),
        sortOrder: Number(initialData.sortOrder || 0),
      });

      setSelectedGroup(
        initialData.modifierGroup
          ? {
              id: initialData.modifierGroup.id,
              name: initialData.modifierGroup.name,
            }
          : initialData.modifierGroupId
          ? {
              id: initialData.modifierGroupId,
              name: initialData.modifierGroupName || "Selected Group",
            }
          : null
      );
    } else {
      setForm({
        modifierGroupId: "",
        name: "",
        priceDelta: 0,
        sortOrder: 0,
      });
      setSelectedGroup(null);
    }
  }, [initialData, open]);

const {
  data: groupResponse,
  isLoading: isGroupsLoading,
} = useGetModifierGroups({
  page: groupPage,
  limit: 10,
  search: debouncedGroupSearch,
});
  const groupItems = useMemo(() => {
  if (!groupResponse) return [];

  return (
    groupResponse?.data?.items ||
    groupResponse?.data?.modifierGroups ||
    groupResponse?.data ||
    groupResponse?.items ||
    []
  );
}, [groupResponse]);

const groupMeta = useMemo(() => {
  const source =
    groupResponse?.data?.pagination ||
    groupResponse?.pagination ||
    groupResponse?.meta ||
    {};

  return {
    page: Number(source?.page ?? groupPage),
    totalPages: Number(source?.totalPages ?? 1),
  };
}, [groupResponse, groupPage]);

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

    return {
      data: res?.data || [],
      meta: res?.meta || {},
    };
  };

  const handleChange = (key: keyof ModifierForm, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const canSubmit = useMemo(() => {
    return !!form.name?.trim() && !!form.modifierGroupId;
  }, [form.name, form.modifierGroupId]);

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
        };

        await updateModifier({
          id: initialData.id,
          data: payload,
        });

        toast.success("Updated");
      } else {
        const payload = {
          modifierGroupId: form.modifierGroupId,
          name: form.name.trim(),
          priceDelta: Number(form.priceDelta),
          sortOrder: Number(form.sortOrder),
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
      <DialogContent className="max-w-[420px] rounded-[20px] p-6 bg-[#F5F5F5]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {initialData ? "Edit" : "Add"} Modifier
          </DialogTitle>

          <p className="text-sm text-gray-500">
            Configure this modifier details
          </p>
        </DialogHeader>

        <div className="mt-5 bg-white rounded-[16px] p-5 space-y-4">
          {/* GROUP */}
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Modifier Group</p>

            <AsyncSelect
              value={selectedGroup}
              onChange={(group) => {
                setSelectedGroup(group);
                handleChange("modifierGroupId", String(group?.id || ""));
              }}
              placeholder="Select Group"
              fetchOptions={fetchModifierGroups}
              labelKey="name"
              valueKey="id"
            />
          </div>

          {/* NAME */}
          <InputField
            label="Modifier Name"
            value={form.name}
            onChange={(v: string) => handleChange("name", v)}
          />

          {/* PRICE */}
          <InputField
            label="Price Delta"
            type="number"
            value={form.priceDelta}
            onChange={(v: string) =>
              handleChange("priceDelta", Number(v))
            }
          />

          {/* SORT */}
          <InputField
            label="Sort Order"
            type="number"
            value={form.sortOrder}
            onChange={(v: string) =>
              handleChange("sortOrder", Number(v))
            }
          />

          {/* BUTTON */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full rounded-[10px] mt-2 py-4 bg-primary"
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
        className="w-full h-[40px] rounded-[10px] border border-gray-300 px-3 focus:border-gray-400 outline-none"
      />
    </div>
  );
}