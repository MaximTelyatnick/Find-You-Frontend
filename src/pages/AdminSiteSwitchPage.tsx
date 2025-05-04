import AdminSiteSwitch from "../components/Admin/AdminSiteSwitch/AdminSiteSwitch";
import Footer from "../components/UX/Footer";
import GradientHeader from "../components/UX/GradientHeader";
import Header from "../components/UX/Header";
import AdminLayout from "../components/Admin/AdminLayout";

const AdminSiteSwitchPage = () => {
   return (
      <>
         <Header activeLink="" />
         <GradientHeader logoPath="ADMIN &raquo; ОТОБРАЖЕНИЕ КОНТЕНТА" />
         <AdminLayout title="Управление отображением сайта">
            <AdminSiteSwitch />
         </AdminLayout>
         <Footer />
      </>
   );
};

export default AdminSiteSwitchPage;