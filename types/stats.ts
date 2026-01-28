export type StatIcon =
  | "store"
  | "orders"
  | "revenue"
  | "users";
export type StatItem = {
  _id: string;
  title: string;
  value: string;
  icon: StatIcon;
  trend: {
    direction: "up" | "down";
    percentage: string;
  };

  iconStyle?: "default" | "danger";
};
