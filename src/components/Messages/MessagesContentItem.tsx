import { IMessageItemProps } from "../../types/IMessage";
import IUser from "../../types/IUser";
import { useState, useEffect } from "react";
import ReadMessageModal from "../UX/modals/ReadMessageModal";
import { convertUtcToLocal } from "../../utils/DateUtils";

const MessagesContentItem = ({
   id,
   date_messages,
   time_messages,
   text_messages,
   sender,
   receiver,
   is_read,
   selected,
   setSelected,
   responseHandler,
   onMessageRead,
   onModalClose
}: IMessageItemProps) => {
   const [isOpenRead, setIsOpenRead] = useState<boolean>(false);
   const [messageRead, setMessageRead] = useState<boolean>(is_read);
   const storedUser = localStorage.getItem('user');
   let user: IUser | null = storedUser ? JSON.parse(storedUser) : null;

   // Синхронизируем локальное состояние с props
   useEffect(() => {
      setMessageRead(is_read);
   }, [is_read]);

   const selectHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
         !selected.includes(id) && setSelected((prev: number[]) => [...prev, id])
      } else {
         selected.includes(id) && setSelected((prev: number[]) => prev.filter(item => item !== id))
      }
   }

   // Обработчик прочтения сообщения
   const handleMessageRead = () => {
      if (!messageRead && receiver === user?.login) {
         setMessageRead(true);
         if (onMessageRead) {
            onMessageRead(id);
         }
      }
      setIsOpenRead(true);
   };

   // Обработчик закрытия модального окна
   const handleModalClose = () => {
      setIsOpenRead(false);
      if (onModalClose) {
         onModalClose();
      }
   };

   // Используем унифицированную функцию форматирования даты
   const formattedDateTime = convertUtcToLocal(date_messages, time_messages);

   return (
      <div className={`messages-table-item ${!messageRead && receiver === user?.login ? 'unread-message' : ''}`}>
         <ReadMessageModal
            responseHandler={responseHandler}
            isOpen={isOpenRead}
            setIsOpen={setIsOpenRead}
            id={id}
            date_messages={date_messages}
            time_messages={time_messages}
            text_messages={text_messages}
            sender={sender}
            receiver={receiver}
            onMessageRead={handleMessageRead}
            onModalClose={handleModalClose}
            is_read={messageRead}
         >
            <div className="messages-table-item__title" onClick={handleMessageRead}>
               <p>
                  {sender === user?.login ?
                     <svg width="25" height="25" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_3_3)">
                           <path d="M58.3333 11.6667C59.805 11.6662 61.2225 12.222 62.3016 13.2227C63.3807 14.2234 64.0417 15.595 64.1521 17.0625L64.1667 17.5V52.5C64.1671 53.9717 63.6113 55.3892 62.6106 56.4683C61.61 57.5474 60.2384 58.2084 58.7708 58.3188L58.3333 58.3333H11.6667C10.195 58.3338 8.77751 57.778 7.6984 56.7773C6.61929 55.7766 5.95829 54.405 5.84792 52.9375L5.83333 52.5V49.5833H11.6667V52.5H58.3333V21.6242L38.0917 41.8658C37.3261 42.6313 36.3038 43.0858 35.2225 43.1413C34.1413 43.1967 33.0779 42.8494 32.2379 42.1662L31.9054 41.8658L11.6667 21.6242V23.3333H5.83333V17.5C5.83287 16.0283 6.38869 14.6108 7.38937 13.5317C8.39005 12.4526 9.76163 11.7916 11.2292 11.6812L11.6667 11.6667H58.3333ZM17.5 37.9167C18.2736 37.9167 19.0154 38.224 19.5624 38.7709C20.1094 39.3179 20.4167 40.0598 20.4167 40.8333C20.4167 41.6069 20.1094 42.3487 19.5624 42.8957C19.0154 43.4427 18.2736 43.75 17.5 43.75H2.91667C2.14312 43.75 1.40125 43.4427 0.854272 42.8957C0.307291 42.3487 0 41.6069 0 40.8333C0 40.0598 0.307291 39.3179 0.854272 38.7709C1.40125 38.224 2.14312 37.9167 2.91667 37.9167H17.5ZM54.2092 17.5H15.7908L35 36.7092L54.2092 17.5ZM14.5833 29.1667C15.3267 29.1675 16.0418 29.4521 16.5823 29.9625C17.1229 30.4728 17.4482 31.1703 17.4918 31.9124C17.5353 32.6545 17.2939 33.3853 16.8167 33.9553C16.3396 34.5254 15.6628 34.8918 14.9246 34.9796L14.5833 35H5.83333C5.08993 34.9992 4.37491 34.7145 3.83434 34.2042C3.29378 33.6939 2.96848 32.9964 2.92491 32.2543C2.88135 31.5121 3.1228 30.7814 3.59994 30.2113C4.07708 29.6412 4.75389 29.2749 5.49208 29.1871L5.83333 29.1667H14.5833Z" fill="black" />
                        </g>
                        <defs>
                           <clipPath id="clip0_3_3">
                              <rect width="100%" height="100%" fill="white" />
                           </clipPath>
                        </defs>
                     </svg>
                     :
                     <svg width="25" height="25" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.5 20L35 32.5M35 32.5L47.5 20M35 32.5V2.5" stroke="black" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M60 22.5C61.3261 22.5 62.5979 23.0268 63.5355 23.9645C64.4732 24.9021 65 26.1739 65 27.5V62.5C65 63.8261 64.4732 65.0979 63.5355 66.0355C62.5979 66.9732 61.3261 67.5 60 67.5H10C8.67392 67.5 7.40215 66.9732 6.46447 66.0355C5.52678 65.0979 5 63.8261 5 62.5V27.5C5 26.1739 5.52678 24.9021 6.46447 23.9645C7.40215 23.0268 8.67392 22.5 10 22.5" stroke="black" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M5 28.8L35 50L65 28.8" stroke="black" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                     </svg>
                  }
                  {!messageRead && receiver === user?.login && <span className="unread-badge">Новое</span>}
                  <span dangerouslySetInnerHTML={{ __html: text_messages.split(/\s+/).slice(0, 4).join(" ") }} />
               </p>
            </div>
         </ReadMessageModal>
         <div className="messages-table-item__author"><p>{sender}</p></div>
         <div className="messages-table-item__date">
            <p>{formattedDateTime}</p>
         </div>
         <div className="messages-table-item__checkbox">
            <input
               type="checkbox"
               checked={selected.includes(id)}
               onChange={selectHandler}
               aria-label={`Выбрать сообщение от ${sender}`}
            />
         </div>
      </div>
   )
}

export default MessagesContentItem