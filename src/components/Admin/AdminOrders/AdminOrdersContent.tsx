import { useEffect, useState } from "react"
import fetchData from "../../../services/fetchData"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import { ru } from "date-fns/locale"
import IUser from "../../../types/IUser"
import { IAdminOrderState } from "../../../types/IOrder"
import Title from "../../UX/Title"
import AdminOrdersItem from "../AdminOrdersItem"
import Pagination from "../../UX/Pagination"
import { useSearchParams } from "react-router-dom"
import SendMessageModal from "../../UX/modals/SendMessageModal"

const AdminOrdersContent = () => {
   const storedUser = localStorage.getItem('user');
   const user: IUser | null = storedUser ? JSON.parse(storedUser) : null;
   let apiUrl: string = `http://167.86.84.197:5000/get-admin-orders?user_id=${user?.id}`
   const [result, setResult] = useState<IAdminOrderState>({
      items: null,
      loading: false,
      error: false,
   })
   const [filter, setFilter] = useState<string>('')
   const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
   const [startDate, endDate] = dateRange;
   const [searchParams] = useSearchParams();
   const page = Number(searchParams.get("page")) || 1;
   const [isOpenSend, setIsOpenSend] = useState<boolean>(false);
   const [responseLogin, setResponseLogin] = useState<string>('');
   const [highlightedDates, setHighlightedDates] = useState<Date[]>([]);

   const openSendMessageModal = (login: string) => {
      setResponseLogin(login);
      // Небольшая задержка для правильной последовательности установки state
      setTimeout(() => {
         setIsOpenSend(true);
      }, 10);
   };

   const setFilterHandler = (str: string) => {
      setFilter(str)
   }

   const getOrders = async (url?: string) => {
      if (!apiUrl.includes('page')) {
         apiUrl += `&page=${page}`
      }
      if (!apiUrl.includes('start_date') && url) {
         apiUrl += url
      }
      await fetchData('get', apiUrl, setResult)
   }

   // Функция для обработки изменения диапазона дат
   const handleDateRangeChange = (update: [Date | null, Date | null]) => {
      // Корректируем даты, чтобы исправить проблему с -1 днем
      const adjustedDates: [Date | null, Date | null] = [
         update[0] ? new Date(update[0].getTime()) : null,
         update[1] ? new Date(update[1].getTime()) : null
      ];

      setDateRange(adjustedDates);
   };

   useEffect(() => {
      getOrders()
   }, [page])

   useEffect(() => {
      if (dateRange.length && dateRange[0] && dateRange[1]) {
         getOrders(`&start_date=${new Date(dateRange[0]).toLocaleDateString()}&end_date=${new Date(dateRange[1]).toLocaleDateString()}`)
      }
   }, [dateRange])

   // Получаем даты заказов для подсветки
   useEffect(() => {
      if (result.items && result.items.data) {
         // Извлекаем даты из заказов для подсветки в календаре
         const dates = result.items.data
            .filter(order => order.created_at)
            .map(order => new Date(order.created_at));

         setHighlightedDates(dates);
      }
   }, [result.items]);

   // Кастомные заголовки для выбора месяца и года
   const renderCustomHeader = ({
      date,
      changeYear,
      changeMonth,
      decreaseMonth,
      increaseMonth,
      prevMonthButtonDisabled,
      nextMonthButtonDisabled
   }: any) => {
      const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);
      const months = [
         "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
         "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
      ];

      return (
         <div className="datepicker-header">
            <button
               type="button"
               onClick={decreaseMonth}
               disabled={prevMonthButtonDisabled}
               className="datepicker-nav-btn"
            >
               {"<"}
            </button>

            <div className="datepicker-selects">
               <select
                  value={date.getMonth()}
                  onChange={({ target: { value } }) => changeMonth(parseInt(value))}
                  className="datepicker-select"
               >
                  {months.map((month, i) => (
                     <option key={i} value={i}>
                        {month}
                     </option>
                  ))}
               </select>

               <select
                  value={date.getFullYear()}
                  onChange={({ target: { value } }) => changeYear(parseInt(value))}
                  className="datepicker-select"
               >
                  {years.map(year => (
                     <option key={year} value={year}>
                        {year}
                     </option>
                  ))}
               </select>
            </div>

            <button
               type="button"
               onClick={increaseMonth}
               disabled={nextMonthButtonDisabled}
               className="datepicker-nav-btn"
            >
               {">"}
            </button>
         </div>
      );
   };

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
                  onChange={handleDateRangeChange}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Выберите дату"
                  locale={ru}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  inline
                  highlightDates={highlightedDates}
                  renderCustomHeader={renderCustomHeader}
               />
            </div>
         </div>
         <div className="admin-order__items">
            {!result.items && <p>Ещё нет заказов</p>}
            {result.error && <p>Что-то пошло не так, попробуйте ещё раз</p>}
            <SendMessageModal
               responseLogin={responseLogin}
               setResponseLogin={setResponseLogin}
               isOpen={isOpenSend}
               setIsOpen={setIsOpenSend}
            >
               <div style={{ display: 'none' }}>Невидимый элемент</div>
            </SendMessageModal>
            {result.items && result.items.data.filter(item => {
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
               <AdminOrdersItem openSendMessageModal={openSendMessageModal} {...item} setResult={setResult} key={item.id} />
            ))}
            {result.items && <Pagination totalPages={result.items?.totalPages} page={page} itemsLength={result.items.data ? result.items.data.length : 0} cityId={0} tagIds={[]} search={''} visiblePages={5} type={'orders'} />}
         </div>
      </div>
   )
}

export default AdminOrdersContent