import { useState } from 'react';
import { IModalSend } from '../../../types/IModal';
import axios from 'axios';
import IUser from '../../../types/IUser';
import { IMessageState } from '../../../types/IMessage';

const SendMessageModal = ({ isOpen, setIsOpen, children, setResult }: IModalSend) => {
   const [message, setMessage] = useState<string>("");
   const [login, setLogin] = useState<string>('')
   const storedUser = localStorage.getItem('user');
   let user: IUser | null = storedUser ? JSON.parse(storedUser) : null;
   const [error, setError] = useState<string>('');
   const [seccess, setSeccess] = useState<string>('');

   const openModal = () => setIsOpen(true);
   const closeModal = () => {
      setSeccess('')
      setError('')
      setIsOpen(false)
   };

   const sendFormhandler = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError('')
      setSeccess('')

      try {
         const response = await axios.post('http://localhost:5000/send-messages', {
            text_messages: message,
            user_from_id: user?.id,
            user_to_login: login
         });

         setSeccess('Сообщение успешно отправленно')
         setResult((prev: IMessageState) => {
            if (prev.items) {
               return {
                  ...prev,
                  items: [{
                     id: Date.now().toString(),
                     date_messages: Date.now().toString(),
                     time_messages: Date.now().toString(),
                     sender: user?.login,
                     receiver: login,
                     text_messages: message,
                  }, ...prev.items]
               }
            }

            return prev
         })
         setMessage('')
         setLogin('')
      } catch (err: any) {
         if (err.status == 404) {
            setError('Получатель не найден!')
            return
         }
         setError('Что-то пошло не так, попробуйте ещё раз!') // Показываем ошибку, если что-то пошло не так
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
                     <input type="text" name='to' id='to' value={login} onChange={(e) => { setLogin(e.target.value) }} placeholder='Логин получателя' />
                     <textarea placeholder="Сообщение..." onChange={(e) => { setMessage(e.target.value) }}></textarea>
                     <button className='btn modal-send__button'>ОТПРАВИТЬ</button>
                  </form>
               </div>
            </div>
         )}
      </>
   );
};

export default SendMessageModal;
