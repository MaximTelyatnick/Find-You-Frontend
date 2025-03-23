import Sidebar from "../UX/sidebar/Sidebar"
import Title from "../UX/Title"
import UpButton from "../UX/UpButton"
import CommentsContent from "./CommentsContent"
import { useState } from "react"
import IUser from "../../types/IUser"
import { useNavigate } from "react-router-dom"
import LoginModal from "../UX/modals/LoginModal"

const CommentsMain = () => {
   const storedUser = localStorage.getItem('user');
   const user: IUser | null = storedUser ? JSON.parse(storedUser) : null;
   const navigate = useNavigate()
   const [isOpenLogin, setIsOpenLogin] = useState<boolean>(false);

   const navigateHandler = (to: string) => {
      navigate(`/${to}`)
   }

   return (
      <div className="layout-container">
         <div>
            <UpButton />
            <div className="layout-row">
               <div className="col-10">
                  <div id="dle-content">
                     {user ? <>
                        <Title classes='pt'>Мои Коментарии</Title>
                        <CommentsContent />
                     </> : <div className="account-warning">
                        <div className="account-warning__text fav__warning">
                           <h5>Доступ ограничен</h5>
                           <p>Для просмотра вам необходимо пройти процедуру регистрации или если вы это уже сделали авторизуйтесь на сайте</p>
                        </div>
                        <div className="account-warning__buttons">
                           <button className="btn-info" onClick={() => { navigateHandler('registration') }}>Регистрация</button>
                           <LoginModal isOpen={isOpenLogin} setIsOpen={setIsOpenLogin}><button className="btn btn-info">Вход</button></LoginModal>
                           <button className="btn-info" onClick={() => { navigateHandler('recovery') }}>Забыли пароль?</button>
                        </div>
                     </div>}
                  </div>
               </div>
               <Sidebar />
            </div>
         </div>
      </div>
   )
}

export default CommentsMain