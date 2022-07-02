import React, { FC } from 'react'
import Head from 'next/head'
import { Box } from '@mui/material'

interface Props{
    title:string,
    pageDescription:string,
    imageFullUrl?:string,
    children: JSX.Element
}

export const AuthLayout:FC<Props> = ({title, pageDescription, imageFullUrl, children}) => {
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

        <main>
            <Box display={'flex'} justifyContent='center' alignItems='center' height='calc(100vh - 200px)'>
                {children}
            </Box>
        </main>

    </>
  )
}
