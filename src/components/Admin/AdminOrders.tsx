import { useEffect, useState } from "react"
import fetchData from "../../services/fetchData"
import { IOrderState } from "../../types/IOrder"
import Title from "../UX/Title"
import AdminOrdersItem from "./AdminOrdersItem"
import IUser from "../../types/IUser"
import DatePicker from "react-datepicker"
import { ru } from "date-fns/locale"

const AdminOrders = () => {
   const storedUser = localStorage.getItem('user');
   const user: IUser | null = storedUser ? JSON.parse(storedUser) : null;
   const apiUrl = `http://167.86.84.197:5000/get-admin-orders?user_id=${user?.id}`
   const [result, setResult] = useState<IOrderState>({
      items: null,
      loading: false,
      error: false,
   })
   const [filter, setFilter] = useState<string>('')
   const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
   const [startDate, endDate] = dateRange;

   const setFilterHandler = (str: string) => {
      setFilter(str)
   }

   const getOrders = async (url: string) => {
      await fetchData('get', url, setResult)
   }

   useEffect(() => {
      getOrders(apiUrl)
   }, [])

   useEffect(() => {
      if (dateRange.length && dateRange[0] && dateRange[1]) {
         console.log(`start_date=${new Date(dateRange[0]).toLocaleDateString()}&end_date=${new Date(dateRange[1]).toLocaleDateString()}`);

         getOrders(`${apiUrl}&start_date=${new Date(dateRange[0]).toLocaleDateString()}&end_date=${new Date(dateRange[1]).toLocaleDateString()}`)
      }
   }, [dateRange])

   return (
      <div className="admin-order">
         <Title classes='pt'>Заказы</Title>
         {result.loading && <div className="loader">
            <div className="loader__circle"></div>
         </div>}
         <div className="admin-order__header">
            <div className="admin-order__buttons">
               <button className="btn admin-order__button" onClick={() => { setFilterHandler('') }}>
                  Все
               </button>
               <button className="btn admin-order__button" onClick={() => { setFilterHandler('add') }}>
                  Заказы
               </button>
               <button className="btn admin-order__button" onClick={() => { setFilterHandler('delete') }}>
                  Удаление
               </button>
               <button className="btn admin-order__button" onClick={() => { setFilterHandler('1') }}>
                  Новое
               </button>
               <button className="btn admin-order__button" onClick={() => { setFilterHandler('2') }}>
                  Принято
               </button>
               <button className="btn admin-order__button" onClick={() => { setFilterHandler('0') }}>
                  Отклонена
               </button>
               <button className="btn admin-order__button" onClick={() => { setFilterHandler('new') }}>
                  Сначала новые
               </button>
               <button className="btn admin-order__button" onClick={() => { setFilterHandler('old') }}>
                  Сначала старые
               </button>
            </div>
            <div className="admin-order__datepicker">
               <DatePicker
                  selected={startDate}
                  onChange={(update) => setDateRange(update)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Выберите дату"
                  locale={ru}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  inline
               />
            </div>
         </div>
         <div className="admin-order__items">
            {!result.items && <p>Ещё нет заказов</p>}
            {result.error && <p>Что-то пошло не так, попробуйте ещё раз</p>}
            {result.items && result.items.filter(item => {
               if (filter == 'add') {
                  return item.type == 'add'
               } else if (filter == 'delete') {
                  return item.type == 'delete'
               } else if (filter == '1') {
                  return item.status == 1
               } else if (filter == '2') {
                  return item.status == 2
               } else if (filter == '0') {
                  return item.status == 0
               }
               return item
            }).sort((a, b) => {
               if (filter == 'new') {
                  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
               } else if (filter == 'old') {
                  return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
               }
               return 0
            }).map(item => (
               <AdminOrdersItem {...item} setResult={setResult} key={item.id} />
            ))}
         </div>
      </div>
   )
}

export default AdminOrders