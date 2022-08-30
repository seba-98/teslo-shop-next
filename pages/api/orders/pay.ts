import type { NextApiRequest, NextApiResponse } from 'next'
import { dbErrors, paypalPay } from '../../../api-rest/api_request_functions';

const { paypalPayment }=paypalPay

type Data=
{ message:string }
|
{ error:string }


export default function paypalHandler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'POST':
            return  dbErrors( paypalPayment(req, res), res ) ;
    
        default:
            return res.status(400).json({
                message:'Bad request'
            });
    }
}