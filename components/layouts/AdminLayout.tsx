import React, { FC } from 'react'
import Head from 'next/head'
import { Box, Typography } from '@mui/material'
import { AdminNavbar } from '../admin/AdminNavbar';
import SideMenu from '../ui/SideMenu';

interface Props{
    title:string,
    subtitle:string,
    icon?:JSX.Element,
    children: JSX.Element
}

export const AdminLayout:FC<Props> = ({title, subtitle, icon, children}) => {
  return (
    <>
        <Head>
         <title>{ title }</title>
         <meta name="og:title" content={ title } />
         <meta name="description" content={ subtitle } />
         <meta name="og:description" content={ subtitle } />
         <meta name="viewport" content="initial-scale=1, width=device-width" />

         {/* { icon && <meta name="og:image" content={ icon } /> } */}
        </Head>

        <AdminNavbar />
        <SideMenu />

        <main>
            <Box display={'flex'} justifyContent='center' alignItems='flexStart' marginLeft='20px' sx={{ marginTop:'80px'}} flexDirection='column' >
                <Typography variant='h1' component='h1'> { icon }  { title }</Typography>
                <Typography variant='h2' component='h2' sx={{mb:1}}> { subtitle } </Typography>
            </Box>
            <Box >
                {children}
            </Box>
        </main>

    </>
  )
}
