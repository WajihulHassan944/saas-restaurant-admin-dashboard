"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import MenuItemCard from "@/components/cards/MenuItemCard";
import { useState } from "react";
import CreateMenuItemModal from "../CreateMenuItemModal/CreateMenuItemModal";

interface ItemListProps {
  editing?: boolean;
  items: any[];
  loading?: boolean;
  showAddNew?: boolean;
  headerText?: string;
  addNewText?: string;
}

export default function ItemList({
  editing,
  items,
  loading,
  showAddNew = true,
  headerText = "Item List",
  addNewText = "Add New Item",
}: ItemListProps) {
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
            <PlusCircle className="w-4 h-4" />
            {addNewText}
          </Button>
        )}
      </div>

      {/* ITEMS */}
      {loading ? (
        <p className="text-gray-400">Loading items...</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
          {items.map((item) => (
            <div key={item.id} className="w-full sm:w-auto">
              <MenuItemCard item={item} editing={editing} />
            </div>
          ))}
        </div>
      )}

      <CreateMenuItemModal
        open={createMenuItem}
        onOpenChange={setCreateMenuItem}
      />
    </div>
  );
}