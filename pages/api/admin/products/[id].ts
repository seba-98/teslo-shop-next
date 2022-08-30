import type { NextApiRequest, NextApiResponse } from 'next'
import { dbErrors } from '../../../../api-rest/api_request_functions';
import { db } from '../../../../api-rest/db';
import { Product } from '../../../../api-rest/models';
import { ICompleteProduct } from '../../../../interfaces/shared_interfaces';
import mongoose from 'mongoose';

type Data = { message: string } | { products: ICompleteProduct[] } | { error: string }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'DELETE':
            return dbErrors( deleteProduct(req, res), res );
    
        default:
            return res.status(400).json({ message: 'Bad request' });
        }
}

const deleteProduct=async(req: NextApiRequest, res: NextApiResponse<Data>)=> {

    const {id}=req.query;

    if( !mongoose.isValidObjectId(id) ) return res.status(400).json({
        error:'Id no válido'
    });

    await db.connect();

        await Product.findByIdAndDelete(id); 

    await db.disconnect();

    return res.status(200).json({
        message:'success'
    });

}


