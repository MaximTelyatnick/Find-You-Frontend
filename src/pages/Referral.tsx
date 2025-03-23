import ReferralMain from "../components/Referral/ReferralMain"
import Footer from "../components/UX/Footer"
import GradientHeader from "../components/UX/GradientHeader"
import Header from "../components/UX/Header"

const Referral = () => {
   return (
      <>
         <Header activeLink="" />
         <GradientHeader logoPath="РЕФЕРАЛЬНАЯ СИСТЕМА" />
         <ReferralMain />
         <Footer />
      </>
   )
}

export default Referral