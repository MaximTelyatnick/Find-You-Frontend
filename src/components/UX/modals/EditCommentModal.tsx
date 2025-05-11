import { useState, useEffect } from "react";
import { IAccountReplyComment } from "../../../types/IAccounts";
import AccountEditor from "../../Account/AccountEditor";

// Обновлённый интерфейс, совместимый с AccountEditor
export interface IModalComment {
   isOpen: boolean;
   setIsOpen: (isOpen: boolean) => void;
   children: React.ReactNode;
   comment: string;
   setComment: (comment: string) => void;
   editComment: () => void;
   removeComment: () => void;
   id: number; // ID самого комментария
   parent_id: number | null; // ID родительского комментария, если есть
   accountId: number; // ID аккаунта
   setResult: Function; // Функция обновления состояния
   author_nickname?: string; // Ник автора комментария
}

const EditCommentModal = ({
   isOpen,
   setIsOpen,
   children,
   comment,
   removeComment,
   id,
   accountId,
   setResult,
   author_nickname
}: IModalComment) => {
   // Состояние для отслеживания статуса редактирования
   const [isEditing, setIsEditing] = useState<boolean>(false);

   const openModal = () => setIsOpen(true);
   const closeModal = () => {
      setIsOpen(false);
      setIsEditing(false);
   };

   // Создаем объект данных для AccountEditor
   const commentData: IAccountReplyComment = {
      parent_id: id, // Для редактирования используем ID комментария
      text: comment,
      author_nickname: author_nickname || "",
   };

   // Обработка отмены
   const handleCancel = () => {
      closeModal();
   };

   // Синхронизируем содержимое, когда редактор готов к работе
   useEffect(() => {
      if (isOpen && !isEditing) {
         setIsEditing(true);
      }
   }, [isOpen]);

   return (
      <>
         <div onClick={openModal}>{children}</div>
         {isOpen && (
            <div className="modal">
               <div className="modal-content">
                  <div className="modal-header">
                     РЕДАКТИРОВАНИЕ КОММЕНТАРИЯ
                     <span className="close-btn" onClick={closeModal}>&times;</span>
                  </div>
                  <div className="comment-modal">
                     {/* Используем AccountEditor для редактирования */}
                     <div className="rich-editor-container">
                        <AccountEditor
                           editComment={commentData}
                           cancelAction={handleCancel}
                           accountId={accountId}
                           setResult={setResult}
                        />
                     </div>

                     {/* Кнопка удаления комментария */}
                     <div className="comment-modalbuttons">
                        <button
                           className='btn'
                           onClick={() => {
                              removeComment();
                              closeModal();
                           }}
                        >
                           Удалить
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}

         <style>{`
         .modal h6 {
            display: none;
         }
         .modal-content .rich-text-editor {
            text-align: left;
            overflow: hidden;
            max-width: 100%;
         }
         .editor-toolbar {
            width: 100%;
         }
        
        .close-btn {
          color: #aaa;
          font-size: 28px;
          font-weight: bold;
          cursor: pointer;
        }
        
        .close-btn:hover {
          color: #333;
        }
        
        .comment-modal {
          padding: 20px;
        }
        
        .rich-editor-container {
          margin-bottom: 20px;
        }
        
        .comment-modalbuttons {
          display: flex;
          justify-content: flex-end;
          margin-top: 15px;
        }
        
      `}</style>
      </>
   );
};

export default EditCommentModal;