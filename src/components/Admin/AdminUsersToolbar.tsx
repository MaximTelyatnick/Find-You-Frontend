import { useState } from "react"
import axios from "axios"
import { IAdminUser, IAdminUserToolbar } from "../../types/Admin"
import IUser from "../../types/IUser"

const AdminUsersToolbar = ({ setResult, setSelected, userId }: IAdminUserToolbar) => {
   const apiUrlAddRole = `http://167.86.84.197:5000/add-role`

   const [role, setRole] = useState<string>('user')
   const [error, setError] = useState<string>('')
   const [seccess, setSeccess] = useState<string>('')
   const storedUser = localStorage.getItem('user');
   const user: IUser | null = storedUser ? JSON.parse(storedUser) : null;

   const editRole = async () => {
      try {
         setError('')
         setSeccess('')

         const res = await axios.post(apiUrlAddRole, {
            user_id: userId,
            role_name: role,
         })

         setResult((prev: IAdminUser[]) => ([...prev].map(item => {
            if (item.id == userId) {
               item.role = !!res.data.data ? res.data.data.name : 'Пользователь'
            }
            return item
         })))
         setSelected((prev: IAdminUser[]) => ([{ ...prev[0], role: !!res.data.data ? res.data.data.name : 'Пользователь' }]))

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
         </div>
      </>
   )
}

export default AdminUsersToolbar