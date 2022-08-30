import tesloApiBase from '../axios-tesloApi/tesloApi';
export const deleteProduct=async(id:string)=>{
    try {
         const resp= await tesloApiBase.delete(`/admin/products/${id}`);
         console.log(resp);
        
    } catch (error) {
        console.log(error);
        
        return error;
    }

}