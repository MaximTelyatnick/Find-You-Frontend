import { useEffect } from "react";

const useSecurityRestrictions = () => {
   useEffect(() => {
      // Блокировка PrintScreen
      const disablePrintScreen = (e: KeyboardEvent) => {
         if (e.key === "PrintScreen") {
            e.preventDefault();
            navigator.clipboard.writeText("");
            alert("Скриншоты запрещены!");
         }
      };

      // Запрет контекстного меню с проверкой разрешенных элементов
      const disableRightClickOnImages = (event: MouseEvent) => {
         const target = event.target as HTMLElement;
         const currentElement = target.closest('*');

         // Проверяем, является ли элемент или его родители одним из разрешенных
         const isAllowedElement =
            // Проверка на футер
            currentElement?.closest('.footer') ||
            // Проверка на хедер
            currentElement?.closest('.navbar') ||
            currentElement?.closest('.jumbotron-mob') ||
            // Проверка на элемент аккаунта
            currentElement?.closest('.account-item');

         // Если это не разрешенный элемент, предотвращаем контекстное меню
         if (!isAllowedElement) {
            event.preventDefault();
            return false;
         }

         // Для разрешенных элементов позволяем контекстное меню
         return true;
      };

      // Блокировка комбинаций клавиш
      const disableShortcutKeys = (e: KeyboardEvent) => {
         if (
            (e.ctrlKey && e.shiftKey && e.key === "S") || // Ctrl + Shift + S
            (e.altKey && e.key === "PrintScreen") || // Alt + PrintScreen
            (e.key === "PrintScreen") ||
            (e.metaKey && e.key === "S") // Cmd + S (macOS)
         ) {
            e.preventDefault();
            alert("Сохранение и скриншоты запрещены!");
         }
      };

      // Добавляем обработчики событий
      document.addEventListener("keydown", disablePrintScreen);
      document.addEventListener("keydown", disableShortcutKeys);
      document.addEventListener("contextmenu", disableRightClickOnImages);

      // Очистка при размонтировании
      return () => {
         document.removeEventListener("keydown", disablePrintScreen);
         document.removeEventListener("keydown", disableShortcutKeys);
         document.removeEventListener("contextmenu", disableRightClickOnImages);
      };
   }, []);
};

export default useSecurityRestrictions;