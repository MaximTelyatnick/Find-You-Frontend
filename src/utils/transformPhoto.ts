import IUser from "../types/IUser";

const transformPhoto = (photo: { type: string; data: number[]; } | null) => {
   if (photo) {
      const uint8Array = new Uint8Array(photo.data);
      const imageUrl = URL.createObjectURL(new Blob([uint8Array], { type: 'image/jpeg' }));

      return imageUrl
   }
}

export const transformPhotoAvatar = (avatar: IUser['avatar']) => {
   // Если аватар не указан, возвращаем путь к плейсхолдеру
   if (!avatar) {
      return '/images/default-avatar.png';
   }

   // Если у нас есть только признак наличия аватара, но без данных
   if (avatar.data && avatar.data.length === 0) {
      // Получаем ID пользователя из localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
         try {
            const user = JSON.parse(storedUser);
            // Создаем URL для запроса аватара с сервера
            return `http://localhost:5000/user-avatar/${user.id}?${Date.now()}`; // Добавляем timestamp для предотвращения кэширования
         } catch (e) {
            console.error("Ошибка при получении ID пользователя:", e);
         }
      }
      return '/images/default-avatar.png';
   }

   // Старый код для обработки бинарных данных, если они присутствуют
   try {
      if (avatar.data && avatar.data.length > 0) {
         const uint8Array = new Uint8Array(avatar.data);
         const blob = new Blob([uint8Array], { type: 'image/jpeg' });
         return URL.createObjectURL(blob);
      }
   } catch (error) {
      console.error("Ошибка при трансформации фото:", error);
   }

   return '/images/default-avatar.png';
};

export default transformPhoto