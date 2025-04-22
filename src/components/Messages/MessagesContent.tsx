import { useEffect, useState } from "react";
import fetchData from "../../services/fetchData";
import { IMessageState } from "../../types/IMessage";
import IUser from "../../types/IUser";
import MessagesContentItem from "./MessagesContentItem";
import axios from "axios";
import SendMessageModal from "../UX/modals/SendMessageModal";

const MessagesContent = () => {
   const [isOpenSend, setIsOpenSend] = useState<boolean>(false);
   const storedUser = localStorage.getItem('user');
   let user: IUser = storedUser ? JSON.parse(storedUser) : null;
   const apiUrl = `http://167.86.84.197:5000/get-messages?user_id=${user?.id}`;
   const apiUrlDelete = `http://167.86.84.197:5000/delete-messages`;
   const [result, setResult] = useState<IMessageState>({
      items: null,
      error: false,
      loading: false,
   });

   const [filter, setFilter] = useState<string>('incoming');
   const [selected, setSelected] = useState<number[]>([]);
   const [seccess, setSeccess] = useState<string>('');
   const [error, setError] = useState<string>('');
   const [responseLogin, setResponseLogin] = useState<string>('');
   const [unreadCount, setUnreadCount] = useState<number>(0);

   const selectFilterHandler = (filterName: string): void => {
      setFilter(filterName);
      setSelected([]);
   };

   const deleteHandler = async () => {
      try {
         setError('');
         setSeccess('');

         await axios.delete(apiUrlDelete, {
            data: {
               user_id: user.id,
               message_ids: selected,
            }
         });

         selected.forEach(item => {
            setResult(prev => {
               if (prev.items) {
                  // Уменьшаем счетчик непрочитанных, если удаляем непрочитанное сообщение
                  const deletedMessage = prev.items.find(prevItem => prevItem.id === item);
                  if (deletedMessage && !deletedMessage.is_read && deletedMessage.receiver === user.login) {
                     setUnreadCount(current => Math.max(0, current - 1));
                  }

                  return {
                     ...prev,
                     items: [...prev.items.filter(prevItem => prevItem.id != item)]
                  };
               } else {
                  return prev;
               }
            });
         });

         setSeccess('Сообщения успешно удалены');
         setSelected([]);
      } catch (error) {
         setError('Что-то пошло не так, попробуйте ещё раз!');
      }
   };

   // Исправленная логика фильтрации для правильного определения всех сообщений
   const getFilteredMessages = () => {
      if (!result.items) return [];

      return result.items.filter(item => {
         if (!filter) return true;

         if (filter === 'sent') {
            return item.sender === user.login; // Отправленные - где текущий пользователь отправитель
         } else if (filter === 'incoming') {
            return item.receiver === user.login; // Входящие - где текущий пользователь получатель
         } else if (filter === 'unread') {
            return item.receiver === user.login && !item.is_read; // Непрочитанные - входящие и не прочитанные
         }
         return false;
      });
   };

   const selectAllMessages = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
         // Используем уже отфильтрованные сообщения для выбора всех
         const idsArr = getFilteredMessages().map(item => item.id);
         setSelected(idsArr);
      } else {
         setSelected([]);
      }
   };

   const responseHandler = (login: string) => {
      setResponseLogin(login);
      // Сначала устанавливаем логин, затем открываем модальное окно
      setTimeout(() => {
         setIsOpenSend(true);
      }, 10);
   };

   // Обработчик для отметки сообщения как прочитанное
   const handleMessageRead = (messageId: number) => {
      setResult(prev => {
         if (prev.items) {
            const updatedItems = prev.items.map(item => {
               if (item.id === messageId && !item.is_read) {
                  // Обновляем счетчик непрочитанных сообщений
                  setUnreadCount(current => Math.max(0, current - 1));
                  return { ...item, is_read: true };
               }
               return item;
            });
            return { ...prev, items: updatedItems };
         }
         return prev;
      });
   };

   useEffect(() => {
      fetchData('get', apiUrl, setResult);
   }, []);

   // Подсчитываем непрочитанные сообщения при получении данных
   useEffect(() => {
      if (result.items) {
         const unreadMessages = result.items.filter(
            item => item.receiver === user.login && !item.is_read
         );
         setUnreadCount(unreadMessages.length);
      }
   }, [result.items]);

   // Получаем отфильтрованные сообщения для отображения
   const filteredMessages = getFilteredMessages();

   return (
      <>
         {result.loading && <div className="loader">
            <div className="loader__circle"></div>
         </div>}
         {error && <p style={{ color: 'red' }}>{error}</p>}
         {seccess && <p style={{ color: 'green' }}>{seccess}</p>}
         <div className="messages__actions">
            <div className="messages__buttons">
               <div
                  className={`btn messages__button ${filter === 'incoming' ? 'active' : ''}`}
                  onClick={() => { selectFilterHandler('incoming') }}
               >
                  Входящие сообщения {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
               </div>
               <div
                  className={`btn messages__button ${filter === 'unread' ? 'active' : ''}`}
                  onClick={() => { selectFilterHandler('unread') }}
               >
                  Непрочитанные {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
               </div>
               <div
                  className={`btn messages__button ${filter === 'sent' ? 'active' : ''}`}
                  onClick={() => { selectFilterHandler('sent') }}
               >
                  Отправленные сообщения
               </div>
               <SendMessageModal
                  responseLogin={responseLogin}
                  setResponseLogin={setResponseLogin}
                  setResult={setResult}
                  isOpen={isOpenSend}
                  setIsOpen={setIsOpenSend}
               >
                  <div className="btn messages__button">Отправить сообщения</div>
               </SendMessageModal>
            </div>
            {selected.length > 0 && (
               <svg onClick={deleteHandler} width="30" height="30" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M55.4166 11.6667H45.2083L42.2916 8.75H27.7083L24.7916 11.6667H14.5833V17.5H55.4166M17.5 55.4167C17.5 56.9638 18.1146 58.4475 19.2085 59.5415C20.3025 60.6354 21.7862 61.25 23.3333 61.25H46.6666C48.2137 61.25 49.6975 60.6354 50.7914 59.5415C51.8854 58.4475 52.5 56.9638 52.5 55.4167V20.4167H17.5V55.4167Z" fill="#E36F6F" />
               </svg>
            )}
         </div>

         <hr />

         <div className="messages-table">
            <div className="messages-table-item messages-table__preview">
               <div className="messages-table-item__title"><p>Тема сообщения</p></div>
               <div className="messages-table-item__author"><p>Отправитель</p></div>
               <div className="messages-table-item__date"><p>Дата</p></div>
               <div className="messages-table-item__checkbox">
                  <input
                     type="checkbox"
                     onChange={selectAllMessages}
                     checked={selected.length > 0 && filteredMessages.length > 0 &&
                        selected.length === filteredMessages.length}
                  />
               </div>
            </div>
            {result.error && <p style={{ color: 'red' }}>Что-то пошло не так, попробуйте ещё раз!</p>}
            {filteredMessages.map(item => (
               <MessagesContentItem
                  responseHandler={responseHandler}
                  onMessageRead={handleMessageRead}
                  {...item}
                  selected={selected}
                  setSelected={setSelected}
                  key={item.id}
               />
            ))}
         </div>
      </>
   );
};

export default MessagesContent;