import IPaginationProp from "../../types/IPaginationProps"
import { useNavigate } from "react-router-dom";

const Pagination = ({ itemsLength, page, totalPages, cityId, tagIds, search, visiblePages, type }: IPaginationProp) => {

   const navigate = useNavigate()

   // Генерация массива страниц
   const getPageNumbers = () => {
      if (!visiblePages) {
         return []
      }

      let pages: number[] = [];
      let start = Math.max(1, page - Math.floor(visiblePages / 2));
      let end = Math.min(totalPages, start + visiblePages - 1);

      if (end - start < visiblePages - 1) {
         start = Math.max(1, end - visiblePages + 1);
      }

      for (let i = start; i <= end; i++) {
         pages.push(i);
      }

      if (start > 1) pages.unshift(0);
      if (end < totalPages) pages.push(0);

      return pages;
   };

   const clickHandler = (num: number) => {
      let query = `/${type == 'admin' ? 'admin-accounts' : type == 'users' ? 'admin-users' : type == 'orders' ? 'admin-orders' : ''}?page=${num}`;

      if (cityId) query += `&city_id=${cityId}`;
      if (tagIds && tagIds.length > 0) query += `&tag_id=${tagIds.join(",")}`;
      if (search) query += `&${type == 'users' ? 'login' : 'search'}=${search}`

      navigate(query);
   };

   return (
      <div className="pages">
         {
            itemsLength && totalPages > 1 ? (
               <>
                  <a onClick={() => { if (page !== 1) clickHandler(page - 1); }}>« Назад</a>
                  {getPageNumbers().map((num, index) => (
                     num === 0 ? (
                        <span key={index}>...</span>
                     ) : (
                        <a key={index} onClick={() => clickHandler(num)} className={num === page ? "active" : ""}>
                           {num}
                        </a>
                     )
                  ))}
                  <a onClick={() => { if (page !== totalPages) clickHandler(page + 1); }}>Вперед »</a>
               </>
            ) : (
               <div></div>
            )
         }

      </div>
   )
}

export default Pagination