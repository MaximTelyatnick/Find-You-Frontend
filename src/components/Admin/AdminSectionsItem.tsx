import { useState } from "react"
import Layout from "../UX/Layout"
import { IAdminSectionsItem, ISection } from "../../types/Admin"
import TextEditor from "../UX/TextEditor"
import SuccessModal from "../UX/modals/SuccessModal"
import ErrorModal from "../UX/modals/ErrorModal"

const AdminSectionsItem = ({ setSections, id }: IAdminSectionsItem) => {
   const [layout, setLayout] = useState<number>(0)
   const [message, setMessage] = useState<string>("");
   const [dropdownLayouts, setDropdownLayouts] = useState<boolean>(false);
   const [files, setFiles] = useState<File[]>([])
   const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
   const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
   const [successMessage, setSuccessMessage] = useState<string>('');
   const [errorMessage, setErrorMessage] = useState<string>('');

   const layoutNames: string[] = ['Текст | Изображение', 'Изображение | Текст', 'Текст', 'Текст | 2 Изображения', '2 Изображения | Текст', 'Изображение | Изображение', 'Изображение | 2 Изображения', '2 Изображения | Изображение', '3 Изображения']

   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
         const newFiles = Array.from(event.target.files);
         setFiles((prevFiles) => [...prevFiles, ...newFiles]);

         setSections((prev: ISection[]) =>
            prev.map((item) =>
               item.id === id ? { ...item, files: [...item.files, ...newFiles] } : item
            )
         );

         setSuccessMessage("Файлы успешно добавлены");
         setIsSuccessModalOpen(true);
      }
   };

   const setMessageHandler = (text: string) => {
      if (text.length > 5000) {
         setErrorMessage("Текст не может быть длиннее 5000 символов");
         setIsErrorModalOpen(true);
         return;
      }

      setMessage(text);

      setSections((prev: ISection[]) =>
         prev.map((item) =>
            item.id === id ? { ...item, text: text } : item
         )
      );
   };

   const setLayoutHandler = (layoutNum: number) => {
      setLayout(layoutNum);
      setDropdownLayouts(false);

      setSections((prev: ISection[]) =>
         prev.map((item) =>
            item.id === id ? { ...item, layout: layoutNum } : item
         )
      );

      setSuccessMessage("Макет успешно изменен");
      setIsSuccessModalOpen(true);
   };

   const removeHandler = () => {
      setSections((prev: ISection[]) => prev.filter((s) => s.id !== id));
   }

   const generateFileURLs = (files: File[]): string[] => {
      return files.map((file) => URL.createObjectURL(file));
   };

   return (
      <div className="admin-section-editor">
         <div className="admin-section-editor__item">
            <div className="admin-section-editor__text">
               <div className="admin-accounts-get__files">
                  <input type="file" accept=".jpg" multiple onChange={handleFileChange} />
               </div>
               <TextEditor content={message} setContent={setMessageHandler} />
            </div>
            <div className="admin-section-editor__layout">
               <div className={`admin-section-dropdown ${dropdownLayouts && 'active' || ''}`}>
                  <div className="admin-sections-editor__buttons">
                     <button className="admin-section-dropdown__button btn" onClick={() => { setDropdownLayouts(prev => !prev) }}>
                        <span>{layoutNames[layout]}</span> <svg width="15" height="10" viewBox="0 0 28 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <path d="M1.5 1L14 13.5L26.5 1" stroke="grey" strokeWidth="2" />
                        </svg>
                     </button>
                     <svg onClick={removeHandler} width="30" height="30" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M55.4166 11.6667H45.2083L42.2916 8.75H27.7083L24.7916 11.6667H14.5833V17.5H55.4166M17.5 55.4167C17.5 56.9638 18.1146 58.4475 19.2085 59.5415C20.3025 60.6354 21.7862 61.25 23.3333 61.25H46.6666C48.2137 61.25 49.6975 60.6354 50.7914 59.5415C51.8854 58.4475 52.5 56.9638 52.5 55.4167V20.4167H17.5V55.4167Z" fill="#E36F6F" />
                     </svg>
                  </div>
                  <div className="admin-section-dropdown__main">
                     <button className="admin-section-dropdown__option btn" onClick={() => { setLayoutHandler(0) }}>
                        Текст | Изображение
                     </button>
                     <button className="admin-section-dropdown__option btn" onClick={() => { setLayoutHandler(1) }}>
                        Изображение | Текст
                     </button>
                     <button className="admin-section-dropdown__option btn" onClick={() => { setLayoutHandler(2) }}>
                        Текст
                     </button>
                     <button className="admin-section-dropdown__option btn" onClick={() => { setLayoutHandler(3) }}>
                        Текст | 2 Изображения
                     </button>
                     <button className="admin-section-dropdown__option btn" onClick={() => { setLayoutHandler(4) }}>
                        2 Изображения | Текст
                     </button>
                     <button className="admin-section-dropdown__option btn" onClick={() => { setLayoutHandler(5) }}>
                        Изображение | Изображение
                     </button>
                     <button className="admin-section-dropdown__option btn" onClick={() => { setLayoutHandler(6) }}>
                        Изображение |  2 Изображения
                     </button>
                     <button className="admin-section-dropdown__option btn" onClick={() => { setLayoutHandler(7) }}>
                        2 Изображения | Изображение
                     </button>
                     <button className="admin-section-dropdown__option btn" onClick={() => { setLayoutHandler(8) }}>
                        3 Изображения
                     </button>
                  </div>
               </div>
               <Layout layoutId={layout} text={message} urls={generateFileURLs(files)} />
            </div>
         </div>

         <SuccessModal isOpen={isSuccessModalOpen} setIsOpen={setIsSuccessModalOpen}>
            {successMessage}
         </SuccessModal>

         <ErrorModal isOpen={isErrorModalOpen} setIsOpen={setIsErrorModalOpen}>
            {errorMessage}
         </ErrorModal>
      </div>
   )
}

export default AdminSectionsItem