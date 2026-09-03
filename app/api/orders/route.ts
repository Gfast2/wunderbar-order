import { getOrdersForTable } from '@/lib/db/queries';

export async function GET(request: Request) {
  const tableHash = new URL(request.url).searchParams.get('tableHash')?.trim();

  if (!tableHash) {
    return Response.json({ error: 'A table hash is required.' }, { status: 400 });
  }

  const orders = await getOrdersForTable(tableHash);
  return Response.json(orders);
}