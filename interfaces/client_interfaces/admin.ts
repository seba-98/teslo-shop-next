import { IOrderItem } from "../server_interfaces";
import { IAllPaymentData } from "../shared_interfaces";

export interface User {
    _id:   string;
    email: string;
}

export interface IGetAdminOrder {
    _id:           string;
    user:          User;
    orderItems:    IOrderItem[];
    allPaymentData:IAllPaymentData;
    isPaid:        boolean;
    createdAt:     string;
    updatedAt:     string;
    __v?:          number;
    transactionId: string;
}