'use client';

import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { CircleIcon, Home, LogOut, ShoppingCart, X } from 'lucide-react';
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
import { findMenuItem } from '@/lib/menu';
import type { StoredCart } from '@/type/cart';
import useSWR, { mutate } from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

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
  const [cart, setCart] = useState<StoredCart>({ items: [], updatedAt: '' });
  const totalPrice = cart.items.reduce((total, item) => {
    const menuItem = findMenuItem(item.productId);
    const price = Number.parseFloat(menuItem?.price.split('/')[0] ?? '0');

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
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-20 sm:p-8 sm:pt-24"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-title"
          onClick={() => setIsCartOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl"
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
              <div className="mt-4 max-h-[calc(100vh-14rem)] overflow-y-auto divide-y divide-gray-100 pr-2">
                {cart.items.map((item) => {
                  const menuItem = findMenuItem(item.productId);
                  const itemPrice = Number.parseFloat(menuItem?.price.split('/')[0] ?? '0');

                  return (
                    <div
                      key={item.productId}
                      className="flex items-center justify-between gap-4 py-4"
                    >
                      <div className="min-w-0">
                        <span className="block break-words text-sm text-gray-700">
                          {menuItem?.name_german ?? item.productId}
                        </span>
                        <span className="text-xs text-gray-500">
                          {item.quantity} x {itemPrice.toFixed(2)} €
                        </span>
                      </div>
                      <span className="shrink-0 rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
                        {(itemPrice * item.quantity).toFixed(2)} €
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="py-10 text-center text-sm text-gray-500">
                Your shopping cart is empty.
              </p>
            )}

            <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="text-lg font-bold text-orange-600">
                {totalPrice.toFixed(2)} €
              </span>
            </div>
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
