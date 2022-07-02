import { NextRequest, NextFetchEvent, NextResponse } from 'next/server';

export function middleware(req:NextRequest, ev:NextFetchEvent){

    const q= req.page.params?.q;
    const condition= q?.toString().replace(/ /g, "").trim();

    if(!condition) return new Response(JSON.stringify({message:'query inválida'}),{
        status:400,
        headers:{
            'Content-Type':'aplication/json'
        }
    })

    return NextResponse.next();

}
