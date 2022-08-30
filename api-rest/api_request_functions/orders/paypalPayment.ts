import axios from "axios";
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { IPaypalOrderStatus } from "../../../interfaces/server_interfaces";
import { db } from "../../db";
import { Order } from "../../models";

                                                                                
const getPaypalBearerToken=async():Promise<string | null> =>{

    /*--Para obtener el token necesitamos--:


    A. Id de cliente, clave secreta y link de generación de token

    B. Establecer en el body el grant_type=client_credentials (formateado) con new URLSearchParams()

    C. Crear una cadena buffer (binario) del id del cliente y la calve secreta dividida por : y esa cadena parsearla a base64

    D.Crear headers de autorización:
        'Content-Type': 'application/x-www-form-urlencoded'
        'Authorization': `Basic ${ cadena buffereada en base64 }`

    E. Hacer la peticion con axios:
        -Url    = Url de token
        -body   = grant_type=client_credentials (ya formateado)
        -headers= Basic ${ cadena ya buffereada en base64 } 
    */


    const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID; //ENVIRONMENTS para generar token de verificación
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
    
    
    const body = new URLSearchParams('grant_type=client_credentials');  //1-Formateamos el body
    const base64Token = Buffer.from(`${PAYPAL_CLIENT}:${PAYPAL_SECRET}`, 'utf-8').toString('base64'); //2-Transformamos las claves de pago en BASE64
    
    try {
       const { data } = await axios.post(       //3-Con la información preparada creamos la petición para obtener el token
            process.env.PAYPAL_OAUTH_URL || '', 
            body,
            {
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded', //4-El contenido es codificado en Base64
                    'Authorization': `Basic ${ base64Token }` //5-Establecemos los headers de autorización
                },
            }
        ) 
        return data.access_token;

    } catch (error) {
        console.log('Error en generar token:',error);
        return null
    }
}


type Data={ message:string }
|
{ error:string }

export const paypalPayment=async(req:NextApiRequest, res:NextApiResponse<Data>)=>{


    /*  ---Para validar el token---

        A. Generar el token con la función realizada.

        B. Obtener transactionId='', orderId='' de la req

        C. Preparamos la petición axios:
            -Url: Url de ordenes de paypal y como param enviamos el transactionId
            -En los headers enviamos el token como header de autorización 'Authorization': `Bearear ${paypalToken}`

        D. Realizamos la petición axios a la URL para ordenes

        E. Verificamos que el estatus sea 'COMPLETED'

        F. Obtenemos de la BD la order por el orderId y verificamos que exista
        
        G. Veríficamos que el total de la orden de la BD sea igual al total de la orden de paypal (Cuidado el value de paypal viene como string)

        h.
    
    */




    const session:any =await getSession({req});
    const paypalToken = await getPaypalBearerToken();   // 1- Obtenemos el token_id para veríficar el estado de la ordén
    const { transactionId='', orderId='' } = req.body;  //2-obtenemos el transactionId y el orderid de la orden que reali-
                                                        // zamos en paypal



    if(!mongoose.isValidObjectId(orderId))return res.status(400).json({      //-Validamos orderId
        message:'Id de ordén inválido'
    })                                                    

    if(!paypalToken) return res.status(400).json({      //-3veríficamos que halla token
        message:'No se pudo generar el token'
    })

   

    try {
        const { data } = await axios.get<IPaypalOrderStatus>(       //4-Obtenemos la orden desde paypal
            `${process.env.PAYPAL_ORDERS_URL}/${ transactionId }`,
            {
                headers: { 
                    'Authorization': `Bearer ${paypalToken}`
                }
            },
        )
        if(data.status !== 'COMPLETED')return res.status(401).json({ //5-Veríficamos su estado
            error:'Ordén no reconocida'
        })
            
        await db.connect();

        
        const foundOrder = await Order.findById(orderId);   //6- Buscamos nuestra orden pero en nuestra BD
        
        if( !foundOrder ){      //7-Veríficamos que exista
            await db.disconnect();
            return res.status(401).json({
                error:'Ordén no reconocida'
            })
        }
                                //8-Veríficamos que el total de la ordén coincida con el valor que guardó paypal
        if(foundOrder.allPaymentData.total !== Number(data.purchase_units[0].amount.value)){  
            await db.disconnect();
            return res.status(401).json({
                error:'Inconsistencia en valores de pago'
            })
        }
        if( JSON.stringify(session.user._id) !== JSON.stringify(foundOrder.user) ) return res.status(400).json({      
            error:'Acceso no autorizado'
        })

        foundOrder.transactionId = transactionId;
        foundOrder.isPaid = true;
        await foundOrder.save();

        await db.disconnect();

        return res.status(200).json({
            message:'Ordén pagada'
        })
            

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            error:'No se pudo realizar el pago'
        })
    }
}