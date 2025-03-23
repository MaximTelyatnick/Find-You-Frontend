import IModal from '../../../types/IModal';

const GalleryModal = ({ isOpen, setIsOpen, children }: IModal) => {
   if (!isOpen) return null;

   return (
      <div id="galleryModal" className="modal galleryModal">
         <div className="modal-content">
            <div className="modal-header">
               Галерея
               <span className="close-btn" onClick={() => setIsOpen(false)}>&times;</span>
            </div>
            <div className="galleryModal__body">{children}</div>
         </div>
      </div>
   );
};

export default GalleryModal;
