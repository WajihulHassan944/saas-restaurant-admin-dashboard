"use client"

import Container from "../../components/container";
import RevenueGraph from "@/components/graphs/revenue-graph";
import Header from "@/components/header"
import StatsSection from "@/components/shared/stats-section";
import OrdersGraph from "@/components/graphs/orders-graph";
import TopPerformingRestaurants from "../models/top-restaurants-section";
import { statsData } from "@/constants/analytics";
import Filter from "@/components/analytics/filter";

const AnalyticsPage = () => {
    return (
        <Container>
            <Header
                title="Reports & Analytics"
                description="Welcome back! Here's what's happening with your platform today."
            />

            <Filter />

            <StatsSection
                stats={statsData}
            />

            <OrdersGraph />

            <RevenueGraph
                type="analytics"
            />

            <TopPerformingRestaurants />

        </Container>
    )
}

export default AnalyticsPage