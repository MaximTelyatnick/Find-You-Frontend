const transformPhoto = (photo: { type: string; data: number[]; } | null) => {
   if (photo) {
      const uint8Array = new Uint8Array(photo.data);
      const imageUrl = URL.createObjectURL(new Blob([uint8Array], { type: 'image/jpeg' }));

      return imageUrl
   }
}

export default transformPhoto