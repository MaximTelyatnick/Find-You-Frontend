import dayjs from "dayjs";
import { IModalRead } from "../../../types/IModal";
import IUser from "../../../types/IUser";

const ReadMessageModal = ({ isOpen, setIsOpen, children, date_messages, time_messages, text_messages, sender, receiver, responseHandler }: IModalRead) => {
   const storedUser = localStorage.getItem('user');
   let user: IUser = storedUser ? JSON.parse(storedUser) : null;
   const openModal = () => setIsOpen(true);

   const closeModal = () => setIsOpen(false);

   const handleResponse = () => {
      closeModal(); // Закрываем текущую модалку чтения
      responseHandler(sender); // Передаем отправителя в функцию ответа
   };

   return (
      <>
         <div onClick={openModal} className='modal-block'>{children}</div>
         {isOpen && (
            <div id="loginModal" className="modal">
               <div className="modal-content">
                  <div className="modal-header">
                     <p>ПРОЧИТАТЬ СООБЩЕНИЕ</p>
                     <span className="close-btn" onClick={closeModal}>&times;</span>
                  </div>
                  <div className="modal-read__content">
                     <div className="modal-read-header">
                        <div className="modal-read-header__text">
                           <p className="modal-read-header__from">From: <span>{sender}</span></p>
                           <p className="modal-read-header__to">To: <span>{receiver}</span></p>
                        </div>
                        <div className="modal-read-header__date">
                           <p>Дата отправки:<br /><span>{dayjs(date_messages).format("DD.MM.YYYY") + " " + time_messages.slice(0, 5)}</span></p>
                        </div>
                     </div>
                     <div className="modal-read__main">
                        <p>{text_messages}</p>
                     </div>
                     {user.login !== sender && <div className="modal-read__response" onClick={handleResponse}>
                        <p>ОТВЕТИТЬ</p>
                     </div>}
                  </div>
               </div>
            </div>
         )}
      </>
   );
}

export default ReadMessageModal;