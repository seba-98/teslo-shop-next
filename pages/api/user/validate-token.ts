import type { NextApiRequest, NextApiResponse } from 'next';
import { dbErrors } from '../../../api-rest/api_request_functions/';
import { checkJWT } from '../../../api-rest/api_request_functions/users/get';
import { IResponseDataUser } from '../../../interfaces/server_interfaces';



export default function handler(req: NextApiRequest, res: NextApiResponse<IResponseDataUser>) {

    switch (req.method) {
        case 'GET':
            return dbErrors( checkJWT(req, res), res ) ;
            
            default:
                return res.status(400).json({ message: 'Bad request' });
    }

}
