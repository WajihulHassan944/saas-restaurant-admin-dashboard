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
  const [branches, setBranches] = useState<any[]>([]);

  const [open, setOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);

  const [step, setStep] = useState<"restaurant" | "branch">("restaurant");

  /* ================= FETCH ================= */

  const fetchRestaurants = async () => {
    try {
      const res = await get("/v1/restaurants");

      // ✅ FILTER BY tenantId === user.id
      const filtered =
        res?.data?.filter((r: any) => r.tenantId === user?.tenantId) || [];

      setRestaurants(filtered);
    } catch {
      toast.error("Failed to fetch restaurants");
    }
  };

  const fetchBranches = async (restaurantId: string) => {
    try {
      const res = await get(`/v1/branches?restaurantId=${restaurantId}`);
      setBranches(res?.data || []);
    } catch {
      toast.error("Failed to fetch branches");
    }
  };

  /* ================= INIT ================= */

  useEffect(() => {
    if (token && user?.id) fetchRestaurants();
  }, [token, user?.id]);

  useEffect(() => {
    if (!user?.restaurantId || restaurants.length === 0) return;

    const r = restaurants.find((r) => r.id === user.restaurantId);
    if (r) {
      setSelectedRestaurant(r);
      setStep("branch");
      fetchBranches(r.id);
    }
  }, [user?.restaurantId, restaurants]);

  useEffect(() => {
    if (!user?.branchId || branches.length === 0) return;

    const b = branches.find((b) => b.id === user.branchId);
    if (b) setSelectedBranch(b);
  }, [branches, user?.branchId]);

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

  const handleSelectRestaurant = async (r: any) => {
    setSelectedRestaurant(r);
    setSelectedBranch(null);
    setBranches([]);
    setStep("branch");

    await fetchBranches(r.id);
  };

  const handleSelectBranch = (b: any) => {
    if (!selectedRestaurant) return;

    setSelectedBranch(b);
    setOpen(false);

    const restaurantId = selectedRestaurant.id;

    setUser((prev: any) => ({
      ...prev,
      restaurantId,
      branchId: b.id,
    }));

    const stored = JSON.parse(localStorage.getItem("auth") || "{}");
    if (stored?.user) {
      stored.user.restaurantId = restaurantId;
      stored.user.branchId = b.id;
      localStorage.setItem("auth", JSON.stringify(stored));
    }

    toast.success("Switched successfully");
    window.location.reload();
  };

  /* ================= LABEL ================= */

  const renderLabel = () => {
    if (!selectedRestaurant) return "Select Restaurant";
    if (!selectedBranch) return `${selectedRestaurant.name}`;
    return `${selectedRestaurant.name} / ${selectedBranch.name}`;
  };

  /* ================= UI ================= */

  return (
    <div ref={containerRef} className="relative w-[280px]">
      {/* Trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-4 h-[56px] rounded-xl bg-[#F5F5F5] text-sm w-full justify-between"
      >
        <span className="font-medium truncate">{renderLabel()}</span>
        <ChevronDown size={18} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-[110%] left-0 w-full bg-white shadow-xl rounded-xl p-3 z-50 border">

          {/* TITLE */}
          <p className="text-xs text-gray-400 px-2 mb-2">
            {step === "restaurant" ? "Select Restaurant" : "Select Branch"}
          </p>

          {/* RESTAURANTS */}
          {step === "restaurant" && (
            <div className="space-y-1 max-h-[220px] overflow-auto">
              {restaurants.map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleSelectRestaurant(r)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm"
                >
                  {r.name}
                </button>
              ))}
            </div>
          )}

          {/* BRANCHES */}
          {step === "branch" && selectedRestaurant && (
            <div className="space-y-1 max-h-[220px] overflow-auto">
              <p className="text-xs text-gray-500 px-2 mb-1 font-medium">
                {selectedRestaurant.name}
              </p>

              {branches.map((b) => (
                <button
                  key={b.id}
                  onClick={() => handleSelectBranch(b)}
                  className="w-full flex justify-between items-center px-3 py-2 rounded-lg hover:bg-gray-100 text-sm"
                >
                  {b.name}
                  {selectedBranch?.id === b.id && (
                    <Check size={14} className="text-primary" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex justify-between mt-3 text-xs">
            {step === "branch" && (
              <button
                onClick={() => {
                  setStep("restaurant");
                  setSelectedRestaurant(null);
                  setSelectedBranch(null);
                  setBranches([]);
                }}
                className="text-primary hover:underline"
              >
                ← Change Restaurant
              </button>
            )}

            {selectedRestaurant && (
              <button
                onClick={() => {
                  setStep("branch");
                  setSelectedBranch(null);
                }}
                className="text-gray-500 hover:underline"
              >
                Change Branch →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}