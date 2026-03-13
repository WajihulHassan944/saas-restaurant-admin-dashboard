"use client";

import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { z } from "zod";
import { API_BASE_URL } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
type Field = keyof z.infer<typeof schema>;
const schema = z.object({
  name: z.string().min(1, "Item name is required"),
  categoryId: z.string().min(1, "Category is required"),
  basePrice: z.string().min(1, "Price is required"),
});

const StepOne = forwardRef(({ form, setForm, token }: any, ref: any) => {
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch(`${API_BASE_URL}/v1/menu/categories`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setCategories(data.data || []);
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

      {/* NAME */}
      <div className="space-y-2">
        <Label>Item Name</Label>

        <Input
          value={form.name}
          placeholder="eg. Burger"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          onBlur={(e) => validateField("name", e.target.value)}
          className="h-[44px] rounded-[12px] border-gray-300 focus:border-gray-400"
        />

        {errors.name && (
          <p className="text-xs text-red-500">{errors.name}</p>
        )}
      </div>

      {/* CATEGORY */}
      <div className="space-y-2">
        <Label>Select Category</Label>

        <Select
          value={form.categoryId}
          onValueChange={(val) => {
            setForm((prev: any) => ({ ...prev, categoryId: val }));
            validateField("categoryId", val);
          }}
        >
          <SelectTrigger className="h-[44px] rounded-[12px] border-gray-300">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>

          <SelectContent>
            {categories.map((cat: any) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errors.categoryId && (
          <p className="text-xs text-red-500">{errors.categoryId}</p>
        )}
      </div>

      {/* DESCRIPTION */}
      <div className="space-y-2">
        <Label>Description</Label>

        <Textarea
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          className="h-[90px] rounded-[12px] border-gray-300 focus:border-gray-400"
        />
      </div>

      {/* PRICE */}
      <div className="space-y-2">
        <Label>Price</Label>

        <Input
          type="number"
          value={form.basePrice}
          onChange={(e) =>
            setForm({ ...form, basePrice: e.target.value })
          }
          onBlur={(e) => validateField("basePrice", e.target.value)}
          className="h-[44px] rounded-[12px] border-gray-300 focus:border-gray-400"
        />

        {errors.basePrice && (
          <p className="text-xs text-red-500">{errors.basePrice}</p>
        )}
      </div>
    </div>
  );
});

export default StepOne;