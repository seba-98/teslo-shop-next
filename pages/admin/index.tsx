import { AccessTimeOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CategoryOutlined, CreditCardOffOutlined, CreditCardOutlined, DashboardOutlined, GroupOutlined, ProductionQuantityLimitsOutlined } from '@mui/icons-material';
import { Grid, Typography } from '@mui/material';
import { NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr';
import { SummatyTile } from '../../components/admin';
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { FullScreenLoading } from '../../components/ui';


export interface IData {
    numberOfOrders:          number;
    paidOrders:              number;
    notPaidOrders:           number;
    numberOfClients:         number;
    numberOfProducts:        number;
    productsWithNoInventory: number;
    lowInventory:            number;
}



const DashboardPage:NextPage = () => {
    
    const { data, error }=useSWR<IData>('/api/admin/dashboard',{
        refreshInterval:30 * 1000
    });
    const [timer, setTimer] = useState(30);


    useEffect(() => {

        const interval = setInterval(()=>{

           setTimer(timer=> timer > 0 ? timer-1 : 30 );

        },1000)

        interval;

        return ()=>{
            clearInterval(interval);
        }
    }, [])
    

    if(!data && !error) return  <FullScreenLoading quantity={4} />
    
    if( error ) {
        console.log(error);
        
        return  <Typography component='h2' variant='h2'> Error al cargar  </Typography>
    }


    const {
        numberOfOrders,
        paidOrders,
        notPaidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory
    }=data!;


    
    return(
          <AdminLayout title='Admin panel' subtitle='Estadísticas generales' icon={<DashboardOutlined />}>
              
            <Grid container spacing={2} sx={{display:'flex', justifyContent:'center'}}>
                <SummatyTile  
                    icon={<CategoryOutlined color='warning' sx={{ fontSize: '40px' }} />}
                    title={ numberOfProducts }
                    subtitle='Productos totales'
                /> 
                <SummatyTile  
                    icon={<CreditCardOutlined color='secondary' sx={{ fontSize: '40px' }} />}
                    title={ numberOfOrders }
                    subtitle='Ordenes totales'
                /> 
                <SummatyTile  
                    icon={<AttachMoneyOutlined color='success' sx={{ fontSize: '40px' }} />}
                    title={ paidOrders }
                    subtitle='Ordenes pagadas'
                /> 
                <SummatyTile  
                    icon={<CreditCardOffOutlined color='error' sx={{ fontSize: '40px' }} />}
                    title={ notPaidOrders }
                    subtitle='Ordenes pendientes'
                /> 
                <SummatyTile  
                    icon={<GroupOutlined color='secondary' sx={{ fontSize: '40px' }} />}
                    title={ numberOfClients }
                    subtitle='Clientes'
                /> 
            
                <SummatyTile  
                    icon={<CancelPresentationOutlined color='error' sx={{ fontSize: '40px' }} />}
                    title={ productsWithNoInventory }
                    subtitle='Productos sin stock'
                /> 
                <SummatyTile  
                    icon={<ProductionQuantityLimitsOutlined color='warning' sx={{ fontSize: '40px' }} />}
                    title={ lowInventory }
                    subtitle='Productos bajo inventario'
                /> 
                <SummatyTile  
                    icon={<AccessTimeOutlined color='secondary' sx={{ fontSize: '40px' }} />}
                    title={timer}
                    subtitle='Actualización en:'
                /> 
    
            </Grid>
        </AdminLayout>
    )

}

export default DashboardPage;