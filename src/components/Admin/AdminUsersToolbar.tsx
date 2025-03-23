import { useState } from "react"
import axios from "axios"
import { IAdminUserState, IAdminUserToolbar } from "../../types/Admin"
import IUser from "../../types/IUser"

const AdminUsersToolbar = ({ setResult, userId }: IAdminUserToolbar) => {

   const apiUrlDelete = 'http://localhost:5000/delete-user'
   const apiUrlAddRole = `http://localhost:5000/add-role`

   const [role, setRole] = useState<string>('user')
   const [error, setError] = useState<string>('')
   const [seccess, setSeccess] = useState<string>('')
   const storedUser = localStorage.getItem('user');
   const user: IUser | null = storedUser ? JSON.parse(storedUser) : null;

   const deleteHandler = async () => {
      try {
         setError('')
         setSeccess('')

         await axios.delete(apiUrlDelete, {
            data: {
               user_id: userId,
            }
         })

         setResult({
            items: null,
            error: false,
            loading: false,
         })

         setSeccess('Пользователь успешно удален')
      } catch (error) {
         setError('Что-то пошло не так при удалении, попробуйте ещё раз!')
      }
   }

   const editRole = async () => {
      try {
         setError('')
         setSeccess('')

         const res = await axios.post(apiUrlAddRole, {
            user_id: userId,
            role_name: role,
         })

         setResult((prev: IAdminUserState) => ({
            ...prev,
            items: {
               ...prev.items,
               role: !!res.data.data ? res.data.data.name : 'Пользователь'
            }
         }))

         setSeccess('Роль успешно задана')
      } catch (error) {
         setError('Что-то пошло не так при смене роли, попробуйте ещё раз!')
      }
   }

   return (
      <>
         {error && <p style={{ color: 'red' }}>{error}</p>}
         {seccess && <p style={{ color: 'green' }}>{seccess}</p>}
         <div className="admin-users-toolbar">
            <div className="admin-users-toolbar__form">
               <select className="btn" name="" id="" onChange={(e) => { setRole(e.currentTarget.value) }}>
                  <option value="user">Пользователь</option>
                  <option value="subscriber">Подписка</option>
                  {user?.role == 'admin' && <>
                     <option value="moder">Модератор</option>
                     <option value="admin">Админ</option>
                  </>}
               </select>
               <button className="btn btn-info" onClick={editRole}>Установить роль</button>
            </div>
            <div className="admin-users-toolbar__bin">
               <svg onClick={deleteHandler} className="admin-order-item__bin" width="30" height="30" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M55.4166 11.6667H45.2083L42.2916 8.75H27.7083L24.7916 11.6667H14.5833V17.5H55.4166M17.5 55.4167C17.5 56.9638 18.1146 58.4475 19.2085 59.5415C20.3025 60.6354 21.7862 61.25 23.3333 61.25H46.6666C48.2137 61.25 49.6975 60.6354 50.7914 59.5415C51.8854 58.4475 52.5 56.9638 52.5 55.4167V20.4167H17.5V55.4167Z" fill="#E36F6F" />
               </svg>
            </div>
         </div>
      </>
   )
}

export default AdminUsersToolbar