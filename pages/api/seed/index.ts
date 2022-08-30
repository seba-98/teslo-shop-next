// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { db, seedData } from '../../../api-rest/db';
import { Product, User } from '../../../api-rest/models';



type Data = {
  message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  
  if(process.env.NODE_ENV === 'production') return res.status(400).json({
    message:'No tiene permisos para acceder a esta ruta'
  })

  
  
  if (req.method === 'GET') {
    await db.connect();
      // await Product.insertMany(seedData.initialData.products);
      await User.insertMany(seedData.initialData.users);
    await db.disconnect();
    
    return res.status(200).json({
      message:'Productos añadidos'
    })
  }
  if (req.method === 'DELETE') {
    
    await db.connect();
      await Product.deleteMany()
      await User.deleteMany()
    await db.disconnect();

    return res.status(200).json({
        message:'Productos eliminados'
    })
    
  }

  return res.status(200).json({ message: 'invalid method' })
}