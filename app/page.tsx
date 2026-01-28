import Container from "../components/container";
import AnalyticsGrid from "@/components/dashboard/order-trend-section";
import RevenueAnalytics from "@/components/dashboard/revenue-trend-section";
import StatsSection from "@/components/shared/stats-section";
import Header from "@/components/header";
import { managementData, statsData } from "@/constants/dashboard";
import ManagementSection from "@/components/dashboard/ManagementSection";

export default function Home() {
    return (
        <Container>
            
 <Header
  title="Dashboard Overview"
  description={
    <>
      Welcome back! Here's what's happening today. <br />
      Last updated: Just now{" "}
      <span className="text-xl align-middle">•</span>
      <span className="inline-block w-2.5 h-2.5 rounded-full bg-green mx-2 align-middle" />
      Live sync active
    </>
  }
/>


            <StatsSection
                stats={statsData}
                className="xl:grid-cols-4"
            />
<ManagementSection items={managementData} />
            <AnalyticsGrid />
          
            <RevenueAnalytics />
        </Container>
    )
}
