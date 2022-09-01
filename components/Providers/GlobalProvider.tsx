import { useSession } from 'next-auth/react';
import React, { FC, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks';
// import { IFormLogin } from '../../interfaces/client_interfaces';
import {  getStateFromCookies, actionLoadPaymentData, authLogIn, actionLogOut } from '../../redux/slices';

// import Cookies from 'js-cookie';
// import { IUserLog } from '../../interfaces/client_interfaces';
// import { tesloApi } from '../../axios-tesloApi';
import { IUser } from '../../interfaces/server_interfaces/user';
import Cookies from 'js-cookie';

interface Props{
    children: JSX.Element
}


/* INFORMACIÓN:
  La función de este provider personalizado es ejecutar las acciones de inicio;
    -obtener carrito
    -comprobar JWT
    -cargar data de pago

   Se creo este componente para no poner este boilerplate en el layout principal 
*/


const GlobalProvider:FC<Props> = ({children}) => {


    const dispatch = useAppDispatch();
    const { cart, loaded } = useAppSelector(state=>state.cart);
    // const { user:inStateUser } = useAppSelector(state=>state.auth);

    const {data, status} = useSession();


    


    // const checkTokenJWT=async()=>{
    //     try {

    //         const tokenFromCookie = Cookies.get('token') ? Cookies.get('token')! : ''; 
    //         if(!tokenFromCookie || tokenFromCookie === '') return;


    //         const {data} = await tesloApi.get<IUserLog>('/user/validate-token');
    //         const {token, user}=data;
    //         Cookies.set('token', token);

    //        if(inStateUser && user._id === inStateUser._id ) return;

    //        if(!inStateUser || user._id !== inStateUser._id) { //despacha el login solo si no hay usuario o si el usuario no coincide con el token
    //            dispatch( authLogIn( user ) );
    //        }
    //     } catch (error) {
    //         console.log(error);
    //         Cookies.remove('token');
    //         dispatch( actionLogOut() );
    //     }
    // }    

    // useEffect(() => {
    //     checkTokenJWT()
    // }, [checkTokenJWT])


    

    useEffect(() => {
        
        if(status === 'authenticated' && data.user){
            dispatch( authLogIn(data!.user as IUser) )
        }
        if(status === 'authenticated' && !data.user)
        dispatch( actionLogOut() ) //Por las dudas limpiamos la sesión, la autenticación con provider no debería fallar
                                     // pero en caso de que lo haga genera
        
    }, [data, status]) 

    useEffect(() => {
        dispatch( getStateFromCookies() );
    }, [dispatch])

    useEffect(() => {
        dispatch( actionLoadPaymentData() );
    }, [cart, dispatch, loaded])


  return (
    <>
        {
            children
        }
    </>
  )
}

export default GlobalProvider