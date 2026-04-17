"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import {
  useCreateModifierGroup,
  useUpdateModifierGroup,
} from "@/hooks/useMenus";

/* ================= TYPES ================= */
interface ModifierGroupForm {
  name: string;
  description: string;
  minSelect: number;
  maxSelect: number;
  isRequired: boolean;
  sortOrder: number;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: any;
  refresh: () => void;
}

const getDefaultForm = (): ModifierGroupForm => ({
  name: "",
  description: "",
  minSelect: 0,
  maxSelect: 1,
  isRequired: false,
  sortOrder: 0,
});

export default function ModifierGroupModal({
  open,
  onOpenChange,
  initialData,
  refresh,
}: Props) {
  const { user } = useAuth();

  const [form, setForm] = useState<ModifierGroupForm>(getDefaultForm());

  const { mutate: createModifierGroup, isPending: isCreating } =
    useCreateModifierGroup();

  const { mutate: updateModifierGroup, isPending: isUpdating } =
    useUpdateModifierGroup();

  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData?.name || "",
        description: initialData?.description || "",
        minSelect: Number(initialData?.minSelect ?? 0),
        maxSelect: Number(initialData?.maxSelect ?? 1),
        isRequired: Boolean(initialData?.isRequired),
        sortOrder: Number(initialData?.sortOrder ?? 0),
      });
    } else {
      setForm(getDefaultForm());
    }
  }, [initialData, open]);

  const handleChange = <K extends keyof ModifierGroupForm>(
    key: K,
    value: ModifierGroupForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleClose = (value: boolean) => {
    onOpenChange(value);
    if (!value) {
      setForm(getDefaultForm());
    }
  };


 
  const handleSubmit = () => {
  if (!form.name.trim()) {
    toast.error("Name required");
    return;
  }

  if (form.minSelect < 0) {
    toast.error("Min select cannot be negative");
    return;
  }

  if (form.maxSelect < 0) {
    toast.error("Max select cannot be negative");
    return;
  }

  if (form.maxSelect < form.minSelect) {
    toast.error("Max select cannot be less than min select");
    return;
  }

  // Prepare payload, conditionally exclude restaurantId if editing
  const payload: any = {
    name: form.name.trim(),
    description: form.description.trim(),
    minSelect: Number(form.minSelect),
    maxSelect: Number(form.maxSelect),
    isRequired: form.isRequired,
    sortOrder: Number(form.sortOrder),
  };

  if (!initialData?.id) {
    // Add restaurantId only when creating
    payload.restaurantId = user?.restaurantId || "";
  }

  let res;

  if (initialData?.id) {
    res = updateModifierGroup(
      {
        id: initialData.id,
        data: payload,
      },
      {
        onSuccess: () => {
          refresh();
          handleClose(false);
        },
      }
    );
  } else {
    res = createModifierGroup(payload, {
      onSuccess: () => {
        refresh();
        handleClose(false);
      },
    });
  }

  toast.success(initialData ? "Updated" : "Created");

  refresh();
  handleClose(false);
};


  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[420px] rounded-[20px] p-6 bg-[#F5F5F5]">
        {/* HEADER */}
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {initialData ? "Edit" : "Add"} Modifier Group
          </DialogTitle>

          <p className="text-sm text-gray-500">
            Configure selection rules for this group
          </p>
        </DialogHeader>

        {/* FORM */}
        <div className="mt-5 bg-white rounded-[16px] p-5 space-y-4">
          <InputField
            label="Group Name"
            value={form.name}
            onChange={(v: string) => handleChange("name", v)}
          />

          <InputField
            label="Description"
            value={form.description}
            onChange={(v: string) => handleChange("description", v)}
          />

          <InputField
            label="Min Select"
            type="number"
            value={form.minSelect}
            onChange={(v: string) => handleChange("minSelect", Number(v))}
          />

          <InputField
            label="Max Select"
            type="number"
            value={form.maxSelect}
            onChange={(v: string) => handleChange("maxSelect", Number(v))}
          />

          <InputField
            label="Sort Order"
            type="number"
            value={form.sortOrder}
            onChange={(v: string) => handleChange("sortOrder", Number(v))}
          />

          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={form.isRequired}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("isRequired", e.target.checked)
              }
              className="accent-primary"
            />
            Required
          </label>

          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full rounded-[10px] mt-2 py-4 bg-primary"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                Saving...
              </span>
            ) : initialData ? (
              "Update Modifier Group"
            ) : (
              "Create Modifier Group"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ================= INPUT FIELD ================= */
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
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        className="w-full h-[40px] rounded-[10px] border border-gray-300 px-3 focus:border-gray-400 outline-none"
      />
    </div>
  );
}