import { Box, Grid } from '@mui/material'
import React, { FC } from 'react'
import { price } from '../../utils'
import { IOrder } from '../../interfaces/server_interfaces/orders';
import OrderSumaryGrid from '../cart/OrderSumaryGrid';
import { IGetAdminOrder } from '../../interfaces/client_interfaces';

interface Props{
    data: IOrder | IGetAdminOrder
}


export const OrderCreatedSumary:FC<Props> = ({data}) => {

    const { allPaymentData } = data;
    


    const Data=[
        {
            title:'Nro. Productos',
            value:`${allPaymentData.quantityProducts} productos`,
            darked:false,
        },
        {
            title:'SubTotal',
            value:price(allPaymentData.subTotal),
            darked:false,
        },
        {
            title: `Impuestos (${process.env.NEXT_PUBLIC_TAX_RATE}%)` ,
            value:price(allPaymentData.taxes),
            darked:false,
        },
        {
            title:'Total',
            value:price(allPaymentData.total),
            darked:true,
        },
    ]


  return (
    <Grid container spacing={2} sx={{my:2}} >
        {                                                      
            Data.map(({title, value, darked })=> <OrderSumaryGrid key={title} title={title} value={value} darked={darked}/> )
        }
    </Grid>
  )
}
