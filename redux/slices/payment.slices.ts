import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { IAllPaymentData, IUserPaymentData } from "../../interfaces/shared_interfaces";
import { AppThunk } from "../store";



const initialState:IAllPaymentData = {
    name:undefined,
    lastName:undefined,
    adress:undefined,
    secondAdress:undefined,
    country:undefined,
    postalCode:undefined,
    city:undefined,
    phoneNumber:undefined,

    quantityProducts:0,
    subTotal:0,
    taxes:0,
    total:0
}


const paymentSlices=createSlice({
    name:'payment',
    initialState:initialState,
    reducers:{
        loadPaymentData(state, action:PayloadAction<IAllPaymentData | IUserPaymentData>){
            return state ={...state, ...action.payload} ;
        },
    }
})

export const actionLoadPaymentData=():AppThunk=>{ //CARGA DE DATOS DE PAGO  *COMPRUEBA EN CADA CAMBIO DE PAGINA*

    return async(dispatch, getState)=>{

        const { cart }=getState().cart;
        let paymentState=getState().payment;

        const quantityProducts = cart.reduce( (total, item)=> total+= item.quantity, 0);
        const subTotal = cart.reduce( (total, item)=> total+= item.price * item.quantity, 0);
        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
        const taxes = subTotal * taxRate /100;
        const total=subTotal+ taxes;

        paymentState = {
            ...paymentState,
            quantityProducts,
            subTotal,
            taxes,
            total,
        }

        dispatch( loadPaymentData(paymentState) );
    }
}


export const actionLoadUserPaymentData=(data:IUserPaymentData):AppThunk=>{ //CARGA DE DATOS DE USUARIO EN EL FORMULARIO DE Adress

        return async(dispatch, getState)=>{

            Cookies.set('name',         data.name!); 
            Cookies.set('lastName',     data.lastName!); 
            Cookies.set('adress',       data.adress!); 
            Cookies.set('secondAdress', data.secondAdress! ||  ''); 
            Cookies.set('postalCode',   data.postalCode!);
            Cookies.set('country',      data.country!); 
            Cookies.set('city',         data.city!); 
            Cookies.set('phoneNumber',  data.phoneNumber!); 
            dispatch( loadPaymentData( data ) );
        }
}
export const { loadPaymentData } = paymentSlices.actions;

export default paymentSlices.reducer;