import { IUser } from "../server_interfaces";

export interface IFormRegister{
    name           :string;
    phoneNumber    :string;
    email          :string;
    password       :string;
    confirmPassword:string;
}

export interface IFormLogin{
    email: string;
    password: string;
}

export interface IUserLog{
    token:string;
    user :IUser;
}
