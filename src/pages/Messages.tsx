import MessagesMain from "../components/Messages/MessagesMain"
import Footer from "../components/UX/Footer"
import GradientHeader from "../components/UX/GradientHeader"
import Header from "../components/UX/Header"

const Messages = () => {
   return (
      <>
         <Header activeLink="" />
         <GradientHeader logoPath="СПИСОК СООБЩЕНИЙ" />
         <MessagesMain />
         <Footer />
      </>
   )
}

export default Messages