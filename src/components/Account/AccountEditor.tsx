import { useEffect, useState } from "react";
import Title from "../UX/Title";
import { AccountReplyProps, IAccountState, IComment } from "../../types/IAccounts";
import IUser from "../../types/IUser";
import axios from "axios";

const AccountEditor = ({ replyComment, cancelAction, editComment, accountId, setResult }: AccountReplyProps) => {
   const apiUrlAdd: string = 'http://167.86.84.197/api/add-comment';
   const apiUrlUpdate: string = 'http://167.86.84.197/api/update-comment';
   const [comment, setComment] = useState<string>(replyComment ? replyComment.text : editComment ? editComment.text : "");
   const [error, setError] = useState<boolean>(false)
   const [seccess, setSeccess] = useState<boolean>(false)
   const storedUser = localStorage.getItem('user');
   const user: IUser | null = storedUser ? JSON.parse(storedUser) : null;

   useEffect(() => {
      const editText = editComment ? editComment.text : ''
      setComment(editText)
   }, [editComment])

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


   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(false)

      try {
         if (replyComment || !editComment) {
            const response = await axios.post(apiUrlAdd, {
               account_id: accountId,
               user_id: user?.id,
               text: comment,
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
            })
            cancelAction('reply')
         } else {
            await axios.put(apiUrlUpdate, {
               account_id: accountId,
               text: comment,
               parent_id: editComment?.parent_id,
            })

            setResult((prev: IAccountState) => {
               if (prev.items) {
                  const updatedComments = updateCommentText(prev.items.comments, editComment.parent_id, comment);
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

            cancelAction('edit')
         }

         setSeccess(true)
         setComment('')
      } catch (error) {
         setError(true)
         setSeccess(false)
         setComment('')
      }
   };

   return (
      <form onSubmit={handleSubmit} className="row-fluid mt-4 comment-editor" style={{ padding: "40px 0 0 0" }}>
         <Title>Добавить комментарий</Title>
         {replyComment && <div>{cancelAction('edit')}
            <div className="comment-editor__action">
               <div>
                  <p>Вы отвечаете пользователю {replyComment.author_nickname}</p>
                  <p>На коментарий: <span>{replyComment.text}</span></p>
               </div>
               <svg onClick={() => { cancelAction('reply') }} width="20" height="20" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M35.8884 30.0033L56.28 9.61333C57.039 8.82749 57.459 7.77498 57.4495 6.6825C57.44 5.59001 57.0018 4.54496 56.2293 3.77242C55.4567 2.99989 54.4117 2.56169 53.3192 2.55219C52.2267 2.5427 51.1742 2.96268 50.3884 3.72167L29.9967 24.1117L9.60669 3.72167C8.82533 2.94054 7.76571 2.50172 6.66086 2.50172C5.55601 2.50172 4.49639 2.94054 3.71502 3.72167C2.9339 4.50303 2.49508 5.56265 2.49508 6.6675C2.49508 7.77235 2.9339 8.83197 3.71502 9.61333L24.105 30.0033L3.66836 50.4417C3.08442 51.0239 2.68651 51.7663 2.52508 52.5749C2.36366 53.3836 2.44598 54.2219 2.76161 54.9837C3.07725 55.7454 3.61198 56.3963 4.298 56.8538C4.98403 57.3113 5.79045 57.5548 6.61502 57.5533C7.68169 57.5533 8.74836 57.1467 9.56169 56.3333L29.9984 35.895L50.3884 56.285C50.7753 56.6719 51.2348 56.9788 51.7403 57.1881C52.2459 57.3974 52.7878 57.5051 53.335 57.505C54.1589 57.5048 54.9642 57.2604 55.6492 56.8027C56.3342 56.3449 56.8681 55.6944 57.1835 54.9333C57.4988 54.1722 57.5815 53.3346 57.421 52.5266C57.2604 51.7185 56.864 50.9761 56.2817 50.3933L35.8884 30.0033Z" fill="#E36F6F" />
               </svg>
            </div>
         </div>}
         {editComment && <div> {cancelAction('reply')}
            <div className="comment-editor__action">
               <p>Вы изменяете коментарий: <span>{replyComment ? replyComment.text : ''}</span></p>
               <svg onClick={() => { cancelAction('edit') }} width="20" height="20" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M35.8884 30.0033L56.28 9.61333C57.039 8.82749 57.459 7.77498 57.4495 6.6825C57.44 5.59001 57.0018 4.54496 56.2293 3.77242C55.4567 2.99989 54.4117 2.56169 53.3192 2.55219C52.2267 2.5427 51.1742 2.96268 50.3884 3.72167L29.9967 24.1117L9.60669 3.72167C8.82533 2.94054 7.76571 2.50172 6.66086 2.50172C5.55601 2.50172 4.49639 2.94054 3.71502 3.72167C2.9339 4.50303 2.49508 5.56265 2.49508 6.6675C2.49508 7.77235 2.9339 8.83197 3.71502 9.61333L24.105 30.0033L3.66836 50.4417C3.08442 51.0239 2.68651 51.7663 2.52508 52.5749C2.36366 53.3836 2.44598 54.2219 2.76161 54.9837C3.07725 55.7454 3.61198 56.3963 4.298 56.8538C4.98403 57.3113 5.79045 57.5548 6.61502 57.5533C7.68169 57.5533 8.74836 57.1467 9.56169 56.3333L29.9984 35.895L50.3884 56.285C50.7753 56.6719 51.2348 56.9788 51.7403 57.1881C52.2459 57.3974 52.7878 57.5051 53.335 57.505C54.1589 57.5048 54.9642 57.2604 55.6492 56.8027C56.3342 56.3449 56.8681 55.6944 57.1835 54.9333C57.4988 54.1722 57.5815 53.3346 57.421 52.5266C57.2604 51.7185 56.864 50.9761 56.2817 50.3933L35.8884 30.0033Z" fill="#E36F6F" />
               </svg>
            </div>
         </div>
         }
         <div>
            {/* Редактор текста */}
            <div className="mb-3">
               <textarea placeholder="Коментарий..." onChange={(e) => { setComment(e.target.value) }}></textarea>
            </div>
            <div className="comment-editor__rules">
               <div>
                  {error && <p style={{ color: 'red' }}>Что-то пошло не так, попробуйте снова</p>}
                  {seccess && <p style={{ color: 'green' }}>Вы успешно добавили коментарий</p>}
                  <p className="text-muted small mt-2">
                     Запрещено использовать ненормативную лексику, оскорбление других пользователей, активные ссылки и рекламу.
                  </p>
               </div>
               <button className="btn btn-info">Добавить</button>
            </div>
         </div>
      </form>
   );
};

export default AccountEditor;