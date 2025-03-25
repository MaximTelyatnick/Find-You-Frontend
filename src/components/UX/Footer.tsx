import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { ru } from "date-fns/locale";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IAdminSections } from '../../types/Admin';
import axios from 'axios';

const Footer = () => {
   const navigate = useNavigate();
   const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
   const [startDate, endDate] = dateRange;
   const apiUrl = `http://167.86.84.197:5000/sections?page_name=Футер`
   const [error, setError] = useState<boolean>(false)
   const [sections, setSections] = useState<IAdminSections | null>(null)

   useEffect(() => {
      if (startDate && endDate) {
         const formattedRange = JSON.stringify([
            startDate instanceof Date ? startDate.toISOString().split("T")[0] : new Date(startDate).toISOString().split("T")[0],
            endDate instanceof Date ? endDate.toISOString().split("T")[0] : new Date(endDate).toISOString().split("T")[0]
         ]);
         navigate(`/?date_range=${encodeURIComponent(formattedRange)}`);
      }
   }, [startDate, endDate]); // Правильные зависимости

   const getSections = async () => {
      try {
         setError(false)

         const response = await axios.get(apiUrl)

         setSections(response.data)
      } catch (error) {
         setError(true)
      }
   }

   useEffect(() => {
      getSections()
   }, [])

   return (
      <footer className='footer'>
         <div className='footer__container layout-container'>
            <div className='footer__row'>
               <div className="footer__main">
                  <a onClick={() => navigate('/')}><img src='/images/logoFooter.png' className='logo' /></a>
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
                     onChange={(update) => setDateRange(update)}
                     dateFormat="dd/MM/yyyy"
                     locale={ru}
                     placeholderText="Выберите дату"
                     startDate={startDate}
                     endDate={endDate}
                     selectsRange
                     inline
                  />
               </div>
            </div>
         </div>
      </footer>
   );
};

export default Footer;
