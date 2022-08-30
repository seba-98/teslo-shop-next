import { NextRequest, NextFetchEvent, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';


export const middleware = async(req:NextRequest, ev:NextFetchEvent)=>{

    const session:any = await getToken({req, secret: process.env.NEXTAUTH_SECRET});

     
     if( !session ){
        return new Response( JSON.stringify({message:'No hay usuario'}),{
            status:400,
            headers:{
                'Content-Type': 'aplication/json'
            }
        } );
    } 
     if(session && session.user.role !== 'admin' ) return new Response( JSON.stringify({message:'Acceso no autorizado'}),{
        status:400,
        headers:{
            'Content-Type': 'aplication/json'
        }
     } )
      
    return NextResponse.next();

   }

  