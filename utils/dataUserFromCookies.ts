import Cookies from "js-cookie";
import { IUserPaymentData } from "../interfaces/shared_interfaces";

export const dataUserFromCookies=async():Promise<IUserPaymentData | undefined>=>{
    return new Promise((resolve, reject)=>{

        let userData;
        try {
            userData = { 
                    name:         Cookies.get('name') || '', 
                    lastName:     Cookies.get('lastName') || '', 
                    adress:       Cookies.get('adress') || '', 
                    secondAdress: Cookies.get('secondAdress') || '', 
                    postalCode:   Cookies.get('postalCode') || '',
                    country:      Cookies.get('country') || '', 
                    city:         Cookies.get('city') || '', 
                    phoneNumber:  Cookies.get('phoneNumber') || '', 
                }
                const {name, adress, city, country, phoneNumber} = userData;

                if(
                    phoneNumber !=='' &&  
                    name !=='' &&  
                    adress !=='' &&  
                    city !=='' &&  
                    country!==''
                ) resolve(userData);
                
            
        } catch (error) {
            reject(undefined)
        }
    });
}