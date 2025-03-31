import AdminReportsMain from "../components/Admin/AdminReports/AdminReportsMain"
import Footer from "../components/UX/Footer"
import GradientHeader from "../components/UX/GradientHeader"
import Header from "../components/UX/Header"

const AdminReports = () => {
   return (
      <>
         <Header activeLink="" />
         <GradientHeader logoPath="ADMIN &raquo; ЖАЛОБЫ" />
         <AdminReportsMain />
         <Footer />
      </>
   )
}

export default AdminReports