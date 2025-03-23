import { IAccountAll } from "./IAccounts";
import IOrder from "./IOrder";

export interface IAdminOrdersItemProps extends IOrder {
   setResult: Function
}

interface IAdminUser {
   id: number;
   login: string;
   avatar: string | null;
   date_of_create: string;
   mail: string;
   session_id: string | null;
   role: string; // Если используем COALESCE, role всегда строка (может быть пустой)
}

export interface IAdminUserState {
   items: IAdminUser | null,
   loading: boolean,
   error: boolean,
}

export interface IAdminUserToolbar {
   setResult: Function,
   userId: number
}

export interface IAdminReport {
   id: number;
   comment_id: number;
   reported_user_id: number;
   reported_user_login: string;
   reporter_user_id: number;
   reporter_user_login: string;
   account_id: number; // ID аккаунта
   account_name: string; // Имя аккаунта
   report_text: string;
   created_at: string;
   comment_text: string;
}


export interface IAdminReportsState {
   items: IAdminReport[] | null,
   loading: boolean,
   error: boolean,
}

export interface IAdminReportsItemState extends IAdminReport {
   setResult: Function
}

export interface IAdminAccountAll extends Omit<IAccountAll, "files"> {
   files: (File | string)[],
}

export interface IAdminSectionsItem {
   setSections: Function,
   id: number
}

export interface ISection {
   id: number,
   layout: number,
   text: string,
   files: File[],
}

export interface IAdminSection {
   id: number;
   image_identifier: string;
   page_name: string;
   section_order: number;
   layout_id: number;
   content: string;
   images: string[];
   created_at: Date
}

export interface IAdminSections {
   sections: IAdminSection[],
   images: string[]
}

export interface ILayout {
   layoutId: number,
   text: string,
   urls: string[],
   publicComponent?: boolean
}