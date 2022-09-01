import { jwtVerify } from "jose";

export const validJwtJose = async(token: string):Promise<any>=>{

    try {
       const{ payload } = await jwtVerify(token, new TextEncoder().encode(process.env.NEXT_PUBLIC_ALLOW_JWT));
       return payload;
        
    } catch (error) {
        return 'JWT No es válido.';
    }

}



