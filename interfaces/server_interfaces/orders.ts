import { IAllPaymentData, IValidSizes } from "../shared_interfaces";
import { IUser } from "./";

export interface IOrder{
    _id?            : string;
    user?           : IUser | string;
    orderItems      : IOrderItem[];
    allPaymentData  : IAllPaymentData
    isPaid          : boolean;
    paidAt?         : string;
    createdAt?      : string;
    updatedAt?      : string;
    transactionId?  : string;
} 

export interface IOrderItem{
    _id         : string;
    title       : string;
    size        : IValidSizes;
    quantity    : number;
    slug        : string;
    image       : string;
    price       : number;
    gender?     : string;
}

export interface IGetOrder{
    _id?            : string;
    user?           : IUser;
    orderItems      : IOrderItem[];
    allPaymentData  : IAllPaymentData
    isPaid          : boolean;
    paidAt?         : string;
    createdAt?      : string;
    updatedAt?      : string;
} 