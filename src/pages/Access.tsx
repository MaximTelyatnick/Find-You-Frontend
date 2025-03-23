import AccessMain from "../components/Access/AccessMain"
import Footer from "../components/UX/Footer"
import GradientHeader from "../components/UX/GradientHeader"
import Header from "../components/UX/Header"

const Access = () => {
   return (
      <>
         <meta name="description" content="Как получить доступ к эксклюзивным материалам Check You? Подробные инструкции для подписчиков." />
         <meta name="keywords" content="чек ю доступ, чек ю подписка, чек ю платный контент, чек ю как зайти, чек ю аккаунт" />

         <Header activeLink="Access" />
         <GradientHeader logoPath="БЕСПЛАТНЫЙ ДОСТУП" />
         <AccessMain />
         <Footer />
      </>
   )
}

export default Access