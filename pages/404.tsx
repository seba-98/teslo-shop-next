import { Box, Button, Link, Typography } from '@mui/material';
import { ShopLayout } from '../components/layouts/ShopLayout';
import NextLink from 'next/link';

const Custom404Page = () => {
  return (
    <ShopLayout title={'Page not found 404'} pageDescription={'Pagina no encontrada'}>

        <Box 
            display='flex' 
            justifyContent='center' 
            flexWrap='wrap'
            alignItems='center' 
            height='calc(100vh - 200px)'
            sx={{flexDirection:{xs:'column', md:'row'}}}

        >
            <Typography variant='h1' component='h1' fontSize={100} fontWeight={200}>404 |</Typography>
            <Typography variant='h1' component='h1' fontSize={30} fontWeight={200}> Pagina no encontrada</Typography>

            <NextLink href='/' passHref>
                <Link>
                    <Button  sx={{fontSize:'30px', fontWeight:'200', ml:'50px', border:'2px dashed grey'}} variant='contained'>Volver</Button>
                </Link>
            </NextLink>
        </Box>

    </ShopLayout>
  )
}

export default Custom404Page