"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import useApi from "@/hooks/useApi";
import { Check } from "lucide-react";
import { toast } from "sonner";

export default function ContextGate() {
  const { user, loading, setUser, token } = useAuthContext();
  const { get } = useApi(token);

  const [open, setOpen] = useState(false);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(false);

  /* ================= CHECK ================= */

  useEffect(() => {
    if (loading || !user) return;

    const needsRestaurant = !user.restaurantId;
    setOpen(needsRestaurant);
  }, [user, loading]);

  /* ================= FETCH ================= */

  const fetchRestaurants = async () => {
    try {
      setIsFetching(true);

      const res = await get("/v1/restaurants");

      const filtered =
        res?.data?.filter((r: any) => r.tenantId === user?.tenantId) || [];

      setRestaurants(filtered);
    } catch {
      toast.error("Failed to load restaurants");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (open && token) fetchRestaurants();
  }, [open, token]);

  /* ================= SELECT ================= */

  const handleConfirm = () => {
    if (!selectedRestaurant) {
      toast.error("Please select a restaurant");
      return;
    }

    const restaurantId = selectedRestaurant.id;

    // ✅ Update context
    setUser((prev: any) => ({
      ...prev,
      restaurantId,
      branchId: null,
    }));

    // ✅ Persist
    const stored = JSON.parse(localStorage.getItem("auth") || "{}");

    if (stored?.user) {
      stored.user.restaurantId = restaurantId;
      stored.user.branchId = null;
      localStorage.setItem("auth", JSON.stringify(stored));
    }

    toast.success("Workspace selected");
    setOpen(false);
  };

  if (!open) return null;

  /* ================= UI ================= */

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-300">

      <div className="w-full max-w-[560px] bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 animate-in zoom-in-95 duration-300">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold tracking-tight">
            Setup Your Workspace
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Select a restaurant to continue
          </p>
        </div>

        {/* PROGRESS BAR */}
        <div className="flex items-center justify-center mb-6">
          <div className="h-2 w-10 bg-primary rounded-full" />
        </div>

        {/* CONTENT */}
        <div className="space-y-3 max-h-[300px] overflow-auto pr-1">

          {/* SKELETON */}
          {isFetching &&
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-[72px] rounded-xl bg-gray-100 animate-pulse"
              />
            ))}

          {/* RESTAURANTS */}
          {!isFetching &&
            restaurants.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRestaurant(r)}
                className={`w-full p-4 rounded-xl border text-left transition-all duration-200
                  
                  ${selectedRestaurant?.id === r.id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-gray-200 hover:border-primary hover:bg-gray-50 hover:shadow-sm"
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">
                      {r.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {r.id}
                    </div>
                  </div>

                  {selectedRestaurant?.id === r.id && (
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check size={14} className="text-primary" />
                    </div>
                  )}
                </div>
              </button>
            ))}

          {/* EMPTY STATE */}
          {!isFetching && restaurants.length === 0 && (
            <div className="text-center text-sm text-gray-400 py-6">
              No restaurants found
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="mt-6">
          <button
            onClick={handleConfirm}
            disabled={!selectedRestaurant}
            className={`w-full h-[48px] rounded-xl text-sm font-medium transition-all
              
              ${selectedRestaurant
                ? "bg-primary text-white hover:opacity-90"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            Continue
          </button>
        </div>

      </div>
    </div>
  );
}