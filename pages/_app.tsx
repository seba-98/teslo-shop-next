import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material';
import { lightTheme } from '../themes/light-theme';
import { SWRConfig } from 'swr';
import { Provider } from 'react-redux';
import store from '../redux/store';
import '../styles/global.css'
import GlobalProvider from '../components/Providers/GlobalProvider';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

function MyApp({ Component, pageProps:{session, ...pageProps} }: AppProps) {

  return (

    <SessionProvider session={session}>

      <PayPalScriptProvider options={{"client-id":process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ''}}>
        <SWRConfig value={{fetcher: (resource, init)=> fetch(resource, init).then(res => res.json())}}>
          <Provider store={store}>
              <GlobalProvider> 
                <ThemeProvider theme={lightTheme}>
                  <CssBaseline/>
                  <Component {...pageProps} />
                </ThemeProvider>
              </GlobalProvider> 
          </Provider>
        </SWRConfig>
      </PayPalScriptProvider>
    </SessionProvider>  
  )
}
export default MyApp
