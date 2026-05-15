"use client";

import Container from "@/components/container";
import Header from "@/components/header";
import { useAuth } from "@/hooks/useAuth";
import LoyaltyProgramSettings from "@/components/loyalty/LoyaltyProgramSettings";
import CustomerLoyaltyManager from "@/components/loyalty/CustomerLoyaltyManager";

export default function LoyaltyManagementPage() {
  const { restaurantId, loading } = useAuth();

  const normalizedRestaurantId = restaurantId ?? undefined;

  return (
    <Container>
      <Header
        title="Loyalty Management"
        description="Configure loyalty rules, point redemption, and manually adjust customer points."
      />

      {!loading && !normalizedRestaurantId ? (
        <div className="mt-6 rounded-[16px] border border-amber-100 bg-amber-50 p-4 text-sm text-amber-700">
          Restaurant context is missing. Loyalty settings require a restaurant
          ID.
        </div>
      ) : null}

      <div className="mt-6 space-y-6">
        <LoyaltyProgramSettings restaurantId={normalizedRestaurantId} />

        <CustomerLoyaltyManager />
      </div>
    </Container>
  );
}