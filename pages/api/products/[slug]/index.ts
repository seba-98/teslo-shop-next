import type { NextApiRequest, NextApiResponse } from 'next'
import { dbErrors, productGet } from '../../../../api-rest/api_request_functions';
import { IData } from '../../../../interfaces/server_interfaces';

const { getProductBySlug } = productGet;

export default function handler(req: NextApiRequest, res: NextApiResponse<IData>) {


    switch (req.method) {
        case 'GET':
            return dbErrors( getProductBySlug(req, res), res )
    
        default:
            return res.status(200).json({ message: 'Bad request' })
    }


}