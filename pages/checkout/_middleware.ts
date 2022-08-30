import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
// import { jwtVerify } from "jose";


export const middleware= async( req:NextRequest, ev:NextFetchEvent )=>{


    const { cart='[]' } = req.cookies 

    const parsedCart = JSON.parse(cart);


    let url= req.nextUrl.clone(); //debemos utilizar el clone para copiar la url debido a que el redirect no permite poner texto plano

    url.basePath = '/auth/login?p=';  //pagina de redireccionamiento, si el usuario no esta logeado (tiene implícita la query)
    url.pathname = req.page.name!;    //le agregamos como query, el nombre de la página ej: /adress/  o  /summary/
    let session;

    
    
    session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    
    if(!session) return NextResponse.redirect(url);

    if( session && parsedCart.length < 1 ) return NextResponse.redirect(url.origin)

    if(session &&  parsedCart.length > 1) return NextResponse.next();
        

    
    // const {token=''}= req.cookies;

    //     try {
        
    //      await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET_SEED));
    //      return NextResponse.next();   //si esta autenticado lo enviamos a adress o sumary
           
    //     } catch (error) {
    //         return NextResponse.redirect(url);  //si no lo esta lo enviamos al login PERO con el path de redireccionamiento
    //     }                                       //para que una vez que se logee vuelva a la page donde estaba


}