import { getOrdersByIds, getOrdersForTable } from '@/lib/db/queries';

export async function GET(request: Request) {
  const tableHash = new URL(request.url).searchParams.get('tableHash')?.trim();
  const orderIds = new URL(request.url).searchParams.get('orderIds')?.split(',').filter(Boolean) ?? [];
  const validOrderIds = orderIds.filter((orderId) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(orderId),
  );

  if (orderIds.length > 0) {
    return Response.json(validOrderIds.length > 0 ? await getOrdersByIds(validOrderIds) : []);
  }

  if (!tableHash) {
    return Response.json({ error: 'A table hash is required.' }, { status: 400 });
  }

  const orders = await getOrdersForTable(tableHash);
  return Response.json(orders);
}