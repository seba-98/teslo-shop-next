import { Typography, Grid, Card, CardContent, Divider, Box, Button } from '@mui/material';
import { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CartList, OrderSumary } from '../../components/cart';
import { UserData } from '../../components/cart/UserData';
import { ShopLayout } from '../../components/layouts';
import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks';
import { IAllPaymentData } from '../../interfaces/shared_interfaces';





const CartPage:NextPage = () => {

  const {loaded, cart}= useAppSelector(state=>state.cart);

  const router = useRouter();
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

    useEffect(() => {
      if(loaded && cart.length === 0){
        router.push('/cart/empty');
      } 
    }, [loaded, router, cart])
  


   return(

    <ShopLayout title={!loaded ? 'Cargando carrito...' : 'Carrito' } pageDescription='Carrito de compras'>

      <>
        {
         loaded && cart.length === 0 ?
         <h1>Cargando...</h1> 
         :
         <>
          <Typography variant='h1' component='h1'>
            Carrito de compras
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={ 12 } sm={ 7 }>
              <CartList editable={true} />
            </Grid>

            <Grid item xs={ 12 } sm={ 5 }>   
              <Card color='secondary'>
                  <CardContent>
                    <Typography variant='h2' component='h2'>Carrito</Typography>
                    <Divider sx={{my:1}} />
                    { 
                      existData() && isLoggedIn ?  //Si existe data de usuario y esta logeado
                      <UserData editable userData={
                        {
                          ...paymentData,
                          updatedAt: "",
                          createdAt: "",
                        }} />
                        
                        :

                        !existData() && isLoggedIn ?   //Si NO existe data de usuario y esta logeado
                        <Typography>{'Faltan datos de usuario para realizar la compra'}</Typography>
                        :
                        <Typography>{'Inicie sesión para llenar los datos'}</Typography>  //SI NO ESTA LOGEADO
                      }
                    <Divider sx={{my:1}} />

                    <OrderSumary editable={ false } data={{quantityProducts,  subTotal, taxes, total}} />

                    <Box sx={{ mt: 2 }}>
                      <Button
                        color='secondary'
                        sx={{ '&:hover': { backgroundColor: '#345ac2' } }}
                        fullWidth
                        href='/checkout/adress'
                        >
                        {!isLoggedIn ? 'Inicie sesión' : 'Comprobar datos'}
                      </Button>
                    </Box>

                </CardContent>
              </Card>
            </Grid>
          </Grid>
         </>
        }
      </>
    </ShopLayout>
    );
    
  }
export default CartPage




export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { cart } = ctx.req.cookies;


  if(!cart || cart && JSON.parse(cart).length < 1 ){
    return{
      redirect:{
        destination:'/cart/empty',
        permanent:false
      }
    }
  }

  return {
    props: {
    }
  }
}