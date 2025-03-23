import { IComment } from "./IAccounts";

export default interface ICommentsState {
   items: IComment[] | null,
   loading: boolean,
   error: boolean,
}

export interface ICommentItem extends IComment {
   setResult: Function;
}