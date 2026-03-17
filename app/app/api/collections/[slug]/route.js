/**
 * GET /api/collections/[slug]
 * Slugs: featured | new-arrivals | best-sellers | flash-sale
 */
import { NextResponse } from 'next/server';
import { queryProducts, COLLECTIONS } from '../../products/_data';

export async function GET(request, { params }) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
  const skip  = parseInt(searchParams.get('skip') || '0');

  const col = COLLECTIONS[params.slug];
  if (!col) {
    return NextResponse.json({ message: 'Collection not found', available: Object.keys(COLLECTIONS) }, { status: 404 });
  }

  const result = queryProducts({ collection: params.slug, limit, skip });
  return NextResponse.json({
    name:     col.name,
    slug:     params.slug,
    ...result,
  }, {
    headers: { 'Cache-Control': 'public, max-age=30' },
  });
}
