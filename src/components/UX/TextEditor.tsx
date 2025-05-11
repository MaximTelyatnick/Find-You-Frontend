import { useState, useRef, useEffect, FormEvent, ChangeEvent } from 'react';
import { ITextEditorProps, SelectionPosition, StyleTag } from '../../types/TextEditor';
import DOMPurify from 'dompurify';

const TextEditor = ({ content, setContent }: ITextEditorProps) => {
   const [fontSize, setFontSize] = useState<string>('16px');
   const [color, setColor] = useState<string>('#000000');
   const [linkInputVisible, setLinkInputVisible] = useState<boolean>(false);
   const [linkUrl, setLinkUrl] = useState<string>('https://');
   const [selectionPosition, setSelectionPosition] = useState<SelectionPosition>({ top: 0, left: 0 });

   const editorRef = useRef<HTMLDivElement>(null);
   const linkInputRef = useRef<HTMLInputElement>(null);
   const savedSelectionRef = useRef<Range | null>(null);

   useEffect(() => {
      if (linkInputVisible && linkInputRef.current) {
         linkInputRef.current.focus();
      }
   }, [linkInputVisible]);

   // Инициализируем содержимое редактора при первой загрузке
   useEffect(() => {
      if (editorRef.current && content) {
         editorRef.current.innerHTML = sanitizeContent(content);
      }
   }, []);

   const sanitizeContent = (html: string) => {
      return DOMPurify.sanitize(html, {
         ALLOWED_TAGS: ['p', 'b', 'i', 'u', 's', 'strong', 'em', 'br', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'span', 'a'],
         ALLOWED_ATTR: ['style', 'href', 'target'],
         ADD_ATTR: ['target'],
         FORBID_TAGS: ['script', 'iframe', 'object', 'embed'],
         FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
         ALLOW_DATA_ATTR: false
      });
   };

   const handleContentChange = () => {
      if (editorRef.current) {
         const newContent = editorRef.current.innerHTML;
         setContent(newContent);
      }
   };

   const handleFontSizeChange = (e: ChangeEvent<HTMLSelectElement>): void => {
      setFontSize(e.target.value);
   };

   const handleColorChange = (e: ChangeEvent<HTMLInputElement>): void => {
      setColor(e.target.value);
   };

   const saveSelection = (): { range: Range | null, text: string } => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return { range: null, text: '' };

      const range = selection.getRangeAt(0);
      const selectedText = range.toString();

      // Проверяем, находится ли выделение внутри нашего редактора
      if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
         if (selectedText) {
            const rect = range.getBoundingClientRect();
            const editorRect = editorRef.current.getBoundingClientRect();

            setSelectionPosition({
               top: rect.top - editorRect.top - 40,
               left: rect.left - editorRect.left
            });

            savedSelectionRef.current = range.cloneRange();
            return { range, text: selectedText };
         }
      }

      setLinkInputVisible(false);
      savedSelectionRef.current = null;
      return { range: null, text: '' };
   };

   const restoreSelection = () => {
      if (savedSelectionRef.current) {
         const selection = window.getSelection();
         if (selection) {
            selection.removeAllRanges();
            selection.addRange(savedSelectionRef.current);
         }
      }
   };

   const surroundWithTag = (tagName: string) => {
      if (savedSelectionRef.current) {
         const range = savedSelectionRef.current;
         const selectedText = range.toString();
         if (!selectedText) return;

         const element = document.createElement(tagName);
         element.textContent = selectedText;

         // Заменяем выделенный текст новым элементом
         range.deleteContents();
         range.insertNode(element);

         // Снимаем выделение
         window.getSelection()?.removeAllRanges();
         handleContentChange();
      }
   };

   const applyStyle = (tag: StyleTag): void => {
      const { range, text } = saveSelection();
      if (!range || !text) return;

      editorRef.current?.focus();

      if (tag === 'link') {
         setLinkInputVisible(true);
         return;
      }

      switch (tag) {
         case 'h1':
            surroundWithTag('h1');
            break;
         case 'h2':
            surroundWithTag('h2');
            break;
         case 'h3':
            surroundWithTag('h3');
            break;
         case 'ul':
            document.execCommand('insertUnorderedList', false);
            break;
         case 'ol':
            document.execCommand('insertOrderedList', false);
            break;
         case 'color':
            document.execCommand('foreColor', false, color);
            break;
         case 'size':
            // Для размера шрифта используем подход с оборачиванием в span
            if (savedSelectionRef.current) {
               const span = document.createElement('span');
               span.style.fontSize = fontSize;

               const range = savedSelectionRef.current;
               const selectedText = range.toString();
               span.textContent = selectedText;

               range.deleteContents();
               range.insertNode(span);

               window.getSelection()?.removeAllRanges();
               handleContentChange();
            }
            break;
         default:
            return;
      }

      handleContentChange();
   };

   const handleLinkSubmit = (e: FormEvent): void => {
      e.preventDefault();

      restoreSelection();
      if (!savedSelectionRef.current) return;

      editorRef.current?.focus();
      document.execCommand('createLink', false, linkUrl);

      // Находим только что созданную ссылку и добавляем атрибут target="_blank"
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
         const linkNode = selection.anchorNode?.parentElement;
         if (linkNode && linkNode.tagName === 'A') {
            linkNode.setAttribute('target', '_blank');
         }
      }

      setLinkInputVisible(false);
      setLinkUrl('https://');
      handleContentChange();
   };

   const cancelLinkInput = (): void => {
      setLinkInputVisible(false);
      setLinkUrl('https://');
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

            <button type="button" onClick={() => applyStyle('h1')}>H1</button>
            <button type="button" onClick={() => applyStyle('h2')}>H2</button>
            <button type="button" onClick={() => applyStyle('h3')}>H3</button>
            <button type="button" onClick={() => applyStyle('ul')}>Список</button>
            <button type="button" onClick={() => applyStyle('ol')}>Нумерованный список</button>
            <button type="button" onClick={() => applyStyle('link')}>Ссылка</button>
            <button type="button" onClick={() => applyStyle('color')}>Применить цвет</button>
            <button type="button" onClick={() => applyStyle('size')}>Применить размер</button>
         </div>

         <div className="text-editor-content-container">
            <div
               ref={editorRef}
               contentEditable
               onInput={handleContentChange}
               onMouseUp={() => saveSelection()}
               onKeyUp={() => saveSelection()}
               className="text-editor-content"
               aria-label="Редактор текста"
            ></div>

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
         <style>{`
            .text-editor-container {
               display: flex;
               flex-direction: column;
               border: 1px solid #ddd;
               border-radius: 4px;
               overflow: hidden;
            }
            
            .text-editor-toolbar {
               display: flex;
               padding: 8px;
               background-color: #f5f5f5;
               border-bottom: 1px solid #ddd;
               flex-wrap: wrap;
               align-items: center;
               gap: 5px;
            }
            
            .text-editor-toolbar button {
               background: none;
               border: 1px solid #ccc;
               margin-right: 5px;
               cursor: pointer;
               padding: 5px 8px;
               border-radius: 3px;
            }
            
            .text-editor-toolbar button:hover {
               background-color: #e0e0e0;
            }
            
            .text-editor-toolbar select,
            .text-editor-toolbar input[type="color"] {
               padding: 4px;
               border: 1px solid #ccc;
               border-radius: 3px;
               margin-right: 5px;
            }
            
            .text-editor-content-container {
               position: relative;
               width: 100%;
            }
            
            .text-editor-content {
               width: 100%;
               min-height: 150px;
               padding: 12px;
               border: none;
               font-family: Arial, sans-serif;
               font-size: 14px;
               outline: none;
               overflow: auto;
            }
            
            .text-editor-content:empty:before {
               content: "Введите текст...";
               color: #aaa;
            }
            
            .link-input-container {
               position: absolute;
               background-color: white;
               border: 1px solid #ddd;
               border-radius: 4px;
               box-shadow: 0 2px 5px rgba(0,0,0,0.2);
               padding: 8px;
               z-index: 1000;
            }
            
            .link-input {
               width: 250px;
               padding: 6px;
               border: 1px solid #ccc;
               border-radius: 3px;
               margin-bottom: 5px;
            }
            
            .link-buttons {
               display: flex;
               justify-content: flex-end;
               gap: 5px;
            }
            
            .link-button {
               padding: 4px 8px;
               background-color: #f0f0f0;
               border: 1px solid #ccc;
               border-radius: 3px;
               cursor: pointer;
            }
            
            .link-button:hover {
               background-color: #e0e0e0;
            }
         `}</style>
      </div>
   );
};

export default TextEditor;