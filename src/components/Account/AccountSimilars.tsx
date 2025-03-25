import { useEffect, useState } from "react";
import { IAccountAll, IAccountsState } from "../../types/IAccounts"
import Title from "../UX/Title"
import fetchData from "../../services/fetchData";
import HomeContentItem from "../home/HomeContentItem";

const AccountSimilars = ({ account, tags }: IAccountAll) => {
   const [result, setResult] = useState<IAccountsState>({
      items: null,
      loading: false,
      error: false
   })
   const apiUrl = `http://167.86.84.197/api/accounts?page=1&tag_id=${tags[0].id}`

   useEffect(() => {
      fetchData('get', apiUrl, setResult)
   }, [])

   return (
      <div style={{ padding: '40px 0 0 0' }}>
         {result.loading && <div className="loader">
            <div className="loader__circle"></div>
         </div>}

         <Title>Похожие страницы</Title>
         <div className="account__items" >
            {!result.error && result.items ? result.items.map(item => {
               if (item.id == account.id) {
                  return
               } else {
                  return <HomeContentItem {...item} key={item.id} />
               }
            }) : <p>Что-то пошло не так, попробуйте ещё раз</p>}
         </div>
      </div>
   )
}

export default AccountSimilars