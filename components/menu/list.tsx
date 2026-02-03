'use client';
import { useState } from "react";
import { menus } from "@/constants/menu";
import BranchCard from "../cards/BranchCard";
import EmptyState from "../shared/EmptyState";
import { useRouter } from "next/navigation";

export default function MenuList() {
  const router = useRouter();
  if (!menus || menus.length === 0) {
    return (
      <EmptyState
        
      />
    );
  }

  return (
    <div className="space-y-3 min-h-[40vh]">
      {menus.map((menu) => (
        <BranchCard
          key={menu.id}
          id={menu.id}
          name={menu.name}
          isDefault={menu.isDefault}
          openMenuDetails={()=> router.push('/menu/listing')} 
        />
      ))}

     
    </div>
  );
}
