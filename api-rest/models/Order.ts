import mongoose, { Model, model, Schema } from "mongoose";
import { IOrder } from '../../interfaces/server_interfaces/';

const orderSchema= new Schema({

    user                : { type: Schema.Types.ObjectId, ref:'User', required: true },  //asociamos el campo user con el userSchema
    orderItems: [{
        _id             : {type: Schema.Types.ObjectId, ref:'Product', required:true},
        title           : {type: String, required:true},
        size            : {type: String, required:true},
        quantity        : {type: Number, required:true},
        slug            : {type: String, required:true},
        image           : {type: String, required:true},
        price           : {type: Number, required:true},  
    }],
    allPaymentData:{
        name            : { type: String, required:true },
        lastName        : { type: String, required:true },
        adress          : { type: String, required:true },
        secondAdress    : { type: String },
        country         : { type: String, required:true },
        postalCode      : { type: String, required:true },
        city            : { type: String, required:true },
        phoneNumber     : { type: String, required:true },
        quantityProducts: { type: Number, required:true },
        subTotal        : { type: Number, required:true },        
        taxes           : { type: Number, required:true },           
        total           : { type: Number, required:true },         
    },
    isPaid              : { type: Boolean, required:true, default:false } ,
    paidAt              : { type: String } ,
    transactionId       : { type:String } 
},
{
    timestamps:true,
}
)



const Order:Model<IOrder> = mongoose.models.Order || model('Order', orderSchema);

export default Order;