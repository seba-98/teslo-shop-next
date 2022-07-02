import React from 'react'
import { GetServerSideProps, NextPage } from 'next'
import { Divider, Grid,  Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined';
import { getFilterProducts } from '../../api-rest/ssg-ssr-request-functions/getData';
import { ICompleteProduct } from '../../interfaces/shared_interfaces';

interface Props{
  products: ICompleteProduct[],
  query: string,
  notFounded:boolean
}

const SearchPage:NextPage<Props> = ({products, query, notFounded=false}) => {

  //without SSRendering
  // const router=useRouter();
  // const {query}=router.query;
    
  // const { products, loading } = useProducts(`/search/${query}`);


  return (
      <ShopLayout title={`Search - ${query}`} pageDescription={`Resultados de: ${query}`} >
        <>
          <Typography variant='h1' component='h1' sx={{ mb:2 }}>Búsqueda</Typography>
          <Typography variant='h2'sx={{ mb:10 }} component='h2'>Resultados de:<Typography textTransform="capitalize">{query}</Typography>
            
          
          </Typography>
          { 
          notFounded &&

            <Grid container spacing={0}>
                <Grid item xs={12} md={10} mb={10}  sx={{display:'flex', justifyContent:'center', flexDirection:{xs:'column', sm:'row'}}} >
                    <Typography variant='h3' component='h3'  sx={{fontSize:{xs:'25px', sm:'35px'}}}>
                        No hay coincidencias con 
                    </Typography> 
                    &nbsp;
                    &nbsp;
                    <Typography variant='h3' component='h3' sx={{fontSize:{xs:'25px', sm:'35px'}}} color='secondary' textTransform='capitalize'>
                        {query}
                    </Typography>

                    <SearchOffOutlinedIcon fontSize='large' color='error' sx={{ml:4}}/> 
                </Grid>
                <Grid item xs={12} md={10} mb={4} display='flex' justifyContent='start' >
                    <Typography variant='h4' component='h4' fontSize='30px' >
                        Artículos que podrían gustarte
                    </Typography>
                </Grid>
            </Grid>

          }

            <ProductList products={products}/>
          
        </>
      </ShopLayout>
  )
}

export default SearchPage




export const getServerSideProps: GetServerSideProps = async ({params}) => {

  const {query=''} = params as {query:string};


  if(query.trim().length === 0)  return{
      redirect:{
        destination:'/',
        permanent:true
      }
    }
    
  
  
  let products = await getFilterProducts(query);

  const notFounded = products.length < 1 || !products;

  if( notFounded ) products = await getFilterProducts();


  return {
    props: {
      products,
      notFounded,
      query
    }
  }
}