'use client';

import Link from 'next/link';
import { useEffect, useState, Suspense, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, CircleIcon, ClipboardList, Home, LoaderCircle, LogOut, Minus, Plus, ShoppingCart, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut } from '@/app/(login)/actions';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/db/schema';
import { getProductDetails } from '@/lib/menu';
import type { StoredCart } from '@/type/cart';
import useSWR, { mutate } from 'swr';
import { createOrder } from '@/app/orders/actions';
import { useLocalStorage } from '@mantine/hooks';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type OrderSummary = {
  id: string;
  status: 'NEW' | 'ACCEPTED' | 'PAID' | 'CLOSED';
  createdAt: string;
  items: { productId: string; quantity: number }[];
};

const orderStatusLabels: Record<OrderSummary['status'], string> = {
  NEW: 'New',
  ACCEPTED: 'Accepted',
  PAID: 'Paid',
  CLOSED: 'Closed'
};

const orderStatusStyles: Record<OrderSummary['status'], string> = {
  NEW: 'bg-blue-100 text-blue-700',
  ACCEPTED: 'bg-orange-100 text-orange-700',
  PAID: 'bg-green-100 text-green-700',
  CLOSED: 'bg-gray-100 text-gray-700'
};

function UserMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: user } = useSWR<User>('/api/user', fetcher);
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    mutate('/api/user');
    router.push('/');
  }

  if (!user) {
    return (
      <>
        <Link
          href="/pricing"
          className="text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Pricing
        </Link>
        <Button asChild className="rounded-full">
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      </>
    );
  }

  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenuTrigger>
        <Avatar className="cursor-pointer size-9">
          <AvatarImage alt={user.name || ''} />
          <AvatarFallback>
            {user.email
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="flex flex-col gap-1">
        <DropdownMenuItem className="cursor-pointer">
          <Link href="/dashboard" className="flex w-full items-center">
            <Home className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <form action={handleSignOut} className="w-full">
          <button type="submit" className="flex w-full">
            <DropdownMenuItem className="w-full flex-1 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [cart, setCart] = useLocalStorage<StoredCart>({
    key: "wunderbar:cart",
    defaultValue: {
      items: [],
      updatedAt: new Date().toISOString(),
    },
  });
  const [orderError, setOrderError] = useState<string | null>(null);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [isOrderPending, startOrderTransition] = useTransition();
  const tableHash = typeof window === 'undefined'
    ? null
    : new URLSearchParams(window.location.search).get('tableHash');
  const ordersKey = tableHash ? `/api/orders?tableHash=${encodeURIComponent(tableHash)}` : null;
  const { data: orders = [] } = useSWR<OrderSummary[]>(ordersKey, fetcher, {
    refreshInterval: 15000,
    revalidateOnFocus: true
  });
  const orderedItemCount = orders.reduce(
    (total, order) => total + order.items.reduce((orderTotal, item) => orderTotal + item.quantity, 0),
    0
  );
  const totalPrice = cart.items.reduce((total, item) => {
    const { menuItem, subType } = getProductDetails(item.productId);
    const price = Number.parseFloat((subType?.price ?? menuItem?.price ?? '0').split('/')[0]);

    return total + price * item.quantity;
  }, 0);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== 'wunderbar:cart' || !event.newValue) {
        return;
      }

      try {
        setCart(JSON.parse(event.newValue) as StoredCart);
      } catch {
        setCart({ items: [], updatedAt: '' });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  function openCart() {
    const storedCart = window.localStorage.getItem('wunderbar:cart');

    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart) as StoredCart);
      } catch {
        setCart({ items: [], updatedAt: '' });
      }
    } else {
      setCart({ items: [], updatedAt: '' });
    }

    setIsCartOpen(true);
  }

  function changeCartQuantity(productId: string, change: number) {
    setCart((currentCart) => {
      const items = currentCart.items
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + change }
            : item,
        )
        .filter((item) => item.quantity > 0);
      const updatedCart = {
        items,
        updatedAt: new Date().toISOString(),
      };

      window.localStorage.setItem('wunderbar:cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  }

  function sendOrder() {
    setOrderError(null);
    const tableHash = new URLSearchParams(window.location.search).get('tableHash');

    if (!tableHash) {
      setOrderError('Please scan the table QR code before sending your order.');
      return;
    }

    startOrderTransition(async () => {
      const result = await createOrder({ tableHash, items: cart.items });

      if ('error' in result) {
        setOrderError(result.error ?? 'Unable to send your order. Please try again.');
        return;
      }

      const emptyCart = { items: [], updatedAt: new Date().toISOString() };
      setCart(emptyCart);
      setIsCartOpen(false);
      setCreatedOrderId(result.orderId);
      if (ordersKey) {
        mutate(ordersKey);
      }
    });
  }

  useEffect(() => {
    if (!createdOrderId) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setCreatedOrderId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [createdOrderId]);

  return (
    <header className="relative border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <CircleIcon className="h-6 w-6 text-orange-500" />
          <span className="ml-2 text-xl font-semibold text-gray-900">Wunderbar Order</span>
        </Link>
        <div className="flex items-center space-x-4">
          <button
            type="button"
            aria-label="View orders"
            onClick={() => setIsOrdersOpen(true)}
            className="relative inline-flex items-center justify-center rounded-full border border-gray-200 bg-white p-2 text-gray-700 transition hover:border-orange-200 hover:text-orange-600"
          >
            <ClipboardList className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-semibold text-white">
              {orderedItemCount}
            </span>
          </button>
          <button
            type="button"
            aria-label="Shopping cart"
            onClick={openCart}
            className="relative inline-flex items-center justify-center rounded-full border border-gray-200 bg-white p-2 text-gray-700 transition hover:border-orange-200 hover:text-orange-600"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-semibold text-white">
              {cart.items.reduce((total, item) => total + item.quantity, 0)}
            </span>
          </button>
          <Suspense fallback={<div className="h-9" />}>
            <UserMenu />
          </Suspense>
        </div>
      </div>

      {isCartOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-3 pt-4 sm:p-8 sm:pt-10"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-title"
          onClick={() => setIsCartOpen(false)}
        >
          <div
            className="flex max-h-[calc(100dvh-2rem)] w-full max-w-lg flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl sm:max-h-[calc(100dvh-5rem)] sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <h2 id="cart-title" className="text-xl font-semibold text-gray-900">
                Shopping Cart
              </h2>
              <button
                type="button"
                aria-label="Close shopping cart"
                onClick={() => setIsCartOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {cart.items.length > 0 ? (
              <div className="mt-4 min-h-0 flex-1 divide-y divide-gray-100 overflow-y-auto pr-2">
                {cart.items.map((item) => {
                  const { menuItem, subType } = getProductDetails(item.productId);
                  const itemPrice = Number.parseFloat((subType?.price ?? menuItem?.price ?? '0').split('/')[0]);
                  const itemName = menuItem
                    ? subType
                      ? `${menuItem.name_german} (${subType.name})`
                      : menuItem.name_german
                    : item.productId;

                  return (
                    <div
                      key={item.productId}
                      className="flex items-center justify-between gap-4 py-4"
                    >
                      <div className="min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className="shrink-0 text-xs font-semibold text-orange-600">
                            {menuItem?.number ?? '-'}
                          </span>
                          <span className="break-words text-sm font-medium text-gray-700">
                            {itemName}
                          </span>
                        </div>
                        {menuItem?.name_chinese ? (
                          <span className="mt-1 block text-xs text-gray-500">
                            {menuItem.name_chinese}
                          </span>
                        ) : null}
                        <span className="mt-1 block text-xs text-gray-500">
                          Einzelpreis: {itemPrice.toFixed(2)} €
                        </span>
                      </div>
                      <div className="flex shrink-0 items-center gap-2 rounded-full border border-orange-200 bg-orange-50 p-1">
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${itemName}`}
                          onClick={() => changeCartQuantity(item.productId, -1)}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-orange-700 transition hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-6 text-center text-sm font-semibold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label={`Increase quantity of ${itemName}`}
                          onClick={() => changeCartQuantity(item.productId, 1)}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-orange-700 transition hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="py-10 text-center text-sm text-gray-500">
                Your shopping cart is empty.
              </p>
            )}

            <div className="mt-4 flex shrink-0 items-center justify-between rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 pt-4">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="text-xl font-bold text-orange-600">
                {totalPrice.toFixed(2)} €
              </span>
            </div>
            {orderError ? (
              <p className="mt-3 text-right text-sm text-red-600" role="alert">
                {orderError}
              </p>
            ) : null}
            <div className="mt-4 flex shrink-0 items-center justify-end">
              <Button type="button" size="lg" onClick={sendOrder} disabled={isOrderPending}>
                {isOrderPending ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : null}
                {isOrderPending ? 'Sending...' : 'Send Order'}
              </Button>
            </div>
          </div>
          
        </div>
      ) : null}

      {isOrdersOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-3 pt-4 sm:p-8 sm:pt-10"
          role="dialog"
          aria-modal="true"
          aria-labelledby="orders-title"
          onClick={() => setIsOrdersOpen(false)}
        >
          <div
            className="flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl sm:max-h-[calc(100dvh-5rem)] sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div>
                <h2 id="orders-title" className="text-xl font-semibold text-gray-900">
                  Your Orders
                </h2>
                <p className="mt-1 text-sm text-gray-500">{orderedItemCount} items ordered</p>
              </div>
              <button
                type="button"
                aria-label="Close orders"
                onClick={() => setIsOrdersOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {orders.length > 0 ? (
              <div className="mt-4 min-h-0 flex-1 space-y-4 overflow-y-auto pr-2">
                {orders.map((order) => (
                  <section key={order.id} className="rounded-xl border border-gray-200 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                      <div>
                        <h3 className="font-mono text-sm font-semibold text-gray-900">{order.id}</h3>
                        <p className="mt-1 text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${orderStatusStyles[order.status]}`}>
                        {orderStatusLabels[order.status]}
                      </span>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {order.items.map((item, index) => {
                        const { menuItem, subType } = getProductDetails(item.productId);

                        return (
                          <div key={`${order.id}-${item.productId}-${index}`} className="flex items-center justify-between gap-4 py-3 last:pb-0">
                            <div className="min-w-0">
                              <div className="flex items-baseline gap-2">
                                <span className="shrink-0 text-xs font-semibold text-orange-600">{menuItem?.number ?? '-'}</span>
                                <span className="break-words text-sm font-medium text-gray-700">
                                  {menuItem
                                    ? subType
                                      ? `${menuItem.name_german} (${subType.name})`
                                      : menuItem.name_german
                                    : item.productId}
                                </span>
                              </div>
                              {menuItem?.name_chinese ? <span className="mt-1 block text-xs text-gray-500">{menuItem.name_chinese}</span> : null}
                            </div>
                            <span className="shrink-0 text-sm font-semibold text-gray-900">x {item.quantity}</span>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <p className="py-10 text-center text-sm text-gray-500">
                {tableHash ? 'No orders have been sent yet.' : 'Scan the table QR code to view orders.'}
              </p>
            )}
          </div>
        </div>
      ) : null}

      {createdOrderId ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-950/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-success-title"
          onClick={() => setCreatedOrderId(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-orange-100 bg-white p-7 text-center shadow-2xl sm:p-9"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
            </div>
            <h2 id="order-success-title" className="mt-5 text-2xl font-bold text-gray-900">
              Order sent successfully
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Thank you. Your order has been sent to the kitchen.
            </p>
            <p className="mt-4 rounded-lg bg-orange-50 px-3 py-2 font-mono text-xs text-orange-800">
              Order ID: {createdOrderId}
            </p>
            <Button
              type="button"
              size="lg"
              className="mt-6 w-full"
              onClick={() => setCreatedOrderId(null)}
            >
              Done
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col min-h-screen">
      <Header />
      {children}
    </section>
  );
}
