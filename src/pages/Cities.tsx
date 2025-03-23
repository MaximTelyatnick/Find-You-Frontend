import CitiesMain from "../components/Cities/CitiesMain"
import Footer from "../components/UX/Footer"
import GradientHeader from "../components/UX/GradientHeader"
import Header from "../components/UX/Header"

const Cities = () => {
   return (
      <>
         <meta name="description" content="Список городов, где происходили самые нашумевшие истории Check You. Найдите свой город!" />
         <meta name="keywords" content="чек ю города, чек ю список городов, чек ю карта, чек ю разводы по городам" />

         <Header activeLink="Cities" />
         <GradientHeader logoPath="ГОРОДА" />
         <CitiesMain />
         <Footer />
      </>
   )
}

export default Cities