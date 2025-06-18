# Database Setup dengan Prisma dan Neon DB

## 📋 Setup yang Telah Dibuat

### 1. Dependencies yang Terinstall
```bash
npm install prisma @prisma/client bcryptjs @types/bcryptjs tsx
```

### 2. Database Schema (prisma/schema.prisma)
- **Admin**: Model untuk user admin dengan authentication
- **TourPackage**: Model untuk paket wisata
- **Booking**: Model untuk pemesanan wisata
- **Gallery**: Model untuk foto-foto galeri
- **Contact**: Model untuk pesan kontak

### 3. Environment Variables (.env)
```env
DATABASE_URL="postgresql://bejalen_owner:npg_zQ1VZSLEFw3A@ep-super-brook-a1saam1a-pooler.ap-southeast-1.aws.neon.tech/bejalen?sslmode=require"
NEXTAUTH_SECRET="your-nextauth-secret-here-change-this-in-production"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123"
```

### 4. Scripts NPM yang Tersedia
```json
{
  "db:migrate": "prisma migrate dev",
  "db:generate": "prisma generate", 
  "db:seed": "tsx prisma/seed.ts",
  "db:studio": "prisma studio",
  "db:reset": "prisma migrate reset"
}
```

## 🚀 Cara Menggunakan

### Migrasi Database
```bash
npm run db:migrate
```

### Generate Prisma Client
```bash
npm run db:generate
```

### Seeding Data Awal
```bash
npm run db:seed
```

### Buka Prisma Studio
```bash
npm run db:studio
```

## 📊 Data yang Dibuat dari Seeding

### Admin User
- **Username**: admin
- **Password**: admin123 (di-hash dengan bcrypt)
- **Email**: admin@bejalen.com
- **Name**: Administrator

### Tour Packages
1. **Paket Wisata Rawa Pening** - Rp 150,000
2. **Paket Kampoeng Rawa** - Rp 350,000  
3. **Paket Perahu Mesin** - Rp 100,000

### Gallery Items
- Rawa Pening Morning View
- Traditional Boat
- Kampoeng Rawa Village

## 🔐 Authentication API

### Login Endpoint
```
POST /api/auth/login
Body: { username, password }
Response: { message, user }
```

### Dashboard Stats
```
GET /api/admin/dashboard
Response: { totalBookings, totalPackages, totalContacts, etc. }
```

## 📁 File Structure
```
lib/
  prisma.ts          # Prisma client instance
prisma/
  schema.prisma      # Database schema
  seed.ts           # Seeding script
  migrations/       # Database migrations
app/
  api/
    auth/login/     # Login API
    admin/dashboard/ # Dashboard stats API
  admin/
    login/          # Login page
    dashboard/      # Dashboard page
```

## 🔧 Features yang Sudah Diimplementasi

1. **Database Authentication**: Login menggunakan data dari database
2. **Password Hashing**: Password di-hash dengan bcrypt
3. **Real Statistics**: Dashboard menampilkan data real dari database
4. **Protected Routes**: Middleware melindungi routes admin
5. **User Session**: User data disimpan di cookies setelah login

## 🔄 Migration History
1. `20250618122352_init` - Initial database schema
2. `20250618122653_add_unique_constraints` - Add unique constraints

## 📝 Todo untuk Development Selanjutnya
- [ ] Implementasi CRUD untuk Tour Packages
- [ ] Implementasi CRUD untuk Gallery
- [ ] Sistem booking untuk customer
- [ ] Email notification system
- [ ] Role-based access control
- [ ] File upload untuk images
- [ ] Dashboard analytics yang lebih detail
