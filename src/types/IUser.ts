export default interface IUser {
   id: number;
   login: string;
   pass: string;
   avatar?: { type: string; data: number[]; }; // Поле avatar отсутствует в данных, делаем необязательным
   date_of_create: string; // Можно заменить на Date, если планируете работать с объектами даты
   mail: string;
   session_id?: string | null; // Поле session_id может отсутствовать, делаем необязательным
   role: string;
}
