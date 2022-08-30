import { ICompleteProduct, IValidSizes } from "../interfaces/shared_interfaces";
import { price } from "./valueInPrice";

export const findSize=(product: ICompleteProduct, size:IValidSizes)=>{    //Funciones para la parte de administración de productos
    const foundSize = product.sizes.find(s=> s.value === size);           //se utilízan en las celdas del listado de productos
    return !foundSize || foundSize.inStock === 0 ?
    'Agotado' 
    : 
    ` Stock: ${foundSize!.inStock}  |  
    ${price(foundSize!.price)}/U `    
  }

export const findSizeStock=(product: ICompleteProduct, size:IValidSizes)=>{
    const foundSize = product.sizes.find(s=> s.value === size);
    return !foundSize || foundSize.inStock === 0 ?
    0
    : 
    foundSize!.inStock   
  }
export const findSizePrice=(product: ICompleteProduct, size:IValidSizes)=>{
    const foundSize = product.sizes.find(s=> s.value === size);
    return !foundSize  ?
    0
    : 
    foundSize!.price    
  }