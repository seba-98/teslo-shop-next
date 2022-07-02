import { Grid } from "@mui/material"
import { FC } from "react"
import { ICompleteProduct } from "../../interfaces/shared_interfaces"
import { ProductCard } from "./ProductCard"

interface Props{
    products: ICompleteProduct[] | []
}

export const ProductList:FC<Props> = ({products=[]}) => {
  return (
      <Grid container spacing={4} >
          {                                                                
            products.map(  (product) => <ProductCard product={product} key={product.slug}/>  )
          }
      </Grid>
  )
}
