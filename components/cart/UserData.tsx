import { Box, Link, Typography } from '@mui/material'
import NextLink from 'next/link'
import React, { FC, useMemo, useState } from 'react'
import { IAllPaymentData } from '../../interfaces/shared_interfaces';
import { countries } from '../../utils/countries';


interface userData extends IAllPaymentData {
  createdAt:string;
  updatedAt:string;
} 

interface Props{
  editable:boolean,
  userData: userData 
}

export const UserData:FC<Props> = ({editable=false, userData}) => {

  const {
    name,
    lastName,
    adress,
    city,
    country,
    phoneNumber,
    secondAdress,
    createdAt,
    updatedAt
  } = userData;
  

  const filterCountry =()=>  countries.find((c)=>c.code === country);  
  
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
        <Typography variant='subtitle1'>
          Datos del cliente
        </Typography>

        <Typography>
          Nombre apellido: <b>{ name } { lastName }</b> 
        </Typography>

        <Typography>
          País: <b>{ filterCountry()!.name }</b> 
        </Typography>

        <Typography>
          Ciudad: <b>{ city }</b> 
        </Typography>

        <Typography>
          Domicilio: <b>{ adress }</b> 
        </Typography>
        
        {secondAdress && secondAdress !== '' &&
          <Typography>
            Domicilio 2: <b>{ secondAdress }</b> 
          </Typography>
        }
        <Typography>Teléfono: <b>{ phoneNumber }</b></Typography>

        <br></br>
        
        {
          !editable &&
          <>
            <Typography>
              Fecha de creación: <b>{ createdAt }</b> 
            </Typography>
            <Typography>
              Fecha de actualizacion: <b>{ updatedAt }</b> 
            </Typography>
          </>
        }

      </>
  )
}
