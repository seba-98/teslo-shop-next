import type { NextApiRequest, NextApiResponse } from 'next'
import { dbErrors, productGet } from '../../../api-rest/api_request_functions';
import { IData } from '../../../interfaces/server_interfaces';

const {getProducts} = productGet;

export default function (req: NextApiRequest, res: NextApiResponse<IData>) {

    switch (req.method) {
        case 'GET':
            return dbErrors(getProducts(req, res), res); 
    
        default:
            return res.status(400).json({
                message:'invalid method'
            })
    }
    
}