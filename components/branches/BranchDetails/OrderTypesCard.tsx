import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function OrderTypesCard() {
  return (
    <Card className="p-4 bg-[#F5F5F5] rounded-lg border-none">
      <h3 className="text-sm font-semibold text-center text-black">Available Order Types</h3>
      <div className="grid grid-cols-2 gap-4 p-1 rounded-lg">
        <Button variant="outline" className="w-full border-none rounded-[8px] font-onest font-light text-sm">
          Dine In
        </Button>
        <Button variant="outline" className="w-full border-none rounded-[8px] font-onest font-light text-sm">
          Reservation
        </Button>
        <Button variant="outline" className="w-full border-none rounded-[8px] font-onest font-light text-sm">
          Take Away
        </Button>
        <Button variant="outline" className="w-full border-none rounded-[8px] font-onest font-light text-sm">
          Home Delivery
        </Button>
      </div>
    </Card>
  );
}
