import Container from "@/components/container"
import AddDeliveryManHeader from "@/components/deliveryman/add/AddDeliveryManHeader"
import DeliveryManForm from "@/components/forms/deliveryman-form"

const AddDeliveryMan = () => {
    return (
        <Container> <AddDeliveryManHeader   title="Create New Delivery Man"
                description="View and manage all customers from here" />
        <DeliveryManForm /></Container>
    )
}

export default AddDeliveryMan