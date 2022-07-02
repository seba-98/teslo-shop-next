
import useSWR, { SWRConfiguration } from 'swr';
import { ICompleteProduct } from '../interfaces/shared_interfaces';


export const useProducts = ( url:string  ) => {                                  //LA DATA GENERADA EN LA PETICION SE ALMACENARÁ EN CACHE
                                                                                //POR LO TANTO AL SALIR DE LA PÁGINA Y VOLVER A INGRESAR NO SE VOLVERÁ A REALIZAR
    const { data, error } = useSWR<ICompleteProduct[]>(`/api/${url}`, );                 //A NO SER QUE LOS DATOS HALLAN CAMBIADO en la  base de datos
    
    return {
        products:data || [],
        loading: !data && !error,
        isErr: error
    }
}

