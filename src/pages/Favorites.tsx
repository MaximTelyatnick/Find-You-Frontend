import FavoritesMain from "../components/Favorites/FavoritesMain"
import Footer from "../components/UX/Footer"
import GradientHeader from "../components/UX/GradientHeader"
import Header from "../components/UX/Header"

const Favorites = () => {
   return (
      <>
         <Header activeLink="" />
         <GradientHeader logoPath="ЗАКЛАДКИ" />
         <FavoritesMain />
         <Footer />
      </>
   )
}

export default Favorites