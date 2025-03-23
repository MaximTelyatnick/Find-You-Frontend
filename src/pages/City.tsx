import Footer from "../components/UX/Footer";
import Header from "../components/UX/Header";
import CityMain from "../components/Cities/CitiesMain";

function City() {
   return (
      <>
         <Header activeLink="Cities" />
         <CityMain />
         <Footer />
      </>
   )
}

export default City