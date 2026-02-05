"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { menus } from "@/constants/menu";
import MenuItemCard from "@/components/cards/MenuItemCard";
import { useState } from "react";
import CreateMenuItemModal from "../CreateMenuItemModal/CreateMenuItemModal";

interface ItemListProps {
  editing?: boolean;
  showAddNew?: boolean; // optional, default true
  headerText?: string;  // optional, default "Item List"
  addNewText?: string;  // optional, default "Add New Item"
}

export default function ItemList({
  editing,
  showAddNew = true,
  headerText = "Item List",
  addNewText = "Add New Item",
}: ItemListProps) {
  const activeMenu = menus.find((m) => m.isDefault);
  const [createMenuItem, setCreateMenuItem] = useState(false);

  return (
    <div className="w-full py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[24px] font-semibold text-gray-900">
          {headerText}
        </h2>

       {showAddNew && (
  <Button
    variant="link"
    size="sm"
    className="inline-flex items-center gap-2 text-primary font-semibold text-[16px]"
    onClick={() => setCreateMenuItem(true)}
  >
    {addNewText !== "Manage Food" && <PlusCircle className="w-4 h-4" />}
    {addNewText}
  </Button>
)}

      </div>

<div className="flex flex-wrap justify-center gap-3 lg:justify-start">

  {activeMenu?.items.map((item) => (
    <div
      key={item.id}
   className="w-full sm:w-auto"

    >
      <MenuItemCard item={item} editing={editing} />
    </div>
  ))}
</div>




      <CreateMenuItemModal
        open={createMenuItem}
        onOpenChange={setCreateMenuItem}
      />
    </div>
  );
}
