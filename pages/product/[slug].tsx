
import { GetStaticPaths, GetStaticProps } from 'next'
import {  Button, Chip, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { ShopLayout } from '../../components/layouts/ShopLayout';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import { ItemCounter, SlideShow } from '../../components/ui';
import 'react-slideshow-image/dist/styles.css'
import { SizesSelector } from '../../components/products';
import { NextPage } from 'next';
import { ICompleteProduct } from '../../interfaces/shared_interfaces';
import { getDataItem, getProductsSlug } from '../../api-rest/ssg-ssr-request-functions/getData';
import { useState } from 'react';
import { IValidSizes } from '../../interfaces/shared_interfaces/';
import { ICartProduct } from '../../interfaces/client_interfaces/';
import { useAppDispatch } from '../../hooks/useReduxHooks';
import { updateQuantityAction } from '../../redux/slices';
import { price as priceFormat } from '../../utils/valueInPrice';


interface Props{
  product:ICompleteProduct
}

const SlugPage:NextPage<Props> = ({product}) => {

  const validateStockInAllSizes= product.sizes.reduce((total, size)=>total+=size.inStock ,0);

  const [stock, setStock] = useState<number>( validateStockInAllSizes );
  const [price, setPrice] = useState<number>( 0 );

  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id:product._id,
    image:product.images[1],
    price:price,
    size:undefined,
    slug:product.slug,
    title:product.title,
    gender:product.gender,
    quantity:1,
    inStock:stock
  });

  const setPriceAndStockTempProduct=(stock:number, price:number)=> {
    setStock(stock);
    setPrice(price);
    setTempCartProduct({...tempCartProduct, inStock:stock, price:price});
  }
  const selectedSize=(size:IValidSizes) => setTempCartProduct( product => ({...product, size}) )
  
  const dispatch = useAppDispatch();
  
  const addInCartFunc =()=>  dispatch( updateQuantityAction( tempCartProduct ) ); 
  
  const updateQuantityInCounter=(update:number) => setTempCartProduct( {...tempCartProduct, quantity:update} );


  

  return (

    <ShopLayout title={product.title} pageDescription={product.description} >

      <Grid container spacing={ 3 }>
        <Grid item xs={ 12 } sm={ 7 }  >
          <SlideShow images={product.images}/>
        </Grid>

        <Grid item xs={ 12 } sm={ 5 }>

          <Box display='flex' flexDirection='column' >

            {/* titulos */}
            <Typography variant='h1' component='h1'>{product.title}</Typography>
            <Typography variant='subtitle1' component='h2'>$ {product.price}</Typography>

            {/* cantidad */}
            <Box sx={{my: 2 }} >

              <Typography variant='subtitle2' component='h3' fontSize='18px'>
                Cantidad 
                <span style={{color:'grey', fontSize:'14px'}}> (Quedan {stock} unidades en stock) </span>
              </Typography>

              <ItemCounter                                //COMPONENTE CONTADOR-------------------------------
                disabled={!tempCartProduct.size ? true : false}
                updatedState={ updateQuantityInCounter }
                limitQuantity={stock}
                baseQuantity={tempCartProduct.quantity}
              />
            </Box>

            <SizesSelector 
              sizes={product.sizes} 
              setBaseData={setPriceAndStockTempProduct}  
              selectedSize={tempCartProduct.size} 
              setSelectedSize={ selectedSize } 
            />
              <Typography variant='h4' component='h4' fontSize='28px'>
                
                { priceFormat(tempCartProduct.price)  } / unidad
              </Typography>

            {  validateStockInAllSizes < 1 ? 
                (
                  <Chip label='Artículo agotado' color='error' variant='outlined' />
                )
                :
                (
                  <Button 
                    color='secondary' 
                    disabled={!tempCartProduct.size && true} 
                    sx={{
                      '&:hover':{
                        backgroundColor:'rgb(45, 82, 181);'
                        }
                    }}
                    onClick={tempCartProduct.size &&  addInCartFunc}
                  >
                  {
                    !tempCartProduct.size ?
                    ('Seleccione una talla')
                    :
                    ('Añadir')
                  }
                   &nbsp;                                         
                  <AddShoppingCartOutlinedIcon className='add-cart-icon' />
                </Button>
                )
            }


            <Box sx={{ mt:3 }}>
              <Typography variant='subtitle2' component='h3'>Descripción</Typography>
              <Typography variant='body2' component='h3'>{product.description}</Typography>
            </Box>
          </Box>


        </Grid>
      </Grid>

    </ShopLayout>
  )
}

export default SlugPage





export const getStaticPaths: GetStaticPaths = async (ctx) => {
  
  const slugs = await  getProductsSlug();
  
    return {
      paths:slugs.map(({slug})=>({
        params:{
          slug
        }
      })),
      fallback: "blocking"
    }
          
          
}          
          

export const getStaticProps: GetStaticProps = async ({params}) => {

  const {slug} = params as {slug:string};
  const  product  = await getDataItem(slug);

  if(!product){
    return{
      redirect:{
        destination:'/',
        permanent:false
      }
    }
  }

  return {
    props: {
      product
    },
    revalidate:60 * 60 * 24
  }
}


