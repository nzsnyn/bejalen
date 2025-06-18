# API Routes Documentation

## 📋 API Routes untuk User Biasa

### 1. Homepage API
**Endpoint:** `GET /api/homepage`

**Response:**
```json
{
  "success": true,
  "data": {
    "content": {
      "hero": { "title", "subtitle", "backgroundImage" },
      "about": { "title", "description" },
      "rawaPening": { "title", "subtitle", "description", "image" },
      "destinations": { "title", "subtitle" }
    },
    "featuredPackages": [...],
    "featuredGallery": [...],
    "stats": { "totalPackages", "totalBookings", "totalGallery" }
  }
}
```

### 2. Info Paket API
**Endpoint:** `GET /api/info-paket`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": "decimal",
      "duration": "string",
      "capacity": "number",
      "imageUrl": "string",
      "createdAt": "datetime"
    }
  ]
}
```

### 3. Kampoeng Rawa API
**Endpoint:** `GET /api/kampoeng-rawa`

**Response:**
```json
{
  "success": true,
  "data": {
    "package": { "id", "name", "description", "price", "duration", "capacity", "imageUrl" },
    "gallery": [...],
    "bookingsCount": "number",
    "pageInfo": {
      "title": "Kampoeng Rawa",
      "description": "string",
      "features": [...]
    }
  }
}
```

### 4. Perahu Mesin API
**Endpoint:** `GET /api/perahu-mesin`

**Response:**
```json
{
  "success": true,
  "data": {
    "package": { "id", "name", "description", "price", "duration", "capacity", "imageUrl" },
    "gallery": [...],
    "bookingsCount": "number",
    "pageInfo": {
      "title": "Perahu Mesin",
      "description": "string",
      "features": [...],
      "schedule": [...]
    }
  }
}
```

### 5. Rawa Pening API
**Endpoint:** `GET /api/rawa-pening`

**Response:**
```json
{
  "success": true,
  "data": {
    "package": { "id", "name", "description", "price", "duration", "capacity", "imageUrl" },
    "gallery": [...],
    "generalGallery": [...],
    "bookingsCount": "number",
    "pageInfo": {
      "title": "Rawa Pening",
      "description": "string",
      "highlights": [...],
      "attractions": [...]
    }
  }
}
```

### 6. Gallery API
**Endpoint:** `GET /api/gallery`

**Query Parameters:**
- `category` (optional): Filter by category (kampoeng-rawa, perahu-mesin, rawa-pening, general)
- `limit` (optional): Limit number of results

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "categories": [
      { "name": "string", "count": "number" }
    ],
    "total": "number"
  }
}
```

### 7. Contact API

#### GET (untuk admin)
**Endpoint:** `GET /api/contact`

#### POST (untuk user)
**Endpoint:** `POST /api/contact`

**Body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string (optional)",
  "subject": "string",
  "message": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "message": "Pesan Anda berhasil dikirim..."
  }
}
```

### 8. Booking API

#### GET (untuk admin)
**Endpoint:** `GET /api/booking`

#### POST (untuk user)
**Endpoint:** `POST /api/booking`

**Body:**
```json
{
  "customerName": "string",
  "email": "string",
  "phone": "string",
  "packageId": "string",
  "bookingDate": "date",
  "notes": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "customerName": "string",
    "package": { "name", "price", "duration" },
    "bookingDate": "date",
    "totalPrice": "decimal",
    "status": "pending"
  },
  "message": "Booking berhasil dibuat..."
}
```

## 🔐 API Routes untuk Admin

### 1. Auth Login
**Endpoint:** `POST /api/auth/login`

**Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

### 2. Dashboard Stats
**Endpoint:** `GET /api/admin/dashboard`

**Response:**
```json
{
  "totalBookings": "number",
  "totalPackages": "number", 
  "totalContacts": "number",
  "totalGalleryItems": "number",
  "pendingBookings": "number",
  "totalRevenue": "decimal",
  "recentBookings": [...]
}
```

## 🚀 Cara Menggunakan API

### Contoh Penggunaan di Frontend

#### 1. Mengambil Data Homepage
```javascript
const response = await fetch('/api/homepage');
const data = await response.json();
if (data.success) {
  // Gunakan data.data.featuredPackages, etc.
}
```

#### 2. Submit Contact Form
```javascript
const response = await fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Pertanyaan',
    message: 'Halo...'
  })
});
```

#### 3. Booking Paket Wisata
```javascript
const response = await fetch('/api/booking', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    customerName: 'Jane Doe',
    email: 'jane@example.com',
    phone: '081234567890',
    packageId: 'package-id',
    bookingDate: '2025-07-01',
    notes: 'Catatan khusus'
  })
});
```

## 📝 Error Handling

Semua API menggunakan format response yang konsisten:

**Success Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "string (optional)"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message"
}
```

## 🔧 Status Codes

- `200` - OK
- `400` - Bad Request (validation error)
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error
