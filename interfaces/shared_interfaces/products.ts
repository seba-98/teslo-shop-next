

export type IValidSizes = 'XS'|'S'|'M'|'L'|'XL'|'XXL'|'XXXL' | undefined;
export type IValidType = 'shirts'|'pants'|'hoodies'|'hats';


export type IValidSize ={ value:IValidSizes, inStock:number, price:number, _id?:string }


export interface ICompleteProduct{
    _id?:string,
    description: string;
    images: string[];
    price: number;
    sizes: IValidSize[];
    slug: string;
    tags: string[];
    title: string;
    type: IValidType;
    gender: 'men'|'women'|'kid'|'unisex',
    createdAt?:string,
    updatedAt?:string,

}