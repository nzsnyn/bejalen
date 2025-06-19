import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET info paket content
export async function GET() {
  try {
    // Get or create info paket content
    let content = await prisma.infoPaketContent.findFirst();

    if (!content) {
      // Create default content if not exists
      content = await prisma.infoPaketContent.create({
        data: {
          title: 'Info Paket\nWisata',
          promoImage: '/poster.png',
          isActive: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        content: {
          title: content.title,
          promoImage: content.promoImage,
          isActive: content.isActive,
        },
        version: content.version,
        updatedAt: content.updatedAt,
      },
      message: 'Info paket content retrieved successfully'
    });

  } catch (error) {
    console.error('Get info paket content error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update info paket content
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

    const { title, promoImage, isActive } = content;

    // Get existing content or create new one
    let existingContent = await prisma.infoPaketContent.findFirst();

    let updatedContent;
    if (existingContent) {
      // Update existing content
      updatedContent = await prisma.infoPaketContent.update({
        where: { id: existingContent.id },
        data: {
          title: title || existingContent.title,
          promoImage: promoImage || existingContent.promoImage,
          isActive: isActive ?? existingContent.isActive,
          version: existingContent.version + 1,
        },
      });
    } else {
      // Create new content
      updatedContent = await prisma.infoPaketContent.create({
        data: {
          title: title || 'Info Paket\nWisata',
          promoImage: promoImage || '/poster.png',
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
          promoImage: updatedContent.promoImage,
          isActive: updatedContent.isActive,
        },
        version: updatedContent.version,
        updatedAt: updatedContent.updatedAt,
      },
      message: 'Info paket content updated successfully'
    });

  } catch (error) {
    console.error('Update info paket content error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
