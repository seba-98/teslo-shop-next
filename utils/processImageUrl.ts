export const processUrl=(url:string)=>{
    const base = process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL || '';
    const localUrl = process.env.NEXT_PUBLIC_HOST_NAME || '';

    return  url.includes(base) ? url : `${localUrl}/products/${ url }`
  }
