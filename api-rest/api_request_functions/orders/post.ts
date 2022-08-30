import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import { IOrder } from '../../../interfaces/server_interfaces/';
import { db } from '../../db';
import { Order, Product } from '../../models';
import { IOrderItem } from '../../../interfaces/server_interfaces/orders';


type Data = {data: any} | {message:string}


export const createOrder=async(req:NextApiRequest, res:NextApiResponse<Data>)=>{

    const session = await getSession({req}) as {user: {     //OBTENEMOS LA SESSION Y LE DAMOS TIPADO
        _id: string,
        name:string ,
        email: string,
        role: string
    },
    expires: string
    accessToken: string
    };



    if(!session){
        return res.status(401).json({
            message:'Debe estar auntenticado para acceder'   //VALIDACIÓN DE LA SESIÓN
        })
    }


    const { orderItems, allPaymentData, user } = req.body as IOrder;  //OBTENEMOS DATOS DE COMPRA

    const productsIds = orderItems.map(p=>  p._id);  //CREAMOS UN array de ids de nuestros productos


    await db.connect();

        const dbProducts = await Product.find({ _id: { $in: productsIds }});  //productos en la BD que coinciden con esas id

       try {

            const subTotal =  orderItems.reduce( (total, item)=>{  //con el reduce recorremos el orderItems
                const product = dbProducts.find(prod=> prod.id === item._id)// obtenemos el item pero de la base de datos

                //----------------obtenemos el producto POR SIZE---------------------------
                const productSize = product!.sizes.find(size=> size.value === item.size);   

                const priceBySize = productSize!.price;
                const inStockBySize = productSize!.inStock;

                if( inStockBySize < item.quantity ) throw new Error(`La compra supera el stock de ${item.slug}`); 
                if(!priceBySize) throw new Error("Verifique el carrito nuevamente, producto no existe");

                
                return total+= priceBySize * item.quantity 
            }, 0);
            const taxes = subTotal * Number(process.env.NEXT_PUBLIC_TAX_RATE) / 100;
            const backendTotal = subTotal + taxes;

            
            if(backendTotal !== allPaymentData.total)  throw new Error('Datos de compra erroneos');
            if( session.user._id !== user) throw new Error('Datos de usuario erroneos');


            //ACTUALIZAMOS LA BD CON LA CANTIDAD DE PRODUCTOS
            const updatedProducts = dbProducts.map(p=>{  //recorremos todos los productos que fueron comprados

               p.sizes = p.sizes.map((psize)=>{  //recorremos los sizes para modificar SU STOCK

                    const oit=orderItems.find((oItem:IOrderItem)=> oItem.size=== psize.value) //obtenemos el producto por size

                    if(oit){
                        psize.inStock = psize.inStock - oit.quantity   //reducimos el stock del size
                        return psize
                    }
                    return psize
                })
                return p

            })

            await Product.deleteMany({_id:{$in: productsIds}}) //eliminamos los productos modificados
            await Product.insertMany(updatedProducts);  //los actualizamos

            
            const newOrder = new Order({
                ...req.body,
                allPaymentData:{
                    ...allPaymentData,
                    backendTotal,
                    taxes
                },
                isPaid:false,
                orderItems:orderItems
            })


            newOrder.allPaymentData.total = Math.round( newOrder.allPaymentData.total * 100 ) / 100
            
            const savedOrder = await newOrder.save();
            await db.disconnect();
            
            

            return res.status(201).json({
                message: savedOrder.id
            })


            
        } catch (error:any) {
            console.log(error);
            
           return res.status(400).json({
               message:error.message || 'Revisar logs en servidor'
           })
        
       }
        

    // await db.disconnect();
}