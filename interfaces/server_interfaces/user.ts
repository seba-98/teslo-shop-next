
export type IRole = 'admin' | 'client';

export interface IUser{
    _id        :string;
    name       :string;
    email      :string;
    phoneNumber:string;
    password?  :string;
    location?  :string; 
    role       :IRole;

    createdAt? :string;
    updatedAt? :string;
}


export type IResponseDataUser = 
{
    token:string,
    user: {
        _id:string;
        email:string;
        phoneNumber:string;
        location?:string,
        role:string;
        name:string;
    },
} 
| 
{message:string}
|
{errors:string[]}
|
{token:string}
