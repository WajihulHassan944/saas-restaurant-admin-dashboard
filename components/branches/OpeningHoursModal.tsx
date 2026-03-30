"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/constants";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void; // ✅ FIXED
  branchId: string;
  branchName: string;
}

const DAYS = [
  "MONDAY","TUESDAY","WEDNESDAY","THURSDAY",
  "FRIDAY","SATURDAY","SUNDAY",
];

export default function OpeningHoursModal({
  open,
  onOpenChange,
  branchId,
  branchName,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [token, setToken] = useState("");
  const [hours, setHours] = useState<any[]>([]);

  useEffect(() => {
    const authRaw = localStorage.getItem("auth");
    if (!authRaw) return;

    try {
      const auth = JSON.parse(authRaw);
      setToken(auth?.accessToken || "");
    } catch {}
  }, []);

  useEffect(() => {
    if (!open || !token) return;

    const fetchHours = async () => {
      try {
        setFetching(true);

        const res = await fetch(
          `${API_BASE_URL}/v1/branches/${branchId}/opening-hours`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        if (!data.data.length) {
          setHours(
            DAYS.map((day) => ({
              dayOfWeek: day,
              isClosed: day === "SUNDAY",
              openTime: "09:00",
              closeTime: "18:00",
              note: "",
            }))
          );
        } else {
          setHours(data.data);
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to fetch");
      } finally {
        setFetching(false);
      }
    };

    fetchHours();
  }, [open, token]);

  const handleChange = (index: number, field: string, value: any) => {
    const updated = [...hours];
    updated[index][field] = value;
    setHours(updated);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE_URL}/v1/branches/${branchId}/opening-hours`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ openingHours: hours }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Opening hours saved");

      // ✅ CORRECT CLOSE
      onOpenChange(false);

    } catch (err: any) {
      toast.error(err.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ SAFETY FIX (prevents freeze 100%)
  useEffect(() => {
    if (!open) {
      document.body.style.pointerEvents = "";
      document.body.style.overflow = "";
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogContent
        className="max-w-[600px] rounded-[20px] p-6 bg-[#F5F5F5] max-h-[95vh] overflow-auto"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Opening Hours
          </DialogTitle>
          <p className="text-sm text-gray-500">{branchName}</p>
        </DialogHeader>

        <div className="mt-5 bg-white rounded-[16px] p-5 space-y-4">
          {fetching ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : (
            hours.map((day, index) => (
              <div key={day.dayOfWeek} className="border rounded-[12px] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{day.dayOfWeek}</h4>

                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={day.isClosed}
                      onChange={(e) =>
                        handleChange(index, "isClosed", e.target.checked)
                      }
                    />
                    Closed
                  </label>
                </div>

                {!day.isClosed && (
                  <div className="flex gap-3">
                    <input
                      type="time"
                      value={day.openTime || ""}
                      onChange={(e) =>
                        handleChange(index, "openTime", e.target.value)
                      }
                      className="border rounded-md px-3 py-2 text-sm w-full"
                    />
                    <input
                      type="time"
                      value={day.closeTime || ""}
                      onChange={(e) =>
                        handleChange(index, "closeTime", e.target.value)
                      }
                      className="border rounded-md px-3 py-2 text-sm w-full"
                    />
                  </div>
                )}

                <input
                  type="text"
                  placeholder="Note (optional)"
                  value={day.note || ""}
                  onChange={(e) =>
                    handleChange(index, "note", e.target.value)
                  }
                  className="border rounded-md px-3 py-2 text-sm w-full"
                />
              </div>
            ))
          )}

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-2 py-4 rounded-[10px] bg-primary hover:bg-primary/90"
          >
            {loading ? "Saving..." : "Save Opening Hours"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}