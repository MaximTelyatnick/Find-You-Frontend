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

      // Функция для форматирования названия социальной сети
      const formatSocialName = (name: string) => {
         if (name.toLowerCase() === 'vkontakte') return 'Вконтакте';
         if (name.toLowerCase() === 'phone') return 'Номер телефона';
         return name;
      };

      switch (socialName.toLowerCase()) {
         case 'telegram':
            return {
               href: `https://t.me/${valueWithoutAt}`,
               text: socialValue,
               displayName: formatSocialName(socialName)
            };
         case 'vkontakte':
            // Обработка для ID формата (id12345) и имен пользователей
            if (valueWithoutAt.startsWith('id') && /^\d+$/.test(valueWithoutAt.substring(2))) {
               return {
                  href: `https://vk.com/${valueWithoutAt}`,
                  text: socialValue,
                  displayName: formatSocialName(socialName)
               };
            }
            return {
               href: `https://vk.com/${valueWithoutAt}`,
               text: socialValue,
               displayName: formatSocialName(socialName)
            };
         case 'instagram':
            return {
               href: `https://instagram.com/${valueWithoutAt}`,
               text: socialValue,
               displayName: formatSocialName(socialName)
            };
         case 'phone':
            return {
               href: null,
               text: socialValue,
               displayName: formatSocialName(socialName)
            };
         default:
            // Для остальных соц. сетей возвращаем просто текст
            return {
               href: null,
               text: socialValue,
               displayName: formatSocialName(socialName)
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
            <div className="account-info__menu">
               <h5 className="list-group-item account-info__title">{account.name}</h5>
               <div className="list-group-item">Возраст: {
                  account.date_of_birth ? calculateAge(account.date_of_birth) : '-'
               }</div>
               <div className="list-group-item">Город: {
                  city.name_ru
               }</div>
               {
                  socials.map(item => {
                     const socialLink = getSocialLink(item.social_name, item.text);
                     return (
                        <div className="list-group-item" key={item.id}>
                           {socialLink.displayName}: {
                              socialLink.href ?
                                 <a href={socialLink.href} target="_blank" rel="noopener noreferrer">
                                    {socialLink.text}
                                 </a> :
                                 socialLink.text
                           }
                        </div>
                     );
                  })
               }
            </div>
         </div>
      </div>
   )
}

export default AccountInfo