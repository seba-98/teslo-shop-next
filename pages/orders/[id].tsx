import React, { FC, useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import router, { useRouter } from 'next/router';
import { ShopLayout } from '../../components/layouts';
import { getOrderById } from '../../api-rest/ssg-ssr-request-functions/getData';
import { IOrder } from '../../interfaces/server_interfaces/orders';
import { getSession } from 'next-auth/react';
import { FullScreenLoading } from '../../components/ui';
import { CreditCardOffOutlined, ErrorOutline } from '@mui/icons-material';
import { Typography, Chip, Grid, Card, Divider, Box, CardContent, CircularProgress } from '@mui/material';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { UserData } from '../../components/cart/UserData';
import { OrderCreatedCartList } from '../../components/orders/OrderCreatedCartList';
import { OrderCreatedSumary } from '../../components/orders/OrderCreatedSummary';
import axios from 'axios';
import tesloApiBase from '../../axios-tesloApi/tesloApi';
import { OrderResponseBody } from '../../interfaces/client_interfaces';


interface Props{
  order: IOrder
}

const OrderPage:FC<Props> = ({order}) => {

  const Router = useRouter();
  const {id} = Router.query as {id:string};
  const [loading, setLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [isPayingMessage, setIsPayingMessage] = useState('Generando pago...');

  useEffect(() => {
    if(order) setLoading(false)
  }, [order])


  const paypalPay=async(details:OrderResponseBody)=>{

    setIsPaying(true);
    
    if(details.status !== 'COMPLETED') return alert('No hay pago en paypal')
    try {
      await tesloApiBase.post('/orders/pay',{
        transactionId:details.id,
        orderId: order!._id
      })
      setIsPaying(false);
      router.reload();
    } catch (error) {
      if(axios.isAxiosError(error)){
         console.log('erroraxios', error);
      }
      else{
        console.log( error)
      };
        setIsPaying(false);
        setIsPayingMessage('Error al realizar el pago, intentelo nuevamente');
        setTimeout(()=>{ setIsPayingMessage('') },5000)
      }
    }
  

  return (
  <ShopLayout title={`Resumen de la orden N°: ${id}`} pageDescription='Detalles y especificaciones de la orden'>

    {
      loading ?
      <FullScreenLoading />
      :
      <>
        <Typography variant='h1' component='h1'>         
            { ` Order id:${id}`}
        </Typography>

        {order && order.isPaid ?
          <Chip 
            sx={{my:2}}
            label='Orden ya fue pagada'
            variant='outlined'
            color='success'
            icon={<CreditCardOffOutlined />}
            />
            :
          <Chip 
            sx={{my:2}}
            label='Orden pendiente de pago'
            variant='outlined'
            color='error'
            icon={<ErrorOutline />}
          />}

        <Grid container spacing={3} className='fadeIn'>

          <Grid item xs={ 12 } sm={ 7 }>
            <OrderCreatedCartList items={order.orderItems} />
          </Grid>

          <Grid item xs={ 12 } sm={ 5 }>
            <Card color='secondary'>
              <CardContent>
                <Typography variant='h2' component='h2'>Orden</Typography>
                {
                  order &&
                  <UserData editable={false} userData={{
                    ...order.allPaymentData, 
                    updatedAt:order.updatedAt!, 
                    createdAt:order.createdAt!, 
                  } }/> 
                }
                <Divider sx={{my:1}} />
                {
                  order &&                           
                  <OrderCreatedSumary  data={order} />  
                }

                  <Box>
                      <Box sx={{display:!order!.isPaid && !isPaying ? 'flex' : 'none', flex:1, flexDirection:'column'}}>
                        <PayPalButtons
                          createOrder={(data, actions) => {
                            return actions.order.create({
                              purchase_units: [{amount: {value: `${order!.allPaymentData.total}`}}]
                            });
                          }}
                          onApprove={(data, actions) => {
                            console.log(data);
                            return actions.order!.capture().then((details) => paypalPay(details));
                          }}
                        />
                        <Chip
                          variant='outlined'
                          color='error'
                          icon={<ErrorOutline />}
                          className='fadeIn'
                          label="Pendiente de pago"
                        />
                      </Box>

                        <Chip
                        variant='outlined'
                        sx={{ color: 'green', display:order!.isPaid && !isPaying ? ' flex' : 'none' }}
                        icon={<CreditCardOffOutlined />}
                        className='fadeIn'
                        label="Orden pagada"
                        />
                        <>
                          <Box
                          display='flex'
                          justifyContent='center'
                          sx={{display:!order!.isPaid && isPaying ? ' flex' : 'none'}}
                          className='fadeIn'
                          >
                            <Typography variant='h3' component='h3'>{isPayingMessage}</Typography>
                            <CircularProgress />
                          </Box>
                        </>
                  </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </>
    }
  </ShopLayout>
  )
}

export default OrderPage


export const getServerSideProps: GetServerSideProps = async (ctx) => {

  const {params, req} = ctx
  const {id}=params as {id:string};


  const session:any =await getSession({req});
  
  if(!session) return{              //VALIDAMOS primero la sesión para redirigir al login en caso de que no exista dicha sesión
    redirect:{
      destination:`/auth/login?p=/orders/${id}`,
      permanent:false
    }
  }
    
    
  const order = await getOrderById( id );  //hay sesion traemos la order

  if( !order || session.user._id !== order.user ){         //comprobamos que el id de la sesion sea igual al id del usuario de la orden
    return {
      redirect:{
        destination:'/',
        permanent:false
      }
    }
  }
  
  return {                                     
      props:{
        order
        }
    }
}