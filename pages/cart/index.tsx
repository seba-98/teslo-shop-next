import { NextPage } from 'next'
import BuysLayout from '../../components/layouts/BuysLayout';

const CartPage:NextPage = () => {


  return (
    <BuysLayout 
      title={'Carrito - 3'} 
      pageDescription={'Carrito de compras'} 
      type={'in-cart'} />

  )
  
  
}

export default CartPage