
import AdminOrdersMain from "../components/Admin/AdminOrders/AdminOrdersMain"
import Footer from "../components/UX/Footer"
import GradientHeader from "../components/UX/GradientHeader"
import Header from "../components/UX/Header"

const AdminOrders = () => {
   return (
      <>
         <Header activeLink="" />
         <GradientHeader logoPath="ADMIN &raquo; ЗАКАЗЫ" />
         <AdminOrdersMain />
         <Footer />
      </>
   )
}

export default AdminOrders

