import mongoose, {Schema, model, Model, } from "mongoose";
import { ICompleteProduct } from "../../interfaces/shared_interfaces";

const productSchema= new Schema({
    description:{
        type:String, 
        required:true
    },
    images:[{
        type:String, 
        required:true
    }],
    sizes:[
            {
                value:{
                    type:String,
                    enum:{
                        values:['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
                        message:'{VALUE} no es un size válido'
                    }
                },
                price:{
                    type:Number, 
                    required:true, 
                    default:0
                },
                inStock:{
                    type:Number, 
                    required:true, 
                    default:0
                },
            }
            ]
    ,
    slug:{
        type:String,
        required:true,
        unique:true
    },
    tags:[{
        type:String,
        required:true
    }],
    title:{

    },
    type:{
        type:String,
        enum:{
            values:['shirts','pants','hoodies','hats'],
            message:'{VALUE} no es un tipo válido'
        }

    },
    gender:{
        type:String,
        enum:{
            values:['men','women','kid','unisex'],
            message:'{VALUE} no es un genero válido'
        }

    },

},
{
    timestamps: true
});


// crear indice de búsqueda de mongo, para ello específicamos los campos del esquema dentro del objeto del índice
//Luego en el metodo .find del Esquema al utilizarlo en una petición usaremos la siguiente condición {  $text:{ $search:q }  }
productSchema.index({title:'text', tags:'text'});           

                                        //mongoose models busca el modelo Product, si no existe lo creamos con el productSchema

const Product: Model<ICompleteProduct> = mongoose.models.Product || model('Product', productSchema);

export default Product;