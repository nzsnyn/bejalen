import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET perahu mesin content
export async function GET() {
  try {
    // Get or create perahu mesin content
    let content = await prisma.perahuMesinContent.findFirst();

    if (!content) {
      // Create default content if not exists
      content = await prisma.perahuMesinContent.create({
        data: {
          title: 'Perahu\nMesin',
          headerImage: '/perahuMesinHeader.png',
          description: 'Arungi luasnya Rawa Pening dengan menaiki perahu mesin pada Desa Wisata Bejalen. Nikmati serunya menaiki perahu dengan keluarga, orang tersayang sambil menikmati pemandangan alam sekitar.',
          weekdayPrice: 'IDR. 120.000',
          weekendPrice: 'IDR. 150.000',
          capacity: '8',
          duration: '30 menit',
          isActive: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        content: {
          title: content.title,
          headerImage: content.headerImage,
          description: content.description,
          weekdayPrice: content.weekdayPrice,
          weekendPrice: content.weekendPrice,
          capacity: content.capacity,
          duration: content.duration,
          isActive: content.isActive,
        },
        version: content.version,
        updatedAt: content.updatedAt,
      },
      message: 'Perahu mesin content retrieved successfully'
    });

  } catch (error) {
    console.error('Get perahu mesin content error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update perahu mesin content
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }

    const { title, headerImage, description, weekdayPrice, weekendPrice, capacity, duration, isActive } = content;

    // Get existing content or create new one
    let existingContent = await prisma.perahuMesinContent.findFirst();

    let updatedContent;
    if (existingContent) {
      // Update existing content
      updatedContent = await prisma.perahuMesinContent.update({
        where: { id: existingContent.id },
        data: {
          title: title || existingContent.title,
          headerImage: headerImage || existingContent.headerImage,
          description: description || existingContent.description,
          weekdayPrice: weekdayPrice || existingContent.weekdayPrice,
          weekendPrice: weekendPrice || existingContent.weekendPrice,
          capacity: capacity || existingContent.capacity,
          duration: duration || existingContent.duration,
          isActive: isActive ?? existingContent.isActive,
          version: existingContent.version + 1,
        },
      });
    } else {
      // Create new content
      updatedContent = await prisma.perahuMesinContent.create({
        data: {
          title: title || 'Perahu\nMesin',
          headerImage: headerImage || '/perahuMesinHeader.png',
          description: description || 'Arungi luasnya Rawa Pening dengan menaiki perahu mesin pada Desa Wisata Bejalen. Nikmati serunya menaiki perahu dengan keluarga, orang tersayang sambil menikmati pemandangan alam sekitar.',
          weekdayPrice: weekdayPrice || 'IDR. 120.000',
          weekendPrice: weekendPrice || 'IDR. 150.000',
          capacity: capacity || '8',
          duration: duration || '30 menit',
          isActive: isActive ?? true,
          version: 1,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        content: {
          title: updatedContent.title,
          headerImage: updatedContent.headerImage,
          description: updatedContent.description,
          weekdayPrice: updatedContent.weekdayPrice,
          weekendPrice: updatedContent.weekendPrice,
          capacity: updatedContent.capacity,
          duration: updatedContent.duration,
          isActive: updatedContent.isActive,
        },
        version: updatedContent.version,
        updatedAt: updatedContent.updatedAt,
      },
      message: 'Perahu mesin content updated successfully'
    });

  } catch (error) {
    console.error('Update perahu mesin content error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
