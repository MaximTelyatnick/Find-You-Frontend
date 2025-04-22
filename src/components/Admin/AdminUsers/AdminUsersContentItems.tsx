import axios from "axios";
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom";
import { IAdminUsersState } from "../../../types/Admin";
import Pagination from "../../UX/Pagination";
import AdminUsersContentItem from "./AdminUsersContentItem";

const AdminUsersContentItems = ({ users, setUsers, setUsersSelected }: IAdminUsersState) => {
   const [error, setError] = useState<string>('');
   const [totalPages, setTotalPages] = useState<number>(1);
   const [searchParams] = useSearchParams();
   const page = Number(searchParams.get("page")) || 1;
   const search = searchParams.get("login") || '';

   const getUsersHandler = async () => {
      setError('')

      let apiUrlAccouts = `http://localhost:5000/users?page=${page}`;
      if (search) {
         apiUrlAccouts += `&login=${search}`
      }

      try {
         const result = await axios.get(`${apiUrlAccouts}`)

         setTotalPages(result.data.totalPages || 1);

         setUsers(result.data.users)
      } catch (error) {
         setError('Ошибка при получении аккаунта, попробуйте ещё раз!')
      }
   }

   useEffect(() => {
      getUsersHandler()
   }, [page, search])

   return (
      <div>
         {error && <p style={{ color: 'red' }}>{error}</p>}
         {users && users.map(item => (
            <AdminUsersContentItem key={item.id} user={{ ...item }} setUsersSelected={setUsersSelected} />
         ))}
         <Pagination totalPages={totalPages} page={page} itemsLength={users ? users.length : 0} cityId={0} tagIds={[]} search={search} visiblePages={5} type={'users'} />
      </div>
   )
}

export default AdminUsersContentItems