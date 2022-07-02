import type { NextApiRequest, NextApiResponse } from 'next'
import { dbErrors, userPost } from '../../../api-rest/api_request_functions'
import { IResponseDataUser } from '../../../interfaces/server_interfaces/user';


const { registerUser } = userPost

export default function (req: NextApiRequest, res: NextApiResponse<IResponseDataUser>) {

    switch (req.method) {
        case 'POST':
            return dbErrors( registerUser(req, res), res )
            
        default:
            return res.status(400).json({ message: 'bad request' })
    }

}