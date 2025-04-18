import { useState, useEffect } from "react"
import axios from "axios"
import { IAdminUser, IAdminUserToolbar } from "../../types/Admin"
import IUser from "../../types/IUser"

const AdminUsersToolbar = ({ setResult, setSelected, userId }: IAdminUserToolbar) => {
   const apiUrlAddRole = `http://167.86.84.197:5000/add-role`
   const apiUrlResetSession = `http://167.86.84.197:5000/reset-session`
   const [role, setRole] = useState<string>('user')
   const [error, setError] = useState<string>('')
   const [success, setSuccess] = useState<string>('')
   const [canEditRole, setCanEditRole] = useState<boolean>(true)

   const storedUser = localStorage.getItem('user');
   const currentUser: IUser | null = storedUser ? JSON.parse(storedUser) : null;

   // Получаем текущего выбранного пользователя
   useEffect(() => {
      if (userId) {
         // Получаем информацию о выбранном пользователе через API
         const fetchUserInfo = async () => {
            try {
               const response = await axios.get(`http://167.86.84.197:5000/get-role?user_id=${userId}`);
               const selectedUser = response.data;

               // Если текущий пользователь - модератор и выбранный пользователь модератор или админ
               if (currentUser?.role === 'moder' &&
                  selectedUser &&
                  (selectedUser.name === 'moder' || selectedUser.name === 'admin')) {
                  setCanEditRole(false);
                  setError('Модераторам запрещено изменять права других модераторов и админов');
               } else {
                  setCanEditRole(true);
                  setError('');
               }
            } catch (err) {
               console.error("Ошибка при получении информации о пользователе:", err);
            }
         };

         fetchUserInfo();
      }
   }, [userId]);

   const editRole = async () => {
      try {
         setError('')
         setSuccess('')

         // Получаем актуальную информацию о пользователе перед изменением роли
         const userResponse = await axios.get(`http://167.86.84.197:5000/get-role?user_id=${userId}`);
         const selectedUser = userResponse.data;

         // Дополнительная проверка прав перед отправкой запроса
         if (currentUser?.role === 'moder' &&
            (selectedUser.name === 'moder' || selectedUser.name === 'admin')) {
            setError('Модераторам запрещено изменять права других модераторов и админов');
            return;
         }

         // 1. Меняем роль пользователя
         const res = await axios.post(apiUrlAddRole, {
            user_id: userId,
            role_name: role,
         })

         // 2. Сбрасываем сессию пользователя, чтобы заставить его перелогиниться
         await axios.post(apiUrlResetSession, {
            user_id: userId
         });

         // 3. Обновляем UI
         setResult((prev: IAdminUser[]) => prev.map(item => {
            if (item.id == userId) {
               return { ...item, role: res.data.data ? res.data.data.name : 'Пользователь' };
            }
            return item;
         }));

         // Обновить выбранного пользователя
         const updatedRole = res.data.data ? res.data.data.name : 'Пользователь';
         setSelected((prev: IAdminUser[]) => {
            return prev.map(user => {
               if (user.id === userId) {
                  return { ...user, role: updatedRole };
               }
               return user;
            });
         });

         setSuccess('Роль успешно задана. Пользователь будет вынужден перелогиниться.');
      } catch (error) {
         setError('Что-то пошло не так при смене роли, попробуйте ещё раз!');
      }
   }

   return (
      <>
         {error && <p style={{ color: 'red' }}>{error}</p>}
         {success && <p style={{ color: 'green' }}>{success}</p>}
         <div className="admin-users-toolbar">
            <div className="admin-users-toolbar__form">
               <select
                  className="btn"
                  onChange={(e) => { setRole(e.currentTarget.value) }}
                  disabled={!canEditRole}
               >
                  <option value="user">Пользователь</option>
                  <option value="subscriber">Подписка</option>
                  {currentUser?.role === 'admin' && <>
                     <option value="moder">Модератор</option>
                     <option value="admin">Админ</option>
                  </>}
               </select>
               <button
                  className="btn btn-info"
                  onClick={editRole}
                  disabled={!canEditRole}
               >
                  Установить роль
               </button>
            </div>
         </div>
      </>
   )
}

export default AdminUsersToolbar