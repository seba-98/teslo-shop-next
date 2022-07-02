import type { AppProps } from 'next/app'
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material';
import { lightTheme } from '../themes/light-theme';
import { SWRConfig } from 'swr';
import { Provider } from 'react-redux';
import store from '../redux/store';
import '../styles/global.css'
import { useEffect } from 'react';
import Cookies from 'js-cookie';

function MyApp({ Component, pageProps }: AppProps) {


  // useEffect(() => {
  //   const cookieCart = Cookies.get('cart') && Cookies.get('cart')! ;
  //   !cookieCart && Cookies.set('cart',  JSON.stringify([]) );
  // }, [])
  


  return (
    <SWRConfig 
      value={{
        fetcher: (resource, init)=> fetch(resource, init).then(res => res.json())
      }}
    >
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <CssBaseline/>
          <Component {...pageProps} />
        </ThemeProvider>
      </Provider>
    </SWRConfig>

  )
}
export default MyApp
