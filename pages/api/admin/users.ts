import mongoose from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import { dbErrors } from '../../../api-rest/api_request_functions';
import { db } from '../../../api-rest/db';
import { User } from '../../../api-rest/models';
import { IUser } from '../../../interfaces/server_interfaces/user';

type Data = {message: string} | {users: IUser[]} | {error: string}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    const session:any = await getSession({req});


    switch (req.method) {
        case 'POST':
            return ;
            
            case 'GET':
            return dbErrors( getUsers(req, res), res );

        case 'DELETE':
            
            return dbErrors( deleteUsers(req, res), res );
            
        case 'PUT':
            
            return dbErrors( updateUsers(req, res), res );

        default:
            return res.status(401).json({
                message:'bad request'
            })
    }
}


const getUsers=async(req:NextApiRequest, res:NextApiResponse<Data>)=>{

    await db.connect();
        const users = await User.find().select('-password').lean();
        await db.disconnect();
        
        return res.status(200).json({
            users
        });
    }
    
    const updateUsers=async(req:NextApiRequest, res:NextApiResponse<Data>)=>{
        
        const { userId='', role='' } = req.body

        
        if( !mongoose.isValidObjectId(userId) ){
            return res.status(404).json({
                error:'Acceso no autorizado'
            });
        }
        
        await db.connect();
            const user = await User.findById(userId);
        await db.disconnect();

        if( !user) return res.status(404).json({
            error:'Usuario no encontrado'
        });
        user.role = role;
        await user.save();
        
        return res.status(200).json({
            message:'Usuario actualizado'
        });
}

const deleteUsers=async(req:NextApiRequest, res:NextApiResponse<Data>)=>{

    const { userId='' } = req.body
        
    if( !mongoose.isValidObjectId(userId) ){
        return res.status(404).json({
            error:'Acceso no autorizado'
        });
    }
    
    await db.connect();
        const user = await User.findById(userId);
    await db.disconnect();

    if( !user) return res.status(404).json({
        error:'Usuario no encontrado'
    });
   
    user.delete();
    
    return res.status(200).json({
        message:'Usuario eliminado'
    });

}

