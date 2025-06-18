import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET data for Rawa Pening page
export async function GET() {
  try {
    // Get Rawa Pening package details
    const rawaPeningPackage = await prisma.tourPackage.findFirst({
      where: { 
        name: { contains: 'Rawa Pening', mode: 'insensitive' },
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

    // Get gallery items for Rawa Pening
    const galleryItems = await prisma.gallery.findMany({
      where: { 
        category: 'rawa-pening',
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

    // Get all general gallery items as well
    const generalGallery = await prisma.gallery.findMany({
      where: { 
        category: 'general',
        isActive: true 
      },
      take: 6,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
      },
    });

    // Get recent bookings count for this package
    const bookingsCount = rawaPeningPackage ? await prisma.booking.count({
      where: { packageId: rawaPeningPackage.id }
    }) : 0;

    return NextResponse.json({
      success: true,
      data: {
        package: rawaPeningPackage,
        gallery: galleryItems,
        generalGallery,
        bookingsCount,
        pageInfo: {
          title: 'Rawa Pening',
          description: 'Nikmati keindahan Rawa Pening dengan perahu tradisional dan kuliner lokal',
          highlights: [
            'Danau terbesar di Jawa Tengah',
            'Pemandangan pegunungan yang menakjubkan',
            'Kehidupan flora dan fauna yang beragam',
            'Budaya lokal yang masih terjaga',
            'Kuliner tradisional yang lezat'
          ],
          attractions: [
            {
              name: 'Floating Market',
              description: 'Pasar terapung dengan kuliner lokal'
            },
            {
              name: 'Bird Watching',
              description: 'Mengamati berbagai jenis burung'
            },
            {
              name: 'Sunrise View',
              description: 'Pemandangan matahari terbit yang memukau'
            },
            {
              name: 'Traditional Fishing',
              description: 'Pengalaman memancing tradisional'
            }
          ]
        }
      },
      message: 'Data Rawa Pening berhasil diambil'
    });

  } catch (error) {
    console.error('Get Rawa Pening error:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
