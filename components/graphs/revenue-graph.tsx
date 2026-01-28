"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
  Customized,
} from "recharts";
import { Card } from "@/components/ui/card";

const revenueData = [
  { month: "Jan", y2020: 10000, y2021: 22000 },
  { month: "Feb", y2020: 18000, y2021: 30000 },
  { month: "Mar", y2020: 17000, y2021: 11000 },
  { month: "Apr", y2020: 20000, y2021: 24000 },
  { month: "May", y2020: 26000, y2021: 36000 },
  { month: "Jun", y2020: 34000, y2021: 33000 },
  { month: "Jul", y2020: 38753, y2021: 21000 },
  { month: "Aug", y2020: 28000, y2021: 30000 },
  { month: "Sept", y2020: 19000, y2021: 36000 },
  { month: "Oct", y2020: 18000, y2021: 30000 },
  { month: "Nov", y2020: 21000, y2021: 12657 },
  { month: "Dec", y2020: 24000, y2021: 36000 },
];

/**
 * Custom fixed labels (exactly like design)
 */
const RevenueLabels = ({ xAxisMap, yAxisMap, height }: any) => {
  const xAxis = Object.values(xAxisMap)[0] as any;
  const yAxis = Object.values(yAxisMap)[0] as any;

  if (!xAxis?.scale || !yAxis?.scale) return null;

  const getX = (month: string) => xAxis.scale(month);
  const getY = (value: number) => yAxis.scale(value);

  // Prevent labels from going outside chart
  const clampY = (y: number) => Math.max(12, y);

  return (
    <>
      {/* 🔵 Blue label – July 2020 */}
      <foreignObject
        x={getX("Jul") - 55}
        y={clampY(getY(38753) - 20)}
        width={110}
        height={34}
      >
        <div className="rounded-md bg-[#E8F1FF] px-3 py-1 text-sm font-medium text-[#6D6AFE] text-center shadow-sm">
          $ 38.753,00
        </div>
      </foreignObject>

      {/* 🔴 Red label – November 2021 */}
      <foreignObject
        x={getX("Nov") + 5}
        y={getY(12657) - 0}
        width={110}
        height={34}
      >
        <div className="rounded-md bg-[#FDECEC] px-3 py-1 text-sm font-medium text-[#D41414] text-center shadow-sm">
          $ 12.657,00
        </div>
      </foreignObject>
    </>
  );
};

const RevenueGraph = () => {
  return (
    <Card className="p-[24px] rounded-[16px] bg-white border-none shadow-none">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base font-semibold text-dark">
          Total Revenue
        </h3>

        {/* Legend */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-[#6D6AFE]" />
            <span className="text-gray-500">2020</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-[#D41414]" />
            <span className="text-gray-500">2021</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[340px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={revenueData}>
            <CartesianGrid stroke="#EEF0F4" vertical horizontal={false} />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#8E8E8E", fontSize: 12 }}
            />

            <YAxis
              tickFormatter={(v) => `$${v / 1000}k`}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#8E8E8E", fontSize: 12 }}
            />

            {/* Vertical dashed guides */}
            <ReferenceLine
              x="Jul"
              stroke="#6D6AFE"
              strokeDasharray="4 6"
            />
            <ReferenceLine
              x="Nov"
              stroke="#6D6AFE"
              strokeDasharray="4 6"
            />

            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                fontSize: "13px",
              }}
              formatter={(value: number) =>
                `$ ${value.toLocaleString()}`
              }
            />

            {/* Lines */}
            <Line
              type="monotone"
              dataKey="y2020"
              stroke="#6D6AFE"
              strokeWidth={3}
              dot={{ r: 5, fill: "#6D6AFE", stroke: "#fff", strokeWidth: 2 }}
              activeDot={{ r: 8 }}
            />

            <Line
              type="monotone"
              dataKey="y2021"
              stroke="#D41414"
              strokeWidth={3}
              dot={{ r: 5, fill: "#D41414", stroke: "#fff", strokeWidth: 2 }}
              activeDot={{ r: 8 }}
            />

            {/* Fixed labels */}
            <Customized component={RevenueLabels} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default RevenueGraph;
