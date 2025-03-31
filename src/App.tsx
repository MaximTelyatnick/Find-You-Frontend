import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Access from "./pages/Access";
import Cities from "./pages/Cities";
import Delete from "./pages/Delete";
import Tags from "./pages/Tags";
import Recovery from "./pages/Recovery";
import Registration from "./pages/Registration";
import AccountPage from "./pages/AccountPage";
import Order from "./pages/Order";
import Favorites from "./pages/Favorites";
import Comments from "./pages/Comments";
import About from "./pages/About";
import Messages from "./pages/Messages";
import Admin from "./pages/Admin";
import Mirrors from "./pages/Mirrors";
import Referral from "./pages/Referral";
import Refusual from "./pages/Refusual";
import useSecurityRestrictions from "./utils/useSecurity";
import Bypassing from "./pages/Bypassing";
import AdminOrders from "./pages/AdminOrders";
import AdminReports from "./pages/AdminReports";
import AdminUsers from "./pages/AdminUsers";
import AdminAccounts from "./pages/AdminAccounts";
import AdminSections from "./pages/AdminSections";


const App = () => {
   // useSecurityRestrictions(); // Вызываем хук внутри компонента

   return (
      <BrowserRouter>
         <Routes>
            <Route path="/" element={<Home />} />
            <Route path="access" element={<Access />} />
            <Route path="cities" element={<Cities />} />
            <Route path="tags" element={<Tags />} />
            <Route path="order" element={<Order />} />
            <Route path="delete" element={<Delete />} />
            <Route path="mirrors" element={<Mirrors />} />
            <Route path="about" element={<About />} />
            <Route path="referral" element={<Referral />} />
            <Route path="refusual" element={<Refusual />} />
            <Route path="bypassing" element={<Bypassing />} />
            <Route path="recovery" element={<Recovery />} />
            <Route path="registration" element={<Registration />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="comments" element={<Comments />} />
            <Route path="messages" element={<Messages />} />
            <Route path="admin" element={<Admin />} />
            <Route path="admin-orders" element={<AdminOrders />} />
            <Route path="admin-reports" element={<AdminReports />} />
            <Route path="admin-users" element={<AdminUsers />} />
            <Route path="admin-accounts" element={<AdminAccounts />} />
            <Route path="admin-sections" element={<AdminSections />} />
            <Route path="/:accountId" element={<AccountPage />} />
         </Routes>
      </BrowserRouter>
   );
};

export default App;
