import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import { db } from '../../../api-rest/db';
import { Order, Product, User } from '../../../api-rest/models';

type Data = {
    numberOfOrders          : number;
    paidOrders              : number;
    notPaidOrders           : number;
    numberOfClients         : number;
    numberOfProducts        : number;
    productsWithNoInventory : number;
    lowInventory            : number;
}
|
{ error:string}
|
{ message:string}

export default async function Handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    try {

        const session:any =await getSession( {req} );
        if(session.user.role !== 'admin') return res.status(401).json({ 
            error: 'Acceso no autorizado'
        });
    
        await db.connect();

            let lowInventory=0;
            const [
                numberOfOrders,
                paidOrders,
                notPaidOrders,
                numberOfClients,
                allProducts,
            ] = await Promise.all([
                Order.count(),
                Order.find({ isPaid:true }).count(),
                Order.find({ isPaid:false }).count(),
                User.find({ role:'client' }).count(),
                Product.find(),
            ])
        await db.disconnect();
    
        const numberOfProducts = allProducts.reduce((sum, prev)=>{
            const allQuantitySizes = prev.sizes.reduce((acum, size)=>( acum += size.inStock), 0);
            return sum += allQuantitySizes;
        },0)
    
        const productsWithNoInventory = allProducts.reduce((sum, prev)=>{
            const allQuantitySizes = prev.sizes.reduce((acum, size)=>{
                if(size.inStock === 0){
                    acum += 1;
                }
                if(size.inStock < 10){
                    lowInventory += 1;
                }
                return acum;
            }, 0);
    
            sum += allQuantitySizes;
            return sum;
        },0)
    
        
        return res.status(200).json({ 
            numberOfOrders,
            paidOrders,
            notPaidOrders,
            numberOfClients,
            numberOfProducts,
            productsWithNoInventory,
            lowInventory,
        });

        
    } catch (error) {
        console.log(error);
        return res.status(404).json({ 
            error:'Error de sistema'
        });
    }
}