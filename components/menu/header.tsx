"use client";

import Header from "../header";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Download,
  Plus,
  HelpCircle,
  PlusCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ImportModal from "../shared/ImportModal";
import CreateMenuModal from "./CreateMenuModal";

interface HeaderProps {
  title: string;
  description?: string;
}

export default function BranchesHeader({ title, description }: HeaderProps) {
  const router = useRouter();
   const [open, setOpen] = useState(false); 
  const [createMenu, setCreateMenu] = useState(false);
  
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between w-full">
      
      {/* Left: Title */}
      <Header title={title} description={description} />

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        
        {/* View Trash */}
        <Button
          variant="outline"
          className="h-[44px] rounded-[12px] px-4 flex items-center gap-2 text-gray-600 border-gray-200"
          onClick={()=>router.push("/menu/trash")}
        >
          <Trash2 size={18} className="text-gray-400" />
          View Trash
        </Button>

        {/* Import */}
        <Button
          variant="outline"
          className="h-[44px] rounded-[12px] px-4 flex items-center gap-2 text-gray-600 border-gray-200"
          onClick={() => setOpen(true)}
        >
          <Download size={18} className="text-gray-400" />
          Import
          <HelpCircle size={16} className="text-gray-400 ml-1" />
        </Button>

        <Button
          className="h-[44px] rounded-[12px] px-5 flex items-center gap-2 bg-primary hover:bg-red-700 text-white"
          onClick={() => setCreateMenu(true)}
        >
          <PlusCircle size={18}  />
          Add Menu
        </Button>

      </div>

      <ImportModal open={open} onOpenChange={setOpen}  title="Import Menu List"
  subtitle="Upload menu items for this restaurant" />
      <CreateMenuModal open={createMenu} onOpenChange={setCreateMenu} />

    </div>
  );
}
