"use client";

import React, { forwardRef, useImperativeHandle, useState } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  blockInvalidNumberKeys,
  blockNegativeNumberPaste,
  sanitizeNonNegativeNumber,
} from "@/utils/numberInput";
import ImageDropzoneUpload from "@/components/ui/ImageDropzoneUpload";

type Field = keyof z.infer<typeof schema>;

const schema = z.object({
  prepTimeMinutes: z.string().optional(),
  ingredients: z.string().optional(),
  nutritionalInformation: z.string().optional(),
  deliveryPriceAdjustment: z.string().optional(),
  takeawayPriceAdjustment: z.string().optional(),
  depositAmount: z.string().optional(),
});

const StepTwo = forwardRef(({ form, setForm }: any, ref: any) => {
  const [errors, setErrors] = useState<any>({});
  const [imageUploading, setImageUploading] = useState(false);

  const update = (key: string, value: string | boolean) => {
    setForm((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleImagePreviewChange = (previewUrl: string) => {
    setForm((prev: any) => {
      if (
        prev.imagePreview?.startsWith("blob:") &&
        prev.imagePreview !== previewUrl
      ) {
        URL.revokeObjectURL(prev.imagePreview);
      }

      return {
        ...prev,
        imagePreview: previewUrl,
      };
    });
  };

  const handleImageUrlChange = (fileUrl: string) => {
    setForm((prev: any) => ({
      ...prev,
      imageUrl: fileUrl,
    }));
  };

  const handleClearImage = () => {
    setForm((prev: any) => {
      if (prev.imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(prev.imagePreview);
      }

      return {
        ...prev,
        imageUrl: "",
        imagePreview: "",
      };
    });
  };

  const validateField = (field: Field, value: any) => {
    try {
      if (
        [
          "prepTimeMinutes",
          "deliveryPriceAdjustment",
          "takeawayPriceAdjustment",
          "depositAmount",
        ].includes(field) &&
        (value === "" || value === null || value === undefined)
      ) {
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
    if (imageUploading) {
      toast.error("Please wait until image upload is complete");
      return false;
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
      <ImageDropzoneUpload
        label="Image"
        value={form.imageUrl}
        previewUrl={form.imagePreview}
        onChange={handleImageUrlChange}
        onPreviewChange={handleImagePreviewChange}
        onClear={handleClearImage}
        onUploadingChange={setImageUploading}
        previewAlt="Item image preview"
      />

      <div className="space-y-2">
        <Label>Preparation Time (minutes) - Optional</Label>

        <Input
          type="number"
          min={0}
          value={form.prepTimeMinutes || ""}
          onKeyDown={blockInvalidNumberKeys}
          onPaste={blockNegativeNumberPaste}
          onChange={(e) =>
            update("prepTimeMinutes", sanitizeNonNegativeNumber(e.target.value))
          }
          onBlur={(e) =>
            validateField(
              "prepTimeMinutes",
              sanitizeNonNegativeNumber(e.target.value)
            )
          }
          placeholder="Enter preparation time if applicable"
          className="h-[44px] rounded-[12px] border-gray-300 focus:border-gray-400"
        />

        {errors.prepTimeMinutes && (
          <p className="text-xs text-red-500">{errors.prepTimeMinutes}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Delivery Price Adjustment</Label>

        <Input
          type="number"
          min={0}
          value={form.deliveryPriceAdjustment || ""}
          onKeyDown={blockInvalidNumberKeys}
          onPaste={blockNegativeNumberPaste}
          onChange={(e) =>
            update(
              "deliveryPriceAdjustment",
              sanitizeNonNegativeNumber(e.target.value)
            )
          }
          onBlur={(e) =>
            validateField(
              "deliveryPriceAdjustment",
              sanitizeNonNegativeNumber(e.target.value)
            )
          }
          placeholder="0"
          className="h-[44px] rounded-[12px] border-gray-300 focus:border-gray-400"
        />

        {errors.deliveryPriceAdjustment && (
          <p className="text-xs text-red-500">
            {errors.deliveryPriceAdjustment}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Takeaway Price Adjustment</Label>

        <Input
          type="number"
          min={0}
          value={form.takeawayPriceAdjustment || ""}
          onKeyDown={blockInvalidNumberKeys}
          onPaste={blockNegativeNumberPaste}
          onChange={(e) =>
            update(
              "takeawayPriceAdjustment",
              sanitizeNonNegativeNumber(e.target.value)
            )
          }
          onBlur={(e) =>
            validateField(
              "takeawayPriceAdjustment",
              sanitizeNonNegativeNumber(e.target.value)
            )
          }
          placeholder="0"
          className="h-[44px] rounded-[12px] border-gray-300 focus:border-gray-400"
        />

        {errors.takeawayPriceAdjustment && (
          <p className="text-xs text-red-500">
            {errors.takeawayPriceAdjustment}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Deposit Amount</Label>

        <Input
          type="number"
          min={0}
          value={form.depositAmount || ""}
          onKeyDown={blockInvalidNumberKeys}
          onPaste={blockNegativeNumberPaste}
          onChange={(e) =>
            update("depositAmount", sanitizeNonNegativeNumber(e.target.value))
          }
          onBlur={(e) =>
            validateField(
              "depositAmount",
              sanitizeNonNegativeNumber(e.target.value)
            )
          }
          placeholder="0"
          className="h-[44px] rounded-[12px] border-gray-300 focus:border-gray-400"
        />

        {errors.depositAmount && (
          <p className="text-xs text-red-500">{errors.depositAmount}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Ingredients</Label>

        <Textarea
          value={form.ingredients || ""}
          placeholder="e.g. Chicken patty, lettuce, cheese, mayo"
          onChange={(e) =>
            setForm((prev: any) => ({
              ...prev,
              ingredients: e.target.value,
            }))
          }
          onBlur={(e) => validateField("ingredients", e.target.value)}
          className="h-[90px] rounded-[12px] border-gray-300 focus:border-gray-400"
        />

        {errors.ingredients && (
          <p className="text-xs text-red-500">{errors.ingredients}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Nutritional Information</Label>

        <Textarea
          value={form.nutritionalInformation || ""}
          placeholder="e.g. 450 kcal, 20g protein, 15g fat"
          onChange={(e) =>
            setForm((prev: any) => ({
              ...prev,
              nutritionalInformation: e.target.value,
            }))
          }
          onBlur={(e) =>
            validateField("nutritionalInformation", e.target.value)
          }
          className="h-[90px] rounded-[12px] border-gray-300 focus:border-gray-400"
        />

        {errors.nutritionalInformation && (
          <p className="text-xs text-red-500">
            {errors.nutritionalInformation}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Dietary Flags</Label>

        <Input
          value={form.dietaryFlags || ""}
          onChange={(e) => update("dietaryFlags", e.target.value)}
          placeholder="e.g. halal, vegan, gluten-free"
          className="h-[44px] rounded-[12px] border-gray-300 focus:border-gray-400"
        />
      </div>

      <div className="space-y-2">
        <Label>Allergen Flags</Label>

        <Input
          value={form.allergenFlags || ""}
          onChange={(e) => update("allergenFlags", e.target.value)}
          placeholder="e.g. nuts, dairy, soy"
          className="h-[44px] rounded-[12px] border-gray-300 focus:border-gray-400"
        />
      </div>

      <div className="flex items-center gap-6 pt-2 text-sm text-gray-600">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={form.isActive !== false}
            onChange={(e) => update("isActive", e.target.checked)}
            className="accent-primary"
          />
          Active
        </label>
      </div>
    </div>
  );
});

StepTwo.displayName = "StepTwo";

export default StepTwo;