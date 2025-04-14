import { IAccountAll } from "../../types/IAccounts"
import transformPhoto from "../../utils/transformPhoto";

const AccountInfo = ({ account, city, socials, files }: IAccountAll) => {
   // Функция расчета возраста
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

   // Функция для создания ссылок из социальных сетей
   const getSocialLink = (socialName: string, socialValue: string) => {
      // Удаляем символ @ из начала значения, если он есть
      const valueWithoutAt = socialValue.startsWith('@') ? socialValue.substring(1) : socialValue;

      switch (socialName.toLowerCase()) {
         case 'telegram':
            return {
               href: `https://t.me/${valueWithoutAt}`,
               text: socialValue
            };
         case 'vkontakte':
            // Обработка для ID формата (id12345) и имен пользователей
            if (valueWithoutAt.startsWith('id') && /^\d+$/.test(valueWithoutAt.substring(2))) {
               return {
                  href: `https://vk.com/${valueWithoutAt}`,
                  text: socialValue
               };
            }
            return {
               href: `https://vk.com/${valueWithoutAt}`,
               text: socialValue
            };
         case 'instagram':
            return {
               href: `https://instagram.com/${valueWithoutAt}`,
               text: socialValue
            };
         default:
            // Для остальных соц. сетей возвращаем просто текст
            return {
               href: null,
               text: socialValue
            };
      }
   };

   return (
      <div className="account-info row-fluid">
         <div className="span5">
            <div className="thumbnail">
               {account.photo && account.photo.data ? <img src={transformPhoto(account.photo)} alt="Фото профиля" /> :
                  files[0] ? <img src={`${files[0]}`} alt="Фото профиля" /> :
                     <img src='/images/blog_image.jpg' alt="Фото профиля по умолчанию" />}
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
                  socials.map(item => {
                     const socialLink = getSocialLink(item.social_name, item.text);
                     return (
                        <li className="list-group-item" key={item.id}>
                           {item.social_name}: {
                              socialLink.href ?
                                 <a href={socialLink.href} target="_blank" rel="noopener noreferrer">
                                    {socialLink.text}
                                 </a> :
                                 socialLink.text
                           }
                        </li>
                     );
                  })
               }
            </ul>
         </div>
      </div>
   )
}

export default AccountInfo