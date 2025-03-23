import AdminMain from "../components/Admin/AdminMain"
import Footer from "../components/UX/Footer"
import GradientHeader from "../components/UX/GradientHeader"
import Header from "../components/UX/Header"

const Admin = () => {
   return (
      <>
         <Header activeLink="" />
         <GradientHeader logoPath="ADMIN" />
         <AdminMain />
         <Footer />
      </>
   )
}

export default Admin

