import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { dbErrors } from "../../../../api-rest/api_request_functions";
import { db } from "../../../../api-rest/db";
import { Product } from "../../../../api-rest/models";
import { ICompleteProduct } from "../../../../interfaces/shared_interfaces";
import {v2 as cloudinary} from 'cloudinary';


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



 
const deleteCloudinaryImg=async()=>{

    // await cloudinary.


}
    
const getProducts=async(req: NextApiRequest, res: NextApiResponse<Data>)=>{
    await db.connect();
        const products = await Product.find().sort({title:'asc'}).lean();
    await db.disconnect();
    
    return res.status(200).json({ products });
}
const updateProducts=async(req: NextApiRequest, res: NextApiResponse<Data>)=>{

    const { _id='', images=[]  } = req.body as ICompleteProduct;

    if( !mongoose.isValidObjectId(_id) ) return res.status(400).json({
        error:'Producto no existe'
    })
    if( images.length < 2 ) return res.status(400).json({
        error:'Son necesarias 2 imagenes'
    })
    
    await db.connect();
    const currentProduct = await Product.findById(_id);
    
    if(!currentProduct) throw new Error('Producto no encontrado');

    await currentProduct.update( req.body );
    
    await db.disconnect();
    
    return res.status(200).json({
        message:'Success'    
    });
    
    
}

const createProduct=async(req: NextApiRequest, res: NextApiResponse<Data>)=>{
    
    const { images=[], slug } = req.body as ICompleteProduct; 

    console.log(req.body);
    

    if( images.length < 2 ) return res.status(400).json({
        error:'Son necesarias 2 imagenes'
    });


    await db.connect();

        const existProduct = await Product.findOne({ slug }).lean();
        if( existProduct ) return res.status(400).json({ error:'Ya existe producto con ese slug' })

        const newProduct=new Product( req.body );
        await newProduct.save();

    await db.disconnect();

    return res.status(201).json({
        message:'Producto creado'
    })
}

