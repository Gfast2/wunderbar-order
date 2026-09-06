'use client';

import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { Bell, Check, ChevronDown, ClipboardList, LoaderCircle, Volume2, VolumeX } from 'lucide-react';
import { getProductDetails } from '@/lib/menu';
import { Button } from '@/components/ui/button';

type OrderStatus = 'NEW' | 'ACCEPTED' | 'PAID' | 'CLOSED';

type StaffOrder = {
  id: string;
  tableNumber: number;
  status: OrderStatus;
  createdAt: string;
  items: { productId: string; quantity: number }[];
};

type View = 'orders' | 'desks';

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Unable to load orders.');
  }
  return response.json() as Promise<StaffOrder[]>;
};

const statusLabels: Record<OrderStatus, string> = {
  NEW: 'NEW',
  ACCEPTED: 'ACCEPTED',
  PAID: 'PAID',
  CLOSED: 'CLOSED'
};

const statusStyles: Record<OrderStatus, string> = {
  NEW: 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100',
  ACCEPTED: 'border-sky-300 bg-sky-50 text-sky-800 hover:bg-sky-100',
  PAID: 'border-green-300 bg-green-50 text-green-800 hover:bg-green-100',
  CLOSED: 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
};

function OrderCard({
  order,
  pendingOrderId,
  error,
  onAdvance
}: {
  order: StaffOrder;
  pendingOrderId: string | null;
  error: string | null;
  onAdvance: (orderId: string) => void;
}) {
  const isPending = pendingOrderId === order.id;

  return (
    <article className="overflow-hidden rounded-sm border border-zinc-300 bg-[#fffdf7] shadow-[3px_3px_0_rgba(39,39,42,0.08)]">
      <div className="border-b border-dashed border-zinc-300 px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-zinc-500">Order ID</p>
            <h2 className="mt-1 break-all font-mono text-sm font-bold text-zinc-900">{order.id}</h2>
          </div>
          <div className="text-right text-sm text-zinc-600">
            <p className="font-semibold">Desk {order.tableNumber}</p>
            <p className="mt-1 text-xs">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="px-5 py-3">
        <div className="grid grid-cols-[1fr_auto] border-b border-zinc-200 pb-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
          <span>Item</span>
          <span>Qty</span>
        </div>
        <div className="divide-y divide-dashed divide-zinc-200">
          {order.items.map((item, index) => {
            const { menuItem, subType } = getProductDetails(item.productId);
            const itemName = menuItem
              ? subType
                ? `${menuItem.name_german} (${subType.name})`
                : menuItem.name_german
              : item.productId;

            return (
              <div key={`${order.id}-${item.productId}-${index}`} className="grid grid-cols-[1fr_auto] gap-4 py-3 text-sm">
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="shrink-0 text-xs font-bold uppercase tracking-[0.08em] text-amber-700">
                      {menuItem?.number ?? '-'}
                    </span>
                    <span className="break-words font-medium text-zinc-800">{itemName}</span>
                  </div>
                  {menuItem?.name_chinese ? (
                    <span className="mt-1 block text-xs tracking-[0.08em] text-zinc-500">
                      {menuItem.name_chinese}
                    </span>
                  ) : null}
                </div>
                <span className="self-start font-semibold text-zinc-900">{item.quantity}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-dashed border-zinc-300 px-5 py-4">
        <button
          type="button"
          disabled={order.status === 'CLOSED' || pendingOrderId !== null}
          onClick={() => onAdvance(order.id)}
          className={`flex min-h-11 w-full items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-bold tracking-[0.12em] transition disabled:cursor-not-allowed disabled:opacity-60 ${statusStyles[order.status]}`}
        >
          {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : order.status === 'CLOSED' ? <Check className="h-4 w-4" /> : null}
          {isPending ? 'UPDATING...' : statusLabels[order.status]}
        </button>
        {error ? <p className="mt-2 text-center text-xs text-red-600" role="alert">{error}</p> : null}
      </div>
    </article>
  );
}

export default function StaffPage() {
  const [view, setView] = useState<View>('orders');
  const [expandedDesk, setExpandedDesk] = useState<number | null>(null);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [pendingDeskNumber, setPendingDeskNumber] = useState<number | null>(null);
  const [actionErrors, setActionErrors] = useState<Record<string, string>>({});
  const [soundEnabled, setSoundEnabled] = useState(false);
  const knownOrderIds = useRef<Set<string> | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const { data: orders = [], error: loadError, mutate } = useSWR('/api/staff/orders', fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true
  });

  useEffect(() => {
    const currentIds = new Set(orders.map((order) => order.id));

    if (knownOrderIds.current) {
      const hasNewOrder = orders.some(
        (order) => order.status === 'NEW' && !knownOrderIds.current?.has(order.id),
      );

      if (hasNewOrder && soundEnabled) {
        const context = audioContext.current ?? new AudioContext();
        audioContext.current = context;
        const notes = [880, 1174, 880];
        notes.forEach((frequency, index) => {
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          const startAt = context.currentTime + index * 0.65;
          oscillator.frequency.value = frequency;
          gain.gain.setValueAtTime(0.0001, startAt);
          gain.gain.exponentialRampToValueAtTime(0.18, startAt + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.45);
          oscillator.connect(gain).connect(context.destination);
          oscillator.start(startAt);
          oscillator.stop(startAt + 0.45);
        });
      }
    }

    knownOrderIds.current = currentIds;
  }, [orders, soundEnabled]);

  function toggleSound() {
    if (!soundEnabled) {
      const context = audioContext.current ?? new AudioContext();
      audioContext.current = context;
      void context.resume();
    }
    setSoundEnabled((enabled) => !enabled);
  }

  async function updateOrder(orderId: string) {
    setPendingOrderId(orderId);
    setActionErrors((current) => ({ ...current, [orderId]: '' }));

    try {
      const response = await fetch('/api/staff/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });
      const result = await response.json() as { error?: string };

      if (!response.ok) {
        throw new Error(result.error ?? 'Unable to update order.');
      }

      await mutate();
    } catch (error) {
      setActionErrors((current) => ({
        ...current,
        [orderId]: error instanceof Error ? error.message : 'Unable to update order.'
      }));
    } finally {
      setPendingOrderId(null);
    }
  }

  async function closeDeskOrders(tableNumber: number) {
    const deskOrderCount = deskOrders(tableNumber).length;

    if (!window.confirm(`Close all ${deskOrderCount} open orders for Desk ${tableNumber}? This cannot be undone.`)) {
      return;
    }

    setPendingDeskNumber(tableNumber);
    const errorKey = `desk-${tableNumber}`;
    setActionErrors((current) => ({ ...current, [errorKey]: '' }));

    try {
      const response = await fetch('/api/staff/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableNumber })
      });
      const result = await response.json() as { error?: string };

      if (!response.ok) {
        throw new Error(result.error ?? 'Unable to close desk orders.');
      }

      await mutate();
      setExpandedDesk(null);
    } catch (error) {
      setActionErrors((current) => ({
        ...current,
        [errorKey]: error instanceof Error ? error.message : 'Unable to close desk orders.'
      }));
    } finally {
      setPendingDeskNumber(null);
    }
  }

  const deskOrders = (tableNumber: number) => orders.filter((order) => order.tableNumber === tableNumber);
  const visibleOrders = view === 'orders' ? orders : [];

  return (
    <main className="min-h-screen bg-[#f5f1e8] text-zinc-900">
      <header className="border-b border-zinc-300 bg-[#fffdf7] px-5 py-5 shadow-sm sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">Wunderbar Order</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Staff Console</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleSound}
              aria-label={soundEnabled ? 'Disable new order sound' : 'Enable new order sound'}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm font-semibold text-zinc-700 transition hover:border-amber-400 hover:text-amber-700"
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              {soundEnabled ? 'Sound on' : 'Enable sound'}
            </button>
            <span className="hidden items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 sm:inline-flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Live refresh
            </span>
          </div>
        </div>
        <div className="mx-auto mt-5 flex max-w-7xl rounded-lg border border-zinc-300 bg-zinc-100 p-1" role="tablist" aria-label="Staff views">
          <button
            type="button"
            role="tab"
            aria-selected={view === 'orders'}
            onClick={() => setView('orders')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition ${view === 'orders' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
          >
            <ClipboardList className="h-4 w-4" /> Order List
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === 'desks'}
            onClick={() => setView('desks')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition ${view === 'desks' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
          >
            <Bell className="h-4 w-4" /> Desk Overview
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 sm:py-8">
        {loadError ? <p className="mb-5 rounded-md bg-red-50 p-3 text-sm text-red-700">{loadError.message}</p> : null}

        {view === 'orders' ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleOrders.length ? visibleOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                pendingOrderId={pendingOrderId}
                error={actionErrors[order.id] || null}
                onAdvance={updateOrder}
              />
            )) : <EmptyState message="No orders have arrived yet." />}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 16 }, (_, index) => index + 1).map((tableNumber) => {
              const ordersForDesk = deskOrders(tableNumber);
              const isExpanded = expandedDesk === tableNumber;
              const deskError = actionErrors[`desk-${tableNumber}`];
              const hasOrders = ordersForDesk.length > 0;

              return (
                <section
                  key={tableNumber}
                  className={`rounded-xl border p-4 transition-colors ${
                    hasOrders
                      ? 'border-amber-300 bg-[#fffdf7] shadow-sm hover:border-amber-400'
                      : 'border-dashed border-zinc-200 bg-zinc-100/60 shadow-none'
                  } ${isExpanded ? 'sm:col-span-2 lg:col-span-4' : ''}`}
                >
                  {hasOrders ? (
                    <button
                      type="button"
                      onClick={() => setExpandedDesk(isExpanded ? null : tableNumber)}
                      className="flex w-full items-end justify-between text-left"
                      aria-expanded={isExpanded}
                    >
                      <span className="text-3xl font-bold text-zinc-900">{tableNumber}</span>
                      <span className="flex items-center gap-2 rounded-full bg-amber-100 px-2.5 py-1 text-sm font-semibold text-amber-800">
                        orders: {ordersForDesk.length}
                        <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </span>
                    </button>
                  ) : (
                    <div className="flex items-end justify-between" aria-label={`Desk ${tableNumber}, no orders`}>
                      <span className="text-3xl font-bold text-zinc-400">{tableNumber}</span>
                      <span className="text-sm font-semibold text-zinc-400">orders: 0</span>
                    </div>
                  )}

                  {isExpanded ? (
                    <div className="mt-5 border-t border-zinc-200 pt-5">
                      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {ordersForDesk.length ? ordersForDesk.map((order) => (
                          <OrderCard
                            key={order.id}
                            order={order}
                            pendingOrderId={pendingOrderId}
                            error={actionErrors[order.id] || null}
                            onAdvance={updateOrder}
                          />
                        )) : <p className="text-sm text-zinc-500">No orders for this desk.</p>}
                      </div>
                      <p className="mt-5 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-center text-xs font-semibold text-red-700">
                        This closes every open order at Desk {tableNumber}.
                      </p>
                      <Button
                        type="button"
                        variant="destructive"
                        className="mt-3 w-full border-red-700 bg-red-700 font-bold text-white shadow-sm hover:bg-red-800"
                        disabled={pendingDeskNumber !== null || ordersForDesk.every((order) => order.status === 'CLOSED')}
                        onClick={() => closeDeskOrders(tableNumber)}
                      >
                        {pendingDeskNumber === tableNumber ? <LoaderCircle className="animate-spin" /> : null}
                        {pendingDeskNumber === tableNumber ? 'Closing...' : 'Close All'}
                      </Button>
                      {deskError ? <p className="mt-2 text-center text-xs text-red-600" role="alert">{deskError}</p> : null}
                    </div>
                  ) : null}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

function EmptyState({ message }: { message: string }) {
  return <div className="col-span-full rounded-xl border border-dashed border-zinc-300 bg-white/60 px-6 py-16 text-center text-sm text-zinc-500">{message}</div>;
}