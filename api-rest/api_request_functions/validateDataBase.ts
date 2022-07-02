import type { NextApiResponse } from 'next'

type data = {message:string};
type func= Promise<void>


//DBErros have as function catch errors when you are making a request to the database, this function recives the method function through params and execute
//it between a trycatch
const catchBDErrors=async(func:func, res:NextApiResponse<data>)=>{

    try {
        await func
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error en la base de datos, estamos trabajando en ello'})
    }

}

export default catchBDErrors;