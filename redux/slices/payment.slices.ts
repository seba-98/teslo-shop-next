import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../store";

interface initialState{
    location:string,
    phoneNumber:string,
    quantityProducts:number,
    subTotal:number,
    taxes:number,
    total:number
}

const initialState:initialState = {
    location:'',
    phoneNumber:'',
    quantityProducts:0,
    subTotal:0,
    taxes:0,
    total:0
}


const paymentSlices=createSlice({
    name:'payment',
    initialState:initialState,
    reducers:{
        loadPaymentData(state, action:PayloadAction<initialState>){

            return state = action.payload;
        }
    }
})

export const actionLoadPaymentData=():AppThunk=>{

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
            total
        }

        dispatch( loadPaymentData(paymentState) );
    }

}

export const { loadPaymentData }= paymentSlices.actions;

export default paymentSlices.reducer;