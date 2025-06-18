import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12);
  
  const admin = await prisma.admin.upsert({
    where: { username: process.env.ADMIN_USERNAME || 'admin' },
    update: {},
    create: {
      username: process.env.ADMIN_USERNAME || 'admin',
      password: hashedPassword,
      email: 'admin@bejalen.com',
      name: 'Administrator',
      role: 'admin',
    },
  });

  console.log('✅ Admin user created:', { username: admin.username, email: admin.email });

  // Create sample tour packages
  const packages = [
    {
      name: 'Paket Wisata Rawa Pening',
      description: 'Nikmati keindahan Rawa Pening dengan perahu tradisional dan kuliner lokal',
      price: 150000,
      duration: '1 hari',
      capacity: 20,
      imageUrl: '/rawaPeningHeader.png',
    },
    {
      name: 'Paket Kampoeng Rawa',
      description: 'Pengalaman menginap di rumah tradisional dengan aktivitas budaya',
      price: 350000,
      duration: '2 hari 1 malam',
      capacity: 15,
      imageUrl: '/kampoengRawa.png',
    },
    {
      name: 'Paket Perahu Mesin',
      description: 'Berkeliling Rawa Pening dengan perahu mesin dan menikmati pemandangan',
      price: 100000,
      duration: '4 jam',
      capacity: 25,
      imageUrl: '/perahuMesinHeader.png',
    },
  ];

  for (const pkg of packages) {
    await prisma.tourPackage.upsert({
      where: { name: pkg.name },
      update: {},
      create: pkg,
    });
  }

  console.log('✅ Tour packages created');

  // Create sample gallery items
  const galleryItems = [
    {
      title: 'Rawa Pening Morning View',
      description: 'Beautiful morning view of Rawa Pening lake',
      imageUrl: '/rawa1.png',
      category: 'rawa-pening',
    },
    {
      title: 'Traditional Boat',
      description: 'Traditional wooden boat at Rawa Pening',
      imageUrl: '/perahu.png',
      category: 'perahu-mesin',
    },
    {
      title: 'Kampoeng Rawa Village',
      description: 'Traditional village life at Kampoeng Rawa',
      imageUrl: '/kampoeng.png',
      category: 'kampoeng-rawa',
    },
  ];

  for (const item of galleryItems) {
    await prisma.gallery.upsert({
      where: { title: item.title },
      update: {},
      create: item,
    });
  }

  console.log('✅ Gallery items created');
  console.log('🎉 Seeding completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
