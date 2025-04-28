import { useState, useEffect } from 'react';
import { IModalSend } from '../../../types/IModal';
import axios from 'axios';
import IUser from '../../../types/IUser';

const SendMessageModal = ({ isOpen, setIsOpen, children, responseLogin, setResponseLogin }: IModalSend) => {
   const [message, setMessage] = useState<string>("");
   const [login, setLogin] = useState<string>("");
   const storedUser = localStorage.getItem('user');
   let user: IUser | null = storedUser ? JSON.parse(storedUser) : null;
   const [error, setError] = useState<string>('');
   const [seccess, setSeccess] = useState<string>('');
   const [isAdminMessage, setIsAdminMessage] = useState<boolean>(false);

   // Отслеживаем, если открывается окно для админа
   useEffect(() => {
      if (isOpen && responseLogin === 'admin') {
         setIsAdminMessage(true);
      }
   }, [isOpen, responseLogin]);

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
      setLogin('');
      setMessage('');

      // Если это было сообщение для админа, восстанавливаем значение "admin",
      // в остальных случаях очищаем полностью
      if (isAdminMessage) {
         setResponseLogin('admin');
         setIsAdminMessage(false);
      } else {
         setResponseLogin('');
      }
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
         await axios.post('http://167.86.84.197:5000/send-messages', {
            text_messages: message,
            user_from_id: user?.id,
            user_to_login: login
         });
         setSeccess('Сообщение успешно отправлено');
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