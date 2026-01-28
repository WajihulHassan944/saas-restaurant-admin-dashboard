"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Phone, MapPin } from "lucide-react"

type Props = {
  order: any
}

export default function OrderTrackingSection({ order }: Props) {
  return (
    <Card className="w-full rounded-2xl shadow-sm border-0">
      <CardContent className="p-6 pt-0 space-y-8">
        {/* ================= TRACKING PANEL ================= */}
        <div className="relative bg-muted/40 rounded-2xl  h-[280px] overflow-hidden">
          <svg
            viewBox="0 0 700 140"
            className="absolute inset-0 w-full h-full"
            fill="none"
          >
            {/* full faded path */}
            <polyline
              points="20,50 140,90 260,40 380,110 520,50 640,100"
              stroke="#e5e7eb"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* active red path */}
            <polyline
              points="140,90 260,40 380,110 520,50 640,100"
              stroke="#dc2626"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* ✅ NEW: gray starting circle */}
            <circle cx="20" cy="50" r="14" fill="#d4d4d8" />

            {/* current position */}
            <circle cx="260" cy="40" r="14" fill="#dc2626" />

            {/* end dot */}
            <circle cx="640" cy="100" r="12" fill="#dc2626" />
          </svg>

          {/* time bubble */}
          <div className="absolute left-[250px] top-[60px] bg-white shadow-md rounded-xl px-4 py-2 text-sm font-semibold">
            {order.estimatedTime}
            <p className="text-[11px] text-muted-foreground font-normal">
              Estimated time
            </p>
          </div>

          {/* top-right title */}
          <div className="absolute right-8 top-8 text-right">
            <h3 className="text-lg font-semibold">Track Orders</h3>
            <p className="text-sm text-muted-foreground">
              Lorem ipsum dolor sit
            </p>
          </div>
        </div>

        {/* ================= DELIVERY SECTION ================= */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          {/* LEFT COLUMN (stacked like screenshot) */}
          <div className="space-y-3">
            <p className="font-semibold text-base">Delivery by</p>

            <div className="flex items-center gap-4">
              <img
                src="/dummy-user.jpg"
                alt=""
                className="w-14 h-14 rounded-xl object-cover"
              />

              <div>
                <p className="font-semibold text-base">
                  {order.deliveryBy.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  ID {order.deliveryBy.id}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT INFO (inline row) */}
          <div className="flex flex-wrap items-center gap-10">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Phone size={16} />
              {order.deliveryBy.phone}
            </div>

            <div className="flex items-center gap-3 text-sm text-muted-foreground max-w-[260px]">
              <MapPin size={16} />
              {order.deliveryBy.address}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
