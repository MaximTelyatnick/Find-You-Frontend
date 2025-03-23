import Sidebar from "../UX/sidebar/Sidebar"
import Title from "../UX/Title"
import UpButton from "../UX/UpButton"
import AboutContent from "./AboutContent"

const AboutMain = () => {
   return (
      <div className="layout-container">
         <div>
            <UpButton />
            <div className="layout-row">
               <div className="col-10">
                  <div id="dle-content">
                     <Title classes='pt'>О проекте</Title>
                     <AboutContent />
                  </div>
               </div>
               <Sidebar />
            </div>
         </div>
      </div>
   )
}

export default AboutMain