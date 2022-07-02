import { Box, Link, Typography } from '@mui/material'
import NextLink from 'next/link'
import React, { FC } from 'react'

interface Props{
  editable:boolean
}

export const UserData:FC<Props> = ({editable=false}) => {


  return (
      <>
      {
        editable &&
        <Box display='flex' justifyContent='end'>
            <NextLink href='/checkout/adress' passHref>
                <Link underline='always'>Editar</Link>
            </NextLink>
        </Box>
      }
        <Typography variant='subtitle1'>Dirección de entrega</Typography>
        <Typography>Jhon doe</Typography>
        <Typography>320 somewhere</Typography>
        <Typography>Stittsville, HYS 23S</Typography>
        <Typography>+2 122 457655</Typography>
      </>
  )
}
