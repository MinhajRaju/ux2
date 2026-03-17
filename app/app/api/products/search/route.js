/**
 * GET /api/products/search?q=keyword
 */
import { NextResponse } from 'next/server';
import { queryProducts } from '../_data';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q     = searchParams.get('q') || '';
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
  const skip  = parseInt(searchParams.get('skip') || '0');

  const result = queryProducts({ search: q, limit, skip });
  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'public, max-age=60' },
  });
}
