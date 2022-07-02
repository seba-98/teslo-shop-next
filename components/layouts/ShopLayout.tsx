import Head from "next/head"
import { FC, useEffect } from "react"
import { Navbar } from "../ui/"
import SideMenu from '../ui/SideMenu';
import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks';
import { getStateFromCookies } from '../../redux/slices/cart.slices';
import { actionLoadPaymentData } from "../../redux/slices/payment.slices";

interface Props{
    title:string,
    pageDescription:string,
    imageFullUrl?:string,
    children: JSX.Element
}

export const ShopLayout:FC<Props> = ({children, title, pageDescription='Teslo shop', imageFullUrl}) => {

    const dispatch = useAppDispatch();
    const { cart } = useAppSelector(state=>state.cart);


    useEffect(() => {
        dispatch( getStateFromCookies() );
    }, [dispatch])

    useEffect(() => {
        dispatch( actionLoadPaymentData() );
    }, [cart, dispatch])
    
    
  return (
    <>
        <Head>
         <title>{ title }</title>
         <meta name="og:title" content={ title } />
         <meta name="description" content={ pageDescription } />
         <meta name="og:description" content={ pageDescription } />
         <meta name="viewport" content="initial-scale=1, width=device-width" />

         { imageFullUrl && <meta name="og:image" content={ imageFullUrl } /> }
        </Head>

        <nav>
            <Navbar />
        </nav>
        
        <SideMenu />

        <main style={{
            margin:'80px auto',
            maxWidth: '1440px',
            padding: '0px 30px'
        }}>
            { children }
        </main>
        
        <footer>
            {/* FOOTER */}
        </footer>

    </>
  )
}
