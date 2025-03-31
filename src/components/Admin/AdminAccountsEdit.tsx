import { useEffect, useState } from "react";
import axios from "axios";
import { IAdminAccountAll } from "../../types/Admin";
import { ITag } from "../../types/ITagsProps";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IAccount, ISocials } from "../../types/IAccounts";
import Pagination from "../UX/Pagination";
import AdminAccountsEditItem from "./AdminAccountsEditItem";
import transformPhoto from "../../utils/transformPhoto";
import AdminAccountsEditSocial from "./AdminAccountsEditSocial";

const AdminAccountsEdit = () => {
   const apiUrlGet = 'http://167.86.84.197:5000/account'
   const apiUrlDelete = 'http://167.86.84.197:5000/delete-account'
   const apiUrlDeleteAccounts = 'http://167.86.84.197:5000/delete-accounts'
   const apiUrlUpdate = 'http://167.86.84.197:5000/update-photo'
   const apiUrlDateUpdate = 'http://167.86.84.197:5000/update-account-date'
   const apiUrlAccUpdate = 'http://167.86.84.197:5000/update-account'
   const apiUrl = 'http://167.86.84.197:5000'
   const [account, setAccount] = useState<IAdminAccountAll | null>(null)
   const [accounts, setAccounts] = useState<IAccount[] | null>(null)
   const [accountsSelected, setAccountsSelected] = useState<number[]>([])
   const [success, setSuccess] = useState<string>('');
   const [error, setError] = useState<string>('');
   const [accountName, setAccountName] = useState<string>(account?.account.name ? account?.account.name : '');
   const [accountCity, setAccountCity] = useState<string>(account?.city.name_ru ? account?.city.name_ru : '');
   const [accountTags, setAccountTags] = useState<string>(account?.tags ? account?.tags.join(', ') : '');
   const [accountSocials, setAccountSocials] = useState<ISocials[]>([]);
   const [accountDate, setAccountDate] = useState<string>('');
   const [accountPhoto, setAccountPhoto] = useState<File | null>()
   const [totalPages, setTotalPages] = useState<number>(1);
   const [searchParams] = useSearchParams();
   const page = Number(searchParams.get("page")) || 1;
   const search = searchParams.get("search") || '';
   const [searchInput, setSearchInput] = useState<string>(search);
   const navigate = useNavigate()


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

   const getAccountsHandler = async () => {
      setError('')
      setSuccess('')

      let apiUrlAccouts = `http://167.86.84.197:5000/accounts?page=${page}`;
      if (searchInput) apiUrlAccouts += `&search=${searchInput}`;

      try {
         const result = await axios.get(`${apiUrlAccouts}`)

         setTotalPages(result.data.totalPages || 1);

         setAccounts(result.data.accounts)
         setSuccess('Аккаунт успешно получен')
      } catch (error) {
         setError('Ошибка при получении аккаунта, попробуйте ещё раз!')
      }
   }

   const getAccountHandler = async () => {
      setError('')
      setSuccess('')
      setAccount(null)

      try {
         const result = await axios.get(`${apiUrlGet}?id=${accountsSelected[0]}`)

         setAccount(result.data)
         setAccountName(result.data.account.name)
         setAccountCity(result.data.city.name_ru)
         setAccountTags(result.data.tags.map((item: ITag) => item.name_ru).join(", "))
         setAccountSocials(result.data.socials)

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

   const deleteAccountsHandler = async () => {
      try {
         setError('')
         setSuccess('')

         await axios.delete(apiUrlDeleteAccounts, {
            data: {
               account_ids: accountsSelected,
            }
         })

         setSuccess('Аккаунты успешно удалены')
         accountsSelected.forEach(itemSelected => {
            setAccounts(prev => prev && prev.filter(item => item.id != itemSelected))
         })
      } catch (error) {
         setError('Ошибка при удалении аккаунтов, попробуйте ещё раз!')
      }
   }

   const addAccountSocialsHandler = () => {
      setAccountSocials(prev => [...prev, {
         id: Number(new Date()),
         type_social_id: 1,
         text: '',
         social_name: 'Facebook'
      }])
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

   const updateAccInfo = async () => {
      setSuccess('')
      setError('')
      if (account) {
         try {
            await axios.put(apiUrlAccUpdate, {
               id: account?.account.id,
               name: accountName,
               city: accountCity,
               tags: accountTags,
               socials: accountSocials,
            })

            setSuccess('Аккаунт успешно изменен')
         } catch (error) {
            setError('Произошла ошибка при обновлении данных')
         }
      } else {
         setError('Для начала нужно получить пользователя')
      }
   }

   useEffect(() => {
      getAccountsHandler()
   }, [page, search])

   return (
      <div className="admin-accounts-get">
         <h5>Получение аккаунта</h5>
         {error && <p style={{ color: 'red' }}>{error}</p>}
         {success && <p style={{ color: 'green' }}>{success}</p>}
         <form className="admin-accounts-get__form" onSubmit={(e) => { e.preventDefault(); navigate(`/admin-accounts?page=1&search=${searchInput}`) }}>
            <input type="text" placeholder="Поиск..." onChange={(e) => { setSearchInput(e.target.value) }} />
            <button className="btn btn-info">Получить</button>
         </form>
         {account && <>
            <div className="admin-accounts-get__block">
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
                        src = item.startsWith("blob") ? item : `http://167.86.84.197:5000${item}`;
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
               <h3>Информация о аккаунте</h3>
               <div className="admin-accounts-get__time">
                  <p>Имя :</p>
                  <input type="text" placeholder="Имя аккаунта" value={accountName} onChange={(e) => { setAccountName(e.target.value) }} />
                  <p>Город :</p>
                  <input type="text" placeholder="Город аккаунта" value={accountCity} onChange={(e) => { setAccountCity(e.target.value) }} />
                  <p>Тэги :</p>
                  <input type="text" placeholder="Тэги аккаунта" value={accountTags} onChange={(e) => { setAccountTags(e.target.value) }} />
                  <p>Контакты :</p>
                  {accountSocials.map(item => (
                     <AdminAccountsEditSocial {...item} setAccountSocials={setAccountSocials} />
                  ))}
                  <button className="btn btn-info admin-accounts-get__add" onClick={() => { addAccountSocialsHandler() }}>Добавить контакт</button>
                  <button className="btn btn-info" onClick={() => { updateAccInfo() }}>Сохранить</button>
               </div>

               <div className="admin-accounts-get__time">
                  <p>Указать дату создания :</p>
                  <input type="datetime-local" placeholder="Дата создания / публикации" value={accountDate} onChange={(e) => { setAccountDate(e.target.value) }} />
                  <button className="btn btn-info" onClick={() => { updateDate('save') }}>Сохранить</button>
                  <button className="admin-accounts-get__reset" onClick={() => { updateDate('reset') }}>Сбросить дату</button>
               </div>

               <div className="admin-accounts-get__photo">
                  {accountPhoto ? <img src={URL.createObjectURL(accountPhoto)} /> :
                     account.account.photo ? <img src={transformPhoto(account.account.photo)} /> :
                        <img src="public/images/blog_image.jpg" />}
               </div>
               <div className="admin-accounts-get__files">
                  <input type="file" accept=".jpg" onChange={(e) => { setAccountPhoto(e.target.files ? e.target.files[0] : null) }} />
                  <button className="btn btn-info" onClick={saveHandlerPhoto}>Сохранить</button>
               </div>

               <div className="admin-accounts-get__bin" onClick={deleteAccountHandler}>
                  <span>!!! Удалить аккаунт</span>
                  <svg width="20" height="20" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M55.4166 11.6667H45.2083L42.2916 8.75H27.7083L24.7916 11.6667H14.5833V17.5H55.4166M17.5 55.4167C17.5 56.9638 18.1146 58.4475 19.2085 59.5415C20.3025 60.6354 21.7862 61.25 23.3333 61.25H46.6666C48.2137 61.25 49.6975 60.6354 50.7914 59.5415C51.8854 58.4475 52.5 56.9638 52.5 55.4167V20.4167H17.5V55.4167Z" fill="#E36F6F" />
                  </svg> !!!
               </div>
            </div>
         </>
         }
         <div className="admin-accounts-get__toolbar">
            {accountsSelected.length > 0 && <svg onClick={deleteAccountsHandler} width="35" height="35" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M15 47.5C15 48.8261 15.5268 50.0979 16.4645 51.0355C17.4021 51.9732 18.6739 52.5 20 52.5H40C41.3261 52.5 42.5979 51.9732 43.5355 51.0355C44.4732 50.0979 45 48.8261 45 47.5V17.5H15V47.5ZM20 22.5H40V47.5H20V22.5ZM38.75 10L36.25 7.5H23.75L21.25 10H12.5V15H47.5V10H38.75Z" fill="#E36F6F" />
            </svg>}
            {accountsSelected.length == 1 && <svg onClick={getAccountHandler} width="35" height="35" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M12.5 47.5H16.0625L40.5 23.0625L36.9375 19.5L12.5 43.9375V47.5ZM7.5 52.5V41.875L40.5 8.9375C41 8.47917 41.5525 8.125 42.1575 7.875C42.7625 7.625 43.3975 7.5 44.0625 7.5C44.7275 7.5 45.3733 7.625 46 7.875C46.6267 8.125 47.1683 8.5 47.625 9L51.0625 12.5C51.5625 12.9583 51.9275 13.5 52.1575 14.125C52.3875 14.75 52.5017 15.375 52.5 16C52.5 16.6667 52.3858 17.3025 52.1575 17.9075C51.9292 18.5125 51.5642 19.0642 51.0625 19.5625L18.125 52.5H7.5ZM38.6875 21.3125L36.9375 19.5L40.5 23.0625L38.6875 21.3125Z" fill="#E36F6F" />
            </svg>}
         </div>
         <div className="account__items admin-accounts-edit">
            {accounts && accounts.map(item => {
               return <AdminAccountsEditItem account={{ ...item }} setAccountsSelected={setAccountsSelected} key={item.id} />
            })}
         </div>
         <Pagination itemsLength={accounts ? accounts.length : 0} page={page} totalPages={totalPages} cityId={0} tagIds={[]} search={search} visiblePages={5} type={'admin'} />
      </div>
   )
}

export default AdminAccountsEdit