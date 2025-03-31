import AdminSectionsMain from "../components/Admin/AdminSections/AdminSectionsMain"
import Footer from "../components/UX/Footer"
import GradientHeader from "../components/UX/GradientHeader"
import Header from "../components/UX/Header"

const AdminSections = () => {
   return (
      <>
         <Header activeLink="" />
         <GradientHeader logoPath="ADMIN &raquo; СЕКЦИИ" />
         <AdminSectionsMain />
         <Footer />
      </>
   )
}

export default AdminSections