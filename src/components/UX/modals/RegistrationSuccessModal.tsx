import IModal from "../../../types/IModal";

const RegistrationSuccessModal = ({ isOpen, setIsOpen, children }: IModal) => {
   const closeModal = () => setIsOpen(false);

   return (
      <>
         <div>{children}</div>
         {isOpen && (
            <div id="loginModal" className="modal">
               <div className="modal-content">
                  <div className="modal-header">
                     <p>Регистрация</p>
                     <span className="close-btn" onClick={closeModal}>&times;</span>
                  </div>
                  <div className="registration-modal__content">
                     <p>Вы успешно зарегестрировались !</p>
                  </div>
               </div>
            </div>
         )}
      </>
   );
}

export default RegistrationSuccessModal