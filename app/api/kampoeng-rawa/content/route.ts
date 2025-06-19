import { NextResponse } from 'next/server';

const defaultKampoengRawaContent = {
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

// GET kampoeng rawa content
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        content: defaultKampoengRawaContent,
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

// PUT - Update kampoeng rawa content
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

    return NextResponse.json({
      success: true,
      data: {
        content: { ...defaultKampoengRawaContent, ...content },
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
