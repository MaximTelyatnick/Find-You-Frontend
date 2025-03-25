import { useState } from "react";
import IModal from "../../../types/IModal"
import axios from "axios";
import IUser from "../../../types/IUser";
import transformPhoto from "../../../utils/transformPhoto";

const ChangeAvatarModal = ({ isOpen, setIsOpen, children }: IModal) => {
   const openModal = () => setIsOpen(true);
   const closeModal = () => setIsOpen(false);
   const storedUser = localStorage.getItem('user');
   let user: IUser | null = storedUser ? JSON.parse(storedUser) : null;
   const [error, setError] = useState<string>('');
   const apiUrlUpdate = 'http://167.86.84.197/api/change-user-avatar'
   const [accountPhoto, setAccountPhoto] = useState<File | null>()

   const saveHandlerPhoto = async () => {
      try {
         setError('')

         if (!accountPhoto) {
            setError('Выберите фотку аккаунта')
            return
         }

         const formData = new FormData();
         formData.append("photo", accountPhoto);
         formData.append("id", String(user?.id));

         const res = await axios.post(apiUrlUpdate, formData, {
            headers: {
               "Content-Type": "multipart/form-data",
            },
         });

         localStorage.removeItem('user');
         localStorage.setItem('user', JSON.stringify(res.data));
         closeModal()
      } catch (error) {
         setError('Ошибка при обновлении фото, попробуйте ещё раз!')
      }
   }

   return (
      <>
         <div onClick={openModal}>{children}</div>
         {isOpen && (
            <div id="loginModal" className="modal">
               <div className="modal-content">
                  <div className="modal-header">
                     РЕДАКТИРОВАНИЕ АВАТАРА
                     <span className="close-btn" onClick={closeModal}>&times;</span>
                  </div>
                  <div className="avatar-modal">
                     {error && <p style={{ color: 'red' }}>{error}</p>}
                     <div>
                        {accountPhoto ? <img src={URL.createObjectURL(accountPhoto)} /> :
                           user?.avatar ? <img src={transformPhoto(user.avatar)} /> :
                              <img src="public/images/blog_image.jpg" />}
                     </div>
                     <div className="admin-accounts-get__files">
                        <input type="file" accept=".jpg" onChange={(e) => { setAccountPhoto(e.target.files ? e.target.files[0] : null) }} />
                        <button className="btn btn-info" onClick={saveHandlerPhoto}>Сохранить</button>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </>
   )
}

export default ChangeAvatarModal