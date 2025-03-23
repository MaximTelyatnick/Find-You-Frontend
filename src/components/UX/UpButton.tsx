import { useEffect, useState } from "react";

const UpButton = () => {
   const [isVisible, setIsVisible] = useState(false);
   const [disable, setDisable] = useState(false)

   useEffect(() => {
      if (!disable) {
         const handleScroll = () => {
            setIsVisible(window.scrollY > 200);
         };

         window.addEventListener("scroll", handleScroll);
         return () => window.removeEventListener("scroll", handleScroll);
      }
   }, []);

   const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
   };

   return (
      <div
         className={`modern-upbutton visible-desktop`}
         title="Наверх"
         style={{
            display: "block",
            position: "fixed",
            bottom: "20px",
            right: "20px",
            color: "#fff",
            borderRadius: "5px",
            textAlign: "center",
            cursor: "pointer",
            transition: "opacity 0.6s ease-in-out, transform 0.6s ease-in-out",
            opacity: isVisible && !disable ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            pointerEvents: isVisible ? "auto" : "none"
         }}
      >
         <div className="highlight-area">
            <div className="subscripted-arrow">
               <span onClick={scrollToTop}>наверх</span>
            </div>
            <div className="modern-upbutton-disable">
               <span title="Скрыть кнопку" onClick={() => { setDisable(true) }}>убрать</span>
            </div>
         </div>
      </div>
   );
};

export default UpButton;
