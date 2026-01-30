import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function StepTwo() {
  return (
    <div className="mt-4 space-y-4">
      {/* Size Name */}
      <div className="space-y-1">
        <Label className="text-sm font-medium">
          Size Name <span className="text-primary">*</span>
        </Label>
        <Input placeholder="eg. Small, Medium, Large" className="h-[44px] rounded-[10px] px-3 text-sm placeholder:text-gray-400 border-primary" />
        <p className="text-xs text-primary">Item size name is required</p>
      </div>

      {/* Price */}
      <div className="space-y-1">
        <Label className="text-sm font-medium">Price</Label>
        <Input placeholder="eg. 5.99" className="h-[44px] rounded-[10px] px-3 text-sm placeholder:text-gray-400 border-[#BBBBBB]" />
      </div>
    </div>
  );
}
