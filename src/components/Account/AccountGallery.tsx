import { useState } from "react";
import { IAccountAll } from "../../types/IAccounts";
import GalleryModal from "../UX/modals/GalleryModal";

const AccountGallery = ({ files }: IAccountAll) => {
   const [isOpen, setIsOpen] = useState(false);
   const [activeItem, setActiveItem] = useState<string | null>(null);

   const openModal = (item: string) => {
      setActiveItem(item);
      setIsOpen(true);
   };

   return (
      <div>
         <div className="account-gallery" style={{ padding: '40px 0 0 0' }}>
            {files.sort((a, b) => Number(a.endsWith(".mp4")) - Number(b.endsWith(".mp4"))).map((item) => (
               <div key={item} className="account-gallery__item" onClick={() => openModal(item)}>
                  {item.includes('.jpg') ? (
                     <img src={`http://167.86.84.197:5000${item}`} alt="Image" />
                  ) : (
                     <video src={`http://167.86.84.197:5000${item}`} autoPlay muted />
                  )}
               </div>
            ))}
         </div>

         {/* Модалка вызывается один раз и получает активный элемент */}
         {isOpen && activeItem && (
            <GalleryModal isOpen={isOpen} setIsOpen={setIsOpen}>
               {activeItem.includes('.jpg') ? (
                  <img src={`http://167.86.84.197:5000${activeItem}`} alt="Image" />
               ) : (
                  <video src={`http://167.86.84.197:5000${activeItem}`} autoPlay muted />
               )}
            </GalleryModal>
         )}
      </div>
   );
};

export default AccountGallery;
