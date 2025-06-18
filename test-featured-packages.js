// Test featured packages from homepage API
const testFeaturedPackages = async () => {
  try {
    console.log('🧪 Testing Featured Packages from Homepage API...');
    
    const response = await fetch('http://localhost:3001/api/homepage');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Homepage API successful');
      console.log('📦 Featured Packages:');
      
      if (result.data.featuredPackages && result.data.featuredPackages.length > 0) {
        result.data.featuredPackages.forEach((pkg, i) => {
          console.log(`  ${i+1}. ${pkg.name}`);
          console.log(`     Duration: ${pkg.duration}`);
          console.log(`     Price: Rp ${Number(pkg.price).toLocaleString('id-ID')}`);
          console.log(`     Image: ${pkg.imageUrl}`);
          console.log(`     Description: ${pkg.description}`);
          console.log('');
        });
      } else {
        console.log('  No featured packages found');
      }
      
      console.log('📊 Stats:');
      console.log(`  Total Packages: ${result.data.stats.totalPackages}`);
      console.log(`  Total Bookings: ${result.data.stats.totalBookings}`);
      console.log(`  Total Gallery: ${result.data.stats.totalGallery}`);
      
    } else {
      console.log('❌ API Error:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Test Error:', error.message);
  }
};

testFeaturedPackages();
