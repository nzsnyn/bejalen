import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all tour packages (for both public and admin)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get('admin');
    
    const packages = await prisma.tourPackage.findMany({
      where: admin ? {} : { isActive: true }, // Show all for admin, only active for public
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        duration: true,
        capacity: true,
        imageUrl: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Map to match frontend interface
    const mappedPackages = packages.map(pkg => ({
      id: pkg.id,
      title: pkg.name,
      description: pkg.description,
      price: pkg.price,
      duration: pkg.duration,
      includes: [], // Add if needed
      excludes: [], // Add if needed
      image: pkg.imageUrl,
      isActive: pkg.isActive,
      createdAt: pkg.createdAt,
      updatedAt: pkg.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data: mappedPackages,
      message: admin ? 'All packages retrieved successfully' : 'Active packages retrieved successfully'
    });

  } catch (error) {
    console.error('Get info paket error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new tour package (admin only)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, price, duration, image, isActive = true } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      );
    }

    const newPackage = await prisma.tourPackage.create({
      data: {
        name: title,
        description: description || '',
        price: price || 0,
        duration: duration || '',
        imageUrl: image || '',
        isActive: isActive,
        capacity: 10, // Default capacity
      },
    });

    // Map to match frontend interface
    const mappedPackage = {
      id: newPackage.id,
      title: newPackage.name,
      description: newPackage.description,
      price: newPackage.price,
      duration: newPackage.duration,
      includes: [],
      excludes: [],
      image: newPackage.imageUrl,
      isActive: newPackage.isActive,
      createdAt: newPackage.createdAt,
      updatedAt: newPackage.updatedAt,
    };

    return NextResponse.json({
      success: true,
      data: mappedPackage,
      message: 'Package created successfully'
    });

  } catch (error) {
    console.error('Create package error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
