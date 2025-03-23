import { IAccount, IFav } from "./IAccounts";

export default interface IFavoritesState {
   items: IAccount[] | null,
   loading: boolean,
   error: boolean,
}

export interface IFavoritesItemProps extends IFav {
   removeFav: Function
}