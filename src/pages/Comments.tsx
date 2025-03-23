import CommentsMain from "../components/Comments/CommentsMain"
import Footer from "../components/UX/Footer"
import GradientHeader from "../components/UX/GradientHeader"
import Header from "../components/UX/Header"

const Comments = () => {
   return (
      <>
         <Header activeLink="" />
         <GradientHeader logoPath="МОИ КОМЕНТАРИИ" />
         <CommentsMain />
         <Footer />
      </>
   )
}

export default Comments