import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subdomain = searchParams.get('subdomain');

    if (!subdomain) {
      return NextResponse.json(
        { error: 'Subdomain is required' },
        { status: 400 }
      );
    }

    // In production, fetch from backend
    const church = {
      id: 'church-1',
      name: 'Grace Community Church',
      subdomain,
      logo: null,
      theme: {
        primaryColor: '#3b82f6',
      },
    };

    return NextResponse.json(church);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch church' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, subdomain, address, city, state, zip, phone } = body;

    // Validate required fields
    if (!name || !subdomain) {
      return NextResponse.json(
        { error: 'Name and subdomain are required' },
        { status: 400 }
      );
    }

    // In production, create via backend API
    const church = {
      id: `church-${Date.now()}`,
      name,
      subdomain,
      address,
      city,
      state,
      zip,
      phone,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(church, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create church' },
      { status: 500 }
    );
  }
}
