export interface AddOrderDto {
  orderAmt: number;
  products: ProductOrderDto[];
}

interface ProductOrderDto {
  productId: string;
  quantity: number;
  price: number;
}
