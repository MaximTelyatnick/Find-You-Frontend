import IModal from "../../../types/IModal";

const ErrorModal = ({ isOpen, setIsOpen, children }: IModal) => {
   const closeModal = () => setIsOpen(false);

   return (
      <>
         {isOpen && (
            <div id="errorModal" className="modal">
               <div className="modal-content">
                  <div className="modal-header">
                     <p>Ошибка</p>
                     <span className="close-btn" onClick={closeModal}>&times;</span>
                  </div>
                  <div className="error-modal__content">
                     <p>{children}</p>
                  </div>
               </div>
            </div>
         )}
      </>
   );
}

export default ErrorModal;