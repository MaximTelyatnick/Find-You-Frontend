import { useSearchParams } from "react-router-dom";
import HomeMain from "../components/home/HomeMain";
import Footer from "../components/UX/Footer";
import Header from "../components/UX/Header";

function Home() {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const city_id = Number(searchParams.get("city_id")) || undefined;
  const search = searchParams.get("search") || undefined;
  const tag_id = searchParams.get("tag_id") ? searchParams.get("tag_id")?.split(',').map(Number) : undefined;
  const date_range = searchParams.get("date_range") ? JSON.parse(decodeURIComponent(searchParams.get("date_range")!)) : undefined;
  const sort_by_rating = searchParams.get("sort_by_rating") === 'true';

  let activeLink: string = "Home";
  if (city_id) activeLink = "Cities";
  else if (tag_id) activeLink = "Tags";
  else if (sort_by_rating) activeLink = "Top";

  return (
    <>
      <meta name="description" content="Check You — это официальный сайт с подборкой эпичных переписок, где девушки готовы на многое за деньги. Открывайте самые скандальные истории!" />
      <meta name="keywords" content="чек ю,чек ю сайт,чек ю официальный,чек ю сайт официальный,чек ю разводы,чек ю девушки,чек ю разводы сайт,развод девушек чек ю,чек ю архив,закрыли чек ю,сайт разводов девушек чек ю,чек ю сайт закрыли,архив разводов чек ю,чек ю тк,чек ю фото,чек ю орг,светлана утенина чек ю,чек ю в контакте,чек ю видео,чек ю сайт светлана утенина,чек ю сайт в контакте,переписки чек ю,чек ю ломаем судьбу,чек ю ломаем жизни" />
      <Header activeLink={activeLink} />
      <HomeMain
        key={searchParams.toString()}
        pageNumber={page}
        cityId={city_id}
        tagIds={tag_id}
        search={search}
        dateRange={date_range}
        sortByRating={sort_by_rating}
      />
      <Footer />
    </>
  );
}

export default Home;