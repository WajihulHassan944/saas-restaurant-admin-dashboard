"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import FormInput from "@/components/register/form/FormInput";
import PageWrapper from "@/components/forms/Promotions/PageWrapper";
import Section from "@/components/forms/Promotions/Section";
import AdvanceSettings from "@/components/forms/Promotions/AdvanceSettings";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useApi from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AddNewCoupon() {
  const { token } = useAuth();
  const { get, post, patch } = useApi(token);
  const router = useRouter();
  const searchParams = useSearchParams();

  const couponCode = searchParams.get("coupon"); // ✅ detect edit mode

  const [saving, setSaving] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [couponId, setCouponId] = useState("");

  const [branches, setBranches] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);

  const [form, setForm] = useState<any>({
    code: "",
    title: "",
    discountType: "FLAT",
    discountValue: "",
    startsAt: "",
    expiresAt: "",
    description: "",
    branchId: "",
    maxDiscountAmount: "",
    minOrderAmount: "",
    maxUses: "",
    maxUsesPerCustomer: "",
    scopeMenuItemId: "",
    scopeCategoryId: "",
  });

  const getStoredAuth = () => {
    const stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored) : null;
  };

  // ✅ format ISO → datetime-local
  const formatDate = (date: string) => {
    if (!date) return "";
    return new Date(date).toISOString().slice(0, 16);
  };

  /* ================= FETCH BASE DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      const stored = getStoredAuth();
      const restaurantId = stored?.user?.restaurantId;

      if (!restaurantId || !token) return;

      try {
        const [branchRes, itemRes] = await Promise.all([
          get(`/v1/branches?restaurantId=${restaurantId}`),
          get(`/v1/menu/items?restaurantId=${restaurantId}`),
        ]);

        setBranches(branchRes || []);
        setItems(itemRes || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [token]);

  /* ================= FETCH EDIT DATA ================= */
  useEffect(() => {
    const fetchCoupon = async () => {
      if (!couponCode || !token) return;

      try {
        setIsEdit(true);

        const res = await get(`/v1/coupons?search=${couponCode}`);

        const coupon = res?.[0];
        if (!coupon) return;
console.log("coupon is", coupon);
        setCouponId(coupon.id);

        setForm({
          code: coupon.code || "",
          title: coupon.title || "",
          discountType: coupon.discountType || "FLAT",
          discountValue: coupon.discountValue || "",
          startsAt: formatDate(coupon.startsAt),
          expiresAt: formatDate(coupon.expiresAt),
          description: coupon.description || "",
          branchId: coupon.branchId || "",
          maxDiscountAmount: coupon.maxDiscountAmount || "",
          minOrderAmount: coupon.minOrderAmount || "",
          maxUses: coupon.maxUses || "",
          maxUsesPerCustomer: coupon.maxUsesPerCustomer || "",
          scopeMenuItemId: coupon.scopeMenuItemId || "",
          scopeCategoryId: coupon.scopeCategoryId || "",
        });

      } catch (err) {
        toast.error("Failed to fetch coupon");
      }
    };

    fetchCoupon();
  }, [couponCode, token]);
console.log("coupon id is", couponId)
  /* ================= HELPERS ================= */
  const updateField = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleItemSelect = (id: string) => {
    const item = items.find((i) => i.id === id);

    setForm((prev: any) => ({
      ...prev,
      scopeMenuItemId: id,
      scopeCategoryId: item?.categoryId || "",
    }));
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (saving) return;

    if (!form.code || !form.title) {
      toast.error("Required fields missing");
      return;
    }

    setSaving(true);

    const payload = {
      ...form,
      discountValue: Number(form.discountValue) || 0,
      maxDiscountAmount: Number(form.maxDiscountAmount) || 0,
      minOrderAmount: Number(form.minOrderAmount) || 0,
      maxUses: Number(form.maxUses) || 0,
      maxUsesPerCustomer: Number(form.maxUsesPerCustomer) || 0,
    };

    try {
      let res;

      if (isEdit) {
        // ✅ UPDATE
        res = await patch(`/v1/coupons/${couponId}`, payload);
        toast.success("Coupon updated");
      } else {
        // ✅ CREATE
        res = await post("/v1/coupons", payload);
        toast.success("Coupon created");
      }

      if (res) {
        router.push("/promotion-management");
      }

    } catch (err) {
      toast.error(isEdit ? "Failed to update coupon" : "Failed to create coupon");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setForm({
      code: "",
      title: "",
      discountType: "FLAT",
      discountValue: "",
      startsAt: "",
      expiresAt: "",
      description: "",
      branchId: "",
      maxDiscountAmount: "",
      minOrderAmount: "",
      maxUses: "",
      maxUsesPerCustomer: "",
      scopeMenuItemId: "",
      scopeCategoryId: "",
    });
  };

  return (
    <PageWrapper
      title={isEdit ? "Update Coupon" : "Add New Coupon"}
      onSave={handleSave}
      saving={saving}
      onReset={handleReset}
    >

      {/* BASIC */}
      <Section label="Setup Basic Info">
        <FormInput
          label="Coupon Title"
          value={form.title}
          onChange={(val) => updateField("title", val)}
        />

        <FormInput
          label="Coupon Code"
          value={form.code}
          onChange={(val) => updateField("code", val)}
        />

        <FormInput
          label="Max Uses"
          type="number"
          value={form.maxUses}
          onChange={(val) => updateField("maxUses", val)}
        />
      </Section>

      {/* DISCOUNT */}
      <Section label="Discount Setup">
        <Select
          value={form.discountType}
          onValueChange={(val) => updateField("discountType", val)}
        >
          <SelectTrigger className="h-10">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="FLAT">Flat Amount</SelectItem>
            <SelectItem value="PERCENTAGE">Percentage</SelectItem>
          </SelectContent>
        </Select>

        <FormInput
          label="Discount Value"
          type="number"
          value={form.discountValue}
          onChange={(val) => updateField("discountValue", val)}
        />

        <FormInput
          label="Starts At"
          type="datetime-local"
          value={form.startsAt}
          onChange={(val) => updateField("startsAt", val)}
        />

        <FormInput
          label="Expires At"
          type="datetime-local"
          value={form.expiresAt}
          onChange={(val) => updateField("expiresAt", val)}
        />
      </Section>

      {/* BRANCH */}
      <Section label="Branch">
        <Select
          value={form.branchId}
          onValueChange={(val) => updateField("branchId", val)}
        >
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Select branch" />
          </SelectTrigger>

          <SelectContent>
            {branches.map((b) => (
              <SelectItem key={b.id} value={b.id}>
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Section>

      {/* ITEM */}
      <Section label="Apply To (Optional)">
        <Select value={form.scopeMenuItemId} onValueChange={handleItemSelect}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Select item" />
          </SelectTrigger>

          <SelectContent>
            {items.map((i) => (
              <SelectItem key={i.id} value={i.id}>
                {i.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Section>

      {/* ADVANCED */}
      <Section label="Advanced">
        <FormInput
          label="Min Order Amount"
          type="number"
          value={form.minOrderAmount}
          onChange={(val) => updateField("minOrderAmount", val)}
        />

        <FormInput
          label="Max Discount Amount"
          type="number"
          value={form.maxDiscountAmount}
          onChange={(val) => updateField("maxDiscountAmount", val)}
        />

        <FormInput
          label="Max Uses Per Customer"
          type="number"
          value={form.maxUsesPerCustomer}
          onChange={(val) => updateField("maxUsesPerCustomer", val)}
        />

        <AdvanceSettings branches={branches} />
      </Section>
    </PageWrapper>
  );
}