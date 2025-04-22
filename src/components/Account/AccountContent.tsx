import { useEffect, useState } from "react";
import AccountComments from "./AccountComments";
import AccountEditor from "./AccountEditor";
import AccountGallery from "./AccountGallery";
import AccountHeader from "./AccountHeader";
import AccountInfo from "./AccountInfo";
import AccountSimilars from "./AccountSimilars";
import { useNavigate, useParams } from "react-router-dom";
import fetchData from "../../services/fetchData";
import { IAccountState, IAccountReplyComment } from "../../types/IAccounts";
import IUser from "../../types/IUser";
import LoginModal from "../UX/modals/LoginModal";

const AccountContent = () => {
   const { accountId } = useParams<{ accountId: string }>();
   const api = `http://localhost:5000/account?id=${Number(accountId)}`;
   const [result, setResult] = useState<IAccountState>({
      items: null,
      loading: false,
      error: false,
   });
   const storedUser = localStorage.getItem('user');
   const user: IUser | null = storedUser ? JSON.parse(storedUser) : null;
   const [replyComment, setReplyComment] = useState<IAccountReplyComment | null>(null); // Типизация для редактируемого комментария
   const [editComment, setEditComment] = useState<IAccountReplyComment | null>(null); // Типизация для редактируемого комментария
   const navigate = useNavigate()
   const [isOpenLogin, setIsOpenLogin] = useState<boolean>(false);

   useEffect(() => {
      fetchData('get', api, setResult);
   }, [accountId]);

   const handleAction = (comment: IAccountReplyComment, action: string) => {
      if (action == 'reply') {
         setReplyComment(comment); // Устанавливаем редактируемый комментарий
         setEditComment(null)
      } else {
         setEditComment(comment)
         setReplyComment(null);
      }
   };

   const cancelAction = (action: string) => {
      if (action == 'reply') {
         setReplyComment(null); // Отмена редактирования/ответа
      } else {
         setEditComment(null)
      }
   };

   const navigateHandler = (to: string) => {
      navigate(`/${to}`)
   }

   return (
      <>
         {result.loading && <div className="loader">
            <div className="loader__circle"></div>
         </div>}
         {(user?.role == 'user' || !user?.role) ? <div className="account-warning">
            <div className="account-warning__text fav__warning">
               <h5>Доступ ограничен</h5>
               <p>Для просмотра вам необходимо пройти процедуру регистрации и оплатить доступ или если вы это уже сделали авторизуйтесь на сайте</p>
            </div>
            {!user?.role && <div className="account-warning__buttons">
               <button className="btn-info" onClick={() => { navigateHandler('registration') }}>Регистрация</button>
               <LoginModal isOpen={isOpenLogin} setIsOpen={setIsOpenLogin}><button className="btn btn-info">Вход</button></LoginModal>
               <button className="btn-info" onClick={() => { navigateHandler('recovery') }}>Забыли пароль?</button>
            </div>}
         </div> :
            !result.error && result.items ? (
               <>
                  <AccountHeader {...result.items} />
                  <AccountInfo {...result.items} />
                  <AccountGallery {...result.items} />
                  <AccountEditor
                     {...result.items}
                     replyComment={replyComment} // Передаем редактируемый комментарий
                     setReplyComment={setReplyComment} // Функция для сброса редактируемого комментария
                     cancelAction={cancelAction} // Функция для отмены ответа
                     accountId={Number(accountId)}
                     editComment={editComment}
                     setResult={setResult}
                  />
                  <AccountComments
                     comments={result.items.comments || []}
                     onAction={handleAction}
                     setResult={setResult}
                  />
                  <AccountSimilars {...result.items} />
               </>
            ) : (
               <p>Что-то пошло не так, попробуйте снова</p>
            )}
      </>
   );
};

export default AccountContent;