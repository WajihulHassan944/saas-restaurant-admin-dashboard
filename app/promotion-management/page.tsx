"use client";

import { useState } from "react";

import Container from "@/components/container";
import Header from "@/components/header";
import CouponsPage from "@/components/PromotionManagement/CouponsPage/CouponsPage";
import PromotionsOverview from "@/components/PromotionManagement/PromotionOverview/PromotionsOverview";
import PromotionTabs from "@/components/PromotionManagement/PromotionTabs";
import PromotionsPage from "@/components/PromotionManagement/PromotionsPage/PromotionsPage";

const PromotionManagementPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { label: "Overview", value: "overview" },
    { label: "Coupons", value: "coupons" },
    { label: "Promotions", value: "promotions" },
    { label: "Happy Hours", value: "happy-hours" },
  ];

  return (
    <Container>
      <Header
        title="Promotional Management"
        description="View performance insights and manage active promotions"
      />

      <div className="flex flex-col gap-[32px] w-full bg-white p-[30px] rounded-[14px]">
        {/* ================= TABS ================= */}
        <PromotionTabs
          tabs={tabs}
          active={activeTab}
          onChange={setActiveTab}
        />

        {/* ================= CONTENT ================= */}
        {activeTab === "overview" && <PromotionsOverview />}
        {activeTab === "coupons" && <CouponsPage />}
        {activeTab === "promotions" && <PromotionsPage />}
        {activeTab === "happy-hours" && <div>Happy Hours Content</div>}
      </div>
    </Container>
  );
};

export default PromotionManagementPage;
