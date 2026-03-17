/**
 * GET /api/products/[id]
 */
import { NextResponse } from 'next/server';
import { PRODUCTS } from '../_data';

export async function GET(request, { params }) {
  const product = PRODUCTS.find(p => String(p.id) === String(params.id));
  if (!product) {
    return NextResponse.json({ message: 'Product not found' }, { status: 404 });
  }
  return NextResponse.json(product, {
    headers: { 'Cache-Control': 'public, max-age=60' },
  });
}
