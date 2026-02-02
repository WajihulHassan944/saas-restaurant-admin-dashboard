"use client";

import { Tag } from "lucide-react";
import PromotionSectionHeader from "../PromotionOverview/PromotionSectionHeader";
import PromotionStatCard from "@/components/cards/PromotionStatCard";
import CouponsTable from "./table";
import PromotionsTable from "./table";

export default function PromotionsPage() {
  return (
    <div className="mt-1 space-y-10">
      {/* ================= HEADER ================= */}
      <PromotionSectionHeader
        title="Promotions"
        description="Boost Customer Loyalty with Custom Coupon Offers"
        showViewAll={false}
      />

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <PromotionStatCard
          icon={<Tag size={18} />}
          value="10"
          label="Total Promotions"
        />

        <PromotionStatCard
          icon={<Tag size={18} />}
          value="3"
          label="Active Promotions"
        />

        <PromotionStatCard
          icon={<Tag size={18} />}
          value="6"
          label="Upcoming Promotions"
        />

        <PromotionStatCard
          icon={<Tag size={18} />}
          value="6"
          label="Expired Promotions"
        />
      </div>

     <PromotionsTable />


    </div>
  );
}
