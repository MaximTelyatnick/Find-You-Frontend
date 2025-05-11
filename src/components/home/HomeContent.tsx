import { IAccountsState } from "../../types/IAccounts"
import HomeContentItem from "./HomeContentItem"

const HomeContent = ({ items, loading, error }: IAccountsState) => {

   return (
      <div className="account__items">
         {loading && <div className="loader">
            <div className="loader__circle"></div>
         </div>}
         {!items?.length && !loading && <div><p>По запросу ничего не найдено. Попробуйте другой город, тег или ключевое слово. </p></div>}
         {error && <div><p>Что-то пошло не так, попробуйте ещё раз</p></div>}
         {items && items.filter(item => {
            if (!item.date_of_create) return false
            if (new Date(item.date_of_create) > new Date()) return false

            return true
         }).map(item => (
            <HomeContentItem {...item} key={item.id} />
         ))}
      </div>
   )
}

export default HomeContent