import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { IMessageState } from "../../types/IMessage";
import IUser from "../../types/IUser";
import MessagesContentItem from "./MessagesContentItem";
import SendMessageModal from "../UX/modals/SendMessageModal";
import Pagination from "../UX/Pagination";

const MessagesContent = () => {
   const [searchParams, setSearchParams] = useSearchParams();
   const page = Number(searchParams.get("page")) || 1;
   const filter = searchParams.get("filter") || 'incoming';

   const [isOpenSend, setIsOpenSend] = useState<boolean>(false);
   const storedUser = localStorage.getItem('user');
   let user: IUser = storedUser ? JSON.parse(storedUser) : null;

   const [result, setResult] = useState<IMessageState>({
      items: null,
      error: false,
      loading: false,
   });

   const [selected, setSelected] = useState<number[]>([]);
   const [seccess, setSeccess] = useState<string>('');
   const [error, setError] = useState<string>('');
   const [responseLogin, setResponseLogin] = useState<string>('');
   const [unreadCount, setUnreadCount] = useState<number>(0);
   const [totalPages, setTotalPages] = useState<number>(1);
   // Новое состояние для модального окна подтверждения удаления
   const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
   // Тип удаления: 'local' (по умолчанию) или 'global'
   const [deleteType, setDeleteType] = useState<'local' | 'global'>('local');

   // Обновленный метод для изменения фильтра
   const selectFilterHandler = (filterName: string): void => {
      setSelected([]);
      // Обновляем URL с новым фильтром и сбрасываем страницу на первую
      setSearchParams({ filter: filterName, page: "1" });
   };

   const deleteHandler = async () => {
      try {
         setError('');
         setSeccess('');

         // Выбираем соответствующий API URL в зависимости от типа удаления
         const apiUrlDelete = deleteType === 'local'
            ? `http://167.86.84.197:5000/delete-messages`
            : `http://167.86.84.197:5000/delete-messages-global`;

         await axios.delete(apiUrlDelete, {
            data: {
               user_id: user.id,
               message_ids: selected,
            }
         });

         // Устанавливаем сообщение об успехе в зависимости от типа удаления
         setSeccess(deleteType === 'local'
            ? 'Сообщения успешно скрыты'
            : 'Сообщения успешно удалены глобально');

         setSelected([]);
         setShowDeleteConfirm(false);

         // Обновляем список сообщений после удаления
         fetchMessages();
      } catch (error: any) {
         const errorMessage = error.response?.data?.error || 'Что-то пошло не так, попробуйте ещё раз!';
         setError(errorMessage);
         console.error("Ошибка при удалении:", error);
      }
   };

   // Обработчик открытия модального окна подтверждения удаления
   const openDeleteConfirmation = () => {
      setShowDeleteConfirm(true);
   };

   // Обновленная функция для загрузки сообщений с учетом фильтра
   const fetchMessages = async () => {
      try {
         setResult(prev => ({ ...prev, loading: true, error: false }));
         const apiUrl = `http://167.86.84.197:5000/get-messages?user_id=${user?.id}&page=${page}&filter=${filter}`;

         const response = await axios.get(apiUrl);

         setResult({
            items: response.data.messages,
            error: false,
            loading: false,
         });

         setTotalPages(response.data.totalPages || 1);
         setUnreadCount(response.data.unreadCount || 0);
      } catch (error) {
         setResult({
            items: null,
            error: true,
            loading: false,
         });
      }
   };

   const selectAllMessages = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked && result.items) {
         const idsArr = result.items.map(item => item.id);
         setSelected(idsArr);
      } else {
         setSelected([]);
      }
   };

   const responseHandler = (login: string) => {
      setResponseLogin(login);
      setTimeout(() => {
         setIsOpenSend(true);
      }, 10);
   };

   // Обработчик для отметки сообщения как прочитанное
   const handleMessageRead = async (messageId: number) => {
      try {
         // Отправляем запрос на сервер для отметки сообщения как прочитанное
         await axios.post('http://167.86.84.197:5000/mark-as-read', {
            message_id: messageId,
            user_id: user.id
         });

         // Обновляем локальное состояние сообщения
         setResult(prev => {
            if (prev.items) {
               const updatedItems = prev.items.map(item => {
                  if (item.id === messageId && !item.is_read) {
                     return { ...item, is_read: true };
                  }
                  return item;
               });
               return { ...prev, items: updatedItems };
            }
            return prev;
         });

         // Обновляем счетчик непрочитанных после успешной отметки
         fetchUnreadCount();
      } catch (error) {
         console.error("Ошибка при отметке сообщения как прочитанное:", error);
      }
   };

   // Отдельная функция для получения количества непрочитанных сообщений
   const fetchUnreadCount = async () => {
      try {
         const response = await axios.get(`http://167.86.84.197:5000/unread-count?user_id=${user?.id}`);
         setUnreadCount(response.data.unread_count);
      } catch (error) {
         console.error("Ошибка при получении количества непрочитанных:", error);
      }
   };

   // useEffect для загрузки сообщений при изменении страницы или фильтра
   useEffect(() => {
      if (user?.id) {
         fetchMessages();
      }
   }, [page, filter, user?.id]);

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
                  isOpen={isOpenSend}
                  setIsOpen={setIsOpenSend}
               >
                  <div className="btn messages__button">Отправить сообщения</div>
               </SendMessageModal>
               {selected.length > 0 && (
                  <div className="delete-action">
                     <div
                        onClick={openDeleteConfirmation}
                        title="Удалить выбранные сообщения"
                     >
                        <svg width="30" height="30" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <path d="M55.4166 11.6667H45.2083L42.2916 8.75H27.7083L24.7916 11.6667H14.5833V17.5H55.4166M17.5 55.4167C17.5 56.9638 18.1146 58.4475 19.2085 59.5415C20.3025 60.6354 21.7862 61.25 23.3333 61.25H46.6666C48.2137 61.25 49.6975 60.6354 50.7914 59.5415C51.8854 58.4475 52.5 56.9638 52.5 55.4167V20.4167H17.5V55.4167Z" fill="#E36F6F" />
                        </svg>
                     </div>
                  </div>
               )}
            </div>

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
                     checked={
                        !!(
                           selected.length > 0 &&
                           result.items &&
                           result.items.length > 0 &&
                           selected.length === result.items.length
                        )
                     }
                  />
               </div>
            </div>
            {result.error && <p style={{ color: 'red' }}>Что-то пошло не так, попробуйте ещё раз!</p>}
            {result.items && result.items.length > 0 ? (
               result.items.map(item => (
                  <MessagesContentItem
                     responseHandler={responseHandler}
                     onMessageRead={handleMessageRead}
                     onModalClose={() => { }}
                     {...item}
                     selected={selected}
                     setSelected={setSelected}
                     key={item.id}
                  />
               ))
            ) : (
               <div className="no-messages">
                  <p>Сообщений не найдено</p>
               </div>
            )}
         </div>

         <Pagination
            totalPages={totalPages}
            page={page}
            itemsLength={result.items ? result.items.length : 0}
            cityId={0}
            tagIds={[]}
            search=""
            visiblePages={5}
            type="messages"
         />

         {/* Модальное окно подтверждения удаления */}
         {showDeleteConfirm && (
            <div className="modal-overlay">
               <div className="modal-confirm">
                  <h3>Подтверждение удаления</h3>
                  <p>Выберите тип удаления:</p>

                  <div className="delete-options">
                     <label>
                        <input
                           type="radio"
                           name="deleteType"
                           checked={deleteType === 'local'}
                           onChange={() => setDeleteType('local')}
                        />
                        Скрыть для меня (сообщения останутся видимыми для других пользователей)
                     </label>

                     <label>
                        <input
                           type="radio"
                           name="deleteType"
                           checked={deleteType === 'global'}
                           onChange={() => setDeleteType('global')}
                        />
                        Удалить глобально (сообщения будут удалены для всех пользователей)
                     </label>
                  </div>

                  <div className="modal-actions">
                     <button
                        className="btn btn-cancel"
                        onClick={() => setShowDeleteConfirm(false)}
                     >
                        Отмена
                     </button>
                     <button
                        className="btn btn-dangerous"
                        onClick={deleteHandler}
                     >
                        {deleteType === 'local' ? 'Скрыть' : 'Удалить глобально'}
                     </button>
                  </div>
               </div>
            </div>
         )}
      </>
   );
};

export default MessagesContent;