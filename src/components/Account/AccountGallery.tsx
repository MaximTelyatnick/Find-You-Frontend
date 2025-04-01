import { useState, useMemo } from "react";
import { IAccountAll } from "../../types/IAccounts";
import GalleryModal from "../UX/modals/GalleryModal";
import VideoPlayer from "../UX/VideoPlayer";

const AccountGallery = ({ files }: IAccountAll) => {
   const [isOpen, setIsOpen] = useState(false);
   const [activeItemIndex, setActiveItemIndex] = useState<number>(0);

   // Сортируем файлы и фильтруем только изображения для галереи
   const imageFiles = useMemo(() => {
      return files
         .filter(item => item.includes('.jpg'))
         .sort((a, b) => Number(a.endsWith(".mp4")) - Number(b.endsWith(".mp4")));
   }, [files]);

   // Все файлы для отображения
   const filesSorted = useMemo(() => {
      return files.sort((a, b) => Number(a.endsWith(".mp4")) - Number(b.endsWith(".mp4")));
   }, [files]);

   const openModal = (index: number) => {
      setActiveItemIndex(index);
      setIsOpen(true);
   };

   const handlePrev = () => {
      setActiveItemIndex((prev) => (prev > 0 ? prev - 1 : imageFiles.length - 1));
   };

   const handleNext = () => {
      setActiveItemIndex((prev) => (prev < imageFiles.length - 1 ? prev + 1 : 0));
   };

   return (
      <div>
         <div className="account-gallery" style={{ padding: '40px 0 0 0' }}>
            {imageFiles.map((item, index) => (
               <div key={item} className="account-gallery__item" onClick={() => openModal(index)}>
                  <img src={`${item}`} alt="Image" />
               </div>
            ))}
         </div>

         <div className="account-gallery account-gallery__videos" style={{ padding: '25px 0 0 0' }}>
            {filesSorted
               .filter(item => !item.includes('.jpg'))
               .map((item, index) => (
                  <div key={`video-container-${index}`} className="account-gallery__item">
                     <VideoPlayer key={`video-player-${index}`} src={`${item}`} />
                  </div>
               ))
            }
         </div>

         {isOpen && (
            <GalleryModal
               isOpen={isOpen}
               setIsOpen={setIsOpen}
               currentIndex={activeItemIndex}
               totalImages={imageFiles.length}
               onPrev={handlePrev}
               onNext={handleNext}
            >
               <img src={`${imageFiles[activeItemIndex]}`} alt="Image" />
            </GalleryModal>
         )}
      </div>
   );
};

export default AccountGallery;