import { Box, Grid, Link } from '@mui/material'
import React, { FC } from 'react'
import { price } from '../../utils'
import OrderSumaryGrid from './OrderSumaryGrid'
import NextLink from 'next/link';
import { useAppSelector } from '../../hooks/useReduxHooks';
import { IOrder } from '../../interfaces/server_interfaces/orders';

interface Props{
    editable:boolean,
    data:{
        quantityProducts:number, 
        subTotal:number,
        taxes:number,
        total:number,
    }

}


export const OrderSumary:FC<Props> = ({editable=true, data}) => {

    const {
        quantityProducts, 
        subTotal,
        taxes,
        total
      } = data;
    


    const Data=[
        {
            title:'Nro. Productos',
            value:`${quantityProducts} productos`,
            darked:false,
        },
        {
            title:'SubTotal',
            value:price(subTotal),
            darked:false,
        },
        {
            title: `Impuestos (${process.env.NEXT_PUBLIC_TAX_RATE}%)` ,
            value:price(taxes),
            darked:false,
        },
        {
            title:'Total',
            value:price(total),
            darked:true,
        },
    ]


  return (
    <Grid container spacing={2} sx={{my:2}} >

        {
            editable &&
            <Box display='flex' justifyContent='end' sx={{width:'100%'}}>
                <NextLink href='/checkout/adress' passHref>
                    <Link underline='always'>Editar</Link>
                </NextLink>
            </Box>
        }
        {                                                      
            Data.map(({title, value, darked })=> <OrderSumaryGrid key={title} title={title} value={value} darked={darked}/> )
        }
    </Grid>
  )
}
