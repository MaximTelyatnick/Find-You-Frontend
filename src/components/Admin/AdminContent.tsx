import axios from "axios"
import { useEffect, useState } from "react"
import IUser from "../../types/IUser";
import IUserRole from "../../types/IUserRole";
import AdminOrders from "./AdminOrders";
import AdminUsers from "./AdminUsers";
import AdminReports from "./AdminReports";
import AdminAccounts from "./AdminAccounts";
import AdminSections from "./AdminSections";

const AdminContent = () => {
   const storedUser = localStorage.getItem('user');
   const user: IUser | null = storedUser ? JSON.parse(storedUser) : null;

   console.log(user);

   return (
      <>
         {user?.role != 'admin' && user?.role != 'moder' && <p>У вас нет прав</p>}
         {user?.role == 'admin' || user?.role == 'moder' ? <div>
            <AdminOrders />
            <AdminUsers />
            <AdminReports />
            <AdminAccounts />
            <AdminSections />
         </div> : ''}
      </>
   )
}

export default AdminContent