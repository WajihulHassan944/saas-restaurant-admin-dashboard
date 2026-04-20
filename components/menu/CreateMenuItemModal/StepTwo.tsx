"use client";

import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFileUpload } from "@/hooks/useFileUpload";
import { toast } from "sonner";
import { ImagePlus, UploadCloud, X } from "lucide-react";

type Field = keyof z.infer<typeof schema>;

const schema = z.object({
  prepTimeMinutes: z.string().optional(),
});
const StepTwo = forwardRef(({ form, setForm }: any, ref: any) => {
  const [errors, setErrors] = useState<any>({});
  const [isDragging, setIsDragging] = useState(false);
const fileInputRef = useRef<HTMLInputElement | null>(null);
const { uploadFile, uploading } = useFileUpload();
  const update = (key: string, value: string) => {
    setForm((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };


  const processImageFile = async (file: File) => {
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    toast.error("Please upload a valid image file");
    return;
  }

  const previewUrl = URL.createObjectURL(file);

  setForm((prev: any) => {
    if (prev.imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(prev.imagePreview);
    }

    return {
      ...prev,
      imagePreview: previewUrl,
    };
  });

  const syntheticEvent = {
    target: {
      files: [file],
    },
  } as unknown as React.ChangeEvent<HTMLInputElement>;

  const result = await uploadFile(syntheticEvent);

  if (result?.fileUrl) {
    setForm((prev: any) => ({
      ...prev,
      imageUrl: result.fileUrl,
    }));
  } else {
    toast.error("Image upload failed");
  }
};

const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  setIsDragging(true);
};

const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  setIsDragging(false);
};

const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  setIsDragging(false);

  const file = e.dataTransfer.files?.[0];
  if (!file) return;

  await processImageFile(file);
};

const openFilePicker = () => {
  fileInputRef.current?.click();
};
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  await processImageFile(file);
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


 
 <div className="space-y-3">
  <Label>Image</Label>

  {form.imagePreview ? (
    <div className="relative overflow-hidden rounded-[18px] border border-gray-200 bg-white shadow-sm">
      <img
        src={form.imagePreview}
        alt="Preview"
        className="h-52 w-full object-cover"
      />

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/65 via-black/20 to-transparent px-4 py-3">
        <div>
          <p className="text-sm font-medium text-white">Image uploaded</p>
          <p className="text-xs text-white/80">
            Drag & drop another image to replace it
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setForm((prev: any) => ({
              ...prev,
              imageUrl: "",
              imagePreview: "",
            }))
          }
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30"
        >
          <X size={14} />
        </button>
      </div>

      <div
        onClick={openFilePicker}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`absolute inset-0 cursor-pointer transition ${
          isDragging ? "bg-primary/10 ring-2 ring-primary ring-inset" : ""
        }`}
      />
    </div>
  ) : (
    <div
      onClick={openFilePicker}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`group relative overflow-hidden rounded-[18px] border border-dashed bg-white px-6 py-8 text-center transition-all duration-200 cursor-pointer ${
        isDragging
          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
          : "border-gray-300 hover:border-primary/50 hover:bg-gray-50"
      }`}
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F9FAFB] text-primary shadow-sm">
        {isDragging ? <UploadCloud size={24} /> : <ImagePlus size={24} />}
      </div>

      <div className="mt-4 space-y-1">
        <p className="text-sm font-semibold text-dark">
          Drag & drop your image here
        </p>
        <p className="text-xs text-gray-500">
          or <span className="text-primary font-medium">click to browse</span>
        </p>
        <p className="text-[11px] text-gray-400">
          PNG, JPG, WEBP up to 10MB
        </p>
      </div>
    </div>
  )}

  <Input
    ref={fileInputRef}
    type="file"
    accept="image/*"
    onChange={handleImageUpload}
    className="hidden"
  />

  {uploading && <p className="text-xs text-gray-500">Uploading image...</p>}
</div>

      {/* <div className="space-y-2">
        <Label>Slug</Label>

        <Input
          value={form.slug || ""}
          onChange={(e) => update("slug", e.target.value)}
          className="h-[44px] rounded-[12px] border-gray-300 focus:border-gray-400"
        />
      </div> */}

      {/* <div className="space-y-2">
        <Label>SKU</Label>

        <Input
          value={form.sku || ""}
          onChange={(e) => update("sku", e.target.value)}
          className="h-[44px] rounded-[12px] border-gray-300 focus:border-gray-400"
        />
      </div> */}

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