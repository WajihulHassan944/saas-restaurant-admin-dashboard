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
import CreateBranchModal from "./CreateBranchModal";
import ImportModal from "../shared/ImportModal";

interface HeaderProps {
  title: string;
  description?: string;
}

export default function BranchesHeader({ title, description }: HeaderProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false); 
  const [createBranch, setCreateBranch] = useState(false);
  
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
      
      {/* Left: Title */}
      <Header title={title} description={description} />

      {/* Right: Actions */}
      <div className="flex flex-wrap gap-3 sm:gap-4 justify-start">
        
        {/* View Trash */}
        <Button
          variant="outline"
          className="h-[38px] sm:h-[44px] rounded-[12px] px-3 sm:px-4 flex items-center gap-2 text-[#767676] border-[#E6E7EC] text-[13px] sm:text-[15px] font-[500]"
          onClick={() => router.push("/branches/trash")}
        >
          <Trash2 size={18} className="text-[#767676]" />
          View Trash
        </Button>

        {/* Import */}
        <Button
          variant="outline"
          className="h-[38px] sm:h-[44px] rounded-[12px] px-3 sm:px-4 flex items-center gap-2 border-[#E6E7EC] text-[13px] sm:text-[15px] font-[500] text-[#767676]"
          onClick={() => setOpen(true)}
        >
          <Download size={18} className="text-[#767676]" />
          Import
          <HelpCircle size={16} className="text-[#767676]" />
        </Button>

        {/* Create Branch */}
        <Button
          className="h-[38px] sm:h-[44px] rounded-[12px] px-4 sm:px-5 flex items-center gap-2 bg-primary hover:bg-red-700 text-white text-[13px] sm:text-[15px] font-[500]"
          onClick={() => setCreateBranch(true)}
        >
          <PlusCircle size={18} color="#fff" />
          Create Branch
        </Button>

      </div>

      <ImportModal open={open} onOpenChange={setOpen} />
      <CreateBranchModal open={createBranch} onOpenChange={setCreateBranch} />
    </div>
  );
}
