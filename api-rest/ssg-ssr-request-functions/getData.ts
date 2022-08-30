//función para enviar la data al GetStaticProps

import { ICompleteProduct } from "../../interfaces/shared_interfaces";
import { db } from "../db"
import { Order, Product } from "../models";
import { IGetOrder, IOrder } from '../../interfaces/server_interfaces/orders';
import { isValidObjectId } from "mongoose";



export const getFilterProducts = async(url:string | undefined = undefined ):Promise<ICompleteProduct[]> =>{

   let findProducts;

   await db.connect();
      if(!url) {
         findProducts = await Product.find().select('title images sizes slug -_id').lean();
      }else{
         findProducts = await Product.find({  $text:{ $search:url }  }).select('title images sizes slug -_id').lean();
      }
   await db.disconnect();


   return JSON.parse( JSON.stringify( findProducts ) );
}


export const getDataItem= async(slug:string):Promise<ICompleteProduct | null>=>{

   await db.connect();
      const findProduct = await Product.findOne({slug}).select('title images description slug _id gender tags sizes type').lean();
   await db.disconnect();

   if (!findProduct){
      return null
   }

   return JSON.parse(JSON.stringify(findProduct));
}



interface ProductSlug{
   slug:string
}

export const getProductsSlug=async(): Promise<ProductSlug[]> =>{

   await db.connect();
      const slugs=await Product.find().select('slug -_id').lean();
   await db.disconnect();

   return slugs;
}



export const getOrderById=async(id:string):Promise<IOrder | null>=>{

   if( !isValidObjectId(id)) return null;

   await db.connect();
       const order= await Order.findById(id).lean(); 
   await db.disconnect();

   if(!order) return null;

   return JSON.parse(JSON.stringify(order))
}



export const getOrdersByUser=async(user:string):Promise<IGetOrder[]>=>{

   if( !isValidObjectId(user) ) return [];

   await db.connect();
   const orders= await Order.find({user:user}).lean();
   await db.disconnect();

   return JSON.parse(JSON.stringify(orders));

}