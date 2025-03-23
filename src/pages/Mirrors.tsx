import MirrorsMain from "../components/Mirrors/MirrorsMain"
import Footer from "../components/UX/Footer"
import GradientHeader from "../components/UX/GradientHeader"
import Header from "../components/UX/Header"

const Mirrors = () => {
   return (
      <>
         <meta name="description" content="Актуальные зеркала Check You — как зайти, если основной сайт заблокирован." />
         <meta name="keywords" content="чек ю зеркало, чек ю обход блокировки, чек ю как зайти, чек ю альтернативный сайт" />
         <Header activeLink="mirrors" />
         <GradientHeader logoPath="ЗЕРКАЛА" />
         <MirrorsMain />
         <Footer />
      </>
   )
}

export default Mirrors