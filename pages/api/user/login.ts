import type { NextApiRequest, NextApiResponse } from 'next'
import { userPost } from '../../../api-rest/api_request_functions';
import { dbErrors } from '../../../api-rest/api_request_functions';
import { IResponseDataUser } from '../../../interfaces/server_interfaces';



const { loginUser } = userPost

export default function Handler(req: NextApiRequest, res: NextApiResponse<IResponseDataUser>) {
   
    switch  (req.method) {
        case 'POST':
            return dbErrors(  loginUser(req, res), res  );
        default:
            return res.status(400).json({
                message:'bad request'
            });
    }
}

