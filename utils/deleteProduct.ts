import tesloApiBase from '../axios-tesloApi/tesloApi';
export const deleteProduct=async(id:string)=>{
    try {
         await tesloApiBase.delete(`/admin/products/${id}`);
        
    } catch (error) {
        console.log(error);
        return error;
    }

}