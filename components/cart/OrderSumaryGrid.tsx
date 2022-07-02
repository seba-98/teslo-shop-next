import { Grid, Typography } from '@mui/material'
import React, { FC } from 'react'

interface Props{
    title:string,
    value:string,
    display?:string,
    justify?:string,
    darked?:boolean,
}

/*Small component that this function is show the diferent elements in the paymen order with de title and their value */

const OrderSumaryGrid:FC<Props> = ({title, value, display='flex', justify='end', darked=false}) => {
  return (
      <>
        <Grid item xs={6}>
            <Typography variant={darked ? 'subtitle1':'subtitle2'}>{title}</Typography> {/*title*/}
        </Grid>
        <Grid item xs={6} display='flex' justifyContent={justify}>
            <Typography variant={darked ? 'subtitle1':'subtitle2'}>{value}</Typography> {/*VALUE*/}
        </Grid>
      </>
  )
}

export default OrderSumaryGrid