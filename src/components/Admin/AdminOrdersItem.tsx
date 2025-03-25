import { useState } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { IAdminOrdersItemProps } from "../../types/Admin";
import { IOrderState } from "../../types/IOrder";
import IUser from "../../types/IUser";

const AdminOrdersItem = ({ id, text, created_at, status, setResult }: IAdminOrdersItemProps) => {
   const apiUrl = 'http://167.86.84.197/api/update-orders'
   const apiUrlDelete = 'http://167.86.84.197/api/delete-orders'
   const statusArr: string[] = [
      'Отклонена',
      'Новое',
      'Принята'
   ]
   const [active, setActive] = useState<boolean>(false)
   const [selected, setSelecetd] = useState<number>(status)
   const [error, setError] = useState<string>('')
   const [seccess, setSeccess] = useState<boolean>(false)
   const storedUser = localStorage.getItem('user');
   const user: IUser | null = storedUser ? JSON.parse(storedUser) : null;

   const setSelecetdHandler = async (num: number) => {
      try {
         setError('')

         await axios.put(apiUrl, {
            id: id,
            status: num
         })

         setSelecetd(num)
         setResult((prev: IOrderState) => ({
            ...prev,
            items: prev.items && [...prev.items].map(item => {
               if (item.id == id) {
                  item.status = num
               }
               return item
            })
         }))
         setSeccess(true)
      } catch (error) {
         setError('Произошла ошибка при смене статуса')
      }
      setActive(false)
   }

   const deleteHandler = async () => {
      try {
         setError('')

         await axios.post(apiUrlDelete, {
            id: id,
            user_id: user?.id,
         })

         setResult((prev: IOrderState) => ({
            ...prev,
            items: prev.items && [...prev.items].filter(item => item.id != id)
         }))

      } catch (error) {
         setError('Что-то пошло не так, попробуйте ещё раз!')
      }
   }

   const dropdownHandler = () => {
      setActive(prev => !prev)
   }

   return (
      <div>
         {error && <p style={{ color: 'red' }}>{error}</p>}
         {seccess && <p style={{ color: 'green' }}>Смена статуса прошла успешно</p>}
         <div className="admin-order-item">
            <p className="order-item__text">{text}</p>
            <p className="order-item__time">{dayjs(new Date(created_at)).format("DD.MM.YYYY: hh-mm")}</p>
            <div className={`admin-order-dropdown ${active && 'active'}`}>
               <div onClick={dropdownHandler} className={`admin-order-dropdown__button order-item__status order-item__${selected}`}>{statusArr[selected]}</div>
               <div className="admin-order-dropdown__main">
                  <div className="admin-order-dropdown__item order-item__status order-item__1" onClick={() => { setSelecetdHandler(1) }}>Новое</div>
                  <div className="admin-order-dropdown__item order-item__status order-item__2" onClick={() => { setSelecetdHandler(2) }}>Принято</div>
                  <div className="admin-order-dropdown__item order-item__status order-item__0" onClick={() => { setSelecetdHandler(0) }}>Отклонена</div>
               </div>
            </div>
            <svg onClick={deleteHandler} className="admin-order-item__bin" width="30" height="30" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M55.4166 11.6667H45.2083L42.2916 8.75H27.7083L24.7916 11.6667H14.5833V17.5H55.4166M17.5 55.4167C17.5 56.9638 18.1146 58.4475 19.2085 59.5415C20.3025 60.6354 21.7862 61.25 23.3333 61.25H46.6666C48.2137 61.25 49.6975 60.6354 50.7914 59.5415C51.8854 58.4475 52.5 56.9638 52.5 55.4167V20.4167H17.5V55.4167Z" fill="#E36F6F" />
            </svg>
         </div>
      </div>
   )
}

export default AdminOrdersItem