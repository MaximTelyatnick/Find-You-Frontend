import { useState, useEffect } from 'react';
import { IModalSend } from '../../../types/IModal';
import axios from 'axios';
import IUser from '../../../types/IUser';
import { IMessageState } from '../../../types/IMessage';

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
         // Отправляем сообщение на сервер
         const response = await axios.post('http://167.86.84.197:5000/send-messages', {
            text_messages: message,
            user_from_id: user?.id,
            user_to_login: login
         });

         setSeccess('Сообщение успешно отправлено');

         // Получаем дату и время с сервера в UTC
         const now = new Date();
         // Получаем UTC дату
         const year = now.getUTCFullYear();
         const month = String(now.getUTCMonth() + 1).padStart(2, '0');
         const day = String(now.getUTCDate()).padStart(2, '0');

         // Получаем UTC время
         const hours = String(now.getUTCHours()).padStart(2, '0');
         const minutes = String(now.getUTCMinutes()).padStart(2, '0');
         const seconds = String(now.getUTCSeconds()).padStart(2, '0');

         setResult && setResult((prev: IMessageState) => {
            if (prev.items) {
               return {
                  ...prev,
                  items: [{
                     id: response.data.id || Date.now(),
                     date_messages: `${year}-${month}-${day}`,
                     time_messages: `${hours}:${minutes}:${seconds}`,
                     sender: user?.login || '',
                     receiver: login,
                     text_messages: message,
                     is_read: false
                  }, ...prev.items]
               }
            }
            return prev
         });

         // Очищаем поле сообщения после отправки
         setMessage('');
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