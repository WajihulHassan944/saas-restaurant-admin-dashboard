"use client";

import {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AsyncSelect from "@/components/ui/AsyncSelect";
import useApi from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";

const schema = z.object({
  name: z.string().min(1, "Item name is required"),
  categoryId: z.string().min(1, "Category is required"),
  basePrice: z.string().min(1, "Price is required"),
});

type Field = keyof z.infer<typeof schema>;

const StepOne = forwardRef(({ form, setForm }: any, ref: any) => {
  const { token, user } = useAuth();
  const { get } = useApi(token);

  const [errors, setErrors] = useState<any>({});
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const restaurantId =
    user?.restaurantId ||
    (typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("auth") || "{}")?.user?.restaurantId
      : null);

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

  const fetchCategories = async ({
    search = "",
    page = 1,
  }: {
    search: string;
    page: number;
  }) => {
    if (!restaurantId) {
      return {
        data: [],
        meta: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrevious: false,
        },
      };
    }

    const params = new URLSearchParams({
      restaurantId: String(restaurantId),
      page: String(page),
      limit: "10",
    });

    if (search?.trim()) {
      params.set("search", search.trim());
    }

    const res = await get(`/v1/menu/categories?${params.toString()}`);

    const normalizedData = Array.isArray(res?.data)
      ? res.data
      : Array.isArray(res?.data?.data)
      ? res.data.data
      : Array.isArray(res?.data?.items)
      ? res.data.items
      : [];

    return {
      data: normalizedData,
      meta: res?.meta || res?.data?.meta || res?.data?.pagination || {},
    };
  };

  useEffect(() => {
    if (!form?.categoryId) {
      setSelectedCategory(null);
      return;
    }

    if (selectedCategory?.id && String(selectedCategory.id) === String(form.categoryId)) {
      return;
    }

    const loadSelectedCategory = async () => {
      try {
        const res = await fetchCategories({
          search: "",
          page: 1,
        });

        const matched = res?.data?.find(
          (cat: any) => String(cat.id) === String(form.categoryId)
        );

        if (matched) {
          setSelectedCategory(matched);
        } else if (form?.categoryId) {
          setSelectedCategory({
            id: form.categoryId,
            name: form?.category?.name || "Selected Category",
          });
        }
      } catch (error) {
        console.error("Failed to load selected category", error);
      }
    };

    loadSelectedCategory();
  }, [form?.categoryId]);

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Item Name</Label>

        <Input
          value={form.name}
          placeholder="eg. Burger"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          onBlur={(e) => validateField("name", e.target.value)}
          className="h-[44px] rounded-[12px] border-gray-300 focus:border-gray-400"
        />

        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label>Select Category</Label>

        <AsyncSelect
          value={selectedCategory}
          onChange={(val) => {
            setSelectedCategory(val);
            setForm((prev: any) => ({
              ...prev,
              categoryId: String(val?.id || ""),
            }));
            validateField("categoryId", String(val?.id || ""));
          }}
          placeholder="Select category"
          fetchOptions={fetchCategories}
          labelKey="name"
          valueKey="id"
        />

        {errors.categoryId && (
          <p className="text-xs text-red-500">{errors.categoryId}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Description</Label>

        <Textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="h-[90px] rounded-[12px] border-gray-300 focus:border-gray-400"
        />
      </div>

      <div className="space-y-2">
        <Label>Base Price</Label>

        <Input
          type="number"
          value={form.basePrice}
          onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
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

StepOne.displayName = "StepOne";

export default StepOne;