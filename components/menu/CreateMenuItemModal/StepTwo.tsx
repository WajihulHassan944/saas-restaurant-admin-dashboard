"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
type Field = keyof z.infer<typeof schema>;

const schema = z.object({
  prepTimeMinutes: z.string().min(1, "Preparation time required"),
});

const StepTwo = forwardRef(({ form, setForm }: any, ref: any) => {
  const [errors, setErrors] = useState<any>({});

  const update = (key: string, value: string) => {
    setForm((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };


const validateField = (field: Field, value: any) => {
  try {
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

      <div className="space-y-2">
        <Label>Image URL</Label>

        <Input
          value={form.imageUrl || ""}
          onChange={(e) => update("imageUrl", e.target.value)}
          className="h-[44px] rounded-[12px] border-gray-300 focus:border-gray-400"
        />
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
        <Label>Preparation Time (minutes)</Label>

        <Input
          type="number"
          value={form.prepTimeMinutes || ""}
          onChange={(e) => update("prepTimeMinutes", e.target.value)}
          onBlur={(e) => validateField("prepTimeMinutes", e.target.value)}
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