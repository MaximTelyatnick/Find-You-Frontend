import { IModalComment } from '../../../types/IModal';

const EditCommentModal = ({ isOpen, setIsOpen, children, setComment, comment, editComment, removeComment }: IModalComment) => {
   const openModal = () => setIsOpen(true);
   const closeModal = () => setIsOpen(false);

   return (
      <>
         <div onClick={openModal}>{children}</div>
         {isOpen && (
            <div id="loginModal" className="modal">
               <div className="modal-content">
                  <div className="modal-header">
                     РЕДАКТИРОВАНИЕ КОМЕНТАРИЯ
                     <span className="close-btn" onClick={closeModal}>&times;</span>
                  </div>
                  <div className="comment-modal">
                     <textarea value={comment} placeholder='Текст коментария' onChange={(e) => { setComment(e.target.value) }}></textarea>
                     <div className="comment-modal__buttons">
                        <button className='comment-modal__edit' onClick={() => { editComment() }}>Изменить</button>
                        <button className='comment-modal__delete' onClick={() => { removeComment() }}>Удалить</button>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </>
   );
};

export default EditCommentModal;
