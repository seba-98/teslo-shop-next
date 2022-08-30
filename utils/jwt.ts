import jwt from 'jsonwebtoken';
import {SignJWT, jwtVerify, type JWTPayload} from 'jose';

export const signToken=(_id:string, email:string)=>{

    if( !process.env.JWT_SECRET_SEED)  throw new Error('-Error fatal- No hay semilla JWT- Revisar variables de entorno');
    
    return jwt.sign(
        {
            _id,
            email
        }, 
        process.env.JWT_SECRET_SEED, 
        {
            expiresIn: '30d'
        } 
    );
}

export const isValidToken=( token:string ):Promise<string>=>{

    if( !process.env.JWT_SECRET_SEED)  throw new Error(' No hay semilla JWT- Revisar variables de entorno');
    
    if(token.length < 10) {
        Promise.reject('JWT No es válido.')
    }

    return new Promise((resolve, reject)=>{


        try {

            jwt.verify(token, process.env.JWT_SECRET_SEED || '', (err, payload)=>{

                if(err) reject('JWT No es válido.')

                const {_id} = payload as {_id:string};
                resolve(_id);

            });
            
        } catch (error) {
            reject('JWT No es válido.');
        }
    })
}

