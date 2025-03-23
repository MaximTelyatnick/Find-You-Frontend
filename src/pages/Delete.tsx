import DeleteMain from "../components/Delete/DeleteMain"
import Footer from "../components/UX/Footer"
import GradientHeader from "../components/UX/GradientHeader"
import Header from "../components/UX/Header"

const Delete = () => {
   return (
      <>
         <Header activeLink="Delete" />
         <GradientHeader logoPath="УДАЛЕНИЕ" />
         <DeleteMain />
         <Footer />
      </>
   )
}

export default Delete