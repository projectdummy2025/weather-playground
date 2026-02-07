/**
 * Location Search API Route
 * GET /api/locations/search?q={query}
 */

import { NextRequest, NextResponse } from 'next/server';
import { searchLocation } from '@/services/location';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 10;
    
    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }
    
    const results = await searchLocation(query, limit);
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Location search error:', error);
    return NextResponse.json(
      { error: 'Failed to search locations' },
      { status: 500 }
    );
  }
}
