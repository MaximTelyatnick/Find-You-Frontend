import { useEffect, useState, useRef } from "react";
import Title from "../UX/Title";
import { AccountReplyProps, IAccountState, IComment } from "../../types/IAccounts";
import IUser from "../../types/IUser";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DOMPurify from 'dompurify';

const AccountEditor = ({ replyComment, cancelAction, editComment, accountId, setResult }: AccountReplyProps) => {
   const apiUrlAdd: string = 'http://localhost:5000/add-comment';
   const apiUrlUpdate: string = 'http://localhost:5000/update-comment';
   const [comment, setComment] = useState<string>(replyComment ? replyComment.text : editComment ? editComment.text : "");
   const [error, setError] = useState<boolean>(false);
   const [success, setSuccess] = useState<boolean>(false);
   const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
   const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
   const [previewMode, setPreviewMode] = useState<boolean>(false);
   const storedUser = localStorage.getItem('user');
   const user: IUser | null = storedUser ? JSON.parse(storedUser) : null;
   const navigate = useNavigate();
   const emojiPickerRef = useRef<HTMLDivElement>(null);
   const colorPickerRef = useRef<HTMLDivElement>(null);
   const emojiButtonRef = useRef<HTMLButtonElement>(null);
   const colorButtonRef = useRef<HTMLButtonElement>(null);

   // Emoji list
   const emojis = [
      '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
      '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙',
      '😋', '😛', '😜', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐',
      '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌',
      '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧'
   ];

   // Color options
   const colors = [
      '#000000', '#ff0000', '#0000ff', '#008000', '#800080',
      '#ffa500', '#a52a2a', '#808080', '#800000', '#008080'
   ];

   useEffect(() => {
      const editText = editComment ? editComment.text : '';
      setComment(editText);
   }, [editComment]);

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
      // Очищаем HTML от потенциально опасных элементов и атрибутов
      return DOMPurify.sanitize(text, {
         ALLOWED_TAGS: ['p', 'b', 'i', 'u', 's', 'strong', 'em', 'br', 'h1', 'h2', 'h3', 'blockquote', 'pre', 'code', 'ol', 'ul', 'li', 'span'],
         ALLOWED_ATTR: ['style'],
         ADD_ATTR: ['target'],
         FORBID_TAGS: ['script', 'iframe', 'object', 'embed'],
         FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
         // Strict URL checking for preventing XSS via URLs
         ALLOW_DATA_ATTR: false
      });
   };

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(false);

      // Очистка комментария от потенциально опасного кода
      const sanitizedComment = sanitizeComment(comment);

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
            await axios.put(apiUrlUpdate, {
               comment_id: editComment.parent_id,
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

   // Обработчик изменения содержимого редактора
   const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setComment(e.target.value);
   };

   // Добавление форматирования текста
   const handleFormat = (format: string) => {
      const textarea = document.getElementById('comment-textarea') as HTMLTextAreaElement;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = comment.substring(start, end);
      let formattedText = '';
      let tagStart = '';
      let tagEnd = '';

      switch (format) {
         case 'bold':
            tagStart = '<b>';
            tagEnd = '</b>';
            break;
         case 'italic':
            tagStart = '<i>';
            tagEnd = '</i>';
            break;
         case 'underline':
            tagStart = '<u>';
            tagEnd = '</u>';
            break;
         case 'strikethrough':
            tagStart = '<s>';
            tagEnd = '</s>';
            break;
         default:
            return;
      }

      formattedText = tagStart + selectedText + tagEnd;
      const newText = comment.substring(0, start) + formattedText + comment.substring(end);
      setComment(newText);

      // Восстанавливаем фокус после изменения
      setTimeout(() => {
         textarea.focus();
         textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
      }, 0);
   };

   // Вставка смайлика
   const insertEmoji = (emoji: string) => {
      const textarea = document.getElementById('comment-textarea') as HTMLTextAreaElement;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const newText = comment.substring(0, start) + emoji + comment.substring(start);
      setComment(newText);
      setShowEmojiPicker(false);

      // Восстанавливаем фокус после изменения
      setTimeout(() => {
         textarea.focus();
         textarea.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 0);
   };

   // Применение цвета к выделенному тексту
   const applyColor = (color: string) => {
      const textarea = document.getElementById('comment-textarea') as HTMLTextAreaElement;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = comment.substring(start, end);

      if (selectedText.length === 0) return;

      const coloredText = `<span style="color: ${color}">${selectedText}</span>`;
      const newText = comment.substring(0, start) + coloredText + comment.substring(end);
      setComment(newText);
      setShowColorPicker(false);

      // Восстанавливаем фокус после изменения
      setTimeout(() => {
         textarea.focus();
         textarea.setSelectionRange(start + coloredText.length, start + coloredText.length);
      }, 0);
   };

   // Переключение между режимами редактирования и предпросмотра
   const togglePreviewMode = () => {
      setPreviewMode(!previewMode);
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
                  <button type="button" onClick={() => handleFormat('strikethrough')} className="toolbar-btn" title="Зачеркнутый">
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
                        className="toolbar-btn color-btn"
                        title="Цвет текста"
                        ref={colorButtonRef}
                     >
                        <span className="color-icon">A</span>
                     </button>

                     {showColorPicker && (
                        <div className="color-picker" ref={colorPickerRef}>
                           {colors.map((color, index) => (
                              <button
                                 key={index}
                                 type="button"
                                 onClick={() => applyColor(color)}
                                 className="color-item"
                                 style={{ backgroundColor: color }}
                                 title={color}
                              />
                           ))}
                        </div>
                     )}
                  </div>

                  <div className="toolbar-divider"></div>

                  {/* Preview Toggle Button */}
                  <button
                     type="button"
                     onClick={togglePreviewMode}
                     className={`toolbar-btn preview-btn ${previewMode ? 'active' : ''}`}
                     title={previewMode ? "Режим редактирования" : "Предпросмотр"}
                  >
                     <span className="preview-icon">{previewMode ? "✎" : "👁"}</span>
                  </button>
               </div>

               {!previewMode ? (
                  <textarea
                     id="comment-textarea"
                     value={comment}
                     onChange={handleEditorChange}
                     className="comment-textarea"
                     placeholder="Комментарий..."
                     rows={6}
                  ></textarea>
               ) : (
                  <div
                     className="comment-preview"
                     dangerouslySetInnerHTML={{ __html: sanitizeComment(comment) || '<p class="placeholder">Предпросмотр комментария...</p>' }}
                  ></div>
               )}

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
            
            .comment-textarea {
               width: 100%;
               min-height: 150px;
               padding: 12px;
               border: none;
               resize: vertical;
               font-family: Arial, sans-serif;
               font-size: 14px;
               outline: none;
            }
            
            .comment-preview {
               width: 100%;
               min-height: 150px;
               padding: 12px;
               border: none;
               font-family: Arial, sans-serif;
               font-size: 14px;
               background-color: #fff;
               overflow-y: auto;
            }
            
            .comment-preview .placeholder {
               color: #aaa;
               font-style: italic;
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
               text-decoration: underline;
               background: linear-gradient(90deg, red, blue);
               -webkit-background-clip: text;
               color: transparent;
            }
            
            .preview-icon {
               font-size: 16px;
            }
            
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
         `}</style>
         </form>
      </div>
   );
};

export default AccountEditor;