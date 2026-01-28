import { StatItem } from "@/types/stats";
import StatsCard from "../cards/stats-card";
import { cn } from "@/lib/utils";

export default function StatsSection({
  stats,
  className,
}: {
  stats: StatItem[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[24px]",
        className
      )}
    >
      {stats.map((stat) => (
        <StatsCard key={stat._id} data={stat} />
      ))}
    </div>
  );
}
