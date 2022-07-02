//función para enviar la data al GetStaticProps

import { ICompleteProduct } from "../../interfaces/shared_interfaces";
import { db } from "../db"
import { Product } from "../models";



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
      const findProduct = await Product.findOne({slug}).select('title images description sizes slug _id').lean();
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


