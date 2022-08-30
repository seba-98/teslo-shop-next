import { CreditCardOffOutlined, ErrorOutline } from '@mui/icons-material';
import { Typography, Chip, Grid, Card, CardContent, Divider, Box, CircularProgress } from '@mui/material';
import { GetServerSideProps } from 'next'
import React, { FC, useState, useEffect } from 'react'
import { getOrderById } from '../../../api-rest/ssg-ssr-request-functions/getData';
import { UserData } from '../../../components/cart/UserData';
import { AdminLayout } from '../../../components/layouts/AdminLayout';
import { OrderCreatedCartList } from '../../../components/orders/OrderCreatedCartList';
import { OrderCreatedSumary } from '../../../components/orders/OrderCreatedSummary';
import { FullScreenLoading } from '../../../components/ui';
import { IGetAdminOrder } from '../../../interfaces/client_interfaces';

interface Props{
    order:IGetAdminOrder
}

const OrderId:FC<Props> = ({order}) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(order) setLoading(false)
      }, [order])

    
  return (

    <AdminLayout title={`Orden Id: ${order._id}`} subtitle='Detalles y especificaciones de la orden'>

    {
      loading ?
      <FullScreenLoading />
      :
      <Grid container sx={{padding:'0 40px 0px 40px'}}>

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
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    }
  </AdminLayout>
  )
}
   


export default OrderId;


export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const { id } =params as {id:string};

    const order = await getOrderById(id);
    return {
        props: {
            order
        }
    }
}


