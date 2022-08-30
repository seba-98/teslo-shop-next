import { jwtVerify } from "jose";

export const validJwtJose = async(token: string):Promise<any>=>{

    try {
       const{payload} = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET_SEED));

       return payload;
        
    } catch (error) {
        return 'JWT No es válido.';
    }

}



