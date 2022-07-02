import Cookies from 'js-cookie';
import { ICartProduct } from '../interfaces/client_interfaces/cart';

export const cartFromCookies=()=>{

    return new Promise<ICartProduct[]>((resolve, reject) => {

        let cartCookies:ICartProduct[];

        cartCookies = Cookies.get('cart') && JSON.parse(Cookies.get('cart')!);
       

            if(cartCookies.length > 0) {
                resolve(cartCookies)  //SI ES TRUE EL CARRITO TERMINO DE CARGAR Y NO ESTA VACÍO
            }
            else{
                reject([]); //SI ES TRUE EL CARRITO TERMINO DE CARGAR Y  ESTA VACÍO
            }
            
        
    })
}


/*
ESTA FUNCIÓN ES CREADA DEBIDO A QUE LA ACTUALIZACIÓN DEL ESTADO DE REDUX DEL CARRITO TIENE RETRASO A LA HORA DE OBTENER LAS COOKIES 
POR TANTO FUE NECESARIO CREAR UNA PROMESA QUE RECIBA EL CARRO Y ESPERE A QUE SU CONTENIDO EXISTA (ya sea array vacío o con contenido). 

Esta función será utilizada en el reducer del carrito
*/