import axios from "axios";
import IFetchData from "../types/IFetchData";

const fetchData = async (method: 'post' | 'get', url: string, setState?: Function) => {
   try {
      setState && setState((prev: IFetchData) => ({ ...prev, loading: true }))

      const response = await axios[method](url);

      setState && setState({
         items: response.data,
         loading: false,
         error: false
      })

      return response.data
   } catch (error: any) {
      if (error.status === 401) {
         localStorage.removeItem("token"); // Удаляем токен
         localStorage.removeItem('user');
      }
      setState && setState({
         items: null,
         loading: false,
         error: true
      })

      return null
   }
};

export default fetchData