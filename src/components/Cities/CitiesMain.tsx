import Sidebar from "../UX/sidebar/Sidebar"
import Title from "../UX/Title"
import UpButton from "../UX/UpButton"
import CitiesContent from "./CitiesContent"

const CitiesMain = () => {
   return (
      <div className="layout-container">
         <div>
            <UpButton />
            <div className="layout-row">
               <div className="col-10">
                  <div id="dle-content">
                     <Title classes='pt'>ГОРОДА</Title>
                     <CitiesContent />
                  </div>
               </div>
               <Sidebar />
            </div>
         </div>
      </div>
   )
}

export default CitiesMain