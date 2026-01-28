import Container from "../../components/container";
import CustomersTable from "@/components/customers/table";
import StatsSection from "@/components/shared/stats-section";
import Filters from "@/components/filter";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/pagination";
import { statsData } from "@/constants/customer";
import CustomerDetailsDialog from "@/components/dialogs/customer-details-dialog";

const WorldWideCustomerPage = () => {
    return (
        <Container>
            <StatsSection
                stats={statsData}
                className="xl:grid-cols-4"
            />

            <Header
                title="Worldwide Customers"
                description="View customer distribution across global regions"
            />

            <div className="bg-white lg:p-[24px] rounded-[14px] space-y-[30px]">
                <Filters />

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

                <CustomersTable />
            </div>

            <Pagination />
        </Container>
    )
}

export default WorldWideCustomerPage;