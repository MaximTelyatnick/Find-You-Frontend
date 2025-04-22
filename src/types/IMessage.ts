export default interface IMessage {
   id: number;
   date_messages: string;  // Формат: YYYY-MM-DD
   time_messages: string;  // Формат: HH:MM:SS
   text_messages: string;
   sender: string;   // Логин отправителя
   receiver: string; // Логин получателя
   is_read: boolean
}

export interface IMessageState {
   items: IMessage[] | null,
   error: boolean,
   loading: boolean,
}

export interface IMessageItemProps extends IMessage {
   selected: number[];
   setSelected: Function;
   responseHandler: Function;
   onMessageRead: Function
}