export type CartItem = {
  productId: string
  quantity: number
  note?: string
}

export type StoredCart = {
  // cartId: string
  // tableToken: string
  items: CartItem[]
  updatedAt: string
}

