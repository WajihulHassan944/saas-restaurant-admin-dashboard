"use client";

import { Tag, Percent, ShoppingCart } from "lucide-react";

import PromotionSectionHeader from "./PromotionSectionHeader";
import PromotionCreateLink from "./PromotionCreateLink";
import HappyHourInfoCard from "./HappyHourInfoCard";
import PromotionStatCard from "@/components/cards/PromotionStatCard";

export default function PromotionsOverview() {
  return (
    <div className="mt-1 space-y-14">
      {/* ================= COUPONS ================= */}
      <PromotionSectionHeader title="Coupons" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PromotionStatCard icon={<Tag size={18} />} value="10" label="Total Coupons" />
        <PromotionStatCard icon={<Tag size={18} />} value="3" label="Active Coupon" />
        <PromotionStatCard icon={<Tag size={18} />} value="6" label="Upcoming Coupons" />
      </div>

      <PromotionCreateLink label="Create New Coupon" href="/promotion-management/coupons/add" />

      {/* ================= PROMOTIONS ================= */}
      <PromotionSectionHeader title="Promotions" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PromotionStatCard icon={<Percent size={18} />} value="10" label="Total Promotions" />
        <PromotionStatCard icon={<Percent size={18} />} value="3" label="Ongoing Promotions" />
      </div>

      <PromotionCreateLink label="Create New Promotion" href="/promotion-management/promotions/add" />

      {/* ================= HAPPY HOURS ================= */}
      <PromotionSectionHeader title="Happy Hours" />

      <div className="grid grid-cols-1 md:grid-cols-[65%_35%] gap-6">
        <HappyHourInfoCard />

        <PromotionStatCard
          icon={<ShoppingCart size={18} />}
          value="2"
          label="Total Sale"
        />
      </div>

      <PromotionCreateLink label="Create Happy Hour" href="/promotion-management/happy-hour/add" />
    </div>
  );
}
