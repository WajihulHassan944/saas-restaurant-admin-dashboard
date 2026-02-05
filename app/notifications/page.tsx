import Container from "@/components/container";
import Header from "@/components/notifications/header";
import Notifications from "@/components/notifications/Notification";

const NotificationsPage = () => {
    return (
        <Container>
            <Header
                title="Notifications"
                description="Manage your restaurant alerts, updates, and customer activity."
            />
            <Notifications />
        </Container>
    );
};

export default NotificationsPage;
