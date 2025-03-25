import { useState } from "react";
import axios from "axios";
import { IAdminAccountAll } from "../../types/Admin";
import transformPhoto from "../../utils/transformPhoto";

const AdminAccountsEdit = () => {
   const apiUrlGet = 'http://localhost:5000/account'
   const apiUrlDelete = 'http://localhost:5000/delete-account'
   const apiUrlUpdate = 'http://localhost:5000/update-photo'
   const apiUrlDateUpdate = 'http://localhost:5000/update-account-date'
   const apiUrl = 'http://localhost:5000'
   const [id, setId] = useState<string>('');
   const [account, setAccount] = useState<IAdminAccountAll | null>(null)
   const [success, setSuccess] = useState<string>('');
   const [error, setError] = useState<string>('');
   const [accountDate, setAccountDate] = useState<string>('');
   const [accountPhoto, setAccountPhoto] = useState<File | null>()


   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = event.target.files;
      if (!selectedFiles || !selectedFiles.length) {
         setError("Можно загружать только JPG или MP4 файлы.");
         return
      };

      const allowedTypes = ["image/jpeg", "video/mp4"];
      const newFileUrls: File[] = [];

      for (const file of selectedFiles) {
         if (allowedTypes.includes(file.type)) {
            newFileUrls.push(file);
         } else {
            return;
         }
      }

      setAccount(prev => {
         if (prev) {
            return {
               ...prev,
               files: [...prev.files, ...newFileUrls]
            }
         }
         return prev
      })

      setError('');
   };

   const getAccountHandler = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      setError('')
      setSuccess('')
      setAccount(null)

      try {
         const result = await axios.get(`${apiUrlGet}?id=${id}`)

         setAccount(result.data)
         setSuccess('Аккаунт успешно получен')
      } catch (error) {
         setError('Ошибка при получении аккаунта, попробуйте ещё раз!')
      }
   }

   const deleteHandler = async (id: number) => {
      return setAccount(prev => {
         if (prev) {
            return {
               ...prev,
               files: [...prev.files].filter((_: string | File, index: number) => index != id)
            }
         }
         return prev
      })
   }

   const deleteAccountHandler = async () => {
      try {
         setError('')
         setSuccess('')

         await axios.delete(apiUrlDelete, {
            data: {
               account_id: account?.account.id,
               account_identificator: account?.account.identificator
            }
         })

         setSuccess('Аккаунт успешно удалено')
         setAccount(null)
      } catch (error) {
         setError('Ошибка при удалении аккаунта, попробуйте ещё раз!')
      }
   }

   const saveHandler = async () => {
      const formData = new FormData();

      const links: string[] = [];

      account?.files.forEach((item) => {
         if (typeof item === "string") {
            links.push(item);
         } else if (item instanceof File) {
            formData.append("files", item);
         }
      });

      formData.append("links", JSON.stringify(links));

      try {
         setSuccess('')
         await axios.post(`${apiUrl}/account-edit-media?id=${account?.account.identificator}`, formData);

         setSuccess('Аккаунт успешно сохранено')
      } catch (error) {
         setError('Ошибка при сохранении аккаунта, попробуйте ещё раз!')
      }
   }

   const saveHandlerPhoto = async () => {
      if (account) {
         try {
            setSuccess('')
            setError('')

            if (!accountPhoto) {
               setError('Выберите фотку аккаунта')
               return
            }

            const formData = new FormData();
            formData.append("photo", accountPhoto);
            formData.append("id", String(account.account.id));

            await axios.post(apiUrlUpdate, formData, {
               headers: {
                  "Content-Type": "multipart/form-data",  // Указываем правильный заголовок
               },
            });

            setSuccess('Фото успешно обновленно')
         } catch (error) {
            setError('Ошибка при обновлении фото, попробуйте ещё раз!')
         }
      }
   }

   const updateDate = async (action: string) => {
      setSuccess('')
      setError('')
      if (account) {
         try {
            let value: string | null | undefined = undefined

            if (action == 'save') {
               value = accountDate
            } else if (action == 'reset') {
               value = null
            }

            if (value || value == null) {
               await axios.post(apiUrlDateUpdate, {
                  id: account?.account.id,
                  new_date_of_create: value
               })

               setSuccess('Дата успешно обновлена')
            } else {
               setError('Заполните нужные поля')
            }
         } catch (error) {
            setError('Произошла ошибка при обновлении даты')
         }
      } else {
         setError('Для начала нужно получить пользователя')
      }
   }

   return (
      <div className="admin-accounts-get">
         <h5>Получение аккаунта</h5>
         {error && <p style={{ color: 'red' }}>{error}</p>}
         {success && <p style={{ color: 'green' }}>{success}</p>}
         <form className="admin-accounts-get__form" onSubmit={getAccountHandler}>
            <input type="text" placeholder="Id аккаунта" onChange={(e) => { setId(e.target.value) }} />
            <button className="btn btn-info">Получить</button>
         </form>
         {account && <>
            <div className="admin-accounts-get__block">
               <div className="admin-accounts-get__text">
                  <p className="admin-accounts-get__paragraph"><span>Имя:</span> {account?.account.name}</p>
                  <p className="admin-accounts-get__paragraph"><span>Идентификатор:</span> {account?.account.identificator}</p>
                  <p className="admin-accounts-get__paragraph"><span>Дата рождения:</span> {account?.account.date_of_birth}</p>
                  <p className="admin-accounts-get__paragraph"><span>Город:</span> {account?.city.name_ru}</p>
                  <p className="admin-accounts-get__paragraph"><span>Тэги:</span> {account?.tags.map(item => (
                     <span key={item.id}>{item.name_ru}, </span>
                  ))}</p>
                  <div className="admin-accounts-get__time">
                     <p>Указать дату создания :</p>
                     <input type="datetime-local" placeholder="Дата создания / публикации" onChange={(e) => { setAccountDate(e.target.value) }} />
                     <button className="btn btn-info" onClick={() => { updateDate('save') }}>Сохранить</button>
                     <button className="admin-accounts-get__reset" onClick={() => { updateDate('reset') }}>Сбросить дату</button>
                  </div>
                  <div className="admin-accounts-get__bin" onClick={deleteAccountHandler}>
                     <span>Удалить аккаунт</span>
                     <svg width="20" height="20" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M55.4166 11.6667H45.2083L42.2916 8.75H27.7083L24.7916 11.6667H14.5833V17.5H55.4166M17.5 55.4167C17.5 56.9638 18.1146 58.4475 19.2085 59.5415C20.3025 60.6354 21.7862 61.25 23.3333 61.25H46.6666C48.2137 61.25 49.6975 60.6354 50.7914 59.5415C51.8854 58.4475 52.5 56.9638 52.5 55.4167V20.4167H17.5V55.4167Z" fill="#E36F6F" />
                     </svg>
                  </div>
               </div>
               <div className="admin-accounts-get__images">
                  {account?.files.map((item, index) => {
                     let isImage = false;
                     let src = "";

                     if (item instanceof File) {
                        // Если item — объект File, получаем его MIME-тип
                        isImage = item.type.startsWith("image/");
                        src = URL.createObjectURL(item); // Создаем blob-ссылку
                     } else if (typeof item === "string") {
                        // Если item — это строка (ссылка), проверяем расширение
                        isImage = item.includes(".jpg") || item.includes(".jpeg") || item.includes(".png");
                        src = item.startsWith("blob") ? item : `http://localhost:5000${item}`;
                     }

                     return (
                        <div key={index} className="admin-accounts-get__image">
                           {isImage ? (
                              <img src={src} alt="Image" />
                           ) : (
                              <video src={src} autoPlay muted />
                           )}
                           <div onClick={() => deleteHandler(index)} className="admin-accounts-get__imageBg">
                              <svg width="30" height="30" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                                 <path d="M55.4166 11.6667H45.2083L42.2916 8.75H27.7083L24.7916 11.6667H14.5833V17.5H55.4166M17.5 55.4167C17.5 56.9638 18.1146 58.4475 19.2085 59.5415C20.3025 60.6354 21.7862 61.25 23.3333 61.25H46.6666C48.2137 61.25 49.6975 60.6354 50.7914 59.5415C51.8854 58.4475 52.5 56.9638 52.5 55.4167V20.4167H17.5V55.4167Z" fill="#E36F6F" />
                              </svg>
                           </div>
                        </div>
                     );
                  })}
                  <div className="admin-accounts-get__files">
                     <input type="file" accept=".jpg, .mp4" multiple onChange={handleFileChange} />
                     <button className="btn btn-info" onClick={saveHandler}>Сохранить</button>
                  </div>
               </div>
            </div>
            <hr />
            <div>
               <div className="admin-accounts-get__photo">
                  {accountPhoto ? <img src={URL.createObjectURL(accountPhoto)} /> :
                     account.account.photo ? <img src={transformPhoto(account.account.photo)} /> :
                        <img src="public/images/blog_image.jpg" />}
               </div>
               <div className="admin-accounts-get__files">
                  <input type="file" accept=".jpg" onChange={(e) => { setAccountPhoto(e.target.files ? e.target.files[0] : null) }} />
                  <button className="btn btn-info" onClick={saveHandlerPhoto}>Сохранить</button>
               </div>
            </div>
         </>
         }
      </div>
   )
}

export default AdminAccountsEdit