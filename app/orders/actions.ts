'use server';

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { orderItems, orders, restaurantTables } from '@/lib/db/schema';

const createOrderSchema = z.object({
  tableHash: z.string().trim().min(1).max(64),
  items: z
    .array(
      z.object({
        productId: z.string().trim().min(1).max(200),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
});

export async function createOrder(input: unknown) {
  const parsedInput = createOrderSchema.safeParse(input);

  if (!parsedInput.success) {
    return { error: 'Your cart is empty or contains invalid items.' };
  }

  const { tableHash, items } = parsedInput.data;
  const table = await db.query.restaurantTables.findFirst({
    where: eq(restaurantTables.tableHash, tableHash),
  });

  if (!table) {
    return { error: 'This table could not be found. Please scan the QR code again.' };
  }

  const [order] = await db.transaction(async (tx) => {
    const [createdOrder] = await tx
      .insert(orders)
      .values({ tableId: table.id })
      .returning({ id: orders.id });

    await tx.insert(orderItems).values(
      items.map((item) => ({
        orderId: createdOrder.id,
        productName: item.productId,
        quantity: item.quantity,
      })),
    );

    return [createdOrder];
  });

  return { orderId: order.id };
}
