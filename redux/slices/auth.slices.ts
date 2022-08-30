import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../../interfaces/server_interfaces/user';
import { IFormLogin, IFormRegister, IUserLog } from '../../interfaces/client_interfaces/authInterfaces';
import { tesloApi } from '../../axios-tesloApi';
import { AppThunk } from '../store';
import axios from 'axios';
import Cookies from 'js-cookie';
import { signIn, signOut } from 'next-auth/react';

interface IInitialState{ isLoggedIn:boolean; user?: IUser; error?:string[] | string}

const initialState:IInitialState={ isLoggedIn:false, user:undefined, error:undefined };



const authSlices= createSlice({

    name:'auth',
    initialState,
    reducers:{
        authLogIn(state, action:PayloadAction<IUser>){
            state.isLoggedIn = true;
            state.user = action.payload;
        },
        authLogOut(state, action:PayloadAction){
            state.isLoggedIn = false;
            state.user = undefined;
        },
        authSetLocation(state, action:PayloadAction<string>){
            state.user!.location = action.payload;
        },
        authError(state, action:PayloadAction<string[] | string | undefined>){

            state.isLoggedIn = false;
            state.user = undefined;
            state.error = action.payload;
        },

    },
});

//=====================ACCION DE LOGIN SIN NEXTAUTH ||DEPRECATED IN PROYECT||=====================================================
// export const actionLogIn=(FormData:IFormLogin):AppThunk=>{

    //GENERAMOS NUESTRO PROPIO TOKEN CON JWT
    
    // return async(dispatch, getState)=>{
    //     try {
    //         const { data } = await tesloApi.post<IUserLog>('/user/login', FormData);
            
    //         Cookies.set('token', data.token);
    //         dispatch( authLogIn(data.user) );
            
    //     } catch (error) {
            
    //         if(axios.isAxiosError(error)){
    //             const err=error.response?.data as {message:string}
    //             dispatch(authError(err.message))
                
    //             return setTimeout(()=>{ dispatch(authError(undefined)) }, 10000)
    //         }
    //         dispatch( authError('No se pudo crear el usuario, intentelo mas tarde') );
    //         return setTimeout(()=>{ dispatch( authError(undefined) ) }, 10000)
    //     }
    // }
// }
//=====================FIN ACCION DE LOGIN SIN NEXTAUTH=====================================================




export const actionRegister=(FormData:IFormRegister, destination:string):AppThunk=>{
    return async(dispatch)=>{

        const { email, password } = FormData

        try {
            const { data } = await tesloApi.post<IUserLog>('/user/register', FormData);

            dispatch( authLogIn(data.user) );

            await signIn('credentials', {
                email,
                password,
                callbackUrl:destination
            })

            // Cookies.set('token', data.token);  old method with custom jwt

        } catch (error) {
            
            if(axios.isAxiosError(error)){
                const err=error.response?.data as {errors:string[]}
                dispatch(authError(err.errors))
                
                return setTimeout(()=>{ dispatch( authError(undefined) ) }, 10000)
            }
            
            dispatch( authError('No se pudo crear el usuario, intentelo mas tarde') );
            return setTimeout(()=>{ dispatch( authError(undefined) ) }, 10000)
        }
    }
}

export const actionLogOut=():AppThunk=>{
    return async(dispatch, getState)=>{
        Cookies.remove('postalCode');
        Cookies.remove('country');
        Cookies.remove('city');
        Cookies.remove('name');
        Cookies.remove('phoneNumber');
        Cookies.remove('secondAdress');
        Cookies.remove('adress');
        Cookies.remove('lastName');
        Cookies.remove('cart');
        
        signOut();
        dispatch( authLogOut() );
    }
}

export const actionSetError=(errors: string[] | string | undefined):AppThunk=>{
    return async(dispatch, getState)=>{
       dispatch( authError(errors) );
       
       setTimeout(()=>{
           dispatch( authError(undefined) );
       },4000)
      
    }
}


export const {authLogIn, authError, authLogOut, authSetLocation} = authSlices.actions;

export default authSlices.reducer;

