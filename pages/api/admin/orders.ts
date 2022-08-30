import type { NextApiRequest, NextApiResponse } from 'next'
import { dbErrors } from '../../../api-rest/api_request_functions';
import { db } from '../../../api-rest/db';
import { Order } from '../../../api-rest/models';
import { IOrder } from '../../../interfaces/server_interfaces/orders';

type Data = { message: string } | { error: string } | { orders: IOrder[] }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return dbErrors( getOrders(req, res), res ) ;
    
        default:
            return res.status(404).json({ error: 'Bad request' });
        }
    }
    
    const getOrders = async ( req: NextApiRequest, res: NextApiResponse<Data> ) =>{

        await db.connect();
        
        const orders = await Order.find()
        .sort({ createdAt:'desc' })
        .populate('user', 'email')
        .lean();         
        //populate filtra una parte de la order que es refernecia a otro doc, en este caso usuarios, obteniendo solo
        //el email y el mail, el resto de la orden viene completa
        await db.disconnect();
        
        return res.status(200).json({ orders });
    

}