import { Typography } from '@mui/material'
import type { NextPage } from 'next'
import { ShopLayout } from '../components/layouts'
import { ProductList } from '../components/products';
import { FullScreenLoading } from '../components/ui';
import { useProducts } from '../hooks';
// import { useAppDispatch, useAppSelector } from '../hooks/useReduxHooks';
// import { getProducts, startGetProducts, endGetProducts } from '../redux/slices/products.slice';
import { ICompleteProduct } from '../interfaces/shared_interfaces/products';


interface Idat{
  data:ICompleteProduct[] | [],
  load:boolean,
  err:boolean
}


const HomePage: NextPage = () => {

  const { products, loading  } =  useProducts('/products');


  return (
      <ShopLayout title='teslo' pageDescription={'bienvenidos a tesloshop'} >
        <>
          <Typography variant='h1' component='h1'>Tienda</Typography>
          <Typography variant='h2' component='h2' sx={{ mb:1 }}>Tienda</Typography>

          {
            loading ?
            <FullScreenLoading />
            :
            <ProductList products={products}/>
          }
        </>
      </ShopLayout>
  )
}

export default HomePage
