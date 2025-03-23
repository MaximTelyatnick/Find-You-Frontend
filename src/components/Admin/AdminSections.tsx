import { useState } from "react"
import Title from "../UX/Title"
import AdminSectionsItem from "./AdminSectionsItem"
import { ISection } from "../../types/Admin"
import axios from "axios"

const AdminSections = () => {
   const [sections, setSections] = useState<ISection[]>([])
   const [page, setPage] = useState<string>('')
   const [dropdownPage, setDropdownPage] = useState<boolean>(false);
   const [error, setError] = useState<string>('')
   const [success, setSuccess] = useState<string>('')

   const setPageHandler = (page: string) => {
      setPage(page)
      setDropdownPage(false)
      setSections([{ id: Date.now() + Math.random(), layout: 0, text: '', files: [] }])
   }
   const addSectionHandler = () => {
      if (!page) return
      setSections((prev) => [...prev, { id: Date.now() + Math.random(), layout: 0, text: '', files: [] }]);
   }

   const savePageHandler = async () => {
      if (!page) {
         setError("Выберите страницу!");
         return;
      }

      try {
         setError("");
         setSuccess("");

         const formData = new FormData();
         formData.append("page_name", page);

         sections.forEach((section, index) => {
            formData.append(`sections[${index}][page_name]`, page);
            formData.append(`sections[${index}][section_order]`, String(index + 1)); // Преобразование в строку
            formData.append(`sections[${index}][layout_id]`, String(section.layout)); // Преобразование в строку
            formData.append(`sections[${index}][content]`, section.text);

            // Добавляем файлы, если они есть
            if (section.files && section.files.length > 0) {
               section.files.forEach((file) => {
                  formData.append('files', file); // Поменяйте на 'files' без индексации
               });
            }
         });

         const response = await axios.post("http://localhost:5000/save-sections", formData, {
            headers: {
               "Content-Type": "multipart/form-data",
            },
         });

         setSuccess("Секции сохранены!");
      } catch (error) {
         setError("Ошибка при сохранении секций");
         console.error(error);
      }
   };



   return (
      <div className="admin-section">
         <Title classes='pt'>Конструктор</Title>
         <div className="admin-section__content">
            {error && <p>{error}</p>}
            {success && <p>{success}</p>}
            <div className={`admin-section-dropdown ${dropdownPage && 'active' || ''}`}>
               <button className="admin-section-dropdown__button btn" onClick={() => { setDropdownPage(prev => !prev) }}>
                  <span>{page ? page : 'Страница'}</span> <svg width="15" height="10" viewBox="0 0 28 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M1.5 1L14 13.5L26.5 1" stroke="grey" strokeWidth="2" />
                  </svg>
               </button>
               <div className="admin-section-dropdown__main">
                  <button className="admin-section-dropdown__option btn" onClick={() => { setPageHandler('Про нас') }}>
                     Про нас
                  </button>
                  <button className="admin-section-dropdown__option btn" onClick={() => { setPageHandler('Зеркала') }}>
                     Зеркала
                  </button>
                  <button className="admin-section-dropdown__option btn" onClick={() => { setPageHandler('Бесплатный доступ') }}>
                     Бесплатный доступ
                  </button>
                  <button className="admin-section-dropdown__option btn" onClick={() => { setPageHandler('Реферальная система') }}>
                     Реферальная система
                  </button>
                  <button className="admin-section-dropdown__option btn" onClick={() => { setPageHandler('Обход блокировок') }}>
                     Обход блокировок
                  </button>
                  <button className="admin-section-dropdown__option btn" onClick={() => { setPageHandler('Отказ от ответственности') }}>
                     Отказ от ответственности
                  </button>
                  <button className="admin-section-dropdown__option btn" onClick={() => { setPageHandler('Футер') }}>
                     Футер
                  </button>
               </div>
            </div>
            {sections.map((item) => (
               <AdminSectionsItem key={item.id} id={item.id} setSections={setSections} />
            ))}
            <div className="admin-section-editor__more">
               <button className="btn" onClick={() => { addSectionHandler() }}>Добавить секцию</button>
            </div>
            <div className="admin-section-editor__more">
               <button className="btn btn-info" onClick={() => { savePageHandler() }}>Сохранить страницу</button>
            </div>
         </div>
      </div>
   )
}

export default AdminSections