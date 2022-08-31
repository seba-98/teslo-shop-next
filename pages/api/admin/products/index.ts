import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { dbErrors } from "../../../../api-rest/api_request_functions";
import { db } from "../../../../api-rest/db";
import { Product } from "../../../../api-rest/models";
import { ICompleteProduct } from "../../../../interfaces/shared_interfaces";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config( process.env.CLOUDINARY_URL || '' );
type Data = { message: string } | { products: ICompleteProduct[] } | { error: string }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return dbErrors( getProducts(req, res), res );

        case 'PUT':
            return dbErrors( updateProducts	(req, res), res );;

        case 'POST':
            return dbErrors( createProduct(req, res), res );;
    
        default:
            return res.status(400).json({ message: 'Bad request' });
        }
    }



    //https://res.cloudinary.com/dj1tlztph/image/upload/v1661899182/fm0zzcr9qigchvez21o2.png
 
const deleteCloudinaryImg=async(deletedImages:string[])=>{

    deletedImages.forEach( async(img)=>{
        try {
            const fileId= img.substring( img.lastIndexOf('/') + 1 ).split('.')[0];
            await cloudinary.uploader.destroy( fileId );
            
        } catch (error) {
            console.log(error);
            
        }
    })
    
}
    
const getProducts=async(req: NextApiRequest, res: NextApiResponse<Data>)=>{
    await db.connect();
        const products = await Product.find().sort({title:'asc'}).lean();
    await db.disconnect();
    
    return res.status(200).json({ products });
}

const updateProducts=async(req: NextApiRequest, res: NextApiResponse<Data>)=>{

    const { _id='', images=[], deletedImages=[]  } = req.body as ICompleteProduct;
    
    const bodyData ={ ...req.body} as ICompleteProduct;
   
    if( !mongoose.isValidObjectId(_id) ) return res.status(400).json({
        error:'Producto no existe'
    })
    if( images.length < 2 ) return res.status(400).json({
        error:'Son necesarias 2 imagenes'
    })

    await deleteCloudinaryImg(deletedImages);
    
    await db.connect();
    
        const currentProduct = await Product.findById(_id);
        
        if(!currentProduct) throw new Error('Producto no encontrado');

        delete bodyData.deletedImages
        await currentProduct.update( bodyData );
    
    await db.disconnect();
    
    return res.status(200).json({
        message:'Success'    
    });
}

const createProduct=async(req: NextApiRequest, res: NextApiResponse<Data>)=>{
    
    const { images=[], slug, deletedImages=[] } = req.body as ICompleteProduct; 
    const bodyData ={ ...req.body} as ICompleteProduct;


    if( images.length < 2 ) return res.status(400).json({
        error:'Son necesarias 2 imagenes'
    });

    await deleteCloudinaryImg(deletedImages);


    await db.connect();

        const existProduct = await Product.findOne({ slug }).lean();
        if( existProduct ) return res.status(400).json({ error:'Ya existe producto con ese slug' })

        delete bodyData.deletedImages
        const newProduct=new Product( bodyData );
        await newProduct.save();

    await db.disconnect();

    return res.status(201).json({
        message:'Producto creado'
    })
}

