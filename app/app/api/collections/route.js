/**
 * GET /api/collections — list all collections
 */
import { NextResponse } from 'next/server';
import { COLLECTIONS } from '../products/_data';

export async function GET() {
  const list = Object.entries(COLLECTIONS).map(([slug, col]) => ({
    slug,
    name: col.name,
    count: col.productIds.length,
  }));
  return NextResponse.json({ collections: list });
}
