import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { PlusCircle } from "lucide-react";

export default function StepThree() {
  return (
    <div className="mt-4 space-y-4">
      {/* ---------- Add On Name ---------- */}
      <div className="space-y-1">
        <Label className="text-sm font-medium">
          Add On Name <span className="text-primary">*</span>
        </Label>
        <Input
          placeholder="eg. Extra Cheese"
          className="h-[44px] rounded-[12px] text-sm"
        />
        <p className="text-xs text-primary">Add on name is required</p>
      </div>

      {/* ---------- Max Quantity ---------- */}
      <div className="space-y-1">
        <Label className="text-sm font-medium">Max Quantity</Label>
        <Select>
          <SelectTrigger className="h-[44px] rounded-[12px] text-sm border-[#BBBBBB]">
            <SelectValue placeholder="Select quantity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ---------- Price ---------- */}
      <div className="space-y-1">
        <Label className="text-sm font-medium">Price</Label>
        <Input
          placeholder="eg. 2.99"
          type="number"
          className="h-[44px] rounded-[12px] text-sm border-[#BBBBBB]"
        />
      </div>


<div className="mt-4 text-center">
  <Button
    variant="link"
    size="sm"
    className="inline-flex items-center gap-2 text-primary no-underline hover:no-underline"
  >
    <PlusCircle className="w-4 h-4" />
    Add Another Add On
  </Button>
</div>

    </div>
  );
}
