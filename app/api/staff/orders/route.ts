import { z } from 'zod';
import { and, eq, ne } from 'drizzle-orm';
import { getUser } from '@/lib/db/queries';
import { db } from '@/lib/db/drizzle';
import { orders, restaurantTables } from '@/lib/db/schema';
import { getStaffOrders } from '@/lib/db/queries';

const statusUpdateSchema = z.object({
  orderId: z.string().uuid().optional(),
  tableNumber: z.number().int().min(1).max(16).optional()
}).refine((value) => Boolean(value.orderId) !== (value.tableNumber !== undefined), {
  message: 'Provide either an order ID or a table number.'
});

export async function GET() {
  if (!(await getUser())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return Response.json(await getStaffOrders());
}

export async function PATCH(request: Request) {
  if (!(await getUser())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parsedBody = statusUpdateSchema.safeParse(await request.json());
  if (!parsedBody.success) {
    return Response.json({ error: parsedBody.error.errors[0]?.message ?? 'Invalid request.' }, { status: 400 });
  }

  if (parsedBody.data.tableNumber !== undefined) {
    const table = await db.query.restaurantTables.findFirst({
      where: eq(restaurantTables.number, parsedBody.data.tableNumber)
    });

    if (!table) {
      return Response.json({ error: 'Table not found.' }, { status: 404 });
    }

    await db
      .update(orders)
      .set({ status: 'CLOSED', updatedAt: new Date() })
      .where(and(eq(orders.tableId, table.id), ne(orders.status, 'CLOSED')));

    return Response.json({ success: true });
  }

  const order = await db.query.orders.findFirst({
    where: eq(orders.id, parsedBody.data.orderId!)
  });

  if (!order) {
    return Response.json({ error: 'Order not found.' }, { status: 404 });
  }

  const nextStatus = order.status === 'NEW'
    ? 'ACCEPTED'
    : order.status === 'ACCEPTED'
      ? 'CLOSED'
      : null;

  if (!nextStatus) {
    return Response.json({ error: 'This order is already closed.' }, { status: 409 });
  }

  const [updatedOrder] = await db
    .update(orders)
    .set({ status: nextStatus, updatedAt: new Date() })
    .where(and(eq(orders.id, order.id), eq(orders.status, order.status)))
    .returning({ status: orders.status });

  if (!updatedOrder) {
    return Response.json({ error: 'The order changed. Please refresh and try again.' }, { status: 409 });
  }

  return Response.json(updatedOrder);
}