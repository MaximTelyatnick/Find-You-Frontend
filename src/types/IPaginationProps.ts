export default interface IPaginationProps {
   itemsLength: number;
   page: number;
   totalPages: number;
   visiblePages?: number;
   cityId?: number;
   tagIds?: number[];
   search?: string;
   type?: string;
   sortByRating?: boolean;
}