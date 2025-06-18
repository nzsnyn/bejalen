import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all active tour packages for info paket page
export async function GET() {
  try {
    const packages = await prisma.tourPackage.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        duration: true,
        capacity: true,
        imageUrl: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: packages,
      message: 'Data paket wisata berhasil diambil'
    });

  } catch (error) {
    console.error('Get info paket error:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
