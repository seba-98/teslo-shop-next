
import useSWR, { SWRConfiguration } from 'swr';
import { ICompleteProduct } from '../interfaces/shared_interfaces';


export const useProducts = ( url:string  ) => { 
    
    try{
        const { data:products, error:err } =  useSWR<ICompleteProduct[]>(`/api/${url}`, );    

        return {
            products:products || [],
            loading: !products && !err,
            isErr: err
        }
    }
    catch(error){

        console.log(error);
        
        
        return {
            products: [],
            loading: false,
            isErr: error
        }
    }


}

