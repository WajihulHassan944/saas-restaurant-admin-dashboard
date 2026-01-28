import Container from "../../components/container";
import CustomerDetailsDialog from "@/components/dialogs/customer-details-dialog";
import Filters from "@/components/filter";
import RevenueGraph from "@/components/graphs/revenue-graph";
import Header from "@/components/header"
import OrdersTrendSection from "@/components/orders/order-trend-section";
import StatsSection from "@/components/shared/stats-section";
import OrdersTable from "@/components/orders/table";
import PaginationSection from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { stats } from "@/constants/orders";

const OrdersPage = () => {
    return (
        <Container>
            <Header
                title="Orders & Revenue Performance"
                description="View customer distribution across global regions"
            />

            <StatsSection
                stats={stats}
                className="md:grid-cols-2"
            />

            <div className="bg-white lg:p-[30px] space-y-[30px] rounded-[14px]">
                <OrdersTrendSection
                    type="orders"
                />

                <div className="max-w-[757px]">
                    <RevenueGraph
                        type="orders"
                    />
                </div>
            </div>

            <div className="bg-white lg:p-[30px] space-y-[30px] rounded-[14px]">
                <Filters
                    type="orders"
                />

                <div className="space-x-8 px-4 lg:pl-6">
                    <CustomerDetailsDialog>
                        <Button
                            variant="primary"
                            className="rounded-[14px] w-full lg:w-auto"
                        >
                            Active Customers
                        </Button>
                    </CustomerDetailsDialog>

                    <Button
                        variant="ghost"
                        className="font-semibold text-base text-gray w-full lg:w-auto"
                    >
                        Blocked Customers
                    </Button>
                </div>

                <OrdersTable />
            </div>

            <PaginationSection />
        </Container>
    )
}

export default OrdersPage