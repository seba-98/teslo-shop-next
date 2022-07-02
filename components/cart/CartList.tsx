import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from "@mui/material";
import NextLink from "next/link";
import { FC, useEffect } from "react"
import { ItemCounter } from "../ui";
import { useAppSelector, useAppDispatch } from '../../hooks/useReduxHooks';
import { removeCartAction, updateQuantityAction } from "../../redux/slices";
import { useRouter } from "next/router";
import { ICartProduct } from '../../interfaces/client_interfaces/cart';

interface Props{
    editable?:boolean
}


export const CartList:FC<Props> = ({editable=false}) => {
    
    const dispatch = useAppDispatch();
    const router = useRouter();
    const updateStateInCounter=(product:ICartProduct)=> dispatch( updateQuantityAction(product) );

   

    const { cart, loaded } = useAppSelector(state=>state.cart);

    useEffect(() => {
        cart.length < 1 && router.push('/cart/empty')
        
    }, [ cart, router ])
    

    
    if(loaded){
        return (
            <>
            {cart.map( product =>(
                <Grid container spacing={2}  sx={{my:2}} key={product.slug + product.size}>
                    
                    <Grid item xs={3}>
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
                            { editable ?
                                (
                                <>
                                    <ItemCounter 
                                    updatedState={(value:number)=>{
                                        updateStateInCounter({...product, quantity: value})
                                    }} 
                                    baseQuantity={product.quantity} 
                                    limitQuantity={product.inStock} 
                                    location='cart'                                      
                                    />
                                </>
                                )
                                :
                                <Typography variant='h6' component='h6'> {product.quantity} {product.quantity===1? 'producto' : 'productos' }</Typography>
                            }
                        </Box>
                    </Grid>

                    <Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
                        <Typography variant="subtitle1">{`$${product.price}`}</Typography>

                        { editable &&
                            <Button variant='text' color="secondary" onClick={ ()=> dispatch( removeCartAction( product ) ) }>
                                Remover
                            </Button>
                        }       
                    </Grid>
                </Grid>
            ))}
            
            </>
            )
        }    

        return <h1>cargando...</h1>
    }
