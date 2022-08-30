
import useSWR, { SWRConfiguration } from 'swr';
import { IValidSizes } from '../interfaces/shared_interfaces/products';


export interface ISizeElement{
    value:IValidSizes;
    price:number;
    inStock:number;
    _id:string;
}

export type ISizes ={
    sizes:ISizeElement[],
    _id:string
} 


export const useSizes =( url:string  )=> { 

    
    try{
        const { data:sizes, error:err } =  useSWR<ISizes>(`/api/products/${url}`, );    

        return {
            sizes: sizes && sizes.sizes,
            loading: !sizes && !err,
            isErr: err
        }
    }
    catch(error){
        console.log(error);
        return {
            sizes: [],
            loading: false,
            isErr: error
        }
    }


}