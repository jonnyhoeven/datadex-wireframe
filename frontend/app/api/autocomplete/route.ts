import { NextRequest, NextResponse } from 'next/server';
import { fetchCKAN } from '../../../lib/ckan';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get('q');
    const limit = searchParams.get('limit') || '10';

    if (!q) {
        return NextResponse.json({ result: [] });
    }

    try {
        const result = await fetchCKAN('package_autocomplete', { q, limit });
        return NextResponse.json({ result });
    } catch (error) {
        console.error('Autocomplete error:', error);
        return NextResponse.json({ error: 'Failed to fetch autocomplete' }, { status: 500 });
    }
}
