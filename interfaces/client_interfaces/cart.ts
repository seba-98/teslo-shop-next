import { IValidSizes } from "../shared_interfaces";

export interface ICartProduct{
    _id?:string,
    image: string;
    price: number;
    size?: IValidSizes;
    slug: string;
    title: string;
    gender: 'men'|'women'|'kid'|'unisex',
    quantity: number;
    inStock: number;
}