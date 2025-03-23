import dayjs from "dayjs";
import { IModalRead } from "../../../types/IModal";

const ReadMessageModal = ({ isOpen, setIsOpen, children, id, date_messages, time_messages, text_messages, sender, receiver }: IModalRead) => {

   const openModal = () => setIsOpen(true);
   const closeModal = () => setIsOpen(false);

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
                           <p>Дата отправки:<br /><span>{dayjs(date_messages).format("DD:MM:YYYY") + " " + time_messages.slice(0, 5)}</span></p>
                        </div>
                     </div>
                     <div className="modal-read__main">
                        <p dangerouslySetInnerHTML={{ __html: text_messages }} />
                     </div>
                  </div>
               </div>
            </div>
         )}
      </>
   );
}

export default ReadMessageModal