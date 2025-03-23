export interface ITag {
   name_ru: string,
   id: number,
   usage_count: number,
}

export default interface ITagsProps {
   items: ITag[] | null,
   loading: boolean,
   error: boolean,
}