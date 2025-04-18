import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import IUser from "../../types/IUser";

const AdminContent = () => {
   const [user, setUser] = useState<IUser | null>(null);
   const navigate = useNavigate();

   useEffect(() => {
      // Получаем пользователя из localStorage
      const getUserFromStorage = () => {
         const storedUser = localStorage.getItem('user');
         return storedUser ? JSON.parse(storedUser) : null;
      };

      // Установка начального состояния
      setUser(getUserFromStorage());

      // Слушатель события для обновления данных пользователя при изменении localStorage
      const handleStorageChange = () => {
         setUser(getUserFromStorage());
      };

      // Создаем собственное событие для отслеживания изменений в localStorage
      window.addEventListener('storage-updated', handleStorageChange);

      // Также проверяем localStorage каждые 500 мс (как запасной вариант)
      const interval = setInterval(() => {
         const currentUser = getUserFromStorage();
         if (JSON.stringify(currentUser) !== JSON.stringify(user)) {
            setUser(currentUser);
         }
      }, 500);

      return () => {
         window.removeEventListener('storage-updated', handleStorageChange);
         clearInterval(interval);
      };
   }, []);

   return (
      <>
         {(!user || (user.role !== 'admin' && user.role !== 'moder')) && (
            <p>У вас нет прав</p>
         )}

         {user && (user.role === 'admin' || user.role === 'moder') && (
            <div>
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
            </div>
         )}
      </>
   );
};

export default AdminContent;