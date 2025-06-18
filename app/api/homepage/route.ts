import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET homepage data
export async function GET() {
  try {
    // Get homepage content from database
    const homepageRecord = await prisma.homepageContent.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' }
    });

    // Default content fallback
    const defaultContent = {
      hero: {
        title: "Desa Wisata, Desa Budaya, Desa Bejalen",
        subtitle: "Dukungan dan kedatangan Anda tidak hanya menciptakan pengalaman bermakna, tetapi juga memberdayakan ekonomi lokal",
        backgroundImage: "/header-home.png"
      },
      about: {
        title: "Desa Wisata Untuk Masa Berkelanjutan",
        description: "Desa Bejalen merupakan salah satu destinasi desa wisata yang terletak di Kecamatan Ambarawa, Kabupaten Semarang, Provinsi Jawa Tengah. Desa ini terletak tepat di pinggir Danau Rawa Pening yang dikelilingi oleh rangkaian pegunungan, yaitu Gunung Merbabu, Gunung Telomoyo, dan Gunung Ungaran."
      },
      rawaPening: {
        title: "Vast Expanse of Swamp Water",
        subtitle: "Desa Wisata Bejalen",
        description: "Menyegarkan pikiran di akhir pekan tidak memerlukan rencana wisata yang mewah. Rekreasi sederhana di Rawa Pening saja bisa jadi kegiatan yang menyenangkan.",
        image: "/header-home2.png"
      },
      destinations: {
        title: "Pada Desa Hepi Desa Bejalen",
        subtitle: "Destinasi"
      }
    };

    // Use database content if available, otherwise use default
    const content = homepageRecord ? homepageRecord.content : defaultContent;

    // Get featured packages for homepage
    const featuredPackages = await prisma.tourPackage.findMany({
      where: { isActive: true },
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        duration: true,
        imageUrl: true,
      },
    });

    // Get featured gallery items for homepage
    const featuredGallery = await prisma.gallery.findMany({
      where: { isActive: true },
      take: 6,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        category: true,
      },
    });

    // Get statistics for homepage
    const stats = {      totalPackages: await prisma.tourPackage.count({ where: { isActive: true } }),
      totalBookings: await prisma.booking.count(),
      totalGallery: await prisma.gallery.count({ where: { isActive: true } }),
    };

    return NextResponse.json({
      success: true,
      data: {
        content,
        featuredPackages,
        featuredGallery,
        stats,
      },
      message: 'Data homepage berhasil diambil'
    });
  } catch (error) {
    console.error('Get homepage error:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

// PUT update homepage content
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Data konten tidak valid' },
        { status: 400 }
      );
    }    // Validate content structure
    const requiredFields = ['hero', 'about', 'rawaPening', 'destinations'];
    for (const field of requiredFields) {
      if (!content[field]) {
        return NextResponse.json(
          { success: false, error: `Field ${field} tidak boleh kosong` },
          { status: 400 }
        );
      }
    }

    // Save content to database
    const updatedHomepage = await prisma.homepageContent.upsert({
      where: { id: 'default' },
      update: { 
        content: content,
        version: { increment: 1 },
        updatedAt: new Date()
      },
      create: { 
        id: 'default',
        content: content,
        isActive: true,
        version: 1
      }
    });

    return NextResponse.json({
      success: true,
      data: { 
        content: updatedHomepage.content,
        version: updatedHomepage.version,
        updatedAt: updatedHomepage.updatedAt
      },
      message: 'Konten homepage berhasil diperbarui'
    });

  } catch (error) {
    console.error('Update homepage error:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

// GET version history
export async function PATCH() {
  try {
    const allVersions = await prisma.homepageContent.findMany({
      orderBy: { version: 'desc' },
      select: {
        id: true,
        version: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return NextResponse.json({
      success: true,
      data: allVersions,
      message: 'Version history retrieved successfully'
    });

  } catch (error) {
    console.error('Get version history error:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
