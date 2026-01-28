import Container from "../../components/container";
import Filters from "@/components/products/filter";
import Header from "@/components/header"
import StatsSection from "@/components/shared/stats-section";
import PaginationSection from "@/components/pagination";
import ProductInventoryStats from "@/components/products/product-inventory-stats";
import Table from "./table";
import { stats } from "@/constants/products";

const ProductsPage = () => {
    return (
        <Container>
            <Header
                title="Product Overview"
                description="Monitor product availability across the platform"
            />

            <StatsSection
                stats={stats}
                className="md:grid-cols-3"
            />

            <div className="bg-white lg:p-[30px] space-y-[30px] rounded-[14px]">
                <ProductInventoryStats />
                <Filters />
                <Table />
            </div>

            <PaginationSection />
        </Container>
    )
}

export default ProductsPage