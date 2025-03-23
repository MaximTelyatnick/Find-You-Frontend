export default interface IOrder {
   id: number;
   user_id: number;
   created_at: Date; // YYYY-MM-DD
   text: string;
   status: number;
   type: string;
}

export interface IOrderState {
   items: IOrder[] | null,
   loading: false,
   error: false,
}