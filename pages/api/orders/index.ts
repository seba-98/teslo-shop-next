import type { NextApiRequest, NextApiResponse } from 'next'
import { dbErrors, ordersPost } from '../../../api-rest/api_request_functions';

type Data = {data: any} | {message:string}


const { createOrder } = ordersPost

export default function handler(req: NextApiRequest, res:NextApiResponse<Data>) {

    switch (req.method) {
        case 'POST':
            return  dbErrors( createOrder(req, res), res ) ;
    
        default:
            return res.status(200).json({
                message: 'Bad request'
            })
    }

}