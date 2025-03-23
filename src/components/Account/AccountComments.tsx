import { AccountCommentsProps } from "../../types/IAccounts"
import Title from "../UX/Title"
import AccountCommenItem from "./AccountCommenItem";

const AccountComments = ({ comments, onAction, setResult }: AccountCommentsProps) => {
   return (
      <div style={{ padding: "40px 0 0 0" }}>
         <Title>Комментарии</Title>
         {comments && comments.map((item) =>
            item.parent_id ? (
               <></>
            ) : (
               <AccountCommenItem
                  {...item}
                  onAction={onAction}
                  key={item.id}
                  setResult={setResult}
               />
            )
         )}
         {comments && comments.length == 0 && <p>
            Комментариев ещё нет, будьте первым!
         </p>}
      </div>
   );
}

export default AccountComments