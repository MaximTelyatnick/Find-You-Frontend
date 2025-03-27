import IUser from "../../types/IUser";
import AdminOrders from "./AdminOrders";
import AdminUsers from "./AdminUsers";
import AdminReports from "./AdminReports";
import AdminAccounts from "./AdminAccounts";
import AdminSections from "./AdminSections";
import { useState } from "react";

const AdminContent = () => {
   const storedUser = localStorage.getItem('user');
   const user: IUser | null = storedUser ? JSON.parse(storedUser) : null;
   const [visiblePage, setVisiblePage] = useState<string>('')

   return (
      <>
         {user?.role != 'admin' && user?.role != 'moder' && <p>У вас нет прав</p>}
         {user?.role == 'admin' || user?.role == 'moder' ? <div>
            <div className="admin">
               <div className="btn" onClick={() => { setVisiblePage('Заказы') }}>
                  Заказы
               </div>
               <div className="btn" onClick={() => { setVisiblePage('Пользователи') }}>
                  Пользователи
               </div>
               <div className="btn" onClick={() => { setVisiblePage('Жалобы') }}>
                  Жалобы
               </div>
               <div className="btn" onClick={() => { setVisiblePage('Аккаунты') }}>
                  Аккаунты
               </div>
               <div className="btn" onClick={() => { setVisiblePage('Секции') }}>
                  Секции
               </div>
            </div>
            {visiblePage == 'Заказы' && <AdminOrders />}
            {visiblePage == 'Пользователи' && <AdminUsers />}
            {visiblePage == 'Жалобы' && <AdminReports />}
            {visiblePage == 'Аккаунты' && <AdminAccounts />}
            {visiblePage == 'Секции' && <AdminSections />}
         </div> : ''}
      </>
   )
}

export default AdminContent