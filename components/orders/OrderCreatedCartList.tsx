import { Box, CardActionArea, CardMedia, Grid, Link, Typography } from "@mui/material";
import NextLink from "next/link";
import { FC } from "react"
import { IOrderItem } from '../../interfaces/server_interfaces/orders';

interface Props{
    items:IOrderItem[]
}


export const OrderCreatedCartList:FC<Props> = ({items=[]}) => {
    
   
        return (
            <>
            {items.map( product =>(
                <Grid container spacing={2}  sx={{my:2}} key={product.slug + product.size}>
                    
                    <Grid item xs={5} sm={4} md={3} >
                        <NextLink href={`/product/${product.slug}`} passHref>
                            <Link>
                                <CardActionArea>
                                    <CardMedia image={`/products/${ product.image }`}
                                    component='img'
                                    sx={{borderRadius:'5px'}}
                                    >
                                    </CardMedia>
                                </CardActionArea>
                            </Link>
                        </NextLink>
                    </Grid>

                    <Grid item xs={7}>
                        <Box display='flex' flexDirection='column'>
                            <Typography variant="body1">{product.title}</Typography>
                            <Typography variant="body1">Talla: <strong>{product.size}</strong></Typography>
                            <Typography variant='h6' component='h6'> {product.quantity} {product.quantity===1? 'producto' : 'productos' }</Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
                        <Typography variant="subtitle1">{`$${product.price}`}</Typography>
                    </Grid>
                </Grid>
            ))}
            
            </>
        )
    }
