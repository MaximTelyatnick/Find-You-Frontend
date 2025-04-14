import dayjs from "dayjs"
import { IHomeAccount } from "../../types/IAccounts"
import { useNavigate } from "react-router-dom"
import transformPhoto from "../../utils/transformPhoto"
import { useState } from "react"
import axios from "axios"
import AdminAccountsEditSocial from "./AdminAccountsEditSocial"
import { IAdminAccountAll } from "../../types/Admin"

const AdminAccountsEditItem = ({
   account,
   setAccountsSelected,
   apiUrl,
   apiUrlGet,
   apiUrlUpdate,
   apiUrlDateUpdate,
   apiUrlAccUpdate,
   setError,
   setSuccess
}: {
   account: IHomeAccount,
   setAccountsSelected: Function,
   apiUrl: string,
   apiUrlGet: string,
   apiUrlUpdate: string,
   apiUrlDateUpdate: string,
   apiUrlAccUpdate: string,
   setError: Function,
   setSuccess: Function
}) => {
   const navigate = useNavigate()
   const [isChecked, setIsChecked] = useState<boolean>(false)
   const [isEditing, setIsEditing] = useState<boolean>(false)
   const [loading, setLoading] = useState<boolean>(false)
   const [accountDetail, setAccountDetail] = useState<IAdminAccountAll | null>(null)

   // Состояния для редактирования
   const [accountName, setAccountName] = useState<string>('')
   const [accountCity, setAccountCity] = useState<string>('')
   const [accountTags, setAccountTags] = useState<string>('')
   const [accountSocials, setAccountSocials] = useState<any[]>([])
   const [accountDate, setAccountDate] = useState<string>('')
   const [accountPhoto, setAccountPhoto] = useState<File | null>(null)

   const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const checked = event.target.checked;
      setIsChecked(checked);
      setAccountsSelected((prevSelected: number[]) =>
         checked
            ? [...prevSelected, account.id]
            : prevSelected.filter(id => id !== account.id)
      );

      // Если снимаем выделение, закрываем редактирование
      if (!checked) {
         setIsEditing(false);
      }
   };

   const handleEdit = async () => {
      if (!isEditing) {
         setLoading(true);
         try {
            const result = await axios.get(`${apiUrlGet}?id=${account.id}`)
            setAccountDetail(result.data);
            setAccountName(result.data.account.name);
            setAccountCity(result.data.city.name_ru);
            setAccountTags(result.data.tags.map((item: any) => item.name_ru).join(", "));
            setAccountDate(result.data.account.date_of_create);
            setAccountSocials(result.data.socials);
            setIsEditing(true);
            setSuccess('Аккаунт успешно получен');
         } catch (error) {
            setError('Ошибка при получении аккаунта, попробуйте ещё раз!');
         } finally {
            setLoading(false);
         }
      } else {
         setIsEditing(false);
      }
   }

   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = event.target.files;
      if (!selectedFiles || !selectedFiles.length) {
         setError("Можно загружать только JPG или MP4 файлы.");
         return;
      }

      const allowedTypes = ["image/jpeg", "video/mp4"];
      const file = selectedFiles[0];

      if (!allowedTypes.includes(file.type)) {
         setError("Можно загружать только JPG или MP4 файлы.");
         return;
      }

      setAccountPhoto(file);
   };

   const saveHandlerPhoto = async () => {
      if (accountDetail) {
         try {
            setError('');
            setSuccess('');

            if (!accountPhoto) {
               setError('Выберите фотку аккаунта');
               return;
            }

            const formData = new FormData();
            formData.append("photo", accountPhoto);
            formData.append("id", String(accountDetail.account.id));

            await axios.post(apiUrlUpdate, formData, {
               headers: {
                  "Content-Type": "multipart/form-data",
               },
            });
            setAccountPhoto(null);
            setSuccess('Фото успешно обновленно');
         } catch (error) {
            setError('Ошибка при обновлении фото, попробуйте ещё раз!');
         }
      }
   }

   const saveHandler = async () => {
      if (accountDetail && accountDetail.files) {
         const formData = new FormData();

         const links: string[] = [];

         accountDetail.files.forEach((item) => {
            if (typeof item === "string") {
               links.push(item);
            } else if (item instanceof File) {
               formData.append("files", item);
            }
         });

         formData.append("links", JSON.stringify(links));

         try {
            setSuccess('');
            await axios.post(`${apiUrl}/account-edit-media?id=${accountDetail.account.identificator}`, formData);

            setSuccess('Аккаунт успешно сохранено');
         } catch (error) {
            setError('Ошибка при сохранении аккаунта, попробуйте ещё раз!');
         }
      }
   }

   const updateDate = async (action: string) => {
      setSuccess('');
      setError('');
      if (accountDetail) {
         try {
            let value: string | null | undefined = undefined;

            if (action == 'save') {
               value = accountDate;
            } else if (action == 'reset') {
               value = null;
            }

            if (value || value == null) {
               await axios.post(apiUrlDateUpdate, {
                  id: accountDetail.account.id,
                  new_date_of_create: value
               });

               setSuccess('Дата успешно обновлена');
            } else {
               setError('Заполните нужные поля');
            }
         } catch (error) {
            setError('Произошла ошибка при обновлении даты');
         }
      } else {
         setError('Для начала нужно получить пользователя');
      }
   }

   const updateAccInfo = async () => {
      setSuccess('');
      setError('');
      if (accountDetail) {
         try {
            await axios.put(apiUrlAccUpdate, {
               id: accountDetail.account.id,
               name: accountName,
               city: accountCity,
               tags: accountTags,
               socials: accountSocials,
            });

            setSuccess('Аккаунт успешно изменен');
         } catch (error) {
            setError('Произошла ошибка при обновлении данных');
         }
      } else {
         setError('Для начала нужно получить пользователя');
      }
   }

   const addAccountSocialsHandler = () => {
      setAccountSocials(prev => [...prev, {
         id: Number(new Date()),
         type_social_id: 1,
         text: '',
         social_name: 'Facebook'
      }]);
   }

   const deleteHandler = (index: number) => {
      if (accountDetail) {
         setAccountDetail(prev => {
            if (prev) {
               return {
                  ...prev,
                  files: [...prev.files].filter((_: string | File, idx: number) => idx != index)
               };
            }
            return prev;
         });
      }
   }

   const handleMediaFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = event.target.files;
      if (!selectedFiles || !selectedFiles.length) {
         setError("Можно загружать только JPG или MP4 файлы.");
         return;
      }

      const allowedTypes = ["image/jpeg", "video/mp4"];
      const newFileUrls: File[] = [];

      for (const file of selectedFiles) {
         if (allowedTypes.includes(file.type)) {
            newFileUrls.push(file);
         } else {
            setError("Можно загружать только JPG или MP4 файлы.");
            return;
         }
      }

      setAccountDetail(prev => {
         if (prev) {
            return {
               ...prev,
               files: [...prev.files, ...newFileUrls]
            };
         }
         return prev;
      });
   };

   const formatDateForInput = (dateStr: string): string => {
      if (!dateStr) return '';
      try {
         return new Date(dateStr).toISOString().slice(0, 16);
      } catch (error) {
         return '';
      }
   }

   return (
      <>
         <div className="admin-accounts-edit__item">
            <div className="admin-accounts-edit__right">
               <input type="checkbox" onChange={handleCheckboxChange} checked={isChecked} />
               {isChecked && (
                  <svg
                     onClick={handleEdit}
                     width="22"
                     height="22"
                     viewBox="0 0 60 60"
                     fill="none"
                     xmlns="http://www.w3.org/2000/svg"
                     style={{ cursor: 'pointer', marginLeft: '8px' }}
                  >
                     <path d="M12.5 47.5H16.0625L40.5 23.0625L36.9375 19.5L12.5 43.9375V47.5ZM7.5 52.5V41.875L40.5 8.9375C41 8.47917 41.5525 8.125 42.1575 7.875C42.7625 7.625 43.3975 7.5 44.0625 7.5C44.7275 7.5 45.3733 7.625 46 7.875C46.6267 8.125 47.1683 8.5 47.625 9L51.0625 12.5C51.5625 12.9583 51.9275 13.5 52.1575 14.125C52.3875 14.75 52.5017 15.375 52.5 16C52.5 16.6667 52.3858 17.3025 52.1575 17.9075C51.9292 18.5125 51.5642 19.0642 51.0625 19.5625L18.125 52.5H7.5ZM38.6875 21.3125L36.9375 19.5L40.5 23.0625L38.6875 21.3125Z"
                        fill="#79C0AD" />
                  </svg>
               )}
               <div className="admin-accounts-edit__img">
                  {typeof account.photo == 'string' ? <img src={`${account.photo}`} /> :
                     account.photo && account.photo.data ? <img src={transformPhoto(account.photo)} /> :
                        <img src='/images/blog_image.jpg' />}
               </div>
            </div>
            <p className="admin-accounts-edit__name">Название: <svg onClick={() => { navigate(`/${account.id}`) }} width="20" height="20" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M45.3629 45.3629C47.2751 43.4507 48.792 41.1805 49.8269 38.6821C50.8618 36.1836 51.3945 33.5058 51.3945 30.8015C51.3945 28.0971 50.8618 25.4193 49.8269 22.9209C48.792 20.4224 47.2751 18.1522 45.3629 16.24C43.4507 14.3278 41.1805 12.8109 38.6821 11.776C36.1836 10.7411 33.5058 10.2084 30.8014 10.2084C28.0971 10.2084 25.4193 10.7411 22.9208 11.776C20.4224 12.8109 18.1522 14.3278 16.24 16.24C12.378 20.1019 10.2084 25.3398 10.2084 30.8015C10.2084 36.2631 12.378 41.501 16.24 45.3629C20.1019 49.2249 25.3398 51.3945 30.8014 51.3945C36.2631 51.3945 41.501 49.2249 45.3629 45.3629ZM45.3629 45.3629L58.3333 58.3333" stroke="#79C0AD" strokeWidth="4.375" strokeLinecap="round" strokeLinejoin="round" />
            </svg><br /><span>{account.name}</span></p>
            <p className="admin-accounts-edit__date">Дата создания: <br />
               <span>
                  {account.date_of_create
                     ? dayjs(account.date_of_create).format("DD.MM.YYYY: HH-mm")
                     : "Не указана"}
               </span>
            </p>
         </div>

         {isEditing && accountDetail && (
            <div className="admin-accounts-edit__form" style={{ marginBottom: "20px", border: "1px solid #ddd", padding: "15px", borderRadius: "5px" }}>
               {loading && <div className="loader">
                  <div className="loader__circle"></div>
               </div>}

               <div className="admin-accounts-get__block">
                  <h4>Медиа файлы</h4>
                  <div className="admin-accounts-get__images">
                     {accountDetail?.files.map((item, index) => {
                        let isImage = false;
                        let src = "";

                        if (item instanceof File) {
                           isImage = item.type.startsWith("image/");
                           src = URL.createObjectURL(item);
                        } else if (typeof item === "string") {
                           isImage = item.includes(".jpg") || item.includes(".jpeg") || item.includes(".png");
                           src = item.startsWith("blob") ? item : `${item}`;
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
                        <input type="file" accept=".jpg, .mp4" multiple onChange={handleMediaFileChange} />
                        <button className="btn btn-info" onClick={saveHandler}>Сохранить</button>
                     </div>
                  </div>
               </div>

               <hr />

               <div>
                  <h4>Информация о аккаунте</h4>
                  <div className="admin-accounts-get__time">
                     <p>Идентификатор : {accountDetail.account.identificator}</p>
                     <p>Имя :</p>
                     <input type="text" placeholder="Имя аккаунта" value={accountName} onChange={(e) => { setAccountName(e.target.value) }} />
                     <p>Город :</p>
                     <input type="text" placeholder="Город аккаунта" value={accountCity} onChange={(e) => { setAccountCity(e.target.value) }} />
                     <p>Тэги :</p>
                     <input type="text" placeholder="Тэги аккаунта" value={accountTags} onChange={(e) => { setAccountTags(e.target.value) }} />
                     <p>Контакты :</p>
                     {accountSocials.map(item => (
                        <AdminAccountsEditSocial key={item.id} {...item} setAccountSocials={setAccountSocials} />
                     ))}
                     <button className="btn btn-info admin-accounts-get__add" onClick={addAccountSocialsHandler}>Добавить контакт</button>
                     <button className="btn btn-info" onClick={updateAccInfo}>Сохранить</button>
                  </div>

                  <div className="admin-accounts-get__time">
                     <p>Указать дату создания :</p>
                     <input type="datetime-local" placeholder="Дата создания / публикации" value={formatDateForInput(accountDate)} onChange={(e) => { setAccountDate(e.target.value) }} />
                     <button className="btn btn-info" onClick={() => { updateDate('save') }}>Сохранить</button>
                     <button className="admin-accounts-get__reset" onClick={() => { updateDate('reset') }}>Сбросить дату</button>
                  </div>

                  <div className="admin-accounts-get__photo">
                     {accountPhoto ? <img src={URL.createObjectURL(accountPhoto)} /> :
                        accountDetail.account.photo ? <img src={transformPhoto(accountDetail.account.photo)} /> :
                           <img src="public/images/blog_image.jpg" />}
                  </div>
                  <div className="admin-accounts-get__files">
                     <input type="file" accept=".jpg" onChange={handleFileChange} />
                     <button className="btn btn-info" onClick={saveHandlerPhoto}>Сохранить</button>
                  </div>
               </div>
            </div>
         )}
      </>
   );
}

export default AdminAccountsEditItem