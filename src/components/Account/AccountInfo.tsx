import { IAccountAll } from "../../types/IAccounts"
import transformPhoto from "../../utils/transformPhoto";

const AccountInfo = ({ account, city, socials, files }: IAccountAll) => {

   function calculateAge(dateOfBirth: string) {
      const birthDate = new Date(dateOfBirth); // Преобразуем строку в объект Date
      const today = new Date(); // Текущая дата

      let age = today.getFullYear() - birthDate.getFullYear(); // Разница в годах

      // Проверка, если день рождения еще не был в текущем году
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
         age--; // Если день рождения еще не наступил, убавляем 1 год
      }

      return age;
   }

   return (
      <div className="account-info row-fluid">
         <div className="span5">
            <div className="thumbnail">
               {account.photo && account.photo.data ? <img src={transformPhoto(account.photo)} /> :
                  files[0] ? <img src={`http://localhost:5000${files[0]}`} /> :
                     <img src='/images/blog_image.jpg' />}
            </div>
         </div>
         <div className="span7">
            <h3 className="account-info__title">{account.name}</h3>
            <ul className="account-info__menu">
               <li className="list-group-item">Возраст: {
                  account.date_of_birth ? calculateAge(account.date_of_birth) : '-'
               }</li>
               <li className="list-group-item">Город: {
                  city.name_ru
               }</li>
               {
                  socials.map(item => (
                     <li className="list-group-item" key={item.id}>{item.social_name}: {item.text}</li>
                  ))
               }
            </ul>
         </div>
      </div>
   )
}

export default AccountInfo