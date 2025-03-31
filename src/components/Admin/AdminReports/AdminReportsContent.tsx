import { useEffect, useState } from "react"
import { IAdminReportsState } from "../../../types/Admin"
import fetchData from "../../../services/fetchData"
import Title from "../../UX/Title"
import AdminReportsItem from "../AdminReportsItem"

const AdminReportsContent = () => {
   const apiUrl = `http://167.86.84.197:5000/reports`
   const [filter, setFilter] = useState<string>('new')
   const [result, setResult] = useState<IAdminReportsState>({
      items: null,
      loading: false,
      error: false,
   })

   const getReports = async (url: string) => {
      await fetchData('get', url, setResult)
   }

   useEffect(() => {
      getReports(apiUrl)
   }, [])

   return (
      <div className="admin-reports">
         <Title classes='pt'>Жалобы</Title>
         {result.loading && <div className="loader">
            <div className="loader__circle"></div>
         </div>}
         {result.error && <p style={{ color: 'red' }}>Что-то пошло не так, попробуйте ещё раз!</p>}
         <div className="admin-reports__buttons">
            <div className="btn" onClick={() => { setFilter('new') }}>Сначала новые</div>
            <div className="btn" onClick={() => { setFilter('old') }}>Сначала старые</div>
         </div>
         {!result.items && <p>Жалоб нет</p>}
         {result.error && <p>Не удалось загрузить жалобы, попробуйте ещё раз</p>}
         <div className="admin-reports__items">
            {result.items && result.items.sort((a, b) => {
               if (filter == 'new') {
                  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
               } else if (filter == 'old') {
                  return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
               }
               return 0
            }).map(item => (
               <AdminReportsItem {...item} setResult={setResult} key={item.id} />
            ))}
         </div>

      </div>
   )
}

export default AdminReportsContent