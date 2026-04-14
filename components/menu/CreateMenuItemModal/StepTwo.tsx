"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFileUpload } from "@/hooks/useFileUpload";
import { toast } from "sonner";
import { X } from "lucide-react";
type Field = keyof z.infer<typeof schema>;

const schema = z.object({
  prepTimeMinutes: z.string().optional(),
});
const StepTwo = forwardRef(({ form, setForm }: any, ref: any) => {
  const [errors, setErrors] = useState<any>({});
const { uploadFile, uploading } = useFileUpload();
  const update = (key: string, value: string) => {
    setForm((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // ✅ instant blob preview
  const previewUrl = URL.createObjectURL(file);

  setForm((prev: any) => ({
    ...prev,
    imagePreview: previewUrl,
  }));

  const result = await uploadFile(e);

  if (result?.fileUrl) {
    setForm((prev: any) => ({
      ...prev,
      imageUrl: result.fileUrl,
    }));
  }
};

const validateField = (field: Field, value: any) => {
  try {
    if (field === "prepTimeMinutes" && (value === "" || value === null || value === undefined)) {
      setErrors((prev: any) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
      return;
    }

    schema.shape[field].parse(value);

    setErrors((prev: any) => {
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  } catch (err: any) {
    setErrors((prev: any) => ({
      ...prev,
      [field]: err.errors?.[0]?.message || "Invalid value",
    }));
  }
};

const validateStep = () => {
  // ❌ block navigation while uploading
  if (uploading) {
    toast.error("Please wait until image upload is complete");
    return false;
  }

  if (!form.prepTimeMinutes || String(form.prepTimeMinutes).trim() === "") {
    setErrors((prev: any) => {
      const copy = { ...prev };
      delete copy.prepTimeMinutes;
      return copy;
    });
    return true;
  }

  const result = schema.safeParse(form);

  if (!result.success) {
    const fieldErrors: any = {};
    result.error.issues.forEach((err) => {
      fieldErrors[err.path[0]] = err.message;
    });

    setErrors(fieldErrors);
    return false;
  }

  setErrors({});
  return true;
};

  useImperativeHandle(ref, () => ({
    validateStep,
  }));

  return (
    <div className="space-y-5">
{form.imagePreview && (
  <div className="relative w-full">
    <img
      src={form.imagePreview}
      alt="Preview"
      className="h-40 w-full rounded-[14px] object-cover border"
    />

    <button
      type="button"
      onClick={() =>
        setForm((prev: any) => ({
          ...prev,
          imageUrl: "",
          imagePreview: "",
        }))
      }
      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
    >
      <X size={14} />
    </button>
  </div>
)}
   <div className="space-y-2">
  <Label>Image</Label>

  <Input
    type="file"
    accept="image/*"
    onChange={handleImageUpload}
    className="h-[44px] rounded-[12px] border-gray-300 focus:border-gray-400 pt-1"
  />

  {uploading && (
    <p className="text-xs text-gray-500">Uploading...</p>
  )}
  
</div>

      <div className="space-y-2">
        <Label>Slug</Label>

        <Input
          value={form.slug || ""}
          onChange={(e) => update("slug", e.target.value)}
          className="h-[44px] rounded-[12px] border-gray-300 focus:border-gray-400"
        />
      </div>

      <div className="space-y-2">
        <Label>SKU</Label>

        <Input
          value={form.sku || ""}
          onChange={(e) => update("sku", e.target.value)}
          className="h-[44px] rounded-[12px] border-gray-300 focus:border-gray-400"
        />
      </div>

      <div className="space-y-2">
     <Label>Preparation Time (minutes) - Optional</Label>

<Input
  type="number"
  value={form.prepTimeMinutes || ""}
  onChange={(e) => update("prepTimeMinutes", e.target.value)}
  onBlur={(e) => validateField("prepTimeMinutes", e.target.value)}
  placeholder="Enter preparation time if applicable"
  className="h-[44px] rounded-[12px] border-gray-300 focus:border-gray-400"
/>
        {errors.prepTimeMinutes && (
          <p className="text-xs text-red-500">{errors.prepTimeMinutes}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Dietary Flags</Label>

        <Input
          value={form.dietaryFlags || ""}
          onChange={(e) => update("dietaryFlags", e.target.value)}
          className="h-[44px] rounded-[12px] border-gray-300 focus:border-gray-400"
        />
      </div>

      <div className="space-y-2">
        <Label>Allergen Flags</Label>

        <Input
          value={form.allergenFlags || ""}
          onChange={(e) => update("allergenFlags", e.target.value)}
          className="h-[44px] rounded-[12px] border-gray-300 focus:border-gray-400"
        />
      </div>

    </div>
  );
});

export default StepTwo;