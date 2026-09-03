type OrderStatus =
  | 'NEW'
  | 'ACCEPTED'
// TODO: These are steps suggested, yet won't needed in my MVP
//   | 'PREPARING'
//   | 'READY'
//   | 'SUMUP_ENTERED'
//   | 'PAID'
  | 'CLOSED'

interface OrderItem {
  id: string
  productName: string
  quantity: number
}

interface Order {
  id: string
  orderNumber: number
  tableNumber: number
  status: OrderStatus
  items: OrderItem[]
  total: number
}