import Sidebar from "../UX/sidebar/Sidebar"
import UpButton from "../UX/UpButton"
import AccountContent from "./AccountContent"

const AccountMain = () => {
   return (
      <div className="layout-container">
         <div>
            <UpButton />
            <div className="layout-row">
               <div className="col-10">
                  <div id="dle-content">
                     <AccountContent />
                  </div>
               </div>
               <Sidebar />
            </div>
         </div>
      </div>
   )
}

export default AccountMain