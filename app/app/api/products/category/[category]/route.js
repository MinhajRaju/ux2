/**
 * GET /api/products/category/[category]
 */
import { NextResponse } from 'next/server';
import { queryProducts, PRODUCTS } from '../../_data';

export async function GET(request, { params }) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
  const skip  = parseInt(searchParams.get('skip') || '0');

  const result = queryProducts({ category: params.category, limit, skip });
  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'public, max-age=60' },
  });
}
