import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';


interface Props{
  disabled?:boolean,
  updatedState: (value:number)=>void,
  baseQuantity:number
  limitQuantity:number
  location?:'cart' | 'product'
}

export const ItemCounter:FC<Props> = ({ disabled=false, updatedState, limitQuantity, baseQuantity, location = 'product'}) => {

  const [ counter, setCounter ] = useState(baseQuantity);


  const update = (op:number)=> {

    if(op === +1 && baseQuantity < limitQuantity! ){

        setCounter(c=>c+1);
        updatedState( baseQuantity + 1 );
      }
      
      if(op === -1 && baseQuantity > 1 ) {
        
        setCounter(c=>c-1);
        updatedState( baseQuantity - 1 );
      } 
  }


  useEffect(() => {
    if(location === 'product'){
      setCounter(1);
      updatedState(1)
    }
  }, [limitQuantity])
  

  
  return (
    <Box display='flex' alignItems='center'>
        <IconButton 
          onClick={()=>update(-1)} 
          disabled={disabled}
        >
          <RemoveCircleOutline />
        </IconButton>

        <Typography sx={{width:40, textAlign:'center'}} > { counter } </Typography>

        <IconButton 
          onClick={()=>update(+1)} 
          disabled={disabled}
        >
          <AddCircleOutline />
        </IconButton>
    </Box>
  )
}
