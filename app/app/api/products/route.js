/**
 * GET /api/products
 * Query params:
 *   limit     — default 20
 *   skip      — default 0
 *   category  — filter by category
 *   ids       — comma-separated ids (e.g. ids=1,2,3)
 *   select    — comma-separated fields (ignored, all returned)
 */
import { NextResponse } from 'next/server';
import { queryProducts } from './_data';

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const limit    = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
  const skip     = parseInt(searchParams.get('skip') || '0');
  const category = searchParams.get('category') || null;
  const idsRaw   = searchParams.get('ids');
  const ids      = idsRaw ? idsRaw.split(',').map(s => s.trim()) : null;

  const result = queryProducts({ category, ids, limit, skip });

  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'public, max-age=60' },
  });
}
