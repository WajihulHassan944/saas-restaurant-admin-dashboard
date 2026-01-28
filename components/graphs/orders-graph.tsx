"use client";

import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  Area,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Download } from "lucide-react";

const chartData = [
  { day: "Sun", orders: 120 },
  { day: "Mon", orders: 220 },
  { day: "Tues", orders: 180 },
  { day: "Wed", orders: 140 },
  { day: "Thurs", orders: 200 },
  { day: "Fri", orders: 160 },
  { day: "Sat", orders: 240 },
];

const OrdersGraph = () => {
  return (
    <Card className="p-[24px] border-none shadow-none rounded-[16px] bg-white h-full">

      
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-base font-medium text-dark">Chart Order</h3>
          <p className="text-sm text-gray-400 mt-1">
            Lorem ipsum dolor sit amet, consectetur adip
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-[12px] border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-red-50 transition">
          <Download size={16} />
          Save Report
        </button>
      </div>

      {/* Chart */}
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366F1" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              }}
            />

            <Area
              type="monotone"
              dataKey="orders"
              stroke="none"
              fill="url(#lineGradient)"
            />

            <Line
              type="monotone"
              dataKey="orders"
              stroke="#6366F1"
              strokeWidth={3}
              dot={{ r: 5, fill: "#6366F1", stroke: "#fff", strokeWidth: 2 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default OrdersGraph;
