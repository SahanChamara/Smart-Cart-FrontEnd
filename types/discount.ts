export interface DiscountDto {
  id?: number
  name: string
  percentage: number
  startDate: string
  endDate: string
  applicableProducts: Product[]
}

export interface Product {
  id: number
  name: string
  barcode: string
  category: string
  quantity: number
  costPrice: number
  sellingPrice: number
  expiryDate: string
  supplier: Supplier
}

export interface Supplier {
  id: number
  name: string
  contactNumber: string
  email: string
}
