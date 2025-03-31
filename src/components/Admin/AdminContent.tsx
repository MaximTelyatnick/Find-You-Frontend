import { useNavigate } from "react-router-dom";
import IUser from "../../types/IUser";

const AdminContent = () => {
   const storedUser = localStorage.getItem('user');
   const user: IUser | null = storedUser ? JSON.parse(storedUser) : null;
   const navigate = useNavigate()

   return (
      <>
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
      </>
   )
}

export default AdminContent