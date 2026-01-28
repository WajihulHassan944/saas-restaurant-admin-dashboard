import Container from "@/components/container";
import StatsSection from "@/components/employee-settings/stats-section";
import Table from "@/components/employee-settings/table";
import Header from "@/components/employee-settings/header";
import BranchFilters from "@/components/branches/BranchFilters";
import { Button } from "@/components/ui/button";

const EmployeesSettingsPage = () => {
    return (
        <Container>
            <Header
                title="Employee List"
                description="Manage and view all invited employee in one place"
            />
            <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm space-y-6">
                <StatsSection />

                <BranchFilters />
<div className="space-x-4 pl-4 lg:pl-6">
                    <Button
                        variant="primary"
                        className="rounded-[14px] w-full lg:w-auto"
                    >
                        Employees
                    </Button>

                    <Button
                        variant="ghost"
                        className="font-semibold text-base text-gray w-full lg:w-auto"
                    >
                        Send Invitations
                    </Button>
                </div>

                <Table />
            </div>

           
        </Container>
    );
};

export default EmployeesSettingsPage;
