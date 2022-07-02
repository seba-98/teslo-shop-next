import React, { FC } from 'react'
import NextLink from 'next/link';
import { useRouter } from "next/router";
import {  Button,  Link, } from "@mui/material"

interface Props{
    text:string,
    href:string
}


export const ActiveLink:FC<Props> = ({text, href}) => {
    
    const {asPath}=useRouter();



  return (
    <NextLink href={href} passHref>
        <Link >
        {
         asPath === href ?
            <Button color="primary" className='fadeIn'>{text}</Button>
            :
            <Button className='fadeIn'>{text}</Button>
        }
        </Link>
    </NextLink>
  )
}
