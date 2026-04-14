"use client";

import { useState } from "react";
import Container from "@/components/container";
import Header from "@/components/header";
import MenuItemsTable from "./MenuItemsTable";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import CreateMenuItemModal from "@/components/menu/CreateMenuItemModal/CreateMenuItemModal";

const MenuItemsPage = () => {
  const [open, setOpen] = useState(false);
  const [refetchKey, setRefetchKey] = useState(0);

  const handleSuccess = () => {
    setRefetchKey((prev) => prev + 1); // 🔥 trigger refetch
  };

  return (
    <Container>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
        <Header
          title="Menu Items"
          description="Manage menu items from here"
        />

        <Button
          onClick={() => setOpen(true)}
          className="h-[44px] rounded-[14px] px-5 flex items-center gap-2 bg-primary hover:bg-red-700 text-white text-[15px] font-[500] shadow-md"
        >
          <PlusCircle size={18} />
          Add Menu Item
        </Button>
      </div>

      <div className="bg-white p-6 rounded-[20px] shadow-sm mt-6">
        <MenuItemsTable refetchKey={refetchKey} />
      </div>

      {/* 🔥 GLOBAL MODAL */}
      <CreateMenuItemModal
        open={open}
        onOpenChange={setOpen}
        onSuccess={handleSuccess}
      />
    </Container>
  );
};

export default MenuItemsPage;