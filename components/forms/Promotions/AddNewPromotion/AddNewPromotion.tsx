"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import FormInput from "@/components/register/form/FormInput";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import PageWrapper from "@/components/forms/Promotions/PageWrapper";
import Section from "@/components/forms/Promotions/Section";
import AsyncSelect from "@/components/ui/AsyncSelect";

import { useAuth } from "@/hooks/useAuth";
import {
  useCreateAdminPromotionCampaign,
  useGetAdminPromotionCampaignDetail,
  useUpdateAdminPromotionCampaign,
} from "@/hooks/usePromotions";

import { getMenuItems } from "@/services/menus";
import { getMenuCategories } from "@/services/categories";

type DiscountType = "FLAT" | "PERCENTAGE";

type FormState = {
  code: string;
  title: string;
  description: string;
  discountType: DiscountType;
  discountValue: string;
  maxDiscountAmount: string;
  minOrderAmount: string;
  maxUses: string;
  maxUsesPerCustomer: string;
  startsAt: string;
  expiresAt: string;
  isActive: boolean;
  assignPermanently: boolean;
};

const initialForm: FormState = {
  code: "",
  title: "",
  description: "",
  discountType: "FLAT",
  discountValue: "",
  maxDiscountAmount: "",
  minOrderAmount: "",
  maxUses: "",
  maxUsesPerCustomer: "",
  startsAt: "",
  expiresAt: "",
  isActive: true,
  assignPermanently: false,
};

const toDatetimeLocal = (value?: string | null) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);

  return localDate.toISOString().slice(0, 16);
};

const toISOStringOrNull = (value: string) => {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date.toISOString();
};

const toNumber = (value: string) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const normalizeDetail = (response: any) => {
  return response?.data?.data ?? response?.data ?? response ?? null;
};

export default function AddNewPromotion() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const isEditMode = Boolean(id);

  const { user, restaurantId } = useAuth();

  const branchId = user?.branchId ?? "";

  const [form, setForm] = useState<FormState>(initialForm);
  const [selectedMenuItem, setSelectedMenuItem] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

const {
  data: detailResponse,
  isLoading: detailLoading,
} = useGetAdminPromotionCampaignDetail(id ?? undefined, {
  restaurantId,
  branchId,
});

  const createMutation = useCreateAdminPromotionCampaign();
  const updateMutation = useUpdateAdminPromotionCampaign();

  const submitting = createMutation.isPending || updateMutation.isPending;

  const pageTitle = isEditMode ? "Update Promotion" : "Add New Promotion";

  useEffect(() => {
    if (!isEditMode || !detailResponse) return;

    const detail = normalizeDetail(detailResponse);

    if (!detail) return;

    setForm({
      code: detail.code ?? "",
      title: detail.title ?? "",
      description: detail.description ?? "",
      discountType: detail.discountType ?? "FLAT",
      discountValue: String(detail.discountValue ?? ""),
      maxDiscountAmount: String(detail.maxDiscountAmount ?? ""),
      minOrderAmount: String(detail.minOrderAmount ?? ""),
      maxUses: String(detail.maxUses ?? ""),
      maxUsesPerCustomer: String(detail.maxUsesPerCustomer ?? ""),
      startsAt: toDatetimeLocal(detail.startsAt),
      expiresAt: toDatetimeLocal(detail.expiresAt),
      isActive: Boolean(detail.isActive),
      assignPermanently: !detail.expiresAt,
    });

    if (detail.scopeMenuItem) {
      setSelectedMenuItem(detail.scopeMenuItem);
    } else if (detail.scopeMenuItemId) {
      setSelectedMenuItem({
        id: detail.scopeMenuItemId,
        name: detail.scopeMenuItem?.name ?? "Selected Menu Item",
      });
    }

    if (detail.scopeCategory) {
      setSelectedCategory(detail.scopeCategory);
    } else if (detail.scopeCategoryId) {
      setSelectedCategory({
        id: detail.scopeCategoryId,
        name: detail.scopeCategory?.name ?? "Selected Category",
      });
    }
  }, [detailResponse, isEditMode]);

  const updateField = <K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

