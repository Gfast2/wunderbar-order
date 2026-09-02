import {  StoredCart } from "@/type/cart"

// 2 hours in milliseconds
const CART_TTL = 2 * 60 * 60 * 1000

// FIXME: in near future when load existing cart, check if it's expired.
const isExpired = (cart: StoredCart) =>
  Date.now() - new Date(cart.updatedAt).getTime() > CART_TTL