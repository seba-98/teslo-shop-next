import { NextRequest, NextFetchEvent, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';


export const middleware = async(req:NextRequest, ev:NextFetchEvent)=>{

    const url = req.nextUrl.clone();
    const loginUrl = req.nextUrl.clone();
    loginUrl.basePath = '/auth/login?p=';
    loginUrl.pathname = req.page.name!;


 let session:any;
 
 session = await getToken({req, secret: process.env.NEXTAUTH_SECRET});

 
 if( !session ){
     return NextResponse.redirect( loginUrl );
 } 
 
 
 if(session && session.user.role !== 'admin' ) return NextResponse.redirect( url.origin );
   
 return NextResponse.next();

}

