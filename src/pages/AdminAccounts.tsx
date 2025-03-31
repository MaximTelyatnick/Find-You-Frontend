import AdminAccountsMain from "../components/Admin/AdminAccounts/AdminAccountsMain"
import Footer from "../components/UX/Footer"
import GradientHeader from "../components/UX/GradientHeader"
import Header from "../components/UX/Header"

const AdminAccounts = () => {
   return (
      <>
         <Header activeLink="" />
         <GradientHeader logoPath="ADMIN &raquo; АККАУНТЫ" />
         <AdminAccountsMain />
         <Footer />
      </>
   )
}

export default AdminAccounts