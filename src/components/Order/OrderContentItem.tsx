import dayjs from "dayjs"
import IOrder from "../../types/IOrder"

const OrderContentItem = ({ text, created_at, status }: IOrder) => {
   const statusArr: string[] = [
      'Отклонена',
      'Обрабатывается',
      'Принята'
   ]

   return (
      <div className="order-item">
         <p className="order-item__text">{text}</p>
         <p className="order-item__time">{dayjs(new Date(created_at)).format("DD.MM.YYYY: hh-mm")}</p>
         <div className={`order-item__status order-item__${status}`}>{statusArr[status]}</div>
      </div>
   )
}

export default OrderContentItem