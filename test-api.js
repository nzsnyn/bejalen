#!/usr/bin/env node

/**
 * API Testing Script
 * Run: node test-api.js
 */

const BASE_URL = 'http://localhost:3001';

const endpoints = [
  {
    name: 'Homepage API',
    url: `${BASE_URL}/api/homepage`,
    method: 'GET'
  },
  {
    name: 'Info Paket API',
    url: `${BASE_URL}/api/info-paket`,
    method: 'GET'
  },
  {
    name: 'Kampoeng Rawa API',
    url: `${BASE_URL}/api/kampoeng-rawa`,
    method: 'GET'
  },
  {
    name: 'Perahu Mesin API',
    url: `${BASE_URL}/api/perahu-mesin`,
    method: 'GET'
  },
  {
    name: 'Rawa Pening API',
    url: `${BASE_URL}/api/rawa-pening`,
    method: 'GET'
  },
  {
    name: 'Gallery API',
    url: `${BASE_URL}/api/gallery`,
    method: 'GET'
  },
  {
    name: 'Gallery API with Category',
    url: `${BASE_URL}/api/gallery?category=rawa-pening&limit=5`,
    method: 'GET'
  },
  {
    name: 'Dashboard Stats API',
    url: `${BASE_URL}/api/admin/dashboard`,
    method: 'GET'
  }
];

async function testEndpoint(endpoint) {
  try {
    console.log(`\n🧪 Testing ${endpoint.name}...`);
    console.log(`📍 ${endpoint.method} ${endpoint.url}`);
    
    const response = await fetch(endpoint.url, {
      method: endpoint.method,
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log(`✅ Success: ${data.message || 'OK'}`);
      if (data.data) {
        if (Array.isArray(data.data)) {
          console.log(`📊 Data: Array with ${data.data.length} items`);
        } else if (typeof data.data === 'object') {
          console.log(`📊 Data: Object with keys: ${Object.keys(data.data).join(', ')}`);
        }
      }
    } else {
      console.log(`❌ Failed: ${data.error || 'Unknown error'}`);
    }
    
  } catch (error) {
    console.log(`💥 Error: ${error.message}`);
  }
}

async function testContactAPI() {
  console.log(`\n🧪 Testing Contact API (POST)...`);
  try {
    const response = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        phone: '081234567890',
        subject: 'Test Message',
        message: 'This is a test message from API testing script.'
      })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log(`✅ Success: ${data.data.message}`);
    } else {
      console.log(`❌ Failed: ${data.error}`);
    }
  } catch (error) {
    console.log(`💥 Error: ${error.message}`);
  }
}

async function testBookingAPI() {
  console.log(`\n🧪 Testing Booking API (POST)...`);
  try {
    // First get available packages
    const packagesResponse = await fetch(`${BASE_URL}/api/info-paket`);
    const packagesData = await packagesResponse.json();
    
    if (packagesData.success && packagesData.data.length > 0) {
      const packageId = packagesData.data[0].id;
      
      const response = await fetch(`${BASE_URL}/api/booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: 'Test Customer',
          email: 'customer@example.com',
          phone: '081234567890',
          packageId: packageId,
          bookingDate: '2025-07-01',
          notes: 'Test booking from API testing script'
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        console.log(`✅ Success: ${data.message}`);
        console.log(`📊 Booking ID: ${data.data.id}`);
      } else {
        console.log(`❌ Failed: ${data.error}`);
      }
    } else {
      console.log(`❌ No packages available for booking test`);
    }
  } catch (error) {
    console.log(`💥 Error: ${error.message}`);
  }
}

async function runTests() {
  console.log('🚀 Starting API Tests...');
  console.log('=' * 50);
  
  // Test GET endpoints
  for (const endpoint of endpoints) {
    await testEndpoint(endpoint);
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
  }
  
  // Test POST endpoints
  await testContactAPI();
  await new Promise(resolve => setTimeout(resolve, 500));
  
  await testBookingAPI();
  
  console.log('\n🏁 API Testing completed!');
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.log('❌ This script requires Node.js 18+ with fetch support');
  console.log('Or install node-fetch: npm install node-fetch');
  process.exit(1);
}

runTests().catch(console.error);
