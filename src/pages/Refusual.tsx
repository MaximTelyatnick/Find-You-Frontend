import RefusualMain from "../components/Refusual/RefusualMain"
import Footer from "../components/UX/Footer"
import GradientHeader from "../components/UX/GradientHeader"
import Header from "../components/UX/Header"

const Refusual = () => {
   return (
      <>
         <Header activeLink="Refusual" />
         <GradientHeader logoPath="ОТКАЗ ОТ ОТВЕТСТВЕННОСТИ" />
         <RefusualMain />
         <Footer />
      </>
   )
}

export default Refusual