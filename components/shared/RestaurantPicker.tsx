"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import useApi from "@/hooks/useApi";
import { toast } from "sonner";

export default function RestaurantPicker() {
  const { token, user, setUser } = useAuth();
  const { get } = useApi(token);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);

  const [open, setOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  /* ================= FETCH ================= */

  const fetchRestaurants = async () => {
    try {
      setIsFetching(true);

      const res = await get("/v1/restaurants");

      const filtered =
        res?.data?.filter((r: any) => r.tenantId === user?.tenantId) || [];

      setRestaurants(filtered);
    } catch {
      toast.error("Failed to fetch restaurants");
    } finally {
      setIsFetching(false);
    }
  };

  /* ================= INIT ================= */

  useEffect(() => {
    if (token && user?.id) fetchRestaurants();
  }, [token, user?.id]);

  useEffect(() => {
    if (!user?.restaurantId || restaurants.length === 0) return;

    const r = restaurants.find((r) => r.id === user.restaurantId);
    if (r) setSelectedRestaurant(r);
  }, [user?.restaurantId, restaurants]);

  /* ================= OUTSIDE CLICK ================= */

  useEffect(() => {
    const handleClickOutside = (e: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);
    return () =>
      document.removeEventListener("pointerdown", handleClickOutside);
  }, []);

  /* ================= SELECT ================= */

  const handleSelectRestaurant = (r: any) => {
    setSelectedRestaurant(r);
    setOpen(false);

    const restaurantId = r.id;

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

    toast.success("Switched successfully");
  };

  /* ================= LABEL ================= */

  const renderLabel = () => {
    if (!selectedRestaurant) return "Select Restaurant";
    return selectedRestaurant.name;
  };

  /* ================= UI ================= */

  return (
    <div ref={containerRef} className="relative w-[280px]">
      {/* Trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-between gap-2 px-4 h-[56px] rounded-xl bg-[#F5F5F5] hover:bg-[#EEEEEE] transition-all text-sm w-full"
      >
        <span className="font-medium truncate text-gray-800">
          {renderLabel()}
        </span>
        <ChevronDown
          size={18}
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-[110%] left-0 w-full bg-white shadow-xl rounded-xl p-3 z-50 border animate-in fade-in zoom-in-95 duration-200">

          {/* TITLE */}
          <p className="text-xs text-gray-400 px-2 mb-2">
            Select Restaurant
          </p>

          {/* CONTENT */}
          <div className="space-y-1 max-h-[240px] overflow-auto">

            {/* SKELETON */}
            {isFetching &&
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[40px] rounded-md bg-gray-100 animate-pulse"
                />
              ))}

            {/* RESTAURANTS */}
            {!isFetching &&
              restaurants.map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleSelectRestaurant(r)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all
                  
                  ${
                    selectedRestaurant?.id === r.id
                      ? "bg-primary/5 text-primary"
                      : "hover:bg-gray-100 text-gray-700"
                  }
                  `}
                >
                  <span className="truncate">{r.name}</span>

                  {selectedRestaurant?.id === r.id && (
                    <Check size={14} className="text-primary" />
                  )}
                </button>
              ))}

            {/* EMPTY */}
            {!isFetching && restaurants.length === 0 && (
              <div className="text-center text-xs text-gray-400 py-3">
                No restaurants found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}