const fetchMenuItemOptions = async ({
  search,
  page,
}: {
  search: string;
  page: number;
}) => {
  return getMenuItems({
    page,
    limit: 10,
    search,
    restaurantId: restaurantId ?? undefined,
  });
};
  const fetchCategoryOptions = async ({
    search,
    page,
  }: {
    search: string;
    page: number;
  }) => {
    return getMenuCategories({
      page,
      limit: 10,
      search,
      restaurantId: restaurantId ?? undefined,
    });
  };

  const payload = useMemo(() => {
    return {
      code: form.code.trim(),
      title: form.title.trim(),
      description: form.description.trim(),
      restaurantId,
      branchId: branchId || null,
      discountType: form.discountType,
      discountValue: toNumber(form.discountValue),
      maxDiscountAmount: toNumber(form.maxDiscountAmount),
      minOrderAmount: toNumber(form.minOrderAmount),
      maxUses: toNumber(form.maxUses),
      maxUsesPerCustomer: toNumber(form.maxUsesPerCustomer),
      startsAt: toISOStringOrNull(form.startsAt),
      expiresAt: form.assignPermanently
        ? null
        : toISOStringOrNull(form.expiresAt),
      scopeMenuItemId: selectedMenuItem?.id ?? null,
      scopeCategoryId: selectedCategory?.id ?? null,
      isActive: form.isActive,
    };
  }, [form, restaurantId, branchId, selectedMenuItem, selectedCategory]);

  const validateForm = () => {
    if (!restaurantId) {
      toast.error("Restaurant ID is missing.");
      return false;
    }

    if (!form.code.trim()) {
      toast.error("Promotion code is required.");
      return false;
    }

    if (!form.title.trim()) {
      toast.error("Offer title is required.");
      return false;
    }

    if (!form.discountValue || Number(form.discountValue) <= 0) {
      toast.error("Discount value must be greater than 0.");
      return false;
    }

    if (!form.startsAt) {
      toast.error("Start date is required.");
      return false;
    }

    if (!form.assignPermanently && !form.expiresAt) {
      toast.error("Expiry date is required.");
      return false;
    }

    if (
      !form.assignPermanently &&
      new Date(form.expiresAt).getTime() <= new Date(form.startsAt).getTime()
    ) {
      toast.error("Expiry date must be after start date.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      if (isEditMode && id) {
        await updateMutation.mutateAsync({
          id,
          payload,
        });

        toast.success("Promotion updated successfully.");
      } else {
        await createMutation.mutateAsync(payload);

        toast.success("Promotion created successfully.");
      }

      router.push("/promotion-management");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong."
      );
    }
  };

  if (detailLoading && isEditMode) {
    return (
      <PageWrapper title={pageTitle}>
        <div className="flex min-h-[300px] items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title={pageTitle}>
      <form onSubmit={handleSubmit} className="space-y-8">
        <Section label="Setup Basic Info">
        <FormInput
  label="Promotion Code *"
  placeholder="eg. SUMMER20"
  value={form.code}
  onChange={(val) => updateField("code", val)}
/>

          <FormInput
            label="Offer Title *"
            placeholder="eg. 20% Off On Orders"
            value={form.title}
             onChange={(val) => updateField("title", val)}
          />

          <div className="space-y-2">
            <Label>Description</Label>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Write promotion description"
              className="min-h-[110px] w-full rounded-md border border-[#BBBBBB] px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label>Discount Type *</Label>
              <select
                value={form.discountType}
                onChange={(e) =>
                  updateField("discountType", e.target.value as DiscountType)
                }
                className="h-[44px] w-full rounded-md border border-[#BBBBBB] bg-white px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="FLAT">Flat Discount</option>
                <option value="PERCENTAGE">Percentage Discount</option>
              </select>
            </div>

            <FormInput
              label="Discount Value *"
              type="number"
              placeholder="eg. 20"
              value={form.discountValue}
              onChange={(val) => updateField("discountValue", val)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormInput
              label="Minimum Order Amount"
              type="number"
              placeholder="eg. 100"
              value={form.minOrderAmount}
              onChange={(val) => updateField("minOrderAmount", val)}
            />

            <FormInput
              label="Maximum Discount Amount"
              type="number"
              placeholder="eg. 50"
              value={form.maxDiscountAmount}
              onChange={(val) => updateField("maxDiscountAmount", val)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormInput
              label="Maximum Uses"
              type="number"
              placeholder="eg. 100"
              value={form.maxUses}
             onChange={(val) => updateField("maxUses", val)}
            />

            <FormInput
              label="Maximum Uses Per Customer"
              type="number"
              placeholder="eg. 1"
              value={form.maxUsesPerCustomer}
              onChange={(val) => updateField("maxUsesPerCustomer", val)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label>Starts At *</Label>
              <Input
                type="datetime-local"
                value={form.startsAt}
                onChange={(e) => updateField("startsAt", e.target.value)}
                className="h-[44px] border-[#BBBBBB] focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label>Expires At *</Label>
              <Input
                type="datetime-local"
                value={form.expiresAt}
                disabled={form.assignPermanently}
                onChange={(e) => updateField("expiresAt", e.target.value)}
                className="h-[44px] border-[#BBBBBB] focus:border-primary focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:bg-gray-100"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-600">
            <Checkbox
              checked={form.assignPermanently}
              onCheckedChange={(checked) =>
                updateField("assignPermanently", Boolean(checked))
              }
            />
            Assign this offer permanently
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-600">
            <Checkbox
              checked={form.isActive}
              onCheckedChange={(checked) =>
                updateField("isActive", Boolean(checked))
              }
            />
            Active promotion
          </label>
        </Section>

        <Section label="Promotion Scope">
          <div className="space-y-2">
            <Label className="text-[16px]">Select Food Item</Label>
            <p className="text-sm text-gray-500">
              Select a specific food item if this promotion should only apply to
              one item.
            </p>

            <AsyncSelect
              value={selectedMenuItem}
              onChange={(value) => {
                setSelectedMenuItem(value);
                setSelectedCategory(null);
              }}
              placeholder="Search food item"
              fetchOptions={fetchMenuItemOptions}
              labelKey="name"
              valueKey="id"
            />

            {selectedMenuItem && (
              <button
                type="button"
                onClick={() => setSelectedMenuItem(null)}
                className="text-sm text-primary"
              >
                Clear selected food item
              </button>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-[16px]">Select Food Category</Label>
            <p className="text-sm text-gray-500">
              Select a category if this promotion should apply to all food items
              inside a category.
            </p>

            <AsyncSelect
              value={selectedCategory}
              onChange={(value) => {
                setSelectedCategory(value);
                setSelectedMenuItem(null);
              }}
              placeholder="Search category"
              fetchOptions={fetchCategoryOptions}
              labelKey="name"
              valueKey="id"
            />

            {selectedCategory && (
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className="text-sm text-primary"
              >
                Clear selected category
              </button>
            )}
          </div>

          <p className="text-sm text-gray-500">
            Leave both fields empty if the promotion applies to the whole
            restaurant.
          </p>
        </Section>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={submitting}
            className="h-[44px] rounded-lg border px-6 text-sm font-medium text-gray-600 disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="h-[44px] rounded-lg bg-primary px-6 text-sm font-medium text-white disabled:opacity-60 inline-flex items-center gap-2"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {isEditMode ? "Update Promotion" : "Create Promotion"}
          </button>
        </div>
      </form>
    </PageWrapper>
  );
}