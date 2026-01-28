import { Card } from "@/components/ui/card";
import { StatItem } from "@/types/stats";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  Store,
  ShoppingBag,
  DollarSign,
  Users,
} from "lucide-react";

const ICON_MAP = {
  store: Store,
  orders: ShoppingBag,
  revenue: DollarSign,
  users: Users,
} as const;

const StatsCard = ({ data }: { data: StatItem }) => {
  const isUp = data.trend.direction === "up";
  const Icon = ICON_MAP[data.icon];
const isDanger = data.iconStyle === "danger";
  return (
    <Card className="rounded-[18px] bg-white p-[24px] border-none shadow-none">
      <div className="flex items-center gap-4">
        {/* Icon */}
       <div
          className={`flex items-center justify-center size-[44px] rounded-full ${
            isDanger
              ? "bg-primary/10"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          <Icon
            size={20}
            className="text-primary"
          />
        </div>

        {/* Right content */}
        <div className="flex flex-col">
          {/* Value */}
          <div className="text-[32px] font-semibold text-black leading-none">
            {data.value}
          </div>

          {/* Title */}
          <p className="mt-1 text-sm text-gray-400">
            {data.title}
          </p>

          {/* Trend */}
          <div
            className={`mt-2 flex items-center gap-1 text-sm font-medium ${
              isUp ? "text-green-600" : "text-red-600"
            }`}
          >
            {isUp ? (
              <ArrowUpRight size={16} strokeWidth={2.5} />
            ) : (
              <ArrowDownRight size={16} strokeWidth={2.5} />
            )}
            {data.trend.percentage}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;
