import type { NextApiRequest, NextApiResponse } from 'next'
import { IResponseDataUser } from '../../../interfaces/server_interfaces'
import { jwt } from '../../../utils';
import { db } from '../../db';
import { User } from '../../models';


export const checkJWT= async (req: NextApiRequest, res: NextApiResponse<IResponseDataUser>) => {

    const { token='' }=req.cookies as {token:string};  

    let userId = '';

    try {

        userId = await jwt.isValidToken(token);   

    } catch (error) {                             
        
        return res.status(401).json({
            message: `${error}`
        })
    }
    

    await db.connect();
        const user = await User.findById( userId ).select(" _id  email role name ").lean() ;
    await db.disconnect();


    if(!user) return res.status(400).json( { message: 'No existe el usuario con ese id'});
    

    const {_id, email }=user;

    return res.status(200).json({
        token:jwt.signToken(_id, email),
        user
    })
   
}