import { Grid, Card, CardActionArea, CardMedia, Box, Typography, Link, Chip } from '@mui/material';
import NextLink from 'next/link';
import React, { FC, useMemo, useState } from 'react';
import { ICompleteProduct } from '../../interfaces/shared_interfaces/index';
import shimer from '../../styles/shimer.module.css';
import { processUrl } from '../../utils/processImageUrl';

interface Props{
  product:ICompleteProduct
}

export const ProductCard:FC<Props> = ({ product }) => {

  const [mouseEnter, setMouseEnter] = useState(false);
  const [onLoadImg, setOnLoadImg] = useState(false);


 const ChangeImage= useMemo(() =>  mouseEnter ? processUrl(product.images[1]) : processUrl(product.images[0]), [mouseEnter, product.images]);

 const onLoadImage=()=> setOnLoadImg(true);

 const validateStockInAllSizes= product.sizes.reduce((total, size)=>total+=size.inStock ,0);
  

  
  return (
    <Grid 
      item 
      xs={ 12 } 
      sm={ 6 }  
      md={ 4 }
      onMouseEnter={()=>{setMouseEnter(true)}} 
      onMouseLeave={()=>{setMouseEnter(false)}} 
    >

      <Card>

          <NextLink href={`/product/${product.slug}`} passHref>
            <Link>
              <CardActionArea>
                {validateStockInAllSizes === 0 &&
                  <Chip  label='Artículo agotado' color='primary' sx={{position:'absolute', zIndex:'1'}}/>
                }
                  <CardMedia                //USAR SIEMPRE ESTE COMPONENTE PARA IMAGENES
                    component='img'
                    image={ ChangeImage }
                    alt={ product.title }
                    className='fadeIn'
                    onLoad={onLoadImage}
                  />
              </CardActionArea>
            </Link>
          </NextLink>
        
      </Card>

      {
       onLoadImg ?
        <Box sx={{mt:1}} className='fadeIn'>
          <Typography fontWeight={700}>{ product.title }</Typography>
          <Typography fontWeight={500} color='GrayText'> Precio por talle</Typography>
        </Box>
        :
        <div className={shimer.shimmer}>
          <div className={`${shimer.div2}  ${shimer.subDiv2Text}`}></div>
        </div>
      }

    </Grid>
  )
}
