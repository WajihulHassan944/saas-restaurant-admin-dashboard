"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { menus } from "@/constants/menu";
import MenuItemCard from "@/components/cards/MenuItemCard";
import { useState } from "react";
import CreateMenuItemModal from "../CreateMenuItemModal/CreateMenuItemModal";

export default function ItemList({ editing }: { editing: boolean }) {
  const activeMenu = menus.find((m) => m.isDefault);
const [createMenuItem, setCreateMenuItem] = useState(false);
  
  return (
    <div className="w-full py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[24px] font-semibold text-gray-900">
          Item List
        </h2>

        <Button
          variant="link"
          size="sm"
          className="inline-flex items-center gap-2 text-primary font-semibold text-[16px]"
           onClick={() => setCreateMenuItem(true)}
        >
          <PlusCircle className="w-4 h-4" />
          Add New Item
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {activeMenu?.items.map((item) => (
          <MenuItemCard key={item.id} item={item} editing={editing} />
        ))}
      </div>

            <CreateMenuItemModal open={createMenuItem} onOpenChange={setCreateMenuItem}  />
    </div>
  );
}
