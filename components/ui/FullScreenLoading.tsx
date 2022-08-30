import { Box, Divider, Grid, Typography } from '@mui/material';
import React, { FC } from 'react'
import { ShopLayout } from '../layouts/ShopLayout';
import shimmer from '../../styles/shimer.module.css'


interface Props{
    quantity?:number
    // width:{
    //     xs:number;
    //     sm:number;
    //     lg:number;
    // }
}

export const FullScreenLoading:FC<Props> = ({quantity=16}) => {

    const items=[...Array(quantity)];

  return (
    <ShopLayout title='Loading...' pageDescription='Page loading'>
        <Grid  
        sx={{display:'flex', flexDirection:'row', justifyContent: quantity > 1? 'space-around':'center' , alignItems:'center'}}
        container
        >
            {
                items.map((i, idx)=>(

                    <Grid className={shimmer.shimmer} sx={{ maxWidth:'400px', minWidth:'350px', my:'30px'}} item key={idx}>
                        <div className={shimmer.div1}></div>
                        <div className={shimmer.div2}></div>
                    </Grid>

                ))
            }
        </Grid>
    </ShopLayout>
  )
}
