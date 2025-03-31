import dayjs from "dayjs"
import { IHomeAccount } from "../../types/IAccounts"
import { useNavigate } from "react-router-dom"
import transformPhoto from "../../utils/transformPhoto"

const AdminAccountsEditItem = ({ account, setAccountsSelected }: { account: IHomeAccount, setAccountsSelected: Function }) => {
   const navigate = useNavigate()

   const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setAccountsSelected((prevSelected: number[]) =>
         event.target.checked
            ? [...prevSelected, account.id]  // Добавляем ID, если чекбокс включен
            : prevSelected.filter(id => id !== account.id) // Удаляем ID, если чекбокс выключен
      );
   };

   return (
      <div className="admin-accounts-edit__item">
         <div className="admin-accounts-edit__right">
            <input type="checkbox" onChange={handleCheckboxChange} />
            <div className="admin-accounts-edit__img">
               {typeof account.photo == 'string' ? <img src={`http://167.86.84.197:5000${account.photo}`} /> :
                  account.photo && account.photo.data ? <img src={transformPhoto(account.photo)} /> :
                     <img src='/images/blog_image.jpg' />}
               {!!account.check_video && <div className="account-item__icon">
                  VIDEO
               </div>}
            </div>
         </div>
         <p className="admin-accounts-edit__name">Название: <svg onClick={() => { navigate(`/${account.id}`) }} width="20" height="20" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M45.3629 45.3629C47.2751 43.4507 48.792 41.1805 49.8269 38.6821C50.8618 36.1836 51.3945 33.5058 51.3945 30.8015C51.3945 28.0971 50.8618 25.4193 49.8269 22.9209C48.792 20.4224 47.2751 18.1522 45.3629 16.24C43.4507 14.3278 41.1805 12.8109 38.6821 11.776C36.1836 10.7411 33.5058 10.2084 30.8014 10.2084C28.0971 10.2084 25.4193 10.7411 22.9208 11.776C20.4224 12.8109 18.1522 14.3278 16.24 16.24C12.378 20.1019 10.2084 25.3398 10.2084 30.8015C10.2084 36.2631 12.378 41.501 16.24 45.3629C20.1019 49.2249 25.3398 51.3945 30.8014 51.3945C36.2631 51.3945 41.501 49.2249 45.3629 45.3629ZM45.3629 45.3629L58.3333 58.3333" stroke="#79C0AD" strokeWidth="4.375" strokeLinecap="round" strokeLinejoin="round" />
         </svg><br /><span>{account.name}</span></p>
         <p className="admin-accounts-edit__date">Дата создания: <br /><span>{dayjs(new Date(account.date_of_create)).format("DD.MM.YYYY: hh-mm")}</span></p>
      </div>
   )
}

export default AdminAccountsEditItem