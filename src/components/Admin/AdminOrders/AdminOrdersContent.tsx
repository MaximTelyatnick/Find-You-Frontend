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
import { format, startOfDay } from 'date-fns'

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
   const [lastClickTime, setLastClickTime] = useState<number>(0);
   const [isSingleDateMode, setIsSingleDateMode] = useState<boolean>(false);

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

   // Функция для обработки клика на дату
   const handleDateChange = (date: Date | null) => {
      const now = new Date().getTime();

      // Если прошло менее 300мс между кликами, считаем это двойным кликом
      if (now - lastClickTime < 300) {
         // Двойной клик - выбираем только одну дату
         setDateRange([date, date]);
         setIsSingleDateMode(true);
      } else {
         // Одиночный клик - стандартная логика выбора диапазона
         if (!startDate || isSingleDateMode || (startDate && endDate)) {
            // Новое начало диапазона
            setDateRange([date, null]);
            setIsSingleDateMode(false);
         } else {
            // Выбор конца диапазона
            // Убедимся, что диапазон идет в правильном порядке (от раннего к позднему)
            if (startDate && date && startDate > date) {
               setDateRange([date, startDate]);
            } else {
               setDateRange([startDate, date]);
            }
         }
      }

      setLastClickTime(now);
   };

   useEffect(() => {
      getOrders()
   }, [page])

   // Обработка изменения диапазона дат
   useEffect(() => {
      if (dateRange[0]) {
         // Форматируем даты для API запроса
         const formatDateCorrectly = (date: Date | null): string => {
            if (!date) return '';
            return format(date, 'dd.MM.yyyy');
         };

         if (isSingleDateMode && dateRange[0] && dateRange[1] && dateRange[0].getTime() === dateRange[1].getTime()) {
            // Режим одной даты - для бэкенда нужно отправить одинаковые start_date и end_date
            getOrders(`&start_date=${formatDateCorrectly(dateRange[0])}&end_date=${formatDateCorrectly(dateRange[0])}`);
         } else if (dateRange[0] && dateRange[1]) {
            // Режим диапазона дат
            getOrders(`&start_date=${formatDateCorrectly(dateRange[0])}&end_date=${formatDateCorrectly(dateRange[1])}`);
         }
      }
   }, [dateRange, isSingleDateMode])

   // Получаем даты заказов для подсветки
   useEffect(() => {
      if (result.items && result.items.data) {
         // Извлекаем даты из заказов для подсветки в календаре и нормализуем их
         const dates = result.items.data
            .filter(order => order.created_at)
            .map(order => startOfDay(new Date(order.created_at)));

         setHighlightedDates(dates);
      }
   }, [result.items]);

   // Кастомные заголовки для выбора месяца и года с расширенным диапазоном годов
   const renderCustomHeader = ({
      date,
      changeYear,
      changeMonth,
      decreaseMonth,
      increaseMonth,
      prevMonthButtonDisabled,
      nextMonthButtonDisabled
   }: any) => {
      // Расширенный диапазон годов с 2000 до 2100
      const years = Array.from({ length: 101 }, (_, i) => 2000 + i);

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
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Выберите дату"
                  locale={ru}
                  startDate={startDate}
                  endDate={endDate}
                  inline
                  highlightDates={highlightedDates}
                  renderCustomHeader={renderCustomHeader}
               />
               <div className="datepicker-hint">
                  <small>
                     {isSingleDateMode
                        ? "Выбрана одна дата. Нажмите на другую дату для диапазона."
                        : "Двойной клик для выбора одной даты, или выберите диапазон."}
                  </small>
               </div>
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