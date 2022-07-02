import NextLink from 'next/link';
import { ShopLayout } from '../../components/layouts/ShopLayout';
import { Box, Typography, Button, Link } from '@mui/material';
import { RemoveShoppingCartOutlined } from '@mui/icons-material';
import { useAppSelector } from '../../hooks/useReduxHooks';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { NextPage } from 'next';

const EmptyPage:NextPage = () => {


   const { empty } = useAppSelector(state=>state.cart);
   const router = useRouter();


   useEffect(() => {
    
    !empty && router.push('/cart');
    
   }, [ empty, router ])
   

  return (
    <ShopLayout title={'Carrito vacío'} pageDescription={'No hay artículos en el carrito de compras'} >

        <Box 
            display='flex' 
            justifyContent='center' 
            flexWrap='wrap'
            alignItems='center' 
            height='calc(100vh - 200px)'
            sx={{flexDirection:{xs:'column', md:'row'}}}
        >
            <RemoveShoppingCartOutlined sx={{fontSize:100}} />
            <Typography variant='h1' component='h1' fontSize={100} fontWeight={200}>Carrito vacío |</Typography>
            
            <NextLink href='/' passHref>
                <Link>
                    <Button  
                    sx={{
                        fontSize:'30px', 
                        fontWeight:'200', 
                        ml:'50px', 
                        border:'2px dashed grey'
                     }
                    } 
                    variant='contained'
                    >Volver</Button>
                </Link>
            </NextLink>
        </Box>
    
    </ShopLayout>
  )
}

export default EmptyPage;