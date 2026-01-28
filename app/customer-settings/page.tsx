import Container from "@/components/container";
import StatsSection from "@/components/customer-settings/stats-section";
import Table from "@/components/customer-settings/table";
import Header from "@/components/customer-settings/header";
import BranchFilters from "@/components/branches/BranchFilters";

const CustomerSettingsPage = () => {
    return (
        <Container>
            <Header
                title="Customer List"
                description="View and manage all customers from here"
            />
            <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm space-y-6">
                <StatsSection />

                <BranchFilters />


                <Table />
            </div>

           
        </Container>
    );
};

export default CustomerSettingsPage;
