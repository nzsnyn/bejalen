import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET data for Perahu Mesin page
export async function GET() {
  try {
    // Get Perahu Mesin package details
    const perahuPackage = await prisma.tourPackage.findFirst({
      where: { 
        name: { contains: 'Perahu', mode: 'insensitive' },
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

    // Get gallery items for Perahu Mesin
    const galleryItems = await prisma.gallery.findMany({
      where: { 
        category: 'perahu-mesin',
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
    const bookingsCount = perahuPackage ? await prisma.booking.count({
      where: { packageId: perahuPackage.id }
    }) : 0;

    return NextResponse.json({
      success: true,
      data: {
        package: perahuPackage,
        gallery: galleryItems,
        bookingsCount,
        pageInfo: {
          title: 'Perahu Mesin',
          description: 'Berkeliling Rawa Pening dengan perahu mesin dan menikmati pemandangan',
          features: [
            'Berkeliling Rawa Pening dengan perahu mesin',
            'Pemandangan indah danau dan pegunungan',
            'Spot foto terbaik',
            'Guide lokal berpengalaman',
            'Durasi 4 jam yang menyenangkan',
            'Kapasitas hingga 25 orang'
          ],
          schedule: [
            '08:00 - Berkumpul di dermaga',
            '08:30 - Briefing keselamatan',
            '09:00 - Perjalanan dimulai',
            '10:30 - Istirahat di spot foto',
            '11:30 - Melanjutkan perjalanan',
            '12:00 - Kembali ke dermaga'
          ]
        }
      },
      message: 'Data Perahu Mesin berhasil diambil'
    });

  } catch (error) {
    console.error('Get Perahu Mesin error:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
