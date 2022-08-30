import { db } from "../db"
import { User } from "../models";
import bcrypt from 'bcryptjs';
import { isEmail } from '../../utils/validateEmail';


/*Función para comprobar los usuarios logeados con NextAuth */

export const checkUserEmailPassword=async(email:string='', password:string='')=>{

    await db.connect();

        const user = await User.findOne({email}).lean();

    await db.disconnect();


    if(!user) return null; /*Si el login falla debemos regresar null, nunca un objeto */

    if( !bcrypt.compareSync(password, user.password!)) return null
        
    
    const {
        _id,
        name,
        phoneNumber,
        location,
        role,
    }=user;

    return {_id, name, phoneNumber, location, role, email}
}


export const checkUserByEmail=async(email:string='', name:string='')=>{

    if(email === '' || isEmail(email)) return null;
    let newUser;

    await db.connect();
    const foundUser = await User.findOne({email}).lean().select('_id name email role');
    
    if(foundUser) {
        await db.disconnect();
        return foundUser
    };
    try {
        newUser = new User({
            email:        email.toLowerCase(),
            phoneNumber:  '+0000000',
            name:         name,
            password:     '@',
            role:        'client'
        })
    
        await newUser.save();
        await db.disconnect();
    } catch (error) {
        console.log(error);
    }

    return newUser
}