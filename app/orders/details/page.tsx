'use client'

import OrderDetailsMain from "@/components/orders/details/OrderDetails"
import OrderDetailsHeader from "@/components/orders/details/OrderDetailsHeader"
import OrderTrackingSection from "@/components/orders/details/OrderTrackingSection"
import UserProfile from "@/components/orders/details/UserProfile"

export default function OrderDetails() {
  const order = {
    id: "5552351",
    status: "On Delivery",
    estimatedTime: "4-6 mins",

    deliveryBy: {
      name: "Geovanny Van Houten",
      phone: "+51 5125 626 77",
      address: "Long Horn St. Avenue 351636 London",
    },

    customer: {
      name: "James Witwicky",
      role: "Customer",
    },

    items: [
      { name: "Watermelon juice with ice", qty: 1, price: 4.12 },
      { name: "Italiano pizza with garlic", qty: 1, price: 15.44 },
      { name: "Chicken curry special with cucumber", qty: 3, price: 14.99 },
    ],

    history: [
      { label: "Order Delivered", date: "-" },
      { label: "On Delivery", date: "Sat, 23 Jul 2020, 01:24 PM", active: true },
      { label: "Payment Success", date: "Fri, 22 Jul 2020, 10:44 AM" },
      { label: "Order Created", date: "Thu, 21 Jul 2020, 11:49 AM" },
    ],

    note:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",

    address: "6 The Avenue, London EC50 4GN",
  }

  return (
    <div className="min-h-screen bg-muted/40 p-6 w-full">
      <OrderDetailsHeader order={order} />
      <div className="flex flex-row w-full gap-10 ">
        <OrderTrackingSection order={order} />
        <UserProfile />
      </div>
      <OrderDetailsMain />
    </div>
  )
}
