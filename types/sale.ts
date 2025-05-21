export interface SaleDto {
  id?: number
  saleTime: string
  cashierId: number
  customerId: number
  totalAmount: number
  discount: number
  paidAmount: number
  paymentType: "CASH" | "CARD"
}

export interface SaleItemDto {
  id?: number
  saleId: number
  productId: number
  quantity: number
  pricePerUnit: number
  totalPrice: number
}
