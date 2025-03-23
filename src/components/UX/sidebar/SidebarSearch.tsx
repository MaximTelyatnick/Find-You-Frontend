import { useState } from "react"
import { useNavigate } from "react-router-dom"

const SidebarSearch = () => {
   const [search, setSearch] = useState<string>('')
   const navigate = useNavigate()

   const searchHandler = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const formatedSearch = search.split(' ').join('%20')

      navigate(`/?page=1&search=${formatedSearch}`)
   }

   return (
      <form method="post" action="/" className="search" onSubmit={searchHandler}>
         <input type="hidden" name="do" defaultValue="search" />
         <input type="hidden" name="subaction" defaultValue="search" />
         <input id="story" name="story" className="searchTerm" placeholder="Поиск по сайту ..." onChange={(e) => { setSearch(e.target.value) }} />
         <input className="searchButton" type="submit" />
         <span className="searchIcon search" style={{ background: "rgb(121, 192, 173)", transition: "all" }}>
            <svg xmlns="http://www.w3.org/2000/svg" height="12" width="12" viewBox="0 0 512 512">
               <path fill="#ffffff" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path>
            </svg>
         </span>
      </form>
   )
}

export default SidebarSearch