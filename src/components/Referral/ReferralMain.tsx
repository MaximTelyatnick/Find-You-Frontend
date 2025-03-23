import Sidebar from "../UX/sidebar/Sidebar"
import Title from "../UX/Title"
import UpButton from "../UX/UpButton"
import ReferralContent from "./ReferralContent"

const ReferralMain = () => {
   return (
      <div className="layout-container">
         <div>
            <UpButton />
            <div className="layout-row">
               <div className="col-10">
                  <div id="dle-content">
                     <Title classes='pt'>Реферальная система</Title>
                     <ReferralContent />
                  </div>
               </div>
               <Sidebar />
            </div>
         </div>
      </div>
   )
}

export default ReferralMain