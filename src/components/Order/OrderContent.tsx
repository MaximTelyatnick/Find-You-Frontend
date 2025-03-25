import { useEffect, useState } from "react"
import Title from "../UX/Title"
import axios from "axios"
import IUser from "../../types/IUser";
import { IOrderState } from "../../types/IOrder";
import fetchData from "../../services/fetchData";
import OrderContentItem from "./OrderContentItem";

const OrderContent = () => {
   const storedUser = localStorage.getItem('user');
   const user: IUser | null = storedUser ? JSON.parse(storedUser) : null;
   const [message, setMessage] = useState<string>('')
   const [seccess, setSeccess] = useState<boolean>(false)
   const [error, setError] = useState<string>('')
   const [result, setResult] = useState<IOrderState>({
      items: null,
      loading: false,
      error: false,
   })
   const apiUrlAdd: string = 'http://localhost:5000/add-order'
   const apiUrlGet: string = `http://localhost:5000/get-orders?user_id=${user?.id}&type=add`

   const sendFormHandler = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      try {
         if (!message.trim()) {
            setError('Необходимо заполнить текстовое поле!')
         }

         const result = await axios.post(apiUrlAdd, {
            user_id: user?.id,
            text: message,
            type: 'add',
         })

         setResult(prev => ({
            ...prev,
            items: prev.items && [...prev.items, result.data]
         }))
         setSeccess(true)
      } catch (error: any) {
         setError('Что-то пошло не так, попробуйте ещё раз!')
      }
   }

   const getOrders = async () => {
      await fetchData('get', apiUrlGet, setResult)
   }

   useEffect(() => {
      getOrders()
   }, [])

   return (
      <div className="order__container layout-container">
         {result.loading && <div className="loader">
            <div className="loader__circle"></div>
         </div>}
         <p>Мы обработаем вашу заявку в течении 24 часов</p>
         {seccess && <p style={{ color: 'green' }}>Вы успешно отправили заявку</p>}
         {error && <p style={{ color: 'red' }}>{error}</p>}
         <form className="order__row layout-row" onSubmit={sendFormHandler}>
            <input type="text" name="order" id="order" placeholder="Сообщение" onChange={(e) => { setMessage(e.target.value) }} required />
            <button type="submit" className="btn btn-info">Отправить</button>
         </form>
         <Title classes='pt'>Заявки</Title>
         <div className="order__items">
            {result.error && <p style={{ color: 'red' }}>Что-то пошло не так, попробуйте ещё раз!</p>}
            {result.items && result.items.map(item => (
               <OrderContentItem {...item} key={item.id} />
            ))}
         </div>
      </div>
   )
}

export default OrderContent