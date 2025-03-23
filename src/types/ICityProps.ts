export interface ICity {
   city_id: number,
   city_name: string;
   account_count: number; // Название города на русском
}

export default interface ICityProp {
   items: ICity[] | null,
   loading: boolean,
   error: boolean,
}
