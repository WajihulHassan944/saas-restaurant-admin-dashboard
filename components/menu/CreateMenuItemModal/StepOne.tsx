import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function StepOne() {
  return (
    <div className="space-y-5">
      {/* ---------- Image ---------- */}
      <div className="flex justify-center">
        <img
          src="/burgerOne.jpg"
          alt="Burger"
          className="w-[240px] h-[160px] object-cover rounded-[14px]"
        />
      </div>

      {/* ---------- Item Name ---------- */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Item Name <span className="text-primary">*</span>
        </Label>

        <Input
          placeholder="eg. Food Kart"
          className="h-[44px] rounded-[12px]"
        />

        <p className="text-xs text-primary">Item name is required</p>
      </div>

      {/* ---------- Category ---------- */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Select Category</Label>

        <Select>
          <SelectTrigger className="h-[44px] rounded-[12px] text-sm border-[#BBBBBB]">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pizza">Pizza</SelectItem>
            <SelectItem value="Burgers">Burgers</SelectItem>
            <SelectItem value="Drinks">Drinks</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ---------- Description ---------- */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Description</Label>

        <Textarea
          placeholder="Enter item description"
          className="h-[90px] rounded-[12px] text-sm border-[#BBBBBB]"
        />
      </div>

      {/* ---------- Price ---------- */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Price</Label>

        <Input
          placeholder="eg. 5.99"
          type="number"
          className="h-[44px] rounded-[12px] border-[#BBBBBB]"
        />
      </div>
    </div>
  );
}
