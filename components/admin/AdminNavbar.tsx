import { AppBar, Toolbar, Typography, Box, Button, Link } from '@mui/material'
import NextLink from 'next/link'
import React from 'react'
import { useAppDispatch } from '../../hooks/useReduxHooks';
import { toggleSideMenu } from '../../redux/slices'

export const AdminNavbar = () => {

  const dispatch = useAppDispatch();
  const sideMenuChange =()=> dispatch( toggleSideMenu() );     

  return (
    <AppBar sx={{width:'100%'}}>
        <Toolbar sx={{width:'100%'}}>
            <NextLink href='/' passHref>
                <Link display='flex' alignItems='center' >
                    <Typography variant="h6" component="h6">Teslo |</Typography>
                    <Typography variant="h6" component="h6" sx={{ml:0.5}}>Shop</Typography>
                </Link>
            </NextLink>

            <Box sx={{flex:1}} /> {/*spacing */}

            <Button 
            onClick={sideMenuChange} 
            sx={{
              '&:hover':{
                color:'white'
              }
            }}
            >Menú</Button>
        </Toolbar>
    </AppBar>
  )
}
