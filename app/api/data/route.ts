import { NextResponse } from 'next/server';
import { getData, setData } from '@/lib/data-store';
import type { AppData } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getData();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Error al leer los datos: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newData = body as AppData;

    // Basic validation
    if (!newData || typeof newData !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Datos inválidos' },
        { status: 400 }
      );
    }

    await setData(newData);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Error al guardar los datos: ' + error.message },
      { status: 500 }
    );
  }
}
