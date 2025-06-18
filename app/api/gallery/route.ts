import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET gallery items with optional category filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');

    const whereClause: any = { isActive: true };
    
    if (category && category !== 'all') {
      whereClause.category = category;
    }

    const queryOptions: any = {
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        category: true,
        createdAt: true,
      },
    };

    if (limit) {
      queryOptions.take = parseInt(limit);
    }

    const gallery = await prisma.gallery.findMany(queryOptions);

    // Get available categories
    const categories = await prisma.gallery.groupBy({
      by: ['category'],
      where: { isActive: true },
      _count: {
        category: true,
      },
    });    return NextResponse.json({
      success: true,
      data: {
        items: gallery,
        categories: categories.map((cat: any) => ({
          name: cat.category,
          count: cat._count.category,
        })),
        total: gallery.length,
      },
      message: 'Data gallery berhasil diambil'
    });

  } catch (error) {
    console.error('Get gallery error:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
