import { useEffect, useState, useRef } from "react";
import Title from "../UX/Title";
import { AccountReplyProps, IAccountState, IComment } from "../../types/IAccounts";
import IUser from "../../types/IUser";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DOMPurify from 'dompurify';

const AccountEditor = ({ replyComment, cancelAction, editComment, accountId, setResult }: AccountReplyProps) => {
   const apiUrlAdd: string = 'http://167.86.84.197:5000/add-comment';
   const apiUrlUpdate: string = 'http://167.86.84.197:5000/update-comment';
   const [comment, setComment] = useState<string>(replyComment ? replyComment.text : editComment ? editComment.text : "");
   const [error, setError] = useState<boolean>(false);
   const [success, setSuccess] = useState<boolean>(false);
   const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
   const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
   const [activeColor, setActiveColor] = useState<string>("text-black");
   const storedUser = localStorage.getItem('user');
   const user: IUser | null = storedUser ? JSON.parse(storedUser) : null;
   const navigate = useNavigate();
   const emojiPickerRef = useRef<HTMLDivElement>(null);
   const colorPickerRef = useRef<HTMLDivElement>(null);
   const emojiButtonRef = useRef<HTMLButtonElement>(null);
   const colorButtonRef = useRef<HTMLButtonElement>(null);
   const editorRef = useRef<HTMLDivElement>(null);

   // Emoji list
   const emojis = [
      '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
      '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙',
      '😋', '😛', '😜', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐',
      '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌',
      '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧'
   ];

   // Color options with corresponding class names
   const colorOptions = [
      { value: '#000000', class: 'text-black' },
      { value: '#ff0000', class: 'text-red' },
      { value: '#0000ff', class: 'text-blue' },
      { value: '#008000', class: 'text-green' },
      { value: '#800080', class: 'text-purple' },
      { value: '#ffa500', class: 'text-orange' },
      { value: '#a52a2a', class: 'text-brown' },
      { value: '#808080', class: 'text-gray' },
      { value: '#800000', class: 'text-maroon' },
      { value: '#008080', class: 'text-teal' }
   ];

   // Исправление: обновляем и state, и contentEditable когда меняется editComment
   useEffect(() => {
      if (editComment) {
         setComment(editComment.text);
         // Устанавливаем содержимое редактора при изменении комментария
         if (editorRef.current) {
            editorRef.current.innerHTML = sanitizeComment(editComment.text);
         }
      }
   }, [editComment]);

   // Начальная инициализация редактора
   useEffect(() => {
      if (editorRef.current) {
         // Проверяем, есть ли начальное содержимое
         const initialContent = replyComment ? replyComment.text :
            editComment ? editComment.text :
               "Комментарий...";
         editorRef.current.innerHTML = sanitizeComment(initialContent);

         // Если это новый комментарий, а не редактирование
         if (!editComment && !replyComment) {
            // Добавляем обработчик фокуса для очистки placeholder
            const handleFocus = () => {
               if (editorRef.current && editorRef.current.innerHTML === "Комментарий...") {
                  editorRef.current.innerHTML = "";
               }
            };

            editorRef.current.addEventListener('focus', handleFocus);
            return () => {
               if (editorRef.current) {
                  editorRef.current.removeEventListener('focus', handleFocus);
               }
            };
         }
      }
   }, []);

   // Close emoji and color pickers when clicking outside
   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (emojiPickerRef.current &&
            !emojiPickerRef.current.contains(event.target as Node) &&
            emojiButtonRef.current &&
            !emojiButtonRef.current.contains(event.target as Node)) {
            setShowEmojiPicker(false);
         }
         if (colorPickerRef.current &&
            !colorPickerRef.current.contains(event.target as Node) &&
            colorButtonRef.current &&
            !colorButtonRef.current.contains(event.target as Node)) {
            setShowColorPicker(false);
         }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, []);

   const addCommentRecursively = (comments: IComment[], replyCommentId: number, newComment: IComment): IComment[] => {
      return comments.map(comment => {
         if (comment.id === replyCommentId) {
            return {
               ...comment,
               children: [...comment.children, newComment]
            };
         }

         if (comment.children && comment.children.length > 0) {
            return {
               ...comment,
               children: addCommentRecursively(comment.children, replyCommentId, newComment)
            };
         }

         return comment;
      });
   };

   const updateCommentText = (comments: IComment[], commentId: number | undefined, newText: string): IComment[] => {
      return comments.map(comment => {
         if (comment.id === commentId) {
            return { ...comment, text: newText };
         }
         if (comment.children && comment.children.length > 0) {
            return { ...comment, children: updateCommentText(comment.children, commentId, newText) };
         }
         return comment;
      });
   };

   const sanitizeComment = (text: string) => {
      return DOMPurify.sanitize(text, {
         ALLOWED_TAGS: ['p', 'b', 'i', 'u', 's', 'strong', 'em', 'br', 'h1', 'h2', 'h3', 'blockquote', 'pre', 'code', 'ol', 'ul', 'li', 'span'],
         ALLOWED_ATTR: ['class'], // Changed from 'style' to 'class'
         ADD_ATTR: ['target'],
         FORBID_TAGS: ['script', 'iframe', 'object', 'embed'],
         FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'style'],
         ALLOW_DATA_ATTR: false
      });
   };

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(false);

      // Получаем HTML из contentEditable и сохраняем в комментарий
      const editorContent = editorRef.current?.innerHTML || '';
      const sanitizedComment = sanitizeComment(editorContent);

      try {
         if (replyComment || !editComment) {
            const response = await axios.post(apiUrlAdd, {
               account_id: accountId,
               user_id: user?.id,
               text: sanitizedComment,
               parent_id: replyComment?.parent_id,
            });

            const commentToAdd: IComment = {
               ...response.data.comment,
               children: [],
               author_nickname: user?.login,
            }

            setResult((prev: IAccountState) => {
               if (prev.items) {
                  if (replyComment?.parent_id) {
                     const updatedComments: IComment[] = addCommentRecursively(prev.items.comments, replyComment.parent_id, commentToAdd);

                     return {
                        ...prev,
                        items: {
                           ...prev.items,
                           comments: updatedComments,
                        }
                     };
                  } else {
                     if (!prev.items.comments.includes(commentToAdd)) {
                        return {
                           ...prev,
                           items: {
                              ...prev.items,
                              comments: [...prev.items.comments, commentToAdd],
                           }
                        };
                     }
                  }
               }
               return prev;
            });
            cancelAction('reply');
         } else {
            // Исправленный запрос на обновление комментария
            await axios.put(apiUrlUpdate, {
               comment_id: editComment.parent_id, // Используем id комментария
               text: sanitizedComment,
            });

            setResult((prev: IAccountState) => {
               if (prev.items) {
                  const updatedComments = updateCommentText(prev.items.comments, editComment.parent_id, sanitizedComment);
                  return {
                     ...prev,
                     items: {
                        ...prev.items,
                        comments: updatedComments,
                     }
                  };
               }
               return prev;
            });

            cancelAction('edit');
         }

         setSuccess(true);
         setComment('');
         navigate(0);
      } catch (error) {
         setError(true);
         setSuccess(false);
      }
   };

   // Обработчик изменений в contentEditable
   const handleEditorChange = () => {
      if (editorRef.current) {
         // Сохраняем HTML контент при каждом изменении
         setComment(editorRef.current.innerHTML);
      }
   };

   // Получение текущего выделения
   const getSelection = (): { selectedText: string, range: Range } | null => {
      const selection = document.getSelection();
      if (!selection || selection.rangeCount === 0) return null;

      const range = selection.getRangeAt(0);
      const selectedText = range.toString();

      // Проверяем, что выделение находится внутри нашего редактора
      if (!editorRef.current?.contains(range.commonAncestorContainer)) return null;

      return { selectedText, range };
   };

   // Применение форматирования к тексту
   const handleFormat = (format: string) => {
      if (!editorRef.current) return;
      editorRef.current.focus();

      document.execCommand(format, false);
      handleEditorChange();
   };

   // Вставка смайлика
   const insertEmoji = (emoji: string) => {
      if (!editorRef.current) return;
      editorRef.current.focus();

      document.execCommand('insertText', false, emoji);
      setShowEmojiPicker(false);
      handleEditorChange();
   };

   // Установка цвета для печати и выделенного текста
   const applyColor = (colorOption: { value: string, class: string }) => {
      if (!editorRef.current) return;
      editorRef.current.focus();

      // Установка активного цвета для последующего ввода
      setActiveColor(colorOption.class);
      setShowColorPicker(false);

      // Применение цвета к выделенному тексту, если есть выделение
      const selection = getSelection();
      if (selection && selection.selectedText.length > 0) {
         // Удаляем выделение
         document.execCommand('delete', false);

         // Вставляем отформатированный текст
         const formattedText = `<span class="${colorOption.class}">${selection.selectedText}</span>`;
         document.execCommand('insertHTML', false, formattedText);
      }

      handleEditorChange();
   };

   // ИСПРАВЛЕНИЕ: Обработчик ввода символов - с улучшенной поддержкой пробелов
   const handleBeforeInput = (e: React.FormEvent<HTMLDivElement>) => {
      // Получаем информацию о вводимом тексте
      const inputEvent = e.nativeEvent as InputEvent;
      const inputData = inputEvent.data;

      // Если текущий цвет не черный (т.е. применяется активный цвет)
      if (activeColor !== 'text-black' && inputData !== null) {
         e.preventDefault();

         // Специальная обработка для пробелов
         let formattedText;
         if (inputData === ' ') {
            // Для пробела просто вставляем его внутри span-элемента текущего цвета
            formattedText = `<span class="${activeColor}">&nbsp;</span>`;
         } else {
            formattedText = `<span class="${activeColor}">${inputData}</span>`;
         }

         // Вставляем отформатированный текст
         document.execCommand('insertHTML', false, formattedText);
         handleEditorChange();
      }
   };

   return (
      <div>
         <Title>Оставить комментарий</Title>
         <form onSubmit={handleSubmit}>
            <div className="comment-editor">
               <div className="editor-toolbar">
                  <button type="button" onClick={() => handleFormat('bold')} className="toolbar-btn" title="Жирный">
                     <span className="format-icon">B</span>
                  </button>
                  <button type="button" onClick={() => handleFormat('italic')} className="toolbar-btn" title="Курсив">
                     <span className="format-icon">I</span>
                  </button>
                  <button type="button" onClick={() => handleFormat('underline')} className="toolbar-btn" title="Подчеркнутый">
                     <span className="format-icon">U</span>
                  </button>
                  <button type="button" onClick={() => handleFormat('strikeThrough')} className="toolbar-btn" title="Зачеркнутый">
                     <span className="format-icon">S</span>
                  </button>

                  <div className="toolbar-divider"></div>

                  {/* Emoji Picker Button */}
                  <div className="dropdown-container">
                     <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="toolbar-btn emoji-btn"
                        title="Смайлики"
                        ref={emojiButtonRef}
                     >
                        <span className="emoji-icon">😊</span>
                     </button>

                     {showEmojiPicker && (
                        <div className="emoji-picker" ref={emojiPickerRef}>
                           {emojis.map((emoji, index) => (
                              <button
                                 key={index}
                                 type="button"
                                 onClick={() => insertEmoji(emoji)}
                                 className="emoji-item"
                              >
                                 {emoji}
                              </button>
                           ))}
                        </div>
                     )}
                  </div>

                  {/* Color Picker Button */}
                  <div className="dropdown-container">
                     <button
                        type="button"
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        className={`toolbar-btn color-btn ${activeColor}`}
                        title="Цвет текста"
                        ref={colorButtonRef}
                     >
                        <span className="color-icon">A</span>
                     </button>

                     {showColorPicker && (
                        <div className="color-picker" ref={colorPickerRef}>
                           {colorOptions.map((colorOption, index) => (
                              <button
                                 key={index}
                                 type="button"
                                 onClick={() => applyColor(colorOption)}
                                 className={`color-item ${activeColor === colorOption.class ? 'active' : ''}`}
                                 style={{ backgroundColor: colorOption.value }}
                                 title={colorOption.value}
                              />
                           ))}
                        </div>
                     )}
                  </div>
               </div>

               {/* Rich Text Editor с contentEditable вместо textarea */}
               <div
                  ref={editorRef}
                  contentEditable
                  className="rich-text-editor"
                  onInput={handleEditorChange}
                  onBeforeInput={handleBeforeInput}
                  suppressContentEditableWarning={true}
               ></div>

               {error && <div className="error-message">Произошла ошибка при отправке комментария.</div>}
               {success && <div className="success-message">Комментарий успешно отправлен.</div>}
            </div>

            <div className="comment-editor__rules">
               <div>
                  <p className="text-muted small mt-2">
                     Запрещено использовать ненормативную лексику, оскорбление других пользователей, активные ссылки и рекламу.
                  </p>
               </div>
               <div className="action-buttons">
                  {(replyComment || editComment) && (
                     <button
                        type="button"
                        onClick={() => cancelAction(editComment ? 'edit' : 'reply')}
                        className="btn btn-secondary mr-2"
                     >
                        Отмена
                     </button>
                  )}
                  <button type="submit" className="btn btn-info">
                     {editComment ? 'Сохранить' : 'Добавить'}
                  </button>
               </div>
            </div>

            <style>{`
            .comment-editor {
               display: flex;
               flex-direction: column;
               width: 100%;
               border: 1px solid #ddd;
               border-radius: 4px;
               overflow: hidden;
            }
            
            .editor-toolbar {
               display: flex;
               padding: 8px;
               background-color: #f5f5f5;
               border-bottom: 1px solid #ddd;
               flex-wrap: wrap;
               align-items: center;
            }
            
            .toolbar-btn {
               background: none;
               border: none;
               margin-right: 5px;
               cursor: pointer;
               padding: 5px;
               display: flex;
               align-items: center;
               justify-content: center;
               border-radius: 3px;
               height: 30px;
               width: 30px;
            }
            
            .toolbar-btn:hover {
               background-color: #e0e0e0;
            }
            
            .toolbar-btn.active {
               background-color: #d8d8d8;
            }
            
            .toolbar-divider {
               width: 1px;
               height: 20px;
               background-color: #ddd;
               margin: 0 8px;
            }
            
            .rich-text-editor {
               width: 100%;
               min-height: 150px;
               padding: 12px;
               border: none;
               font-family: Arial, sans-serif;
               font-size: 14px;
               outline: none;
               overflow: auto;
            }
            
            .rich-text-editor:empty:before {
               content: "Комментарий...";
               color: #aaa;
            }
            
            .comment-editor__rules {
               display: flex;
               justify-content: space-between;
               align-items: center;
               margin-top: 10px;
            }
            
            .error-message {
               color: #d32f2f;
               margin: 8px;
               font-size: 14px;
            }
            
            .success-message {
               color: #388e3c;
               margin: 8px;
               font-size: 14px;
            }
            
            .format-icon {
               font-size: 14px;
               font-weight: 500;
            }
            
            .emoji-icon {
               font-size: 16px;
            }
            
            .color-icon {
               font-size: 16px;
               font-weight: bold;
            }
            
            /* Кнопка цвета показывает текущий активный цвет */
            .color-btn.text-black .color-icon { color: #000000; }
            .color-btn.text-red .color-icon { color: #ff0000; }
            .color-btn.text-blue .color-icon { color: #0000ff; }
            .color-btn.text-green .color-icon { color: #008000; }
            .color-btn.text-purple .color-icon { color: #800080; }
            .color-btn.text-orange .color-icon { color: #ffa500; }
            .color-btn.text-brown .color-icon { color: #a52a2a; }
            .color-btn.text-gray .color-icon { color: #808080; }
            .color-btn.text-maroon .color-icon { color: #800000; }
            .color-btn.text-teal .color-icon { color: #008080; }
            
            /* Dropdown styles */
            .dropdown-container {
               position: relative;
            }
            
            .emoji-picker {
               position: absolute;
               top: 100%;
               left: -200px;
               z-index: 1000;
               display: grid;
               grid-template-columns: repeat(10, 1fr);
               background-color: white;
               border: 1px solid #ddd;
               border-radius: 4px;
               box-shadow: 0 2px 5px rgba(0,0,0,0.2);
               padding: 5px;
            }
            
            .emoji-item {
               background: none;
               border: none;
               cursor: pointer;
               font-size: 16px;
               padding: 2px;
               border-radius: 3px;
            }
            
            .emoji-item:hover {
               background-color: #f0f0f0;
            }
            
            .color-picker {
               position: absolute;
               top: 100%;
               left: -120px;
               z-index: 1000;
               display: grid;
               grid-template-columns: repeat(5, 1fr);
               background-color: white;
               border: 1px solid #ddd;
               border-radius: 4px;
               box-shadow: 0 2px 5px rgba(0,0,0,0.2);
               padding: 5px;
               width: 150px;
            }
            
            .color-item {
               width: 24px;
               height: 24px;
               border: 1px solid #ddd;
               border-radius: 50%;
               cursor: pointer;
               margin: 2px;
            }
            
            .color-item.active {
               transform: scale(1.2);
               box-shadow: 0 0 5px rgba(0,0,0,0.5);
            }
            
            .color-item:hover {
               transform: scale(1.1);
               box-shadow: 0 0 3px rgba(0,0,0,0.3);
            }
            
            .action-buttons {
               display: flex;
               gap: 10px;
            }
            
            .btn-secondary {
               background-color: #6c757d;
               color: white;
            }
            
            .mr-2 {
               margin-right: 10px;
            }
            
            .mt-2 {
               margin-top: 10px;
            }
            
            .small {
               font-size: 12px;
            }
            
            .text-muted {
               color: #6c757d;
            }
            
            /* Text color classes */
            .text-black { color: #000000; }
            .text-red { color: #ff0000; }
            .text-blue { color: #0000ff; }
            .text-green { color: #008000; }
            .text-purple { color: #800080; }
            .text-orange { color: #ffa500; }
            .text-brown { color: #a52a2a; }
            .text-gray { color: #808080; }
            .text-maroon { color: #800000; }
            .text-teal { color: #008080; }
         `}</style>
         </form>
      </div>
   );
};

export default AccountEditor;