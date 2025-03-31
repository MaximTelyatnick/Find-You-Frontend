import { useNavigate } from "react-router-dom"
import Sidebar from "../../UX/sidebar/Sidebar"
import Title from "../../UX/Title"
import UpButton from "../../UX/UpButton"
import AdminReportsContent from "./AdminReportsContent"
import IUser from "../../../types/IUser"

const AdminReportsMain = () => {
   const storedUser = localStorage.getItem('user');
   const user: IUser | null = storedUser ? JSON.parse(storedUser) : null;
   const navigate = useNavigate()

   return (
      <div className="layout-container">
         <div>
            <UpButton />
            <div className="layout-row">
               <div className="col-10">
                  <div id="dle-content">
                     <Title classes='pt'>Админ панель</Title>
                     {user?.role != 'admin' && user?.role != 'moder' && <p>У вас нет прав</p>}
                     {user?.role == 'admin' || user?.role == 'moder' ? <div>
                        <div className="admin">
                           <div className="btn" onClick={() => { navigate('/admin-orders') }}>
                              Заказы
                           </div>
                           <div className="btn" onClick={() => { navigate('/admin-users') }}>
                              Пользователи
                           </div>
                           <div className="btn" onClick={() => { navigate('/admin-reports') }}>
                              Жалобы
                           </div>
                           <div className="btn" onClick={() => { navigate('/admin-accounts') }}>
                              Аккаунты
                           </div>
                           <div className="btn" onClick={() => { navigate('/admin-sections') }}>
                              Секции
                           </div>
                        </div>
                     </div> : ''}
                     <AdminReportsContent />
                  </div>
               </div>
               <Sidebar />
            </div>
         </div>
      </div>
   )
}

export default AdminReportsMain