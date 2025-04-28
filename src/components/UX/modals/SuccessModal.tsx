import IModal from "../../../types/IModal";

const SuccessModal = ({ isOpen, setIsOpen, children }: IModal) => {
   const closeModal = () => setIsOpen(false);

   return (
      <>
         {isOpen && (
            <div id="successModal" className="modal">
               <div className="modal-content">
                  <div className="modal-header">
                     <p>Успешное действие</p>
                     <span className="close-btn" onClick={closeModal}>&times;</span>
                  </div>
                  <div className="success-modal__content">
                     <p>{children}</p>
                  </div>
               </div>
            </div>
         )}
      </>
   );
}

export default SuccessModal;