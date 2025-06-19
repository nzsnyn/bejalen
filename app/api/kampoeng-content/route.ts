import { NextResponse } from 'next/server';

// In-memory storage for the session (will reset on server restart)
let currentKampoengRawaContent = {
  title: 'Kampoeng\nRawa',
  headerImage: '/kampoengRawa.png',
  description: 'Objek wisata yang paling sering dikunjungi oleh wisatawan Kampoeng Rawa. Nikmati banyak hal-hal menarik yang bisa kalian temukan disini.',
  sectionTitle: 'Yang Menarik di\nKampoeng Rawa',
  attractions: [
    { name: 'Kuliner', image: '/kuliner.png' },
    { name: 'Joglo Apung', image: '/jogloApung.png' },
    { name: 'Spot Foto', image: '/spot.png' }
  ],
  websiteInfo: 'Info Lebih Lanjut Kunjungi :',
  websiteUrl: 'https://kampoengrawa.com/',
  isActive: true
};

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        content: currentKampoengRawaContent,
        version: 1,
        updatedAt: new Date().toISOString(),
      },
      message: 'Kampoeng rawa content retrieved successfully'
    });
  } catch (error) {
    console.error('Get kampoeng rawa content error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { content } = body;

    console.log('Received content update:', JSON.stringify(content, null, 2));

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }

    // Update the in-memory content
    currentKampoengRawaContent = { ...currentKampoengRawaContent, ...content };

    console.log('Updated content:', JSON.stringify(currentKampoengRawaContent, null, 2));

    return NextResponse.json({
      success: true,
      data: {
        content: currentKampoengRawaContent,
        version: 2,
        updatedAt: new Date().toISOString(),
      },
      message: 'Kampoeng rawa content updated successfully'
    });
  } catch (error) {
    console.error('Update kampoeng rawa content error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
