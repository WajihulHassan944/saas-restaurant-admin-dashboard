"use client";

import { useEffect, useState } from "react";
import Container from "@/components/container";
import NotificationsHeader from "@/components/notifications/header";
import Notifications from "@/components/notifications/Notification";
import useApi from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const NotificationsPage = () => {
  const { token } = useAuth();
  const { get, loading } = useApi(token);

  const [notifications, setNotifications] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState("all");

  const getStoredAuth = () => {
    const stored = localStorage.getItem("auth");
    if (!stored) return null;
    return JSON.parse(stored);
  };

  const fetchNotifications = async () => {
    const stored = getStoredAuth();
    const restaurantId = stored?.user?.restaurantId;

    if (!restaurantId) return;

    try {
      let url = `/v1/notifications?restaurantId=${restaurantId}`;

      if (selectedTab === "pending") {
        url += `&status=PENDING`;
      }

      const res = await get(url);
      if (!res) return;

      setNotifications(res?.data || []);
    } catch (err) {
      toast.error("Failed to fetch notifications");
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchNotifications();
  }, [token, selectedTab]);

  /* ✅ Check unread */
  const hasUnread = notifications.some(
    (n) => n.status === "PENDING"
  );

  return (
    <Container>
      <NotificationsHeader
        title="Notifications"
        description="Manage your restaurant alerts, updates, and customer activity."
        hasUnread={hasUnread}
        notifications={notifications}
        refetch={fetchNotifications}
      />

      <Notifications
        notifications={notifications}
        loading={loading}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
    </Container>
  );
};

export default NotificationsPage;