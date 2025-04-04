import { useNavigate } from "react-router-dom"
import { IHomeAccount } from "../../types/IAccounts"
import transformPhoto from "../../utils/transformPhoto"
import axios from "axios"
import { useEffect, useState } from "react"

const HomeContentItem = ({ id, photo }: IHomeAccount) => {
   const navigate = useNavigate()
   const apiUrlGet = 'http://167.86.84.197:5000/account'
   const [video, setVideo] = useState<string[]>([])

   const clickHandler = () => {
      navigate(`/${id}`)
   }

   const getAccountHandler = async () => {
      try {
         const result = await axios.get(`${apiUrlGet}?id=${id}`)

         setVideo(result.data.files.filter((item: string) => item.includes('.mp4')))
      } catch (error) {
      }
   }

   useEffect(() => {
      getAccountHandler()
   }, [])

   return (
      <div className="account-item" style={{ cursor: 'pointer' }} onClick={clickHandler}>
         {typeof photo == 'string' ? <img src={`${photo}`} /> :
            photo && photo.data ? <img src={transformPhoto(photo)} /> :
               <img src='/images/blog_image.jpg' />}
         {!!video.length && <div className="account-item__icon">
            VIDEO
         </div>}
      </div>
   )
}

export default HomeContentItem