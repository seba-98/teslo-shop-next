import React from 'react';
import { GetServerSideProps, NextPage } from 'next'
import { Chip, Grid, Link, Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import NextLink from 'next/link';
import { getOrdersByUser } from '../../api-rest/ssg-ssr-request-functions/getData';
import { getSession } from 'next-auth/react';
import { IGetOrder } from '../../interfaces/server_interfaces/orders';

interface Props{
    orders:IGetOrder[]
}

const HistoryPage:NextPage<Props> = ({orders}) => {

    

    const columns:GridColDef[] = [
        {field: 'id', headerName:'ID', width:300},
        {field: 'fullName', headerName:'Nombre completo', width:300},
        {
            field: 'paid', 
            headerName:'Pagada', 
            width:300,
            description:'Informa si la orden fue o no pagada',
            renderCell: (params:GridValueGetterParams)=>{
                return (
                    params.row.paid 
                    ? <Chip  label='Orden pagada' variant='outlined' color='success' />
                    : <Chip  label='Orden impaga' variant='outlined' color='error' />
                    )
                }
            },
            {
                field: 'orderPage', 
                headerName:'Enlace', 
                width:300,
                description:'Ir a la pagina de la orden',
                sortable:false,
                renderCell:(params:GridValueGetterParams)=>{
                    return(
                        <NextLink href={`/orders/${params.row.orderId}`} passHref>
                            <Link variant='body1' underline='always'>
                                Ver orden
                            </Link>
                        </NextLink>
                    )
                }
            },

    ]

    const rows = orders.map((order, idx)=>({
        id:idx+1,
        orderId:order._id,
        fullName:order.allPaymentData!.name,
        paid:order.isPaid,
        orderPage:1
    }))

  return (
    <ShopLayout title={'Historial de ordenes'} pageDescription={'Historial de ordenes del cliente'}>
        <>
        <Typography>Historial de ordenes</Typography>

        <Grid container>
            <Grid item xs={12} sx={{ height:650, width: '100%' }}> 
                <DataGrid 
                    rows={rows}
                    columns={columns}
                    pageSize={ 10 }
                    rowsPerPageOptions={ [10] }
                 />
            </Grid>
        </Grid>
        </>
    </ShopLayout>
  )
}

export default HistoryPage




export const getServerSideProps: GetServerSideProps = async ({req}) => {
    
    const session:any = await getSession({req})
    const userOrders = await getOrdersByUser(session.user._id);

    if( !session ){
        return {
            redirect:{
                destination:'/auth/login?q=/orders/history',
                permanent:false
            }
        }
    }
    return {
        props: {
            orders:userOrders
        }
    }
}