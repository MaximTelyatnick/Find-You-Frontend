import RegistrationMain from "../components/Registration/RegistrationMain"
import Footer from "../components/UX/Footer"
import GradientHeader from "../components/UX/GradientHeader"
import Header from "../components/UX/Header"

const Registration = () => {
   return (
      <>
         <Header />
         <GradientHeader logoPath="РЕГИСТРАЦИЯ" />
         <RegistrationMain />
         <Footer />
      </>
   )
}

export default Registration