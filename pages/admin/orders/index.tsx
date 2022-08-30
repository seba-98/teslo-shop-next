import { CategoryOutlined, ErrorOutlineOutlined } from '@mui/icons-material';
import { Grid, Chip, Typography, Button } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { NextPage } from 'next';
import React, { useEffect, useState } from 'react'
import useSWR from 'swr';
import { AdminLayout } from '../../../components/layouts';
import { FullScreenLoading } from '../../../components/ui';
import { IGetAdminOrder } from '../../../interfaces/client_interfaces';
import { price } from '../../../utils';

interface IData{
    orders:IGetAdminOrder[]
}


const OrdersPage:NextPage= () => {
    
    const { data, error } = useSWR<IData>('/api/admin/orders');
    const [orders, setOrders] = useState<IGetAdminOrder[]>([]);


    useEffect(() => {
        if(data) setOrders(data!.orders);
      }, [data])
      
      if( !data && !error ){
          return <FullScreenLoading  />
      }
      if( error ){
          console.log(error);
          return <Typography variant='h2' component='h2'>Error al cargar</Typography>
      }



    
    const rows= orders.map((order, idx)=>(
        {
            id          : idx + 1,
            orderId     : order._id,
            name        : order.allPaymentData.name+' '+order.allPaymentData.lastName,
            email       : order.user.email,
            total       : price(order.allPaymentData.total),
            phoneNumber : order.allPaymentData.phoneNumber,
            createdAt   : order.createdAt,
            isPaid      : order.isPaid,
            noProducts  : order.allPaymentData.quantityProducts,
        }
    ))


    
    const columns: GridColDef[] = [
        {field:'id',headerName:'Orden ID', width:100},
        {field:'email',headerName:'Email', width:300},
        {field:'name',headerName:'Nombre completo', width:300},
        {field:'total',headerName:'Monto total', width:200},
        {field:'phoneNumber', headerName:'Teléfono', width:300},
        {field:'createdAt', headerName:'Fecha de creación', width:300},
        {
            field:'isPaid',headerName:'Estatus',
            renderCell:({row}:GridValueGetterParams)=>{
                return row.isPaid ? 
                <Chip variant='outlined'color='success' label='Pagada' />
                : 
                <Chip variant='outlined'color='error' label='Pendiente de pago' />
            }
        },
        {field:'noProducts',headerName:'N° Productos', align:'center'},
        {
            field:'check',headerName:'Ver orden',
            renderCell:({row}:GridValueGetterParams)=>{
                return (
                    <Button href={`/admin/orders/${ row.orderId }`} >
                        Ver orden
                    </Button>
                )
            }
        },
    ]


  return (
    <AdminLayout title='Ordenes' subtitle='Mantenimiento' icon={<CategoryOutlined />}>

          <Grid container>
              <Grid item sx={{ height: 650, width: '100%' }}>
                  <DataGrid
                      rows={rows}
                      columns={columns}
                      pageSize={10}
                      rowsPerPageOptions={[10]}
                  />
              </Grid>
          </Grid>

    </AdminLayout>
  )
}

export default OrdersPage;