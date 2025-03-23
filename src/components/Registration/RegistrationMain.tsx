import { useNavigate } from "react-router-dom"
import IUser from "../../types/IUser"
import Sidebar from "../UX/sidebar/Sidebar"
import Title from "../UX/Title"
import UpButton from "../UX/UpButton"
import RegistrationContent from "./RegistrationContent"
import { useEffect } from "react"

const RegistrationMain = () => {
   const navigate = useNavigate()
   const storedUser = localStorage.getItem('user');
   const user: IUser | null = storedUser ? JSON.parse(storedUser) : null;

   useEffect(() => {
      if (user) {
         navigate('/')
      }
   }, [])

   return (
      <div className="layout-container">
         <div>
            <UpButton />
            <div className="layout-row">
               <div className="col-10">
                  <div id="dle-content">
                     <Title classes='pt'>РЕГИСТРАЦИЯ НОВОГО ПОЛЬЗОВАТЕЛЯ</Title>
                     <RegistrationContent />
                  </div>
               </div>
               <Sidebar />
            </div>
         </div>
      </div>
   )
}

export default RegistrationMain