import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET data for Kampoeng Rawa page
export async function GET() {
  try {
    // Get Kampoeng Rawa package details
    const kampoengPackage = await prisma.tourPackage.findFirst({
      where: { 
        name: { contains: 'Kampoeng', mode: 'insensitive' },
        isActive: true 
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        duration: true,
        capacity: true,
        imageUrl: true,
      },
    });

    // Get gallery items for Kampoeng Rawa
    const galleryItems = await prisma.gallery.findMany({
      where: { 
        category: 'kampoeng-rawa',
        isActive: true 
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
      },
    });

    // Get recent bookings count for this package
    const bookingsCount = kampoengPackage ? await prisma.booking.count({
      where: { packageId: kampoengPackage.id }
    }) : 0;

    return NextResponse.json({
      success: true,
      data: {
        package: kampoengPackage,
        gallery: galleryItems,
        bookingsCount,
        pageInfo: {
          title: 'Kampoeng Rawa',
          description: 'Pengalaman menginap di rumah tradisional dengan aktivitas budaya',
          features: [
            'Menginap di rumah tradisional',
            'Aktivitas budaya lokal',
            'Kuliner tradisional',
            'Pemandangan Rawa Pening',
            'Interaksi dengan masyarakat lokal'
          ]
        }
      },
      message: 'Data Kampoeng Rawa berhasil diambil'
    });

  } catch (error) {
    console.error('Get Kampoeng Rawa error:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
