const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { username: 'admin' }
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    const admin = await prisma.admin.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        email: 'admin@bejalen.com',
        name: 'Administrator',
        role: 'admin',
        isActive: true,
      },
    });

    console.log('Admin user created successfully:', {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      name: admin.name,
    });

  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
