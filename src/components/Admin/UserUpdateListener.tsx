import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserUpdateListener = () => {
   const navigate = useNavigate();

   useEffect(() => {
      // Обработчик события обновления пользователя
      const handleUserUpdated = () => {
         // Получаем обновленные данные пользователя
         const userStr = localStorage.getItem('user');
         if (!userStr) return;

         try {
            const user = JSON.parse(userStr);
            const currentPath = window.location.pathname;

            // Проверяем новую роль и перенаправляем при необходимости
            if ((user.role === 'admin' || user.role === 'moder') && !currentPath.startsWith('/admin')) {
               // Если пользователь стал админом или модератором и не в админ-панели
               navigate('/admin');
            } else if (!(user.role === 'admin' || user.role === 'moder') && currentPath.startsWith('/admin')) {
               // Если пользователь больше не админ, но находится в админ-панели
               navigate('/');
            }
         } catch (error) {
            console.error('Ошибка при обработке обновления пользователя:', error);
         }
      };

      // Обработчик события выхода из системы
      const handleUserLoggedOut = () => {
         navigate('/');
      };

      // Добавляем слушатели событий
      window.addEventListener('user-updated', handleUserUpdated);
      window.addEventListener('user-logged-out', handleUserLoggedOut);

      // Очищаем слушатели при размонтировании
      return () => {
         window.removeEventListener('user-updated', handleUserUpdated);
         window.removeEventListener('user-logged-out', handleUserLoggedOut);
      };
   }, [navigate]);

   // Этот компонент не рендерит ничего
   return null;
};

export default UserUpdateListener;