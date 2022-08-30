import { ErrorOutline } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Chip, Divider, Grid, Typography } from '@mui/material';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { CartList, OrderSumary } from '../../components/cart';
import { UserData } from '../../components/cart/UserData';
import { ShopLayout } from '../../components/layouts';
import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks';
import { IAllPaymentData } from '../../interfaces/shared_interfaces';
import { createOrderAction, loadPaymentData } from '../../redux/slices';
import { dataUserFromCookies } from '../../utils';


const SumaryPage:NextPage = () => {
 
  const {loaded }= useAppSelector(state=>state.cart);
  const router = useRouter();

  const [isPosting, setIsPosting] = useState(false);
  const { orderError, orderMessage } = useAppSelector(state=>state.cart);
  const dispatch = useAppDispatch();
  const paymentData:IAllPaymentData = useAppSelector(state=>state.payment);
  const { isLoggedIn } = useAppSelector(state=>state.auth);

  const {
    name,
    lastName,
    adress,
    country,
    postalCode,
    city,
    phoneNumber,
    //----datos para el order summary en cart y en checkout-----
    quantityProducts, 
    subTotal,
    taxes,
    total
  }=paymentData; //!!NO SIRVE EN UNA ORDER, EN TAL CASO UTILIZAR orderData

 

  //======================validación para saber si existe la data necesaria del usuario para el pago============================
  const existData=():boolean=>{      
    if(!paymentData) return false;
    
    const arr= [name, lastName, adress, country, postalCode, city, phoneNumber];
    return arr.some(a=> !a ? false : true)
  }


   //==================FUNCION PARA CREAR LA ORDEN (REGISTRAR LA COMPRA EN LA BD)================================
   const onCreateOrder=()=>{
    setIsPosting(true);
    dispatch( createOrderAction() )
  }

  //==================EVALUA SI CUANDO SE GENERA UNA ORDEN, CAMBIA EL ESTADO Y REDIRECCIONA A LA ORDERPAGE=============================
  useEffect(() => {    
    if(orderMessage === '') return
    router.replace(`/orders/${orderMessage}`);
  }, [orderMessage])

  useEffect(() => {   
    dataUserFromCookies().then(d=>{
      if(d){
        dispatch( loadPaymentData(d) )
      }
    });
  }, [])


  return(

    <ShopLayout title={!loaded ? 'Cargando resumen...' : 'Resumen de la orden' } pageDescription='Resumen de la orden de compras'>

      <>
        <Typography variant='h1' component='h1'>             
          Resumen de la órden
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={ 12 } sm={ 7 }>
            <CartList editable={false} />
          </Grid>
        
          <Grid item xs={ 12 } sm={ 5 }>   
            <Card color='secondary'>
              <CardContent>
                <Typography variant='h2' component='h2'>Resumen de la orden</Typography>

                <Divider sx={{my:1}} />

                {
                existData() && isLoggedIn ?  //Si existe data de usuario y esta logeado
                  <UserData editable userData={ 
                    {...paymentData,
                      updatedAt:"", 
                      createdAt:"", 
                    } }/> 
                  :
                  !existData() && isLoggedIn ?   //Si NO existe data de usuario y esta logeado
                  <Typography>{'Faltan datos de usuario para realizar la compra'}</Typography> 
                  :
                  <Typography>{'Inicie sesión para llenar los datos' }</Typography>  //SI NO ESTA LOGEADO
                }

                <Divider sx={{my:1}} />  

                <OrderSumary editable={ true } data={{quantityProducts,  subTotal, taxes, total}} />

                <Box sx={{mt:2}}>
                  <Button 
                    color='secondary' 
                    sx={{'&:hover':{backgroundColor:'#345ac2'}}}
                    fullWidth
                    onClick={ onCreateOrder }
                    disabled={ isPosting }
                  >
                    {existData() ? 'Confirmar compra' : 'Volver a la planilla' }
                  </Button>

                  {orderError &&
                    <Chip 
                    variant='outlined'
                    color='error'
                    icon={ <ErrorOutline /> }
                    className='fadeIn'
                    label={orderError}
                    />
                  }
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </>
         
    </ShopLayout>
  );


}

export default SumaryPage