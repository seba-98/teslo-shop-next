

export interface IUserPaymentData {
    name?            :string,
    lastName?        :string,
    adress?          :string,
    secondAdress?    :string,
    country?         :string,
    postalCode?      :string,
    city?            :string,
    phoneNumber?     :string,
}
export interface IAllPaymentData extends IUserPaymentData{
    quantityProducts:number,
    subTotal        :number,
    taxes           :number,
    total           :number,
}