import React from 'react'
import { GetStaticPaths, GetStaticProps, NextPage} from 'next'
import { Typography } from '@mui/material'
import { ShopLayout } from '../../components/layouts'
import { ProductList } from '../../components/products'
import { FullScreenLoading } from '../../components/ui'
import { getFilterProducts } from '../../api-rest/ssg-ssr-request-functions/getData';
import { ICompleteProduct } from '../../interfaces/shared_interfaces'

interface Props{
  products:ICompleteProduct[]
  loading:boolean,
  title:string,
  description:string,
}


const CategoryPage:NextPage<Props> = ({products, loading, title, description}) => {

  return(
    <ShopLayout title={title} pageDescription={description} >
      <>
        <Typography variant='h1' component='h1'>Tienda</Typography>
        <Typography variant='h2' component='h2' sx={{ mb:1 }}>Tienda</Typography>

        {
          !loading ?
          <FullScreenLoading />
          :
          <ProductList products={products}/>
        }
      </>
  </ShopLayout>
  )
}


export default CategoryPage;




export const getStaticPaths: GetStaticPaths = async (ctx) => {

  return {
    paths: [{params:{category:'men'}},{params:{category:'women'}},{params:{category:'kid'}}],
    fallback: false
  }
}


        //getStaticProps() SE EJECUTARÁ UNA VEZ POR CADA PATH, (creará 3 páginas estáticas, men, women, kid)
export const getStaticProps: GetStaticProps = async ({params}) => { 

  const {category} = params as {category:string};
  const products = await getFilterProducts(category);

  const loading= products.length > 1;

  return {
    props: {
      products,
      loading,
      title:`Teslo-shop | ${category}`,
      description:`Productos de la categoría ${category}`
    },
    revalidate:86400,
  }
}