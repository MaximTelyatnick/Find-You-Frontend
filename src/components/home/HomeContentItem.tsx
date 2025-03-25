import { useNavigate } from "react-router-dom"
import { IHomeAccount } from "../../types/IAccounts"
import transformPhoto from "../../utils/transformPhoto"

const HomeContentItem = ({ id, photo, check_video }: IHomeAccount) => {
   const navigate = useNavigate()

   const clickHandler = () => {
      navigate(`/${id}`)
   }

   return (
      <div className="account-item" style={{ cursor: 'pointer' }} onClick={clickHandler}>
         {typeof photo == 'string' ? <img src={`http://167.86.84.197:5000${photo}`} /> :
            photo && photo.data ? <img src={transformPhoto(photo)} /> :
               <img src='/images/blog_image.jpg' />}
         {!!check_video && <div className="account-item__icon">
            VIDEO
         </div>}
      </div>
   )
}

export default HomeContentItem