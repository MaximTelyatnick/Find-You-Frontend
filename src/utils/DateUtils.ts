export function convertUtcToLocal(dateStr: string, timeStr: string) {
   // Собираем ISO-строку в формате UTC
   const utcDateTimeStr = `${dateStr}T${timeStr}Z`;

   // Преобразуем в Date-объект
   const date = new Date(utcDateTimeStr);

   // Получаем компоненты в локальном времени
   const day = String(date.getDate()).padStart(2, '0');
   const month = String(date.getMonth() + 1).padStart(2, '0');
   const year = date.getFullYear();

   const hours = String(date.getHours()).padStart(2, '0');
   const minutes = String(date.getMinutes()).padStart(2, '0');

   // Формируем строку
   return `${day}.${month}.${year} ${hours}:${minutes}`;
}