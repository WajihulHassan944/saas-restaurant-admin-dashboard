'use client';
import { useState } from "react";
import { CheckCircle, UserPlus, DollarSign } from "lucide-react"; // Icons for different types of notifications
import { Card, CardContent, CardTitle } from "@/components/ui/card"; // ShadCN components

const notifications = [
  {
    id: 1,
    title: "New Reservation: Table 12",
    description: "Booking confirmed for 8:30 PM tonight. Birthday celebration request.",
    icon: <UserPlus />,
    type: "reservation", // Reservation type
    time: "2 mins ago",
  },
  {
    id: 2,
    title: "Payout Processed Successfully",
    description: "Transaction ID: #TR-99021 has been settled to your account.",
    icon: <DollarSign />,
    type: "payout", // Payout type
    time: "2 mins ago",
  },
  {
    id: 3,
    title: "Order Delivered: #124-343",
    description: "Order for table 4 has been delivered by the server.",
    icon: <CheckCircle />,
    type: "order", // Order type
    time: "10 mins ago",
  },
];

export default function Notifications() {
  const [selectedTab, setSelectedTab] = useState("all");

  const filteredNotifications =
    selectedTab === "all"
      ? notifications
      : notifications.filter((notification) => notification.type === selectedTab);

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="mb-4">
        <div className="flex space-x-4 border-b border-gray-200">
          <button
            className={`px-4 py-2 text-sm font-semibold ${selectedTab === "all" ? "text-primary" : "text-gray-600"} hover:text-primary`}
            onClick={() => setSelectedTab("all")}
          >
            All
          </button>
          <button
            className={`px-4 py-2 text-sm font-semibold ${selectedTab === "reservation" ? "text-primary" : "text-gray-600"} hover:text-primary`}
            onClick={() => setSelectedTab("reservation")}
          >
            Orders
          </button>
          <button
            className={`px-4 py-2 text-sm font-semibold ${selectedTab === "order" ? "text-primary" : "text-gray-600"} hover:text-primary`}
            onClick={() => setSelectedTab("order")}
          >
            Deliveries
          </button>
        </div>
      </div>

      {/* Notifications */}
      {filteredNotifications.map((notification) => (
        <Card key={notification.id} className="bg-white shadow-sm hover:shadow-lg transition-all">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary text-white rounded-full">
                {notification.icon}
              </div>
              <div>
                <CardTitle className="font-semibold text-gray-900 mb-2">{notification.title}</CardTitle>
                <p className="text-sm text-gray-500">{notification.description}</p>
              </div>
            </div>
            <span className="text-xs text-gray-400">{notification.time}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
