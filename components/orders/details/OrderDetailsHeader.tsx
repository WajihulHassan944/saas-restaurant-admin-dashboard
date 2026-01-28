import { Button } from "@/components/ui/button";
import { Ghost, Truck } from "lucide-react";

const OrderDetailsHeader = ({ order }: { order: { id: string; status: string } }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Order ID #{order.id}
        </h1>
        <p className="text-sm text-gray-500"><span className="text-primary">Orders /</span> Order Details</p>
      </div>

    <Button
  variant="ghost"
  className="rounded-[10px] h-10 bg-green-500 text-white hover:bg-green-700 text-sm font-medium px-0 flex items-center gap-2"
>
  <Truck size={18} />
  {order.status}
</Button>
    </div>
  );
};

export default OrderDetailsHeader;
