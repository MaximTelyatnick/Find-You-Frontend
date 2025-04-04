import { IModalGallery } from '../../../types/IModal';
import { useEffect } from 'react';

const GalleryModal = ({ isOpen, setIsOpen, children, currentIndex, totalImages, onPrev, onNext }: IModalGallery) => {
   if (!isOpen) return null;

   const handleClose = () => {
      setIsOpen(false);
   };

   // Добавляем обработчик нажатия клавиш для навигации
   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.key === 'ArrowLeft') onPrev?.();
         if (e.key === 'ArrowRight') onNext?.();
         if (e.key === 'Escape') handleClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
   }, [onPrev, onNext, handleClose]);

   return (
      <div id="galleryModal" className="modal galleryModal">
         <div className="modal-content">
            {/* Счетчик изображений */}
            <div className="galleryModal__counter">
               {typeof currentIndex === 'number' ? currentIndex + 1 : 1} / {totalImages}
            </div>
            {/* Кнопка закрытия */}
            <div className="galleryModal__close" onClick={handleClose}>
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
               </svg>
            </div>
            {/* Левая стрелка */}
            <div className="galleryModal__nav galleryModal__nav--prev" onClick={onPrev}>
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
               </svg>
            </div>
            {/* Правая стрелка */}
            <div className="galleryModal__nav galleryModal__nav--next" onClick={onNext}>
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
               </svg>
            </div>
            <div className="galleryModal__body">
               {children}
            </div>
         </div>
      </div>
   );
};

export default GalleryModal;