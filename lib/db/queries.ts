import { desc, and, eq, isNull } from 'drizzle-orm';
import { db } from './drizzle';
import {
  activityLogs,
  orderItems,
  orders,
  restaurantTables,
  teamMembers,
  teams,
  users
} from './schema';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/session';

export async function getUser() {
  const sessionCookie = (await cookies()).get('session');
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const sessionData = await verifyToken(sessionCookie.value);
  if (
    !sessionData ||
    !sessionData.user ||
    typeof sessionData.user.id !== 'number'
  ) {
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }

  const user = await db
    .select()
    .from(users)
    .where(and(eq(users.id, sessionData.user.id), isNull(users.deletedAt)))
    .limit(1);

  if (user.length === 0) {
    return null;
  }

  return user[0];
}

export async function getTeamByStripeCustomerId(customerId: string) {
  const result = await db
    .select()
    .from(teams)
    .where(eq(teams.stripeCustomerId, customerId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateTeamSubscription(
  teamId: number,
  subscriptionData: {
    stripeSubscriptionId: string | null;
    stripeProductId: string | null;
    planName: string | null;
    subscriptionStatus: string;
  }
) {
  await db
    .update(teams)
    .set({
      ...subscriptionData,
      updatedAt: new Date()
    })
    .where(eq(teams.id, teamId));
}

export async function getUserWithTeam(userId: number) {
  const result = await db
    .select({
      user: users,
      teamId: teamMembers.teamId
    })
    .from(users)
    .leftJoin(teamMembers, eq(users.id, teamMembers.userId))
    .where(eq(users.id, userId))
    .limit(1);

  return result[0];
}

export async function getActivityLogs() {
  const user = await getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  return await db
    .select({
      id: activityLogs.id,
      action: activityLogs.action,
      timestamp: activityLogs.timestamp,
      ipAddress: activityLogs.ipAddress,
      userName: users.name
    })
    .from(activityLogs)
    .leftJoin(users, eq(activityLogs.userId, users.id))
    .where(eq(activityLogs.userId, user.id))
    .orderBy(desc(activityLogs.timestamp))
    .limit(10);
}

export async function getTeamForUser() {
  const user = await getUser();
  if (!user) {
    return null;
  }

  const result = await db.query.teamMembers.findFirst({
    where: eq(teamMembers.userId, user.id),
    with: {
      team: {
        with: {
          teamMembers: {
            with: {
              user: {
                columns: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      }
    }
  });

  return result?.team || null;
}

export async function getOrdersForTable(tableHash: string) {
  const rows = await db
    .select({
      order: orders,
      item: orderItems
    })
    .from(orders)
    .innerJoin(restaurantTables, eq(orders.tableId, restaurantTables.id))
    .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
    .where(eq(restaurantTables.tableHash, tableHash))
    .orderBy(desc(orders.createdAt), desc(orderItems.id));

  const groupedOrders = new Map<string, {
    id: string;
    status: typeof orders.$inferSelect.status;
    createdAt: Date;
    items: { productId: string; quantity: number }[];
  }>();

  for (const row of rows) {
    const existingOrder = groupedOrders.get(row.order.id);

    if (existingOrder) {
      existingOrder.items.push({
        productId: row.item.productName,
        quantity: row.item.quantity
      });
      continue;
    }

    groupedOrders.set(row.order.id, {
      id: row.order.id,
      status: row.order.status,
      createdAt: row.order.createdAt,
      items: [{
        productId: row.item.productName,
        quantity: row.item.quantity
      }]
    });
  }

  return Array.from(groupedOrders.values());
}
