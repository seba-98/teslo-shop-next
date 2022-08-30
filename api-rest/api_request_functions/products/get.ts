import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../db'
import { Product } from '../../models'
import { SHOP_CONSTANTS } from '../../db/constants';
import { IData } from '../../../interfaces/server_interfaces';


export const getProducts = async(req:NextApiRequest, res:NextApiResponse<IData>)=> {  //TODOS LOS PRODUCTOS

    const { gender='all' }= req.query;

    let condition = {};
    
    if( gender !== 'all' && SHOP_CONSTANTS.validGenders.includes(`${gender}`) ) {

      condition = { gender }

    }  

    await db.connect()
                                    //si no hay gender la condicion queda vacia y trae todos los artículos
      const products = await Product.find( condition ).sort({title:'asc'}).select('title images sizes slug -_id ').lean();

    await db.disconnect()

    return res.status(200).json(products)
    
}


export const getProductBySlug = async(req:NextApiRequest, res:NextApiResponse<IData>)=>{ //OBTENER PROUCTO POR SLUG

  const{slug}=req.query

  await db.connect();
    const product = await Product.findOne({ slug }).select('sizes').lean();
  await db.disconnect();

  if(!product ) return res.status(200).json({message: 'No existe el artículo' });

  return res.status(200).json(product);
    
}


export const searchProducts=async(req:NextApiRequest, res:NextApiResponse<IData>)=>{ //PRODUCTOS POR BUSQUEDA DE QUERY

  let { q='' } = req.query;

  q=q.toString().toLowerCase().replace(/ /g, "").trim();

  await db.connect();        //en los elementos de tipo text definidos en el esquema (title, tags), buscará si se encuentra el valor de q
   const products = await Product.find({  $text:{ $search:q }  }).select('title images sizes slug -_id').lean();
  await db.disconnect();

  return res.status(200).json(products);

}