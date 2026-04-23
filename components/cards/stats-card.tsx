"use client";

import { Card } from "@/components/ui/card";
import { StatItem, StatIcon } from "@/types/stats";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  Store,
  ShoppingBag,
  DollarSign,
  Users,
  CheckCircle,
  XCircle,
  Loader,
} from "lucide-react";
import { usePathname } from "next/navigation";

const ICON_MAP: Record<StatIcon, React.ElementType> = {
  store: Store,
  orders: ShoppingBag,
  revenue: DollarSign,
  users: Users,
  completed: CheckCircle,
  cancelled: XCircle,
  ongoing: Loader,
};

const StatsCard = ({
  data,
  loading = false,
}: {
  data: StatItem;
  loading?: boolean;
}) => {
  const pathname = usePathname();
  const isOrdersPage = pathname === "/orders" || pathname === "/reports";

  const isUp = data.trend?.direction === "up";
  const Icon = ICON_MAP[data.icon];
  const isDanger = data.iconStyle === "danger";

  return (
    <Card
      className={`
        rounded-[18px] bg-white p-[16px] shadow-none
        ${isOrdersPage ? "border border-[#EDEFF2]" : "border-none"}
        sm:p-[20px] md:p-[24px]
      `}
    >
      <div className="flex sm:flex-row items-start sm:items-center gap-4">
        <div
          className={`flex items-center justify-center size-[44px] rounded-full p-2 ${
            isDanger ? "bg-primary/10" : "bg-gray-100 text-gray-500"
          }`}
        >
          {loading ? (
            <div className="h-5 w-5 animate-pulse rounded-full bg-gray-200" />
          ) : (
            <Icon size={20} className="text-primary" />
          )}
        </div>

        <div className="flex flex-col">
          {loading ? (
            <>
              <div className="h-8 sm:h-10 w-20 rounded-md bg-gray-200 animate-pulse" />
              <div className="mt-2 h-4 w-28 rounded-md bg-gray-200 animate-pulse" />
              <div className="mt-2 h-4 w-20 rounded-md bg-gray-200 animate-pulse" />
            </>
          ) : (
            <>
              <div className="text-[16px] sm:text-[22px] font-semibold text-black leading-none">
                {data.value}
              </div>

              <p className="mt-1 text-[11px] sm:text-[15px] text-gray-400">
                {data.title}
              </p>

              <div
                className={`mt-2 flex items-center gap-1 text-xs sm:text-sm font-medium ${
                  isUp ? "text-green-600" : "text-red-600"
                }`}
              >
                {isUp ? (
                  <ArrowUpRight size={16} strokeWidth={2.5} />
                ) : (
                  <ArrowDownRight size={16} strokeWidth={2.5} />
                )}
                {data.trend?.percentage}
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;