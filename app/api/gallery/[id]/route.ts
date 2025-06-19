import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get gallery item from database
    const galleryItem = await prisma.gallery.findUnique({
      where: { id },
    });

    if (!galleryItem) {
      return NextResponse.json(
        { success: false, error: 'Gallery item not found' },
        { status: 404 }
      );
    }

    // Delete file from filesystem if it exists
    if (galleryItem.imageUrl.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), 'public', galleryItem.imageUrl);
      if (existsSync(filePath)) {
        try {
          await unlink(filePath);
        } catch (fileError) {
          console.error('Error deleting file:', fileError);
          // Continue with database deletion even if file deletion fails
        }
      }
    }

    // Delete from database
    await prisma.gallery.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Gallery item deleted successfully',
    });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
