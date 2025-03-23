import AboutMain from "../components/About/AboutMain"
import Footer from "../components/UX/Footer"
import GradientHeader from "../components/UX/GradientHeader"
import Header from "../components/UX/Header"

const About = () => {
   return (
      <>
         <meta name="description" content="Что такое Check You? История создания, цели проекта и интересные факты." />
         <meta name="keywords" content="чек ю что это, чек ю официальный сайт, чек ю информация, чек ю проект" />

         <Header activeLink="About" />
         <GradientHeader logoPath="О проекте" />
         <AboutMain />
         <Footer />
      </>
   )
}

export default About