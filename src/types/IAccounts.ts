export interface ICity {
   id: number;
   name_ru: string;
   name_eu: string;
}

interface ITag {
   id: number;
   name_ru: string;
   name_eu: string;
}

export interface ISocials {
   id: number;
   type_social_id: number;
   social_name: string;
   text: string;
}

export interface IRating {
   id: number;
   account_id: number;
   users_id: number;
   rate: number;
}

export interface IFav {
   id: number;
   accounts_id: number;
   users_id: number;
   comment: string;
}

export interface IRatingProps {
   rating: IRating[],
   setSeccess: Function,
   setError: Function,
}

export interface IComment {
   id: number;
   parent_id: number | null;
   account_id: number;
   user_id: number;
   text: string;
   date_comment: string;
   time_comment: string;
   author_nickname: string;
   children: IComment[];
   quoted_author_nickname: string | null;
   quoted_comment_text: string;
   account_name: string;
}

export interface ICommentProps extends IComment {
   margin?: boolean;
   onAction: Function,
   setResult: Function,
}

export interface IAccountAll {
   account: IAccount;
   city: ICity;
   tags: ITag[];
   socials: ISocials[];
   rating: IRating[];
   comments: IComment[];
   files: string[];
}

export interface IAccount {
   id: number;
   name: string;
   date_of_create: Date | null;
   date_of_birth?: string | null; // может быть null или строкой
   identificator?: string | null; // может быть null или строкой
   photo: {
      type: string; // Тип, например, "Buffer"
      data: number[]; // Массив байтов
   } | null; // для поля BYTEA, которое может хранить бинарные данные
   check_video: number; // по умолчанию значение 0
   views: number;
   city_id?: number | null; // внешний ключ, может быть null
}

export interface IHomeAccount extends Omit<IAccount, "photo"> {
   photo: {
      type: string; // Тип, например, "Buffer"
      data: number[]; // Массив байтов
   } | string | null;
}

export interface IAccountsState {
   items: IAccount[] | null,
   loading: boolean,
   error: boolean,
}

export interface IAccountState {
   items: IAccountAll | null,
   loading: boolean,
   error: boolean,
}

export interface AccountReplyProps extends IAccountAll {
   replyComment: IAccountReplyComment | null,
   setReplyComment: Function,
   cancelAction: Function,
   editComment: IAccountReplyComment | null,
   accountId: number,
   setResult: Function,
}

export interface AccountCommentsProps {
   comments: IComment[] | null,
   onAction: Function,
   setResult: Function,
}

export interface IAccountReplyComment {
   author_nickname: number;
   text: string;
   parent_id?: number;
}