import { useEffect, useState } from "react"
import { IAdminAccountsEditSocial } from "../../types/Admin"
import { ISocials } from "../../types/IAccounts"

const AdminAccountsEditSocial = ({ social_name, id, text, setAccountSocials }: IAdminAccountsEditSocial) => {
   const [textInput, setTextInput] = useState<string>(text)

   const deleteAccountsSocialsHandler = (id: number) => {
      setAccountSocials((prev: ISocials[]) => [...prev].filter(item => item.id != id))
   }

   const changeAccountSocialsHandler = (id: number, option: string) => {

   }

   useEffect(() => {
      setAccountSocials((prev: ISocials[]) => [...prev].map(item => {
         if (item.id == id) {
            item.text = textInput
         }

         return item
      }))
   }, [textInput])

   return (
      <div className="admin-accounts-get__social">
         <svg onClick={() => { deleteAccountsSocialsHandler(id) }} width="20" height="20" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 47.5C15 48.8261 15.5268 50.0979 16.4645 51.0355C17.4021 51.9732 18.6739 52.5 20 52.5H40C41.3261 52.5 42.5979 51.9732 43.5355 51.0355C44.4732 50.0979 45 48.8261 45 47.5V17.5H15V47.5ZM20 22.5H40V47.5H20V22.5ZM38.75 10L36.25 7.5H23.75L21.25 10H12.5V15H47.5V10H38.75Z" fill="#E36F6F" />
         </svg>
         <select defaultValue={social_name} onChange={(e) => { changeAccountSocialsHandler(id, e.target.value) }}>
            <option value="Facebook">Facebook</option>
            <option value="Odnoklassniki">Odnoklassniki</option>
            <option value="ICQ">ICQ</option>
            <option value="Instagram">Instagram</option>
            <option value="Twitter">Twitter</option>
            <option value="Email">Email</option>
            <option value="Telegram">Telegram</option>
            <option value="TikTok">TikTok</option>
            <option value="OnlyFans">OnlyFans</option>
            <option value="Phone">Phone</option>
         </select>
         <input type="text" placeholder={`Контакты от ${social_name}`} value={textInput} onChange={(e) => { setTextInput(e.target.value) }} />
      </div>
   )
}

export default AdminAccountsEditSocial