import { Box, Button, Grid } from "@mui/material";
import { FC } from "react"
import { IValidSize, IValidSizes } from '../../interfaces/shared_interfaces/index';

interface Props{
    sizes:IValidSize[],
    setSelectedSize: (size:IValidSizes)=>void,
    setBaseData: (stock:number, price:number)=>void,
    selectedSize:IValidSizes
}


export const SizesSelector:FC<Props> = ({ sizes, setSelectedSize, selectedSize, setBaseData }) => {

    

  return (
    <Box sx={{pb:'20px'}}>
        <Grid container display='flex' justifyContent='space-around' >
            {

                sizes.map( (size) => {

                   return size.inStock > 1 &&
                    <Button 
                    key={ size.value }
                    size='small'
                    color={selectedSize === size.value ? 'primary' : 'info'}
                    onClick={()=>{ 
                        
                        setBaseData(size.inStock, size.price);
    
                        !selectedSize || selectedSize !== size.value  ?  
                            setSelectedSize(size.value) 
                        : 
                            setSelectedSize(undefined)}}
                    >
                        {size.value}
                    </Button>

                    }
                
                )
            }
            
            
        </Grid>
    </Box>
  )
}
