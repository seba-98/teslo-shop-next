import mongoose, { Schema, model, Model } from "mongoose";
import { IUser } from "../../interfaces/server_interfaces";



const userSchema = new Schema({

    name       : { type: String, required:true },
    email      : { type: String, required:true, unique:true },
    password   : { type: String, required:true, unique:true },
    phoneNumber: { type: String, required:false, unique:true, validate:{
        validator:(v:string)=>{
            return /^\+(?:[0-9] ?){6,14}[0-9]$/.test(v);
        },
        message: (props:{value:string}) => `${props.value} No es un número telefónico válido`
    }},
    role    : { 
        type: String, 
        emun:{
            values:['admin', 'client'],
            message:'{VALUE} no es un role valido',
            default:'client',
            required:true
        }
    },
},
    {
        timestamps:true
    }
);

//RECORDAR QUE CREARÁ 2 ELEMENTOS (_id, createdAt y updatedAt) tener en cuenta a la hora de crear la interfaz

const User:Model<IUser> = mongoose.models.User || model('User', userSchema);

export default User;