"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2 } from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
} from "react";
import { useAuth } from "@/hooks/useAuth";
import useApi from "@/hooks/useApi";
import { toast } from "sonner";
import { useCreateModifier, useUpdateModifier } from "@/hooks/useMenus";
import AsyncSelect from "@/components/ui/AsyncSelect";
import {
  blockInvalidNumberKeys,
  blockNegativeNumberPaste,
  sanitizeNonNegativeNumber,
} from "@/utils/numberInput";

interface ModifierForm {
  modifierGroupIds: string[];
  name: string;
  priceDelta: string;
  sortOrder: number;
}

const SORT_ORDER_OPTIONS = [
  { label: "Top Priority", value: 0 },
  { label: "High Priority", value: 10 },
  { label: "Medium Priority", value: 50 },
  { label: "Low Priority", value: 100 },
];

const getEmptyForm = (): ModifierForm => ({
  modifierGroupIds: [],
  name: "",
  priceDelta: "0",
  sortOrder: 0,
});

export default function ModifierModal({
  open,
  onOpenChange,
  initialData,
  refresh,
}: any) {
  const { token, restaurantId: authRestaurantId } = useAuth();
  const restaurantId = authRestaurantId ?? undefined;

  const api = useApi(token);

  const { mutateAsync: createModifier, isPending: isCreating } =
    useCreateModifier();

  const { mutateAsync: updateModifier, isPending: isUpdating } =
    useUpdateModifier();

  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [form, setForm] = useState<ModifierForm>(getEmptyForm());

  const isSubmitting = isCreating || isUpdating;

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      const resolvedGroup =
        initialData?.modifierGroup ||
        initialData?.modifierGroups?.[0] ||
        initialData?.groupLinks?.[0]?.modifierGroup ||
        (initialData?.modifierGroupId
          ? {
              id: initialData.modifierGroupId,
              name: initialData.modifierGroupName || "Selected Group",
            }
          : null);

      const resolvedGroupId = resolvedGroup?.id
        ? String(resolvedGroup.id)
        : initialData?.modifierGroupIds?.[0]
        ? String(initialData.modifierGroupIds[0])
        : "";

      setSelectedGroup(
        resolvedGroupId
          ? {
              id: resolvedGroupId,
              name: resolvedGroup?.name || "Selected Group",
            }
          : null
      );

      setForm({
        modifierGroupIds: resolvedGroupId ? [resolvedGroupId] : [],
        name: initialData.name || "",
        priceDelta: sanitizeNonNegativeNumber(
          String(initialData.priceDelta ?? 0)
        ),
        sortOrder: Number(initialData.sortOrder || 0),
      });

      return;
    }

    setSelectedGroup(null);
    setForm(getEmptyForm());
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

    if (restaurantId) {
      params.set("restaurantId", String(restaurantId));
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
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNumberChange = (key: "priceDelta", value: string) => {
    handleChange(key, sanitizeNonNegativeNumber(value));
  };

  const canSubmit = useMemo(() => {
    return Boolean(form.name?.trim() && form.modifierGroupIds.length > 0);
  }, [form.name, form.modifierGroupIds]);

  const handleSubmit = async () => {
    if (!canSubmit) {
      toast.error("Required fields missing");
      return;
    }

    const priceDelta = Number(form.priceDelta);
    const sortOrder = Number(form.sortOrder);

    if (form.priceDelta === "" || Number.isNaN(priceDelta)) {
      toast.error("Price delta must be a valid number");
      return;
    }

    if (priceDelta < 0) {
      toast.error("Price delta cannot be negative");
      return;
    }

    if (Number.isNaN(sortOrder)) {
      toast.error("Display priority must be a valid number");
      return;
    }

    try {
      const modifierPayload = {
        name: form.name.trim(),
        priceDelta,
        sortOrder,
        modifierGroupIds: form.modifierGroupIds,
      };

      if (initialData?.id) {
        await updateModifier({
          id: initialData.id,
          data: modifierPayload,
        });
      } else {
        await createModifier(modifierPayload);
      }

      refresh?.();
      onOpenChange(false);
    } catch {
      toast.error("Failed to save modifier");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!isSubmitting) {
          onOpenChange(value);
        }
      }}
    >
      <DialogContent className="max-h-[95vh] max-w-[520px] overflow-auto rounded-[20px] bg-[#F5F5F5] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {initialData ? "Edit" : "Add"} Modifier
          </DialogTitle>

          <p className="text-sm text-gray-500">
            Configure modifier details and assign it to a modifier group.
          </p>
        </DialogHeader>

        <div className="mt-5 space-y-4 rounded-[16px] bg-white p-5">
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Modifier Group</p>

            <AsyncSelect
              value={selectedGroup}
              onChange={(group) => {
                setSelectedGroup(group);

                handleChange(
                  "modifierGroupIds",
                  group?.id ? [String(group.id)] : []
                );
              }}
              placeholder="Select Group"
              fetchOptions={fetchModifierGroups}
              labelKey="name"
              valueKey="id"
            />
          </div>

          <InputField
            label="Modifier Name"
            value={form.name}
            onChange={(value: string) => handleChange("name", value)}
          />

          <InputField
            label="Price Delta"
            type="number"
            value={form.priceDelta}
            onChange={(value: string) => handleNumberChange("priceDelta", value)}
            onKeyDown={blockInvalidNumberKeys}
            onPaste={blockNegativeNumberPaste}
            min={0}
          />

          <div className="space-y-2">
            <p className="text-sm text-gray-600">Display Priority</p>

            <div className="relative">
              <select
                value={String(form.sortOrder)}
                onChange={(e) =>
                  handleChange("sortOrder", Number(e.target.value))
                }
                className="h-[40px] w-full appearance-none rounded-[10px] border border-gray-300 bg-white px-3 pr-10 text-sm outline-none focus:border-gray-400"
              >
                {SORT_ORDER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <div className="pointer-events-none absolute right-0 top-0 flex h-full w-10 items-center justify-center rounded-r-[10px] bg-primary">
                <ChevronDown size={16} className="text-white" />
              </div>
            </div>

            <p className="text-xs text-gray-500">
              Top priority modifiers appear first inside their group.
            </p>
          </div>

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

interface InputFieldProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value" | "type"
  > {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  className = "",
  ...inputProps
}: InputFieldProps) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-gray-600">{label}</p>

      <input
        type={type}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        className={`
          h-[40px]
          w-full
          rounded-[10px]
          border
          border-gray-300
          px-3
          outline-none
          focus:border-gray-400
          ${className}
        `}
        {...inputProps}
      />
    </div>
  );
}