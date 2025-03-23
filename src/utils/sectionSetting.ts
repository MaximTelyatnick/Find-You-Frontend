import { IAdminSection } from "../types/Admin"

const layoutNames: string[] = ['Текст | Изображение', 'Изображение | Текст', 'Текст', 'Текст | 2 Изображения', '2 Изображения | Текст', 'Изображение | Изображение', 'Изображение | 2 Изображения', '2 Изображения | Изображение', '3 Изображения']

const getImageCount = (layoutId: number) => {
   const layoutType = layoutNames[layoutId]
   if (layoutType.includes('3 Изображения')) return 3
   if (layoutType.includes('2 Изображения') && layoutType.includes('Изображение')) return 3
   if (layoutType.includes('2 Изображения')) return 2
   if (layoutType.includes('Изображение | Изображение')) return 2
   if (layoutType.includes('Изображение')) return 1
   return 0
}

const distributeImagesByLayout = (images: string[], sections: IAdminSection[]) => {
   let index = 0
   return sections.map(section => {
      const count = getImageCount(section.layout_id)
      const assignedImages = images.slice(index, index + count)
      index += count
      return { ...section, images: assignedImages }
   })
}

export default distributeImagesByLayout