import AdminUsersMain from "../components/Admin/AdminUsers/AdminUsersMain"
import Footer from "../components/UX/Footer"
import GradientHeader from "../components/UX/GradientHeader"
import Header from "../components/UX/Header"

const AdminUsers = () => {
   return (
      <>
         <Header activeLink="" />
         <GradientHeader logoPath="ADMIN &raquo; ПОЛЬЗОВАТЕЛИ" />
         <AdminUsersMain />
         <Footer />
      </>
   )
}

export default AdminUsers