import { useState, useEffect } from 'react';
import { IModalSend } from '../../../types/IModal';
import axios from 'axios';
import IUser from '../../../types/IUser';
import { IMessageState } from '../../../types/IMessage';
import dayjs from 'dayjs';
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Расширяем возможности dayjs плагинами для работы с часовыми поясами
dayjs.extend(utc);
dayjs.extend(timezone);

const SendMessageModal = ({ isOpen, setIsOpen, children, setResult, responseLogin, setResponseLogin }: IModalSend) => {
   const [message, setMessage] = useState<string>("");
   const [login, setLogin] = useState<string>("");
   const storedUser = localStorage.getItem('user');
   let user: IUser | null = storedUser ? JSON.parse(storedUser) : null;
   const [error, setError] = useState<string>('');
   const [seccess, setSeccess] = useState<string>('');

   // Обновляем login только когда изменяется responseLogin или открывается модальное окно
   useEffect(() => {
      if (responseLogin && isOpen) {
         setLogin(responseLogin);
      }
   }, [responseLogin, isOpen]);

   const openModal = () => setIsOpen(true);

   const closeModal = () => {
      setSeccess('');
      setError('');
      setIsOpen(false);
      // Очищаем логин получателя при закрытии модального окна
      setLogin('');
      setMessage('');
      // Также сбрасываем responseLogin
      setResponseLogin('');
   };

   const sendFormhandler = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError('');
      setSeccess('');

      if (!login.trim()) {
         setError('Введите логин получателя');
         return;
      }

      if (!message.trim()) {
         setError('Введите текст сообщения');
         return;
      }

      try {
         // Используем UTC даты для отправки на сервер
         const now = new Date();
         const isoString = now.toISOString();
         const formattedDate = isoString.split('T')[0]; // YYYY-MM-DD
         const formattedTime = isoString.split('T')[1].split('.')[0]; // HH:MM:SS

         const response = await axios.post('http://localhost:5000/send-messages', {
            text_messages: message,
            user_from_id: user?.id,
            user_to_login: login
         });

         setSeccess('Сообщение успешно отправлено');

         // Добавляем сообщение в список с правильным форматированием даты и времени
         // Используем ответ сервера для обновления состояния
         setResult && setResult((prev: IMessageState) => {
            if (prev.items) {
               return {
                  ...prev,
                  items: [{
                     id: Date.now(),
                     date_messages: response.data.date_messages || formattedDate,
                     time_messages: response.data.time_messages || formattedTime,
                     sender: user?.login || '',
                     receiver: login,
                     text_messages: message,
                  }, ...prev.items]
               }
            }
            return prev
         });

         // Очищаем поле сообщения после отправки
         setMessage('');
         // Не очищаем поле логина после отправки, 
         // оно очистится при закрытии модального окна
      } catch (err: any) {
         if (err.response && err.response.status === 404) {
            setError('Получатель не найден!');
            return;
         }
         setError('Что-то пошло не так, попробуйте ещё раз!');
      }
   }

   return (
      <>
         <div onClick={openModal} className='modal-block'>{children}</div>
         {isOpen && (
            <div id="loginModal" className="modal">
               <div className="modal-content">
                  <div className="modal-header">
                     ОТПРАВИТЬ СООБЩЕНИЕ
                     <span className="close-btn" onClick={closeModal}>&times;</span>
                  </div>
                  <form className='modal-send__form' onSubmit={sendFormhandler}>
                     {seccess && <p style={{ color: 'green' }}>{seccess}</p>}
                     {error && <p style={{ color: 'red' }}>{error}</p>}
                     <input
                        type="text"
                        name='to'
                        id='to'
                        value={login}
                        onChange={(e) => { setLogin(e.target.value) }}
                        placeholder='Логин получателя'
                     />
                     <textarea
                        placeholder="Сообщение..."
                        value={message}
                        onChange={(e) => { setMessage(e.target.value) }}
                     ></textarea>
                     <button className='btn modal-send__button'>ОТПРАВИТЬ</button>
                  </form>
               </div>
            </div>
         )}
      </>
   );
};

export default SendMessageModal;