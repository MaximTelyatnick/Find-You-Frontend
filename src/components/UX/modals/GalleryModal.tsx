import { isValidElement, useRef } from 'react';
import IModal from '../../../types/IModal';

const GalleryModal = ({ isOpen, setIsOpen, children }: IModal) => {
   if (!isOpen) return null;

   const videoRef = useRef<HTMLVideoElement | null>(null);

   console.log(children);


   // Воспроизведение / пауза
   const togglePlayPause = () => {
      if (videoRef.current) {
         if (videoRef.current.paused) {
            videoRef.current.play();
         } else {
            videoRef.current.pause();
         }
      }
   };

   // Перемотка
   const skipTime = (seconds: number) => {
      if (videoRef.current) {
         videoRef.current.currentTime += seconds;
      }
   };

   // Регулировка громкости
   const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (videoRef.current) {
         videoRef.current.volume = Number(event.target.value);
      }
   };

   return (
      <div id="galleryModal" className="modal galleryModal">
         <div className="modal-content">
            <div className="modal-header">
               Галерея
               <span className="close-btn" onClick={() => setIsOpen(false)}>&times;</span>
            </div>
            <div className="galleryModal__body">
               {isValidElement(children) && children.type === "video" ?
                  <div className="video-container">
                     <video ref={videoRef} src={children.props.src} autoPlay className="video" />
                     <div className="controls">
                        <button onClick={togglePlayPause}>▶ / ⏸</button>
                        <button onClick={() => skipTime(-5)}>⏪ 5 сек</button>
                        <button onClick={() => skipTime(5)}>⏩ 5 сек</button>
                        <input type="range" min="0" max="1" step="0.1" defaultValue="1" onChange={handleVolumeChange} />
                     </div>
                  </div> : children}
            </div>
         </div>
      </div>
   );
};

export default GalleryModal;
