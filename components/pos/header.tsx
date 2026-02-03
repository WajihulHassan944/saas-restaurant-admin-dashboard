"use client";

import { Button } from "@/components/ui/button";
import Header from "../header";
import { useRouter } from "next/navigation";
import { useState } from "react";
import OngoingOrdersModal from "../modals/OngoingOrdersModal";
import HoldOrdersModal from "../modals/HoldOrdersModal";
import MakeReservationModal from "../modals/MakeReservationModal";

interface HeaderProps {
  title: string;
  description?: string;
}

export default function PosHeader({ title, description }: HeaderProps) {
  const router = useRouter();
const [openOngoingOrders, setOpenOngoingOrders] = useState(false);
const [openHoldOrders, setOpenHoldOrders] = useState(false);
const [openMakeReservation, setOpenMakeReservation] = useState(false);


  return (
    <div className="flex flex-col gap-4 md:gap-6 lg:flex-row lg:items-center lg:justify-between w-full">
      {/* LEFT SIDE (already correct) */}
      <Header title={title} description={description} />

      {/* RIGHT SIDE (matched with design) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        {/* Ongoing Orders */}
        <div className="relative">
          <Button
            variant="outline"
            className="rounded-[14px] px-6 font-medium text-[15px]"
             onClick={() => setOpenOngoingOrders(true)}
          >
            Ongoing Orders
          </Button>
          <span className="absolute -top-2 -right-2 size-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
            1
          </span>
        </div>

        {/* Hold Orders */}
        <div className="relative">
          <Button
            variant="outline"
            className="rounded-[14px] px-6 font-medium text-[15px]"
            onClick={() => setOpenHoldOrders(true)}
          >
            Hold Orders
          </Button>
          <span className="absolute -top-2 -right-2 size-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
            1
          </span>
        </div>

        {/* Make Reservation */}
        <Button
          className="rounded-[14px] px-4 py-2.5 bg-primary text-white font-medium hover:bg-primary/90 text-[15px]"
         onClick={() => setOpenMakeReservation(true)}
        >
          Make Reservation
        </Button>
      </div>

      <OngoingOrdersModal
  open={openOngoingOrders}
  onOpenChange={setOpenOngoingOrders}
/>
<HoldOrdersModal
  open={openHoldOrders}
  onOpenChange={setOpenHoldOrders}
/>
<MakeReservationModal
  open={openMakeReservation}
  onOpenChange={setOpenMakeReservation}
/>


    </div>
  );
}
