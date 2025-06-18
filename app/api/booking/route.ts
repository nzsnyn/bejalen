import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all bookings (for admin)
export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        package: {
          select: {
            name: true,
            price: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: bookings,
    });

  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

// POST new booking
export async function POST(request: NextRequest) {
  try {
    const { 
      customerName, 
      email, 
      phone, 
      packageId, 
      bookingDate, 
      notes 
    } = await request.json();

    // Validation
    if (!customerName || !email || !phone || !packageId || !bookingDate) {
      return NextResponse.json(
        { success: false, error: 'Semua field wajib harus diisi' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Format email tidak valid' },
        { status: 400 }
      );
    }

    // Phone validation (basic)
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { success: false, error: 'Format nomor telepon tidak valid' },
        { status: 400 }
      );
    }

    // Check if package exists
    const tourPackage = await prisma.tourPackage.findFirst({
      where: { 
        id: packageId,
        isActive: true 
      },
    });

    if (!tourPackage) {
      return NextResponse.json(
        { success: false, error: 'Paket wisata tidak ditemukan' },
        { status: 404 }
      );
    }

    // Validate booking date (must be in the future)
    const selectedDate = new Date(bookingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return NextResponse.json(
        { success: false, error: 'Tanggal booking tidak boleh di masa lalu' },
        { status: 400 }
      );
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        customerName: customerName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        packageId,
        bookingDate: selectedDate,
        totalPrice: tourPackage.price,
        status: 'pending',
        notes: notes?.trim() || null,
      },
      include: {
        package: {
          select: {
            name: true,
            price: true,
            duration: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: booking.id,
        customerName: booking.customerName,
        package: booking.package,
        bookingDate: booking.bookingDate,
        totalPrice: booking.totalPrice,
        status: booking.status,
      },
      message: 'Booking berhasil dibuat. Kami akan menghubungi Anda untuk konfirmasi.'
    });

  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
