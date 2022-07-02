import { Typography, Grid, Card, CardContent, Divider, Box, Button, Chip } from '@mui/material'
import React, { FC } from 'react'
import { CartList, OrderSumary } from '../cart'
import { UserData } from '../cart/UserData'
import { ShopLayout } from './ShopLayout'
import { IBuysLayoutType } from '../../interfaces/client_interfaces/BuysLayout';
import { CreditCardOffOutlined } from '@mui/icons-material'

interface Props{
  title:string,
  pageDescription:string,
  type:IBuysLayoutType,
}

const  BuysLayout:FC<Props> = ({title, pageDescription, type}) => {


  const editable = (type ==='in-cart' || type === 'checkout') ? true : false;

  return (
    <ShopLayout title={title} pageDescription={pageDescription} >
        <>
            <Typography variant='h1' component='h1'>{title}</Typography>

            {
              type === 'orders' &&
              <Chip 
                sx={{my:2}}
                label='Orden ya fue pagada'
                variant='outlined'
                color='success'
                icon={<CreditCardOffOutlined />}
             />
            }


            <Grid container spacing={3}>

                {/*LISTA DE ARTICULOS (IZQUIERDA) */}
                <Grid item xs={ 12 } sm={ 7 }>
                    <CartList editable={editable} />
                </Grid>


                {/*ORDEN (DERECHA) */}
                <Grid item xs={ 12 } sm={ 5 }>   
                    <Card color='secondary'>
                        <CardContent>
                            <Typography variant='h2' component='h2'>Orden</Typography>

                  {/* UserData y OrderSumary SOLO SERAN EDITABLES EN EL CARRITO O EN EL CHECKOUT   */}

                            <Divider sx={{my:1}} />
                            <UserData editable={ editable }/>     {/*DATOS COMPRA DE USUARIO */}

                            <Divider sx={{my:1}} />
                            <OrderSumary editable={ editable }/>  {/* RESUMEN DATOS COMPRA PRODUCTOS */}

                            {
                              type === 'in-cart' &&

                              <Box sx={{mt:2}}>
                                  <Button color='secondary' sx={{
                                    '&:hover':{
                                      backgroundColor:'#345ac2'
                                    }
                                  }} fullWidth>
                                      Comprar
                                  </Button>
                              </Box>
                            }

                            {
                              type === 'checkout' &&

                              <Box sx={{mt:2}}>
                                  <Button color='secondary' sx={{
                                    '&:hover':{
                                     backgroundColor:'#345ac2' 
                                    }
                                  }} fullWidth>
                                      Confirmar compra
                                  </Button>
                              </Box>
                            }

                          
                        </CardContent>
                    </Card>
                </Grid>

            </Grid>
        </>
    </ShopLayout>
  )
}

export default BuysLayout