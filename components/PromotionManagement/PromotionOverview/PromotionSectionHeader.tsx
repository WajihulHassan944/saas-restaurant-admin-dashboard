type Props = {
  title: string;
  description?: string;
  showViewAll?: boolean;
};

export default function PromotionSectionHeader({
  title,
  description = "Boost Customer Loyalty with Custom Coupon Offers",
  showViewAll = true,
}: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-semibold mb-1">{title}</h2>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      {showViewAll && (
        <button className="text-sm text-primary hover:underline">
          View All
        </button>
      )}
    </div>
  );
}
