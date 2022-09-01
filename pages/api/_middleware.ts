import { jwtVerify } from 'jose';
import { NextRequest, NextFetchEvent, NextResponse } from 'next/server';


   export async function middleware(req:NextRequest, ev:NextFetchEvent){

    const{ httpAllow } = req.cookies; 


    try {
        
        await jwtVerify(httpAllow, new TextEncoder().encode(process.env.NEXT_PUBLIC_ALLOW_JWT));
        return NextResponse.next();   
        
    } catch (error) {
        return new Response (JSON.stringify({message:'No esta autorizado a este servicio'}),{
            status:401,
            headers:{
            'Content-Type':'aplication/json'
           }
        })
    }

}