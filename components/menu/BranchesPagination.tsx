"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BranchesPagination() {
  return (
    <div className="flex items-center justify-start gap-4 mt-6 text-sm text-gray-400">
      
      {/* Page Size */}
      <Select defaultValue="10">
        <SelectTrigger className="h-[36px] w-[72px] rounded-[10px] border-[#E5E7EB]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="20">20</SelectItem>
          <SelectItem value="50">50</SelectItem>
        </SelectContent>
      </Select>

      {/* Info */}
      <span>
        Showing 1 To 1 Of 1
      </span>
    </div>
  );
}
