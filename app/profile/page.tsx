import Container from "../../components/container";
import SummarySection from "@/components/profile/address-info"
import BranchList from "@/components/profile/branch-list-section"
import Hero from "@/components/profile/hero"
import OrderAndRevenueSection from "@/components/profile/order-and-revenve-section"
import Header from "@/components/restaurants/header"

const ProfilePage = () => {
    return (
        <Container>
            <Header
                title="Profile Summary"
                description="View and manage all Restaurants from here"
                className="max-w-[466px]"
            />

            <div className="flex flex-col gap-[32px] w-full bg-white p-4 lg:p-[30px] rounded-[14px]">
                <Hero />
                <SummarySection />
                <OrderAndRevenueSection />
                <BranchList />
            </div>
        </Container>
    )
}

export default ProfilePage