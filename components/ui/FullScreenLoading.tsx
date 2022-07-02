import { Box, Divider, Grid, Typography } from '@mui/material';
import React from 'react'
import { ShopLayout } from '../layouts/ShopLayout';
import shimmer from '../../styles/shimer.module.css'

export const FullScreenLoading = () => {

    const items=[...Array(16)];

  return (
    <ShopLayout title='Loading...' pageDescription='Page loading'>
        <Grid  
        spacing={4}
        container
        >
            {
                items.map((i, idx)=>(

                    <Grid className={shimmer.shimmer} xs={6} sm={4} item key={idx}>
                        <div className={shimmer.div1}></div>
                        <div className={shimmer.div2}></div>
                    </Grid>

                ))
            }
        </Grid>
    </ShopLayout>
  )
}
