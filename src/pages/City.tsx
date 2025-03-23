import { useParams } from "react-router-dom";
import Footer from "../components/UX/Footer";
import Header from "../components/UX/Header";
import CityMain from "../components/Cities/CitiesMain";

function City() {
   let { page } = useParams();

   const pageNumber = page ? Number(page) : 1;

   return (
      <>
         <Header activeLink="Cities" />
         <CityMain pageNumber={pageNumber} />
         <Footer />
      </>
   )
}

export default City