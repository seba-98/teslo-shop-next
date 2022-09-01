import jwt from 'jsonwebtoken';

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

export const apiRequestToken=async(user:string)=>{
    
    try {
        if( !process.env.NEXT_PUBLIC_ALLOW_JWT || !process.env.NEXT_PUBLIC_ALLOW_USER )  throw new Error('-Error fatal- No hay semilla JWT- Revisar variables de entorno');
        if( process.env.NEXT_PUBLIC_ALLOW_USER !== user )  throw new Error('-Error fatal- SEMILLA USUARIO JWT INVÁLIDA');
       

        return jwt.sign(
            {
               user, 
            },
            process.env.NEXT_PUBLIC_ALLOW_JWT, 
            {
                expiresIn: '30d'
            } 
        );
        
    } catch (error) {
        return console.log(error);
        
    }

    
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

