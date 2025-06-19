import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET single tour package
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const tourPackage = await prisma.tourPackage.findUnique({
      where: { id },
    });

    if (!tourPackage) {
      return NextResponse.json(
        { success: false, error: 'Package not found' },
        { status: 404 }
      );
    }

    // Map to match frontend interface
    const mappedPackage = {
      id: tourPackage.id,
      title: tourPackage.name,
      description: tourPackage.description,
      price: tourPackage.price,
      duration: tourPackage.duration,
      includes: [],
      excludes: [],
      image: tourPackage.imageUrl,
      isActive: tourPackage.isActive,
      createdAt: tourPackage.createdAt,
      updatedAt: tourPackage.updatedAt,
    };

    return NextResponse.json({
      success: true,
      data: mappedPackage,
      message: 'Package retrieved successfully'
    });

  } catch (error) {
    console.error('Get package error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update tour package
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, price, duration, image, isActive } = body;

    // Check if package exists
    const existingPackage = await prisma.tourPackage.findUnique({
      where: { id },
    });

    if (!existingPackage) {
      return NextResponse.json(
        { success: false, error: 'Package not found' },
        { status: 404 }
      );
    }

    // Update package
    const updatedPackage = await prisma.tourPackage.update({
      where: { id },
      data: {
        name: title || existingPackage.name,
        description: description ?? existingPackage.description,
        price: price ?? existingPackage.price,
        duration: duration ?? existingPackage.duration,
        imageUrl: image ?? existingPackage.imageUrl,
        isActive: isActive ?? existingPackage.isActive,
      },
    });

    // Map to match frontend interface
    const mappedPackage = {
      id: updatedPackage.id,
      title: updatedPackage.name,
      description: updatedPackage.description,
      price: updatedPackage.price,
      duration: updatedPackage.duration,
      includes: [],
      excludes: [],
      image: updatedPackage.imageUrl,
      isActive: updatedPackage.isActive,
      createdAt: updatedPackage.createdAt,
      updatedAt: updatedPackage.updatedAt,
    };

    return NextResponse.json({
      success: true,
      data: mappedPackage,
      message: 'Package updated successfully'
    });

  } catch (error) {
    console.error('Update package error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete tour package
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if package exists
    const existingPackage = await prisma.tourPackage.findUnique({
      where: { id },
    });

    if (!existingPackage) {
      return NextResponse.json(
        { success: false, error: 'Package not found' },
        { status: 404 }
      );
    }

    // Delete package
    await prisma.tourPackage.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Package deleted successfully'
    });

  } catch (error) {
    console.error('Delete package error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
