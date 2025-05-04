import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IUser from "../../types/IUser";
import Title from "../UX/Title";
import UpButton from "../UX/UpButton";
import LoginModal from "../UX/modals/LoginModal";

interface AdminLayoutProps {
   children: React.ReactNode;
   title?: string;
}

const AdminLayout = ({ children, title = "Админ панель" }: AdminLayoutProps) => {
   const [isOpenLogin, setIsOpenLogin] = useState<boolean>(true);
   const [user, setUser] = useState<IUser | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   const navigate = useNavigate();

   useEffect(() => {
      // Получаем пользователя из localStorage
      const getUserFromStorage = () => {
         const storedUser = localStorage.getItem('user');
         return storedUser ? JSON.parse(storedUser) : null;
      };

      // Установка начального состояния
      setUser(getUserFromStorage());
      setIsLoading(false);

      const handleStorageChange = () => {
         setUser(getUserFromStorage());
      };

      // Создаем собственное событие для отслеживания изменений в localStorage
      window.addEventListener('storage-updated', handleStorageChange);

      return () => {
         window.removeEventListener('storage-updated', handleStorageChange);
      };
   }, []);

   // Проверка роли пользователя
   const isAdmin = user && (user.role === 'admin' || user.role === 'moder');
   // Только пользователь со статусом admin (не moder) может управлять статусом сайта
   const isSuperAdmin = user && user.role === 'admin';

   const renderContent = () => {
      if (isLoading) {
         return <div>Загрузка...</div>;
      }

      if (!user) {
         // Неавторизованный пользователь - показываем модалку логина
         return <LoginModal isOpen={isOpenLogin} setIsOpen={setIsOpenLogin}><div style={{ display: 'none' }}></div></LoginModal>;
      }

      if (!isAdmin) {
         // Авторизованный пользователь без прав
         return <p>У вас нет прав</p>;
      }

      // Авторизованный админ или модер
      return (
         <>
            <div className="admin-header">
               <h2>Добро пожаловать, {user.login} ({user.role})</h2>
            </div>
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
               {/* Кнопка доступна только для суперадмина (роль "admin") */}
               {isSuperAdmin && (
                  <div className="btn" onClick={() => { navigate('/admin-site-switch') }}>
                     Отображение контента
                  </div>
               )}
            </div>
            {children}
         </>
      );
   };

   return (
      <div className="layout-container">
         <div>
            <UpButton />
            <div className="layout-row">
               <div className="col-10">
                  <div id="dle-content">
                     <Title classes='pt'>{title}</Title>
                     {renderContent()}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default AdminLayout;