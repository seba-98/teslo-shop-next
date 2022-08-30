import { Grid, Card, CardContent, Typography, CardHeader, Box } from '@mui/material'
import React, { FC } from 'react'
import tesloApiBase from '../../axios-tesloApi/tesloApi';

interface Props{
    icon:JSX.Element;
    title:string | number | undefined;
    subtitle:string | undefined
}


export const SummatyTile:FC<Props> = ({icon, title, subtitle}) => {
  return (
    <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ display: 'flex', justifyContent:'center', alignItems: 'center' }} >
            <CardContent sx={{ 
                width: '100%',
                display: 'flex',
                justifyContent:'center',
                alignItems: 'center',
                flexDirection:'column'
            }}>
                <Typography variant='caption' >{ subtitle }</Typography>
                <Typography variant='h3' display='flex' alignItems='center'>{icon} { title } </Typography>
            </CardContent>
        </Card>
    </Grid>
  )
}
