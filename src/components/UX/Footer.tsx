import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { ru } from "date-fns/locale";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IAdminSections } from '../../types/Admin';
import axios from 'axios';
import { format, startOfDay } from 'date-fns';

const Footer = () => {
   const navigate = useNavigate();
   const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
   const [startDate, endDate] = dateRange;
   const [highlightedDates, setHighlightedDates] = useState<Date[]>([]);
   const apiUrl = `http://167.86.84.197:5000/sections?page_name=Футер`;
   const [error, setError] = useState<boolean>(false);
   const [sections, setSections] = useState<IAdminSections | null>(null);

   // Добавляем состояния для отслеживания загрузки всех дат
   const [allDatesLoading, setAllDatesLoading] = useState<boolean>(false);
   const [allDatesError, setAllDatesError] = useState<boolean>(false);

   // Функция для обработки изменения диапазона дат
   const handleDateRangeChange = (update: [Date | null, Date | null]) => {
      setDateRange(update);
   };

   // Функция для получения всех дат аккаунтов для подсветки
   const getAllAccountDates = async () => {
      setAllDatesLoading(true);
      setAllDatesError(false);

      try {
         const response = await axios.get('http://167.86.84.197:5000/get-all-account-dates');

         if (response.data && response.data.dates) {
            // Преобразуем строки дат в объекты Date для подсветки
            const dates = response.data.dates.map((dateStr: string) => {
               // Нормализуем дату, убирая время
               return startOfDay(new Date(dateStr));
            });

            // Фильтруем недействительные даты (даты в будущем)
            const now = new Date();
            const validDates = dates.filter((date: Date) => date <= now);

            setHighlightedDates(validDates);
         }
      } catch (error) {
         console.error("Ошибка при загрузке дат аккаунтов:", error);
         setAllDatesError(true);
      } finally {
         setAllDatesLoading(false);
      }
   };

   // При первой загрузке компонента получаем все даты для подсветки
   useEffect(() => {
      getAllAccountDates();
   }, []);

   // Обновляем URL при изменении диапазона дат
   useEffect(() => {
      if (startDate && endDate) {
         // Используем функцию format из date-fns для правильного форматирования даты
         const formatDateCorrectly = (date: Date | null): string => {
            if (!date) return '';
            return format(startOfDay(date), 'yyyy-MM-dd');
         };

         const formattedRange = JSON.stringify([
            formatDateCorrectly(startDate),
            formatDateCorrectly(endDate)
         ]);

         navigate(`/?date_range=${encodeURIComponent(formattedRange)}`);
      }
   }, [startDate, endDate, navigate]);

   // Получаем секции для футера
   const getSections = async () => {
      try {
         setError(false);
         const response = await axios.get(apiUrl);
         setSections(response.data);
      } catch (error) {
         setError(true);
      }
   };

   useEffect(() => {
      getSections();
   }, []);

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
      <footer className='footer'>
         <div className='footer__container layout-container'>
            <div className='footer__row'>
               <div className="footer__main">
                  <a onClick={() => navigate('/')}><img src='/images/logoFooter.png' className='logo' alt="Логотип" /></a>
                  <ul className="footer-links">
                     <li onClick={() => { navigate('/') }}>Главная</li>
                     <li>·</li>
                     <li onClick={() => { navigate('/cities') }}>Города</li>
                     <li>·</li>
                     <li onClick={() => { navigate('/tags') }}>Облако тегов</li>
                     <li>·</li>
                     <li onClick={() => { navigate('/referral') }}>Реферальная система</li>
                     <li>·</li>
                     <li onClick={() => { navigate('/refusual') }}>Отказ от ответственности</li>
                  </ul>
                  <p className="footer-text">{sections && sections.sections[0].content}</p>
                  <p className="footer-text">{error && "Произошла ошибка при получении описания"}</p>
               </div>
               <div className="footer__calendar">
                  <DatePicker
                     selected={startDate}
                     onChange={handleDateRangeChange}
                     dateFormat="dd/MM/yyyy"
                     locale={ru}
                     placeholderText="Выберите дату"
                     startDate={startDate}
                     endDate={endDate}
                     selectsRange
                     inline
                     highlightDates={highlightedDates}
                     renderCustomHeader={renderCustomHeader}
                  />
                  {allDatesError && (
                     <p className="datepicker-error">Ошибка загрузки дат</p>
                  )}
               </div>
            </div>
         </div>
      </footer>
   );
};

export default Footer;