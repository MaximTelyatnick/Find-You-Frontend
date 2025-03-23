import BypassingMain from "../components/Bypassing/BypassingMain"
import Footer from "../components/UX/Footer"
import GradientHeader from "../components/UX/GradientHeader"
import Header from "../components/UX/Header"

const Bypassing = () => {
   return (
      <>
         <Header activeLink="Refusual" />
         <GradientHeader logoPath="ОБХОД БЛОКИРОВОК" />
         <BypassingMain />
         <Footer />
      </>
   )
}

export default Bypassing