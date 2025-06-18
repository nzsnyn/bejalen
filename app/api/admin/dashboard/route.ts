import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get statistics
    const [
      totalBookings,
      totalPackages,
      totalContacts,
      totalGalleryItems,
      recentBookings,
      pendingBookings,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.tourPackage.count({ where: { isActive: true } }),
      prisma.contact.count(),
      prisma.gallery.count({ where: { isActive: true } }),
      prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          package: {
            select: { name: true }
          }
        }
      }),
      prisma.booking.count({ where: { status: 'pending' } }),
    ]);

    // Calculate revenue (dummy calculation for demo)
    const totalRevenue = await prisma.booking.aggregate({
      where: { status: 'confirmed' },
      _sum: { totalPrice: true }
    });

    const stats = {
      totalBookings,
      totalPackages,
      totalContacts,
      totalGalleryItems,
      pendingBookings,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      recentBookings,
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
