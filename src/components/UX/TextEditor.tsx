import { useState, useRef, useEffect, FormEvent, ChangeEvent } from 'react';
import { ITextEditorProps, SelectionPosition, SelectionRange, StyleTag } from '../../types/TextEditor';


const TextEditor = ({ content, setContent }: ITextEditorProps) => {
   const [fontSize, setFontSize] = useState<string>('16px');
   const [color, setColor] = useState<string>('#000000');
   const [showControls, setShowControls] = useState<boolean>(false);
   const [selectionRange, setSelectionRange] = useState<SelectionRange | null>(null);
   const [linkInputVisible, setLinkInputVisible] = useState<boolean>(false);
   const [linkUrl, setLinkUrl] = useState<string>('https://');
   const [selectionPosition, setSelectionPosition] = useState<SelectionPosition>({ top: 0, left: 0 });

   const textareaRef = useRef<HTMLTextAreaElement>(null);
   const linkInputRef = useRef<HTMLInputElement>(null);

   useEffect(() => {
      if (linkInputVisible && linkInputRef.current) {
         linkInputRef.current.focus();
      }
   }, [linkInputVisible]);

   const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
      setContent(e.target.value);
   };

   const handleFontSizeChange = (e: ChangeEvent<HTMLSelectElement>): void => {
      setFontSize(e.target.value);
   };

   const handleColorChange = (e: ChangeEvent<HTMLInputElement>): void => {
      setColor(e.target.value);
   };

   const saveSelection = (): void => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const selection: SelectionRange = {
         start: textarea.selectionStart,
         end: textarea.selectionEnd,
         text: content.substring(textarea.selectionStart, textarea.selectionEnd)
      };

      if (selection.start !== selection.end) {
         setSelectionRange(selection);
         setShowControls(true);

         // Расчет позиции для отображения инпута над выделенным текстом
         const textareaRect = textarea.getBoundingClientRect();
         const selectionCoords = getSelectionCoordinates(textarea);

         setSelectionPosition({
            top: selectionCoords.top - textareaRect.top - 40,
            left: selectionCoords.left - textareaRect.left
         });
      } else {
         setShowControls(false);
         setLinkInputVisible(false);
      }
   };

   // Функция для расчета координат выделенного текста
   const getSelectionCoordinates = (textarea: HTMLTextAreaElement): SelectionPosition => {
      const startPos = textarea.selectionStart;

      // Создаем временный элемент для расчета позиции
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.visibility = 'hidden';
      tempDiv.style.whiteSpace = 'pre-wrap';
      tempDiv.style.font = window.getComputedStyle(textarea).font;
      tempDiv.style.width = window.getComputedStyle(textarea).width;
      tempDiv.style.padding = window.getComputedStyle(textarea).padding;

      const text = content.substring(0, startPos);
      tempDiv.textContent = text;
      document.body.appendChild(tempDiv);

      const textCoords: SelectionPosition = {
         top: textarea.offsetTop + tempDiv.offsetHeight,
         left: textarea.offsetLeft + tempDiv.offsetWidth
      };

      document.body.removeChild(tempDiv);
      return textCoords;
   };

   const applyStyle = (tag: StyleTag): void => {
      if (!selectionRange) return;

      if (tag === 'link') {
         setLinkInputVisible(true);
         return;
      }

      const before = content.substring(0, selectionRange.start);
      const after = content.substring(selectionRange.end);
      let newText = '';

      switch (tag) {
         case 'h1':
            newText = `<h1>${selectionRange.text}</h1>`;
            break;
         case 'h2':
            newText = `<h2>${selectionRange.text}</h2>`;
            break;
         case 'h3':
            newText = `<h3>${selectionRange.text}</h3>`;
            break;
         case 'ul':
            newText = `<ul><li>${selectionRange.text}</li></ul>`;
            break;
         case 'ol':
            newText = `<ol><li>${selectionRange.text}</li></ol>`;
            break;
         case 'color':
            newText = `<span style="color:${color}">${selectionRange.text}</span>`;
            break;
         case 'size':
            newText = `<span style="font-size:${fontSize}">${selectionRange.text}</span>`;
            break;
         default:
            return;
      }

      setContent(before + newText + after);
      setShowControls(false);
   };

   const handleLinkSubmit = (e: FormEvent): void => {
      e.preventDefault();

      if (!selectionRange) return;

      const before = content.substring(0, selectionRange.start);
      const after = content.substring(selectionRange.end);
      const newText = `<a href="${linkUrl}">${selectionRange.text}</a>`;

      setContent(before + newText + after);
      setLinkInputVisible(false);
      setLinkUrl('https://');
      setShowControls(false);
   };

   const cancelLinkInput = (): void => {
      setLinkInputVisible(false);
      setLinkUrl('https://');
   };

   const renderHTML = () => {
      return { __html: content };
   };

   return (
      <div className="text-editor-container">
         <div className="text-editor-toolbar">
            <select value={fontSize} onChange={handleFontSizeChange}>
               <option value="10px">10px</option>
               <option value="12px">12px</option>
               <option value="14px">14px</option>
               <option value="16px">16px</option>
               <option value="18px">18px</option>
               <option value="24px">24px</option>
               <option value="32px">32px</option>
            </select>

            <input type="color" value={color} onChange={handleColorChange} />

            <button onClick={() => applyStyle('h1')}>H1</button>
            <button onClick={() => applyStyle('h2')}>H2</button>
            <button onClick={() => applyStyle('h3')}>H3</button>
            <button onClick={() => applyStyle('ul')}>Список</button>
            <button onClick={() => applyStyle('ol')}>Нумерованный список</button>
            <button onClick={() => applyStyle('link')}>Ссылка</button>
            <button onClick={() => applyStyle('color')}>Применить цвет</button>
            <button onClick={() => applyStyle('size')}>Применить размер</button>
         </div>

         <div className="text-editor-textarea-container">
            <textarea
               id="editor"
               ref={textareaRef}
               value={content}
               onChange={handleContentChange}
               onMouseUp={saveSelection}
               onKeyUp={saveSelection}
               rows={5}
               cols={50}
               className="text-editor-textarea"
            />

            {linkInputVisible && (
               <div
                  className="link-input-container"
                  style={{
                     top: `${selectionPosition.top}px`,
                     left: `${selectionPosition.left}px`
                  }}
               >
                  <form onSubmit={handleLinkSubmit}>
                     <input
                        ref={linkInputRef}
                        type="text"
                        value={linkUrl}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setLinkUrl(e.target.value)}
                        placeholder="Введите URL"
                        className="link-input"
                     />
                     <div className="link-buttons">
                        <button type="submit" className="link-button">OK</button>
                        <button type="button" onClick={cancelLinkInput} className="link-button">Отмена</button>
                     </div>
                  </form>
               </div>
            )}
         </div>
      </div >
   );
};

export default TextEditor;