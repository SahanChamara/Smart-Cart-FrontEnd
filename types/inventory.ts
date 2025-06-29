export interface InventoryLogDto {
  id?: number
  productId: number
  changeAmount: number
  reason: string
  updatedById?: number
}
