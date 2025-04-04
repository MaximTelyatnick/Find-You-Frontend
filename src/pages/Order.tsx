import OrderMain from "../components/Order/OrderMain"
import Footer from "../components/UX/Footer"
import GradientHeader from "../components/UX/GradientHeader"
import Header from "../components/UX/Header"

const Order = () => {
   return (
      <>
         <Header activeLink="Orders" />
         <GradientHeader logoPath="ЗАКАЗЫ" />
         <OrderMain />
         <Footer />
      </>
   )
}

export default Order