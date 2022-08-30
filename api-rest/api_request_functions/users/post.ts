import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../db';
import { User } from '../../models';
import bcrypt from 'bcryptjs';
import { jwt, validatePhone } from '../../../utils';
import { isEmail } from '../../../utils/validateEmail';
import { isPhone } from '../../../utils/validatePhone';
import { IResponseDataUser } from '../../../interfaces/server_interfaces';





export const loginUser = async (req: NextApiRequest, res: NextApiResponse<IResponseDataUser>)=>{

    const {email='', password=''} = await req.body;
    const errors=[];

    //---------------VALIDACIONES DE FORMATO EMAIL/PASSWORD-------------
    
    if( password.length < 6 ){
        errors.push('La contraseña debe tener 6 o mas caracteres');
    } 
    if( isEmail( email ) ){
        errors.push( isEmail( email )! )
    } 
    if(errors.length > 0) {
        return res.status(400).json({ errors })
    }
    //---------------VALIDACIONES DE FORMATO EMAIL/PASSWORD-------------
    
    
    await db.connect();
        const user=await User.findOne({ email }).lean(); // primero verificamos via mail que la cuenta exista
    await db.disconnect();
    
    
    
    //---------------||||||||VALIDACIONES DE USUARIO EN BASE DE DATOS||||||||-------------
    if(!user){
        return res.status(401).json({message:'No existe cuenta asociada a ese email'});
    } 
    //la password no cifrada será cifrada al pasarla en el método compareSync()
    if( !bcrypt.compareSync( password, user.password! ) ){
        return res.status(401).json({message:'Correo o contraseña inválidos'})
    }
    //---------------||||||||VALIDACIONES DE USUARIO EN BASE DE DATOS||||||||-------------
    

    const { role, name, _id, phoneNumber } = user;
    const token = jwt.signToken (_id, email );


   return res.status(200).json({  
        token,
        user:{
            _id,
            email,
            phoneNumber,
            role,
            name
        }
    })
}




export const registerUser = async(req: NextApiRequest, res: NextApiResponse<IResponseDataUser>)=> {

    const {name='', email='', phoneNumber='', password=''} = req.body as {name:string, email:string, phoneNumber:string, password:string};
    let errors:string[]=[];

    
    //-----------|||validaciones|||--------------------------------------------
    
    if( password.length < 6 ){
        errors.push('La contraseña debe tener 6 o mas caracteres');
    } 
    if( isPhone(phoneNumber) ){
        errors.push( isPhone(phoneNumber)! );
    } 
    if( name.length < 2 ){
        errors.push('El nombre debe tener 2 o mas caracteres' );
    }
    
    if( isEmail( email ) ){
        errors.push( isEmail( email )! )
    } 

    if(errors.length > 0) {
        return res.status(400).json({ errors })
    }
    
    
    //-----------|||fin validaciones|||--------------------------------------------
    
    
    await db.connect();
    const findUser= await User.findOne({ email }).lean();
    await db.disconnect();

    if( findUser ){ 
        errors.push('Ya existe un usuario registrado con ese email');
        return res.status(400).json({ errors })
    }


    const newUser= new User({
        email:email.toLowerCase(),
        phoneNumber,
        name,
        password: bcrypt.hashSync( password ),
        role:'client'
    })
    const {_id, role} = newUser
    
    try {
        
        await db.connect();
           await newUser.save({ validateBeforeSave:true });
        await db.disconnect();
        
        return res.status(200).json({
            token: jwt.signToken(_id, email),
            user:{
                _id,
                email,
                phoneNumber,
                name,
                role
            }
        })
        
    } catch (error) {
        console.log(error);
        return res.status(200).json({message:'Revisar log del servidor'})
    }
}


