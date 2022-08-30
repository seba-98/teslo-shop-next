import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { tesloApi } from '../../axios-tesloApi';
import { ICartProduct } from '../../interfaces/client_interfaces/';
import { IOrder } from '../../interfaces/server_interfaces';
import { cartFromCookies } from '../../utils';
import { AppThunk } from '../store';
import { IOrderItem } from '../../interfaces/server_interfaces/orders';
import axios from 'axios';

interface initialState{
    cart:ICartProduct[],
    loaded:boolean,
    empty:boolean,
    orderError:string | boolean,
    orderMessage:string
}
 
let initialState:initialState= { cart:[], loaded:false, empty:true, orderError:false, orderMessage:'' };



//async thunk process functions-------------------

export const getStateFromCookies = createAsyncThunk('loadFromCookies', async(dispatch, getState)=>{

    try {
        const cartCookies = await cartFromCookies();
        return cartCookies
        
    } catch (err) {
        throw err
    }

})
//async thunk process functions END-------------------





const cartSlices= createSlice({
    name:"cart",
    initialState,
    reducers:{
        updateQuantity(state, action:PayloadAction<ICartProduct>){

            const  item = action.payload;
            const findItem = state.cart.some((i)=>i.slug === item.slug && i.size === item.size);

            
            findItem ?
                state.cart.find(i=> i.slug === item.slug && i.size === item.size)!.quantity = item.quantity
            :
                state.cart.push(item)

            state.empty=state.cart.length<1;
            state.loaded=true;
            
        },
        removeOfCart(state, action:PayloadAction<ICartProduct>){
            
            const item = action.payload;
            state.cart = state.cart.filter(i => item.slug !== i.slug  ||  item.size !== i.size);

            Cookies.set('cart', JSON.stringify( state.cart ))

            return state
        },
        setOrderError(state, action:PayloadAction<boolean | string>){
            state.orderError = action.payload
        },
        setEmptyCart(state){
            state.cart = [];
        },
        setOrderMessage(state, action:PayloadAction<string>){
            state.orderMessage = action.payload;
        }
    },

    //async thunk process reducers-------------------
    extraReducers(builder) {  
        builder.addCase(getStateFromCookies.pending,(state, action)=>{
            state.cart=state.cart;
            state.loaded=false;
            state.empty=false;
        });
        
        builder.addCase(getStateFromCookies.rejected, (state, action)=>{
            state.cart=[];
            state.loaded=true;
            state.empty=true;
        });
        builder.addCase(getStateFromCookies.fulfilled, (state, action)=>{
            state.cart=action.payload;
            state.loaded=true;
            state.empty=false;
        })
    },
    //async thunk process reducers END-------------------
})



//||||||||||||||----------ACTIONS FUNCTIONS---------------||||||||||||||||||
export const updateQuantityAction=( product:ICartProduct):AppThunk=>{
    return async(dispatch, getState)=>{
        
        dispatch( updateQuantity(product) )
        Cookies.set('cart',JSON.stringify( getState().cart.cart ))
    }
}
export const removeCartAction=( product:ICartProduct):AppThunk=>{
    return async(dispatch, getState)=>{
        
        dispatch( removeOfCart(product) )
        Cookies.set('cart',JSON.stringify( getState().cart.cart ))
    }
}

export const setOrderErrorAction=(value:string | boolean):AppThunk=>{

    return async(dispatch)=>{
        dispatch( setOrderError(value) );
        setTimeout(()=>{ dispatch( setOrderError(false) ); }, 4000)
    }

}

export const createOrderAction =():AppThunk=>{

    return async(dispatch, getState)=>{

        const payment = getState().payment
        const { _id } = getState().auth.user!
        const { cart } = getState().cart!

        if(!payment) throw new Error('Faltan datos de envío');

        try {
            
            const body:IOrder={
                user : _id,
                orderItems : cart.map((p)=> ({...p,   _id:p._id!,  size:p.size!})),
                allPaymentData : payment,
                isPaid : false,
            }
            const { data } = await tesloApi.post('/orders/', body);

            dispatch( setOrderMessage( data.message ) );

            setTimeout(()=>{dispatch( setOrderMessage( '' ) )}, 4000)

            Cookies.remove('cart');
            dispatch( setEmptyCart() );
            dispatch( setOrderErrorAction(false) )

            
            
        } catch (error) {

            if( axios.isAxiosError(error) ){
                const err = error.response!.data as { message:string};
                dispatch( setOrderErrorAction(err.message) );
            }
            
            dispatch( setOrderErrorAction('Unhandled error') );

        }
    }
}

//||||||||||||||----------ACTIONS FUNCTIONS---------------||||||||||||||||||
export const {  updateQuantity, removeOfCart, setOrderError, setEmptyCart, setOrderMessage  } = cartSlices.actions;
export default cartSlices.reducer;

