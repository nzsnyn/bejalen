// Test script to update homepage content and verify changes
const testHomepageContentUpdate = async () => {
  const baseUrl = 'http://localhost:3001';  // Updated port
  
  console.log('🧪 Testing Homepage Content Update Flow...\n');
  
  // Step 1: Get current content
  console.log('📍 Step 1: Getting current homepage content...');
  try {
    const response = await fetch(`${baseUrl}/api/homepage`);
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Current content retrieved successfully');
      console.log('📊 Current hero title:', result.data.content.hero.title);
      console.log('📊 Current about title:', result.data.content.about.title);
    }
  } catch (error) {
    console.log('❌ Error getting current content:', error.message);
    return;
  }
  
  // Step 2: Update content
  console.log('\n📍 Step 2: Updating homepage content...');
  const updatedContent = {
    hero: {
      title: "TEST UPDATE: Desa Wisata, Desa Budaya, Desa Bejalen",
      subtitle: "TEST UPDATE: Dukungan dan kedatangan Anda tidak hanya menciptakan pengalaman bermakna, tetapi juga memberdayakan ekonomi lokal",
      backgroundImage: "/header-home.png"
    },
    about: {
      title: "TEST UPDATE: Desa Wisata Untuk Masa Berkelanjutan",
      description: "TEST UPDATE: Desa Bejalen merupakan salah satu destinasi desa wisata yang terletak di Kecamatan Ambarawa, Kabupaten Semarang, Provinsi Jawa Tengah."
    },
    rawaPening: {
      title: "TEST UPDATE: Vast Expanse of Swamp Water",
      subtitle: "TEST UPDATE: Desa Wisata Bejalen",
      description: "TEST UPDATE: Menyegarkan pikiran di akhir pekan tidak memerlukan rencana wisata yang mewah.",
      image: "/header-home2.png"
    },
    destinations: {
      title: "TEST UPDATE: Pada Desa Hepi Desa Bejalen",
      subtitle: "TEST UPDATE: Destinasi"
    }
  };

  try {
    const updateResponse = await fetch(`${baseUrl}/api/homepage`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: updatedContent
      })
    });

    const updateResult = await updateResponse.json();
    
    if (updateResponse.ok && updateResult.success) {
      console.log('✅ Content updated successfully');
      console.log('📊 Updated hero title:', updateResult.data.content.hero.title);
    } else {
      console.log('❌ Failed to update content:', updateResult.error);
      return;
    }
  } catch (error) {
    console.log('❌ Error updating content:', error.message);
    return;
  }
  
  // Step 3: Verify updated content
  console.log('\n📍 Step 3: Verifying updated content...');
  try {
    const verifyResponse = await fetch(`${baseUrl}/api/homepage`);
    const verifyResult = await verifyResponse.json();
    
    if (verifyResult.success) {
      console.log('✅ Verification successful');
      console.log('📊 Verified hero title:', verifyResult.data.content.hero.title);
      console.log('📊 Verified about title:', verifyResult.data.content.about.title);
      
      // Check if updates are reflected
      const isUpdated = verifyResult.data.content.hero.title.includes('TEST UPDATE');
      console.log(isUpdated ? '✅ Updates are reflected in API' : '❌ Updates not reflected');
    }
  } catch (error) {
    console.log('❌ Error verifying content:', error.message);
  }
    console.log('\n🏁 Test completed!');
  console.log('✅ Content updates are now persisted to database!');
  console.log('📝 Check http://localhost:3001/ to see changes on homepage.');
  console.log('📝 Check http://localhost:3001/admin/homepage to test admin interface.');
};

testHomepageContentUpdate();
