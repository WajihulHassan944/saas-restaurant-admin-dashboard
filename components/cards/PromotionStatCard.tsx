import React from "react";

type Props = {
  icon: React.ReactNode;
  value: string;
  label: string;
};

export default function PromotionStatCard({ icon, value, label }: Props) {
  return (
    <div className="bg-white border rounded-xl p-6 flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-[#F9F9F9] flex items-center justify-center text-primary">
        {icon}
      </div>

      <div>
        <p className="text-2xl font-semibold">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}
