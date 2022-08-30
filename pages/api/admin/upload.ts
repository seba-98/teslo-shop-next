import type { NextApiRequest, NextApiResponse } from 'next';
import { dbErrors } from '../../../api-rest/api_request_functions';
import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';


cloudinary.config( process.env.CLOUDINARY_URL || '' );


type Data = {message: string} | {error: string}

export const config = {
    api: {
        bodyParser: false
    }
}


export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'POST':
            
            return dbErrors( uploadFiles(req, res), res );
    
        default:
            return res.status(400).json({ message: 'Bad request' });
        }
    }


    
    
    const saveFile=async(file:formidable.File)=>{
        const {secure_url} = await cloudinary.uploader.upload( file.filepath ); 
        
        return secure_url;
    }

    const parseImages=async(req: NextApiRequest):Promise<string>=>{

        return new Promise((resolve, reject)=>{
            const form = new formidable.IncomingForm();
            form.parse(req, async(err, fields, files)=>{
                console.log(err, fields, files);

                if(err) {
                    return reject(err);
                }
                const pathFile = await saveFile( files.file as formidable.File);

                resolve(pathFile);
            })
        })
    }
    
    
    const uploadFiles=async(req: NextApiRequest, res: NextApiResponse<Data>)=>{
        
        try {

            const imageUrl = await parseImages(req);

            return res.status(200).json({ message: imageUrl });
            
        } catch (error) {
            
            return res.status(400).json({ error: 'error' });
        }
        
    }

    
    //FILESYSTEM SHOULDN'T DO IT 
    // import fs from 'fs';

        // const saveFile=(file:formidable.File)=>{
        //     const data = fs.readFileSync(file.filepath); 
        //     fs.writeFileSync(`./public/${file.originalFilename}`, data);
        //     fs.unlinkSync( file.filepath );
        //     return;
        // }
    
    
        // const parseImages=async(req: NextApiRequest)=>{
    
        //     return new Promise((resolve, reject)=>{
        //         const form = new formidable.IncomingForm();
        //         form.parse(req, async(err, fields, files)=>{
        //             console.log(err, fields, files);
    
        //             if(err) {
        //                 return reject(err);
        //             }
        //             saveFile( files.file as formidable.File);
    
        //             resolve(true);
        //         })
        //     })
        // }
