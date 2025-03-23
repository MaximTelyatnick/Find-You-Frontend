import { useEffect } from "react";

const useSecurityRestrictions = () => {
   useEffect(() => {
      const disablePrintScreen = (e: KeyboardEvent) => {
         if (e.key === "PrintScreen") {
            e.preventDefault();
            navigator.clipboard.writeText("");
            alert("Скриншоты запрещены!");
         }
      };

      const disableRightClickOnImages = (event: MouseEvent) => {
         event.preventDefault();
         return
      };

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

      document.addEventListener("keydown", disablePrintScreen);
      document.addEventListener("keydown", disableShortcutKeys);
      document.addEventListener("contextmenu", disableRightClickOnImages);

      return () => {
         document.removeEventListener("keydown", disablePrintScreen);
         document.removeEventListener("keydown", disableShortcutKeys);
         document.removeEventListener("contextmenu", disableRightClickOnImages);
      };
   }, []);
};

export default useSecurityRestrictions