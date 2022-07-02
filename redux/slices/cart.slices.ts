import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { ICartProduct } from '../../interfaces/client_interfaces/';
import { cartFromCookies } from '../../utils';
import { AppThunk } from '../store';

interface initialState{
    cart:ICartProduct[],
    loaded:boolean,
    empty:boolean,
}
 
let initialState:initialState= {cart:[], loaded:false, empty:true};



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
        }
    },

    //async thunk process reducers-------------------
    extraReducers(builder) {  
        builder.addCase(getStateFromCookies.pending,(state, action)=>{
            state.cart=state.cart;
            state.loaded=false;
            state.empty=true;
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
//||||||||||||||----------ACTIONS FUNCTIONS---------------||||||||||||||||||


export const {  updateQuantity, removeOfCart  } = cartSlices.actions;
export default cartSlices.reducer;