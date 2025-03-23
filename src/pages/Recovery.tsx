import RecoveryMain from "../components/Recovery/RecoveryMain"
import Footer from "../components/UX/Footer"
import GradientHeader from "../components/UX/GradientHeader"
import Header from "../components/UX/Header"

const Recovery = () => {
   return (
      <>
         <Header />
         <GradientHeader logoPath="ВОССТАНОВИТЬ ПАРОЛЬ" />
         <RecoveryMain />
         <Footer />
      </>
   )
}

export default Recovery