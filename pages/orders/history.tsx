import { Chip, Grid, Link, Typography } from '@mui/material';
import React from 'react';
import { ShopLayout } from '../../components/layouts';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import NextLink from 'next/link';

const HistoryPage = () => {


    const columns:GridColDef[] = [
        {field: 'id', headerName:'ID', width:100},
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
                        <NextLink href={`/orders/${params.row.orderPage}`} passHref>
                            <Link variant='body1' underline='always'>
                                Ver orden
                            </Link>
                        </NextLink>
                    )
                }
            },

    ]

    const rows = [
        { id:1, fullName:'seba belettieri', paid:false, orderPage:1},
        { id:2, fullName:'juan belettieri', paid:true, orderPage:2},
        { id:4, fullName:'jose belettieri', paid:false, orderPage:3},
        { id:5, fullName:'jose belettieri', paid:true, orderPage:4},
        { id:6, fullName:'jose belettieri', paid:false, orderPage:5},
        { id:7, fullName:'jose belettieri', paid:false, orderPage: 6},
        { id:8, fullName:'jose belettieri', paid:true, orderPage:7 },
        { id:9, fullName:'jose belettieri', paid:false, orderPage:8},
        { id:10, fullName:'jose belettieri', paid:false, orderPage:9},
        { id:11, fullName:'jose belettieri', paid:true, orderPage:10},
        { id:12, fullName:'jose belettieri', paid:false, orderPage:11},
        { id:13, fullName:'jose belettieri', paid:false, orderPage:12},
    ]

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