import { useNavigate } from "react-router-dom"
import { IFavoritesItemProps } from "../../types/IFavoritesState"

const FavoritesContentItem = ({ comment, accounts_id, removeFav }: IFavoritesItemProps) => {
   const navigate = useNavigate()

   return (
      <div className="fav-item">
         <p className="fav-item__comment">
            {comment} <svg onClick={() => { navigate(`/${accounts_id}`) }} width="25" height="25" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M45.3629 45.3629C47.2751 43.4507 48.792 41.1805 49.8269 38.6821C50.8618 36.1836 51.3945 33.5058 51.3945 30.8015C51.3945 28.0971 50.8618 25.4193 49.8269 22.9209C48.792 20.4224 47.2751 18.1522 45.3629 16.24C43.4507 14.3278 41.1805 12.8109 38.6821 11.776C36.1836 10.7411 33.5058 10.2084 30.8014 10.2084C28.0971 10.2084 25.4193 10.7411 22.9208 11.776C20.4224 12.8109 18.1522 14.3278 16.24 16.24C12.378 20.1019 10.2084 25.3398 10.2084 30.8015C10.2084 36.2631 12.378 41.501 16.24 45.3629C20.1019 49.2249 25.3398 51.3945 30.8014 51.3945C36.2631 51.3945 41.501 49.2249 45.3629 45.3629ZM45.3629 45.3629L58.3333 58.3333" stroke="#79C0AD" strokeWidth="4.375" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
         </p>
         <div className="fav-item__button"><svg onClick={() => { removeFav(accounts_id) }} width="20" height="20" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M56.875 8.75H13.125C10.7088 8.75 8.75 10.7088 8.75 13.125V56.875C8.75 59.2912 10.7088 61.25 13.125 61.25H56.875C59.2912 61.25 61.25 59.2912 61.25 56.875V13.125C61.25 10.7088 59.2912 8.75 56.875 8.75Z" stroke="#E36F6F" strokeWidth="5" strokeLinejoin="round" />
            <path d="M23.3333 35H46.6667" stroke="#E36F6F" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
         </svg></div>
      </div>
   )
}

export default FavoritesContentItem