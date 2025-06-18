import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all contacts (for admin)
export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        subject: true,
        message: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: contacts,
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

// POST new contact message
export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'Nama, email, subjek, dan pesan harus diisi' },
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

    // Create contact
    const contact = await prisma.contact.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        subject: subject.trim(),
        message: message.trim(),
        status: 'new',
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: contact.id,
        message: 'Pesan Anda berhasil dikirim. Kami akan menghubungi Anda segera.'
      },
    });

  } catch (error) {
    console.error('Create contact error:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
