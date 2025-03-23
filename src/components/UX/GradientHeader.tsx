import { useState } from "react";
import IUser from "../../types/IUser";
import GradientHeaderProps from "../../types/TGradientHeaderProps";
import { useNavigate } from "react-router-dom";
import LoginModal from "./modals/LoginModal";

const GradientHeader = ({ logoPath }: GradientHeaderProps) => {
   const navigate = useNavigate()
   const [isOpenLogin, setIsOpenLogin] = useState<boolean>(false);
   const storedUser = localStorage.getItem('user');
   const user: IUser | null = storedUser ? JSON.parse(storedUser) : null;

   const logout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem('user');
      navigate('/')
   }

   return (
      <div className="gradient-header">
         <div className="layout-container">
            <div className="layout-row gradient-header__row">
               <div className="gradient-header__path">
                  <div className="brand pt20" style={{ textAlign: 'left' }}>
                     CHECK YOU  &raquo; {logoPath}
                  </div>
               </div>
               {user ? <div className="gradient-header__login" onClick={logout}><svg width="20" height="20" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M43.75 8.75291C44.133 8.75291 44.5123 8.82836 44.8662 8.97493C45.22 9.12151 45.5416 9.33635 45.8124 9.60719C46.0833 9.87802 46.2981 10.1996 46.4447 10.5534C46.5912 10.9073 46.6667 11.2866 46.6667 11.6696C46.6667 12.0526 46.5912 12.4319 46.4447 12.7857C46.2981 13.1396 46.0833 13.4611 45.8124 13.732C45.5416 14.0028 45.22 14.2177 44.8662 14.3642C44.5123 14.5108 44.133 14.5862 43.75 14.5862H17.5V52.5029C17.5 53.2765 17.8073 54.0183 18.3543 54.5653C18.9013 55.1123 19.6431 55.4196 20.4167 55.4196H43.75C44.5236 55.4196 45.2654 55.7269 45.8124 56.2739C46.3594 56.8208 46.6667 57.5627 46.6667 58.3362C46.6667 59.1098 46.3594 59.8517 45.8124 60.3986C45.2654 60.9456 44.5236 61.2529 43.75 61.2529H20.4167C18.096 61.2529 15.8704 60.331 14.2295 58.6901C12.5886 57.0492 11.6667 54.8236 11.6667 52.5029V11.6696C11.6667 10.896 11.974 10.1542 12.521 9.60719C13.0679 9.06021 13.8098 8.75291 14.5834 8.75291H43.75ZM48.7288 24.1908C48.321 23.7832 47.8017 23.5056 47.2362 23.393C46.6708 23.2804 46.0847 23.338 45.552 23.5583C45.0192 23.7786 44.5637 24.1519 44.243 24.631C43.9223 25.1101 43.7507 25.6735 43.75 26.25V32.0833H26.25C25.4765 32.0833 24.7346 32.3906 24.1876 32.9376C23.6406 33.4846 23.3334 34.2265 23.3334 35C23.3334 35.7735 23.6406 36.5154 24.1876 37.0624C24.7346 37.6094 25.4765 37.9167 26.25 37.9167H43.75V43.75C43.7501 44.3268 43.9213 44.8906 44.2418 45.3701C44.5623 45.8496 45.0177 46.2234 45.5506 46.4441C46.0835 46.6648 46.6698 46.7225 47.2355 46.61C47.8012 46.4975 48.3209 46.2199 48.7288 45.8121L57.4788 37.0621C58.0256 36.5151 58.3327 35.7734 58.3327 35C58.3327 34.2266 58.0256 33.4849 57.4788 32.9379L48.7288 24.1908Z" fill="white" />
               </svg><span>ВЫХОД</span></div> : <div className="gradient-header__login"><LoginModal isOpen={isOpenLogin} setIsOpen={setIsOpenLogin}>
                  <svg xmlns="http://www.w3.org/2000/svg" height="12" width="10.5" viewBox="0 0 448 512">
                     <path
                        fill="#ffffff"
                        d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"
                     />
                  </svg><span>ВХОД</span>
               </LoginModal></div>}
            </div>
         </div>
      </div >
   );
}

export default GradientHeader