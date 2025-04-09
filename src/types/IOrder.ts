export default interface IOrder {
   id: number;
   user_id: number;
   created_at: Date; // YYYY-MM-DD
   text: string;
   status: number;
   type: string;
   login: string;
}

export interface IOrderState {
   items: IOrder[] | null,
   loading: false,
   error: false,
}

export interface IAdminOrderState {
   items: {
      data: IOrder[],
      currentPage: number,
      totalPages: number
   } | null,
   loading: false,
   error: false,
}