import TagsMain from "../components/Tags/TagsMain"
import Footer from "../components/UX/Footer"
import GradientHeader from "../components/UX/GradientHeader"
import Header from "../components/UX/Header"

const Tags = () => {
   return (
      <>
         <meta name="description" content="Популярные темы на Check You: переписки, лохотроны, разоблачения и многое другое. Найдите интересующий вас тег!" />
         <meta name="keywords" content="чек ю теги, чек ю тематики, чек ю скандалы, чек ю переписки, чек ю лохотрон" />

         <Header activeLink="Tags" />
         <GradientHeader logoPath="ТЭГИ" />
         <TagsMain />
         <Footer />
      </>
   )
}

export default Tags